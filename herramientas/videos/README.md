# Estilo de los videos de Tecnocríticos

Reglas de la dirección (26 de noviembre de 2026):
- **Se conserva la línea de diseño de los videos anteriores** (tipografías, colores, cabecera, etiqueta + título, chips, escenas claras y oscuras, cierre verde).
- **Se cambia la forma de animar**: animación continua tipo «cine», con cámara, luz y subtítulos palabra por palabra, tomando como referencia el ritmo de los explicadores animados de Instagram. Se toma el estilo, nunca el contenido ni los gráficos de otros.

La duración y el audio siguen `herramientas/audio/README.md` (ideal 1 minuto, máximo 1:30; voz con la cadena aprobada).

## La línea de diseño que no cambia
- Inter Tight 900 para títulos, Inter para texto, JetBrains Mono en mayúsculas para etiquetas.
- Verde #00875A, menta #7FD1B0, tinta #111111 y blanco. Rojo #C0392B para problemas o alertas.
- Cabecera: logo «● tecnocríticos» arriba a la izquierda (44 px) y etiqueta del tema arriba a la derecha.
- Cada escena tiene etiqueta (kick, JetBrains Mono) y título grande; la portada usa el título gigante con la segunda parte en menta.
- Escenas oscuras (#111) y claras (#fff), y cierre verde con la mirada crítica.
- Cuando hay protagonistas, cada uno conserva su chip y su color en todo el video (por ejemplo, iPhone Duo en plata #E8E8E4 y Galaxy Z Fold 8 en azul #2F6FED), con las ilustraciones propias de Tecnocríticos.
- Barra de progreso verde abajo.

## La nueva forma de animar
1. Nada queda quieto: cámara con acercamientos suaves y objetos que flotan levemente.
2. Todo se construye a la vista: líneas que se dibujan, cifras que cuentan hasta su valor, objetos que se transforman en otros en vez de cortar.
3. Partículas que viajan por las líneas para mostrar relación o flujo.
4. En escenas oscuras, un halo suave detrás de los protagonistas; en las claras, sombras suaves.
5. **Subtítulos palabra por palabra**, sincronizados con la voz: centrados, Inter Tight 800, unas 6–7 palabras por frase; la palabra aparece cuando se dice y las claves (marcas, cifras, conceptos) van en verde. El texto es el del guion, aunque la transcripción automática se equivoque. En la portada, el título grande reemplaza los subtítulos.
6. Metáforas visuales para cada idea (una balanza para el peso, un pulso en la muñeca para el cansancio, el arco del pulgar para el alcance). **Deben ser físicamente lógicas**: en una balanza, el lado que más pesa baja.

## Nitidez (ajuste de la dirección: «los videos se ven desenfocados»)
- El brillo va **detrás** del trazo y es tenue; trazos, textos y cifras siempre nítidos. Nunca se desenfoca un texto.
- Grano de película muy suave (3 %) o ninguno.
- Cuadros en PNG y codificación H.264 con `-crf 15 -preset slow -tune animation`.

## Flujo de trabajo
1. Guion con cifras en números → grabación de la dirección → corte de tomas y mezcla (ver `herramientas/audio`).
2. Transcripción de la mezcla final con tiempos por palabra; se corrigen las palabras mal reconocidas.
3. Animación en HTML/SVG controlada por tiempo (`window.render(t)`), escena por escena, amarrada a los tiempos de las palabras.
4. Revisión de cuadros de muestra; después, render a 1080×1920 y 30 cuadros por segundo, con el audio en AAC a 192 kbps.

## Archivos
- `cine/ejemplo-plegables.html`: primera pieza con el estilo aprobado (iPhone Duo vs. Galaxy Z Fold 8): escenas, cámara, partículas, cifras que cuentan, balanza y subtítulos palabra por palabra. Usa `cine/telefonos.js` (ilustraciones propias).
- `cine/cuadros.js`: render con Playwright (`node cuadros.js archivo.html salida [t1,t2,…]` para muestras).
