const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
const multer = require("multer");
const path = require("path");

const xlsx = require("xlsx");
const uploadRoutes = require("./routes/uploadRoutes");
const eseRoutes = require("./routes/eseRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");
const inventarioRoutes =require("./routes/inventarioRoutes");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const nombre = Date.now() + path.extname(file.originalname);
    cb(null, nombre);
  },
});
const upload = multer({ storage });


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoutes);
app.use("/eses", eseRoutes);
app.use("/catalogo", catalogoRoutes);
app.use("/inventario", inventarioRoutes);

// app.post("/upload", upload.single("imagen"), (req, res) => {
//   try {
//     const url = `http://localhost:3001/uploads/${req.file.filename}`;
//     res.json({ url });
//   } catch (error) {
//     res.status(500).json({ error: "Error al subir imagen" });
//   }
// });


app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

/* =====================================================
   ESES
===================================================== */

// // Obtener todas las ESEs
// app.get("/eses", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT *
//       FROM eses
//       ORDER BY nombre ASC
//     `);

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener ESEs:", error);
//     res.status(500).json({ error: "Error al obtener ESEs" });
//   }
// });

// // Obtener una ESE por ID
// app.get("/eses/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT * FROM eses WHERE id = $1`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "ESE no encontrada" });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error al obtener ESE:", error);
//     res.status(500).json({ error: "Error al obtener ESE" });
//   }
// });

/* =====================================================
   CATÁLOGO DE EQUIPOS
===================================================== */

// // Obtener todo el catálogo
// app.get("/catalogo", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT *
//       FROM catalogo_equipos
//       ORDER BY equipo ASC, marca ASC, modelo ASC
//     `);

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener catálogo:", error);
//     res.status(500).json({ error: "Error al obtener catálogo" });
//   }
// });

// // Obtener catálogo por ID
// app.get("/catalogo/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT * FROM catalogo_equipos WHERE id = $1`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Catálogo no encontrado" });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error al obtener catálogo:", error);
//     res.status(500).json({ error: "Error al obtener catálogo" });
//   }
// });

// // Obtener actividades por catálogo
// app.get("/catalogo/:id/actividades", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       `
//       SELECT *
//       FROM actividades_catalogo
//       WHERE catalogo_id = $1
//       ORDER BY numero_actividad ASC
//       `,
//       [id]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener actividades:", error);
//     res.status(500).json({ error: "Error al obtener actividades" });
//   }
// });

// // Obtener recomendaciones por catálogo
// app.get("/catalogo/:id/recomendaciones", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       `
//       SELECT *
//       FROM recomendaciones_catalogo
//       WHERE catalogo_id = $1
//       ORDER BY numero_recomendacion ASC
//       `,
//       [id]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener recomendaciones:", error);
//     res.status(500).json({ error: "Error al obtener recomendaciones" });
//   }
// });

// // Obtener catálogo completo
// app.get("/catalogo-completo/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const catalogoResult = await pool.query(
//       `SELECT * FROM catalogo_equipos WHERE id = $1`,
//       [id]
//     );

//     if (catalogoResult.rows.length === 0) {
//       return res.status(404).json({ error: "Catálogo no encontrado" });
//     }

//     const actividadesResult = await pool.query(
//       `
//       SELECT *
//       FROM actividades_catalogo
//       WHERE catalogo_id = $1
//       ORDER BY numero_actividad ASC
//       `,
//       [id]
//     );

//     const recomendacionesResult = await pool.query(
//       `
//       SELECT *
//       FROM recomendaciones_catalogo
//       WHERE catalogo_id = $1
//       ORDER BY numero_recomendacion ASC
//       `,
//       [id]
//     );

//     res.json({
//       catalogo: catalogoResult.rows[0],
//       actividades: actividadesResult.rows,
//       recomendaciones: recomendacionesResult.rows,
//     });
//   } catch (error) {
//     console.error("Error al obtener catálogo completo:", error);
//     res.status(500).json({ error: "Error al obtener catálogo completo" });
//   }
// });

/* =====================================================
   INVENTARIO
===================================================== */

