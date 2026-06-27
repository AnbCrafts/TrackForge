import User from "../Models/User.Models.js";
import crypto from "crypto";
import { generateToken } from "../Utility/Token.Utility.js";
import { getHashSecret } from "../Utility/SecureHash.Utility.js";

export const googleCallback = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email: req.user.emails[0].value });

    // If user doesn't exist → create
    if (!existingUser) {
      // Sanitize username: only lowercase letters and numbers
      const username = req.user.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      existingUser = new User({
        firstName: req.user.name.givenName || "NoFirstName",
        lastName: req.user.name.familyName || "NoLastName",
        email: req.user.emails[0].value,
        username: username || `user${Date.now()}`,
        picture: req.user.photos[0]?.value || "",
        role: "Member",
        oauthProvider: "google", // important to bypass password requirement
      });
    }

    // Generate token, secure hash, and login time
    const token = generateToken(existingUser._id);
    const loginTime = Date.now();
    const secret = getHashSecret(loginTime.toString().slice(-4));
    const payload = existingUser._id.toString() + loginTime + secret;
    const secureHash = crypto.createHash("sha256").update(payload).digest("hex");

    // Save the user
    await existingUser.save();

    // Build user object (same structure as your normal login flow)
    const user = {
      id: existingUser._id,
      name: existingUser.firstName + " " + existingUser.lastName,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
      picture: existingUser.picture || "",
      oauthProvider: "google",
    };

    // Redirect URL for frontend
    // Redirect URL for frontend (with query params)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const redirectUrl = `${clientUrl}/auth/${secureHash}/${user.username}/workspace` +
      `?token=${token}&userId=${user.id}&username=${user.username}&email=${user.email}`;

    // Send response
    // return res.status(200).json({
    //   success: true,
    //   message: "User logged in with Google successfully",
    //   user,
    //   token,
    //   secureHash,
    //   loginTime,
    //   redirectUrl,
    // });

    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("Google OAuth Callback Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during Google OAuth",
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
 