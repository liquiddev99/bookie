const mongoose = require("mongoose");
const { Schema } = mongoose;

const avatarSchema = new Schema({
  data: { type: Buffer, required: true },
  owner: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  name: { type: String, required: true },
});

module.exports = mongoose.model("avatar", avatarSchema);
