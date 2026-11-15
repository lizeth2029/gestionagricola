# GESTION AGRICOLA V34.8 — Multi-mapa por sector

## Objetivo

V34.8 permite que el supervisor seleccione el mapa que utilizará en la jornada. Cada mapa mantiene su propio catálogo cartográfico, registros, informe, fecha de trabajo e historial. Los datos de `Proyecto 2026` se conservan con las claves locales históricas y no se migran ni se mezclan con los sectores nuevos.

## Mapas disponibles

| Mapa | Asociaciones habilitadas | Bloqueadas | Etiquetas de superficie sin código |
|---|---:|---:|---:|
| Proyecto 2026 | 738 | 0 | — |
| PALTOS CASETA 2 Y 3 | 620 | 5 | 6 |
| PALTOS SECTOR 7 | 273 | 0 | 0 |
| PALTOS SECTOR 8 | 307 | 6 | 7 |

Los 1.200 registros habilitados de los tres mapas nuevos superan una validación espacial automatizada conservadora. No equivale a una revisión topográfica manual: los casos dudosos no se habilitan. La auditoría completa está en `AUDITORIA_MULTI_MAPA_V34_8.csv`; los 24 pendientes están aislados en `PENDIENTES_VALIDACION_V34_8.csv`.

## Integridad de cuarteles y hectáreas

- Los nombres y las superficies se extraen de las etiquetas de cada SVG de origen.
- La asociación nombre-superficie es uno-a-uno y se calcula con las cajas tipográficas medidas por Inkscape.
- Sólo se habilitan asociaciones mutuamente más cercanas, con distancia máxima de 15 unidades SVG y una segunda alternativa al menos 1,25 veces más distante.
- Las asociaciones que no cumplen estos criterios quedan `PENDIENTE_VALIDACION`; no pueden registrarse.
- Las etiquetas de hectáreas que no tienen un código asociado no se asignan a ningún cuartel.
- Los catálogos, etiquetas y manifests tienen SHA-256 fijado en `maps/catalog.json` y en la aplicación. El instalador offline comprueba además las huellas de los recursos de cada mapa.
- Cada registro guarda `mapId`, `mapName`, versión de catálogo y huella del SVG de origen.

## Limpieza de PALTOS SECTOR 7

La fuente runtime es `fuentes_v34_8/PALTOS_SECTOR_7_limpio.svg`. Se retiró la capa `0 Agua` y las trazas de marcadores azules y rosados superpuestas (trazos `#0000ff`, `#fb88ff` y rellenos magenta/azul). Se conservaron las etiquetas azules de códigos de cuartel, los nombres, las hectáreas y el resto de geometría. La fuente limpia conserva 208 etiquetas de texto azules y no contiene trazas de marcador azul/rosado.

También se conserva `PALTOS_SECTOR_7_original.svg` para comparación y trazabilidad.

## Estructura de archivos

```text
index.html
sw.js
manifest.webmanifest
maps/
  catalog.json
  paltos-caseta-2-y-3/
    manifest.json
    cuarteles-fuente.json
    labels.json
    extras.json
    vista-general.jpg
    resumen-vectores.svg
    foto/
    vectores/
  paltos-sector-7/
    ...
  paltos-sector-8/
    ...
map-svg/                 # recursos optimizados existentes de Proyecto 2026
fuentes_v34_8/           # SVG originales y fuente limpia para auditoría
AUDITORIA_MULTI_MAPA_V34_8.csv
PENDIENTES_VALIDACION_V34_8.csv
```

## Rendimiento móvil

- Cada mapa nuevo usa una imagen general de fotografía, un SVG vectorial de resumen y recursos detallados divididos en teselas.
- Teselas fotográficas: 512 unidades de mapa con salida de 1024 × 1024 píxeles (2×).
- Teselas vectoriales: 1024 unidades de mapa por archivo SVG.
- Para los mapas nuevos, la aplicación limita a ocho las teselas vectoriales simultáneas para controlar memoria en Safari/iPhone y Android.
- El mapa `Proyecto 2026` conserva su estructura y caché histórica.

## Uso

1. Abrir la aplicación y entrar en **Datos de la jornada**.
2. Seleccionar **Mapa de trabajo para esta jornada**.
3. Abrir el mapa y, con conexión, pulsar **Instalar mapa** para dejar ese sector disponible sin conexión.
4. Instalar por separado cada mapa que el equipo vaya a necesitar offline.
5. Registrar sólo cuarteles habilitados. Los pendientes aparecen bloqueados.

## Publicación

Para actualizar un repositorio GitHub existente, usar el contenido de `GESTION_AGRICOLA_V34_8_GITHUB_ACTUALIZACION.zip` y conservar las carpetas actuales `assets/` y `map-svg/`. Para una instalación completa, usar `GESTION_AGRICOLA_V34_8_COMPLETO_iPhone_Android.zip`.

Después de publicar, abrir la página mediante HTTPS, actualizar la aplicación y descargar cada mapa desde su pantalla. No eliminar `map-svg/`: contiene el mapa histórico `Proyecto 2026`.
