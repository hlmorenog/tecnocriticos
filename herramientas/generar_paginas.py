#!/usr/bin/env python3
"""Genera las páginas HTML de Tecnocríticos con la misma cabecera, columna derecha y pie.

Uso (desde la raíz del repositorio):  python3 herramientas/generar_paginas.py

Las noticias NO se escriben aquí: se cargan solas desde noticias/AAAA-MM-DD.json.
Aquí se editan los bloques fijos: menú, La Mesa, Hype-ómetro, La Columna, manifiesto y pie.
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------- Contenido editable
DEBATE = {
    "id": "2026-s47",
    "pregunta": "¿Pagarías por una red social sin algoritmo ni publicidad?",
    "texto": "¿El modelo «gratis a cambio de tus datos» tiene alternativa? Vota y defiende tu argumento: los mejores se leerán en el podcast.",
    "cierre": "dom. 29 nov.",
    "opciones": ["Sí, sin dudarlo", "Sí, si fuera barata", "No, prefiero lo gratuito", "Ya no uso redes sociales"],
}
COLUMNA = {
    "titulo": "Nadie nos pidió permiso para el futuro",
    "resumen": "Cada keynote promete liberarnos. Cada actualización nos ata un poco más.",
}
HYPE = [  # (tema, promesa, realidad, veredicto)
    ("Agentes de IA que «trabajan por ti»", 96, 48, "Útiles con supervisión. Autónomos, todavía no."),
    ("Gafas de realidad mixta", 88, 35, "Impresionantes en demo, incómodas a la hora."),
    ("Carros totalmente autónomos", 92, 30, "«El año que viene», desde hace una década."),
    ("Celulares plegables", 70, 62, "Por fin maduros. El precio, no."),
]
MANIFIESTO = [
    ("No somos fans", "Nos gusta la tecnología lo suficiente como para exigirle más. Ninguna marca es nuestro equipo."),
    ("Contexto antes que prisa", "Preferimos llegar segundos y explicar bien que ser los primeros en copiar una nota de prensa."),
    ("Criticar no es odiar", "Celebramos lo que funciona y señalamos lo que no. Con argumentos, no con ruido."),
    ("Tú también opinas", "La Mesa es tuya. Un portal crítico necesita lectores críticos, incluso con nosotros."),
]
SEC = [("Colombia", "Colombia"), ("IA y tecnología", "IA%20y%20tecnolog%C3%ADa"), ("Videojuegos y series", "Videojuegos%20y%20series")]

# ---------------------------------------------------------------- Piezas comunes
FUENTES = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
           '<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900'
           '&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500'
           '&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet">')


def cabeza(titulo, descripcion, tipo="website"):
    return f"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{titulo}</title>
  <meta name="description" content="{descripcion}">
  <meta property="og:type" content="{tipo}">
  <meta property="og:site_name" content="Tecnocríticos">
  <meta name="color-scheme" content="light">
  <link rel="icon" href="logo-icono.svg" type="image/svg+xml">
  {FUENTES}
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
"""


def cabecera(activo=""):
    def a(href, txt, clave):
        return f'<a href="{href}"{" class=\"on\"" if activo == clave else ""}>{txt}</a>'
    menu = a("index.html", "Hoy", "hoy") + "".join(a(f"noticias.html?seccion={q}", s, s) for s, q in SEC) \
        + a("noticias.html", "Todas las noticias", "noticias") + a("columna.html", "La Columna", "columna")
    chips = "".join(f'<a href="noticias.html?seccion={q}">{s}</a>' for s, q in SEC)
    return f"""<header class="cab"><div class="w">
  <a class="logo" href="index.html" aria-label="Tecnocríticos, inicio"><span class="logo__punto"></span>tecnocríticos</a>
  <nav class="menu" aria-label="Secciones">{menu}</nav>
  <a class="cta" href="index.html#boletin">Boletín gratis</a>
</div></header>
<nav class="fijas" aria-label="Accesos"><div class="w"><b>Secciones fijas</b><a href="index.html#hype">⚡ Hype-ómetro</a><a href="index.html#mesa">🗳 La Mesa</a><a href="columna.html">✦ La Columna</a><a href="index.html#manifiesto">Manifiesto</a>{chips}</div></nav>
"""


def bloque_minuto():
    return '<section class="esencial"><h3>En 1 minuto <span class="meta" data-minuto-cuenta></span></h3><ol data-minuto><li>Cargando…</li></ol></section>'


