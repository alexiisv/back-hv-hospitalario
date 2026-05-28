const express = require("express");
const router = express.Router();

const {
  obtenerEses,
  obtenerEsePorId,
  obtenerInventarioPorEse,
  crearEse,
  actualizarEse,
  eliminarEse,
} = require("../controllers/eseController");

router.get("/", obtenerEses);
router.get("/:id/inventario", obtenerInventarioPorEse);
router.get("/:id", obtenerEsePorId);
router.post("/", crearEse);
router.put("/:id", actualizarEse);
router.delete("/:id", eliminarEse);

module.exports = router;