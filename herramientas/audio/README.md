# Audio de los videos de Tecnocríticos

Configuración aprobada por la dirección (24 de noviembre de 2026). Todos los videos con voz se hacen así.

## Duración (regla de la dirección, 26 de noviembre de 2026)
- Los videos duran **idealmente 1 minuto** y **nunca más de 1:30**, incluidos la portada y el cierre.
- Guion de locución: unas **150 palabras** para 1 minuto y **220 como máximo** para 1:30 (con la voz 18 % más rápida).
- Si una grabación queda larga, se recortan bloques completos (nunca frases a la mitad) y se vuelven a sincronizar las escenas.

## Grabación (la hace la dirección)
- Micrófono Hollyland Lark A1, **Mic 2** prendido en la camisa, a un palmo debajo de la barbilla.
- En la app del Lark: **cancelación de ruido apagada**, **reverberación apagada**, modo **mono**, ecualización neutra (primera opción), volumen **4 de 6**.
- En el iPhone (Notas de voz): «Mejorar grabación» desactivado y sin «Aislamiento de voz».
- Un archivo con todos los bloques del guion y **2 segundos de silencio** entre bloque y bloque.
- Guiones con las **cifras en números**, no en letras.

## Edición
1. No aplicar reducción de ruido ni compresores a la voz: la dañan.
2. Cortar los bloques por los silencios y verificar el orden con una transcripción.
   - Cada corte empieza unos 60 ms antes de la voz y termina 150 ms después, medido por energía (no solo por la transcripción), para no arrastrar ruido de otra toma.
   - **Nunca silencio absoluto entre frases o bloques**: las pausas se rellenan con el ruido de sala de la misma grabación (un trozo sin voz, por ejemplo antes de empezar a hablar), con fundidos cruzados de 25–30 ms. Así no se nota cuando se pasa de una toma a otra (ajuste de la dirección: «el audio en el segundo 10 se pone raro»).
   - Igualar el nivel de voz de todos los bloques a la mediana, porque las tomas grabadas en distintos momentos suenan más o menos fuertes.
3. Ajustar cada escena del video a la duración de su bloque. La voz queda **18 % más rápida** (ajuste de la dirección: «como los videos de hoy»), así que el tiempo de cada bloque se divide entre 1,18.
4. Mezclar con `mezclar_voz.sh`: pasa altos de 80 Hz, +1,5 dB en 3,5 kHz, +3 dB de agudos desde 6 kHz, `atempo=1.18`, +12,5 dB de ganancia y limitador. Música a −21 dB con compresión lateral.
5. Música de fondo propia, sin derechos de terceros: `musica_beat.py` (118 BPM, con beat). La dirección no quiso la pista lenta tipo lo-fi.
6. Exportar en AAC a 192 kbps.
