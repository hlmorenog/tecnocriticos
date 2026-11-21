#!/usr/bin/env python3
"""Crea una página para compartir por cada noticia: n/<id>.html

Uso (desde la raíz del repositorio):  python3 herramientas/generar_compartir.py

Por qué hace falta: WhatsApp, Facebook, X, LinkedIn y Telegram no ejecutan JavaScript.
Para mostrar la vista previa (titular, entradilla y foto) leen las etiquetas Open Graph
del HTML. Como noticia.html se llena con JavaScript, cada noticia necesita su propia
página estática con esas etiquetas. Al abrirla, el lector pasa directo a noticia.html.

Se puede ejecutar todas las veces que haga falta: vuelve a crear todas las páginas
a partir de los archivos noticias/AAAA-MM-DD.json.
"""
import html
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITIO = "https://tecnocriticos.com"
IMAGEN_POR_DEFECTO = ("img/compartir.png", 1200, 630, "Tecnocríticos: la tecnología, sin fanatismo")
ID_VALIDO = re.compile(r"^[a-z0-9-]+$")


def tamano_jpg(ruta):
    """Ancho y alto de un JPG sin depender de librerías externas."""
    datos = ruta.read_bytes()
    i = 2
    while i < len(datos) - 9:
        if datos[i] != 0xFF:
            i += 1
            continue
        marca = datos[i + 1]
        if marca in (0xC0, 0xC1, 0xC2):
            return int.from_bytes(datos[i + 7:i + 9], "big"), int.from_bytes(datos[i + 5:i + 7], "big")
        i += 2 + int.from_bytes(datos[i + 2:i + 4], "big")
    return None


def pagina(n, fecha):
    e = lambda t: html.escape(str(t or ""), quote=True)
    id_ = n["id"]
    url = f"{SITIO}/n/{id_}.html"
    destino = f"../noticia.html?id={id_}"
    titular = n.get("titular", "")
    entradilla = n.get("entradilla", "")

    imagen, ancho, alto, alt = IMAGEN_POR_DEFECTO
    foto = n.get("imagen") or {}
    archivo = foto.get("archivo", "")
    if archivo and (RAIZ / archivo).is_file() and ".." not in archivo:
        tam = tamano_jpg(RAIZ / archivo) if archivo.lower().endswith((".jpg", ".jpeg")) else None
        imagen, alt = archivo, foto.get("alt") or titular
        ancho, alto = tam if tam else (None, None)
    medidas = (f'\n  <meta property="og:image:width" content="{ancho}">\n  <meta property="og:image:height" content="{alto}">'
               if ancho else "")

    return f"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(titular)} — Tecnocríticos</title>
  <meta name="description" content="{e(entradilla)}">
  <link rel="canonical" href="{e(url)}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Tecnocríticos">
  <meta property="og:locale" content="es_CO">
  <meta property="og:title" content="{e(titular)}">
  <meta property="og:description" content="{e(entradilla)}">
  <meta property="og:url" content="{e(url)}">
  <meta property="og:image" content="{e(SITIO + '/' + imagen)}">{medidas}
  <meta property="og:image:alt" content="{e(alt)}">
  <meta property="article:published_time" content="{e(fecha)}">
  <meta property="article:section" content="{e(n.get('seccion'))}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(titular)}">
  <meta name="twitter:description" content="{e(entradilla)}">
  <meta name="twitter:image" content="{e(SITIO + '/' + imagen)}">
  <meta http-equiv="refresh" content="0; url={e(destino)}">
  <link rel="icon" href="../logo-icono.svg" type="image/svg+xml">
  <style>body{{font:16px/1.5 system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 16px;color:#111;background:#fff}}a{{color:#E4322B}}</style>
</head>
<body>
  <p><a href="{e(destino)}">Abrir la noticia en Tecnocríticos</a></p>
  <h1>{e(titular)}</h1>
  <p>{e(entradilla)}</p>
  <script>location.replace({json.dumps(destino)});</script>
</body>
</html>
"""


def main():
    salida = RAIZ / "n"
    salida.mkdir(exist_ok=True)
    total = 0
    for archivo in sorted((RAIZ / "noticias").glob("*.json")):
        edicion = json.loads(archivo.read_text(encoding="utf-8"))
        for n in edicion.get("noticias", []):
            if not ID_VALIDO.match(n.get("id", "")):
                print("id no válido, se omite:", n.get("id"))
                continue
            (salida / f"{n['id']}.html").write_text(pagina(n, edicion.get("fecha", "")), encoding="utf-8")
            total += 1
    print(f"{total} páginas para compartir en n/")


if __name__ == "__main__":
    main()
