/**
 * Pruebas unitarias de las reglas de negocio (validaciones).
 * No levantan Express ni hacen peticiones HTTP.
 */

const {
  TITULO_MIN,
  TITULO_MAX,
  validarTitulo,
  validarEstado,
  validarCreacion,
  validarActualizacion,
} = require('../../src/validaciones');

describe('validarTitulo', () => {
  test('rechaza un título que no es texto', () => {
    // Por qué: evita que un cliente envíe null/número y rompa el resto de la lógica
    const resultado = validarTitulo(123);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toMatch(/texto/i);
  });

  test('rechaza un título vacío o solo espacios', () => {
    // Por qué: un título en blanco no tiene sentido de negocio
    expect(validarTitulo('').ok).toBe(false);
    expect(validarTitulo('   ').ok).toBe(false);
  });

  test('rechaza un título con menos de 3 caracteres', () => {
    // Por qué: protege el límite inferior (valor límite - 1)
    const resultado = validarTitulo('ab');
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toContain(String(TITULO_MIN));
  });

  test('acepta un título con exactamente 3 caracteres', () => {
    // Por qué: el límite inferior válido debe pasar (boundary value)
    const resultado = validarTitulo('abc');
    expect(resultado.ok).toBe(true);
    expect(resultado.valor).toBe('abc');
  });

  test('acepta un título con exactamente 100 caracteres', () => {
    // Por qué: el límite superior válido debe pasar
    const titulo = 'a'.repeat(TITULO_MAX);
    const resultado = validarTitulo(titulo);
    expect(resultado.ok).toBe(true);
    expect(resultado.valor).toHaveLength(TITULO_MAX);
  });

  test('rechaza un título con más de 100 caracteres', () => {
    // Por qué: protege el límite superior (valor límite + 1)
    const titulo = 'a'.repeat(TITULO_MAX + 1);
    const resultado = validarTitulo(titulo);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toContain(String(TITULO_MAX));
  });

  test('recorta espacios al inicio y al final', () => {
    // Por qué: "  hola  " no debería fallar ni guardar espacios basura
    const resultado = validarTitulo('  hola mundo  ');
    expect(resultado.ok).toBe(true);
    expect(resultado.valor).toBe('hola mundo');
  });
});

describe('validarEstado', () => {
  test('acepta los tres estados definidos', () => {
    // Por qué: documenta el contrato de valores válidos
    expect(validarEstado('pendiente').ok).toBe(true);
    expect(validarEstado('en_progreso').ok).toBe(true);
    expect(validarEstado('completada').ok).toBe(true);
  });

  test('rechaza un estado desconocido', () => {
    // Por qué: evita estados inventados que romperían estadísticas y filtros
    const resultado = validarEstado('cancelada');
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toMatch(/pendiente|en_progreso|completada/);
  });
});

describe('validarCreacion', () => {
  test('crea un payload válido con estado por defecto pendiente', () => {
    // Por qué: al crear sin estado, el negocio asume "pendiente"
    const resultado = validarCreacion({
      titulo: 'Estudiar testing',
      descripcion: 'Repasar unitarias',
    });

    expect(resultado.ok).toBe(true);
    expect(resultado.valor.estado).toBe('pendiente');
    expect(resultado.valor.titulo).toBe('Estudiar testing');
  });

  test('falla si el cuerpo es inválido', () => {
    // Por qué: una petición sin body no debe llegar al repositorio
    expect(validarCreacion(null).ok).toBe(false);
  });
});

describe('validarActualizacion', () => {
  test('exige al menos un campo editable', () => {
    // Por qué: un PUT vacío no cambia nada y suele indicar error del cliente
    const resultado = validarActualizacion({});
    expect(resultado.ok).toBe(false);
  });

  test('acepta actualizar solo el estado', () => {
    // Por qué: las actualizaciones parciales son el caso de uso más común
    const resultado = validarActualizacion({ estado: 'completada' });
    expect(resultado.ok).toBe(true);
    expect(resultado.valor).toEqual({ estado: 'completada' });
  });
});
