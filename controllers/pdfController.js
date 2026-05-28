const pool = require("../db");
const archiver = require("archiver");
const generarHtmlEquipo = require("../services/pdf/html/hojaVidaTemplate");
const generarHtmlPreventivo = require("../services/pdf/html/preventivoTemplate");
const { generarPdfDesdeHtml } = require("../services/pdf/generators/generarPdf");

const obtenerDetalleEquipo = async (id) => {
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

  if (inventarioResult.rows.length === 0) return null;

  const equipo = inventarioResult.rows[0];

  const actividadesResult = await pool.query(
    `
    SELECT *
    FROM actividades_catalogo
    WHERE catalogo_id = $1
    ORDER BY numero_actividad ASC
    `,
    [equipo.catalogo_id]
  );

  const recomendacionesResult = await pool.query(
    `
    SELECT *
    FROM recomendaciones_catalogo
    WHERE catalogo_id = $1
    ORDER BY numero_recomendacion ASC
    `,
    [equipo.catalogo_id]
  );

  return {
    equipo,
    actividades: actividadesResult.rows,
    recomendaciones: recomendacionesResult.rows,
  };
};

// const valor = (dato) => dato || "NA";

// // const generarHtmlEquipo = ({ equipo, actividades, recomendaciones }) => {
// //   const actividades11 = Array.from({ length: 11 }, (_, i) => {
// //     const act = actividades.find((a) => a.numero_actividad === i + 1);
// //     return act ? act.actividad : "-";
// //   });


// //   const recomendaciones4 = Array.from({ length: 4 }, (_, i) => {
// //     const rec = recomendaciones.find((r) => r.numero_recomendacion === i + 1);
// //     return rec ? rec.recomendacion : "";
// //   });

// //   return `
// //   <!DOCTYPE html>
// //   <html>
// //   <head>
// //     <meta charset="UTF-8" />
// //    <style>
// //   * {
// //     box-sizing: border-box;
// //     font-family: Arial, Helvetica, sans-serif;
// //   }

// //   body {
// //     margin: 0;
// //     color: #111;
// //     background: white;
// //   }

// //   .page {
// //     width: 210mm;
// //     height: 297mm;
// //     padding: 7mm;
// //     page-break-after: always;
// //     background: white;
// //     overflow: hidden;
// //   }

// //   .page:last-child {
// //     page-break-after: auto;
// //   }

// //   .header {
// //     border: 1px solid #111;
// //     display: grid;
// //     grid-template-columns: 34mm 1fr 30mm;
// //     height: 23mm;
// //     margin-bottom: 3mm;
// //   }

// //   .header-logo,
// //   .header-format {
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     text-align: center;
// //     padding: 2mm;
// //     font-size: 8px;
// //   }

// //   .header-logo {
// //     border-right: 1px solid #111;
// //   }

// //   .header-format {
// //     border-left: 1px solid #111;
// //     font-weight: bold;
// //   }

// //   .header-logo img {
// //     max-width: 28mm;
// //     max-height: 19mm;
// //     object-fit: contain;
// //   }

// //   .header-center {
// //     display: flex;
// //     flex-direction: column;
// //     align-items: center;
// //     justify-content: center;
// //     line-height: 1.25;
// //     text-align: center;
// //   }

// //   .ese {
// //     font-size: 11px;
// //     font-weight: bold;
// //     text-transform: uppercase;
// //   }

// //   .city {
// //     font-size: 9px;
// //   }

// //   .title {
// //     margin-top: 2mm;
// //     font-size: 11px;
// //     font-weight: bold;
// //     text-transform: uppercase;
// //   }

// //   .section {
// //     border: 1px solid #111;
// //     margin-bottom: 2.5mm;
// //   }

// //   .section-title {
// //     background: #e5e7eb;
// //     border-bottom: 1px solid #111;
// //     padding: 1.5mm 2mm;
// //     font-size: 9px;
// //     font-weight: bold;
// //     text-transform: uppercase;
// //     text-align: center;
// //   }

