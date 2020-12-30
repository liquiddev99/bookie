const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { authSignup } = require("../../middleware/auth");
const keys = require("../../config/keys");

// OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log(req.user, "user");
  const { email, username } = req.user;
  const token = jwt.sign({ username, email }, keys.JWT_Secret, {
    expiresIn: "1d",
  });
  res.cookie("usersession", token, { maxAge: 24 * 60 * 60 * 1000 });
  res.redirect("/");
});

router.get("/facebook", passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    const { username } = req.user;
    const token = jwt.sign({ username }, keys.JWT_Secret, {
      expiresIn: "1d",
    });
    res.cookie("usersession", token, { maxAge: 24 * 60 * 60 * 1000 });
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("usersession");
  console.log("logged out");
  res.redirect("/");
});

router.get("/user", (req, res) => {
  const user = req.user;
  if (user) {
    return res.json(user);
  }
  return res.status(404).json("Cannot find any user");
});

// Common Login, Signup
router.post("/signup", authSignup, async (req, res) => {
  const user = req.body;
  const newUser = await new User(user);
  await newUser.save();
  const { username, email } = newUser;
  const token = jwt.sign({ username, email }, keys.JWT_Secret, {
    expiresIn: "1d",
  });
  res.cookie("usersession", token, { maxAge: 24 * 60 * 60 * 1000 });
  return res.json(token);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const { username } = user;
    const token = jwt.sign({ username, email }, keys.JWT_Secret, {
      expiresIn: "1000",
    });
    res.cookie("usersession", token, {
      // signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      // httpOnly: true,
    });
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
