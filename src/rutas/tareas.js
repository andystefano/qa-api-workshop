/**
 * Rutas HTTP del recurso "tareas" y del endpoint de estadísticas.
 * Aquí solo se traduce HTTP <-> lógica de negocio.
 */

const express = require('express');
const {
  validarCreacion,
  validarActualizacion,
} = require('../validaciones');

/**
 * Crea el router de tareas inyectando el repositorio.
 * Inyectar el repo permite que cada prueba use una instancia limpia.
 * @param {import('../repositorio').RepositorioTareas} repositorio
 */
function crearRouterTareas(repositorio) {
  const router = express.Router();

  // POST /tareas — crear una tarea
  router.post('/tareas', (req, res) => {
    const validacion = validarCreacion(req.body);
    if (!validacion.ok) {
      return res.status(400).json({ error: validacion.mensaje });
    }

    const tarea = repositorio.crear(validacion.valor);
    return res.status(201).json(tarea);
  });

  // GET /tareas — listar todas
  router.get('/tareas', (req, res) => {
    return res.status(200).json(repositorio.listar());
  });

  // GET /tareas/:id — obtener una por id
  router.get('/tareas/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El id debe ser un entero positivo' });
    }

    const tarea = repositorio.obtenerPorId(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json(tarea);
  });

  // PUT /tareas/:id — actualizar
  router.put('/tareas/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El id debe ser un entero positivo' });
    }

    const validacion = validarActualizacion(req.body);
    if (!validacion.ok) {
      return res.status(400).json({ error: validacion.mensaje });
    }

    const tarea = repositorio.actualizar(id, validacion.valor);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json(tarea);
  });

  // DELETE /tareas/:id — eliminar
  router.delete('/tareas/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El id debe ser un entero positivo' });
    }

    const eliminada = repositorio.eliminar(id);
    if (!eliminada) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(204).send();
  });

  // GET /estadisticas — conteo por estado
  router.get('/estadisticas', (req, res) => {
    return res.status(200).json(repositorio.obtenerEstadisticas());
  });

  return router;
}

module.exports = { crearRouterTareas };