// //   .grid-2 {
// //     display: grid;
// //     grid-template-columns: 1fr 1fr;
// //   }

// //   .grid-3 {
// //     display: grid;
// //     grid-template-columns: 1fr 1fr 1fr;
// //   }

// //   .main-grid {
// //     display: grid;
// //     grid-template-columns: 1fr 43mm;
// //     gap: 2mm;
// //     padding: 2mm;
// //   }

// //   .row {
// //     display: grid;
// //     grid-template-columns: 31mm 1fr;
// //     min-height: 6.2mm;
// //     border-bottom: 1px solid #999;
// //   }

// //   .grid-2 .row,
// //   .grid-3 .row {
// //     border-right: 1px solid #999;
// //   }

// //   .label {
// //     background: #f3f4f6;
// //     border-right: 1px solid #999;
// //     padding: 1.4mm;
// //     font-size: 7.6px;
// //     font-weight: bold;
// //     text-transform: uppercase;
// //   }

// //   .value {
// //     padding: 1.4mm;
// //     font-size: 8.4px;
// //     line-height: 1.25;
// //     white-space: pre-line;
// //   }

// //   .description {
// //     min-height: 17mm;
// //   }

// //   .image-box {
// //     border: 1px solid #999;
// //     height: 54mm;
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     padding: 2mm;
// //   }

// //   .image-box img {
// //     max-width: 100%;
// //     max-height: 100%;
// //     object-fit: contain;
// //   }

// //   table {
// //     width: 100%;
// //     border-collapse: collapse;
// //     font-size: 8.5px;
// //   }

// //   th,
// //   td {
// //     border: 1px solid #111;
// //     padding: 1.5mm;
// //     vertical-align: top;
// //     line-height: 1.25;
// //   }

// //   th {
// //     background: #e5e7eb;
// //     font-size: 8px;
// //     font-weight: bold;
// //     text-transform: uppercase;
// //     text-align: center;
// //   }

// //   .activity-table td {
// //     height: 8mm;
// //   }

// //   .empty-box {
// //     min-height: 17mm;
// //     border: 1px solid #111;
// //   }

// //   .textarea-box {
// //     min-height: 22mm;
// //     border: 1px solid #111;
// //   }

// //   .note {
// //     font-size: 7.8px;
// //     color: #333;
// //     margin-top: 2.5mm;
// //     line-height: 1.25;
// //     text-align: justify;
// //   }

// //   .mt {
// //     margin-top: 3mm;
// //   }

// //   .small {
// //     font-size: 8px;
// //   }
// // </style>
// //   </head>
// //   <body>

// //     <!-- HOJA 1 -->
// //     <div class="page">
// //       ${header(equipo, "Hoja de Vida Equipo Biomédico")}

// //       <div class="section">
// //         <div class="section-title">Características del equipo</div>

// //         <div class="main-grid">
// //           <div>
// //           <div class="row description">
// //               <div class="label">Descripción</div>
// //               <div class="value">${valor(equipo.descripcion)}</div>
// //             </div>
// //             <div class="grid-2">
// //               ${box("Nombre", equipo.equipo)}
// //               ${box("Marca", equipo.marca)}
// //               ${box("Modelo", equipo.modelo)}
// //               ${box("Serie", equipo.serie)}            
// //               ${box("Ubicación", equipo.ubicacion)}
// //               ${box("Área", equipo.area)}
// //               ${box("Fecha fabricación", equipo.fecha_fabricacion)}
// //               ${box("Fecha instalación", formatFecha(equipo.fecha_instalacion))}
// //               ${box("Referencia", equipo.referencia)}
// //               ${box("Garantía", equipo.garantia)}
// //               ${box("Manual", equipo.manual)}
// //               ${box("INVIMA", equipo.invima)}
// //               ${box("País fabric.", equipo.pais_fabricacion)}
// //               ${box("Proveedor", equipo.proveedor)}
// //               ${box("Forma adquisición", equipo.forma_adquisicion)}
// //               ${box("Código inventario", equipo.codigo_inventario)}
// //             </div>
            
