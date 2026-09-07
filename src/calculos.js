/**
 * Funciones de cálculo de una factura.
 * Son funciones puras: solo reciben números y devuelven números.
 * Las mismas se usan en pruebas unitarias y, a través de la API, en integración.
 */

/** Tasa de IVA por defecto (19 %). */
const TASA_IVA_DEFAULT = 0.19;

/**
 * Redondea a 2 decimales (centavos), típico en montos de dinero.
 * @param {number} valor
 * @returns {number}
 */
function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Suma n valores numéricos.
 * Acepta lista: suma(10, 20, 30) o un arreglo: suma([10, 20, 30]).
 * @param {...number|number[]} nvalores
 * @returns {number}
 */
function suma(...nvalores) {
  const valores =
    nvalores.length === 1 && Array.isArray(nvalores[0])
      ? nvalores[0]
      : nvalores;

  let total = 0;
  for (const valor of valores) {
    total += Number(valor);
  }

  return redondear(total);
}

/**
 * Calcula el subtotal de una línea de venta: monto × cantidad.
 * @param {number} monto - precio unitario
 * @param {number} cantidad - unidades
 * @returns {number}
 */
function calculoLinea(monto, cantidad) {
  return redondear(Number(monto) * Number(cantidad));
}

/**
 * Calcula el IVA sobre una base imponible.
 * @param {number} baseImponible - monto sobre el que se aplica el impuesto
 * @param {number} [tasa=0.19] - tasa en decimal (0.19 = 19 %)
 * @returns {number}
 */
function calculoIVA(baseImponible, tasa = TASA_IVA_DEFAULT) {
  return redondear(Number(baseImponible) * Number(tasa));
}

module.exports = {
  TASA_IVA_DEFAULT,
  redondear,
  suma,
  calculoLinea,
  calculoIVA,
};
