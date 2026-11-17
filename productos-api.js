const URL_PRODUCTOS = SUPABASE_URL + '/rest/v1/productos?select=*&order=id.asc';
const ORDEN_CATEGORIAS = ['Celulares', 'Audio', 'Informática', 'Gaming', 'Smartwatch', 'Accesorios'];

let productosCompletos = [];
let productosCargados = false;

const estadoFiltros = {
  categoria: '',
  busqueda: '',
  precio: 'todos',
  soloStock: false
};

function formatearPrecioProducto(valor) {
  return '$' + Number(valor).toLocaleString('es-AR');
}

function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function dibujarProductos(productos) {
  const contenedor = document.getElementById('contenedor-productos');

  if (!contenedor) {
    return;
  }

  const fragmento = document.createDocumentFragment();

  productos.forEach((producto) => {
    const contenedorProducto = document.createElement('div');
    contenedorProducto.className = 'contenedor-producto';

    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto';

    const enlace = document.createElement('div');
    enlace.className = 'tarjeta-enlace';

    const figura = document.createElement('figure');
    const imagen = document.createElement('img');
    imagen.src = producto.imagen;
    imagen.alt = 'Imagen de ' + producto.nombre;
    imagen.width = 300;
    imagen.height = 200;
    figura.appendChild(imagen);

    const titulo = document.createElement('h3');
    titulo.textContent = producto.nombre;

    const categoria = document.createElement('p');
    categoria.textContent = producto.categoria;

    enlace.appendChild(figura);
    enlace.appendChild(titulo);
    enlace.appendChild(categoria);

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = formatearPrecioProducto(producto.precio);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.dataset.id = producto.id;
    boton.dataset.nombre = producto.nombre;
    boton.dataset.precio = producto.precio;
    boton.textContent = 'Agregar al carrito';

    let aviso = null;

    if (producto.stock === false) {
      aviso = document.createElement('p');
      aviso.className = 'sin-stock';
      aviso.textContent = 'Sin stock';
      boton.disabled = true;
    }

    tarjeta.appendChild(enlace);
    tarjeta.appendChild(precio);

    if (aviso) {
      tarjeta.appendChild(aviso);
    }

    tarjeta.appendChild(boton);
    contenedorProducto.appendChild(tarjeta);
    fragmento.appendChild(contenedorProducto);
  });

  contenedor.replaceChildren(fragmento);
}

function hayFiltrosActivos() {
  return Boolean(estadoFiltros.categoria) ||
    Boolean(estadoFiltros.busqueda.trim()) ||
    estadoFiltros.precio !== 'todos' ||
    estadoFiltros.soloStock;
}

function mostrarSinResultados() {
  const sinResultados = document.getElementById('sin-resultados');

  if (!sinResultados) {
    return;
  }

  sinResultados.hidden = false;
  sinResultados.className = 'estado-productos';
  sinResultados.replaceChildren();

  const mensaje = document.createElement('p');
  mensaje.textContent = 'No se encontraron productos con esos filtros';
  sinResultados.appendChild(mensaje);

  if (hayFiltrosActivos()) {
    const limpiar = document.createElement('button');
    limpiar.type = 'button';
    limpiar.textContent = 'Limpiar filtros';
    limpiar.addEventListener('click', limpiarFiltros);
    sinResultados.appendChild(limpiar);
  }
}

function aplicarFiltros() {
  if (!productosCargados) {
    return;
  }

  const busqueda = normalizarTexto(estadoFiltros.busqueda);

  const productosFiltrados = productosCompletos.filter((producto) => {
    if (estadoFiltros.categoria && producto.categoria !== estadoFiltros.categoria) {
      return false;
    }

    if (busqueda && !normalizarTexto(producto.nombre).includes(busqueda)) {
      return false;
    }

    const precio = Number(producto.precio);

    if (estadoFiltros.precio === '0-500000' && precio > 500000) {
      return false;
    }

    if (estadoFiltros.precio === '500000+' && precio <= 500000) {
      return false;
    }

    if (estadoFiltros.soloStock && producto.stock !== true) {
      return false;
    }

    return true;
  });

  const sinResultados = document.getElementById('sin-resultados');

  if (productosFiltrados.length === 0) {
    dibujarProductos([]);
    mostrarSinResultados();
    return;
  }

  if (sinResultados) {
    sinResultados.hidden = true;
    sinResultados.replaceChildren();
  }

  dibujarProductos(productosFiltrados);
}

function limpiarFiltros() {
  estadoFiltros.categoria = '';
  estadoFiltros.busqueda = '';
  estadoFiltros.precio = 'todos';
  estadoFiltros.soloStock = false;

  const selector = document.getElementById('selector-categoria');
  const buscador = document.getElementById('buscar-producto');
  const precioTodos = document.getElementById('precio-todos');
  const soloStock = document.getElementById('solo-stock');

  if (selector) {
    selector.value = '';
  }

  if (buscador) {
    buscador.value = '';
  }

  if (precioTodos) {
    precioTodos.checked = true;
  }

  if (soloStock) {
    soloStock.checked = false;
  }

  aplicarFiltros();
}