// //           </div>

// //           <div class="image-box">
// //             ${
// //               equipo.imagen_url
// //                 ? `<img src="${equipo.imagen_url}" />`
// //                 : `<span class="small">Sin imagen</span>`
// //             }
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //         <div class="section-title">Características técnicas</div>
// //         <div class="grid-3">
// //           ${box("Ancho", equipo.ancho)}
// //           ${box("Resolución", equipo.resolucion)}
// //           ${box("Peso", equipo.peso)}
// //           ${box("Alto", equipo.alto)}
// //           ${box("Capacidad", equipo.capacidad)}
// //           ${box("Fuente aliment.", equipo.fuente_alimentacion)}
// //           ${box("Pantalla", equipo.pantalla)}
// //           ${box("Voltaje", equipo.voltaje)}
// //           ${box("Potencia", equipo.potencia)}
// //           ${box("Fondo", equipo.fondo)}
// //         </div>
// //         <div class="row description">
// //           <div class="label">Otras especificaciones</div>
// //           <div class="value">${valor(equipo.otras_especificaciones)}</div>
// //         </div>
// //       </div>

// //       <div class="section">
// //         <div class="section-title">Apoyo técnico</div>
// //         <div class="grid-2">
// //           ${box("Uso", equipo.uso)}
// //           ${box("Clasificación biomédica", equipo.clasificacion_biomedica)}
// //           ${box("Riesgo", equipo.riesgo)}
// //           ${box("Tecnología predominante", equipo.tecnologia_predominante)}
// //           ${box("Tipo equipo", equipo.tipo_equipo)}
// //           ${box("Estado equipo", equipo.estado_equipo)}
// //         </div>
// //       </div>

// //       <div class="section">
// //         <div class="section-title">Recomendaciones del fabricante</div>
// //         <table>
// //           <tbody>
// //             ${recomendaciones4
// //               .map(
// //                 (r, i) => `
// //               <tr>
// //                 <td style="width: 10mm; text-align:center; font-weight:bold;">${i + 1}</td>
// //                 <td>${r}</td>
// //               </tr>`
// //               )
// //               .join("")}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>

// //     <!-- HOJA 2 -->
// //     <div class="page">
// //       ${header(equipo, "Protocolo de Mantenimiento Preventivo")}

// //       <div class="section">
// //         <div class="section-title">Datos del equipo</div>
// //         <div class="grid-2">
// //           ${box("Equipo", equipo.equipo)}
// //           ${box("Ubicación", equipo.ubicacion)}
// //           ${box("Marca", equipo.marca)}
// //           ${box("Estado equipo", equipo.estado_equipo)}
// //           ${box("Modelo", equipo.modelo)}
// //           ${box("Frecuencia mantenim.", equipo.frecuencia_mantenimiento)}
// //           ${box("Serie", equipo.serie)}
// //           ${box("Código inventario", equipo.codigo_inventario)}
// //         </div>
// //       </div>

// //       <table class = "activity-table">
// //         <thead>
// //           <tr>
// //             <th style="width: 10mm;">#</th>
// //             <th>Actividades a realizar</th>
// //             <th style="width: 15mm;">1</th>
// //             <th style="width: 15mm;">2</th>
// //             <th style="width: 15mm;">3</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           ${actividades11
// //             .map(
// //               (a, i) => `
// //             <tr>
// //               <td style="text-align:center;">${i + 1}</td>
// //               <td>${a}</td>
// //               <td></td>
// //               <td></td>
// //               <td></td>
// //             </tr>`
// //             )
// //             .join("")}
// //         </tbody>
// //       </table>

