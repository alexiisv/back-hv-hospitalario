const express = require("express");
const router = express.Router();

const {
  obtenerCatalogo,
  obtenerCatalogoPorId,
  crearCatalogo,
  actualizarCatalogo,
  eliminarCatalogo,
  obtenerActividadesCatalogo,
  obtenerRecomendacionesCatalogo,
  obtenerCatalogoCompleto,
  crearActividadCatalogo,
  actualizarActividadCatalogo,
  eliminarActividadCatalogo,
  crearRecomendacionCatalogo,
  actualizarRecomendacionCatalogo,
  eliminarRecomendacionCatalogo,
} = require("../controllers/catalogoController");

router.get("/", obtenerCatalogo);
router.get("/completo/:id", obtenerCatalogoCompleto);
router.get("/:id/actividades", obtenerActividadesCatalogo);
router.get("/:id/recomendaciones", obtenerRecomendacionesCatalogo);
router.get("/:id", obtenerCatalogoPorId);
router.post("/", crearCatalogo);
router.put("/:id", actualizarCatalogo);
router.delete("/:id", eliminarCatalogo);

router.post("/:id/actividades", crearActividadCatalogo);
router.put("/actividades/:actividadId", actualizarActividadCatalogo);
router.delete("/actividades/:actividadId", eliminarActividadCatalogo);

router.post("/:id/recomendaciones", crearRecomendacionCatalogo);
router.put("/recomendaciones/:recomendacionId", actualizarRecomendacionCatalogo);
router.delete("/recomendaciones/:recomendacionId", eliminarRecomendacionCatalogo);

module.exports = router;