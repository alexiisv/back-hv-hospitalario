const styles = require("./components/styles");
const header = require("./components/header");
const { box } = require("./components/box");

const generarHtmlPreventivo = ({ equipo, actividades }) => {
  const actividades11 = Array.from({ length: 11 }, (_, i) => {
    const act = actividades.find((a) => a.numero_actividad === i + 1);
    return act ? act.actividad : "-";
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    ${styles}
  </head>

  <body>
    <div class="page">
      ${header(equipo, "Protocolo de Mantenimiento Preventivo")}

      <div class="section">
        <div class="section-title">Datos del equipo</div>
        <div class="grid-2">
          ${box("Equipo", equipo.equipo)}
          ${box("Ubicación", equipo.ubicacion)}
          ${box("Marca", equipo.marca)}
          ${box("Estado equipo", equipo.estado_equipo)}
          ${box("Modelo", equipo.modelo)}
          ${box("Frecuencia mantenim.", equipo.frecuencia_mantenimiento)}
          ${box("Serie", equipo.serie)}
          ${box("Código inventario", equipo.codigo_inventario)}
        </div>
      </div>

      <table class="activity-table">
        <thead>
          <tr>
            <th style="width: 10mm;">#</th>
            <th>Actividades a realizar</th>
            <th style="width: 15mm;">1</th>
            <th style="width: 15mm;">2</th>
            <th style="width: 15mm;">3</th>
          </tr>
        </thead>
        <tbody>
          ${actividades11
            .map(
              (a, i) => `
              <tr>
                <td style="text-align:center;">${i + 1}</td>
                <td>${a}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <div class="grid-2 mt">
        <div>
          <div class="section-title" style="border:1px solid #444;">
            Relación de herramientas, equipos e insumos
          </div>
          <div class="empty-box"></div>
        </div>

        <div>
          <div class="section-title" style="border:1px solid #444;">
            Repuestos
          </div>
          <div class="empty-box"></div>
        </div>
      </div>

      <div class="mt">
        <div class="section-title" style="border:1px solid #444;">
          Observaciones o reporte de fallas
        </div>
        <div class="textarea-box"></div>
      </div>

      <table class="mt">
        <tbody>
          <tr>
            <th>Fecha revisión</th>
            <td>D/M/AA</td>
            <td>D/M/AA</td>
            <td>D/M/AA</td>
          </tr>
          <tr>
            <th>Realizado</th>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Recibido</th>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Tiempo de ej.</th>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <p class="note">
        Nota: El protocolo de mantenimiento preventivo incluye las recomendaciones establecidas por el fabricante,
        en caso de no encontrarse se adoptan del programa de mantenimiento definido por guías, manuales y estándares
        del área de mantenimiento Hospitalario.
      </p>
    </div>
  </body>
  </html>
  `;
};

module.exports = generarHtmlPreventivo;