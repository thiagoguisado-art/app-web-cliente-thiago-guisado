// Versión con .then(): queda definida pero NO se ejecuta
function cargarEmailsConThen() {
  // Pedimos la lista de usuarios a la API
  fetch('https://jsonplaceholder.typicode.com/users')
    // Primera .then(): verificamos si la respuesta fue OK y la convertimos a JSON
    .then((res) => {
      if (!res.ok) {
        throw new Error('Error en la petición: ' + res.status);
      }
      return res.json();
    })
    // Segunda .then(): recibimos el array de usuarios y mostramos solo los emails
    .then((usuarios) => {
      usuarios.forEach((usuario) => {
        console.log(usuario.email);
      });
    })
    // .catch(): mostramos cualquier error que haya ocurrido
    .catch((error) => {
      console.error(error);
    });
}

// Versión con async/await: el código se lee de arriba a abajo, sin encadenar .then()
async function cargarEmailsAsync() {
  const spinner = document.getElementById('spinner');
  const lista = document.getElementById('lista');

  // Mostramos el spinner antes de empezar la petición
  spinner.hidden = false;

  // try: acá va el flujo normal, esperando cada promesa con await
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');

    // Verificamos la respuesta igual que en la versión .then()
    if (!res.ok) {
      throw new Error('Error en la petición: ' + res.status);
    }

    // await reemplaza al segundo .then(): esperamos el JSON ya parseado
    const usuarios = await res.json();

    // Limpiamos la lista para no duplicar elementos si se vuelve a ejecutar
    lista.innerHTML = '';

    usuarios.forEach((usuario) => {
      // Mostramos solo los emails, uno por línea
      console.log(usuario.email);

      // Creamos un <li> con el nombre y el email de cada usuario
      const item = document.createElement('li');
      item.textContent = usuario.name + ' - ' + usuario.email;
      lista.appendChild(item);
    });
  } catch (error) {
    // catch reemplaza al .catch(): atrapa errores de red, status o parseo
    console.error(error);
  } finally {
    // finally: ocultamos el spinner salga bien o falle
    spinner.hidden = true;
  }
}

// Creamos un post de prueba con una petición POST
async function crearPost() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      // method: indicamos que queremos crear un recurso nuevo
      method: 'POST',
      // headers: avisamos que el body viene en formato JSON
      headers: {
        'Content-Type': 'application/json',
      },
      // body: convertimos el objeto a texto JSON para enviarlo
      body: JSON.stringify({
        title: 'Post de prueba - Thi.store',
        body: 'Practica de la Clase 7',
        userId: 1,
      }),
    });

    // Verificamos que la respuesta haya sido exitosa
    if (!res.ok) {
      throw new Error('Error en la petición: ' + res.status);
    }

    // Parseamos la respuesta y la mostramos junto con el status
    const data = await res.json();
    console.log('Post creado:', data);
    console.log('Status:', res.status);
  } catch (error) {
    // Mostramos cualquier error de red, status o parseo
    console.error(error);
  }
}

// Forzamos un error real pidiendo una URL que no existe
async function cargarConError() {
  const mensajeError = document.getElementById('mensaje-error');

  // Ocultamos y vaciamos cualquier error anterior
  mensajeError.hidden = true;
  mensajeError.textContent = '';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/usuarios-inexistentes');

    // Hay que chequear res.ok porque fetch NO falla solo por un 404 o 500:
    // la promesa se resuelve igual y el error viene en el status
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}: no se encontró el recurso`);
    }
  } catch (error) {
    // Mostramos el mensaje en la página y también en consola
    mensajeError.textContent = error.message;
    mensajeError.hidden = false;
    console.error(error);
  }
}

// Conectamos el botón para que el error se pruebe solo al hacer clic
document.getElementById('btn-error').addEventListener('click', cargarConError);

// Ejecutamos la versión async al cargar el script
cargarEmailsAsync();

// Ejecutamos la creación del post después de cargar los emails
crearPost();
