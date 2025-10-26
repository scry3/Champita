const form = document.getElementById("formOferta");
const lista = document.getElementById("listaOfertas");

function cargarOfertas() {
  fetch("/ofertas")
    .then(res => res.json())
    .then(ofertas => {
      lista.innerHTML = ofertas.map(o => `
        <li>
          ${o.nombre} - $${o.precio}
          <button onclick="eliminarOferta('${o.nombre}')">Eliminar</button>
        </li>
      `).join("");
    });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const nueva = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    imagen: document.getElementById("imagen").value
  };
    nueva.imagen = "img/" + nueva.imagen;
  fetch("/ofertas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nueva)
  }).then(() => {
    form.reset();
    cargarOfertas();
  });
});

function eliminarOferta(nombre) {
  fetch(`/ofertas/${nombre}`, { method: "DELETE" })
    .then(() => cargarOfertas());
}

cargarOfertas();
