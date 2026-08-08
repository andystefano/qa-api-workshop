/**
 * Reglas de negocio de tareas.
 * Estas funciones NO conocen Express ni HTTP: solo reciben datos y
 * devuelven { ok: true } o { ok: false, mensaje }.
 * Así se pueden probar con pruebas unitarias sin levantar la API.
 */

/** Estados permitidos en el sistema de tareas. */
const ESTADOS_VALIDOS = ['pendiente', 'en_progreso', 'completada'];

const TITULO_MIN = 3;
const TITULO_MAX = 100;

/**
 * Valida el título de una tarea.
 * @param {*} titulo
 * @returns {{ ok: true } | { ok: false, mensaje: string }}
 */
function validarTitulo(titulo) {
  // El título debe existir y ser texto (evita null, números, etc.)
  if (typeof titulo !== 'string') {
    return {
      ok: false,
      mensaje: 'El título es obligatorio y debe ser un texto',
    };
  }

  const tituloLimpio = titulo.trim();

  if (tituloLimpio.length === 0) {
    return {
      ok: false,
      mensaje: 'El título es obligatorio',
    };
  }

  if (tituloLimpio.length < TITULO_MIN) {
    return {
      ok: false,
      mensaje: `El título debe tener al menos ${TITULO_MIN} caracteres`,
    };
  }

  if (tituloLimpio.length > TITULO_MAX) {
    return {
      ok: false,
      mensaje: `El título no puede superar ${TITULO_MAX} caracteres`,
    };
  }

  return { ok: true, valor: tituloLimpio };
}

/**
 * Valida el estado de una tarea.
 * @param {*} estado
 * @returns {{ ok: true, valor: string } | { ok: false, mensaje: string }}
 */
function validarEstado(estado) {
  if (typeof estado !== 'string') {
    return {
      ok: false,
      mensaje: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`,
    };
  }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return {
      ok: false,
      mensaje: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`,
    };
  }

  return { ok: true, valor: estado };
}

/**
 * Valida la descripción (opcional). Si no viene, se acepta como cadena vacía.
 * @param {*} descripcion
 * @returns {{ ok: true, valor: string } | { ok: false, mensaje: string }}
 */
function validarDescripcion(descripcion) {
  if (descripcion === undefined || descripcion === null) {
    return { ok: true, valor: '' };
  }

  if (typeof descripcion !== 'string') {
    return {
      ok: false,
      mensaje: 'La descripción debe ser un texto',
    };
  }

  return { ok: true, valor: descripcion };
}

/**
 * Valida el cuerpo completo para crear una tarea.
 * El estado por defecto es "pendiente" si no se envía.
 * @param {object} datos
 */
function validarCreacion(datos) {
  if (!datos || typeof datos !== 'object') {
    return { ok: false, mensaje: 'El cuerpo de la petición es inválido' };
  }

  const titulo = validarTitulo(datos.titulo);
  if (!titulo.ok) {
    return titulo;
  }

  const descripcion = validarDescripcion(datos.descripcion);
  if (!descripcion.ok) {
    return descripcion;
  }

  // Si no envían estado al crear, usamos "pendiente" (caso feliz típico)
  const estadoEntrada =
    datos.estado === undefined || datos.estado === null
      ? 'pendiente'
      : datos.estado;

  const estado = validarEstado(estadoEntrada);
  if (!estado.ok) {
    return estado;
  }

  return {
    ok: true,
    valor: {
      titulo: titulo.valor,
      descripcion: descripcion.valor,
      estado: estado.valor,
    },
  };
}

/**
 * Valida el cuerpo para actualizar una tarea (campos parciales permitidos).
 * Debe venir al menos un campo editable.
 * @param {object} datos
 */
function validarActualizacion(datos) {
  if (!datos || typeof datos !== 'object') {
    return { ok: false, mensaje: 'El cuerpo de la petición es inválido' };
  }

  const hayCampos =
    datos.titulo !== undefined ||
    datos.descripcion !== undefined ||
    datos.estado !== undefined;

  if (!hayCampos) {
    return {
      ok: false,
      mensaje: 'Debe enviar al menos un campo para actualizar',
    };
  }

  const resultado = {};

  if (datos.titulo !== undefined) {
    const titulo = validarTitulo(datos.titulo);
    if (!titulo.ok) {
      return titulo;
    }
    resultado.titulo = titulo.valor;
  }

  if (datos.descripcion !== undefined) {
    const descripcion = validarDescripcion(datos.descripcion);
    if (!descripcion.ok) {
      return descripcion;
    }
    resultado.descripcion = descripcion.valor;
  }

  if (datos.estado !== undefined) {
    const estado = validarEstado(datos.estado);
    if (!estado.ok) {
      return estado;
    }
    resultado.estado = estado.valor;
  }

  return { ok: true, valor: resultado };
}

module.exports = {
  ESTADOS_VALIDOS,
  TITULO_MIN,
  TITULO_MAX,
  validarTitulo,
  validarEstado,
  validarDescripcion,
  validarCreacion,
  validarActualizacion,
};
