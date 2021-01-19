const router = require("express").Router();
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

const Avatar = require("../../models/Avatar");
const User = require("../../models/User");
const Book = require("../../models/Book");
const keys = require("../../config/keys");
const { setCookie } = require("../../helpers/authHelper");

router.post("/upload", async (req, res) => {
  if (!req.files) {
    return res.status(400).json("Please choose file");
  }
  try {
    console.log(req.files.file);
    let { name, data } = req.files.file;
    name = Date.now() + name;
    data = data.toString("base64");
    data = Buffer.from(data, "base64");
    const { usersession } = req.signedCookies;
    const { _id } = jwt.verify(usersession, keys.JWT_Secret);
    const filter = { owner: _id };
    const update = { name, data };
    await Avatar.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    const path = keys.CLIENT_URL + `/api/avatar/${name}`;
    await User.findByIdAndUpdate(_id, { thumbnail: path });
    return res.json("Image uploaded");
  } catch (err) {
    console.log(err, "Error upload image");
    return res.status(400).json("Can't upload image, please try again");
  }
});

router.get("/avatar/:name", async (req, res) => {
  const { name } = req.params;
  const image = await Avatar.findOne({ name });
  if (!image) {
    return res.send("Image doesn't exist");
  }
  res.contentType("image/*");
  res.send(image.data);
});

router.post("/purchase", async (req, res) => {
  try {
    const { usersession } = req.signedCookies;
    const { id, amount } = req.body;
    if (!usersession) {
      let { cart } = req.signedCookies;
      if (cart) {
        cart = JSON.parse(cart);
        const index = cart.findIndex((e) => e._id === id);
        if (index === -1) {
          const { title, price, old_price, imgURL } = await Book.findById(id);
          cart.push({
            _id: id,
            total: amount,
            title,
            price,
            old_price,
            imgURL,
          });
          setCookie(res, "cart", JSON.stringify(cart), 15);
          return res.json(cart);
        } else {
          cart[index].total += amount;
          setCookie(res, "cart", JSON.stringify(cart), 15);
          return res.json(cart);
        }
      } else {
        const { title, price, old_price, imgURL } = await Book.findById(id);
        cart = [{ _id: id, total: amount, title, price, old_price, imgURL }];
        setCookie(res, "cart", JSON.stringify(cart), 15);
        return res.json(cart);
      }
    }
    const { _id } = jwt.verify(usersession, keys.JWT_Secret);
    const existingProduct = await User.findOne({ _id, "cart._id": id });
    let user;
    if (existingProduct) {
      user = await User.findOneAndUpdate(
        { _id, "cart._id": id },
        { $inc: { "cart.$.total": amount } },
        { new: true }
      );
    } else {
      const { title, price, old_price, imgURL } = await Book.findById(id);
      user = await User.findByIdAndUpdate(
        { _id },
        {
          $push: {
            cart: { _id: id, total: amount, title, price, old_price, imgURL },
          },
        },
        { new: true }
      );
    }
    return res.json(user.cart);
  } catch (err) {
    console.log(err, "error line 104 user.js");
    res.clearCookie("usersession");
    res.clearCookie("refreshToken");
    return res.status(401).json("Can't purchase goods now, please re-login");
  }
});

router.post("/updateCart", async (req, res) => {
  try {
    const { id, amount } = req.body;
    const { usersession } = req.signedCookies;
    if (!usersession) {
      let { cart } = req.signedCookies;
      cart = JSON.parse(cart);
      const index = cart.findIndex((e) => e._id === id);
      cart[index].total = amount;
      setCookie(res, "cart", JSON.stringify(cart), 15);
      return res.json(cart);
    }
    const { _id } = jwt.verify(usersession, keys.JWT_Secret);
    const user = await User.findOneAndUpdate(
      { _id, "cart._id": id },
      { $set: { "cart.$.total": parseInt(amount) } },
      { new: true }
    );
    return res.json(user.cart);
  } catch (err) {
    console.log(err, "line 127 user.js");
  }
});

router.delete("/deleteCart", async (req, res) => {
  try {
    const { id } = req.body;
    const { usersession } = req.signedCookies;
    if (!usersession) {
      let { cart } = req.signedCookies;
      cart = JSON.parse(cart);
      cart = cart.filter((item) => item._id !== id);
      setCookie(res, "cart", JSON.stringify(cart), 15);
      return res.json(cart);
    }
    const { _id } = jwt.verify(usersession, keys.JWT_Secret);
    const user = await User.findByIdAndUpdate(
      _id,
      { $pull: { cart: { _id: id } } },
      { new: true }
    );
    return res.json(user.cart);
  } catch (err) {
    console.log(err, "deleteCart func user.js");
    res.json(err.response.data);
  }
});

module.exports = router;
