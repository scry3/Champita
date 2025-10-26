const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Ruta para obtener las ofertas
app.get("/ofertas", (req, res) => {
  fs.readFile("ofertas.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer ofertas");
    res.send(JSON.parse(data));
  });
});

// Ruta para agregar una nueva oferta
app.post("/ofertas", (req, res) => {
  const nuevaOferta = req.body;
  fs.readFile("ofertas.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer archivo");
    const ofertas = JSON.parse(data);
    ofertas.push(nuevaOferta);
    fs.writeFile("ofertas.json", JSON.stringify(ofertas, null, 2), (err) => {
      if (err) return res.status(500).send("Error al guardar");
      res.send("Oferta agregada");
    });
  });
});

// Ruta para borrar una oferta por nombre
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
