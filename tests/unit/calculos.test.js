/**
 * Pruebas unitarias de las funciones de cálculo.
 * No levantan Express ni hacen peticiones HTTP.
 * Estas mismas funciones se reutilizan en el flujo de integración.
 */

const {
  TASA_IVA_DEFAULT,
  suma,
  calculoLinea,
  calculoIVA,
} = require('../../src/calculos');

describe('calculoLinea(monto, cantidad)', () => {
  test('multiplica monto por cantidad (caso feliz)', () => {
    // Por qué: es la operación base de cada línea de venta
    expect(calculoLinea(1000, 3)).toBe(3000);
  });

  test('acepta decimales y redondea a 2 decimales', () => {
    // Por qué: los precios reales suelen tener centavos
    expect(calculoLinea(10.555, 2)).toBe(21.11);
  });

  test('con cantidad 0 el subtotal es 0', () => {
    // Por qué: valor límite inferior; una línea vacía no suma al total
    expect(calculoLinea(500, 0)).toBe(0);
  });

  test('con monto 0 el subtotal es 0', () => {
    // Por qué: valor límite; producto gratuito no afecta el subtotal
    expect(calculoLinea(0, 5)).toBe(0);
  });

  test('con cantidad 1 devuelve el mismo monto', () => {
    // Por qué: identidad de la multiplicación; útil como caso límite
    expect(calculoLinea(250, 1)).toBe(250);
  });
});

describe('suma(...nvalores)', () => {
  test('suma varios números sueltos', () => {
    // Por qué: permite sumar subtotales sin armar arreglo previo
    expect(suma(100, 200, 50)).toBe(350);
  });

  test('suma un arreglo de valores', () => {
    // Por qué: en la factura los subtotales llegan como lista
    expect(suma([100, 200, 50])).toBe(350);
  });

  test('con un solo valor lo devuelve redondeado', () => {
    // Por qué: caso límite de "n = 1"
    expect(suma(99.999)).toBe(100);
  });

  test('con lista vacía el resultado es 0', () => {
    // Por qué: suma neutra; evita NaN si no hay líneas calculadas
    expect(suma([])).toBe(0);
  });

  test('suma subtotal + IVA para obtener el total', () => {
    // Por qué: documenta el uso exacto que hará calcularFactura
    const subtotal = 1000;
    const iva = calculoIVA(subtotal, 0.19);
    expect(suma(subtotal, iva)).toBe(1190);
  });
});

describe('calculoIVA(baseImponible, tasa)', () => {
  test('calcula 19 % por defecto', () => {
    // Por qué: tasa por defecto del taller (Chile)
    expect(calculoIVA(1000)).toBe(190);
    expect(TASA_IVA_DEFAULT).toBe(0.19);
  });

  test('acepta una tasa distinta', () => {
    // Por qué: permite simular otros impuestos o escenarios del curso
    expect(calculoIVA(1000, 0.21)).toBe(210);
  });

  test('con base 0 el IVA es 0', () => {
    // Por qué: valor límite; no hay impuesto sin base imponible
    expect(calculoIVA(0)).toBe(0);
  });

  test('con tasa 0 el IVA es 0', () => {
    // Por qué: exento de IVA debe dejar el total igual al subtotal
    expect(calculoIVA(1000, 0)).toBe(0);
  });

  test('redondea centavos correctamente', () => {
    // Por qué: 100 * 0.19 = 19 exacto; 33.33 * 0.19 requiere redondeo
    expect(calculoIVA(33.33, 0.19)).toBe(6.33);
  });
});