// //       <div class="grid-2" style="margin-top: 5mm;">
// //         <div>
// //           <div class="section-title" style="border:1px solid #444;">Relación de herramientas, equipos e insumos</div>
// //           <div class="empty-box"></div>
// //         </div>
// //         <div>
// //           <div class="section-title" style="border:1px solid #444;">Repuestos</div>
// //           <div class="empty-box"></div>
// //         </div>
// //       </div>

// //       <div style="margin-top: 5mm;">
// //         <div class="section-title" style="border:1px solid #444;">Observaciones o reporte de fallas</div>
// //         <div class="textarea-box"></div>
// //       </div>

// //       <table style="margin-top: 5mm;">
// //         <tbody>
// //           <tr>
// //             <th>Fecha revisión</th>
// //             <td>D/M/AA</td>
// //             <td>D/M/AA</td>
// //             <td>D/M/AA</td>
// //           </tr>
// //           <tr>
// //             <th>Realizado</th>
// //             <td></td>
// //             <td></td>
// //             <td></td>
// //           </tr>
// //           <tr>
// //             <th>Recibido</th>
// //             <td></td>
// //             <td></td>
// //             <td></td>
// //           </tr>
// //           <tr>
// //             <th>Tiempo de ej.</th>
// //             <td></td>
// //             <td></td>
// //             <td></td>
// //           </tr>
// //         </tbody>
// //       </table>

// //       <p class="note">
// //         Nota: El protocolo de mantenimiento preventivo incluye las recomendaciones establecidas por el fabricante,
// //         en caso de no encontrarse se adoptan del programa de mantenimiento definido por guías, manuales y estándares
// //         del área de mantenimiento Hospitalario.
// //       </p>
// //     </div>

// //     <!-- HOJA 3 -->
// //     <div class="page">
// //       ${header(equipo, "Formato de Mantenimiento Correctivo")}

// //       <div class="section">
// //         <div class="section-title">Datos del equipo</div>
// //         <div class="grid-2">
// //           ${box("Equipo", equipo.equipo)}
// //           ${box("Ubicación", equipo.ubicacion)}
// //           ${box("Marca", equipo.marca)}
// //           ${box("Área", equipo.area)}
// //           ${box("Modelo", equipo.modelo)}
// //           ${box("Código inventario", equipo.codigo_inventario)}
// //           ${box("Serie", equipo.serie)}
// //           ${box("Estado equipo", equipo.estado_equipo)}
// //         </div>
// //       </div>

// //       <div class="grid-2">
// //         ${box("Fecha reporte", "")}
// //         ${box("Reportado por", "")}
// //       </div>

// //       ${largeBox("Falla reportada")}
// //       ${largeBox("Diagnóstico técnico")}
// //       ${largeBox("Actividades realizadas")}

// //       <div class="grid-2">
// //         <div>
// //           <div class="section-title" style="border:1px solid #444;">Repuestos utilizados</div>
// //           <div class="empty-box"></div>
// //         </div>
// //         <div>
// //           <div class="section-title" style="border:1px solid #444;">Pruebas realizadas</div>
// //           <div class="empty-box"></div>
// //         </div>
// //       </div>

// //       <div class="grid-2" style="margin-top: 4mm;">
// //         ${box("Resultado final", "")}
// //         ${box("Estado final equipo", "")}
// //         ${box("Fecha cierre", "")}
// //         ${box("Tiempo ejecución", "")}
// //         ${box("Técnico responsable", "")}
// //         ${box("Recibido por", "")}
// //       </div>

// //       ${largeBox("Observaciones")}
// //     </div>

// //   </body>
// //   </html>
// //   `;
// // };

// // const generarHtmlPreventivo = ({ equipo, actividades }) => {
// //   const actividades11 = Array.from({ length: 11 }, (_, i) => {
// //     const act = actividades.find((a) => a.numero_actividad === i + 1);
// //     return act ? act.actividad : "-";
// //   });

