const pool = require("../db");

const obtenerInventario = async (req, res) => {
  try {
    const result = await pool.query(`
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
      LEFT JOIN eses e ON i.ese_id = e.id
      ORDER BY i.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res.status(500).json({ error: "Error al obtener inventario" });
  }
};

const obtenerInventarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const inventarioResult = await pool.query(
      `
      SELECT 
        i.*,
        e.nombre AS ese_nombre,
        e.logo_url AS ese_logo_url,
        e.nit AS ese_nit,
        e.direccion AS ese_direccion,
        e.telefono AS ese_telefono,
        e.ciudad AS ese_ciudad,
        e.departamento AS ese_departamento,
        c.id AS catalogo_real_id,
        c.equipo,
        c.marca,
        c.modelo,
        c.codigo_catalogo,
        c.invima,
        c.imagen_url,
        c.peso,
        c.ancho,
        c.fondo,
        c.alto,
        c.resolucion,
        c.capacidad,
        c.fuente_alimentacion,
        c.voltaje,
        c.potencia,
        c.pantalla,
        c.otras_especificaciones,
        c.accesorios,
        c.uso,
        c.riesgo,
        c.clasificacion_biomedica,
        c.tecnologia_predominante,
        c.tipo_equipo,
        COALESCE(i.frecuencia_mantenimiento, c.frecuencia_mantenimiento) AS frecuencia_mantenimiento,
        c.descripcion
      FROM equipos_inventario i
      INNER JOIN catalogo_equipos c ON i.catalogo_id = c.id
      LEFT JOIN eses e ON i.ese_id = e.id
      WHERE i.id = $1
      `,
      [id]
    );

    if (inventarioResult.rows.length === 0) {
      return res.status(404).json({ error: "Equipo de inventario no encontrado" });
    }

    const equipo = inventarioResult.rows[0];
    const catalogoId = equipo.catalogo_id;

    const actividadesResult = await pool.query(
      `
      SELECT *
      FROM actividades_catalogo
      WHERE catalogo_id = $1
      ORDER BY numero_actividad ASC
      `,
      [catalogoId]
    );

    const recomendacionesResult = await pool.query(
      `
      SELECT *
      FROM recomendaciones_catalogo
      WHERE catalogo_id = $1
      ORDER BY numero_recomendacion ASC
      `,
      [catalogoId]
    );

    res.json({
      equipo,
      actividades: actividadesResult.rows,
      recomendaciones: recomendacionesResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener detalle del inventario:", error);
    res.status(500).json({ error: "Error al obtener detalle del inventario" });
  }
};

const crearInventario = async (req, res) => {
  try {
    const {
      ese_id,
      catalogo_id,
      area,
      ubicacion,
      serie,
      fecha_instalacion,
      fecha_fabricacion,
      referencia,
      manual,
      pais_fabricacion,
      garantia,
      forma_adquisicion,
      proveedor,
      codigo_inventario,
      estado_equipo,
      observaciones,
      frecuencia_mantenimiento,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO equipos_inventario (
        ese_id,
        catalogo_id,
        area,
        ubicacion,
        serie,
        fecha_instalacion,
        fecha_fabricacion,
        referencia,
        manual,
        pais_fabricacion,
        garantia,
        forma_adquisicion,
        proveedor,
        codigo_inventario,
        estado_equipo,
        observaciones,
        frecuencia_mantenimiento
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING *
      `,
      [
        ese_id || null,
        catalogo_id,
        area || null,
        ubicacion || null,
        serie || null,
        fecha_instalacion || null,
        fecha_fabricacion || null,
        referencia || null,
        manual || null,
        pais_fabricacion || null,
        garantia || null,
        forma_adquisicion || null,
        proveedor || null,
        codigo_inventario || null,
        estado_equipo || null,
        observaciones || null,
        frecuencia_mantenimiento || null,
      ]
    );

    // res.status(201).json(result.rows[0]);
    const nuevoEquipo = result.rows[0];

    const codigoHv = `HV-${String(nuevoEquipo.id).padStart(6, "0")}`;

    const updateResult = await pool.query(
      `
      UPDATE equipos_inventario
      SET codigo_hv = $1
      WHERE id = $2
      RETURNING *
      `,
      [codigoHv, nuevoEquipo.id]
    );

    res.status(201).json(updateResult.rows[0]);
    

  } catch (error) {
    console.error("Error al crear equipo en inventario:", error);
    res.status(500).json({ error: "Error al crear equipo en inventario" });
  }
};

module.exports = {
  obtenerInventario,
  obtenerInventarioPorId,
  crearInventario,
};