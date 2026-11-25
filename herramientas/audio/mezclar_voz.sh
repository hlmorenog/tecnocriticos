#!/usr/bin/env bash
# Mezcla la voz de la dirección con la música de fondo de Tecnocríticos.
# Configuración aprobada por la dirección el 24 de noviembre de 2026 (no cambiarla sin su aprobación).
# Uso: herramientas/audio/mezclar_voz.sh voz.wav musica.wav salida.wav
#   voz.wav: narración ya cortada y sincronizada con las escenas (mono o estéreo).
#   musica.wav: pista de fondo (herramientas/audio/musica_beat.py DURACION musica.wav).
set -euo pipefail
VOZ="$1"; MUSICA="$2"; SALIDA="$3"
# Voz: pasa altos 80 Hz, +1,5 dB en 3,5 kHz, +3 dB de brillo desde 6 kHz, 10 % más rápida sin cambiar el tono,
# +12,5 dB de ganancia y limitador suave. Resultado: unos -16 LUFS, pico por debajo de -0,9 dBFS.
CADENA_VOZ="pan=mono|c0=0.5*c0+0.5*c1,highpass=f=80,equalizer=f=3500:t=q:w=1.2:g=1.5,highshelf=f=6000:g=3,atempo=1.10,volume=12.5dB,alimiter=limit=0.89:attack=3:release=60:level=false"
# Música: -21 dB y compresión lateral (baja sola cuando hay voz).
ffmpeg -y -loglevel error -i "$VOZ" -i "$MUSICA" -filter_complex \
 "[0:a]aformat=channel_layouts=stereo,$CADENA_VOZ,pan=stereo|c0=c0|c1=c0,asplit=2[v][sc];[1:a]volume=-21dB[m];[m][sc]sidechaincompress=threshold=0.02:ratio=4:attack=40:release=500:makeup=1[md];[v][md]amix=inputs=2:normalize=0:duration=longest[o]" \
 -map "[o]" -ar 48000 -c:a pcm_s16le "$SALIDA"
