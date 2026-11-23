"""Genera el HTML del Boletín Tecnocríticos para pegarlo en MailerLite (editor de HTML personalizado).

Uso:  python3 herramientas/generar_boletin.py boletin/AAAA-MM-DD.json [salida.html]

El archivo de edición (boletin/AAAA-MM-DD.json) define:
  numero, fecha (lunes de envío), asunto, preencabezado, intro (la semana en dos frases),
  principal (id de la noticia de la semana) y esenciales (lista de ids, idealmente 5).
El resto (titulares, entradillas, mirada crítica, fotos) sale de noticias/*.json.

Correo hecho con tablas y estilos en línea, ancho 600 px, para que se vea bien en Gmail,
Outlook y Apple Mail. {$unsubscribe} y {$url} son etiquetas de MailerLite.
"""
import html
import json
import sys
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITIO = "https://tecnocriticos.com"
VERDE, VERDE_OSC, TINTA, GRIS_TXT, GRIS_FONDO, LINEA, SUAVE = "#00875A", "#00704B", "#111111", "#555555", "#EDEDEA", "#D6D6D0", "#F4F4F1"
LETRA = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
e = lambda t: html.escape(str(t or ""), quote=True)


def todas_las_noticias():
    res = {}
    for f in sorted((RAIZ / "noticias").glob("*.json")):
        for n in json.loads(f.read_text(encoding="utf-8")).get("noticias", []):
            res[n["id"]] = n
    return res


def fecha_larga(iso):
    d = date.fromisoformat(iso)
    return f"{DIAS[d.weekday()].capitalize()} {d.day} de {MESES[d.month - 1]} de {d.year}"


def enlace(n, campana):
    return f"{SITIO}/n/{n['id']}.html?utm_source=boletin&amp;utm_medium=email&amp;utm_campaign={campana}"


def boton(texto, url):
    return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="{VERDE}" style="border-radius:999px;">'
            f'<a href="{url}" style="display:inline-block;padding:12px 22px;font:700 14px/1 {LETRA};color:#ffffff;text-decoration:none;border-radius:999px;">{e(texto)}</a>'
            f'</td></tr></table>')


def etiqueta(texto, color=VERDE):
    return f'<div style="font:700 11px/1.4 {LETRA};letter-spacing:.12em;text-transform:uppercase;color:{color};margin:0 0 8px;">{e(texto)}</div>'


def foto_169(archivo, ident):
    """Los correos no recortan fotos con CSS: se guarda una copia 16:9 en img/boletin/."""
    from PIL import Image
    destino = Path("img/boletin") / f"{ident}.jpg"
    if not (RAIZ / destino).is_file():
        im = Image.open(RAIZ / archivo).convert("RGB")
        w, h = im.size
        if w / h > 16 / 9:
            nw = round(h * 16 / 9); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = round(w * 9 / 16); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        (RAIZ / destino).parent.mkdir(parents=True, exist_ok=True)
        im.resize((1200, 675), Image.LANCZOS).save(RAIZ / destino, "JPEG", quality=78, optimize=True, progressive=True)
    return destino.as_posix()


GAP = 12  # separación entre módulos


def credito_de(img):
    c = " · ".join(x for x in [img.get("autor"), img.get("licencia")] if x)
    return f"Foto: {c}" if c else ""


def foto_de(n):
    img = n.get("imagen") or {}
    if img.get("archivo") and (RAIZ / img["archivo"]).is_file():
        return foto_169(img["archivo"], n["id"]), img.get("alt") or n["titular"], credito_de(img)
    return None


def modulo(contenido, fondo="#ffffff", padding="24px", clase="p"):
    """Una tarjeta del boletín: bloque con fondo propio, esquinas redondeadas y aire debajo."""
    return f"""<tr><td style="padding:0 0 {GAP}px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="{clase}" bgcolor="{fondo}" style="background:{fondo};border-radius:10px;padding:{padding};">{contenido}</td></tr></table></td></tr>"""


def imagen(ruta, alt, url, radio="10px 10px 0 0"):
    return (f'<a href="{url}"><img src="{SITIO}/{e(ruta)}" width="600" alt="{e(alt)}" '
            f'style="display:block;width:100%;height:auto;border:0;border-radius:{radio};"></a>')


