const pool = require("../db");

const obtenerCatalogo = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM catalogo_equipos
      ORDER BY equipo ASC, marca ASC, modelo ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    res.status(500).json({ error: "Error al obtener catálogo" });
  }
};

const obtenerCatalogoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM catalogo_equipos WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catálogo no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    res.status(500).json({ error: "Error al obtener catálogo" });
  }
};

const crearCatalogo = async (req, res) => {
  try {
    const {
      equipo,
      marca,
      modelo,
      codigo_catalogo,
      invima,
      imagen_url,
      peso,
      ancho,
      fondo,
      alto,
      resolucion,
      capacidad,
      fuente_alimentacion,
      voltaje,
      potencia,
      pantalla,
      otras_especificaciones,
      accesorios,
      uso,
      riesgo,
      clasificacion_biomedica,
      tecnologia_predominante,
      tipo_equipo,
      // frecuencia_mantenimiento,
      descripcion,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO catalogo_equipos (
        equipo, marca, modelo, codigo_catalogo, invima, imagen_url,
        peso, ancho, fondo, alto, resolucion, capacidad,
        fuente_alimentacion, voltaje, potencia, pantalla,
        otras_especificaciones, accesorios, uso, riesgo, clasificacion_biomedica,
        tecnologia_predominante, tipo_equipo,
        descripcion
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,
        $17,$18,$19,$20,
        $21,$22,$23, $24, $25
      )
      RETURNING *
      `,
      [
        equipo,
        marca,
        modelo,
        codigo_catalogo || null,
        invima || null,
        imagen_url || null,
        peso || null,
        ancho || null,
        fondo || null,
        alto || null,
        resolucion || null,
        capacidad || null,
        fuente_alimentacion || null,
        voltaje || null,
        potencia || null,
        pantalla || null,
        otras_especificaciones || null,
        accesorios || null,
        uso || null,
        riesgo || null,
        clasificacion_biomedica || null,
        tecnologia_predominante || null,
        tipo_equipo || null,
        // frecuencia_mantenimiento || null,
        descripcion || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear catálogo:", error);
    res.status(500).json({ error: "Error al crear catálogo" });
  }
};

const actualizarCatalogo = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      equipo,
      marca,
      modelo,
      codigo_catalogo,
      invima,
      imagen_url,
      peso,
      ancho,
      fondo,
      alto,
      resolucion,
      capacidad,
      fuente_alimentacion,
      voltaje,
      potencia,
      pantalla,
      otras_especificaciones,
      accesorios,
      uso,
      riesgo,
      clasificacion_biomedica,
      tecnologia_predominante,
      tipo_equipo,
      // frecuencia_mantenimiento,
      descripcion,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE catalogo_equipos SET
        equipo = $1,
        marca = $2,
        modelo = $3,
        codigo_catalogo = $4,
        invima = $5,
        imagen_url = $6,
        peso = $7,
        ancho = $8,
        fondo = $9,
        alto = $10,
        resolucion = $11,
        capacidad = $12,
        fuente_alimentacion = $13,
        voltaje = $14,
        potencia = $15,
        pantalla = $16,
        otras_especificaciones = $17,
        accesorios = $18,
        uso = $19,
        riesgo = $20,
        clasificacion_biomedica = $21,
        tecnologia_predominante = $22,
        tipo_equipo = $23,
        descripcion = $24,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $25
      RETURNING *
      `,
      [
        equipo,
        marca,
        modelo,
        codigo_catalogo || null,
        invima || null,
        imagen_url || null,
        peso || null,
        ancho || null,
        fondo || null,
        alto || null,
        resolucion || null,
        capacidad || null,
        fuente_alimentacion || null,
        voltaje || null,
        potencia || null,
        pantalla || null,
        otras_especificaciones || null,
        accesorios || null,
        uso || null,
        riesgo || null,
        clasificacion_biomedica || null,
        tecnologia_predominante || null,
        tipo_equipo || null,
        // frecuencia_mantenimiento || null,
        descripcion || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catálogo no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar catálogo:", error);
    res.status(500).json({ error: "Error al actualizar catálogo" });
  }
};

const eliminarCatalogo = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM catalogo_equipos WHERE id = $1`, [id]);
    res.json({ mensaje: "Equipo eliminado del catálogo" });
  } catch (error) {
    console.error("Error al eliminar catálogo:", error);
    res.status(500).json({
      error:
        "No se pudo eliminar el equipo del catálogo. Puede tener inventario asociado.",
    });
  }
};

const obtenerActividadesCatalogo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM actividades_catalogo
      WHERE catalogo_id = $1
      ORDER BY numero_actividad ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    res.status(500).json({ error: "Error al obtener actividades" });
  }
};

const obtenerRecomendacionesCatalogo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM recomendaciones_catalogo
      WHERE catalogo_id = $1
      ORDER BY numero_recomendacion ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
};

const obtenerCatalogoCompleto = async (req, res) => {
  const { id } = req.params;

  try {
    const catalogoResult = await pool.query(
      `SELECT * FROM catalogo_equipos WHERE id = $1`,
      [id]
    );

    if (catalogoResult.rows.length === 0) {
      return res.status(404).json({ error: "Catálogo no encontrado" });
    }

    const actividadesResult = await pool.query(
      `
      SELECT *
      FROM actividades_catalogo
      WHERE catalogo_id = $1
      ORDER BY numero_actividad ASC
      `,
      [id]
    );

    const recomendacionesResult = await pool.query(
      `
      SELECT *
      FROM recomendaciones_catalogo
      WHERE catalogo_id = $1
      ORDER BY numero_recomendacion ASC
      `,
      [id]
    );

    res.json({
      catalogo: catalogoResult.rows[0],
      actividades: actividadesResult.rows,
      recomendaciones: recomendacionesResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener catálogo completo:", error);
    res.status(500).json({ error: "Error al obtener catálogo completo" });
  }
};

const crearActividadCatalogo = async (req, res) => {
  const { id } = req.params;
  const { numero_actividad, actividad } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO actividades_catalogo (
        catalogo_id, numero_actividad, actividad
      ) VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id, numero_actividad, actividad]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear actividad:", error);
    res.status(500).json({ error: "Error al crear actividad" });
  }
};

const actualizarActividadCatalogo = async (req, res) => {
  const { actividadId } = req.params;
  const { numero_actividad, actividad } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE actividades_catalogo
      SET numero_actividad = $1,
          actividad = $2
      WHERE id = $3
      RETURNING *
      `,
      [numero_actividad, actividad, actividadId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar actividad:", error);
    res.status(500).json({ error: "Error al actualizar actividad" });
  }
};

const eliminarActividadCatalogo = async (req, res) => {
  const { actividadId } = req.params;

  try {
    await pool.query(
      `DELETE FROM actividades_catalogo WHERE id = $1`,
      [actividadId]
    );

    res.json({ mensaje: "Actividad eliminada" });
  } catch (error) {
    console.error("Error al eliminar actividad:", error);
    res.status(500).json({ error: "Error al eliminar actividad" });
  }
};

const crearRecomendacionCatalogo = async (req, res) => {
  const { id } = req.params;
  const { numero_recomendacion, recomendacion } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO recomendaciones_catalogo (
        catalogo_id, numero_recomendacion, recomendacion
      ) VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id, numero_recomendacion, recomendacion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear recomendación:", error);
    res.status(500).json({ error: "Error al crear recomendación" });
  }
};

const actualizarRecomendacionCatalogo = async (req, res) => {
  const { recomendacionId } = req.params;
  const { numero_recomendacion, recomendacion } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE recomendaciones_catalogo
      SET numero_recomendacion = $1,
          recomendacion = $2
      WHERE id = $3
      RETURNING *
      `,
      [numero_recomendacion, recomendacion, recomendacionId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar recomendación:", error);
    res.status(500).json({ error: "Error al actualizar recomendación" });
  }
};

const eliminarRecomendacionCatalogo = async (req, res) => {
  const { recomendacionId } = req.params;

  try {
    await pool.query(
      `DELETE FROM recomendaciones_catalogo WHERE id = $1`,
      [recomendacionId]
    );

    res.json({ mensaje: "Recomendación eliminada" });
  } catch (error) {
    console.error("Error al eliminar recomendación:", error);
    res.status(500).json({ error: "Error al eliminar recomendación" });
  }
};

module.exports = {
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
};