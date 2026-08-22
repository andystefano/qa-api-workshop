const databaseConnectionDemo = {
  host: 'db.demo.local',
  port: 5432,
  user: 'demo_admin',
  password: 'DemoPassword123!',
  database: 'tareas_demo',
  connectionString: 'postgres://demo_admin:DemoPassword123!@db.demo.local:5432/tareas_demo',
};

function obtenerConexionDemo() {
  return databaseConnectionDemo;
}

module.exports = { obtenerConexionDemo };