// //   return `
// //   <!DOCTYPE html>
// //   <html>
// //   <head>
// //     <meta charset="UTF-8" />
// //     <style>
// //       * {
// //         box-sizing: border-box;
// //         font-family: Arial, sans-serif;
// //       }

// //       body {
// //         margin: 0;
// //         background: #ffffff;
// //         color: #111827;
// //       }

// //       .page {
// //         width: 210mm;
// //         min-height: 297mm;
// //         padding: 10mm;
// //       }

// //       .header {
// //         border: 1px solid #333;
// //         display: grid;
// //         grid-template-columns: 38mm 1fr 35mm;
// //         min-height: 25mm;
// //         margin-bottom: 5mm;
// //       }

// //       .header-logo,
// //       .header-format {
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //         padding: 5px;
// //         text-align: center;
// //         font-size: 10px;
// //       }

// //       .header-logo {
// //         border-right: 1px solid #333;
// //       }

// //       .header-format {
// //         border-left: 1px solid #333;
// //       }

// //       .header-logo img {
// //         max-width: 32mm;
// //         max-height: 22mm;
// //         object-fit: contain;
// //       }

// //       .header-center {
// //         display: flex;
// //         flex-direction: column;
// //         align-items: center;
// //         justify-content: center;
// //         text-align: center;
// //         padding: 5px;
// //       }

// //       .ese {
// //         font-size: 12px;
// //         font-weight: bold;
// //         text-transform: uppercase;
// //       }

// //       .city {
// //         font-size: 10px;
// //         margin-top: 2px;
// //       }

// //       .title {
// //         font-size: 13px;
// //         font-weight: bold;
// //         text-transform: uppercase;
// //         margin-top: 8px;
// //       }

// //       .section {
// //         border: 1px solid #444;
// //         margin-bottom: 4mm;
// //       }

// //       .section-title {
// //         font-size: 11px;
// //         font-weight: bold;
// //         text-transform: uppercase;
// //         padding: 3px 6px;
// //         background: #f1f5f9;
// //         border-bottom: 1px solid #444;
// //       }

// //       .grid-2 {
// //         display: grid;
// //         grid-template-columns: 1fr 1fr;
// //       }

// //       .row {
// //         display: grid;
// //         grid-template-columns: 35mm 1fr;
// //         border-bottom: 1px solid #ccc;
// //         min-height: 7mm;
// //       }

// //       .label {
// //         background: #f8fafc;
// //         border-right: 1px solid #ccc;
// //         font-size: 9px;
// //         font-weight: bold;
// //         text-transform: uppercase;
// //         padding: 4px;
// //       }

// //       .value {
// //         font-size: 10px;
// //         padding: 4px;
// //       }

// //       table {
// //         width: 100%;
// //         border-collapse: collapse;
// //         font-size: 10px;
// //       }

// //       th, td {
// //         border: 1px solid #444;
// //         padding: 4px;
// //         vertical-align: top;
// //       }

// //       th {
// //         background: #f1f5f9;
// //         font-weight: bold;
// //         text-transform: uppercase;
// //         font-size: 9px;
// //       }

// //       .empty-box {
// //         min-height: 18mm;
// //         border: 1px solid #444;
// //       }

// //       .textarea-box {
// //         min-height: 22mm;
// //         border: 1px solid #444;
// //       }

// //       .note {
// //         font-size: 9px;
// //         color: #444;
// //         margin-top: 4mm;
// //         line-height: 1.3;
// //       }
// //     </style>
// //   </head>

// //   <body>
// //     <div class="page">
// //       ${header(equipo, "Protocolo de Mantenimiento Preventivo")}

// //       <div class="section">
// //         <div class="section-title">Datos del equipo</div>
// //         <div class="grid-2">
// //           ${box("Equipo", equipo.equipo)}
// //           ${box("Ubicación", equipo.ubicacion)}
// //           ${box("Marca", equipo.marca)}
// //           ${box("Estado equipo", equipo.estado_equipo)}
// //           ${box("Modelo", equipo.modelo)}
// //           ${box("Frecuencia mantenim.", equipo.frecuencia_mantenimiento)}
// //           ${box("Serie", equipo.serie)}
// //           ${box("Código inventario", equipo.codigo_inventario)}
// //         </div>
// //       </div>

