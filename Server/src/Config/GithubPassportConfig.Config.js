import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
dotenv.config();
 

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_AUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:9000/api/authorize/github/callback",
      scope: ["user", "repo"], // get profile + repo access
    }, 
    (accessToken, refreshToken, profile, done) => {
      // Attach accessToken to profile for later use in controller
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
