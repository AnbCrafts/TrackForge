import express from "express";
import { googleCallback,logout } from "../Controllers/GoogleOAuth.Controllers.js";
import passport from '../Config/PassportConfig.Config.js'

const GoogleOAuthRouter = express.Router();


GoogleOAuthRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


GoogleOAuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

// Logout
GoogleOAuthRouter.get("/logout", logout);

export default GoogleOAuthRouter;
