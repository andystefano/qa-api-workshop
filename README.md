# API de Tareas — Workshop PRO402

Proyecto educativo para el curso universitario **Testing y Calidad de Software (PRO402)**.

Los estudiantes aprenden a escribir **pruebas unitarias** y **pruebas de integración** sobre una API REST real de gestión de tareas (To-Do), con código simple y comentarios en español.

## ¿Para qué sirve?

- Practicar el diseño de casos de prueba (felices, de error y valores límite).
- Distinguir qué se prueba en unitarias (lógica pura) y qué en integración (HTTP + rutas).
- Ejecutar una API local y validar respuestas `200`, `201`, `204`, `400` y `404`.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Cómo correr la API

```bash
npm start
```

La API queda disponible en `http://localhost:3000`.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/tareas` | Crear tarea |
| `GET` | `/tareas` | Listar todas |
| `GET` | `/tareas/:id` | Obtener por id |
| `PUT` | `/tareas/:id` | Actualizar |
| `DELETE` | `/tareas/:id` | Eliminar |
| `GET` | `/estadisticas` | Conteo por estado |

Campos de una tarea: `id`, `titulo`, `descripcion`, `estado` (`pendiente` \| `en_progreso` \| `completada`), `fecha_creacion`.

Reglas de negocio:

- Título obligatorio, entre 3 y 100 caracteres.
- Estado solo acepta los valores definidos.
- Descripción opcional.

Ejemplo de creación:

```bash
curl -X POST http://localhost:3000/tareas ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo\":\"Estudiar testing\",\"descripcion\":\"Repasar Jest\",\"estado\":\"pendiente\"}"
```

En macOS/Linux puedes usar comillas simples:

```bash
curl -X POST http://localhost:3000/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudiar testing","descripcion":"Repasar Jest","estado":"pendiente"}'
```

## Cómo correr las pruebas

Todas las pruebas:

```bash
npm test
```

Solo unitarias (validaciones y repositorio, sin HTTP):

```bash
npm run test:unit
```

Solo de integración (endpoints con Supertest):

```bash
npm run test:integration
```

La separación se configura en `jest.config.js` con dos proyectos Jest (`unit` e `integration`), equivalentes pedagógicos a marcadores de pytest.

## Qué tipo de prueba cubre qué parte

| Parte del código | Archivo(s) | Tipo de prueba | Qué valida |
|------------------|------------|----------------|------------|
| Reglas de título, estado y payloads | `src/validaciones.js` | Unitaria | Límites 3–100, estados válidos, errores de negocio |
| Almacenamiento en memoria | `src/repositorio.js` | Unitaria | Crear, listar, obtener, actualizar, eliminar, estadísticas |
| Endpoints CRUD | `src/rutas/tareas.js` + `src/app.js` | Integración | Códigos HTTP, JSON de respuesta, 400/404 |
| Endpoint de estadísticas | `src/rutas/tareas.js` | Integración | Conteo por estado vía HTTP |

## Estructura del proyecto

```
src/
  app.js              # Fábrica de la app Express
  server.js           # Arranque del servidor
  validaciones.js     # Reglas de negocio puras
  repositorio.js      # CRUD en memoria
  rutas/tareas.js     # Endpoints REST
tests/
  helpers/appTest.js  # App + repo limpio para integración
  unit/               # Pruebas unitarias
  integration/        # Pruebas de integración
ejemplos_casos_prueba.md
```

## Material de apoyo

En [`ejemplos_casos_prueba.md`](ejemplos_casos_prueba.md) hay 5 casos de prueba en formato de tabla para usar como referencia al diseñar nuevos escenarios.

## Guía de alertas de seguridad

Este proyecto incluye ejemplos aislados para enseñar alertas de GitHub sin afectar la API principal:

| Archivo | Alerta esperada | Qué aprende el alumno |
|--------|------------------|------------------------|
| [`examples/alertas/secret-demo.js`](examples/alertas/secret-demo.js) | Secret Protection / secret scanning | Detectar credenciales expuestas y entender por qué nunca deben subirse al repositorio |
| [`examples/alertas/codeql-demo.js`](examples/alertas/codeql-demo.js) | CodeQL | Identificar una ejecución insegura de comandos y aprender a evitarla |

Para ver las alertas en GitHub:

1. Subir los cambios a una rama del repositorio.
2. Abrir un pull request o revisar el análisis en la pestaña **Security**.
3. Confirmar que en el repositorio estén activadas las opciones de **Code scanning** y **Secret scanning**.

Los ejemplos están separados en la carpeta `examples/alertas/` para que se puedan borrar o reemplazar fácilmente cuando termine la clase.
