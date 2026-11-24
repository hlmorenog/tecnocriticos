#!/usr/bin/env python3
"""Genera las páginas HTML de Tecnocríticos con la misma cabecera, columna derecha y pie.

Uso (desde la raíz del repositorio):  python3 herramientas/generar_paginas.py

Genera TODO el sitio estático: portada, noticias, columna, quiénes somos, la página de cada
noticia (n/<id>.html), sitemap.xml, sitemap-noticias.xml, feed.xml, robots.txt y llms.txt.
Hay que ejecutarlo cada vez que se publica una edición nueva.

Las noticias NO se escriben aquí: se cargan solas desde noticias/AAAA-MM-DD.json.
Aquí se editan los bloques fijos: menú, La Mesa, Hype-ómetro, La Columna, manifiesto y pie.
"""
import html as _html
import json
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
# Columnas de opinión, de la más reciente a la más antigua. La primera se publica en columna.html;
# las anteriores quedan en c/<slug>.html. El cuerpo de cada una está en herramientas/columnas/<slug>.html.
COLUMNAS = [
    {"slug": "2026-11-23-compraste-una-caja-no-un-videojuego", "titulo": "Compraste una caja, no un videojuego",
     "resumen": "GTA VI llegó a las tiendas con caja, carátula y precio de juego físico. Adentro, lo que hay es un código.",
     "fecha": "2026-11-23", "semana": "Semana 48 · 23 de noviembre"},
    {"slug": "2026-11-16-nadie-nos-pidio-permiso-para-el-futuro", "titulo": "Nadie nos pidió permiso para el futuro",
     "resumen": "Cada keynote promete liberarnos. Cada actualización nos ata un poco más.",
     "fecha": "2026-11-16", "semana": "Semana 47 · 16 de noviembre"},
]
COLUMNA = COLUMNAS[0]


def url_columna(c):
    return "columna.html" if c is COLUMNAS[0] else f"c/{c['slug']}.html"
HYPE = [  # (tema, promesa, realidad, veredicto)
    ("Agentes de IA que «trabajan por ti»", 96, 48, "Útiles con supervisión. Autónomos, todavía no."),
    ("Gafas de realidad mixta", 88, 35, "Impresionantes en demo, incómodas a la hora."),
    ("Carros totalmente autónomos", 92, 30, "«El año que viene», desde hace una década."),
    ("Celulares plegables", 70, 62, "Por fin maduros. El precio, no."),
]
MANIFIESTO = [
    ("No somos fans", "Nos gusta la tecnología lo suficiente como para exigirle más. Ninguna marca es nuestro equipo."),
    ("Contexto antes que prisa", "No competimos por ser los primeros, sino por ser los que mejor explican lo que pasa."),
    ("Criticar no es odiar", "Celebramos lo que funciona y señalamos lo que no. Con argumentos, no con ruido."),
    ("Tú también opinas", "La Mesa es tuya. Un portal crítico necesita lectores críticos, incluso con nosotros."),
]
SEC = [("Colombia", "Colombia"), ("IA y tecnología", "IA%20y%20tecnolog%C3%ADa"), ("Videojuegos y series", "Videojuegos%20y%20series")]

# ---------------------------------------------------------------- Piezas comunes
FUENTES = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
           '<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900'
           '&family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600'
           '&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet">')


SITIO = "https://tecnocriticos.com"


NOMBRE = "Tecnocríticos"
LOGO = f"{SITIO}/img/logo-tecnocriticos.png"
ORGANIZACION = {
    "@type": "NewsMediaOrganization",
    "@id": f"{SITIO}/#organizacion",
    "name": NOMBRE,
    "url": f"{SITIO}/",
    "logo": {"@type": "ImageObject", "url": LOGO, "width": 512, "height": 512},
    "slogan": "La tecnología, sin fanatismo",
    "description": "Medio de comunicación de periodismo de tecnología potenciado por IA: noticias y análisis diarios del sector, con opiniones editoriales que fijan posición frente a productos, servicios y organizaciones del mundo tech.",
    "foundingLocation": {"@type": "Place", "name": "Colombia"},
    "publishingPrinciples": f"{SITIO}/quienes-somos.html",
    "ethicsPolicy": f"{SITIO}/quienes-somos.html#principios",
    "correctionsPolicy": f"{SITIO}/quienes-somos.html#correcciones",
    "actionableFeedbackPolicy": f"{SITIO}/quienes-somos.html#correcciones",
    "founder": {"@type": "Person", "name": "Helmuhd Moreno", "jobTitle": "Director"},
}
esc = lambda s: _html.escape(str(s or ""), quote=True)


