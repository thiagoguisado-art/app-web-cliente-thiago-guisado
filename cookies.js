function setCookie(nombre, valor, dias) {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);

  document.cookie =
    encodeURIComponent(nombre) +
    '=' +
    encodeURIComponent(valor) +
    '; expires=' +
    fecha.toUTCString() +
    '; path=/; SameSite=Lax';
}

function getCookie(nombre) {
  const objetivo = encodeURIComponent(nombre) + '=';
  const partes = document.cookie ? document.cookie.split(';') : [];

  for (const parte of partes) {
    const limpia = parte.trim();

    if (limpia.indexOf(objetivo) === 0) {
      return decodeURIComponent(limpia.substring(objetivo.length));
    }
  }

  return null;
}

const bannerCookies = document.getElementById('banner-cookies');
const btnAceptarCookies = document.getElementById('btn-aceptar-cookies');

if (!getCookie('cookies_aceptadas')) {
  bannerCookies.hidden = false;
}

btnAceptarCookies.addEventListener('click', () => {
  setCookie('cookies_aceptadas', 'true', 30);
  bannerCookies.hidden = true;
});
