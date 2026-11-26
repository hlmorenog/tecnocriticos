# Estilo de animación de los videos de Tecnocríticos

Regla de la dirección (26 de noviembre de 2026): **de aquí en adelante, todas las animaciones se hacen en estilo «cine»**,
tomando como referencia el ritmo y el lenguaje visual de los explicadores animados de Instagram (fondo oscuro, luz, cámara en movimiento
y subtítulos palabra por palabra). Se toma el estilo, nunca el contenido ni los gráficos de otros.

La duración y el audio siguen las reglas de `herramientas/audio/README.md` (ideal 1 minuto, máximo 1:30; voz con la cadena aprobada).

## Los 8 rasgos del estilo
1. **Fondo oscuro con profundidad.** Verde casi negro (#0b0d0c), con un resplandor suave al centro, viñeta en los bordes y grano de película que cambia en cada cuadro. Nunca un fondo plano.
2. **Elementos que brillan.** Nodos y esferas con halo, objetos dibujados en trazo de luz (teléfonos, manos, edificios…), con un desenfoque de brillo.
3. **Todo se construye a la vista.** Las líneas se dibujan, los números cuentan hasta su valor, los objetos se transforman en otros en vez de cortar.
4. **Partículas de luz** que viajan por las líneas para mostrar relación o flujo.
5. **Cámara viva.** Acercamientos y desplazamientos suaves; nada queda quieto más de 2 segundos.
6. **Subtítulos palabra por palabra**, sincronizados con la voz a partir de la transcripción (tiempos por palabra):
   - centrados, en blanco, Inter Tight 800, unas 6–7 palabras por frase;
   - la palabra aparece cuando se dice; las palabras clave (marcas, cifras, conceptos) en verde menta #7FD1B0 con brillo;
   - el texto debe ser el del guion corregido, aunque la transcripción automática se equivoque.
7. **Cabecera mínima.** Logo arriba a la izquierda; arriba a la derecha, la etiqueta del momento en mayúsculas, JetBrains Mono, en menta (cambia con cada parte del guion).
8. **Metáforas visuales.** Cada idea del guion tiene su imagen (una balanza para el peso, una muñeca con un pulso de luz para el cansancio, el arco del pulgar para el alcance).

## Nitidez (ajuste de la dirección: «los videos se ven desenfocados»)
- El brillo va **detrás** del trazo y es tenue; el trazo, el texto y las cifras siempre quedan nítidos encima. Nunca se desenfoca un texto.
- Grano de película muy suave (3–4 %), sin velar la imagen.
- Cuadros en PNG (no JPG) y codificación H.264 con `-crf 15 -preset slow -tune animation`.

## Colores
- Verde de la marca #00875A y menta #7FD1B0 para lo principal.
- Ámbar #F0C36B para alertas o contrastes (dolor, problema, límite).
- Cuando hay dos protagonistas, cada uno conserva su color en todo el video (por ejemplo, plata #E8E8E4 y azul #4C86F5).

## Flujo de trabajo
1. Guion con cifras en números → grabación de la dirección → corte de tomas y mezcla (ver `herramientas/audio`).
2. Transcripción de la mezcla final con tiempos por palabra; se corrigen las palabras mal reconocidas.
3. Animación en HTML/SVG controlada por tiempo (`window.render(t)`), escena por escena, amarrada a los tiempos de las palabras.
4. Render a 1080×1920 y 30 cuadros por segundo, cuadros en PNG; codificación H.264 (`-crf 15 -preset slow -tune animation`) con el audio en AAC a 192 kbps.
5. Revisión de cuadros de muestra antes del render completo.

## Archivos
- `cine/ejemplo-plegables.html`: primera pieza en este estilo (iPhone Duo vs. Galaxy Z Fold 8), con el motor completo: fondo, grano, nodos, líneas con partículas, cámara y subtítulos.
- `cine/cuadros.js`: render con Playwright (`node cuadros.js archivo.html salida [t1,t2,…]` para muestras).
