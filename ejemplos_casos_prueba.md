# Ejemplos de casos de prueba

Referencia para el curso **PRO402** (cálculo de factura).

| ID | Descripción | Entrada | Resultado esperado | Tipo |
|----|-------------|---------|--------------------|------|
| CP-01 | Multiplicar línea de venta | `calculoLinea(1000, 3)` | `3000` | Unitaria |
| CP-02 | Sumar varios subtotales | `suma(2000, 500, 100)` | `2600` | Unitaria |
| CP-03 | Calcular IVA 19 % | `calculoIVA(1000)` | `190` | Unitaria |
| CP-04 | Factura completa vía API | `POST /factura/calcular` con 2 líneas (1000×2 y 500×1), `tasaIva=0.19` | HTTP `200`, `subtotal=2500`, `iva=475`, `total=2975` | Integración |
| CP-05 | Rechazar monto negativo | `POST /factura/calcular` con `monto: -10` | HTTP `400` y mensaje que mencione "monto" | Integración |

## Cómo usar esta tabla

1. Define la **entrada** con valores concretos.
2. Escribe el **resultado esperado** medible (número, código HTTP, mensaje).
3. Elige el **tipo**: unitaria si pruebas una función pura; integración si atraviesas HTTP.
4. Recuerda: en integración se usan las **mismas** funciones `suma`, `calculoLinea` y `calculoIVA`.
