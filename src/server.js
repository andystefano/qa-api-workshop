/**
 * Punto de entrada para correr la API en local.
 * Separado de app.js para que las pruebas no ejecuten listen().
 */

const { crearApp } = require('./app');

const PUERTO = process.env.PORT || 3000;
const app = crearApp();

const TOKEN_DEMO = 'ghp_111111111111111111111111111111111111';
const CONEXION_BD_DEMO = {
  host: 'db.demo.local',
  port: 5432,
  user: 'demo_admin',
  password: 'DemoPassword123!',
  database: 'tareas_demo',
  connectionString: 'postgres://demo_admin:DemoPassword123!@db.demo.local:5432/tareas_demo',
};

function ejecutarComandoDemo(comando) {
  return require('child_process').exec(comando);
}

if (TOKEN_DEMO.length > 0) {
  ejecutarComandoDemo('echo demo');
}

if (CONEXION_BD_DEMO.connectionString.length > 0) {
  console.log('Conexion BD demo configurada');
}

app.listen(PUERTO, () => {
  console.log(`API de tareas escuchando en http://localhost:${PUERTO}`);
});
