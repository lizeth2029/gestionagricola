# GESTIÓN AGRÍCOLA V34.14 — Auditoría de jornada y rotación geoespacial

## Objetivo
Corregir la interpretación del bloqueo de informes cuando existen registros activos en otras fechas, estandarizar los marcadores de tractor y añadir rotación multitáctil de 360° al visor SVG sin modificar los datos cartográficos.

## 1. Informe y auditoría
- El mensaje genérico «Informe bloqueado: revisa superficies» se sustituye por el motivo real de validación.
- Si la fecha seleccionada no tiene cuarteles, se informa cuántos registros activos hay en total y en qué fechas están guardados.
- Se añaden accesos rápidos para seleccionar una fecha que sí contiene registros; no se cambia la fecha ni los registros automáticamente.
- La tabla inferior aclara que muestra registros activos de todas las fechas, mientras que el informe usa solamente la fecha seleccionada.
- Los errores reales de auditoría siguen bloqueando el informe y muestran el cuartel y la causa: ID espacial, mapa, hectáreas, versión del catálogo, huella del SVG o desglose compuesto.
- Guardar una jornada vacía sigue estando bloqueado para evitar archivar datos incorrectos.

### Referencia de C-25
En el catálogo Proyecto 2026 incluido en V34.13, C-25 figura como `auto_C-25`, 3,05 ha y `ASOCIACION_UNICA`. No se altera su superficie ni su identificador.

## 2. Marcadores
- Los tractores mantienen un tamaño visual uniforme de aproximadamente 23–28 píxeles CSS según el ancho del visor.
- El tamaño deja de depender de la altura de cada etiqueta SVG y del nivel de zoom.
- La posición continúa anclada a la etiqueta original del cuartel.
- El canvas de marcadores conserva antialiasing y resolución de pantalla; no se rasteriza el plano SVG.

## 3. Rotación del mapa
- Gesto de dos dedos: pellizcar para zoom y girar los dedos para rotar.
- La rotación acumula ángulos y permite completar 360° y giros adicionales.
- El punto cartográfico bajo el centro de los dedos se conserva al combinar zoom, giro y desplazamiento.
- La selección de cuarteles usa la transformación inversa, evitando errores de hit-testing cuando el mapa está girado.
- La carga de sectores SVG calcula el área visible a partir de las cuatro esquinas transformadas del visor.
- El control de restablecer vista devuelve zoom, desplazamiento y orientación a cero.
- El gesto de rotación funciona también en la vista histórica; la selección de registros sigue siendo de solo lectura allí.

## Integridad de datos
- No se modifican catálogos, IDs geográficos, hectáreas, reglas de superficies compuestas, etiquetas, geometrías SVG, fotografías ni mosaicos.
- No se desactiva ni relaja ninguna validación de superficie.
- Las cachés cartográficas mantienen sus nombres; solo se renueva la caché del shell de interfaz a V34.14.
- No se requiere borrar almacenamiento local ni reinstalar los mapas.

## Publicación en GitHub / Cloudflare Pages
1. Exportar respaldo JSON de las jornadas.
2. Descomprimir el ZIP de actualización en la raíz del repositorio.
3. Reemplazar `index.html`, `sw.js` y `manifest.webmanifest` (el manifest se incluye sin cambios funcionales para mantener el paquete uniforme).
4. No borrar carpetas de mapas, SVG, catálogos, etiquetas, fotos ni datos.
5. Hacer commit/push y esperar el despliegue de Cloudflare Pages.
6. Abrir con internet y recargar una vez para activar el Service Worker V34.14.
7. Probar selección de fecha, informe, WhatsApp, marcadores, zoom, rotación y restablecimiento.

## Estado de validación
Las pruebas estáticas, sintácticas y matemáticas de transformación se completaron. La comprobación física en iPhone 13/Safari y Android debe realizarse después del despliegue.