def bloque_mesa():
    ops = "".join(f'<button class="opcion" type="button" aria-pressed="false">{o}</button>' for o in DEBATE["opciones"])
    return f"""<section class="mesa" id="mesa" data-debate="{DEBATE['id']}">
  <span class="mesa__tag">🗳 La Mesa · Debate de la semana</span>
  <h2>{DEBATE['pregunta']}</h2>
  <p>{DEBATE['texto']}</p>
  <div class="mesa__cierre"><span>Cierra: <b>{DEBATE['cierre']}</b></span><span>Un voto por persona</span></div>
  {ops}
  <p class="mesa__gracias" hidden>Gracias por votar. Publicaremos los resultados al cierre del debate.</p>
  <a class="mesa__btn" href="columna.html#conversa">Deja tu argumento</a>
  <p class="mesa__args">Argumentos destacados</p>
  <p class="mesa__nota">Los argumentos de los lectores aparecerán aquí cuando abramos la conversación.</p>
</section>"""


def bloque_columna():
    return f"""<section class="colum" data-quitar="1"><div class="quien"><span class="avatar">HM</span><div><span class="lab">La Columna</span><div style="font:700 14px var(--f-titular)">Helmuhd Moreno</div></div></div>
  <h4><a href="columna.html">{COLUMNA['titulo']}</a></h4><p>{COLUMNA['resumen']}</p></section>"""


def bloque_hype():
    filas = "".join(f"""<div class="hyp"><h4>{t}</h4><div class="barra"><div class="pista"><i class="promesa" style="width:{p}%"></i><i class="realidad" style="width:{r}%"></i></div><span>−{p - r}</span></div><p>{v}</p></div>"""
                    for t, p, r, v in HYPE)
    return f"""<section class="hype" id="hype" data-quitar="2"><h3>⚡ Hype-ómetro <span class="meta">promesa vs. realidad</span></h3>{filas}
  <div class="hype__ley"><span><i style="background:#D6D6D0"></i>Promesa</span><span><i style="background:var(--rojo)"></i>Realidad</span><span>Distancia en puntos</span></div></section>"""


def bloque_podcast():
    return '<section class="pod" data-quitar="3"><div class="pod__play" aria-hidden="true">▶</div><div><span class="lab">Ruido de Fondo · Podcast</span><b>Muy pronto</b><span class="meta">El podcast de Tecnocríticos</span></div></section>'


def bloque_explora():
    items = "".join(f'<li><a href="noticias.html?seccion={q}">Noticias de {s}</a></li>' for s, q in SEC)
    items += ('<li><a href="noticias.html">Todas las noticias</a></li><li><a href="columna.html">La Columna de la semana</a></li>'
              '<li><a href="index.html#mesa">El debate de La Mesa</a></li><li><a href="index.html#hype">El Hype-ómetro</a></li>'
              '<li><a href="index.html#manifiesto">Nuestro manifiesto</a></li>')
    return f'<section class="explora" data-quitar="4" data-elastico><h3>Explora</h3><ol>{items}</ol></section>'


def manifiesto():
    cols = "".join(f'<div><span class="num">0{i}</span><h4>{t}</h4><p>{d}</p></div>' for i, (t, d) in enumerate(MANIFIESTO, 1))
    return f'<section class="w manifiesto" id="manifiesto"><div class="sech">Nuestro manifiesto <span class="meta">Por qué existimos y cómo trabajamos</span></div><div class="manifiesto__rej">{cols}</div></section>'


def boletin():
    return """<section class="bol" id="boletin"><div class="w"><div>
  <div><span class="lab">El Boletín Crítico</span><h3>Lo esencial de la tecnología en 5 minutos. Cada lunes.</h3><p>Más la columna de la semana. Sin relleno.</p></div>
  <form data-boletin><label class="sr-only" for="correo">Tu correo</label><input id="correo" type="email" required placeholder="tu@correo.com"><button type="submit">Suscribirme</button></form>
</div></div></section>"""


def pie():
    return """<footer class="pie"><div class="w"><div><span>tecnocriticos.com · La tecnología, sin fanatismo</span><span><a href="index.html#manifiesto">Manifiesto</a> · <a href="noticias.html">Noticias</a> · <a href="columna.html">La Columna</a></span></div></div></footer>
<script src="main.js"></script>
</body>
</html>
"""


