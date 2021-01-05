const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: String,
    author: String,
    price: Number,
    old_price: Number,
    imgURL: String,
    genre: String,
    slug: { type: String, slug: "title", slugPaddingSize: 4, unique: true },
  },
  { timestamps: true }
);

bookSchema.index({ author: "text", title: "text" });

module.exports = mongoose.model("Book", bookSchema);
