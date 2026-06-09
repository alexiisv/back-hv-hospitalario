const styles = require("./components/styles");
const header = require("./components/header");
const { box, largeBox } = require("./components/box");
const { valor, formatFecha } = require("./components/helpers");

const generarHtmlEquipo = ({ equipo, actividades, recomendaciones }) => {
    const actividades11 = Array.from({ length: 11 }, (_, i) => {
        const act = actividades.find((a) => a.numero_actividad === i + 1);
        return act ? act.actividad : "-";
    });

    const recomendaciones4 = Array.from({ length: 4 }, (_, i) => {
        const rec = recomendaciones.find((r) => r.numero_recomendacion === i + 1);
        return rec ? rec.recomendacion : "";
    });

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    ${styles}
  </head>
  <body>

    <!-- HOJA 1 -->
    <div class="page">
      ${header(equipo, "Hoja de Vida Equipo Biomédico")}

      <div class="section">
        <div class="section-title">Características del equipo</div>

        <div class="main-grid">
          <div>
          <div class="row description">
          <div class="label">Descripción</div>
          <div class="valuetext">${valor(equipo.descripcion)}</div>
          </div>
          <div class="grid-2">
              ${box("Nombre", equipo.equipo)}
              ${box("Marca", equipo.marca)}
              ${box("Modelo", equipo.modelo)}
              ${box("Serie", equipo.serie)}
              ${box("Ubicación", equipo.ubicacion)}
              ${box("Área", equipo.area)}
              ${box("INVIMA", equipo.invima)}
              ${box("Referencia", equipo.referencia)}
              ${box("Fecha fabricación", equipo.fecha_fabricacion)}
              ${box("Fecha instalación", formatFecha(equipo.fecha_instalacion))}
              ${box("Forma adquisición", equipo.forma_adquisicion)}
              ${box("Garantía", equipo.garantia)}
              ${box("Manual", equipo.manual)}
              ${box("País fabric.", equipo.pais_fabricacion)}
              ${box("Proveedor", equipo.proveedor)}
              ${box("Código inventario", equipo.codigo_inventario)}
            </div>

            
          </div>

          <div class="image-box">
            ${equipo.imagen_url
            ? `<img src="${equipo.imagen_url}" />`
            : `<span class="small">Sin imagen</span>`
        }
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Características técnicas</div>
        <div class="grid-3">
          ${box("Ancho (cm)", equipo.ancho)}
          ${box("Resolución", equipo.resolucion)}
          ${box("Peso (kg)", equipo.peso)}
          ${box("Alto (cm)", equipo.alto)}
          ${box("Pantalla", equipo.pantalla)}
          ${box("Fuente aliment.", equipo.fuente_alimentacion)}
          ${box("Fondo (cm)", equipo.fondo)}
          ${box("Capacidad", equipo.capacidad)}
          ${box("Voltaje (v)", equipo.voltaje)}
          ${box("Potencia (w)", equipo.potencia)}
        </div>

        <div class="row description">
          <div class="label">Otras especificaciones</div>
          <div class="valuetext">${valor(equipo.otras_especificaciones)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Apoyo técnico</div>
        <div class="grid-2">
          ${box("Uso", equipo.uso)}
          ${box("Clasificación biomédica", equipo.clasificacion_biomedica)}
          ${box("Riesgo", equipo.riesgo)}
          ${box("Tecnología predominante", equipo.tecnologia_predominante)}
          ${box("Tipo equipo", equipo.tipo_equipo)}
          ${box("Estado equipo", equipo.estado_equipo)}
        </div>
      </div>

      <div style="display:flex; gap:10px; width:100%;">

  <!-- Recomendaciones -->
  <div class="section" style="flex: 2;">
    <div class="section-title">Recomendaciones del fabricante</div>

    <table>
      <tbody>
        ${recomendaciones4
            .map(
                (r, i) => `
          <tr>
            <td style="width: 12mm; text-align:center; font-weight:bold;">
              ${i + 1}
            </td>
            <td>${r}</td>
          </tr>`
            )
            .join("")}
      </tbody>
    </table>
  </div>

  <!-- Accesorios -->
  <div class="section" style="flex: 1;">
    <div class="section-title">Accesorios</div>

    <table>
      <tbody>
          <td> ${valor(equipo.accesorios)} </td>
      </tbody>
    </table>
  </div>

</div>
<p class="note1">
        Hoja de Vida de Mantenimiento Biomédico
      </p>
    </div>

    <!-- HOJA 2 -->
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

      <div >
      <table class="activity-table">
    <thead>
            <!-- Fila superior -->
            <tr>
            <th colspan="2"></th>
            <th colspan="4" style="text-align:center;">
                Revisión
            </th>
            </tr>

            <!-- Encabezados normales -->
            <tr>
            <th style="width: 10mm;">Item</th>
            <th>Actividades a realizar</th>
            <th style="width: 15mm;">1</th>
            <th style="width: 15mm;">2</th>
            <th style="width: 15mm;">3</th>
            <th style="width: 15mm;">4</th>
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
                <td></td>
            </tr>`
            )
            .join("")}
    </tbody>
    </table>
      </div>
        

      <div class="grid-2 mt">
        <div>
          <div class="section-title" style="border:1px solid #444;">
            Relación de herramientas, equipos e insumos
          </div>
          <div class="empty-box"></div>
        </div>

        <div>
          <div class="section-title" style="border:1px solid #444;">Repuestos</div>
          <div class="empty-box"></div>
        </div>
      </div>

      <div class="mt">
  <div class="section-title" style="border:1px solid #444;">
    Observaciones o reporte de fallas
  </div>

  <div class="observaciones-box">
    <div class="linea"><span class="cuadro">D/M/AA</span></div>
    <div class="linea"><span class="cuadro">D/M/AA</span></div>
    <div class="linea"><span class="cuadro">D/M/AA</span></div>
    <div class="linea"><span class="cuadro">D/M/AA</span></div>
  </div>
</div>

      <table class="mt1">
        <tbody>
          <tr>
            <th>Fecha de Mantenimiento</th>
            <td>D/M/AA</td>
            <td>D/M/AA</td>
            <td>D/M/AA</td>
            <td>D/M/AA</td>
          </tr>
          <tr>
            <th>Firma Responsable de Mantenimiento</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Firma del Verificador</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Tiempo de ejecución.</th>
            <td></td>
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

module.exports = generarHtmlEquipo;