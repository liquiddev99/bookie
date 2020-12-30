const express = require("express");
const router = express.Router();
const Book = require("../../models/Book");

router.get("/genre/:genre", async (req, res) => {
  let { limit, p } = req.query;
  limit = limit || 25;
  let genre = req.params.genre;
  try {
    const numbers = await Book.countDocuments({ genre });
    const books = await Book.find({ genre })
      .skip((p - 1) * limit)
      .limit(parseInt(limit));
    if (!books.length) {
      return res
        .status(404)
        .json({ error: "Genre of book you search seem don't exists!" });
    }
    return res.json({ books, numbers });
  } catch (err) {
    console.log("error server when query data from mongodb");
    return res.status(500).json({ error: "Error server" });
  }
});

router.get("/search/:q", async (req, res) => {
  let { q } = req.params;
  const searchedBooks = await Book.find({
    $text: { $search: `\"${q}\"` },
  }).limit(7);
  return res.json({ searchedBooks });
});

router.get("/query/:queryStr", async (req, res) => {
  let { limit, p } = req.query;
  limit = limit || 25;
  p = p || 1;
  let { queryStr } = req.params;
  // await Book.syncIndexes();
  const queriedBooks = await Book.find({
    $text: { $search: `\"${queryStr}\"` },
  })
    .skip((p - 1) * limit)
    .limit(parseInt(limit));
  if (!queriedBooks.length) {
    return res.status(404).json({ error: "Cannot find result" });
  }
  const numbersQuery = await Book.countDocuments({
    $text: { $search: `\"${queryStr}\"` },
  });
  return res.json({ queriedBooks, numbersQuery });
});

module.exports = router;
