const express = require("express");
const router = express.Router();

const uploadExcel = require("../middlewares/excelMiddleware");
const { validarImportacion, guardarImportacion } = require("../controllers/importacionController");

router.post("/validar", uploadExcel.single("archivo"), validarImportacion);
router.post("/guardar", guardarImportacion);

module.exports = router;