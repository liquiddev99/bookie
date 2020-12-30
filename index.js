const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const keys = require("./config/keys");
const PORT = process.env.PORT || 5000;
const passportSetup = require("./config/passportSetup");

const books = require("./routes/api/books");
const book = require("./routes/api/book");
const auth = require("./routes/auth/auth");

app.use(express.json());
// app.use(
//   cookieSession({
//     name: "session",
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.SESSION.cookieKey],
//   })
// );
app.use(cookieParser(keys.cookieKey));
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(keys.DBURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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
app.use("/auth", auth);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
