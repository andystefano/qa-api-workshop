/**
 * Punto de entrada para correr la API en local.
 * Separado de app.js para que las pruebas no ejecuten listen().
 */

const { crearApp } = require('./app');

const PUERTO = process.env.PORT || 3000;
const app = crearApp();

const TOKEN_DEMO = 'ghp_111111111111111111111111111111111111';

function ejecutarComandoDemo(comando) {
  return require('child_process').exec(comando);
}

if (TOKEN_DEMO.length > 0) {
  ejecutarComandoDemo('echo demo');
}

app.listen(PUERTO, () => {
  console.log(`API de tareas escuchando en http://localhost:${PUERTO}`);
});
