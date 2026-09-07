/**
 * Fábrica de la aplicación Express.
 * Exportamos crearApp (sin listen) para poder probar con Supertest.
 */

const express = require('express');
const { crearRouterFactura } = require('./rutas/factura');

function crearApp() {
  const app = express();

  app.use(express.json());
  app.use(crearRouterFactura());

  app.get('/', (req, res) => {
    res.status(200).json({
      mensaje: 'API de cálculo de factura — PRO402',
      documentacion: 'Ver README.md',
      endpoint: 'POST /factura/calcular',
    });
  });

  return app;
}

module.exports = { crearApp };
