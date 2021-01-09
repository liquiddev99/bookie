const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");

const keys = require("./config/keys");
const PORT = process.env.PORT || 5000;
const passportSetup = require("./config/passportSetup");

const books = require("./routes/api/books");
const book = require("./routes/api/book");
const auth = require("./routes/auth/auth");
const user = require("./routes/api/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(keys.cookieKey));
app.use(passport.initialize());
app.use(passport.session());
app.use(upload());

mongoose
  .connect(keys.DBURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error when connect to DB", err);
  });

app.use("/api/books", books);
app.use("/api/book", book);
app.use("/api", user);
app.use("/auth", auth);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