def bloque_jsonld(datos):
    """Datos estructurados (schema.org) para Google y los buscadores con IA."""
    texto = json.dumps({"@context": "https://schema.org", **datos} if isinstance(datos, dict) else
                       {"@context": "https://schema.org", "@graph": datos}, ensure_ascii=False, indent=1)
    return '  <script type="application/ld+json">\n' + texto.replace("</", "<\\/") + "\n  </script>\n"


def cargar_noticias():
    """Todas las noticias publicadas, de la más reciente a la más antigua (respeta el orden de cada edición)."""
    todas = []
    for archivo in sorted((RAIZ / "noticias").glob("*.json"), reverse=True):
        edicion = json.loads(archivo.read_text(encoding="utf-8"))
        for n in edicion.get("noticias", []):
            todas.append({**n, "fecha": edicion.get("fecha", archivo.stem)})
    return todas


def url_noticia(n, absoluta=False):
    return (f"{SITIO}/" if absoluta else "") + f"n/{n['id']}.html"


def cabeza(titulo, descripcion, tipo="website", ruta="", titulo_social=None, imagen=None,
           robots=None, jsonld=None, base=False, extra=""):
    """ruta: dirección de la página dentro del sitio ("" es la portada).
    imagen: (ruta, ancho, alto, texto alternativo) para la vista previa; por defecto, img/compartir.png.
    robots: por ejemplo "noindex, follow" para páginas que no deben aparecer en buscadores.
    jsonld: datos estructurados (dict o lista de dicts). base: True en páginas de subcarpetas (n/)."""
    url = f"{SITIO}/{ruta}"
    titulo_social = titulo_social or titulo
    img, img_w, img_h, img_alt = imagen or ("img/compartir.png", 1200, 630, "Tecnocríticos: la tecnología, sin fanatismo")
    medidas = (f'\n  <meta property="og:image:width" content="{img_w}">\n  <meta property="og:image:height" content="{img_h}">'
               if img_w else "")
    canonical = "" if robots and "noindex" in robots else f'\n  <link rel="canonical" href="{url}">'
    meta_robots = (f'\n  <meta name="robots" content="{robots}">' if robots else
                   '\n  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">')
    base_tag = '\n  <base href="/">' if base else ""
    return f"""<!doctype html>
<html lang="es-CO">
<head>
  <meta charset="utf-8">{base_tag}
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{titulo}</title>
  <meta name="description" content="{descripcion}">{canonical}{meta_robots}
  <link rel="alternate" type="application/rss+xml" title="Tecnocríticos: noticias" href="{SITIO}/feed.xml">
  <meta property="og:type" content="{tipo}">
  <meta property="og:site_name" content="Tecnocríticos">
  <meta property="og:locale" content="es_CO">
  <meta property="og:title" content="{titulo_social}">
  <meta property="og:description" content="{descripcion}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITIO}/{img}">{medidas}
  <meta property="og:image:alt" content="{img_alt}">{extra}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{titulo_social}">
  <meta name="twitter:description" content="{descripcion}">
  <meta name="twitter:image" content="{SITIO}/{img}">
  <meta name="color-scheme" content="light">
  <link rel="icon" href="logo-icono.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="img/logo-tecnocriticos.png">
  {FUENTES}
  <link rel="stylesheet" href="estilos.css">
{bloque_jsonld(jsonld) if jsonld else ''}</head>
<body>
"""


