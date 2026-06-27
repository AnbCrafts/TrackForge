import User from "../Models/User.Models.js";
import crypto from "crypto";
import { generateToken } from "../Utility/Token.Utility.js";
import { getHashSecret } from "../Utility/SecureHash.Utility.js";
import axios from 'axios'
// import User from "../Models/User.Models.js";

export const githubCallback = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "GitHub authentication failed",
    });
  }

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email: req.user.emails[0].value });

    // If user doesn't exist → create
    if (!existingUser) {
      const username = req.user.username?.toLowerCase().replace(/[^a-z0-9]/g, "");

      existingUser = new User({
        firstName: req.user.displayName?.split(" ")[0] || "NoFirstName",
        lastName: req.user.displayName?.split(" ")[1] || "NoLastName",
        email: req.user.emails[0].value,
        username: username || `user${Date.now()}`,
        picture: req.user.photos?.[0]?.value || "",
        role: "Member",
        oauthProvider: "github",
        githubAccessToken: req.user.accessToken, // store GitHub token
      });
    } else {
      existingUser.githubAccessToken = req.user.accessToken; // update token if relogin
    }

    // Generate token, secure hash, and login time
    const token = generateToken(existingUser._id);
    const loginTime = Date.now();
    const secret = getHashSecret(loginTime.toString().slice(-4));
    const payload = existingUser._id.toString() + loginTime + secret;
    const secureHash = crypto.createHash("sha256").update(payload).digest("hex");

    // Save the user
    await existingUser.save();

    // Build user object (same structure as Google)
    const user = {
      id: existingUser._id,
      name: existingUser.firstName + " " + existingUser.lastName,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
      picture: existingUser.picture || "",
      oauthProvider: "github",
    };

    // Redirect URL (with query params)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const redirectUrl =
      `${clientUrl}/auth/${secureHash}/${user.username}/workspace` +
      `?token=${token}&userId=${user.id}&username=${user.username}&email=${user.email}`;

    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("GitHub OAuth Callback Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during GitHub OAuth",
      error: err.message,
    });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.redirect("/");
  });
};



export const getGithubRepo = async (req, res) => {
  try {
    const {userId} = req.params; // or from your auth middleware
    const user = await User.findById(userId);
    if (!user || !user.githubAccessToken)
      return res.status(400).json({ success: false, message: "No GitHub token found" });

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `token ${user.githubAccessToken}` },
    });

    return res.status(200).json({ success: true, repos: response.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch repos" });
  }
};

export const startGithubLink = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  const serverUrl = process.env.SERVER_URL || "http://localhost:9000";
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_AUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(serverUrl + "/api/authorize/github/link/callback")}&scope=user:email,repo&state=${userId}`;
  
  return res.redirect(redirectUrl);
};

export const githubLinkCallback = async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).json({ success: false, message: "Invalid GitHub OAuth response" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_AUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        code,
        redirect_uri: (process.env.SERVER_URL || "http://localhost:9000") + "/api/authorize/github/link/callback",
        state,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ success: false, message: "Failed to get GitHub token" });
    }

    const profileResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const githubProfile = profileResponse.data;

    const user = await User.findById(state);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // <-- Paste this check here
    if (user.githubUsername && user.githubUsername !== githubProfile.login) {
      return res.status(400).json({
        success: false,
        message: "GitHub account already linked. Please unlink first to link a different account."
      });
    }

    user.githubAccessToken = accessToken;
    user.githubUsername = githubProfile.login;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/settings?githubLinked=true`);
  } catch (err) {
    console.error("GitHub Linking Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to link GitHub",
      error: err.message,
    });
  }
};

// DELETE /api/user/github/unlink/:userId
 

