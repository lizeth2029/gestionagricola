# GESTION AGRICOLA V34.9 — Multi-mapa, historial global y validación de superficies

## Cambios principales

- Selector de mapa de trabajo para Proyecto 2026, PALTOS CASETA 2 Y 3, PALTOS SECTOR 7 y PALTOS SECTOR 8.
- El mapa activo se guarda por jornada; los registros y borradores continúan separados por `mapId`.
- El historial ahora reúne jornadas de todos los mapas. Al pulsar **Abrir en panel**, la aplicación cambia al mapa de origen de esa jornada antes de mostrar sus cuarteles.
- Los informes de WhatsApp, tablas e historial muestran `CUARTEL: hectáreas` sin coordenadas internas.
- Se habilitaron 11 asociaciones que el supervisor confirmó visualmente contra el SVG original. Se conserva su ID geográfico; no se usa una búsqueda aproximada durante el registro.
- Se incorporaron superficies compuestas en PALTOS SECTOR 8:
  - A-496: 0,11 + 0,10 = 0,21 ha.
  - A-457: 0,28 + 0,11 = 0,39 ha.
  - A-254: 0,13 + 0,05 = 0,18 ha.
- Se corrigió el manifiesto de Proyecto 2026 agregando `sourceSvgSHA256` y actualizando las huellas en el catálogo. Esto corrige el error “Manifest cartográfico incorrecto o desactualizado”.
- El Service Worker V34.9 actualiza metadatos en las cachés existentes sin borrar las fotografías ni los vectores ya instalados.
- La primera carga con conexión instala automáticamente los cuatro mapas. La descarga se realiza por mapa, con un máximo de dos solicitudes simultáneas. Los recursos completos que ya estén en caché se omiten; los recursos faltantes se reanudan sin repetir los demás.
- Los datos de los mapas permanecen en cachés independientes; el historial global conserva el `mapId` para impedir mezclas.

## Catálogos

| Mapa | Cuarteles habilitados | Bloqueados | Total de cuarteles |
|---|---:|---:|---:|
| Proyecto 2026 | 738 | 0 | 738 |
| PALTOS CASETA 2 Y 3 | 625 | 0 | 625 |
| PALTOS SECTOR 7 | 273 | 0 | 273 |
| PALTOS SECTOR 8 | 313 | 0 | 313 |

**Total de cuarteles catalogados: 1.949.** Las 10 etiquetas de hectáreas que aún no tienen código inequívoco se mantienen en `PENDIENTES_VALIDACION_V34_9.csv`; no se asignan automáticamente a ningún cuartel.

## Seguridad de datos

- Las 11 asociaciones manuales se guardan con `revisionManual=true`, `revisionManualVersion` y un ID geográfico único.
- Las hectáreas base siguen cotejándose con las etiquetas originales del SVG. Las sumas compuestas se verifican contra los índices y coordenadas de cada etiqueta.
- Los informes y exportaciones se bloquean si el registro no coincide con el mapa, el ID y las hectáreas esperadas.
- La migración de historial se ejecuta una vez: combina los historiales V34.8 guardados en claves por mapa dentro de un historial global, sin borrar las claves antiguas.
- No borres los datos del navegador al actualizar. Exporta antes un respaldo JSON.

## Instalación en GitHub / Cloudflare Pages

1. Descomprime `GESTION_AGRICOLA_V34_9_GITHUB_ACTUALIZACION.zip` en la raíz del repositorio.
2. Reemplaza los archivos y agrega los catálogos/manifiestos indicados en el ZIP. No borres `map-svg/` ni los recursos de `maps/` que ya existan.
3. Haz commit/push. Cloudflare Pages publicará el repositorio.
4. Abre la web con conexión y deja que termine la instalación automática de los cuatro mapas.
5. Verifica que el botón diga **Todos los mapas instalados ✓**. Después prueba cada mapa, un registro conocido y el historial general.

Para una instalación nueva desde cero, usa el paquete completo. El paquete de actualización supone que las carpetas cartográficas de V34.8 ya están en el repositorio.

## Pruebas automatizadas ejecutadas

- Sintaxis JavaScript del HTML y Service Worker.
- SHA-256 del catálogo general, de los cuatro manifiestos, catálogos y etiquetas.
- Existencia de todos los recursos enumerados en los manifiestos.
- Concordancia de nombre, etiqueta y hectáreas para los catálogos PALTOS.
- Verificación de los 11 registros confirmados y sus IDs.
- Verificación de las tres sumas compuestas y sus etiquetas fuente.
- Verificación de la versión y `sourceSvgSHA256` de Proyecto 2026.

La prueba física en Safari de iPhone 13 y en los dispositivos Android de supervisión debe realizarse después de publicar. No se declara aprobada sin esa comprobación.