// // Obtener todo el inventario
// app.get("/inventario", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         i.*,
//         e.nombre AS ese_nombre,
//         c.equipo,
//         c.marca,
//         c.modelo,
//         c.imagen_url,
//         c.frecuencia_mantenimiento,
//         c.descripcion
//       FROM equipos_inventario i
//       INNER JOIN catalogo_equipos c ON i.catalogo_id = c.id
//       LEFT JOIN eses e ON i.ese_id = e.id
//       ORDER BY i.id DESC
//     `);

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener inventario:", error);
//     res.status(500).json({ error: "Error al obtener inventario" });
//   }
// });


// // Obtener detalle de un equipo del inventario
// app.get("/inventario/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const inventarioResult = await pool.query(
//       `
//       SELECT 
//         i.*,
//         e.nombre AS ese_nombre,
//         e.logo_url AS ese_logo_url,
//         e.nit AS ese_nit,
//         e.direccion AS ese_direccion,
//         e.telefono AS ese_telefono,
//         e.ciudad AS ese_ciudad,
//         e.departamento AS ese_departamento,
//         c.id AS catalogo_real_id,
//         c.equipo,
//         c.marca,
//         c.modelo,
//         c.codigo_catalogo,
//         c.invima,
//         c.imagen_url,
//         c.peso,
//         c.ancho,
//         c.fondo,
//         c.alto,
//         c.resolucion,
//         c.capacidad,
//         c.fuente_alimentacion,
//         c.voltaje,
//         c.potencia,
//         c.pantalla,
//         c.otras_especificaciones,
//         c.uso,
//         c.riesgo,
//         c.clasificacion_biomedica,
//         c.tecnologia_predominante,
//         c.tipo_equipo,
//         c.frecuencia_mantenimiento,
//         c.descripcion
//       FROM equipos_inventario i
//       INNER JOIN catalogo_equipos c ON i.catalogo_id = c.id
//       LEFT JOIN eses e ON i.ese_id = e.id
//       WHERE i.id = $1
//       `,
//       [id]
//     );

//     if (inventarioResult.rows.length === 0) {
//       return res.status(404).json({ error: "Equipo de inventario no encontrado" });
//     }

//     const equipo = inventarioResult.rows[0];
//     const catalogoId = equipo.catalogo_id;

//     const actividadesResult = await pool.query(
//       `
//       SELECT *
//       FROM actividades_catalogo
//       WHERE catalogo_id = $1
//       ORDER BY numero_actividad ASC
//       `,
//       [catalogoId]
//     );

//     const recomendacionesResult = await pool.query(
//       `
//       SELECT *
//       FROM recomendaciones_catalogo
//       WHERE catalogo_id = $1
//       ORDER BY numero_recomendacion ASC
//       `,
//       [catalogoId]
//     );

//     res.json({
//       equipo,
//       actividades: actividadesResult.rows,
//       recomendaciones: recomendacionesResult.rows,
//     });
//   } catch (error) {
//     console.error("Error al obtener detalle del inventario:", error);
//     res.status(500).json({ error: "Error al obtener detalle del inventario" });
//   }
// });

// // Obtener inventario por ESE
// app.get("/eses/:id/inventario", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       `
//       SELECT 
//         i.*,
//         e.nombre AS ese_nombre,
//         c.equipo,
//         c.marca,
//         c.modelo,
//         c.imagen_url,
//         c.frecuencia_mantenimiento,
//         c.descripcion
//       FROM equipos_inventario i
//       INNER JOIN catalogo_equipos c ON i.catalogo_id = c.id
//       INNER JOIN eses e ON i.ese_id = e.id
//       WHERE i.ese_id = $1
//       ORDER BY i.id DESC
//       `,
//       [id]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener inventario por ESE:", error);
//     res.status(500).json({ error: "Error al obtener inventario por ESE" });
//   }
// });

// // Crear equipo en inventario
// app.post("/inventario", async (req, res) => {
//   try {
//     const {
//       ese_id,
//       catalogo_id,
//       area,
//       ubicacion,
//       serie,
//       fecha_instalacion,
//       fecha_fabricacion,
//       referencia,
//       manual,
//       pais_fabricacion,
//       garantia,
//       forma_adquisicion,
//       proveedor,
//       codigo_inventario,
//       estado_equipo,
//       observaciones
//     } = req.body;