# ---------------------------------------------------------------- Páginas
def portada():
    return (cabeza("Tecnocríticos — La tecnología, sin fanatismo",
                   "Noticias y análisis crítico sobre tecnología en Colombia, inteligencia artificial, videojuegos y series.")
            + cabecera("hoy")
            + f"""<main class="w grid">
 <div class="principal">
  <article class="hero" data-hero><p class="vacio">Cargando la edición de hoy…</p></article>
  <section class="feed"><h2>Lo que pasó <span class="meta" data-edicion></span></h2><div data-feed></div></section>
 </div>
 <aside class="rail">{bloque_minuto()}{bloque_mesa()}{bloque_columna()}{bloque_hype()}{bloque_podcast()}{bloque_explora()}</aside>
</main>
<section class="w" data-mas hidden><div class="sech">Más noticias <span class="meta"><a href="noticias.html">Ver todas →</a></span></div><div class="mas4" data-mas-lista></div></section>
{manifiesto()}
{boletin()}
""" + pie())


def pagina_noticias():
    botones = '<button type="button" data-seccion="Todas" aria-pressed="true">Todas</button>' + "".join(
        f'<button type="button" data-seccion="{s}" aria-pressed="false">{s}</button>' for s, _ in SEC)
    return (cabeza("Noticias — Tecnocríticos", "Noticias diarias de tecnología en Colombia, IA, videojuegos y series, con contexto y mirada crítica.")
            + cabecera("noticias")
            + f"""<section class="w titulo-pag"><span class="lab">Edición diaria</span><h1>Noticias, sin fanatismo</h1>
  <p>Lo que pasó en tecnología en Colombia, inteligencia artificial, videojuegos y series. Cada nota cita sus fuentes y cierra con nuestra mirada crítica.</p>
  <div class="filtros" data-filtros role="group" aria-label="Filtrar por sección">{botones}</div></section>
<main class="w grid">
 <div class="principal"><div class="feed" data-noticias-archivo style="margin-top:0"><p class="vacio">Cargando noticias…</p></div></div>
 <aside class="rail">{bloque_minuto()}{bloque_mesa()}{bloque_columna()}{bloque_hype()}{bloque_podcast()}{bloque_explora()}</aside>
</main>
{boletin()}
""" + pie())


def pagina_noticia():
    return (cabeza("Noticia — Tecnocríticos", "Noticias de tecnología con contexto y mirada crítica.", "article")
            + cabecera()
            + f"""<main class="w grid">
 <div class="principal"><article class="art" data-noticia><p class="vacio">Cargando noticia…</p></article>
  <section class="feed art-cuerpo" data-relacionadas></section></div>
 <aside class="rail">{bloque_minuto()}{bloque_mesa()}{bloque_columna()}{bloque_hype()}{bloque_podcast()}{bloque_explora()}</aside>
</main>
{boletin()}
""" + pie())


def pagina_columna():
    cuerpo = (RAIZ / "herramientas" / "columna_actual.html").read_text(encoding="utf-8")
    return (cabeza(f"{COLUMNA['titulo']} — La Columna · Tecnocríticos", "La columna semanal de opinión de Tecnocríticos.", "article")
            + '<div class="barra-progreso" aria-hidden="true"></div>\n'
            + cabecera("columna")
            + f"""<main class="w grid">
 <div class="principal"><article class="art">{cuerpo}
  <section class="conversa" id="conversa"><h2>Conversación</h2><p>Los comentarios abren muy pronto. Mientras tanto, vota en <a href="index.html#mesa" style="text-decoration:underline">La Mesa</a> de esta semana.</p></section>
 </article></div>
 <aside class="rail">
  <section class="caja"><h3>Sobre el autor</h3><div class="quien" style="display:flex;gap:12px;align-items:center;margin-top:10px"><span class="avatar">HM</span><div><strong style="font:700 15px var(--f-titular)">Helmuhd Moreno</strong><div class="meta">Director de Tecnocríticos</div></div></div>
   <p>Comunicador social y periodista con más de 20 años de experiencia en agencias, oficinas de prensa y departamentos de mercadeo. MBA, especialista en Alta Gerencia, docente universitario y experto en marketing, comunicación digital, comunicación organizacional y periodismo. Apasionado por la tecnología, las nuevas tendencias del mercado y las redes sociales.</p></section>
  <section class="caja" data-quitar="1"><h3>Archivo de columnas</h3><ul class="archivo-col"><li><span>Semana 47 · 16 de noviembre</span><b>{COLUMNA['titulo']}</b></li></ul><p>Esta es la primera columna. Cada lunes, una nueva.</p></section>
  {bloque_mesa()}{bloque_hype()}{bloque_podcast()}{bloque_explora()}
 </aside>
</main>
{boletin()}
""" + pie())


if __name__ == "__main__":
    for nombre, html in [("index.html", portada()), ("noticias.html", pagina_noticias()),
                         ("noticia.html", pagina_noticia()), ("columna.html", pagina_columna())]:
        (RAIZ / nombre).write_text(html, encoding="utf-8")
        print("generado", nombre)
