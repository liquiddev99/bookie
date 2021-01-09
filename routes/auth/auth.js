const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ObjectId = require("mongoose").Types.ObjectId;

const User = require("../../models/User");
const { authSignup } = require("../../middleware/auth");
const keys = require("../../config/keys");

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
    const token = jwt.sign(
      { username, email, thumbnail, _id },
      keys.JWT_Secret,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("usersession", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: true,
      httpOnly: true,
    });
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
    const token = jwt.sign(
      { username, email, thumbnail, _id },
      keys.JWT_Secret,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("usersession", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
    });
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("usersession");
  res.redirect("/");
});

router.get("/user", async (req, res) => {
  try {
    const { usersession } = req.signedCookies;
    if (!usersession) {
      let cart = req.signedCookies.cart || "[]";
      cart = JSON.parse(cart);
      return res.json({ shoppingCart: cart, isLoggedIn: false });
    }
    const { _id } = jwt.verify(usersession, keys.JWT_Secret);
    const { username, email, thumbnail } = await User.findById(_id);
    const shoppingCart = await User.aggregate([
      {
        $match: { _id: ObjectId(_id) },
      },
      { $project: { cart: 1, _id: 0 } },
      { $unwind: "$cart" },
      {
        $group: {
          _id: "$cart.id",
          total: { $sum: "$cart.amount" },
        },
      },
    ]);
    res.json({ username, email, thumbnail, shoppingCart, isLoggedIn: true });
  } catch (err) {
    console.log(err);
    if (err.message === "jwt expired") {
      res.clearCookie("usersession");
      return res
        .status(400)
        .json("You have reached the end of your session, please re-login");
    }
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
    const token = jwt.sign(userData, keys.JWT_Secret, {
      expiresIn: "7d",
    });
    res.cookie("usersession", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
    });
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