def cabecera(activo=""):
    def a(href, txt, clave):
        return f'<a href="{href}"{" class=\"on\"" if activo == clave else ""}>{txt}</a>'
    menu = a("index.html", "Hoy", "hoy") + "".join(a(f"noticias.html?seccion={q}", s, s) for s, q in SEC) \
        + a("noticias.html", "Todas las noticias", "noticias") + a("multimedia.html", "▶ Multimedia", "multimedia") + a("columna.html", "La Columna", "columna")
    chips = "".join(f'<a href="noticias.html?seccion={q}">{s}</a>' for s, q in SEC)
    # Menú desplegable del celular (y de pantallas angostas, donde el menú horizontal no cabe)
    def m(href, txt, clave=""):
        return f'<a href="{href}"{" aria-current=\"page\"" if clave and activo == clave else ""}>{txt}</a>'
    movil = (m("index.html", "Hoy", "hoy") + m("multimedia.html", "▶ Videos · Multimedia", "multimedia") + "".join(m(f"noticias.html?seccion={q}", s, s) for s, q in SEC)
             + m("noticias.html", "Todas las noticias", "noticias") + m("columna.html", "La Columna", "columna"))
    movil2 = (m("index.html#hype", "⚡ Hype-ómetro") + m("index.html#mesa", "🗳 La Mesa")
              + m("quienes-somos.html", "Quiénes somos") + m("rss.html", "RSS"))
    return f"""<header class="cab"><div class="w">
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-movil" data-menu-btn><span class="menu-btn__icono" aria-hidden="true"></span><span class="sr-only">Abrir el menú</span></button>
  <a class="logo" href="index.html" aria-label="Tecnocríticos, inicio"><span class="logo__punto"></span>tecnocríticos</a>
  <nav class="menu" aria-label="Secciones">{menu}</nav>
  <a class="cta" href="index.html#boletin">Boletín<span class="cta__extra"> gratis</span></a>
</div>
<nav class="menu-movil" id="menu-movil" aria-label="Menú" hidden><div class="w">
  <span class="menu-movil__lab">Secciones</span>{movil}
  <span class="menu-movil__lab">Más</span>{movil2}
  <a class="menu-movil__cta" href="index.html#boletin">Suscríbete al Boletín Tecnocríticos</a>
</div></nav></header>
<nav class="fijas" aria-label="Accesos"><div class="w"><b>Secciones fijas</b><a class="fijas__mm" href="multimedia.html">▶ Videos · Multimedia</a><a href="index.html#hype">⚡ Hype-ómetro</a><a href="index.html#mesa">🗳 La Mesa</a><a href="columna.html">✦ La Columna</a><a href="index.html#manifiesto">Manifiesto</a>{chips}</div></nav>
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
  <div class="hype__ley"><span><i style="background:#D6D6D0"></i>Promesa</span><span><i style="background:var(--acento)"></i>Realidad</span><span>Distancia en puntos</span></div></section>"""


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


# Formulario incrustado de MailerLite (grupo «Boletín Tecnocríticos», con doble confirmación).
# Se usa el marcado que espera su script (webforms.min.js) pero con el diseño del sitio;
# main.js carga ese script y el reCAPTCHA solo cuando el formulario se acerca a la pantalla.
ML_FORM_ID = "48907035"
ML_ACCION = "https://assets.mailerlite.com/jsonp/2817036/forms/204883151428781870/subscribe"


def boletin():
    return f"""<section class="bol" id="boletin"><div class="w"><div>
  <div><span class="lab">Boletín Tecnocríticos</span><h3>Lo esencial de la tecnología en 5 minutos. Cada lunes.</h3><p>Más la columna de la semana. Sin relleno.</p></div>
  <div id="mlb2-{ML_FORM_ID}" class="ml-subscribe-form ml-subscribe-form-{ML_FORM_ID} bol__caja" data-boletin="{ML_FORM_ID}">
   <form class="ml-block-form row-form" action="{ML_ACCION}" method="post" target="_blank" novalidate>
    <div class="bol__fila">
     <div class="ml-field-group ml-field-email ml-validate-email ml-validate-required bol__campo"><label class="sr-only" for="correo-boletin">Tu correo electrónico</label><input id="correo-boletin" type="email" name="fields[email]" placeholder="Tu correo electrónico" autocomplete="email" required></div>
     <button type="submit" class="primary">Suscribirme</button>
     <button type="button" class="loading" disabled hidden>Enviando…</button>
    </div>
    <div class="ml-form-recaptcha ml-validate-required bol__captcha"><div class="g-recaptcha" data-sitekey="6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD"></div></div>
    <p class="bol__legal">Al suscribirte aceptas recibir el Boletín Tecnocríticos y el tratamiento de tus datos según nuestra <a href="privacidad.html">política de privacidad</a>.</p>
    <input type="hidden" name="ml-submit" value="1"><input type="hidden" name="anticsrf" value="true">
   </form>
   <div class="row-success bol__ok" role="status" hidden><b>¡Ya casi!</b> Te enviamos un correo para confirmar tu suscripción al Boletín Tecnocríticos. Revisa tu bandeja de entrada y, si no lo ves, mira en spam o promociones.</div>
  </div>
</div></div></section>"""


