import express from "express";
import { getGithubRepo, githubCallback, githubLinkCallback, logout, startGithubLink } from "../Controllers/GithubAuth.Controllers.js";
import passport from '../Config/GithubPassportConfig.Config.js'
  
const GithubOAuthRouter = express.Router();

// Start GitHub login
GithubOAuthRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "repo"] })
);

// GitHub callback
GithubOAuthRouter.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
); 

// Logout (reuse same controller)
GithubOAuthRouter.get("/logout", logout);
GithubOAuthRouter.get("/github-repo/:userId", getGithubRepo);
// GithubOAuthRouter.get("/github/link/:userId", LinkGithub);

GithubOAuthRouter.get("/github/link/:userId", startGithubLink);

// Step 2: Callback from GitHub
GithubOAuthRouter.get("/github/link/callback", githubLinkCallback);
export default GithubOAuthRouter;
