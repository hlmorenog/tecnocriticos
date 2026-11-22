#!/usr/bin/env python3
"""Páginas estáticas de las noticias y archivos para buscadores. Lo llama generar_paginas.py.

Genera:
- n/<id>.html          página completa de cada noticia (texto en el HTML, datos estructurados NewsArticle
                       y vista previa para redes). Es la dirección pública y la que se comparte.
- quienes-somos.html   quién hace el sitio, principios, fuentes, fotos y correcciones.
- sitemap.xml          todas las páginas, para Google y Bing.
- sitemap-noticias.xml noticias de los últimos 2 días, en formato de Google News.
- feed.xml             RSS con las últimas noticias (agregadores, lectores y buscadores con IA).
- robots.txt           permite el rastreo e indica dónde están los sitemaps.
- llms.txt             resumen del sitio para modelos de lenguaje y buscadores con IA.

Por qué: los buscadores con IA (y a veces Google) no ejecutan JavaScript. Si el texto de una noticia
solo aparece al ejecutar main.js, para ellos la noticia no existe.
"""
import re
from urllib.parse import quote
from datetime import date, datetime, timedelta
from email.utils import format_datetime
from pathlib import Path

import generar_paginas as gp

RAIZ = gp.RAIZ
SITIO = gp.SITIO
esc = gp.esc
ID_VALIDO = re.compile(r"^[a-z0-9-]+$")
ID_YOUTUBE = re.compile(r"^[A-Za-z0-9_-]{11}$")
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre",
         "noviembre", "diciembre"]
DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
SECCION_CSS = {"Colombia": ("foto--co", "CO"), "IA y tecnología": ("foto--ia", "IA"),
               "Videojuegos y series": ("foto--juegos", "▶")}
PUBLICADOR = {k: v for k, v in gp.ORGANIZACION.items() if k in ("@type", "@id", "name", "url", "logo")}


def fecha_larga(iso):
    d = date.fromisoformat(iso)
    return f"{DIAS[d.weekday()]}, {d.day} de {MESES[d.month - 1]} de {d.year}"


def minutos(n):
    palabras = len(" ".join([n.get("entradilla", ""), *n.get("cuerpo", []), n.get("mirada", "")]).split())
    return max(2, round(palabras / 200) + 1)


def tamano_jpg(ruta):
    """Ancho y alto de un JPG sin librerías externas."""
    datos = ruta.read_bytes()
    i = 2
    while i < len(datos) - 9:
        if datos[i] != 0xFF:
            i += 1
            continue
        if datos[i + 1] in (0xC0, 0xC1, 0xC2):
            return int.from_bytes(datos[i + 7:i + 9], "big"), int.from_bytes(datos[i + 5:i + 7], "big")
        i += 2 + int.from_bytes(datos[i + 2:i + 4], "big")
    return None, None


def foto_de(n):
    """(ruta, ancho, alto, alt) si la noticia tiene foto válida; si no, None."""
    i = n.get("imagen") or {}
    ruta = i.get("archivo", "")
    if not ruta or ".." in ruta or not (RAIZ / ruta).is_file():
        return None
    ancho, alto = tamano_jpg(RAIZ / ruta) if ruta.lower().endswith((".jpg", ".jpeg")) else (None, None)
    return ruta, ancho, alto, i.get("alt") or n["titular"]


def html_foto(n):
    f = foto_de(n)
    if f:
        completa = " foto--completa" if (n.get("imagen") or {}).get("encuadre") == "completa" else ""
        medidas = f' width="{f[1]}" height="{f[2]}"' if f[1] else ""
        i = n["imagen"]
        partes = " · ".join(x for x in ["Foto: " + esc(i.get("autor") or "Autor desconocido"), esc(i.get("fuente")),
                                        esc(i.get("licencia"))] if x)
        cred = (f'<a href="{esc(i["url"])}" target="_blank" rel="noopener">{partes}</a>' if i.get("url") else partes)
        return (f'<img class="foto{completa}" src="{esc(f[0])}" alt="{esc(f[3])}"{medidas} fetchpriority="high">'
                f'<p class="cred">{cred}</p>')
    clase, glifo = SECCION_CSS.get(n["seccion"], SECCION_CSS["IA y tecnología"])
    return f'<div class="foto foto--vacia {clase}" aria-hidden="true">{esc(glifo)}</div>'


