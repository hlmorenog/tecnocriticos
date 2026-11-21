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
- **No edites `index.html`, `noticias.html`, `noticia.html`, `columna.html`, `quienes-somos.html` ni nada de `n/` a mano**: se sobrescriben al generar.

## Buscadores (SEO) y motores de IA (GEO)

`python3 herramientas/generar_paginas.py` genera todo el sitio estático; las piezas de noticias y buscadores están en `herramientas/generar_noticias.py`.

- **Una página completa por noticia** (`n/<id>.html`): el texto, la foto, la mirada crítica y las fuentes están en el HTML, así que Google y los buscadores con IA (que casi nunca ejecutan JavaScript) las leen completas. `noticia.html?id=…` queda solo para enlaces antiguos: redirige a la página nueva y no se indexa.
- **Datos estructurados (schema.org)**: `NewsArticle` y migas de pan en cada noticia; `NewsMediaOrganization` y `WebSite` en la portada; `OpinionNewsArticle` en la columna; `AboutPage` en quiénes somos.
- **Archivos para rastreadores**: `sitemap.xml` (todas las páginas, con sus fotos), `sitemap-noticias.xml` (formato Google News, últimos 2 días), `feed.xml` (RSS), `robots.txt` (permite todo, también a los buscadores con IA) y `llms.txt` (resumen del sitio para modelos de lenguaje).
- **Confianza**: `quienes-somos.html` explica quién dirige el sitio, los principios, cómo se hacen y verifican las noticias, el uso de IA, la política de fotos y las correcciones. Se edita en `pagina_quienes()` de `herramientas/generar_noticias.py`.
- **Pendiente (lo hace la dirección)**: dar de alta el dominio en Google Search Console y en Bing Webmaster Tools y enviar `https://tecnocriticos.com/sitemap.xml`. Para aparecer en Google Noticias, registrar el medio en Google Publisher Center.

## Compartir en redes sociales

- **Botones**: cada noticia y la columna tienen botones para WhatsApp, Facebook, X, LinkedIn, Telegram, correo y «Copiar enlace». En el celular aparece además «Compartir…», que abre el menú del teléfono (Instagram, TikTok y demás apps instaladas).
- **Vista previa**: cada noticia tiene su propia página estática, `n/<id>.html`, con titular, entradilla y foto en el HTML. Es la dirección pública de la noticia y la que se comparte.
- Las páginas fijas (portada, noticias y columna) usan la imagen `img/compartir.png` (1200 × 630). La columna toma su título y resumen de `herramientas/generar_paginas.py`.
- **Para revisar cómo se verá un enlace**: Facebook ofrece el «Depurador de contenido compartido» (developers.facebook.com/tools/debug) y LinkedIn el «Post Inspector». Si cambias una foto o un titular ya compartido, pásalo por ahí para que actualicen la vista previa.

## Noticias diarias automáticas

- Cada mañana, a las 5:47 a. m. (hora de Colombia), una tarea programada prepara la edición del día siguiendo `automatizacion/noticias.md` y la muestra en el chat. Solo con tu aprobación abre un **pull request** con `noticias/AAAA-MM-DD.json`, sus fotos en `img/noticias/` y sus páginas para compartir en `n/`.
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
