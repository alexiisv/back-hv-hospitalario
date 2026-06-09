const xlsx = require("xlsx");
const pool = require("../db");

const {
  normalizarTexto,
  puntajeCatalogo,
  limpiarValor,
} = require("../utils/textoUtils");

function convertirFechaExcel(valor) {
  if (!valor) return null;

  if (typeof valor === "number") {
    const fecha = new Date((valor - 25569) * 86400 * 1000);
    return fecha.toISOString().split("T")[0];
  }

  const texto = String(valor).trim();

  if (/^\d+$/.test(texto)) {
    const numero = Number(texto);
    const fecha = new Date((numero - 25569) * 86400 * 1000);
    return fecha.toISOString().split("T")[0];
  }

  if (texto.includes("/")) {
    const [dia, mes, anio] = texto.split("/");
    if (dia && mes && anio) {
      return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }
  }

  return texto;
}


const mapearDatosInventario = (fila) => ({
  area: limpiarValor(fila.AREA),
  ubicacion: limpiarValor(fila.UBICACION),
  serie: limpiarValor(fila.SERIE),
  // fecha_instalacion: limpiarValor(fila.FECHA_INSTALACION),
  fecha_instalacion: convertirFechaExcel(fila.FECHA_INSTALACION),
  fecha_fabricacion: limpiarValor(fila.FECHA_FABRICACION),
  referencia: limpiarValor(fila.REFERENCIA),
  manual: limpiarValor(fila.MANUAL),
  pais_fabricacion: limpiarValor(fila.PAIS_FABRICACION),
  garantia: limpiarValor(fila.GARANTIA),
  forma_adquisicion: limpiarValor(fila.FORMA_ADQUISICION),
  proveedor: limpiarValor(fila.PROVEEDOR),
  codigo_inventario: limpiarValor(fila.CODIGO_INVENTARIO),
  estado_equipo: limpiarValor(fila.ESTADO_EQUIPO),
  observaciones: limpiarValor(fila.OBSERVACIONES),
  frecuencia_mantenimiento: limpiarValor(fila.FRECUENCIA_MANTENIMIENTO),
});

const validarImportacion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const filas = xlsx.utils.sheet_to_json(sheet, {
      defval: "",
    });

    const catalogoResult = await pool.query(`
      SELECT id, equipo, marca, modelo
      FROM catalogo_equipos
    `);

    const catalogo = catalogoResult.rows;

    const resultados = filas.map((fila, index) => {
      const equipoExcel = limpiarValor(fila.EQUIPO);
      const marcaExcel = limpiarValor(fila.MARCA);
      const modeloExcel = limpiarValor(fila.MODELO);

      const filaNormalizada = {
        EQUIPO: equipoExcel,
        MARCA: marcaExcel,
        MODELO: modeloExcel,
      };

      const coincidenciaExacta = catalogo.find((item) => {
        return (
          normalizarTexto(item.equipo) === normalizarTexto(equipoExcel) &&
          normalizarTexto(item.marca) === normalizarTexto(marcaExcel) &&
          normalizarTexto(item.modelo) === normalizarTexto(modeloExcel)
        );
      });

      const datos = mapearDatosInventario(fila);

      if (coincidenciaExacta) {
        return {
          fila: index + 2,
          estado: "exacto",
          mensaje: "Coincidencia exacta encontrada",
          catalogo_id: coincidenciaExacta.id,
          equipo_excel: equipoExcel,
          marca_excel: marcaExcel,
          modelo_excel: modeloExcel,
          sugerencia: {
            id: coincidenciaExacta.id,
            equipo: coincidenciaExacta.equipo,
            marca: coincidenciaExacta.marca,
            modelo: coincidenciaExacta.modelo,
          },
          candidatos: [],
          datos,
        };
      }

      const candidatos = catalogo
        .map((item) => ({
          ...item,
          puntaje: puntajeCatalogo(filaNormalizada, item),
        }))
        .sort((a, b) => b.puntaje - a.puntaje)
        .slice(0, 3);

      const mejor = candidatos[0];

      if (mejor && mejor.puntaje >= 0.65) {
        return {
          fila: index + 2,
          estado: "similar",
          mensaje: "Se encontró una coincidencia similar. Requiere revisión.",
          catalogo_id: mejor.id,
          equipo_excel: equipoExcel,
          marca_excel: marcaExcel,
          modelo_excel: modeloExcel,
          sugerencia: {
            id: mejor.id,
            equipo: mejor.equipo,
            marca: mejor.marca,
            modelo: mejor.modelo,
            puntaje: mejor.puntaje,
          },
          candidatos: candidatos.map((c) => ({
            id: c.id,
            equipo: c.equipo,
            marca: c.marca,
            modelo: c.modelo,
            puntaje: c.puntaje,
          })),
          datos,
        };
      }

      return {
        fila: index + 2,
        estado: "no_encontrado",
        mensaje: "No se encontró coincidencia en el catálogo",
        catalogo_id: null,
        equipo_excel: equipoExcel,
        marca_excel: marcaExcel,
        modelo_excel: modeloExcel,
        sugerencia: null,
        candidatos: candidatos.map((c) => ({
          id: c.id,
          equipo: c.equipo,
          marca: c.marca,
          modelo: c.modelo,
          puntaje: c.puntaje,
        })),
        datos,
      };
    });

    const resumen = {
      total: resultados.length,
      exactos: resultados.filter((r) => r.estado === "exacto").length,
      similares: resultados.filter((r) => r.estado === "similar").length,
      no_encontrados: resultados.filter((r) => r.estado === "no_encontrado").length,
    };

    res.json({
      resumen,
      resultados,
    });
  } catch (error) {
    console.error("Error al validar Excel:", error);
    res.status(500).json({ error: "Error al validar Excel" });
  }
};

