const express = require("express");
const router = express.Router();
const Book = require("../../models/Book");

router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res
        .status(404)
        .json({ error: "Sorry, book you search seem don't exists!" });
    });
});

module.exports = router;
