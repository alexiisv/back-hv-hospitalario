const subirImagen = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }

    const url = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ error: "Error al subir imagen" });
  }
};

module.exports = {
  subirImagen,
};