const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const { subirImagen } = require("../controllers/uploadController");

router.post("/", upload.single("imagen"), subirImagen);

module.exports = router;