def datos_noticia(n):
    url = gp.url_noticia(n, absoluta=True)
    f = foto_de(n)
    articulo = {
        "@type": "NewsArticle",
        "@id": url + "#noticia",
        "headline": n["titular"][:110],
        "description": n.get("entradilla", ""),
        "url": url,
        "mainEntityOfPage": url,
        "inLanguage": "es-CO",
        "datePublished": n["fecha"],
        "dateModified": n["fecha"],
        "articleSection": n["seccion"],
        "wordCount": len(" ".join(n.get("cuerpo", [])).split()),
        "author": {"@type": "Organization", "name": "Redacción Tecnocríticos", "url": f"{SITIO}/quienes-somos.html"},
        "publisher": PUBLICADOR,
        "isAccessibleForFree": True,
        "citation": [fu["url"] for fu in n.get("fuentes", []) if fu.get("url")],
    }
    if n.get("por_que_importa"):
        articulo["abstract"] = "Por qué importa: " + n["por_que_importa"]
    if f:
        foto = {"@type": "ImageObject", "url": f"{SITIO}/{f[0]}", "caption": f[3]}
        if f[1]:
            foto.update(width=f[1], height=f[2])
        i = n.get("imagen") or {}
        if i.get("autor"):
            foto["creditText"] = f'{i["autor"]} · {i.get("fuente", "")} · {i.get("licencia", "")}'.strip(" ·")
        if i.get("url"):
            foto["acquireLicensePage"] = i["url"]
        articulo["image"] = [foto]
    else:
        articulo["image"] = [f"{SITIO}/img/compartir.png"]
    migas = {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Hoy", "item": f"{SITIO}/"},
        {"@type": "ListItem", "position": 2, "name": n["seccion"],
         "item": f"{SITIO}/noticias.html?seccion={quote(n['seccion'])}"},
        {"@type": "ListItem", "position": 3, "name": n["titular"]}]}
    return [articulo, migas]


