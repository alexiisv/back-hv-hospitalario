const express = require("express");
const router = express.Router();

const {
  generarPdfEquipo,
  generarZipPdfEse,
  generarZipPreventivosEse,
  previewEquipoHtml,
} = require("../controllers/pdfController");


router.get("/equipo/:id", generarPdfEquipo);
router.get("/ese/:eseId/todos", generarZipPdfEse);
router.get("/ese/:eseId/preventivos", generarZipPreventivosEse);
router.get("/preview/equipo/:id", previewEquipoHtml);

module.exports = router;

