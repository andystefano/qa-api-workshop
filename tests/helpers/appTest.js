/**
 * Helper para pruebas de integración: app Express lista para Supertest.
 */

const { crearApp } = require('../../src/app');

function crearAppDePrueba() {
  return crearApp();
}

module.exports = { crearAppDePrueba };