PIE_COLOR = "gris"  # verde, negro o gris


def pie():
    secciones = "".join(f'<li><a href="noticias.html?seccion={q}">{s}</a></li>' for s, q in SEC)
    return f"""<footer class="pie pie--{PIE_COLOR}"><div class="w">
 <div class="pie__top">
  <div class="pie__marca"><a class="logo" href="index.html" aria-label="Tecnocríticos, inicio"><span class="logo__punto"></span>tecnocríticos</a>
   <p>La tecnología, sin fanatismo. Periodismo de tecnología potenciado por IA, con noticias y análisis cada día.</p></div>
  <nav class="pie__cols" aria-label="Pie de página">
   <div><h4>Noticias</h4><ul><li><a href="index.html">Hoy</a></li>{secciones}<li><a href="noticias.html">Todas las noticias</a></li></ul></div>
   <div><h4>Tecnocríticos</h4><ul><li><a href="quienes-somos.html">Quiénes somos</a></li><li><a href="columna.html">La Columna</a></li><li><a href="index.html#mesa">La Mesa</a></li><li><a href="index.html#hype">Hype-ómetro</a></li><li><a href="multimedia.html">Multimedia</a></li></ul></div>
   <div><h4>Recíbelo</h4><ul><li><a href="index.html#boletin">Boletín Tecnocríticos</a></li><li><a href="rss.html">RSS</a></li><li><a href="privacidad.html">Privacidad</a></li><li><a href="privacidad.html#cookies" data-cookies>Preferencias de cookies</a></li></ul></div>
  </nav>
 </div>
 <div class="pie__base"><span>© <span data-anio>2026</span> tecnocriticos.com</span><span>Hecho en Colombia</span></div>
</div></footer>
<script src="main.js"></script>
<!-- Cloudflare Web Analytics: conteo de visitas sin cookies -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{{"token": "4e70f7ad49a74aa4a60d9463aae782dd"}}'></script>
</body>
</html>
"""


# ---------------------------------------------------------------- Páginas
def item_estatico(n):
    """Versión en HTML de una noticia del listado (la ven los buscadores; el navegador la reemplaza)."""
    return (f'<article class="item"><span class="lab">{esc(n["seccion"])}</span><div><h3><a href="{url_noticia(n)}">'
            f'{esc(n["titular"])}</a></h3><p>{esc(n.get("entradilla"))}</p><span class="meta">{esc(n["fecha"])}</span></div></article>')


def bloque_explicado(noticias):
    """Portada: la pieza multimedia propia más reciente (video vertical + infografía) de los últimos 7 días."""
    from datetime import date, timedelta
    limite = (date.fromisoformat(noticias[0]["fecha"]) - timedelta(days=7)).isoformat() if noticias else ""
    for n in noticias:
        mm = n.get("multimedia") or {}
        v, ig = mm.get("video") or {}, mm.get("infografia") or {}
        if n["fecha"] < limite or not (v.get("archivo") or ig.get("archivo")):
            continue
        piezas = ""
        if v.get("archivo") and (RAIZ / v["archivo"]).is_file():
            poster = f' poster="{esc(v["poster"])}"' if v.get("poster") else ""
            piezas += (f'<figure class="mm__video"><video controls playsinline preload="none"{poster} aria-label="{esc(v.get("titulo") or "Video")}">'
                       f'<source src="{esc(v["archivo"])}" type="video/mp4"></video></figure>')
        if ig.get("archivo") and (RAIZ / ig["archivo"]).is_file():
            piezas += (f'<figure class="mm__info"><a href="{url_noticia(n)}"><img src="{esc(ig["archivo"])}" alt="{esc(ig.get("alt") or "Infografía")}" loading="lazy"></a></figure>')
        return (f'<section class="mm mm--home" aria-label="Explicado en imágenes"><h2 class="videos__tit">Explicado en imágenes</h2>'
                f'<h3 class="mm__tit"><a href="{url_noticia(n)}">{esc(n["titular"])}</a></h3><div class="mm__rej">{piezas}</div>'
                f'<p class="mm__mas"><a href="{url_noticia(n)}">Leer la nota completa →</a></p></section>')
    return ""


def cargar_piezas():
    """Piezas multimedia independientes (explicadores), en multimedia/piezas.json."""
    p = RAIZ / "multimedia" / "piezas.json"
    if not p.is_file():
        return []
    return [x for x in json.loads(p.read_text(encoding="utf-8")).get("piezas", []) if x.get("id")]


