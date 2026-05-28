const { valor } = require("./helpers");

const box = (label, value) => `
  <div class="row">
    <div class="label">${label}</div>
    <div class="value">${valor(value)}</div>
  </div>
`;

const largeBox = (label) => `
  <div style="margin-top: 4mm;">
    <div class="section-title" style="border:1px solid #444;">${label}</div>
    <div class="textarea-box"></div>
  </div>
`;

module.exports = {
  box,
  largeBox,
};