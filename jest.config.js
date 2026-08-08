/**
 * Configuración de Jest con dos "proyectos":
 * - unit: pruebas de lógica sin HTTP
 * - integration: pruebas de endpoints con Supertest
 *
 * Equivalente pedagógico a los marcadores unit/integration de pytest.
 */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
    },
  ],
};
