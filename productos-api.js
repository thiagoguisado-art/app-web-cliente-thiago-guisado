const URL_PRODUCTOS = SUPABASE_URL + '/rest/v1/productos?select=*&order=id.asc';

function formatearPrecioProducto(valor) {
  return '$' + Number(valor).toLocaleString('es-AR');
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

async function cargarProductos() {
  const estado = document.getElementById('estado-productos');
  const contenedor = document.getElementById('contenedor-productos');

  if (!estado || !contenedor) {
    return;
  }

  estado.hidden = false;
  estado.className = 'estado-productos';
  estado.replaceChildren();

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
    estado.hidden = true;
    estado.replaceChildren();
    dibujarProductos(productos);
    return productos;
  } catch (error) {
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

document.addEventListener('DOMContentLoaded', cargarProductos);
