const pool = require("../db");

// =====================
// PLANTILLAS
// =====================

const obtenerPlantillas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM plantillas_mantenimiento
      ORDER BY nombre ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener plantillas:", error);
    res.status(500).json({ error: "Error al obtener plantillas" });
  }
};

const obtenerPlantillaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const plantillaResult = await pool.query(
      `SELECT * FROM plantillas_mantenimiento WHERE id = $1`,
      [id]
    );

    if (plantillaResult.rows.length === 0) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    const actividadesResult = await pool.query(
      `
      SELECT *
      FROM plantillas_actividades
      WHERE plantilla_id = $1
      ORDER BY numero_actividad ASC
      `,
      [id]
    );

    const recomendacionesResult = await pool.query(
      `
      SELECT *
      FROM plantillas_recomendaciones
      WHERE plantilla_id = $1
      ORDER BY numero_recomendacion ASC
      `,
      [id]
    );

    res.json({
      plantilla: plantillaResult.rows[0],
      actividades: actividadesResult.rows,
      recomendaciones: recomendacionesResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener plantilla:", error);
    res.status(500).json({ error: "Error al obtener plantilla" });
  }
};

const crearPlantilla = async (req, res) => {
  try {
    const { nombre, tipo_equipo, descripcion } = req.body;

    const result = await pool.query(
      `
      INSERT INTO plantillas_mantenimiento (
        nombre, tipo_equipo, descripcion
      ) VALUES ($1, $2, $3)
      RETURNING *
      `,
      [nombre, tipo_equipo || null, descripcion || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear plantilla:", error);
    res.status(500).json({ error: "Error al crear plantilla" });
  }
};

const actualizarPlantilla = async (req, res) => {
  const { id } = req.params;

  try {
    const { nombre, tipo_equipo, descripcion } = req.body;

    const result = await pool.query(
      `
      UPDATE plantillas_mantenimiento
      SET nombre = $1,
          tipo_equipo = $2,
          descripcion = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [nombre, tipo_equipo || null, descripcion || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar plantilla:", error);
    res.status(500).json({ error: "Error al actualizar plantilla" });
  }
};

const eliminarPlantilla = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM plantillas_mantenimiento WHERE id = $1`, [id]);

    res.json({ mensaje: "Plantilla eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar plantilla:", error);
    res.status(500).json({ error: "Error al eliminar plantilla" });
  }
};

// =====================
// ACTIVIDADES PLANTILLA
// =====================

const crearActividadPlantilla = async (req, res) => {
  const { id } = req.params;
  const { numero_actividad, actividad } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO plantillas_actividades (
        plantilla_id, numero_actividad, actividad
      ) VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id, numero_actividad, actividad]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear actividad de plantilla:", error);
    res.status(500).json({ error: "Error al crear actividad" });
  }
};

const actualizarActividadPlantilla = async (req, res) => {
  const { actividadId } = req.params;
  const { numero_actividad, actividad } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE plantillas_actividades
      SET numero_actividad = $1,
          actividad = $2
      WHERE id = $3
      RETURNING *
      `,
      [numero_actividad, actividad, actividadId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar actividad de plantilla:", error);
    res.status(500).json({ error: "Error al actualizar actividad" });
  }
};

const eliminarActividadPlantilla = async (req, res) => {
  const { actividadId } = req.params;

  try {
    await pool.query(
      `DELETE FROM plantillas_actividades WHERE id = $1`,
      [actividadId]
    );

    res.json({ mensaje: "Actividad eliminada" });
  } catch (error) {
    console.error("Error al eliminar actividad de plantilla:", error);
    res.status(500).json({ error: "Error al eliminar actividad" });
  }
};

// =====================
// RECOMENDACIONES PLANTILLA
// =====================

const crearRecomendacionPlantilla = async (req, res) => {
  const { id } = req.params;
  const { numero_recomendacion, recomendacion } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO plantillas_recomendaciones (
        plantilla_id, numero_recomendacion, recomendacion
      ) VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id, numero_recomendacion, recomendacion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear recomendación de plantilla:", error);
    res.status(500).json({ error: "Error al crear recomendación" });
  }
};

const actualizarRecomendacionPlantilla = async (req, res) => {
  const { recomendacionId } = req.params;
  const { numero_recomendacion, recomendacion } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE plantillas_recomendaciones
      SET numero_recomendacion = $1,
          recomendacion = $2
      WHERE id = $3
      RETURNING *
      `,
      [numero_recomendacion, recomendacion, recomendacionId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar recomendación de plantilla:", error);
    res.status(500).json({ error: "Error al actualizar recomendación" });
  }
};

const eliminarRecomendacionPlantilla = async (req, res) => {
  const { recomendacionId } = req.params;

  try {
    await pool.query(
      `DELETE FROM plantillas_recomendaciones WHERE id = $1`,
      [recomendacionId]
    );

    res.json({ mensaje: "Recomendación eliminada" });
  } catch (error) {
    console.error("Error al eliminar recomendación de plantilla:", error);
    res.status(500).json({ error: "Error al eliminar recomendación" });
  }
};

// =====================
// APLICAR PLANTILLA A CATÁLOGO
// =====================

const aplicarPlantillaACatalogo = async (req, res) => {
   const { plantillaId, catalogoId } = req.params;
   const reemplazar = req.query.reemplazar === "true";

  try {
     if (reemplazar) {
      await pool.query(
        `DELETE FROM actividades_catalogo WHERE catalogo_id = $1`,
        [catalogoId]
      );

      await pool.query(
        `DELETE FROM recomendaciones_catalogo WHERE catalogo_id = $1`,
        [catalogoId]
      );
    }
    await pool.query(
      `
      INSERT INTO actividades_catalogo (
        catalogo_id, numero_actividad, actividad
      )
      SELECT 
        $1,
        pa.numero_actividad,
        pa.actividad
      FROM plantillas_actividades pa
      WHERE pa.plantilla_id = $2
      AND NOT EXISTS (
        SELECT 1
        FROM actividades_catalogo ac
        WHERE ac.catalogo_id = $1
        AND ac.numero_actividad = pa.numero_actividad
      )
      `,
      [catalogoId, plantillaId]
    );

    await pool.query(
      `
      INSERT INTO recomendaciones_catalogo (
        catalogo_id, numero_recomendacion, recomendacion
      )
      SELECT 
        $1,
        pr.numero_recomendacion,
        pr.recomendacion
      FROM plantillas_recomendaciones pr
      WHERE pr.plantilla_id = $2
      AND NOT EXISTS (
        SELECT 1
        FROM recomendaciones_catalogo rc
        WHERE rc.catalogo_id = $1
        AND rc.numero_recomendacion = pr.numero_recomendacion
      )
      `,
      [catalogoId, plantillaId]
    );

    res.json({
      mensaje: "Plantilla aplicada correctamente al equipo del catálogo",
    });
  } catch (error) {
    console.error("Error al aplicar plantilla:", error);
    res.status(500).json({ error: "Error al aplicar plantilla" });
  }
};

module.exports = {
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
};