const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
  const userData = req.body;
  const { email } = userData;
  const token = jwt.sign(userData, keys.JWT_Secret, {
    expiresIn: "1h",
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tranngocthang.bkdn@gmail.com",
      pass: "tranngocthang",
    },
  });

  const mailOptions = {
    from: "tranngocthang.bkdn@gmail.com",
    to: `${email}`,
    subject: "Bookie - Activate your account",
    html: `
      <h3>Please follow link to active your account</h3>
      <p>${keys.CLIENT_URL}/auth/activate/${token}</p>
      <hr/>
    `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res
        .status(400)
        .json(
          `Error when send email to ${email}, please check your email and try again`
        );
    } else {
      console.log("Email sent: " + info.response);
      return res.json(`Email has been sent to ${email}`);
    }
  });
});

router.get("/activate/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, keys.JWT_Secret);
    const { email } = decoded;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send(
        "Your email has been taken, please use other email to signup"
      );
    }
    const newUser = await new User(decoded);
    await newUser.save();
    return res.send(
      "Your account has been activated, please login to use our service, thank you"
    );
  } catch (err) {
    res.status(400).send("Your link has been expired, please signup again");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const { username } = user;
    const token = jwt.sign({ username, email }, keys.JWT_Secret, {
      expiresIn: "1d",
    });
    res.cookie("usersession", token, { maxAge: 24 * 60 * 60 * 1000 });
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