// //       <table>
// //         <thead>
// //           <tr>
// //             <th style="width: 10mm;">#</th>
// //             <th>Actividades a realizar</th>
// //             <th style="width: 15mm;">1</th>
// //             <th style="width: 15mm;">2</th>
// //             <th style="width: 15mm;">3</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           ${actividades11
// //             .map(
// //               (a, i) => `
// //               <tr>
// //                 <td style="text-align:center;">${i + 1}</td>
// //                 <td>${a}</td>
// //                 <td></td>
// //                 <td></td>
// //                 <td></td>
// //               </tr>`
// //             )
// //             .join("")}
// //         </tbody>
// //       </table>

// //       <div class="grid-2" style="margin-top: 5mm;">
// //         <div>
// //           <div class="section-title" style="border:1px solid #444;">
// //             Relación de herramientas, equipos e insumos
// //           </div>
// //           <div class="empty-box"></div>
// //         </div>

// //         <div>
// //           <div class="section-title" style="border:1px solid #444;">
// //             Repuestos
// //           </div>
// //           <div class="empty-box"></div>
// //         </div>
// //       </div>

// //       <div style="margin-top: 5mm;">
// //         <div class="section-title" style="border:1px solid #444;">
// //           Observaciones o reporte de fallas
// //         </div>
// //         <div class="textarea-box"></div>
// //       </div>

// //       <table style="margin-top: 5mm;">
// //         <tbody>
// //           <tr>
// //             <th>Fecha revisión</th>
// //             <td>D/M/AA</td>
// //             <td>D/M/AA</td>
// //             <td>D/M/AA</td>
// //           </tr>
// //           <tr>
// //             <th>Realizado</th>
// //             <td></td>
// //             <td></td>
// //             <td></td>
// //           </tr>
// //           <tr>
// //             <th>Recibido</th>
// //             <td></td>
// //             <td></td>
// //             <td></td>
// //           </tr>
// //           <tr>
// //             <th>Tiempo de ej.</th>
// //             <td></td>
// //             <td></td>
// //             <td></td>
// //           </tr>
// //         </tbody>
// //       </table>

// //       <p class="note">
// //         Nota: El protocolo de mantenimiento preventivo incluye las recomendaciones establecidas por el fabricante,
// //         en caso de no encontrarse se adoptan del programa de mantenimiento definido por guías, manuales y estándares
// //         del área de mantenimiento Hospitalario.
// //       </p>
// //     </div>
// //   </body>
// //   </html>
// //   `;
// // };

// // const header = (equipo, titulo) => `
// //   <div class="header">
// //     <div class="header-logo">
// //       ${
// //         equipo.ese_logo_url
// //           ? `<img src="${equipo.ese_logo_url}" />`
// //           : `<span>LOGO ESE</span>`
// //       }
// //     </div>
// //     <div class="header-center">
// //       <div class="ese">${valor(equipo.ese_nombre)}</div>
// //       <div class="city">${valor(equipo.ese_ciudad)} - ${valor(equipo.ese_departamento)}</div>
// //       <div class="city">NIT: ${valor(equipo.ese_nit)}</div>
// //       <div class="title">${titulo}</div>
// //     </div>
// //     <div class="header-format">
// //       FORMATO<br/>V.: 1,0
// //     </div>
// //   </div>
// // `;

// // const box = (label, value) => `
// //   <div class="row">
// //     <div class="label">${label}</div>
// //     <div class="value">${valor(value)}</div>
// //   </div>
// // `;

// // const largeBox = (label) => `
// //   <div style="margin-top: 4mm;">
// //     <div class="section-title" style="border:1px solid #444;">${label}</div>
// //     <div class="textarea-box"></div>
// //   </div>
// // `;

