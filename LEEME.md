# tecnocriticos.com — Guía del sitio

**Lema:** *La tecnología, sin fanatismo.*
**Sitio:** https://tecnocriticos.com (GitHub Pages, publicado desde la rama `main`).

## Identidad visual (rediseño 2026)

| Elemento | Detalle |
|---|---|
| **Fondo** | Blanco siempre, sin modo oscuro. |
| **Colores** | Tinta `#111111` · Rojo `#E4322B` · Gris de texto `#737373` · Líneas `#E4E4E0`. |
| **Tipografías** (Google Fonts) | *Inter Tight* para titulares e interfaz, *Newsreader* para el texto de lectura, *IBM Plex Mono* para etiquetas y datos. |
| **Logo** | Provisional (punto rojo + «tecnocríticos»), a la espera del logo definitivo. |
| **Alineación** | Todo va dentro de un mismo contenedor de 1200 px: los bloques empiezan y terminan en los mismos bordes. |

## Estructura de la portada

1. **Noticia principal**: foto, cifra clave, «Por qué importa» y el recuadro *La noticia / La mirada crítica / Lo que falta saber*.
2. **Lo que pasó**: el resto de noticias del día, con foto y una línea en negrita.
3. **Columna derecha**: En 1 minuto · **La Mesa** (destacada) · La Columna · Hype-ómetro · Ruido de Fondo · Explora.
   La columna derecha se ajusta sola para terminar a la misma altura que el contenido: oculta bloques secundarios o enlaces de «Explora» si sobran, y reparte el espacio si faltan.
4. **Manifiesto**, **Boletín** y pie.

Páginas: `index.html` (portada), `noticias.html` (archivo con filtro por sección), `noticia.html?id=…` (una noticia), `columna.html` (La Columna).

## Cómo se editan las páginas

Las cuatro páginas se generan con `herramientas/generar_paginas.py`, para que la cabecera, la columna derecha y el pie sean idénticos en todas:

- **Debate de La Mesa, Hype-ómetro, manifiesto, menú y resumen de la columna**: se editan al principio de `herramientas/generar_paginas.py`.
- **Texto de la columna semanal**: `herramientas/columna_actual.html`.
- Después de editar, ejecuta `python3 herramientas/generar_paginas.py` desde la raíz del repositorio.
- **No edites `index.html`, `noticias.html`, `noticia.html` ni `columna.html` a mano**: se sobrescriben al generar.

## Noticias diarias automáticas

- Cada mañana, a las 5:47 a. m. (hora de Colombia), una tarea programada prepara la edición del día siguiendo `automatizacion/noticias.md` y abre un **pull request** con `noticias/AAAA-MM-DD.json` y sus fotos en `img/noticias/`.
- Cada noticia trae: titular, titular corto, entradilla, «Por qué importa», una línea de dato, cifra clave (si la hay), cuerpo, mirada crítica, «Lo que falta saber», foto libre con crédito y fuentes.
- **Para publicar:** revisa el pull request y pulsa **Merge pull request** (o pídeselo a Claude). En uno o dos minutos aparece en el sitio.
- **Para cambiar tono, temas, cantidad o reglas de fotos:** edita `automatizacion/noticias.md`.
- Las noticias se cargan desde los archivos JSON, así que al abrir `index.html` directamente desde tu PC se ve vacío. Usa el sitio publicado o un servidor local (`python3 -m http.server`).

## Pendiente

- **La Mesa**: hoy el voto se guarda solo en el navegador de cada visitante. Para sumar votos reales y publicar argumentos hace falta un servicio externo de encuestas y comentarios.
- **Boletín**: el formulario aún no está conectado (sugerencia: Buttondown).
- **Comentarios de La Columna**: por conectar.
- **Podcast Ruido de Fondo** y **Reseñas**: secciones previstas, sin contenido todavía.
- **Logo definitivo**: reemplazar el logo provisional de la cabecera (`.logo` en `herramientas/generar_paginas.py`) y `logo-icono.svg`.