def pagina_noticia(n, todas):
    titular, entradilla = esc(n["titular"]), esc(n.get("entradilla"))
    f = foto_de(n)
    imagen = (f[0], f[1], f[2], esc(f[3])) if f else None
    seccion_q = quote(n["seccion"])
    cuerpo = "".join(f"<p>{esc(p)}</p>" for p in (n.get("cuerpo") or []))
    cifra = (f'<div class="dato"><strong>{esc(n["cifra"]["valor"])}</strong><span>{esc(n["cifra"].get("texto"))}</span></div>'
             if (n.get("cifra") or {}).get("valor") else "")
    importa = f'<p class="bl"><b>Por qué importa:</b>{esc(n["por_que_importa"])}</p>' if n.get("por_que_importa") else ""
    tri = ""
    if n.get("mirada"):
        tri = (f'<div class="analisis"><div class="analisis__mirada"><h4>La mirada crítica</h4><p>{esc(n["mirada"])}</p></div>'
               '</div>')
    videos = ""
    lista_v = [v for v in (n.get("videos") or []) if ID_YOUTUBE.match(v.get("youtube", ""))]
    if lista_v:
        items = "".join(
            f'<figure class="video"><div class="video__marco"><iframe src="https://www.youtube-nocookie.com/embed/{v["youtube"]}" '
            f'title="{esc(v.get("titulo") or "Video")}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" '
            f'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'
            f'<figcaption><b>{esc(v.get("titulo"))}</b>{(" " + esc(v["descripcion"])) if v.get("descripcion") else ""} '
            f'<a href="https://www.youtube.com/watch?v={v["youtube"]}" target="_blank" rel="noopener">Ver en YouTube</a></figcaption></figure>'
            for v in lista_v)
        titulo_v = esc(n.get("videos_titulo") or "Videos")
        videos = f'<section class="videos" aria-label="{titulo_v}"><h2 class="videos__tit">{titulo_v}</h2><div class="videos__rej">{items}</div></section>'
    fuentes = "".join(f'<li><a href="{esc(fu["url"])}" target="_blank" rel="noopener">{esc(fu.get("nombre") or fu["url"])}</a></li>'
                      for fu in n.get("fuentes", []) if fu.get("url"))
    fuentes = f'<div class="fuentes"><span class="lab" style="color:var(--gris)">Fuentes</span><ul>{fuentes}</ul></div>' if fuentes else ""
    otras = sorted([x for x in todas if x["id"] != n["id"]][:12], key=lambda x: x["seccion"] != n["seccion"])[:4]
    rel = ""
    if otras:
        rel = ('<section class="feed art-cuerpo"><h2>Más noticias <span class="meta"><a href="noticias.html">Ver todas →</a></span></h2>'
               + "".join(gp.item_estatico(x) for x in otras) + "</section>")
    extra = (f'\n  <meta property="article:published_time" content="{n["fecha"]}">'
             f'\n  <meta property="article:section" content="{esc(n["seccion"])}">')
    return (gp.cabeza(f"{titular} — Tecnocríticos", entradilla, "article", gp.url_noticia(n), titular,
                      imagen=imagen, jsonld=datos_noticia(n), base=True, extra=extra)
            + '<div class="barra-progreso" aria-hidden="true"></div>\n'
            + gp.cabecera()
            + f"""<main class="w grid">
 <div class="principal"><article class="art" data-noticia-id="{esc(n['id'])}">
  <nav class="miga" aria-label="Ruta"><a href="index.html">Hoy</a> / <a href="noticias.html?seccion={seccion_q}">{esc(n['seccion'])}</a></nav>
  <span class="lab">{esc(n['seccion'])}</span>
  <h1>{titular}</h1>
  <p class="entradilla">{entradilla}</p>
  <div class="firma-linea"><time datetime="{n['fecha']}">{fecha_larga(n['fecha'])}</time> · <a href="quienes-somos.html">Redacción Tecnocríticos</a> · {minutos(n)} min de lectura</div>
  <div class="compartir compartir--arriba" data-compartir></div>
  {html_foto(n)}
  {cifra}
  {importa}
  <div class="cuerpo">{cuerpo}</div>
  {videos}
  {tri}
  {fuentes}
  <div class="compartir" data-compartir></div>
 </article>
 {rel}</div>
 <aside class="rail">{gp.bloque_minuto()}{gp.bloque_mesa()}{gp.bloque_columna()}{gp.bloque_hype()}{gp.bloque_podcast()}{gp.bloque_explora()}</aside>
</main>
{gp.boletin()}
""" + gp.pie())


