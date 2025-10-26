fetch("/ofertas")
  .then(res => res.json())
  .then(ofertas => {
    const contenedor = document.getElementById("ofertas");
    contenedor.innerHTML = ofertas.map(o => `
      <div class="oferta">
        <img src="${o.imagen || 'img/sin-foto.jpg'}" alt="${o.nombre}">
        <h3>${o.nombre}</h3>
        <p>$${o.precio}</p>
      </div>
    `).join("");
  });
