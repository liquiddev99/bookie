const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const keys = require("./keys");

const storage = new GridFsStorage({
  url: keys.DBURL,
  file: (req, file) => {},
});

const upload = multer({ storage });

module.exports = upload;
