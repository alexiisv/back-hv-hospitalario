const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
const multer = require("multer");
const path = require("path");

const uploadRoutes = require("./routes/uploadRoutes");
const eseRoutes = require("./routes/eseRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");
const inventarioRoutes =require("./routes/inventarioRoutes");
const importacionRoutes = require("./routes/importacionRoutes");

const plantillaRoutes = require("./routes/plantillaRoutes");

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
const pdfRoutes = require("./routes/pdfRoutes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoutes);
app.use("/eses", eseRoutes);
app.use("/catalogo", catalogoRoutes);
app.use("/inventario", inventarioRoutes);
app.use("/importar", importacionRoutes);
app.use("/pdf", pdfRoutes);
app.use("/plantillas", plantillaRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});

