const btnTema = document.getElementById('btn-tema');

function actualizarBoton(oscuro) {
  btnTema.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
  btnTema.setAttribute('aria-pressed', oscuro ? 'true' : 'false');
}

function aplicarTema(oscuro) {
  document.body.classList.toggle('dark', oscuro);
  actualizarBoton(oscuro);
}

const temaGuardado = storage.get('tema', 'light');

aplicarTema(temaGuardado === 'dark');

btnTema.addEventListener('click', () => {
  const oscuro = document.body.classList.toggle('dark');
  actualizarBoton(oscuro);
  storage.set('tema', oscuro ? 'dark' : 'light');
});
