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
