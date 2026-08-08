/**
 * Pruebas unitarias del repositorio en memoria.
 * Verifican la lógica de almacenamiento sin pasar por HTTP.
 */

const { RepositorioTareas } = require('../../src/repositorio');

describe('RepositorioTareas', () => {
  /** @type {RepositorioTareas} */
  let repo;

  beforeEach(() => {
    // Cada test parte de un repositorio vacío para no contaminar resultados
    repo = new RepositorioTareas();
  });

  test('crear asigna id incremental y fecha_creacion', () => {
    // Por qué: el id y la fecha son responsabilidad del servidor, no del cliente
    const tarea = repo.crear({
      titulo: 'Tarea 1',
      descripcion: 'Desc',
      estado: 'pendiente',
    });

    expect(tarea.id).toBe(1);
    expect(tarea.fecha_creacion).toBeDefined();
    expect(typeof tarea.fecha_creacion).toBe('string');
  });

  test('listar devuelve todas las tareas creadas', () => {
    // Por qué: GET /tareas depende de que listar no pierda elementos
    repo.crear({ titulo: 'A', descripcion: '', estado: 'pendiente' });
    repo.crear({ titulo: 'B', descripcion: '', estado: 'completada' });

    expect(repo.listar()).toHaveLength(2);
  });

  test('obtenerPorId encuentra una tarea existente', () => {
    // Por qué: caso feliz del GET por id
    const creada = repo.crear({
      titulo: 'Buscar',
      descripcion: '',
      estado: 'pendiente',
    });

    expect(repo.obtenerPorId(creada.id).titulo).toBe('Buscar');
  });

  test('obtenerPorId devuelve null si el id no existe', () => {
    // Por qué: la capa HTTP traduce null a 404; aquí validamos el contrato interno
    expect(repo.obtenerPorId(999)).toBeNull();
  });

  test('actualizar modifica solo los campos enviados', () => {
    // Por qué: una actualización parcial no debe borrar título ni descripción
    const creada = repo.crear({
      titulo: 'Original',
      descripcion: 'Texto',
      estado: 'pendiente',
    });

    const actualizada = repo.actualizar(creada.id, { estado: 'en_progreso' });

    expect(actualizada.titulo).toBe('Original');
    expect(actualizada.descripcion).toBe('Texto');
    expect(actualizada.estado).toBe('en_progreso');
  });

  test('actualizar devuelve null si la tarea no existe', () => {
    // Por qué: permite a la ruta responder 404 sin lanzar excepciones
    expect(repo.actualizar(50, { titulo: 'Nueva' })).toBeNull();
  });

  test('eliminar quita la tarea y devolver true', () => {
    // Por qué: DELETE exitoso debe reflejarse en listar()
    const creada = repo.crear({
      titulo: 'Borrar',
      descripcion: '',
      estado: 'pendiente',
    });

    expect(repo.eliminar(creada.id)).toBe(true);
    expect(repo.obtenerPorId(creada.id)).toBeNull();
  });

  test('eliminar devuelve false si no existía', () => {
    // Por qué: diferencia "no encontrada" de "eliminada"
    expect(repo.eliminar(1)).toBe(false);
  });

  test('obtenerEstadisticas cuenta por estado y el total', () => {
    // Por qué: el endpoint /estadisticas se apoya en este conteo
    repo.crear({ titulo: 'Uno', descripcion: '', estado: 'pendiente' });
    repo.crear({ titulo: 'Dos', descripcion: '', estado: 'pendiente' });
    repo.crear({ titulo: 'Tres', descripcion: '', estado: 'en_progreso' });
    repo.crear({ titulo: 'Cuatro', descripcion: '', estado: 'completada' });

    expect(repo.obtenerEstadisticas()).toEqual({
      pendiente: 2,
      en_progreso: 1,
      completada: 1,
      total: 4,
    });
  });

  test('limpiar deja el repositorio vacío y reinicia ids', () => {
    // Por qué: las pruebas de integración necesitan aislarse entre sí
    repo.crear({ titulo: 'Temp', descripcion: '', estado: 'pendiente' });
    repo.limpiar();

    expect(repo.listar()).toHaveLength(0);
    expect(
      repo.crear({ titulo: 'Nueva', descripcion: '', estado: 'pendiente' }).id
    ).toBe(1);
  });
});
