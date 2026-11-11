const CLAVE_CARRITO = 'carrito';

function formatearPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-AR');
}

function leerCarrito() {
  const guardado = storage.get(CLAVE_CARRITO, []);
  return Array.isArray(guardado) ? guardado : [];
}

function guardarCarrito(carrito) {
  storage.set(CLAVE_CARRITO, carrito);
}

function calcularCantidad(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function actualizarHeader(carrito) {
  const contador = document.getElementById('contador-carrito');
  const total = document.getElementById('total-carrito');

  if (contador) {
    contador.textContent = calcularCantidad(carrito);
  }

  if (total) {
    total.textContent = formatearPrecio(calcularTotal(carrito));
  }
}

function renderizarPanel(carrito) {
  const lista = document.querySelector('.carrito-lista');
  const totalPanel = document.getElementById('total-carrito-panel');

  if (!lista) {
    return;
  }

  lista.innerHTML = '';

  if (carrito.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'carrito-vacio';
    vacio.textContent = 'Tu carrito está vacío';
    lista.appendChild(vacio);
  } else {
    carrito.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'carrito-item carrito-item--simple';

      const info = document.createElement('div');
      info.className = 'carrito-item__info';

      const nombre = document.createElement('h3');
      nombre.textContent = item.nombre;

      const subtotal = document.createElement('p');
      subtotal.className = 'carrito-item__precio';
      subtotal.textContent = 'Subtotal: ' + formatearPrecio(item.precio * item.cantidad);

      const cantidad = document.createElement('p');
      cantidad.className = 'carrito-item__cantidad';
      cantidad.textContent = 'Cantidad: ';

      const cantidadValor = document.createElement('span');
      cantidadValor.textContent = item.cantidad;
      cantidad.appendChild(cantidadValor);

      const eliminar = document.createElement('button');
      eliminar.type = 'button';
      eliminar.className = 'carrito-item__eliminar';
      eliminar.dataset.id = item.id;
      eliminar.textContent = 'Eliminar';

      info.appendChild(nombre);
      info.appendChild(subtotal);
      info.appendChild(cantidad);
      info.appendChild(eliminar);
      li.appendChild(info);
      lista.appendChild(li);
    });
  }

  if (totalPanel) {
    totalPanel.textContent = formatearPrecio(calcularTotal(carrito));
  }
}

function actualizarVista(carrito) {
  actualizarHeader(carrito);
  renderizarPanel(carrito);
}

let carrito = leerCarrito();

function agregarAlCarrito(id, nombre, precio) {
  const existente = carrito.find((item) => item.id === id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  guardarCarrito(carrito);
  actualizarVista(carrito);
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  guardarCarrito(carrito);
  actualizarVista(carrito);
}

document.querySelectorAll('.tarjeta-producto button[data-id]').forEach((boton) => {
  boton.addEventListener('click', () => {
    agregarAlCarrito(
      Number(boton.dataset.id),
      boton.dataset.nombre,
      Number(boton.dataset.precio)
    );
  });
});

const listaCarrito = document.querySelector('.carrito-lista');

if (listaCarrito) {
  listaCarrito.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.carrito-item__eliminar');

    if (boton) {
      eliminarDelCarrito(Number(boton.dataset.id));
    }
  });
}

actualizarVista(carrito);
