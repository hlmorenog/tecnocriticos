#!/usr/bin/env python3
"""Atajo: las páginas de cada noticia (n/<id>.html) ahora las genera generar_paginas.py junto con todo el sitio.

Uso (desde la raíz del repositorio):  python3 herramientas/generar_compartir.py
Equivale a:                          python3 herramientas/generar_paginas.py
"""
import runpy
from pathlib import Path

runpy.run_path(str(Path(__file__).resolve().parent / "generar_paginas.py"), run_name="__main__")
