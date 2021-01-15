const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../../models/User");
const { authSignup } = require("../../middleware/auth");
const keys = require("../../config/keys");
const {
  verifyRefreshToken,
  setCookie,
  generateJWT,
} = require("../../helpers/authHelper");

// OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google"),
  async (req, res) => {
    const { email, username, thumbnail, _id } = req.user;
    let cartCookie = req.signedCookies.cart;
    if (cartCookie) {
      cartCookie = JSON.parse(cartCookie);
      await User.updateOne({ _id }, { $push: { cart: { $each: cartCookie } } });
      res.clearCookie("cart");
    }
    const token = generateJWT(
      { _id, username, email, thumbnail },
      keys.JWT_Secret,
      "1d"
    );
    const refreshToken = jwt.sign({ _id }, keys.REFRESH_TOKEN, {
      expiresIn: "1y",
    });
    setCookie(res, "usersession", token, 1);
    setCookie(res, "refreshToken", refreshToken, 365);
    res.redirect("/");
  }
);

router.get("/facebook", passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  async (req, res) => {
    const { username, email, thumbnail, _id } = req.user;
    let cartCookie = req.signedCookies.cart;
    if (cartCookie) {
      cartCookie = JSON.parse(cartCookie);
      await User.updateOne({ _id }, { $push: { cart: { $each: cartCookie } } });
      res.clearCookie("cart");
    }
    const token = generateJWT(
      { username, email, thumbnail, _id },
      keys.JWT_Secret,
      "1d"
    );
    const refreshToken = generateJWT({ _id }, keys.REFRESH_TOKEN, "1y");
    setCookie(res, "usersession", token, 1);
    setCookie(res, "refreshToken", refreshToken, 365);
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("usersession");
  res.clearCookie("refreshToken");
  res.redirect("/");
});

router.get("/user", async (req, res) => {
  try {
    const { usersession } = req.signedCookies;
    if (!usersession) {
      let cart = req.signedCookies.cart || "[]";
      cart = JSON.parse(cart);
      return res.json({ cart, isLoggedIn: false });
    }
    const { _id } = jwt.verify(usersession, keys.JWT_Secret);
    const { username, email, thumbnail, cart } = await User.findById(_id);
    return res.json({
      username,
      email,
      thumbnail,
      cart,
      isLoggedIn: true,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      try {
        const { refreshToken } = req.signedCookies;
        const _id = await verifyRefreshToken(refreshToken, keys.REFRESH_TOKEN);
        console.log("Create new accessToken");
        const { username, email, thumbnail, cart } = await User.findById(_id);
        const userData = {
          _id,
          username,
          email,
          thumbnail: thumbnail || "",
        };
        const token = generateJWT(userData, keys.JWT_Secret, "1d");
        setCookie(res, "usersession", token, 1);
        return res.json({
          username,
          email,
          thumbnail,
          cart,
          isLoggedIn: true,
        });
      } catch (err) {
        res.clearCookie("usersession");
        res.clearCookie("refreshToken");
        return res.status(400).json("");
      }
    }
    res.clearCookie("usersession");
    res.clearCookie("refreshToken");
    return res
      .status(401)
      .json("Some thing went wrong with your credentials, please re-login");
  }
});

// Common Login, Signup
router.post("/signup", authSignup, async (req, res) => {
  const userData = req.body;
  const { email } = userData;
  const token = jwt.sign(userData, keys.JWT_Secret, {
    expiresIn: "1h",
  });
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: keys.SENDER,
      pass: keys.PASSWORD,
    },
  });
  const mailOptions = {
    from: keys.SENDER,
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
      return res.status(400).json(`Error when send email to ${email}`);
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
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const { username, thumbnail, _id } = user;
    const userData = {
      _id,
      username,
      email,
      thumbnail: thumbnail || "",
    };
    let cartCookie = req.signedCookies.cart;
    if (cartCookie) {
      cartCookie = JSON.parse(cartCookie);
      await User.updateOne({ _id }, { $push: { cart: { $each: cartCookie } } });
      res.clearCookie("cart");
    }
    const token = generateJWT(userData, keys.JWT_Secret, "1d");
    const refreshToken = generateJWT({ _id }, keys.REFRESH_TOKEN, "1y");
    setCookie(res, "usersession", token, 1);
    setCookie(res, "refreshToken", refreshToken, 365);
    res.json(userData);
  } catch (err) {
    console.log(err, "line 249 auth.js");
    res.status(400).json(err);
  }
});

module.exports = router;
