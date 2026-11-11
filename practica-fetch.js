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

// Ejecutamos la versión async al cargar el script
cargarEmailsAsync();
