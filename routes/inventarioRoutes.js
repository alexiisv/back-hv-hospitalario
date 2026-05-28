const express = require("express");
const router = express.Router();

const {
  obtenerInventario,
  obtenerInventarioPorId,
  crearInventario,
} = require("../controllers/inventarioController");

router.get("/", obtenerInventario);
router.get("/:id", obtenerInventarioPorId);
router.post("/", crearInventario);

module.exports = router;