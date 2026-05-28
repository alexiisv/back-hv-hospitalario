const express = require("express");
const router = express.Router();

const {
  obtenerPlantillas,
  obtenerPlantillaPorId,
  crearPlantilla,
  actualizarPlantilla,
  eliminarPlantilla,
  crearActividadPlantilla,
  actualizarActividadPlantilla,
  eliminarActividadPlantilla,
  crearRecomendacionPlantilla,
  actualizarRecomendacionPlantilla,
  eliminarRecomendacionPlantilla,
  aplicarPlantillaACatalogo,
} = require("../controllers/plantillaController");

router.get("/", obtenerPlantillas);
router.get("/:id", obtenerPlantillaPorId);
router.post("/", crearPlantilla);
router.put("/:id", actualizarPlantilla);
router.delete("/:id", eliminarPlantilla);

router.post("/:id/actividades", crearActividadPlantilla);
router.put("/actividades/:actividadId", actualizarActividadPlantilla);
router.delete("/actividades/:actividadId", eliminarActividadPlantilla);

router.post("/:id/recomendaciones", crearRecomendacionPlantilla);
router.put("/recomendaciones/:recomendacionId", actualizarRecomendacionPlantilla);
router.delete("/recomendaciones/:recomendacionId", eliminarRecomendacionPlantilla);

router.post("/:plantillaId/aplicar/:catalogoId", aplicarPlantillaACatalogo);

module.exports = router;