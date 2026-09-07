/**
 * Rutas HTTP del cálculo de factura.
 * Traduce la petición HTTP a las funciones de negocio (las mismas de las unitarias).
 */

const express = require('express');
const { validarFactura, calcularFactura } = require('../factura');

function crearRouterFactura() {
  const router = express.Router();

  /**
   * POST /factura/calcular
   * Body ejemplo:
   * {
   *   "lineas": [
   *     { "monto": 1000, "cantidad": 2 },
   *     { "monto": 500, "cantidad": 1 }
   *   ],
   *   "tasaIva": 0.19
   * }
   */
  router.post('/factura/calcular', (req, res) => {
    const validacion = validarFactura(req.body);
    if (!validacion.ok) {
      return res.status(400).json({ error: validacion.mensaje });
    }

    const resultado = calcularFactura(
      validacion.valor.lineas,
      validacion.valor.tasaIva
    );

    return res.status(200).json(resultado);
  });

  return router;
}

module.exports = { crearRouterFactura };