def url_pieza(p, absoluta=False):
    return (f"{SITIO}/" if absoluta else "") + f"m/{p['id']}.html"


def resolver_enlace(url):
    if url.startswith("columna:"):
        slug = url.split(":", 1)[1]
        c = next((c for c in COLUMNAS if c["slug"] == slug), None)
        return url_columna(c) if c else "columna.html"
    return url


def piezas_multimedia(noticias):
    """Todas las piezas (de noticias y explicadores), de la más reciente a la más antigua.
    Cada una: tipo (video/infografia), archivo, poster, duracion, alt, titulo, seccion, fecha, url (página de destino)."""
    res = []
    for p in cargar_piezas():
        v = p.get("video") or {}
        if v.get("archivo") and (RAIZ / v["archivo"]).is_file():
            res.append({"tipo": "video", **v, "titulo": p["titulo"], "seccion": p["seccion"], "fecha": p["fecha"],
                        "url": url_pieza(p), "entradilla": p.get("entradilla", ""), "grupo": p["id"]})
    for n in noticias:
        mm = n.get("multimedia") or {}
        for tipo in ("video", "infografia"):
            x = mm.get(tipo) or {}
            if x.get("archivo") and (RAIZ / x["archivo"]).is_file():
                res.append({"tipo": tipo, **x, "titulo": n["titular"], "seccion": n["seccion"], "fecha": n["fecha"],
                            "url": url_noticia(n), "entradilla": n.get("entradilla", ""), "grupo": n["id"]})
    return sorted(res, key=lambda x: x["fecha"], reverse=True)  # orden estable: explicadores antes que noticias del mismo día


def html_video(v):
    poster = f' poster="{esc(v["poster"])}"' if v.get("poster") else ""
    return (f'<figure class="mm__video"><video controls playsinline preload="none"{poster} aria-label="{esc(v.get("titulo") or "Video")}">'
            f'<source src="{esc(v["archivo"])}" type="video/mp4"></video></figure>')


def tarjeta_mmz(p, grande=False):
    """Tarjeta vertical tipo «reel». Al tocarla se abre el reproductor (o la infografía) encima de la página."""
    img = p.get("poster") if p["tipo"] == "video" else p["archivo"]
    dur = f'<span class="mmz__dur">{esc(p["duracion"])}</span>' if p.get("duracion") else ""
    icono = '<span class="mmz__play" aria-hidden="true"></span>' if p["tipo"] == "video" else '<span class="mmz__lupa" aria-hidden="true">+</span>'
    datos = (f'data-mmz-ver data-tipo="{p["tipo"]}" data-src="{esc(p["archivo"])}" data-poster="{esc(p.get("poster") or "")}" '
             f'data-titulo="{esc(p["titulo"])}" data-url="{esc(p["url"])}" data-desc="{esc(p.get("entradilla") or "")}"')
    return (f'<article class="mmz__card mmz__card--{p["tipo"]}{" mmz__card--grande" if grande else ""}">'
            f'<a class="mmz__media" href="{esc(p["url"])}" {datos} aria-label="{"Ver video" if p["tipo"] == "video" else "Ver infografía"}: {esc(p["titulo"])}">'
            f'<img src="{esc(img or "")}" alt="{esc(p.get("alt") or p["titulo"])}" loading="lazy">{icono}{dur}</a>'
            f'<div class="mmz__info"><span class="mmz__sec">{esc(p["seccion"])} · {int(p["fecha"][8:10])}/{p["fecha"][5:7]}</span>'
            f'<h3><a href="{esc(p["url"])}">{esc(p["titulo"])}</a></h3>'
            f'<a class="mmz__desc" href="{esc(p["archivo"])}" download>↓ Descargar</a></div></article>')


