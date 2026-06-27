import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,   
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: (process.env.SERVER_URL || "http://localhost:9000") + "/api/authorize/google/callback",
  },
  (accessToken, refreshToken, profile, done) => {
  
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;