def principal(n, campana):
    url = enlace(n, campana)
    f = foto_de(n)
    mirada = (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 22px;"><tr>'
              f'<td style="border-left:3px solid {VERDE};background:{SUAVE};border-radius:0 6px 6px 0;padding:14px 16px;">'
              f'{etiqueta("La mirada crítica")}<div style="font:400 15px/1.5 {LETRA};color:{TINTA};">{e(n["mirada"])}</div></td></tr></table>'
              if n.get("mirada") else '<div style="height:18px;"></div>')
    cuerpo = f"""{etiqueta("La noticia de la semana")}
<h2 style="font:800 26px/1.15 {LETRA};letter-spacing:-.02em;color:{TINTA};margin:0 0 10px;"><a href="{url}" style="color:{TINTA};text-decoration:none;">{e(n["titular"])}</a></h2>
<p style="font:700 16px/1.5 {LETRA};color:{TINTA};margin:0;">{e(n.get("lead") or n["entradilla"])}</p>
{mirada}{boton("Leer la noticia completa", url)}
{f'<div style="font:400 11px/1.4 {LETRA};color:{GRIS_TXT};margin:16px 0 0;">{e(f[2])}</div>' if f and f[2] else ""}"""
    arriba = imagen(f[0], f[1], url) if f else ""
    return modulo(f'{arriba}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="p" style="padding:22px 24px 24px;">{cuerpo}</td></tr></table>',
                  padding="0", clase="")


def tarjeta(n, campana, ancha=False):
    """Tarjeta de «Lo esencial»: foto 16:9 arriba, sección, titular y entradilla."""
    url = enlace(n, campana)
    f = foto_de(n)
    tam = "19px" if ancha else "17px"
    foto = imagen(f[0], f[1], url) if f else ""
    cred = f'<div style="font:400 10px/1.4 {LETRA};color:#8A8A85;margin:10px 0 0;">{e(f[2])}</div>' if f and f[2] else ""
    return f"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background:#ffffff;border-radius:10px;">
<tr><td>{foto}</td></tr>
<tr><td style="padding:16px 18px 18px;text-align:left;">
 {etiqueta(n.get("seccion", ""), VERDE)}
 <a href="{url}" style="font:700 {tam}/1.3 {LETRA};color:{TINTA};text-decoration:none;">{e(n["titular"])}</a>
 <p style="font:400 14px/1.5 {LETRA};color:{GRIS_TXT};margin:8px 0 0;">{e(n["entradilla"])}</p>{cred}
</td></tr></table>"""


def rejilla(ess, campana):
    """Lo esencial en módulos de dos columnas; con número impar, la primera va a lo ancho. En celular se apilan."""
    filas = []
    sobra, pares = (ess[:1], ess[1:]) if len(ess) % 2 else ([], ess)
    if sobra:  # con un número impar, la primera abre la sección a lo ancho
        filas.append(f'<tr><td style="padding:0 0 {GAP}px;">{tarjeta(sobra[0], campana, ancha=True)}</td></tr>')
    ancho = (600 - GAP) // 2
    for i in range(0, len(pares), 2):
        a, b = pares[i], pares[i + 1]
        filas.append(f"""<tr><td style="padding:0 0 {GAP}px;font-size:0;text-align:left;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td width="{ancho}" valign="top"><![endif]-->
<div class="col" style="display:inline-block;vertical-align:top;width:100%;max-width:{ancho}px;">{tarjeta(a, campana)}</div><!--[if mso]></td><td width="{GAP}"></td><td width="{ancho}" valign="top"><![endif]--><div class="col gap" style="display:inline-block;vertical-align:top;width:100%;max-width:{ancho}px;margin-left:{GAP}px;">{tarjeta(b, campana)}</div>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>""")
    return "".join(filas)


def generar(edicion):
    sys.path.insert(0, str(RAIZ / "herramientas"))
    import generar_paginas as gp
    noticias = todas_las_noticias()
    campana = f"boletin-{edicion['fecha']}"
    utm = f"utm_source=boletin&amp;utm_medium=email&amp;utm_campaign={campana}"
    p = noticias[edicion["principal"]]
    ess = [noticias[i] for i in edicion["esenciales"]]
    col = gp.COLUMNA
    indice = " · ".join(n.get("titular_corto") or n["titular"] for n in [p] + ess[:2])

    cabecera = modulo(f"""<a href="{SITIO}/?{utm}" style="font:900 30px/1 {LETRA};letter-spacing:-.04em;color:#ffffff;text-decoration:none;"><span style="color:{VERDE};">&#9679;</span>&nbsp;tecnocríticos</a>