def pagina_multimedia():
    piezas = piezas_multimedia(cargar_noticias())
    videos = [p for p in piezas if p["tipo"] == "video"]
    infos = [p for p in piezas if p["tipo"] == "infografia"]
    dest = videos[0] if videos else (piezas[0] if piezas else None)
    heroe = ""
    if dest:
        es_pieza = dest["url"].startswith("m/")
        heroe = f"""<div class="mmz__dest">
   <div class="mmz__marco">{html_video(dest) if dest["tipo"] == "video" else f'<img src="{esc(dest["archivo"])}" alt="{esc(dest.get("alt") or dest["titulo"])}">'}</div>
   <div class="mmz__dest-txt">
    <span class="mmz__kick">● Estreno · {esc(dest["seccion"])}</span>
    <h2><a href="{esc(dest["url"])}">{esc(dest["titulo"])}</a></h2>
    <p>{esc(dest.get("entradilla") or "")}</p>
    <div class="mmz__btns"><a class="mmz__btn mmz__btn--si" href="{esc(dest["url"])}">{"Ver la pieza y sus fuentes" if es_pieza else "Leer la nota"}</a><a class="mmz__btn" href="{esc(dest["archivo"])}" download>↓ Descargar</a></div>
   </div>
  </div>"""
    fila_v = "".join(tarjeta_mmz(p) for p in videos)
    fila_i = "".join(tarjeta_mmz(p) for p in infos)
    filas = ""
    if fila_v:
        filas += f'<section class="mmz__fila"><div class="mmz__fila-cab"><h2>Videos</h2><span>{len(videos)} piezas · formato vertical</span></div><div class="mmz__carril">{fila_v}</div></section>'
    if fila_i:
        filas += f'<section class="mmz__fila"><div class="mmz__fila-cab"><h2>Infografías</h2><span>{len(infos)} {"pieza" if len(infos) == 1 else "piezas"}</span></div><div class="mmz__carril mmz__carril--info">{fila_i}</div></section>'
    vacio = '' if piezas else '<p class="mmz__vacio">Muy pronto, nuestros primeros videos e infografías.</p>'
    return (cabeza("Multimedia — Tecnocríticos",
                   "Videos e infografías de Tecnocríticos para entender en un minuto la tecnología: explicadores e historias de los temas que importan.",
                   ruta="multimedia.html")
            + cabecera("multimedia")
            + f"""<main class="mmz">
 <section class="mmz__heroe"><div class="w">
  <div class="mmz__cab"><span class="mmz__kick">Multimedia · Tecnocríticos</span>
   <h1>Explicado en <em>imágenes</em></h1>
   <p>La tecnología en un minuto: videos verticales e infografías con datos verificados y fuentes. Míralos aquí, descárgalos y compártelos citando a Tecnocríticos.</p></div>
  {heroe}
 </div></section>
 <div class="mmz__cuerpo"><div class="w">{filas}{vacio}</div></div>
</main>
<dialog class="mmz__modal" data-mmz-modal aria-label="Reproductor">
 <button class="mmz__cerrar" type="button" data-mmz-cerrar aria-label="Cerrar">×</button>
 <div class="mmz__modal-media" data-mmz-media></div>
 <div class="mmz__modal-txt"><h3 data-mmz-titulo></h3><p data-mmz-desc></p>
  <div class="mmz__btns"><a class="mmz__btn mmz__btn--si" data-mmz-url href="#">Ver la pieza</a><a class="mmz__btn" data-mmz-bajar href="#" download>↓ Descargar</a></div></div>
</dialog>
{boletin()}
""" + pie())


