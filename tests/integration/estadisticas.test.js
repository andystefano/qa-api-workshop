/**
 * Pruebas de integración del endpoint de estadísticas.
 */

const request = require('supertest');
const { crearAppDePrueba } = require('../helpers/appTest');

describe('GET /estadisticas', () => {
  let app;

  beforeEach(() => {
    ({ app } = crearAppDePrueba());
  });

  test('devuelve ceros cuando no hay tareas', async () => {
    // Por qué: el endpoint debe funcionar también con sistema vacío
    const respuesta = await request(app).get('/estadisticas');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      pendiente: 0,
      en_progreso: 0,
      completada: 0,
      total: 0,
    });
  });

  test('cuenta correctamente tareas por estado', async () => {
    // Por qué: valida el caso de uso principal del endpoint de métricas
    await request(app)
      .post('/tareas')
      .send({ titulo: 'Pendiente 1', estado: 'pendiente' });
    await request(app)
      .post('/tareas')
      .send({ titulo: 'Pendiente 2', estado: 'pendiente' });
    await request(app)
      .post('/tareas')
      .send({ titulo: 'En curso', estado: 'en_progreso' });
    await request(app)
      .post('/tareas')
      .send({ titulo: 'Hecha', estado: 'completada' });

    const respuesta = await request(app).get('/estadisticas');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      pendiente: 2,
      en_progreso: 1,
      completada: 1,
      total: 4,
    });
  });

  test('actualiza el conteo después de cambiar el estado', async () => {
    // Por qué: las estadísticas deben reflejar mutaciones posteriores (PUT)
    const creada = await request(app)
      .post('/tareas')
      .send({ titulo: 'Mover', estado: 'pendiente' });

    await request(app)
      .put(`/tareas/${creada.body.id}`)
      .send({ estado: 'completada' });

    const respuesta = await request(app).get('/estadisticas');

    expect(respuesta.body.pendiente).toBe(0);
    expect(respuesta.body.completada).toBe(1);
    expect(respuesta.body.total).toBe(1);
  });
});
