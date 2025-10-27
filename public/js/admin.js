const form = document.getElementById("formOferta");
const lista = document.getElementById("listaOfertas");

// Función para cargar las ofertas existentes
function cargarOfertas() {
  fetch("/ofertas")
    .then(res => res.json())
    .then(ofertas => {
      lista.innerHTML = ofertas.map(o => `
        <li>
          <strong>${o.nombre}</strong> - $${o.precio}
          <button onclick="eliminarOferta('${o.nombre}')">Eliminar</button>
        </li>
      `).join("");
    });
}

// Enviar nueva oferta
form.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(form); // Crea un FormData con todos los campos y la imagen

  fetch("/ofertas", {
    method: "POST",
    body: formData // Enviamos el form completo con la imagen
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);      // Mensaje de confirmación
    form.reset();    // Limpia el form
    cargarOfertas(); // Actualiza la lista de ofertas
  })
  .catch(err => console.error(err));
});

// Función para eliminar oferta
function eliminarOferta(nombre) {
  fetch(`/ofertas/${nombre}`, { method: "DELETE" })
    .then(() => cargarOfertas());
}

// Carga inicial
cargarOfertas();