def pagina_quienes():
    principios = "".join(f'<li><b>{t}.</b> {d}</li>' for t, d in gp.MANIFIESTO)
    datos = [gp.ORGANIZACION, {"@type": "AboutPage", "url": f"{SITIO}/quienes-somos.html", "inLanguage": "es-CO",
                                "name": "Quiénes somos", "about": {"@id": f"{SITIO}/#organizacion"}},
             {"@type": "Person", "@id": f"{SITIO}/quienes-somos.html#direccion", "name": "Helmuhd Moreno",
              "jobTitle": "Director de Tecnocríticos", "worksFor": {"@id": f"{SITIO}/#organizacion"}}]
    return (gp.cabeza("Quiénes somos — Tecnocríticos",
                      "Tecnocríticos es un medio de periodismo de tecnología potenciado por IA: noticias y análisis diarios del sector, con opiniones que toman posición frente a productos, servicios y organizaciones tech.",
                      "website", "quienes-somos.html", jsonld=datos)
            + gp.cabecera()
            + f"""<main class="w grid">
 <div class="principal"><article class="art">
  <span class="lab">Tecnocríticos</span>
  <h1>Quiénes somos</h1>
  <p class="entradilla">Somos un medio de comunicación de periodismo de tecnología potenciado por inteligencia artificial. Cada día llevamos las noticias y los análisis más importantes del sector, y tomamos posición.</p>
  <div class="cuerpo">
   <h2 id="que-hacemos">Qué hacemos</h2>
   <p>Nuestro objetivo es que entiendas lo que pasa en el mundo de la tecnología sin tener que leerlo todo. Por eso actualizamos el sitio a diario con una edición que reúne las noticias y los análisis que más importan del sector: desde lo que pasa en Colombia hasta la inteligencia artificial, las grandes tecnológicas, los videojuegos y el entretenimiento digital. Puedes leerlas todas o por sección en <a href="noticias.html">Noticias</a>.</p>
   <p>Cada noticia va al grano: qué pasó, por qué importa, nuestra posición y las fuentes para comprobarlo. Además, cada lunes publicamos <a href="columna.html">La Columna</a> de opinión; en el <a href="index.html#hype">Hype-ómetro</a> medimos la distancia entre la promesa y la realidad de cada tendencia, y en <a href="index.html#mesa">La Mesa</a> abrimos el debate de la semana.</p>

   <h2 id="ia">Periodismo potenciado por IA</h2>
   <p>Usamos inteligencia artificial para hacer más y mejor periodismo, no para reemplazar el criterio. La IA nos ayuda a rastrear lo que pasa en el sector, leer las fuentes, ordenar los datos y preparar los borradores de cada edición. Las decisiones son humanas: qué se publica, qué se descarta, qué posición tomamos y qué necesita una verificación adicional.</p>
   <ul>
    <li><b>Nada se publica sin aprobación.</b> Cada edición la revisa y la aprueba la dirección antes de publicarse.</li>
    <li><b>Nada inventado.</b> Ninguna cifra, fecha, nombre o declaración se publica si no está en una fuente. Cada noticia enlaza sus fuentes, y preferimos dos independientes.</li>
    <li><b>Fuentes serias.</b> Priorizamos medios reconocidos, agencias y documentos oficiales. Descartamos rumores, contenido patrocinado y notas de prensa sin sustancia. Si una cifra viene solo de la empresa interesada, lo decimos.</li>
    <li><b>Redacción propia.</b> Escribimos con nuestras palabras, no copiamos a otros medios y contamos las declaraciones en estilo indirecto.</li>
   </ul>

   <h2 id="posicion">Tomamos posición</h2>
   <p>No somos un servicio de cables. Nuestras opiniones editoriales fijan una posición frente a los productos, los servicios y las organizaciones del mundo tech: decimos qué funciona, qué no, a quién beneficia una decisión y qué se queda sin decir en los lanzamientos y anuncios.</p>
   <p>Esa posición tiene reglas. En cada noticia, la opinión va aparte, en el bloque <b>«La mirada crítica»</b>, para que siempre sepas qué es un hecho y qué es nuestra lectura. Y nuestras posiciones se apoyan en hechos verificables, no en simpatías: ninguna marca es nuestro equipo.</p>

   <h2 id="principios">Nuestros principios</h2>
   <ul>{principios}</ul>

   <h2 id="direccion">Dirección</h2>
   <p>Tecnocríticos lo dirige Helmuhd Moreno, comunicador social y periodista con más de 20 años de experiencia en agencias, oficinas de prensa y departamentos de mercadeo. Es MBA, especialista en Alta Gerencia y docente universitario. Escribe La Columna de cada lunes y aprueba cada edición antes de publicarla.</p>

   <h2 id="fotos">Fotos</h2>
   <p>Usamos solo fotos con licencia libre (dominio público, CC0, CC BY o CC BY-SA) de Wikimedia Commons, Unsplash o Pexels, siempre con su crédito. No usamos fotos de agencias ni de otros medios, ni imágenes generadas por IA. Cuando una foto es solo ilustrativa, lo indicamos.</p>

   <h2 id="correcciones">Correcciones</h2>
   <p>Si una nota publicada tiene un error, la corregimos y lo indicamos al final de la nota, con la fecha de la corrección.</p>

   <h2>Síguenos</h2>
   <p>Recibe las noticias por <a href="rss.html">RSS</a> o en el <a href="index.html#boletin">Boletín Crítico</a> de cada lunes.</p>
  </div>
 </article></div>
 <aside class="rail">{gp.bloque_minuto()}{gp.bloque_mesa()}{gp.bloque_columna()}{gp.bloque_hype()}{gp.bloque_explora()}</aside>
</main>
{gp.boletin()}
""" + gp.pie())


