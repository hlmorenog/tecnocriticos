# Instrucciones: edición diaria de noticias de Tecnocríticos

Estas son las instrucciones que sigue la tarea programada que prepara las noticias cada mañana.
Si quieres cambiar el tono, los temas o la cantidad de noticias, edita este archivo: la tarea lo lee en cada ejecución.

## Objetivo

Preparar la edición del día, con **5 noticias** en español, y dejarla como **pull request para que el director la revise**.
Nunca se publica directo en `main`.

## Secciones (usa exactamente estos nombres en el campo `seccion`)

| Sección | Qué cubre | Cupo diario |
|---|---|---|
| `Colombia` | Tecnología en Colombia: MinTIC, startups, conectividad, regulación, ciberseguridad, empresas y gobierno digital | 2 |
| `IA y tecnología` | Inteligencia artificial, grandes tecnológicas, hardware, regulación internacional | 2 |
| `Videojuegos y series` | Lanzamientos, industria del videojuego, plataformas de streaming, series y cine | 1 |

Si un día no hay noticias sólidas para una sección, pasa el cupo a otra. Es mejor publicar 4 noticias buenas que 5 con una débil.

## Cómo elegir y verificar

1. Busca noticias de las **últimas 24 a 48 horas**. Usa varias búsquedas por sección.
   **Prioriza estos medios**, que son confiables y conocidos por los lectores:
   - Colombia: `eltiempo.com`, `elespectador.com`, `semana.com`, `larepublica.co`, `portafolio.co`, `elheraldo.co`, `elcolombiano.com`, `enter.co`, `impactotic.co`, `mintic.gov.co`
   - IA y tecnología: `xataka.com`, `xataka.com.co`, `elpais.com`, `bbc.com`, `theverge.com`, `apnews.com`
   - Videojuegos y series: `3djuegos.com`, `vidaextra.com`, `variety.com`, y también `xataka.com` y `theverge.com`
   Puedes citar otros medios serios (agencias, diarios reconocidos, comunicados oficiales). Evita blogs anónimos, agregadores y sitios de rumores.
   Para leer una página, usa WebFetch; si falla, descárgala con `curl -sL` y lee el texto.
2. **Lee la fuente** de cada noticia antes de escribirla, no solo el titular del buscador.
3. Cada noticia lleva **al menos una fuente** con su enlace real. Si puedes, pon dos fuentes independientes.
4. **No inventes nada**: ni cifras, ni citas, ni fechas, ni nombres. Si un dato no está en la fuente, no va.
5. No repitas noticias ya publicadas: revisa los archivos de `noticias/` de los últimos 7 días.
6. Descarta notas de prensa sin sustancia, rumores sin fuente y contenido patrocinado.

## Cómo escribir

- **Tono**: el de Tecnocríticos, *«La tecnología, sin fanatismo»*. Informativo, claro, sin exageración ni entusiasmo publicitario. Ni tecnófobo ni tecnófilo.
- **Redacción propia**: todo el texto se escribe con tus palabras. **No uses citas textuales** (nada entre comillas copiado de la fuente o de una declaración). Si alguien dijo algo relevante, cuéntalo en estilo indirecto: «la ministra aseguró que…». No copies frases de la fuente.
- **Español neutro con sensibilidad colombiana**: cifras en pesos colombianos cuando aplique y fechas como «20 de noviembre».
- **`titular`**: informativo y concreto, de hasta unos 90 caracteres. Sin clickbait ni signos de exclamación.
- **`entradilla`**: una frase que diga por qué importa.
- **`cuerpo`**: 2 o 3 párrafos cortos. Qué pasó, quién, cuándo y el contexto necesario.
- **`mirada`**: **una sola frase contundente, de máximo 25 palabras**, con la posición de la casa. Se muestra como destacado, así que debe leerse de un vistazo. A quién beneficia, qué no se dice o qué separa el anuncio de la realidad. Debe apoyarse en hechos de la noticia, no en opinión gratuita. Lo que no quepa, va en `cuerpo`.
- **`titular_corto`**: versión de 3 a 6 palabras para la lista «En 1 minuto» (por ejemplo, «GTA VI llega sin disco»).
- **`por_que_importa`**: una frase que completa «Por qué importa: …», en minúscula inicial. Es la idea clave para el lector.
- **`dato`**: la línea en negrita que acompaña la noticia en el listado. `etiqueta` es una de: «Por qué importa», «El dato», «En cifras», «Ojo», «Lo que no se dice». `texto` es una frase corta respaldada por la fuente.
- **Temas judiciales y legales: precisión exacta.** Usa el término jurídico correcto para cada actuación y autoridad, y explica en lenguaje claro qué es. Un ministerio o una superintendencia abre *investigaciones administrativas* (no juzga ni condena); un juez *dicta sentencia*; la Fiscalía *imputa* o *acusa*. No presentes como sanción lo que es una investigación, ni como condena lo que es una imputación. Si la fuente usa un término técnico que el lector puede malinterpretar (por ejemplo, «formulación de cargos» en un proceso administrativo), tradúcelo y aclara el alcance. Ante la duda, sé más conservador.
- **`lead`** (obligatorio): el lead periodístico, una o dos frases (entre 25 y 45 palabras) que cuentan lo esencial: qué pasó, quién, cuándo y dónde. Se muestra en negrita al inicio de la noticia. No repite la entradilla palabra por palabra y solo usa datos de las fuentes.