<div style="font:700 11px/1.5 {LETRA};letter-spacing:.12em;text-transform:uppercase;color:#7FD1B0;margin:16px 0 4px;">Boletín Nº {e(edicion["numero"])} · {e(fecha_larga(edicion["fecha"]))}</div>
<div style="font:400 14px/1.5 {LETRA};color:#C9C9C4;">Lo esencial de la tecnología en 5 minutos. Hoy: {e(indice)} y más.</div>""", fondo=TINTA, padding="26px 24px")

    semana = modulo(f"""{etiqueta("La semana en dos frases")}
<p style="font:500 18px/1.5 {LETRA};color:{TINTA};margin:0;">{e(edicion["intro"])}</p>""")

    titulo_ess = f'<tr><td style="padding:8px 4px {GAP}px;"><div style="font:800 20px/1.2 {LETRA};color:{TINTA};">Lo esencial <span style="font:400 14px {LETRA};color:{GRIS_TXT};">· {len(ess)} noticias que importan</span></div></td></tr>'

    columna = modulo(f"""{etiqueta("La Columna · Opinión", "#CFEFE2")}
<a href="{SITIO}/columna.html?{utm}" style="font:800 22px/1.2 {LETRA};color:#ffffff;text-decoration:none;">{e(col["titulo"])}</a>
<p style="font:400 15px/1.5 {LETRA};color:#E3F4EC;margin:8px 0 16px;">{e(col["resumen"])}</p>
<a href="{SITIO}/columna.html?{utm}" style="font:700 14px {LETRA};color:#ffffff;">Leer La Columna →</a>""", fondo=VERDE)

    reenvio = modulo(f"""<p style="font:600 15px/1.5 {LETRA};color:{TINTA};margin:0 0 6px;">¿Te sirvió? Reenvíalo a alguien que quiera entender la tecnología sin fanatismo.</p>
<div style="font:400 13px/1.5 {LETRA};color:{GRIS_TXT};">¿Te lo reenviaron? <a href="{SITIO}/?{utm}#boletin" style="color:{VERDE};font-weight:700;">Suscríbete gratis</a></div>""", padding="20px 24px")

    return f"""<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting"><title>{e(edicion["asunto"])}</title>
<style>a{{color:{VERDE};}}
@media (max-width:620px){{.c{{width:100%!important;}} .p{{padding-left:18px!important;padding-right:18px!important;}} .col{{max-width:100%!important;}} .gap{{margin-left:0!important;margin-top:{GAP}px!important;}}}}</style>
</head>
<body style="margin:0;padding:0;background:{GRIS_FONDO};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{e(edicion["preencabezado"])}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{GRIS_FONDO}"><tr><td align="center" style="padding:16px 10px 24px;">
<table role="presentation" class="c" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
<tr><td style="padding:0 4px 10px;font:400 12px/1.4 {LETRA};color:{GRIS_TXT};text-align:right;"><a href="{{$url}}" style="color:{GRIS_TXT};">Ver en el navegador</a></td></tr>
{cabecera}
{semana}
{principal(p, campana)}
{titulo_ess}
{rejilla(ess, campana)}
{columna}
{reenvio}
<tr><td class="p" style="padding:10px 4px 0;font:400 12px/1.6 {LETRA};color:{GRIS_TXT};">
  <b style="color:{TINTA};">Tecnocríticos</b> · La tecnología, sin fanatismo.<br>
  Recibes este correo porque te suscribiste al Boletín Tecnocríticos en tecnocriticos.com.<br>
  <a href="{{$unsubscribe}}" style="color:{GRIS_TXT};">Cancelar suscripción</a> · <a href="{SITIO}/privacidad.html" style="color:{GRIS_TXT};">Privacidad</a> · <a href="{SITIO}/rss.html" style="color:{GRIS_TXT};">RSS</a>
</td></tr>
</table>
</td></tr></table>
</body></html>
"""


if __name__ == "__main__":
    ed_path = Path(sys.argv[1])
    edicion = json.loads(ed_path.read_text(encoding="utf-8"))
    salida = Path(sys.argv[2]) if len(sys.argv) > 2 else ed_path.with_suffix(".html")
    salida.write_text(generar(edicion), encoding="utf-8")
    print("generado", salida)
