/**
 * Repositorio en memoria de tareas.
 * Usa un Map para guardar tareas por id. Ideal para el taller:
 * no requiere base de datos y se puede reiniciar en cada prueba.
 */

class RepositorioTareas {
  constructor() {
    /** @type {Map<number, object>} */
    this.tareas = new Map();
    this.siguienteId = 1;
  }

  /**
   * Crea una tarea con los datos ya validados.
   * @param {{ titulo: string, descripcion: string, estado: string }} datos
   */
  crear(datos) {
    const tarea = {
      id: this.siguienteId,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      estado: datos.estado,
      fecha_creacion: new Date().toISOString(),
    };

    this.tareas.set(tarea.id, tarea);
    this.siguienteId += 1;

    return { ...tarea };
  }

  /** Devuelve todas las tareas como arreglo. */
  listar() {
    return Array.from(this.tareas.values()).map((tarea) => ({ ...tarea }));
  }

  /**
   * Busca una tarea por id.
   * @param {number} id
   * @returns {object|null}
   */
  obtenerPorId(id) {
    const tarea = this.tareas.get(id);
    return tarea ? { ...tarea } : null;
  }

  /**
   * Actualiza campos de una tarea existente.
   * @param {number} id
   * @param {object} cambios
   * @returns {object|null} la tarea actualizada, o null si no existe
   */
  actualizar(id, cambios) {
    const tarea = this.tareas.get(id);
    if (!tarea) {
      return null;
    }

    const actualizada = {
      ...tarea,
      ...cambios,
      id: tarea.id,
      fecha_creacion: tarea.fecha_creacion,
    };

    this.tareas.set(id, actualizada);
    return { ...actualizada };
  }

  /**
   * Elimina una tarea.
   * @param {number} id
   * @returns {boolean} true si se eliminó, false si no existía
   */
  eliminar(id) {
    return this.tareas.delete(id);
  }

  /**
   * Cuenta cuántas tareas hay por cada estado.
   */
  obtenerEstadisticas() {
    const estadisticas = {
      pendiente: 0,
      en_progreso: 0,
      completada: 0,
      total: this.tareas.size,
    };

    for (const tarea of this.tareas.values()) {
      if (Object.prototype.hasOwnProperty.call(estadisticas, tarea.estado)) {
        estadisticas[tarea.estado] += 1;
      }
    }

    return estadisticas;
  }

  /** Vacía el repositorio (útil en pruebas). */
  limpiar() {
    this.tareas.clear();
    this.siguienteId = 1;
  }
}

module.exports = { RepositorioTareas };