//     const result = await pool.query(
//       `
//       INSERT INTO equipos_inventario (
//         ese_id,
//         catalogo_id,
//         area,
//         ubicacion,
//         serie,
//         fecha_instalacion,
//         fecha_fabricacion,
//         referencia,
//         manual,
//         pais_fabricacion,
//         garantia,
//         forma_adquisicion,
//         proveedor,
//         codigo_inventario,
//         estado_equipo,
//         observaciones
//       ) VALUES (
//         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
//       )
//       RETURNING *
//       `,
//       [
//         ese_id || null,
//         catalogo_id,
//         area,
//         ubicacion,
//         serie,
//         fecha_instalacion || null,
//         fecha_fabricacion,
//         referencia,
//         manual,
//         pais_fabricacion,
//         garantia,
//         forma_adquisicion,
//         proveedor,
//         codigo_inventario || null,
//         estado_equipo,
//         observaciones
//       ]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error al crear equipo en inventario:", error);
//     res.status(500).json({ error: "Error al crear equipo en inventario" });
//   }
// });

// // app.post("/eses", async (req, resp) => {
// //   try {
// //     const {
// //       nombre,
// //       nit,
// //       direccion,
// //       telefono,
// //       ciudad,
// //       departamento,
// //       email,
// //       logo_url,
// //       estado,
// //       observaciones,
// //     } = req.body;

// //     const result = await pool.query(
// //       ` 
// //       INSERT INTO eses (
// //     nombre, nit, direccion, telefono, ciudad, departamento,
// //      email, logo_url, estado, observaciones,)
// //      VALUES (
// //       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
// //         )
// //         RETURNING *
// //         `,
// //       [
// //         nombre,
// //         nit || null,
// //         direccion || null,
// //         telefono || null,
// //         ciudad || null,
// //         departamento || null,
// //         email || null,
// //         logo_url || null,
// //         estado || "ACTIVA",
// //         observaciones || null,
// //       ]
// //     );

// //     res.status(201).json(result.rows[0]);
// //   } catch (error) {
// //     console.error("Error al crear ESE", error);
// //     res.status(500).json({ error: "Error al Crear ESE" });
// //   }
// // });

// // app.put("/eses/:id", async (req, res) => {
// //   const { id } = req.params;

// //   try {
// //     const {
// //       nombre,
// //       nit,
// //       direccion,
// //       telefono,
// //       ciudad,
// //       departamento,
// //       email,
// //       logo_url,
// //       estado,
// //       observaciones,
// //     } = req.body;

// //     const result = await pool.query(
// //       `
// //       UPDATE eses SET
// //         nombre = $1,
// //         nit = $2,
// //         direccion = $3,
// //         telefono = $4,
// //         ciudad = $5,
// //         departamento = $6,
// //         email = $7,
// //         logo_url = $8,
// //         estado = $9,
// //         observaciones = $10,
// //         updated_at = CURRENT_TIMESTAMP
// //       WHERE id = $11
// //       RETURNING *
// //       `,
// //       [
// //         nombre,
// //         nit || null,
// //         direccion || null,
// //         telefono || null,
// //         ciudad || null,
// //         departamento || null,
// //         email || null,
// //         logo_url || null,
// //         estado || "ACTIVA",
// //         observaciones || null,
// //         id,
// //       ]
// //     );

// //     if (result.rows.length === 0) {
// //       return res.status(404).json({ error: "ESE no encontrada" });
// //     }

// //     res.json(result.rows[0]);
// //   } catch (error) {
// //     console.error("Error al actualizar ESE:", error);
// //     res.status(500).json({ error: "Error al actualizar ESE" });
// //   }
// // });

// app.post("/catalogo", async (req, res) => {
//   try {
//     const {
//       equipo,
//       marca,
//       modelo,
//       codigo_catalogo,
//       invima,
//       imagen_url,
//       peso,
//       ancho,
//       fondo,
//       alto,
//       resolucion,
//       capacidad,
//       fuente_alimentacion,
//       voltaje,
//       potencia,
//       pantalla,
//       otras_especificaciones,
//       uso,
//       riesgo,
//       clasificacion_biomedica,
//       tecnologia_predominante,
//       tipo_equipo,
//       frecuencia_mantenimiento,
//       descripcion,
//     } = req.body;

