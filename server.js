require('dotenv').config();

// Módulo 'path': sirve para manejar y unir rutas de archivos o carpetas del sistema, de forma segura.
const path = require('path');
// Módulo 'express': framework que simplifica la creación de servidores web en Node.js.
const express = require("express");
// Módulo 'fs' (File System): permite leer, escribir, modificar o borrar archivos en el sistema.
const fs = require("fs");
// Módulo 'cors': permite que tu servidor acepte peticiones desde otros dominios (necesario si el frontend y backend están separados).
const cors = require("cors");
// Módulo 'multer': se usa para manejar la subida de archivos (por ejemplo, imágenes enviadas desde un formulario).
const multer = require('multer');

// Simplificar la creacion del server.
const app = express();


const PORT = process.env.PORT || 3000;

// ======= MIDDLEWARE =======
app.use(cors());
app.use(express.static("public"));

// ======= PROTECCIÓN DE ADMIN =======
const auth = { 
  user: process.env.ADMIN_USER, 
  pass: process.env.ADMIN_PASS 
};

app.get('/supersupersecreto.html', (req, res) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (user === auth.user && pass === auth.pass) {
    return res.sendFile(path.join(__dirname, 'private', 'supersupersecreto.html'));
  }

  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  res.status(401).send('Autorización requerida');
});

// ======= MULTER (SUBIR IMÁGENES) =======
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'img')); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const nombreArchivo = Date.now() + path.extname(file.originalname); // Evita nombres repetidos
    cb(null, nombreArchivo);
  }
});

const upload = multer({ storage });

// ======= RUTAS =======

// Obtener todas las ofertas
app.get("/ofertas", (req, res) => {
  fs.readFile("ofertas.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer ofertas");
    res.send(JSON.parse(data));
  });
});

// Agregar nueva oferta con imagen
app.post("/ofertas", upload.single('imagen'), (req, res) => {
  const nuevaOferta = req.body;
  const imagen = req.file ? `img/${req.file.filename}` : null;

  fs.readFile("ofertas.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer archivo");

    const ofertas = JSON.parse(data);
    nuevaOferta.imagen = imagen;
    ofertas.push(nuevaOferta);

    fs.writeFile("ofertas.json", JSON.stringify(ofertas, null, 2), (err) => {
      if (err) return res.status(500).send("Error al guardar");
      res.send("Oferta agregada correctamente");
    });
  });
});

// Borrar oferta por nombre
app.delete("/ofertas/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  fs.readFile("ofertas.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer archivo");

    let ofertas = JSON.parse(data);
    ofertas = ofertas.filter(o => o.nombre !== nombre);

    fs.writeFile("ofertas.json", JSON.stringify(ofertas, null, 2), (err) => {
      if (err) return res.status(500).send("Error al guardar");
      res.send("Oferta eliminada");
    });
  });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
