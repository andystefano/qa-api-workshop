/**
 * Punto de entrada para correr la API en local.
 * Separado de app.js para que las pruebas no ejecuten listen().
 */

const { crearApp } = require('./app');

const PUERTO = process.env.PORT || 3000;
const app = crearApp();

app.listen(PUERTO, () => {
  console.log(`API de tareas escuchando en http://localhost:${PUERTO}`);
});