//     const result = await pool.query(
//       `
//       INSERT INTO catalogo_equipos (
//         equipo, marca, modelo, codigo_catalogo, invima, imagen_url,
//         peso, ancho, fondo, alto, resolucion, capacidad,
//         fuente_alimentacion, voltaje, potencia, pantalla,
//         otras_especificaciones, uso, riesgo, clasificacion_biomedica,
//         tecnologia_predominante, tipo_equipo, frecuencia_mantenimiento,
//         descripcion
//       ) VALUES (
//         $1,$2,$3,$4,$5,$6,
//         $7,$8,$9,$10,$11,$12,
//         $13,$14,$15,$16,
//         $17,$18,$19,$20,
//         $21,$22,$23,$24
//       )
//       RETURNING *
//       `,
//       [
//         equipo,
//         marca,
//         modelo,
//         codigo_catalogo || null,
//         invima || null,
//         imagen_url || null,
//         peso,
//         ancho,
//         fondo,
//         alto,
//         resolucion,
//         capacidad,
//         fuente_alimentacion,
//         voltaje,
//         potencia,
//         pantalla,
//         otras_especificaciones,
//         uso,
//         riesgo,
//         clasificacion_biomedica,
//         tecnologia_predominante,
//         tipo_equipo,
//         frecuencia_mantenimiento,
//         descripcion,
//       ]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error al crear catálogo:", error);
//     res.status(500).json({ error: "Error al crear catálogo" });
//   }
// });

// app.put("/catalogo/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const {
//       equipo,
//       marca,
//       modelo,
//       codigo_catalogo,
//       invima,
//       imagen_url,
//       peso,
//       ancho,
//       fondo,
//       alto,
//       resolucion,
//       capacidad,
//       fuente_alimentacion,
//       voltaje,
//       potencia,
//       pantalla,
//       otras_especificaciones,
//       uso,
//       riesgo,
//       clasificacion_biomedica,
//       tecnologia_predominante,
//       tipo_equipo,
//       frecuencia_mantenimiento,
//       descripcion,
//     } = req.body;

//     const result = await pool.query(
//       `
//       UPDATE catalogo_equipos SET
//         equipo = $1,
//         marca = $2,
//         modelo = $3,
//         codigo_catalogo = $4,
//         invima = $5,
//         imagen_url = $6,
//         peso = $7,
//         ancho = $8,
//         fondo = $9,
//         alto = $10,
//         resolucion = $11,
//         capacidad = $12,
//         fuente_alimentacion = $13,
//         voltaje = $14,
//         potencia = $15,
//         pantalla = $16,
//         otras_especificaciones = $17,
//         uso = $18,
//         riesgo = $19,
//         clasificacion_biomedica = $20,
//         tecnologia_predominante = $21,
//         tipo_equipo = $22,
//         frecuencia_mantenimiento = $23,
//         descripcion = $24,
//         updated_at = CURRENT_TIMESTAMP
//       WHERE id = $25
//       RETURNING *
//       `,
//       [
//         equipo,
//         marca,
//         modelo,
//         codigo_catalogo || null,
//         invima || null,
//         imagen_url || null,
//         peso,
//         ancho,
//         fondo,
//         alto,
//         resolucion,
//         capacidad,
//         fuente_alimentacion,
//         voltaje,
//         potencia,
//         pantalla,
//         otras_especificaciones,
//         uso,
//         riesgo,
//         clasificacion_biomedica,
//         tecnologia_predominante,
//         tipo_equipo,
//         frecuencia_mantenimiento,
//         descripcion,
//         id,
//       ]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Catálogo no encontrado" });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error al actualizar catálogo:", error);
//     res.status(500).json({ error: "Error al actualizar catálogo" });
//   }
// });

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});

// // Eliminar equipo del catálogo
// app.delete("/catalogo/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await pool.query(
//       `DELETE FROM catalogo_equipos WHERE id = $1`,
//       [id]
//     );

//     res.json({ mensaje: "Equipo eliminado del catálogo" });
//   } catch (error) {
//     console.error("Error al eliminar catálogo:", error);
//     res.status(500).json({ error: "Error al eliminar catálogo" });
//   }
// });

// // Eliminar ESE
// app.delete("/eses/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await pool.query(
//       `DELETE FROM eses WHERE id = $1`,
//       [id]
//     );

//     res.json({ mensaje: "ESE eliminada" });
//   } catch (error) {
//     console.error("Error al eliminar ESE:", error);
//     res.status(500).json({
//       error:
//         "No se pudo eliminar la ESE. Puede tener equipos asociados en inventario.",
//     });
//   }
// });