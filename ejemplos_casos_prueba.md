# Ejemplos de casos de prueba

Referencia para el curso **PRO402**. Cada fila representa un caso de prueba diseñado *antes* o *junto* a la automatización.

| ID | Descripción | Entrada | Resultado esperado | Tipo |
|----|-------------|---------|--------------------|------|
| CP-01 | Crear tarea con datos válidos | `POST /tareas` con `titulo="Estudiar Jest"` (12 caracteres), `estado="pendiente"` | HTTP `201`, cuerpo con `id`, mismo título y `fecha_creacion` | Integración |
| CP-02 | Rechazar título por debajo del mínimo | Función `validarTitulo("ab")` (2 caracteres) | `{ ok: false }` y mensaje que mencione el mínimo de 3 | Unitaria |
| CP-03 | Aceptar título en el límite superior | `POST /tareas` con título de exactamente 100 caracteres | HTTP `201` y `titulo` de longitud 100 | Integración |
| CP-04 | Consultar tarea inexistente | `GET /tareas/999` sin haber creado esa tarea | HTTP `404` y mensaje "Tarea no encontrada" | Integración |
| CP-05 | Contar tareas por estado | Repositorio con 2 pendientes, 1 en progreso y 1 completada | `{ pendiente: 2, en_progreso: 1, completada: 1, total: 4 }` | Unitaria |

## Cómo usar esta tabla

1. Identifica la **precondición** (sistema vacío, tarea ya creada, etc.).
2. Define la **entrada** concreta (valores, no solo “título inválido”).
3. Escribe el **resultado esperado** medible (código HTTP, campos, booleano).
4. Elige el **tipo**: unitaria si pruebas una función pura; integración si atraviesas HTTP.