def pagina_pieza(p):
    """Página propia de un explicador: m/<id>.html (para buscadores y para compartir)."""
    v = p.get("video") or {}
    fuentes = "".join(f'<li><a href="{esc(f["url"])}" target="_blank" rel="noopener">{esc(f.get("nombre") or f["url"])}</a></li>' for f in p.get("fuentes", []))
    rel = p.get("relacionada")
    relacionada = f'<p class="mmx__rel">Relacionado: <a href="{resolver_enlace(rel["url"])}">{esc(rel["titulo"])}</a></p>' if rel else ""
    datos = {"@type": "VideoObject", "name": p["titulo"], "description": p.get("entradilla", ""), "uploadDate": p["fecha"],
             "thumbnailUrl": [f"{SITIO}/{v.get('poster', '')}"], "contentUrl": f"{SITIO}/{v.get('archivo', '')}", "inLanguage": "es-CO",
             "publisher": {k: x for k, x in ORGANIZACION.items() if k in ("@type", "@id", "name", "url", "logo")}}
    imagen = (v["poster"], 720, 1280, esc(p["titulo"])) if v.get("poster") else None
    return (cabeza(f"{p['titulo']} — Multimedia · Tecnocríticos", p.get("entradilla", ""), "video.other", url_pieza(p), p["titulo"],
                   imagen=imagen, jsonld=datos, base=True)
            + cabecera("multimedia")
            + f"""<main class="w grid">
 <div class="principal"><article class="art mm mmx__pieza">
  <nav class="miga" aria-label="Ruta"><a href="index.html">Hoy</a> / <a href="multimedia.html">Multimedia</a></nav>
  <span class="lab">Explicado · {esc(p['seccion'])}</span>
  <h1>{esc(p['titulo'])}</h1>
  <p class="entradilla">{esc(p.get('entradilla', ''))}</p>
  <div class="compartir compartir--arriba" data-compartir></div>
  <div class="mmx__solo">{html_video({**v, "titulo": p["titulo"]}) if v.get("archivo") else ""}</div>
  <div class="mmx__btns"><a class="mmx__btn" href="{esc(v.get('archivo', ''))}" download>↓ Descargar video</a><a class="mmx__btn" href="multimedia.html">Más piezas multimedia</a></div>
  <div class="cuerpo"><p>{esc(p.get('descripcion', ''))}</p></div>
  {relacionada}
  <div class="fuentes"><span class="lab" style="color:var(--gris)">Fuentes</span><ul>{fuentes}</ul></div>
  <div class="compartir" data-compartir></div>
 </article></div>
 <aside class="rail">{bloque_minuto()}{bloque_columna()}{bloque_explora()}</aside>
</main>
{boletin()}
""" + pie())


