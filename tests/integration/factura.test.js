/**
 * Pruebas de integración del cálculo de factura.
 * Recorren el flujo HTTP completo:
 * línea por línea → suma (subtotal) → IVA → total.
 * Usan las mismas funciones de negocio que las unitarias.
 */

const request = require('supertest');
const { crearAppDePrueba } = require('../helpers/appTest');
const { calculoLinea, suma, calculoIVA } = require('../../src/calculos');

describe('POST /factura/calcular', () => {
  let app;

  beforeEach(() => {
    app = crearAppDePrueba();
  });

  test('calcula venta línea por línea, suma, IVA y total (caso feliz)', async () => {
    // Por qué: valida el pipeline completo de una venta real vía HTTP
    const body = {
      lineas: [
        { monto: 1000, cantidad: 2 },
        { monto: 500, cantidad: 1 },
      ],
      tasaIva: 0.19,
    };

    const respuesta = await request(app).post('/factura/calcular').send(body);

    const sub1 = calculoLinea(1000, 2);
    const sub2 = calculoLinea(500, 1);
    const subtotal = suma(sub1, sub2);
    const iva = calculoIVA(subtotal, 0.19);
    const total = suma(subtotal, iva);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.lineas).toHaveLength(2);
    expect(respuesta.body.lineas[0].subtotal).toBe(sub1);
    expect(respuesta.body.lineas[1].subtotal).toBe(sub2);
    expect(respuesta.body.subtotal).toBe(subtotal);
    expect(respuesta.body.iva).toBe(iva);
    expect(respuesta.body.total).toBe(total);
  });

  test('usa tasa IVA 19 % por defecto si no se envía', async () => {
    // Por qué: el contrato de la API debe ser usable con el mínimo de campos
    const respuesta = await request(app)
      .post('/factura/calcular')
      .send({ lineas: [{ monto: 1000, cantidad: 1 }] });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.tasaIva).toBe(0.19);
    expect(respuesta.body.iva).toBe(190);
    expect(respuesta.body.total).toBe(1190);
  });

  test('con una sola línea el subtotal es calculoLinea', async () => {
    // Por qué: caso límite de factura con n = 1 línea
    const respuesta = await request(app)
      .post('/factura/calcular')
      .send({ lineas: [{ monto: 250, cantidad: 4 }] });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.subtotal).toBe(calculoLinea(250, 4));
    expect(respuesta.body.lineas[0].subtotal).toBe(1000);
  });

  test('responde 400 si no hay líneas', async () => {
    // Por qué: error de entrada; el cliente debe corregir el body
    const respuesta = await request(app)
      .post('/factura/calcular')
      .send({ lineas: [] });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/línea/i);
  });

  test('responde 400 si el monto es negativo', async () => {
    // Por qué: montos inválidos no deben generar totales incorrectos
    const respuesta = await request(app)
      .post('/factura/calcular')
      .send({ lineas: [{ monto: -5, cantidad: 2 }] });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/monto/i);
  });

  test('responde 400 si la cantidad es negativa', async () => {
    // Por qué: simétrico al monto; protege la integridad del cálculo
    const respuesta = await request(app)
      .post('/factura/calcular')
      .send({ lineas: [{ monto: 10, cantidad: -1 }] });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/cantidad/i);
  });

  test('responde 400 si tasaIva está fuera de rango', async () => {
    // Por qué: 1.5 no es una tasa válida (debe ser decimal 0–1)
    const respuesta = await request(app)
      .post('/factura/calcular')
      .send({
        lineas: [{ monto: 100, cantidad: 1 }],
        tasaIva: 1.5,
      });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/tasaIva/i);
  });

  test('con tasa 0 el total es igual al subtotal', async () => {
    // Por qué: valor límite de IVA exento
    const respuesta = await request(app)
      .post('/factura/calcular')
      .send({
        lineas: [
          { monto: 100, cantidad: 2 },
          { monto: 50, cantidad: 1 },
        ],
        tasaIva: 0,
      });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.iva).toBe(0);
    expect(respuesta.body.total).toBe(respuesta.body.subtotal);
    expect(respuesta.body.total).toBe(250);
  });
});