## Formato del archivo

Crea **un archivo por día**: `noticias/AAAA-MM-DD.json` (fecha de Colombia, UTC-5). La web lee estos archivos automáticamente; no hay que tocar ningún HTML.

```json
{
  "fecha": "2026-11-21",
  "noticias": [
    {
      "id": "2026-11-21-slug-corto-del-titular",
      "seccion": "Colombia",
      "titular": "…",
      "entradilla": "…",
      "cuerpo": ["Primer párrafo…", "Segundo párrafo…"],
      "mirada": "…",
      "titular_corto": "…",
      "por_que_importa": "…",
      "dato": { "etiqueta": "El dato", "texto": "…" },
      "lead": "…",
      "imagen": {
        "archivo": "img/noticias/2026-11-21-slug-corto-del-titular.jpg",
        "alt": "Descripción breve de lo que se ve en la foto",
        "autor": "Nombre del autor",
        "licencia": "CC BY 4.0",
        "fuente": "Wikimedia Commons",
        "url": "https://commons.wikimedia.org/wiki/File:…",
        "encuadre": "completa"
      },
      "fuentes": [
        { "nombre": "Nombre del medio", "url": "https://…" }
      ]
    }
  ]
}
```

- `id`: la fecha más un slug en minúsculas, sin tildes, con guiones. Debe ser único.
- `videos` es opcional: solo si el video aporta a la noticia (por ejemplo, comparar dos comerciales). Es una lista de `{ "titulo": "…", "youtube": "ID de 11 caracteres", "descripcion": "…" }`; `videos_titulo` es el encabezado del bloque. Verifica cada video con `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json` (debe responder 200) y di en la descripción quién lo subió si no es el canal oficial.
- `multimedia` es opcional, para piezas propias de Tecnocríticos: `{ "titulo": "Explicado en imágenes", "video": { "archivo": "media/<id>.mp4", "poster": "media/<id>-poster.jpg", "titulo": "…" }, "infografia": { "archivo": "img/noticias/<id>-infografia.jpg", "alt": "…" } }`. Solo con aprobación de la dirección.
- `encuadre` es opcional: ponlo en `"completa"` solo para fotos de producto o verticales que no deben recortarse; si no, omítelo.
- Ordena las noticias de la más a la menos importante: la primera aparece destacada en la portada.
- **Noticia principal**: debe ser reciente para el lector (preferiblemente de las últimas 24 horas). Si una actualización del día es más reciente e igual o más importante que la principal, propón a la dirección subirla al primer lugar.
- **Foto de la principal**: debe ser horizontal y llenar el formato 16:9. Las fotos verticales o con `"encuadre": "completa"` solo van en noticias secundarias.
- Valida el JSON antes de guardarlo (por ejemplo con `python3 -m json.tool`).
- Después, regenera el sitio: `python3 herramientas/generar_paginas.py`. Crea la página completa de cada noticia (`n/<id>.html`, que es la que leen Google, los buscadores con IA y las redes sociales), actualiza la portada y el listado, y rehace `sitemap.xml`, `sitemap-noticias.xml`, `feed.xml`, `robots.txt` y `llms.txt`. **Sin este paso, las noticias del día no existen para los buscadores** y se comparten sin foto ni titular.
- No modifiques a mano ningún otro archivo del repositorio. Las fotos nuevas van en `img/noticias/`; lo demás lo actualiza `generar_paginas.py`.

