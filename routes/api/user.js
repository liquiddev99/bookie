const router = require("express").Router();
const jwt = require("jsonwebtoken");

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
    const token = req.cookies.usersession;
    const { _id } = jwt.verify(token, keys.JWT_Secret);
    const filter = { owner: _id };
    const update = { name, data };
    await Avatar.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    const path = keys.CLIENT_URL + `/api/avatar/${name}`;
    await User.findByIdAndUpdate(_id, { thumbnail: path });
    return res.json("uploaded");
  } catch (err) {
    console.log(err, "Error upload image");
    return res.json("Can't upload image, please try again");
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

module.exports = router;