def portada():
    noticias = cargar_noticias()
    hoy = [n for n in noticias if noticias and n["fecha"] == noticias[0]["fecha"]]
    if hoy:
        p = hoy[0]
        hero = (f'<span class="lab">{esc(p["seccion"])}</span><h1><a href="{url_noticia(p)}">{esc(p["titular"])}</a></h1>'
                f'<p class="bl">{esc(p.get("entradilla"))}</p>')
        feed = "".join(item_estatico(n) for n in hoy[1:])
    else:
        hero, feed = '<p class="vacio">Cargando la edición de hoy…</p>', ""
    datos = [ORGANIZACION, {"@type": "WebSite", "@id": f"{SITIO}/#sitio", "name": NOMBRE, "url": f"{SITIO}/",
                            "inLanguage": "es-CO", "publisher": {"@id": f"{SITIO}/#organizacion"}}]
    return (cabeza("Tecnocríticos — La tecnología, sin fanatismo",
                   "Noticias y análisis crítico sobre tecnología en Colombia, inteligencia artificial, videojuegos y series.",
                   ruta="", jsonld=datos)
            + cabecera("hoy")
            + f"""<main class="w grid">
 <div class="principal">
  <article class="hero" data-hero>{hero}</article>
  {bloque_explicado(noticias)}
  <section class="feed"><h2>Lo que pasó <span class="meta" data-edicion></span></h2><div data-feed>{feed}</div></section>
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
    lista = "".join(item_estatico(n) for n in cargar_noticias()) or '<p class="vacio">Cargando noticias…</p>'
    return (cabeza("Noticias — Tecnocríticos", "Noticias diarias de tecnología en Colombia, IA, videojuegos y series, con contexto y mirada crítica.",
                   ruta="noticias.html")
            + cabecera("noticias")
            + f"""<section class="w titulo-pag"><span class="lab">Edición diaria</span><h1>Noticias, sin fanatismo</h1>
  <p>Lo que pasó en tecnología en Colombia, inteligencia artificial, videojuegos y series. Cada nota cita sus fuentes y cierra con nuestra mirada crítica.</p>
  <div class="filtros" data-filtros role="group" aria-label="Filtrar por sección">{botones}</div></section>
<main class="w grid">
 <div class="principal"><div class="feed" data-noticias-archivo style="margin-top:0">{lista}</div></div>
 <aside class="rail">{bloque_minuto()}{bloque_mesa()}{bloque_columna()}{bloque_hype()}{bloque_podcast()}{bloque_explora()}</aside>
</main>
{boletin()}
""" + pie())


def pagina_noticia():
    return (cabeza("Noticia — Tecnocríticos", "Noticias de tecnología con contexto y mirada crítica.", "article", "noticia.html",
                   robots="noindex, follow")
            + cabecera()
            + f"""<main class="w grid">
 <div class="principal"><article class="art" data-noticia><p class="vacio">Cargando noticia…</p></article>
  <section class="feed art-cuerpo" data-relacionadas></section></div>
 <aside class="rail">{bloque_minuto()}{bloque_mesa()}{bloque_columna()}{bloque_hype()}{bloque_podcast()}{bloque_explora()}</aside>
</main>
{boletin()}
""" + pie())


def pagina_columna(col=None):
    col = col or COLUMNA
    ruta = url_columna(col)
    cuerpo = (RAIZ / "herramientas" / "columnas" / f"{col['slug']}.html").read_text(encoding="utf-8")
    archivo = "".join(f'<li><span>{c["semana"]}</span><a href="{url_columna(c)}"><b>{c["titulo"]}</b></a></li>' for c in COLUMNAS)
    datos = {"@type": "OpinionNewsArticle", "headline": col["titulo"], "description": col["resumen"],
             "url": f"{SITIO}/{ruta}", "mainEntityOfPage": f"{SITIO}/{ruta}", "inLanguage": "es-CO",
             "datePublished": col["fecha"], "dateModified": col["fecha"], "image": [f"{SITIO}/img/compartir.png"],
             "author": {"@type": "Person", "name": "Helmuhd Moreno", "jobTitle": "Director de Tecnocríticos",
                        "url": f"{SITIO}/quienes-somos.html#direccion"},
             "publisher": {k: v for k, v in ORGANIZACION.items() if k in ("@type", "@id", "name", "url", "logo")}}
    return (cabeza(f"{col['titulo']} — La Columna · Tecnocríticos", col["resumen"], "article", ruta,
                   f"{col['titulo']} · La Columna de Tecnocríticos", jsonld=datos, base=ruta.startswith("c/"),
                   extra=f'\n  <meta property="article:published_time" content="{col["fecha"]}">\n  <meta property="article:author" content="Helmuhd Moreno">')
            + '<div class="barra-progreso" aria-hidden="true"></div>\n'
            + cabecera("columna")
            + f"""<main class="w grid">
 <div class="principal"><article class="art">{cuerpo}
  <section class="conversa" id="conversa"><h2>Conversación</h2><p>Los comentarios abren muy pronto. Mientras tanto, vota en <a href="index.html#mesa" style="text-decoration:underline">La Mesa</a> de esta semana.</p></section>
 </article></div>
 <aside class="rail">
  <section class="caja"><h3>Sobre el autor</h3><div class="quien" style="display:flex;gap:12px;align-items:center;margin-top:10px"><span class="avatar">HM</span><div><strong style="font:700 15px var(--f-titular)">Helmuhd Moreno</strong><div class="meta">Director de Tecnocríticos</div></div></div>
   <p>Comunicador social y periodista con más de 20 años de experiencia en agencias, oficinas de prensa y departamentos de mercadeo. MBA, especialista en Alta Gerencia, docente universitario y experto en marketing, comunicación digital, comunicación organizacional y periodismo. Apasionado por la tecnología, las nuevas tendencias del mercado y las redes sociales.</p></section>
  <section class="caja" data-quitar="1"><h3>Archivo de columnas</h3><ul class="archivo-col">{archivo}</ul><p>Cada lunes, una nueva.</p></section>
  {bloque_mesa()}{bloque_hype()}{bloque_podcast()}{bloque_explora()}
 </aside>
</main>
{boletin()}
""" + pie())


if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import generar_noticias  # páginas de cada noticia, quiénes somos, sitemap, RSS, robots y llms.txt
    for nombre, html in [("index.html", portada()), ("noticias.html", pagina_noticias()),
                         ("noticia.html", pagina_noticia()), ("columna.html", pagina_columna()),
                         ("quienes-somos.html", generar_noticias.pagina_quienes()),
                         ("rss.html", generar_noticias.pagina_rss()),
                         ("privacidad.html", generar_noticias.pagina_privacidad()),
                         ("multimedia.html", pagina_multimedia())]:
        (RAIZ / nombre).write_text(html, encoding="utf-8")
        print("generado", nombre)
    (RAIZ / "c").mkdir(exist_ok=True)
    for c in COLUMNAS[1:]:
        (RAIZ / url_columna(c)).write_text(pagina_columna(c), encoding="utf-8")
        print("generado", url_columna(c))
    (RAIZ / "m").mkdir(exist_ok=True)
    for pz in cargar_piezas():
        (RAIZ / url_pieza(pz)).write_text(pagina_pieza(pz), encoding="utf-8")
        print("generado", url_pieza(pz))
    generar_noticias.main()
