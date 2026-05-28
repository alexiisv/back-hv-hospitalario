function normalizarTexto(texto) {
  if (!texto) return "";

  return String(texto)
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_./]/g, "")
    .replace(/\s+/g, "");
}

function calcularSimilitud(a, b) {
  const textoA = normalizarTexto(a);
  const textoB = normalizarTexto(b);

  if (!textoA || !textoB) return 0;
  if (textoA === textoB) return 1;

  let coincidencias = 0;
  const longitud = Math.max(textoA.length, textoB.length);

  for (let i = 0; i < Math.min(textoA.length, textoB.length); i++) {
    if (textoA[i] === textoB[i]) coincidencias++;
  }

  return coincidencias / longitud;
}

function puntajeCatalogo(fila, catalogo) {
  const equipoScore = calcularSimilitud(fila.EQUIPO, catalogo.equipo);
  const marcaScore = calcularSimilitud(fila.MARCA, catalogo.marca);
  const modeloScore = calcularSimilitud(fila.MODELO, catalogo.modelo);

  return equipoScore * 0.4 + marcaScore * 0.3 + modeloScore * 0.3;
}

function limpiarValor(valor) {
  if (valor === undefined || valor === null) return null;
  const texto = String(valor).trim();
  return texto === "" ? null : texto;
}

module.exports = {
  normalizarTexto,
  calcularSimilitud,
  puntajeCatalogo,
  limpiarValor,
};