def pagina_rss():
    feed = f"{SITIO}/feed.xml"
    feedly = "https://feedly.com/i/subscription/feed%2F" + quote(feed, safe="")
    inoreader = "https://www.inoreader.com/?add_feed=" + quote(feed, safe="")
    return (gp.cabeza("Suscríbete por RSS — Tecnocríticos",
                      "Recibe las noticias de Tecnocríticos en tu lector de RSS: Feedly, Inoreader o la app que prefieras.",
                      "website", "rss.html")
            + gp.cabecera()
            + f"""<main class="w grid">
 <div class="principal"><article class="art">
  <span class="lab">Suscríbete</span>
  <h1>Recibe Tecnocríticos por RSS</h1>
  <p class="entradilla">Con RSS, cada noticia nueva llega sola a tu lector de noticias, sin algoritmos ni correos. Es gratis.</p>
  <div class="cuerpo">
   <h2>Suscríbete con un toque</h2>
   <div class="rss-botones">
    <a class="rss-btn" href="{feedly}" target="_blank" rel="noopener">Abrir en Feedly</a>
    <a class="rss-btn" href="{inoreader}" target="_blank" rel="noopener">Abrir en Inoreader</a>
   </div>
   <h2>¿Usas otra app?</h2>
   <p>Copia esta dirección y pégala en tu lector de RSS (por ejemplo, NetNewsWire, Reeder o Feeder) donde dice «Añadir suscripción» o «Agregar feed»:</p>
   <div class="rss-url"><code>{feed}</code><button type="button" data-copiar-texto="{feed}">Copiar dirección</button></div>
   <h2>¿Qué es RSS?</h2>
   <p>Es una forma abierta de seguir sitios web: tu lector revisa el sitio por ti y te muestra lo nuevo en orden, sin publicidad ni filtros. Si nunca has usado uno, Feedly e Inoreader son gratuitos y funcionan en el celular y en el computador.</p>
   <p>¿Prefieres el correo? Suscríbete al <a href="index.html#boletin">Boletín Crítico</a> de cada lunes.</p>
  </div>
 </article></div>
 <aside class="rail">{gp.bloque_minuto()}{gp.bloque_mesa()}{gp.bloque_columna()}{gp.bloque_hype()}{gp.bloque_explora()}</aside>
</main>
{gp.boletin()}
""" + gp.pie())


def sitemap(todas):
    hoy = date.today().isoformat()
    ultima = todas[0]["fecha"] if todas else hoy
    urls = [("", ultima, "daily", "1.0"), ("noticias.html", ultima, "daily", "0.9"),
            ("columna.html", gp.COLUMNA["fecha"], "weekly", "0.8"), ("quienes-somos.html", hoy, "monthly", "0.5"),
            ("rss.html", hoy, "monthly", "0.3")]
    filas = [f"  <url><loc>{SITIO}/{r}</loc><lastmod>{m}</lastmod><changefreq>{c}</changefreq><priority>{p}</priority></url>"
             for r, m, c, p in urls]
    for n in todas:
        f = foto_de(n)
        img = (f"<image:image><image:loc>{SITIO}/{esc(f[0])}</image:loc></image:image>" if f else "")
        filas.append(f"  <url><loc>{gp.url_noticia(n, True)}</loc><lastmod>{n['fecha']}</lastmod>{img}</url>")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + "\n".join(filas) + "\n</urlset>\n")


def sitemap_noticias(todas):
    """Google News solo acepta noticias de los últimos 2 días."""
    limite = (date.today() - timedelta(days=2)).isoformat()
    filas = [f"""  <url><loc>{gp.url_noticia(n, True)}</loc><news:news>
    <news:publication><news:name>Tecnocríticos</news:name><news:language>es</news:language></news:publication>
    <news:publication_date>{n['fecha']}</news:publication_date><news:title>{esc(n['titular'])}</news:title>
  </news:news></url>""" for n in todas if n["fecha"] >= limite]
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n' + "\n".join(filas) + "\n</urlset>\n")


