const router = require("express").Router();
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

const Avatar = require("../../models/Avatar");
const User = require("../../models/User");
const keys = require("../../config/keys");

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
    const { authorization } = req.headers;
    const { id, amount } = req.body;
    const token = authorization.split(" ")[1];
    const { _id } = jwt.verify(token, keys.JWT_Secret);
    await User.updateOne({ _id }, { $push: { cart: { id, amount } } });
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
    return res.json(shoppingCart);
  } catch (err) {
    return res.status(401).json("Can't purchase goods now, please re-login");
  }
});

module.exports = router;