## Fotos

Cada noticia lleva una foto **con licencia libre** y su crédito. La web muestra el crédito debajo de la foto.

1. **Dónde buscar**, en este orden: Wikimedia Commons (API: `https://commons.wikimedia.org/w/api.php`, sin clave), Unsplash y Pexels.
   **Nunca uses fotos de los medios fuente ni de agencias** (tienen derechos de autor), ni imágenes generadas por IA.
2. **Licencias válidas**: dominio público, CC0, CC BY o CC BY-SA (cualquier versión), y las licencias de Unsplash y Pexels. Descarta CC BY-NC y CC BY-ND.
3. **Actualidad**: si la foto muestra un producto (consola, teléfono, computador), debe ser un modelo actual y coherente con la noticia. En videojuegos de PlayStation 5 o Xbox Series X|S, usa esas consolas, nunca generaciones anteriores (PS4, Xbox One, Xbox 360…).
4. **Relevancia**: la foto debe mostrar algo relacionado (el lugar, la empresa, el producto, el tipo de objeto). Si es genérica, dilo en el `alt` con «(imagen ilustrativa)». Nunca uses la foto de una persona para ilustrar a otra.
5. **Crédito completo**: `autor`, `licencia`, `fuente` y `url` de la página de la foto (no del archivo).
6. **Archivo**: descárgala, redúcela a 1200 px de ancho como máximo, guárdala en JPG de calidad 76–82 como `img/noticias/<id>.jpg` y verifica que pese menos de 300 KB. Por ejemplo, con Python y Pillow: `im.thumbnail((1200,1200)); im.save(ruta, quality=78, optimize=True, progressive=True)`.
   Wikimedia limita las descargas rápidas: espera unos segundos entre peticiones y envía un `User-Agent` descriptivo.
7. Si no encuentras una foto adecuada, **omite el campo `imagen`**: la web muestra un bloque de color de la sección.

## Entrega para revisión

1. Crea la rama `noticias/AAAA-MM-DD` a partir de `main` actualizado.
2. Haz commit del archivo de noticias, de sus fotos (`img/noticias/`) y de todo lo que regeneró `generar_paginas.py` (`n/`, `index.html`, `noticias.html`, `sitemap.xml`, `sitemap-noticias.xml`, `feed.xml`, `llms.txt` y demás), con el mensaje `Noticias del AAAA-MM-DD`. Revisa con `git status` que no haya cambios ajenos a la edición.
3. Sube la rama (`git push -u origin noticias/AAAA-MM-DD`) y abre un **pull request hacia `main`** con la API REST de GitHub (GraphQL y `gh pr create` no están disponibles en estas sesiones):
   `gh api repos/hlmorenog/tecnocriticos/pulls -f title='…' -f head='noticias/AAAA-MM-DD' -f base='main' -f body='…'`
   El pull request lleva:
   - Título: `Noticias del <día> de <mes>`
   - Cuerpo: la lista de titulares con su sección y enlace a la fuente, el crédito de cada foto, y cualquier duda o dato que el director deba verificar.
4. Si el archivo del día ya existe en `main` o ya hay un pull request abierto para esa fecha (`gh api "repos/hlmorenog/tecnocriticos/pulls?state=open"`), no crees otro.
5. Si una página de un medio de la lista no abre, prueba con otra noticia u otro medio de la lista. Si ninguna abre, no publiques nada e informa el bloqueo.

El director revisa el pull request y pulsa **Merge** para publicar. Si quiere cambios, los pide en un comentario del pull request.
