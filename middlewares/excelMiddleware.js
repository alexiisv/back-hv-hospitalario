const multer = require("multer");

const uploadExcel = multer({
  dest: "uploads/excel/",
});

module.exports = uploadExcel;