/**
 * Fábrica de la aplicación Express.
 * Exportamos una función (no el servidor escuchando) para poder
 * probar los endpoints con Supertest sin abrir un puerto real.
 */

const express = require('express');
const { RepositorioTareas } = require('./repositorio');
const { crearRouterTareas } = require('./rutas/tareas');

/**
 * Crea una app Express lista para usar.
 * @param {RepositorioTareas} [repositorio] - opcional; si no se pasa, se crea uno nuevo
 */
function crearApp(repositorio = new RepositorioTareas()) {
  const app = express();

  // Permite leer JSON en el body de las peticiones
  app.use(express.json());

  // Monta las rutas de tareas y estadísticas
  app.use(crearRouterTareas(repositorio));

  // Ruta de salud simple (útil para verificar que el servidor arrancó)
  app.get('/', (req, res) => {
    res.status(200).json({
      mensaje: 'API de tareas — PRO402',
      documentacion: 'Ver README.md',
    });
  });

  return app;
}

module.exports = { crearApp };
