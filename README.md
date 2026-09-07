# API de Factura — Workshop PRO402

Proyecto educativo para el curso universitario **Testing y Calidad de Software (PRO402)**.

Los estudiantes aprenden a escribir **pruebas unitarias** y **pruebas de integración** sobre funciones de cálculo de una factura y una API REST que las combina.

## ¿Para qué sirve?

- Practicar pruebas sobre funciones puras: `suma`, `calculoLinea` y `calculoIVA`.
- Ver cómo las **mismas funciones** se reutilizan en un flujo de negocio (venta) expuesto por HTTP.
- Distinguir unitarias (función aislada) vs integración (línea → suma → IVA → total vía API).

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

La API queda en `http://localhost:3000`.

### Endpoint principal

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/factura/calcular` | Calcula líneas, subtotal, IVA y total |

Body de ejemplo:

```json
{
  "lineas": [
    { "monto": 1000, "cantidad": 2 },
    { "monto": 500, "cantidad": 1 }
  ],
  "tasaIva": 0.19
}
```

Respuesta (resumen):

- cada línea incluye `subtotal` (= `calculoLinea(monto, cantidad)`)
- `subtotal` = `suma` de los subtotales de línea
- `iva` = `calculoIVA(subtotal, tasaIva)` (por defecto 19 %)
- `total` = `suma(subtotal, iva)`

```bash
curl -X POST http://localhost:3000/factura/calcular \
  -H "Content-Type: application/json" \
  -d "{\"lineas\":[{\"monto\":1000,\"cantidad\":2},{\"monto\":500,\"cantidad\":1}],\"tasaIva\":0.19}"
```

## Funciones de negocio (las mismas en unit e integración)

| Función | Qué hace |
|---------|----------|
| `calculoLinea(monto, cantidad)` | Multiplica precio × cantidad |
| `suma(...nvalores)` | Suma n valores (lista o argumentos sueltos) |
| `calculoIVA(base, tasa)` | Calcula el impuesto sobre la base |

Están en [`src/calculos.js`](src/calculos.js). El orquestador [`src/factura.js`](src/factura.js) las combina.

## Cómo correr las pruebas

```bash
npm test                  # todas
npm run test:unit         # solo unitarias
npm run test:integration  # solo integración
```

## Qué tipo de prueba cubre qué parte

| Parte del código | Archivo(s) | Tipo | Qué valida |
|------------------|------------|------|------------|
| `suma`, `calculoLinea`, `calculoIVA` | `src/calculos.js` | Unitaria | Multiplicación, suma de n valores, IVA, límites y redondeo |
| `calcularFactura` / `validarFactura` | `src/factura.js` | Unitaria | Orquestación y validaciones de entrada |
| `POST /factura/calcular` | `src/rutas/factura.js` + `src/app.js` | Integración | Flujo HTTP: líneas → subtotal → IVA → total, errores 400 |

## Estructura del proyecto

```
src/
  calculos.js         # suma, calculoLinea, calculoIVA
  factura.js          # validar + calcular factura (usa calculos)
  app.js              # Express sin listen
  server.js           # Arranque
  rutas/factura.js    # POST /factura/calcular
tests/
  unit/               # Pruebas de funciones puras
  integration/        # Pruebas del endpoint con Supertest
  helpers/appTest.js
ejemplos_casos_prueba.md
```

## Material de apoyo

En [`ejemplos_casos_prueba.md`](ejemplos_casos_prueba.md) hay 5 casos de prueba en formato de tabla.
