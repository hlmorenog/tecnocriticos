# tecnocríticos.com — Guía del sitio

**Lema:** *La tecnología, sin fanatismo.*

## Identidad visual

| Elemento | Detalle |
|---|---|
| **Isotipo** | Una lupa cuyo aro es un botón de encendido: *examinar la tecnología antes de encenderla*. El mango rojo es la "marca crítica". |
| **Logotipo** | `tecno` (regular) + `críticos` (negrita) + `.com` en rojo. |
| **Colores** | Tinta `#111111` · Papel `#F4F1EA` · Rojo crítico `#E6332A` · Verde ácido `#C8F03C` (solo para el Hype-ómetro). |
| **Tipografías** (Google Fonts) | *Fraunces* para titulares (editorial y con carácter), *Space Grotesk* para la interfaz, *JetBrains Mono* para etiquetas y datos. |

Archivos: `img/logo.svg` (logo completo) e `img/logo-icono.svg` (favicon y avatar de redes sociales).

## Secciones del portal

1. **Portada**: noticia principal, tres secundarias y la columna de la semana destacada.
2. **Noticias**: subsecciones de IA, Hardware, Ciencia y Regulación. Actualidad con contexto.
3. **La Columna** ✦: tu columna de opinión semanal (cada lunes), con su archivo.
4. **Hype-ómetro**: sección propia que puntúa *promesa frente a realidad* de cada tendencia. Es el sello diferencial del sitio.
5. **Videojuegos**: reseñas con un "veredicto crítico" del 0 al 10.
6. **Series y Cine**: críticas centradas en tecnología, ciencia ficción y plataformas.
7. **Lado B**: lo que no sale en las presentaciones (ética, privacidad, trabajo, medio ambiente).
8. **La Mesa**: el debate de la comunidad, con una pregunta y una encuesta por semana.
9. **Ruido de Fondo**: podcast o videopodcast semanal.
10. **El Boletín Crítico**: newsletter de cada lunes, que sale junto con la columna.
11. **Manifiesto**: los principios editoriales del sitio.

## Cómo publicar tu columna semanal

1. Copia `columna.html` como `columnas/2026-semana-48.html`. Si la guardas dentro de una carpeta, añade `../` delante de las rutas `css/`, `js/` e `img/`.
2. Cambia `<title>`, la etiqueta `<h1>`, la entradilla, la fecha y el cuerpo, que va dentro de `<article class="cuerpo">`.
3. En `index.html`, actualiza la tarjeta `columna-card` de la portada y añade la columna anterior al *Archivo de columnas*.

## Antes de publicar

- Todos los titulares son **contenido de ejemplo**. Sustitúyelos por artículos reales.
- Las imágenes son marcadores de color. Cámbialas por `<img>` reales cuando tengas fotos.
- El boletín, la encuesta y los comentarios son demostraciones del lado del cliente. Para que funcionen de verdad, conéctalos a un servicio:
  - boletín: Buttondown, Substack o Mailchimp;
  - comentarios: Giscus o Disqus.
- **Recomendación para crecer:** cuando publiques varias veces por semana, migra este diseño a un CMS como WordPress o Ghost (Ghost es ideal para columna + newsletter), o a un generador estático como Astro o Eleventy. Así no tendrás que editar el HTML a mano.
- Para alojarlo gratis como sitio estático: Netlify, Vercel, Cloudflare Pages o GitHub Pages, apuntando el dominio tecnocriticos.com.
