# GESTION AGRICOLA V34.10

## Novedades

### Historial visual por mapa
- Se reemplaza la acción **Abrir en panel** por **Ver mapa**.
- Al abrir una jornada, la aplicación selecciona en memoria el mapa de origen y marca exclusivamente los cuarteles de esa jornada que superan la auditoría de ID geográfico y hectáreas.
- Se muestra fecha, mapa, número de cuarteles y total aplicado en un encabezado de consulta.
- La consulta es de solo lectura: no permite abrir el modal de registro ni modificar o eliminar cuarteles desde el mapa.
- La lista Cuarteles muestra únicamente los elementos registrados en esa jornada y deshabilita sus controles.
- **Volver al historial** sale de la consulta y restaura el mapa de trabajo que estaba activo antes de abrir el registro histórico.
- La selección de mapa hecha sólo para consultar un registro histórico no se guarda como mapa de trabajo predeterminado.

### UX de exteriores
- Se incorpora el botón **Modo sol**, persistente por dispositivo.
- Aumenta contraste de texto, etiquetas, controles, tablas, formularios y tarjetas.
- Reduce transparencias y desenfoques en modo exterior para mejorar legibilidad bajo luz intensa.
- Aumenta el tamaño mínimo de botones y controles táctiles.
- No altera el SVG, la fotografía satelital, las coordenadas, las superficies ni la escala de los vectores.

### Favicon
- Se agrega `assets/favicon.ico` y `assets/favicon-logo.png`, basados en el logo de Gestión Agrícola que aparece en el encabezado.
- El Service Worker V34.10 precarga ambos recursos para disponibilidad offline.

## Instalación en un repositorio GitHub existente

1. Exportar un respaldo JSON de los registros antes de actualizar.
2. Descomprimir `GESTION_AGRICOLA_V34_10_GITHUB_ACTUALIZACION.zip` en la raíz del repositorio.
3. Reemplazar `index.html` y `sw.js`.
4. Agregar `assets/favicon.ico` y `assets/favicon-logo.png`.
5. No eliminar ni reemplazar `map-svg/`, `maps/`, `assets/fontawesome/`, las fotos ni los vectores existentes.
6. Hacer commit/push y esperar el despliegue de Cloudflare Pages.
7. Abrir la aplicación con conexión y esperar que el Service Worker V34.10 se active.
8. Recargar la página. No borrar los datos del sitio ni el almacenamiento local.

## Validación de datos y seguridad

- No se modifica ningún catálogo de cuarteles ni etiqueta de hectáreas.
- No se recalculan superficies ni se reasignan IDs.
- La vista histórica sólo pinta filas cuyo mapa, ID geográfico y superficie coinciden con el catálogo auditado.
- Si una fila no pasa la auditoría, queda sin marcador y se informa como bloqueada; nunca se estima su posición por proximidad.
- Los registros activos e históricos se conservan en sus claves existentes.

## Pruebas

- `node --check` sobre el JavaScript inline y el Service Worker.
- Verificación de referencias de favicon, versión de shell y rutas offline.
- Verificación estática de que la acción anterior ya no está presente y que existe la acción nueva.
- Prueba física pendiente en Safari de iPhone 13 y en el dispositivo Android de los supervisores.

**Importante:** una validación estática no equivale a una prueba de campo. Antes de usar la consulta histórica en producción, probar una jornada de cada mapa y comprobar que los marcadores coincidan con los cuarteles originales.
