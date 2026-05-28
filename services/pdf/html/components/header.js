const { valor } = require("./helpers");

const header = (equipo, titulo) => `
  <div class="header">
    <div class="header-logo">
      ${
        equipo.ese_logo_url
          ? `<img src="${equipo.ese_logo_url}" />`
          : `<span>LOGO ESE</span>`
      }
    </div>

    <div class="header-center">
      <div class="ese">${valor(equipo.ese_nombre)}</div>
      <div class="city">${valor(equipo.ese_ciudad)} - ${valor(equipo.ese_departamento)}</div>
      <div class="city">NIT: ${valor(equipo.ese_nit)}</div>
      <div class="title">${titulo}</div>
    </div>

    <div class="header-format">
      FORMATO<br/>V.: 1,0
    </div>
  </div>
`;

module.exports = header;