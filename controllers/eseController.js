const pool = require("../db");

const obtenerEses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM eses
      ORDER BY nombre ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ESEs:", error);
    res.status(500).json({ error: "Error al obtener ESEs" });
  }
};

const obtenerEsePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM eses WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ESE no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener ESE:", error);
    res.status(500).json({ error: "Error al obtener ESE" });
  }
};

const obtenerInventarioPorEse = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        i.*,
        e.nombre AS ese_nombre,
        c.equipo,
        c.marca,
        c.modelo,
        c.imagen_url,
        COALESCE(i.frecuencia_mantenimiento, c.frecuencia_mantenimiento) AS frecuencia_mantenimiento,
        c.descripcion
      FROM equipos_inventario i
      INNER JOIN catalogo_equipos c ON i.catalogo_id = c.id
      INNER JOIN eses e ON i.ese_id = e.id
      WHERE i.ese_id = $1
      ORDER BY i.id DESC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener inventario por ESE:", error);
    res.status(500).json({ error: "Error al obtener inventario por ESE" });
  }
};

const crearEse = async (req, res) => {
  try {
    const {
      nombre,
      nit,
      direccion,
      telefono,
      ciudad,
      departamento,
      email,
      logo_url,
      estado,
      observaciones,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO eses (
        nombre, nit, direccion, telefono, ciudad, departamento,
        email, logo_url, estado, observaciones
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      RETURNING *
      `,
      [
        nombre,
        nit || null,
        direccion || null,
        telefono || null,
        ciudad || null,
        departamento || null,
        email || null,
        logo_url || null,
        estado || "ACTIVA",
        observaciones || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear ESE:", error);
    res.status(500).json({ error: "Error al crear ESE" });
  }
};

const actualizarEse = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      nombre,
      nit,
      direccion,
      telefono,
      ciudad,
      departamento,
      email,
      logo_url,
      estado,
      observaciones,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE eses SET
        nombre = $1,
        nit = $2,
        direccion = $3,
        telefono = $4,
        ciudad = $5,
        departamento = $6,
        email = $7,
        logo_url = $8,
        estado = $9,
        observaciones = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
      `,
      [
        nombre,
        nit || null,
        direccion || null,
        telefono || null,
        ciudad || null,
        departamento || null,
        email || null,
        logo_url || null,
        estado || "ACTIVA",
        observaciones || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ESE no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar ESE:", error);
    res.status(500).json({ error: "Error al actualizar ESE" });
  }
};

const eliminarEse = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM eses WHERE id = $1`, [id]);
    res.json({ mensaje: "ESE eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar ESE:", error);
    res.status(500).json({
      error: "No se pudo eliminar la ESE. Puede tener equipos asociados.",
    });
  }
};

module.exports = {
  obtenerEses,
  obtenerEsePorId,
  obtenerInventarioPorEse,
  crearEse,
  actualizarEse,
  eliminarEse,
};