def feed(todas):
    def fecha_rss(iso):
        return format_datetime(datetime.fromisoformat(iso + "T06:00:00-05:00"))
    items = []
    for n in todas[:50]:
        f = foto_de(n)
        adjunto = (f'<enclosure url="{SITIO}/{esc(f[0])}" length="{(RAIZ / f[0]).stat().st_size}" type="image/jpeg"/>'
                   if f and f[0].lower().endswith((".jpg", ".jpeg")) else "")
        resumen = n.get("entradilla", "") + (" Por qué importa: " + n["por_que_importa"] if n.get("por_que_importa") else "")
        items.append(f"""  <item>
   <title>{esc(n['titular'])}</title>
   <link>{gp.url_noticia(n, True)}</link>
   <guid isPermaLink="true">{gp.url_noticia(n, True)}</guid>
   <pubDate>{fecha_rss(n['fecha'])}</pubDate>
   <category>{esc(n['seccion'])}</category>
   <description>{esc(resumen)}</description>{adjunto}
  </item>""")
    ultima = fecha_rss(todas[0]["fecha"]) if todas else format_datetime(datetime.now().astimezone())
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
 <channel>
  <title>Tecnocríticos</title>
  <link>{SITIO}/</link>
  <description>Noticias de tecnología en Colombia, IA, videojuegos y series, con contexto y mirada crítica.</description>
  <language>es-co</language>
  <lastBuildDate>{ultima}</lastBuildDate>
  <atom:link href="{SITIO}/feed.xml" rel="self" type="application/rss+xml"/>
  <image><url>{gp.LOGO}</url><title>Tecnocríticos</title><link>{SITIO}/</link></image>
{chr(10).join(items)}
 </channel>
</rss>
"""


def robots():
    return f"""# Tecnocríticos: todo el contenido público puede rastrearse e indexarse,
# también por buscadores y asistentes con inteligencia artificial.
User-agent: *
Allow: /
Disallow: /herramientas/
Disallow: /automatizacion/

Sitemap: {SITIO}/sitemap.xml
Sitemap: {SITIO}/sitemap-noticias.xml
"""


def llms(todas):
    lineas = [f"- [{n['titular']}]({gp.url_noticia(n, True)}): {n.get('entradilla', '')}" for n in todas[:20]]
    return f"""# Tecnocríticos

> Medio de comunicación colombiano de periodismo de tecnología potenciado por inteligencia artificial. Publica a diario las noticias y los análisis más importantes del sector tech y fija posición editorial frente a productos, servicios y organizaciones del mundo tech. Lema: «La tecnología, sin fanatismo».

Cada noticia tiene titular, entradilla, «por qué importa», cuerpo con fuentes enlazadas y, separada de los hechos, «la mirada crítica»: la posición editorial de la casa. La IA ayuda a rastrear fuentes y preparar borradores; cada edición la revisa y aprueba la dirección antes de publicarse. Dirige el sitio Helmuhd Moreno, que escribe una columna de opinión cada lunes.

## Páginas principales

- [Portada]({SITIO}/): la edición del día.
- [Todas las noticias]({SITIO}/noticias.html): archivo completo, filtrable por sección.
- [La Columna]({SITIO}/columna.html): columna semanal de opinión del director.
- [Quiénes somos]({SITIO}/quienes-somos.html): misión, uso de IA, posición editorial, principios, dirección, fotos y correcciones.

## Últimas noticias

{chr(10).join(lineas)}

## Datos

- [RSS]({SITIO}/feed.xml): últimas 50 noticias. Cómo suscribirse: {SITIO}/rss.html
- [Sitemap]({SITIO}/sitemap.xml)
"""


def main():
    todas = [n for n in gp.cargar_noticias() if ID_VALIDO.match(n.get("id", ""))]
    carpeta = RAIZ / "n"
    carpeta.mkdir(exist_ok=True)
    for n in todas:
        (carpeta / f"{n['id']}.html").write_text(pagina_noticia(n, todas), encoding="utf-8")
    print(f"generadas {len(todas)} páginas de noticias en n/")
    for nombre, contenido in [("sitemap.xml", sitemap(todas)), ("sitemap-noticias.xml", sitemap_noticias(todas)),
                              ("feed.xml", feed(todas)), ("robots.txt", robots()), ("llms.txt", llms(todas))]:
        (RAIZ / nombre).write_text(contenido, encoding="utf-8")
        print("generado", nombre)
    if not (RAIZ / "img" / "logo-tecnocriticos.png").is_file():
        print("AVISO: falta img/logo-tecnocriticos.png (logo de 512 × 512 para los datos estructurados)")
