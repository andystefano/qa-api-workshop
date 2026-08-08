/**
 * Helper para pruebas de integración:
 * crea una app Express con un repositorio fresco.
 * Así cada test empieza sin datos residuales de otros tests.
 */

const { crearApp } = require('../../src/app');
const { RepositorioTareas } = require('../../src/repositorio');

function crearAppDePrueba() {
  const repositorio = new RepositorioTareas();
  const app = crearApp(repositorio);
  return { app, repositorio };
}

module.exports = { crearAppDePrueba };
