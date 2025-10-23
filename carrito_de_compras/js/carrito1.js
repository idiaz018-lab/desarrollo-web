const listaCarrito = document.getElementById('lista-carrito');
const listaCarritoOffcanvas = document.getElementById('lista-carrito-offcanvas');
const contadorCarrito = document.getElementById('contador-carrito');

function agregarProducto(nombreProducto) {
  // Lista principal
  if (listaCarrito.children.length === 1 && listaCarrito.children[0].textContent === 'No hay productos') {
    listaCarrito.innerHTML = '';
  }

  const li = document.createElement('li');
  li.className = 'list-group-item agregado';
  li.textContent = nombreProducto;
  listaCarrito.appendChild(li);

  // Lista offcanvas
  if (listaCarritoOffcanvas.children.length === 1 && listaCarritoOffcanvas.children[0].textContent === 'No hay productos') {
    listaCarritoOffcanvas.innerHTML = '';
  }

  const liOff = document.createElement('li');
  liOff.className = 'list-group-item agregado';
  liOff.textContent = nombreProducto;
  listaCarritoOffcanvas.appendChild(liOff);

  // Quitar clase agregado después de 1s
  setTimeout(() => {
    li.classList.remove('agregado');
    liOff.classList.remove('agregado');
  }, 1000);

  // Actualizar contador si existe
  if (contadorCarrito) {
    contadorCarrito.textContent = listaCarritoOffcanvas.children.length;
  }
}

function eliminarProducto() {
  const items = listaCarrito.getElementsByTagName('li');
  if (items.length > 0) {
    const ultimo = items[items.length - 1];
    ultimo.classList.add('eliminado');
    setTimeout(() => {
      ultimo.remove();
      if (listaCarrito.children.length === 0) {
        const liVacio = document.createElement('li');
        liVacio.className = 'list-group-item text-muted text-center';
        liVacio.textContent = 'No hay productos';
        listaCarrito.appendChild(liVacio);
      }
    }, 500);
  }

  const itemsOff = listaCarritoOffcanvas.getElementsByTagName('li');
  if (itemsOff.length > 0) {
    const ultimoOff = itemsOff[itemsOff.length - 1];
    ultimoOff.classList.add('eliminado');
    setTimeout(() => {
      ultimoOff.remove();
      if (listaCarritoOffcanvas.children.length === 0) {
        const liVacio = document.createElement('li');
        liVacio.className = 'list-group-item text-muted text-center';
        liVacio.textContent = 'No hay productos';
        listaCarritoOffcanvas.appendChild(liVacio);
      }
      // Actualizar contador
      if (contadorCarrito) {
        contadorCarrito.textContent = listaCarritoOffcanvas.children.length;
      }
    }, 500);
  }
}