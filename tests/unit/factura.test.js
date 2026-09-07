/**
 * Pruebas unitarias del orquestador calcularFactura / validarFactura.
 * Siguen siendo unitarias: no hay HTTP, pero combinan las tres funciones.
 */

const { calcularFactura, validarFactura } = require('../../src/factura');
const { calculoLinea, suma, calculoIVA } = require('../../src/calculos');

describe('calcularFactura', () => {
  test('calcula línea a línea, suma, IVA y total', () => {
    // Por qué: es el flujo de negocio completo que luego expondrá la API
    const resultado = calcularFactura([
      { monto: 1000, cantidad: 2 },
      { monto: 500, cantidad: 1 },
    ]);

    const linea1 = calculoLinea(1000, 2);
    const linea2 = calculoLinea(500, 1);
    const subtotalEsperado = suma(linea1, linea2);
    const ivaEsperado = calculoIVA(subtotalEsperado, 0.19);
    const totalEsperado = suma(subtotalEsperado, ivaEsperado);

    expect(resultado.lineas[0].subtotal).toBe(linea1);
    expect(resultado.lineas[1].subtotal).toBe(linea2);
    expect(resultado.subtotal).toBe(subtotalEsperado);
    expect(resultado.iva).toBe(ivaEsperado);
    expect(resultado.total).toBe(totalEsperado);
    expect(resultado.total).toBe(2975);
  });
});

describe('validarFactura', () => {
  test('rechaza body sin líneas', () => {
    // Por qué: una factura vacía no tiene sentido de negocio
    expect(validarFactura({ lineas: [] }).ok).toBe(false);
  });

  test('rechaza monto negativo', () => {
    // Por qué: montos negativos romperían el total de la venta
    const resultado = validarFactura({
      lineas: [{ monto: -10, cantidad: 1 }],
    });
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toMatch(/monto/i);
  });

  test('acepta factura válida con tasa por defecto', () => {
    // Por qué: caso feliz mínimo antes de llegar al endpoint
    const resultado = validarFactura({
      lineas: [{ monto: 100, cantidad: 2 }],
    });
    expect(resultado.ok).toBe(true);
    expect(resultado.valor.tasaIva).toBe(0.19);
  });
});
