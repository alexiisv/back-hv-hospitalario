const valor = (dato) => dato || "NA";

const formatFecha = (fecha) => {
  if (!fecha) return "NA";

  const texto = String(fecha).trim();

  if (
    texto.toUpperCase() === "NR" ||
    texto.toUpperCase() === "N/A" ||
    texto === "-"
  ) {
    return texto;
  }

  if (/^\d{4}$/.test(texto)) {
    return texto;
  }

  if (/^\d{1,2}\/\d{4}$/.test(texto)) {
    return texto;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
    const [anio, mes, dia] = texto.split("T")[0].split("-");
    return `${dia}/${mes}/${anio}`;
  }

  return texto;
};

module.exports = {
  valor,
  formatFecha,
};

module.exports = {
  valor,
  formatFecha,
};