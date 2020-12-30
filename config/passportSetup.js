const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const keys = require("./keys");
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ id }).then((user) => {
    done(null, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK_APP_ID,
      clientSecret: keys.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const existingUser = await User.findOne({ id: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      try {
        const newUser = await new User({
          username: profile.displayName,
          id: profile.id,
        });
        await newUser.save();
        console.log("Created new user via facebook");
        done(null, newUser);
      } catch (err) {
        console.log("Error when create user facebook oauth", err);
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ id: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      try {
        const newUser = await new User({
          username: profile.displayName,
          id: profile.id,
          thumbnail: profile._json.picture,
          email: profile._json.email,
        });
        await newUser.save();
        console.log("Created new user via google");
        done(null, newUser);
      } catch (err) {
        console.log("Error when create user google oauth", err);
        return done(err);
      }
    }
  )
);
