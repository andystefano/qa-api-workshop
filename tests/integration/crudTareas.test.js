/**
 * Pruebas de integración del CRUD de tareas.
 * Usan Supertest sobre la app Express (sin abrir puerto real).
 */

const request = require('supertest');
const { crearAppDePrueba } = require('../helpers/appTest');

describe('CRUD /tareas', () => {
  let app;

  beforeEach(() => {
    // App + repositorio nuevos en cada test → aislamiento total
    ({ app } = crearAppDePrueba());
  });

  test('POST /tareas crea una tarea válida (caso feliz)', async () => {
    // Por qué: verifica el flujo completo crear → 201 + cuerpo esperado
    const respuesta = await request(app)
      .post('/tareas')
      .send({
        titulo: 'Aprender Jest',
        descripcion: 'Escribir primeras pruebas',
        estado: 'pendiente',
      });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject({
      id: 1,
      titulo: 'Aprender Jest',
      descripcion: 'Escribir primeras pruebas',
      estado: 'pendiente',
    });
    expect(respuesta.body.fecha_creacion).toBeDefined();
  });

  test('GET /tareas lista las tareas existentes', async () => {
    // Por qué: tras crear, el listado debe reflejar el estado del sistema
    await request(app).post('/tareas').send({ titulo: 'Uno' });
    await request(app).post('/tareas').send({ titulo: 'Dos' });

    const respuesta = await request(app).get('/tareas');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(2);
  });

  test('GET /tareas/:id obtiene una tarea por id', async () => {
    // Por qué: caso feliz de lectura individual
    const creada = await request(app)
      .post('/tareas')
      .send({ titulo: 'Detalle' });

    const respuesta = await request(app).get(`/tareas/${creada.body.id}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.titulo).toBe('Detalle');
  });

  test('GET /tareas/:id responde 404 si no existe', async () => {
    // Por qué: el cliente debe distinguir "no hay recurso" de otros errores
    const respuesta = await request(app).get('/tareas/999');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body.error).toMatch(/no encontrada/i);
  });

  test('PUT /tareas/:id actualiza campos válidos', async () => {
    // Por qué: el ciclo CRUD completo incluye modificación
    const creada = await request(app)
      .post('/tareas')
      .send({ titulo: 'Borrador', estado: 'pendiente' });

    const respuesta = await request(app)
      .put(`/tareas/${creada.body.id}`)
      .send({ titulo: 'Final', estado: 'completada' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.titulo).toBe('Final');
    expect(respuesta.body.estado).toBe('completada');
  });

  test('PUT /tareas/:id responde 404 si no existe', async () => {
    // Por qué: actualizar un id inexistente no debe crear la tarea en silencio
    const respuesta = await request(app)
      .put('/tareas/42')
      .send({ titulo: 'Fantasma' });

    expect(respuesta.status).toBe(404);
  });

  test('DELETE /tareas/:id elimina y responde 204', async () => {
    // Por qué: DELETE exitoso no necesita cuerpo; 204 es el código semántico correcto
    const creada = await request(app)
      .post('/tareas')
      .send({ titulo: 'Temporal' });

    const respuesta = await request(app).delete(`/tareas/${creada.body.id}`);
    expect(respuesta.status).toBe(204);

    const busqueda = await request(app).get(`/tareas/${creada.body.id}`);
    expect(busqueda.status).toBe(404);
  });

  test('DELETE /tareas/:id responde 404 si no existe', async () => {
    // Por qué: borrar dos veces el mismo id debe fallar la segunda
    const respuesta = await request(app).delete('/tareas/1');
    expect(respuesta.status).toBe(404);
  });

  test('POST /tareas responde 400 si el título es demasiado corto', async () => {
    // Por qué: la validación de negocio debe exponerse como error HTTP 400
    const respuesta = await request(app)
      .post('/tareas')
      .send({ titulo: 'ab' });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toBeDefined();
  });

  test('POST /tareas responde 400 si el estado es inválido', async () => {
    // Por qué: estados fuera del catálogo no deben persistirse
    const respuesta = await request(app)
      .post('/tareas')
      .send({ titulo: 'Tarea válida', estado: 'archivada' });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/estado/i);
  });

  test('POST /tareas acepta título en el límite inferior (3 caracteres)', async () => {
    // Por qué: valores límite válidos deben pasar también a nivel HTTP
    const respuesta = await request(app)
      .post('/tareas')
      .send({ titulo: 'abc' });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.titulo).toBe('abc');
  });

  test('POST /tareas acepta título en el límite superior (100 caracteres)', async () => {
    // Por qué: el techo de 100 debe ser inclusivo en la API
    const titulo = 'x'.repeat(100);
    const respuesta = await request(app).post('/tareas').send({ titulo });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.titulo).toHaveLength(100);
  });

  test('POST /tareas responde 400 si el título supera 100 caracteres', async () => {
    // Por qué: límite superior + 1 debe rechazarse en la frontera HTTP
    const respuesta = await request(app)
      .post('/tareas')
      .send({ titulo: 'x'.repeat(101) });

    expect(respuesta.status).toBe(400);
  });

  test('PUT /tareas/:id responde 400 con estado inválido', async () => {
    // Por qué: la validación también aplica en actualización, no solo en creación
    const creada = await request(app)
      .post('/tareas')
      .send({ titulo: 'Editable' });

    const respuesta = await request(app)
      .put(`/tareas/${creada.body.id}`)
      .send({ estado: 'invalido' });

    expect(respuesta.status).toBe(400);
  });
});