function generarOpcionesCategoria(productos) {
  const selector = document.getElementById('selector-categoria');

  if (!selector) {
    return;
  }

  const categorias = [...new Set(productos.map((producto) => producto.categoria).filter(Boolean))];

  categorias.sort((a, b) => {
    const indiceA = ORDEN_CATEGORIAS.indexOf(a);
    const indiceB = ORDEN_CATEGORIAS.indexOf(b);

    if (indiceA === -1 && indiceB === -1) {
      return a.localeCompare(b, 'es');
    }

    if (indiceA === -1) {
      return 1;
    }

    if (indiceB === -1) {
      return -1;
    }

    return indiceA - indiceB;
  });

  const fragmento = document.createDocumentFragment();
  const opcionTodas = document.createElement('option');
  opcionTodas.value = '';
  opcionTodas.textContent = 'Todas las categorías';
  fragmento.appendChild(opcionTodas);

  categorias.forEach((categoria) => {
    const opcion = document.createElement('option');
    opcion.value = categoria;
    opcion.textContent = categoria;
    fragmento.appendChild(opcion);
  });

  selector.replaceChildren(fragmento);
  selector.value = estadoFiltros.categoria;
}

function inicializarFiltros() {
  const selector = document.getElementById('selector-categoria');
  const formBuscador = document.querySelector('.buscador');
  const inputBusqueda = document.getElementById('buscar-producto');
  const formFiltros = document.querySelector('.filtros form');
  const grillaCategorias = document.querySelector('.grilla-categorias');

  if (selector) {
    selector.addEventListener('change', () => {
      estadoFiltros.categoria = selector.value;
      aplicarFiltros();
    });
  }

  if (formBuscador && inputBusqueda) {
    inputBusqueda.addEventListener('input', () => {
      estadoFiltros.busqueda = inputBusqueda.value;
      aplicarFiltros();
    });

    formBuscador.addEventListener('submit', (evento) => {
      evento.preventDefault();
      estadoFiltros.busqueda = inputBusqueda.value;
      aplicarFiltros();
    });
  }

  if (formFiltros) {
    formFiltros.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const precioSeleccionado = formFiltros.querySelector('input[name="precio"]:checked');
      const soloStock = document.getElementById('solo-stock');

      estadoFiltros.precio = precioSeleccionado ? precioSeleccionado.value : 'todos';
      estadoFiltros.soloStock = Boolean(soloStock && soloStock.checked);
      aplicarFiltros();
    });
  }

  if (grillaCategorias) {
    grillaCategorias.addEventListener('click', (evento) => {
      const enlace = evento.target.closest('.tarjeta-categoria');

      if (!enlace) {
        return;
      }

      evento.preventDefault();

      const categoria = enlace.dataset.categoria;

      if (!categoria) {
        return;
      }

      estadoFiltros.categoria = categoria;

      if (selector) {
        selector.value = categoria;
      }

      aplicarFiltros();

      const seccion = document.querySelector('.productos-destacados');

      if (seccion) {
        const encabezado = document.querySelector('.encabezado');
        const alturaEncabezado = encabezado ? encabezado.offsetHeight : 0;
        const destino = seccion.getBoundingClientRect().top + window.scrollY - alturaEncabezado - 16;
        window.scrollTo({ top: destino, behavior: 'smooth' });
      }
    });
  }
}

async function cargarProductos() {
  const estado = document.getElementById('estado-productos');
  const contenedor = document.getElementById('contenedor-productos');
  const sinResultados = document.getElementById('sin-resultados');

  if (!estado || !contenedor) {
    return;
  }

  productosCargados = false;
  estado.hidden = false;
  estado.className = 'estado-productos';
  estado.replaceChildren();

  if (sinResultados) {
    sinResultados.hidden = true;
    sinResultados.replaceChildren();
  }

  const mensajeCarga = document.createElement('p');
  mensajeCarga.textContent = 'Cargando productos...';
  estado.appendChild(mensajeCarga);
  contenedor.replaceChildren();

  try {
    const res = await fetch(URL_PRODUCTOS, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY
      }
    });

    if (!res.ok) {
      throw new Error(res.status);
    }

    const productos = await res.json();
    productosCompletos = productos;
    productosCargados = true;
    estado.hidden = true;
    estado.replaceChildren();
    generarOpcionesCategoria(productosCompletos);
    aplicarFiltros();
    return productos;
  } catch (error) {
    productosCompletos = [];
    productosCargados = false;
    estado.hidden = false;
    estado.className = 'estado-productos estado-productos--error';
    estado.replaceChildren();

    const mensajeError = document.createElement('p');
    mensajeError.textContent = 'No se pudieron cargar los productos. Código: ' + error.message;

    const reintentar = document.createElement('button');
    reintentar.type = 'button';
    reintentar.textContent = 'Reintentar';
    reintentar.addEventListener('click', cargarProductos);

    estado.appendChild(mensajeError);
    estado.appendChild(reintentar);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarFiltros();
  cargarProductos();
});
