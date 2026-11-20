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
   **Solo puedes leer y citar estos medios**, porque son los que la red de la sesión permite abrir:
   - Colombia: `eltiempo.com`, `elespectador.com`, `semana.com`, `larepublica.co`, `portafolio.co`, `elheraldo.co`, `elcolombiano.com`, `enter.co`, `impactotic.co`, `mintic.gov.co`
   - IA y tecnología: `xataka.com`, `xataka.com.co`, `elpais.com`, `bbc.com`, `theverge.com`, `apnews.com`
   - Videojuegos y series: `3djuegos.com`, `vidaextra.com`, `variety.com`, y también `xataka.com` y `theverge.com`
   Si una noticia solo aparece en otros medios, búscala en uno de estos. Si no está en ninguno, descártala.
   Para ampliar la lista, hay que agregar el dominio en la configuración de red del entorno y aquí.
2. **Lee la fuente** de cada noticia antes de escribirla, no solo el titular del buscador.
3. Cada noticia lleva **al menos una fuente** con su enlace real. Si puedes, pon dos fuentes independientes.
4. **No inventes nada**: ni cifras, ni citas, ni fechas, ni nombres. Si un dato no está en la fuente, no va.
5. No repitas noticias ya publicadas: revisa los archivos de `noticias/` de los últimos 7 días.
6. Descarta notas de prensa sin sustancia, rumores sin fuente y contenido patrocinado.

## Cómo escribir

- **Tono**: el de Tecnocríticos, *«La tecnología, sin fanatismo»*. Informativo, claro, sin exageración ni entusiasmo publicitario. Ni tecnófobo ni tecnófilo.
- **Redacción propia**: resume con tus palabras. No copies párrafos de la fuente. Como máximo, una cita textual corta entre comillas y atribuida.
- **Español neutro con sensibilidad colombiana**: cifras en pesos colombianos cuando aplique y fechas como «20 de noviembre».
- **`titular`**: informativo y concreto, de hasta unos 90 caracteres. Sin clickbait ni signos de exclamación.
- **`entradilla`**: una frase que diga por qué importa.
- **`cuerpo`**: 2 o 3 párrafos cortos. Qué pasó, quién, cuándo y el contexto necesario.
- **`mirada`**: 1 o 2 frases con el ángulo crítico de la casa. A quién beneficia, qué no se dice, qué preguntas quedan abiertas o qué separa el anuncio de la realidad. Debe apoyarse en hechos, no en opinión gratuita.

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
      "fuentes": [
        { "nombre": "Nombre del medio", "url": "https://…" }
      ]
    }
  ]
}
```

- `id`: la fecha más un slug en minúsculas, sin tildes, con guiones. Debe ser único.
- Ordena las noticias de la más a la menos importante: la primera aparece destacada en la portada.
- Valida el JSON antes de guardarlo (por ejemplo con `python3 -m json.tool`).
- No modifiques ningún otro archivo del repositorio.

## Entrega para revisión

1. Crea la rama `noticias/AAAA-MM-DD` a partir de `main` actualizado.
2. Haz commit solo del archivo nuevo, con el mensaje `Noticias del AAAA-MM-DD`.
3. Sube la rama (`git push -u origin noticias/AAAA-MM-DD`) y abre un **pull request hacia `main`** con la API REST de GitHub (GraphQL y `gh pr create` no están disponibles en estas sesiones):
   `gh api repos/hlmorenog/tecnocriticos/pulls -f title='…' -f head='noticias/AAAA-MM-DD' -f base='main' -f body='…'`
   El pull request lleva:
   - Título: `Noticias del <día> de <mes>`
   - Cuerpo: la lista de titulares con su sección y enlace a la fuente, más cualquier duda o dato que el director deba verificar.
4. Si el archivo del día ya existe en `main` o ya hay un pull request abierto para esa fecha (`gh api "repos/hlmorenog/tecnocriticos/pulls?state=open"`), no crees otro.
5. Si una página de un medio de la lista no abre, prueba con otra noticia u otro medio de la lista. Si ninguna abre, no publiques nada e informa el bloqueo.

El director revisa el pull request y pulsa **Merge** para publicar. Si quiere cambios, los pide en un comentario del pull request.
