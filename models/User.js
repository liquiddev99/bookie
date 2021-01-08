const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    id: String,
    thumbnail: String,
    email: { type: String, unique: true },
    password: String,
    cart: { type: Array, default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } else {
    next();
  }
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    if (!user.password) {
      throw "This email has been used to google or facebook login";
    }
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw "Incorrect password";
  }
  throw "Incorrect email";
};

module.exports = mongoose.model("user", userSchema);