const guardarImportacion = async (req, res) => {
  try {
    const { ese_id, registros } = req.body;

    if (!ese_id) {
      return res.status(400).json({ error: "Debe enviar ese_id" });
    }

    if (!Array.isArray(registros) || registros.length === 0) {
      return res.status(400).json({ error: "No hay registros para guardar" });
    }

    const guardados = [];
    const errores = [];

    for (const item of registros) {
      try {
        const catalogo_id = item.catalogo_id;
        const datos = item.datos || {};

        if (!catalogo_id) {
         errores.push({
          fila: item.fila,
          catalogo_id: item.catalogo_id,
          codigo_inventario: datos.codigo_inventario,
          serie: datos.serie,
          error: error.message,
          detalle: error.detail || null,
          constraint: error.constraint || null,
        });
          continue;
        }

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
            observaciones
            frecuencia_mantenimiento,
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14, $15, $16, $17
          )
          RETURNING *
          `,
          [
            ese_id,
            catalogo_id,
            datos.area || null,
            datos.ubicacion || null,
            datos.serie || null,
            datos.fecha_instalacion || null,
            datos.fecha_fabricacion || null,
            datos.referencia || null,
            datos.manual || null,
            datos.pais_fabricacion || null,
            datos.garantia || null,
            datos.forma_adquisicion || null,
            datos.proveedor || null,
            datos.codigo_inventario || null,
            datos.estado_equipo || null,
            datos.observaciones || null,
            datos.frecuencia_mantenimiento || null,
          ]
        );

        // guardados.push(result.rows[0]);
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

          guardados.push(updateResult.rows[0]);
          
      } catch (error) {
        errores.push({
          fila: item.fila,
          error: error.message,
        });
      }
    }

    res.json({
      mensaje: "Proceso de importación finalizado",
      total_recibidos: registros.length,
      total_guardados: guardados.length,
      total_errores: errores.length,
      guardados,
      errores,
    });
  } catch (error) {
    console.error("Error al guardar importación:", error);
    res.status(500).json({ error: "Error al guardar importación" });
  }
};

module.exports = {
  validarImportacion,
  guardarImportacion,
};