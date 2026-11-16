# GESTIÓN AGRÍCOLA V34.15 — Nuevo mapa PALTOS Y CEREZAS CASETA 1

## Incorporación
Se agrega el mapa **PALTOS Y CEREZAS · CASETA 1** como una quinta opción del selector multi-mapa.

- Identificador: `paltos-y-cerezas-caseta-1`
- SVG fuente: `fuentes_v34_15/PALTOS_Y_CEREZAS_CASETA_1_ORIGINAL.svg`
- SHA-256 de la fuente: `19d2a9365df8f2854668a33ca54fe0fdf210ce89f6e9de2e95d9dc6221d3dd7f`
- Dimensiones SVG: 3370 × 2384 unidades
- Catálogo: 40 cuarteles, 40 habilitados, 0 bloqueados
- Etiquetas extraídas: 116
- Suma aritmética de las hectáreas impresas: 15,26 ha
- Vectores: 512 × 512 unidades por sector, 7 columnas × 5 filas
- Fotografía: 512 unidades por sector, teselas JPEG de 1024 × 1024 píxeles (2×)
- Recursos instalables: 75 recursos del manifiesto más el propio manifiesto

## Cuarteles extraídos del SVG
Los nombres y superficies se han tomado literalmente de las etiquetas del archivo SVG. La asociación se realizó por proximidad entre cajas tipográficas, con validación de vecino mutuo, distancia máxima de 15 unidades y razón de segunda opción mínima de 1,25. En este mapa los 40 pares resultaron mutuos; la mayor distancia fue 5.7454 y la menor razón de segunda opción fue 2.2385.

- B-1: 0,78 ha
- B-2: 0,40 ha
- B-3: 0,43 ha
- B-4: 0,12 ha
- B-5: 0,17 ha
- B-6: 0,17 ha
- B-7: 0,10 ha
- B-8: 0,17 ha
- B-9: 0,35 ha
- B-10: 0,36 ha
- B-12: 0,32 ha
- B-11: 0,22 ha
- B-15: 0,21 ha
- B-16: 0,30 ha
- B-14: 0,71 ha
- B-13: 0,26 ha
- B-17: 0,11 ha
- B-18: 0,12 ha
- B-19: 0,17 ha
- B-20: 0,15 ha
- B-24: 0,58 ha
- B-21: 0,51 ha
- B-23: 0,18 ha
- B-25: 0,18 ha
- B-22: 0,14 ha
- B-26: 0,43 ha
- S-53: 0,77 ha
- S-54: 0,51 ha
- S-55: 0,19 ha
- S-56: 0,22 ha
- S-57: 0,24 ha
- S-58: 1,00 ha
- S-59: 0,57 ha
- S-60: 0,54 ha
- S-61: 0,12 ha
- S-62: 0,67 ha
- S-63: 0,46 ha
- S-64: 0,14 ha
- S-65: 1,34 ha
- S-66: 0,85 ha

**Importante:** los valores no se recalcularon ni se redondearon desde geometrías; se conservaron las superficies impresas en el SVG. La suma 15,26 ha es una suma de control de esas etiquetas, no una nueva medición topográfica.

## Compatibilidad y rendimiento
- El visor utiliza teselas vectoriales SVG; no se rasterizan las geometrías.
- Las fotografías se sirven en teselas JPEG 2×, sin convertir a WEBP.
- El tamaño de tesela vectorial se fija en 512 unidades para reducir el pico de memoria por sector en Safari/iPhone.
- La vista general carga una capa vectorial resumida; al acercar, se sustituyen por los sectores vectoriales completos.
- La caché del mapa es independiente (`agrovalle-map-v34-8-paltos-y-cerezas-caseta-1`), sin borrar las cachés de los mapas anteriores.
- El mapa nuevo se incorpora al instalador global y al historial multi-mapa.

## Archivos modificados
- `index.html`: registro del nuevo hash del catálogo, versión de shell v34.15 y conteo dinámico mínimo de cinco mapas para el atajo de caché.
- `sw.js`: versión v34.15; precache y copia de metadatos del mapa nuevo a su caché independiente.
- `maps/catalog.json`: nueva quinta entrada.
- `maps/paltos-y-cerezas-caseta-1/`: manifiesto, catálogo, etiquetas, vista general, resumen vectorial, 35 teselas vectoriales y 35 teselas fotográficas.

No se alteran las geometrías ni los catálogos de los cuatro mapas existentes.
