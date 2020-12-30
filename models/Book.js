const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: String,
    author: String,
    price: Number,
    old_price: Number,
    imgURL: String,
    genre: String,
  },
  { timestamps: true }
);

bookSchema.index({ author: "text", title: "text" });

module.exports = mongoose.model("Book", bookSchema);