// const formatFecha = (fecha) => {
//   if (!fecha) return "NA";
//   return new Date(fecha).toLocaleDateString("es-CO");
// };

const generarPdfEquipo = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await obtenerDetalleEquipo(id);

    if (!data) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    const pdfBuffer = await generarPdfBuffer(data);

    const nombre = `Hoja_vida_${data.equipo.codigo_inventario || data.equipo.id}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nombre}"`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).json({ error: "Error generando PDF" });
  }
};

const previewEquipoHtml = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await obtenerDetalleEquipo(id);

    if (!data) {
      return res.status(404).send("Equipo no encontrado");
    }

    // const html = generarHtmlEquipo(data);
    const html = generarHtmlEquipo(data);

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generando preview");
  }
};

const generarPdfBuffer = async (data) => {
  const html = generarHtmlEquipo(data);
  return await generarPdfDesdeHtml(html);
};

const generarPdfPreventivoBuffer = async (data) => {
  const html = generarHtmlPreventivo(data);
  return await generarPdfDesdeHtml(html);
};

const generarZipPdfEse = async (req, res) => {
  const { eseId } = req.params;

  try {
    const equiposResult = await pool.query(
      `
      SELECT id
      FROM equipos_inventario
      WHERE ese_id = $1
      ORDER BY id ASC
      `,
      [eseId]
    );

    if (equiposResult.rows.length === 0) {
      return res.status(404).json({
        error: "No hay equipos en el inventario de esta ESE",
      });
    }

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="hojas_vida_ese_${eseId}.zip"`,
    });

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("error", (error) => {
      throw error;
    });

    archive.pipe(res);

    for (const item of equiposResult.rows) {
      const data = await obtenerDetalleEquipo(item.id);

      if (!data) continue;

      const pdfBuffer = await generarPdfBuffer(data);

      const codigo =
        data.equipo.codigo_inventario ||
        data.equipo.serie ||
        `equipo_${item.id}`;

      const nombreArchivo = `Hoja_vida_${codigo}.pdf`
        .replace(/[\\/:*?"<>|]/g, "_");

      archive.append(Buffer.from(pdfBuffer), {
        name: nombreArchivo,
      });
    }

    await archive.finalize();
  } catch (error) {
    console.error("Error generando ZIP de PDFs:", error);
    res.status(500).json({ error: "Error generando ZIP de PDFs" });
  }
};

const generarZipPreventivosEse = async (req, res) => {
  const { eseId } = req.params;

  try {
    const equiposResult = await pool.query(
      `
      SELECT id
      FROM equipos_inventario
      WHERE ese_id = $1
      ORDER BY id ASC
      `,
      [eseId]
    );

    if (equiposResult.rows.length === 0) {
      return res.status(404).json({
        error: "No hay equipos en el inventario de esta ESE",
      });
    }

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="preventivos_ese_${eseId}.zip"`,
    });

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("error", (error) => {
      throw error;
    });

    archive.pipe(res);

    for (const item of equiposResult.rows) {
      const data = await obtenerDetalleEquipo(item.id);

      if (!data) continue;

      const pdfBuffer = await generarPdfPreventivoBuffer(data);

      const codigo =
        data.equipo.codigo_inventario ||
        data.equipo.serie ||
        `equipo_${item.id}`;

      const nombreArchivo = `Preventivo_${codigo}.pdf`.replace(
        /[\\/:*?"<>|]/g,
        "_"
      );

      archive.append(Buffer.from(pdfBuffer), {
        name: nombreArchivo,
      });
    }

    await archive.finalize();
  } catch (error) {
    console.error("Error generando ZIP de preventivos:", error);
    res.status(500).json({ error: "Error generando ZIP de preventivos" });
  }
};

module.exports = {
  generarPdfEquipo,
  generarZipPdfEse,
  generarZipPreventivosEse,
  previewEquipoHtml
};