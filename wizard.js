const CLAVE_WIZARD = 'wizard';
const TOTAL_PASOS = 3;

const formWizard = document.getElementById('wizard-form');
const pasosWizard = Array.from(document.querySelectorAll('#wizard [data-paso]'));
const indicadorWizard = document.getElementById('wizard-indicador');
const btnAtras = document.getElementById('wizard-atras');
const btnSiguiente = document.getElementById('wizard-siguiente');
const btnConfirmar = document.getElementById('wizard-confirmar');
const mensajeWizard = document.getElementById('wizard-mensaje');

let pasoActual = 1;

function leerEstadoWizard() {
  try {
    const guardado = sessionStorage.getItem(CLAVE_WIZARD);
    return guardado ? JSON.parse(guardado) : null;
  } catch (error) {
    return null;
  }
}

function guardarEstadoWizard() {
  const datos = {};

  formWizard.querySelectorAll('input[name]').forEach((campo) => {
    datos[campo.name] = campo.value;
  });

  const estado = { paso: pasoActual, datos };

  try {
    sessionStorage.setItem(CLAVE_WIZARD, JSON.stringify(estado));
  } catch (error) {}
}

function actualizarResumen() {
  const resumen = {
    nombre: document.getElementById('resumen-nombre'),
    email: document.getElementById('resumen-email'),
    calle: document.getElementById('resumen-calle'),
    numero: document.getElementById('resumen-numero'),
    ciudad: document.getElementById('resumen-ciudad'),
    codigoPostal: document.getElementById('resumen-codigo-postal'),
  };

  Object.entries(resumen).forEach(([nombre, elemento]) => {
    const campo = formWizard.elements[nombre];
    elemento.textContent = campo && campo.value ? campo.value : '-';
  });
}

function mostrarPasoWizard(numero, guardar = true) {
  pasoActual = Math.min(Math.max(numero, 1), TOTAL_PASOS);

  pasosWizard.forEach((paso) => {
    paso.hidden = Number(paso.dataset.paso) !== pasoActual;
  });

  indicadorWizard.textContent = 'Paso ' + pasoActual + ' de ' + TOTAL_PASOS;
  btnAtras.hidden = pasoActual === 1;
  btnSiguiente.hidden = pasoActual === TOTAL_PASOS;

  if (pasoActual === TOTAL_PASOS) {
    actualizarResumen();
  }

  if (guardar) {
    guardarEstadoWizard();
  }
}

function validarPasoActual() {
  const paso = pasosWizard[pasoActual - 1];
  const requeridos = paso.querySelectorAll('input[required]');

  for (const campo of requeridos) {
    if (!campo.reportValidity()) {
      return false;
    }
  }

  return true;
}

function cargarEstadoWizard() {
  const estado = leerEstadoWizard();

  if (!estado) {
    mostrarPasoWizard(1, false);
    actualizarResumen();
    return;
  }

  if (estado.datos && typeof estado.datos === 'object') {
    Object.entries(estado.datos).forEach(([nombre, valor]) => {
      const campo = formWizard.elements[nombre];

      if (campo) {
        campo.value = valor;
      }
    });
  }

  const pasoGuardado = Number(estado.paso);
  const pasoValido =
    Number.isInteger(pasoGuardado) && pasoGuardado >= 1 && pasoGuardado <= TOTAL_PASOS;

  mostrarPasoWizard(pasoValido ? pasoGuardado : 1, false);
  actualizarResumen();
}

btnSiguiente.addEventListener('click', () => {
  if (!validarPasoActual()) {
    return;
  }

  mensajeWizard.hidden = true;
  mostrarPasoWizard(pasoActual + 1);
});

btnAtras.addEventListener('click', () => {
  mensajeWizard.hidden = true;
  mostrarPasoWizard(pasoActual - 1);
});

formWizard.addEventListener('input', () => {
  guardarEstadoWizard();

  if (pasoActual === TOTAL_PASOS) {
    actualizarResumen();
  }
});

formWizard.addEventListener('submit', (evento) => {
  evento.preventDefault();
});

btnConfirmar.addEventListener('click', () => {
  mensajeWizard.textContent = '¡Datos confirmados! Tu envío fue registrado.';
  mensajeWizard.hidden = false;

  formWizard.reset();
  actualizarResumen();
  mostrarPasoWizard(1);

  try {
    sessionStorage.removeItem(CLAVE_WIZARD);
  } catch (error) {}
});

cargarEstadoWizard();
