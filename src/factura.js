/**
 * Orquesta el cálculo completo de una factura
 * reutilizando suma, calculoLinea y calculoIVA.
 */

const {
  TASA_IVA_DEFAULT,
  suma,
  calculoLinea,
  calculoIVA,
} = require('./calculos');

/**
 * Valida el cuerpo de una factura antes de calcular.
 * @param {*} datos
 * @returns {{ ok: true, valor: object } | { ok: false, mensaje: string }}
 */
function validarFactura(datos) {
  if (!datos || typeof datos !== 'object') {
    return { ok: false, mensaje: 'El cuerpo de la petición es inválido' };
  }

  const { lineas, tasaIva } = datos;

  if (!Array.isArray(lineas) || lineas.length === 0) {
    return {
      ok: false,
      mensaje: 'Debe enviar al menos una línea de venta en "lineas"',
    };
  }

  for (let i = 0; i < lineas.length; i += 1) {
    const linea = lineas[i];
    if (!linea || typeof linea !== 'object') {
      return { ok: false, mensaje: `La línea ${i + 1} es inválida` };
    }

    if (typeof linea.monto !== 'number' || Number.isNaN(linea.monto)) {
      return {
        ok: false,
        mensaje: `La línea ${i + 1}: "monto" debe ser un número`,
      };
    }

    if (typeof linea.cantidad !== 'number' || Number.isNaN(linea.cantidad)) {
      return {
        ok: false,
        mensaje: `La línea ${i + 1}: "cantidad" debe ser un número`,
      };
    }

    if (linea.monto < 0) {
      return {
        ok: false,
        mensaje: `La línea ${i + 1}: "monto" no puede ser negativo`,
      };
    }

    if (linea.cantidad < 0) {
      return {
        ok: false,
        mensaje: `La línea ${i + 1}: "cantidad" no puede ser negativa`,
      };
    }
  }

  let tasa = TASA_IVA_DEFAULT;
  if (tasaIva !== undefined && tasaIva !== null) {
    if (typeof tasaIva !== 'number' || Number.isNaN(tasaIva)) {
      return { ok: false, mensaje: '"tasaIva" debe ser un número' };
    }
    if (tasaIva < 0 || tasaIva > 1) {
      return {
        ok: false,
        mensaje: '"tasaIva" debe estar entre 0 y 1 (ejemplo: 0.19 = 19 %)',
      };
    }
    tasa = tasaIva;
  }

  return {
    ok: true,
    valor: { lineas, tasaIva: tasa },
  };
}

/**
 * Calcula una factura completa:
 * 1) subtotal por línea (calculoLinea)
 * 2) suma de líneas (suma)
 * 3) IVA sobre el subtotal (calculoIVA)
 * 4) total = subtotal + IVA (suma)
 *
 * @param {Array<{ monto: number, cantidad: number }>} lineas
 * @param {number} [tasaIva]
 */
function calcularFactura(lineas, tasaIva = TASA_IVA_DEFAULT) {
  const lineasCalculadas = lineas.map((linea) => {
    const subtotal = calculoLinea(linea.monto, linea.cantidad);
    return {
      monto: linea.monto,
      cantidad: linea.cantidad,
      subtotal,
    };
  });

  const subtotales = lineasCalculadas.map((linea) => linea.subtotal);
  const subtotal = suma(subtotales);
  const iva = calculoIVA(subtotal, tasaIva);
  const total = suma(subtotal, iva);

  return {
    lineas: lineasCalculadas,
    subtotal,
    iva,
    total,
    tasaIva,
  };
}

module.exports = {
  validarFactura,
  calcularFactura,
};
