/* Datos de la infografía «Los 10 drones que importan» (noviembre de 2026).
   Fuentes: fichas técnicas oficiales de cada fabricante (consultadas el 26 de noviembre de 2026) y RAC 100 de la Aerocivil.
   vel: velocidad horizontal máxima en m/s · techo: altura máxima de despegue sobre el nivel del mar (m) · min: autonomía máxima (min) · peso: g */
window.DRONES = [
  {
    id: "dji-neo-2", nombre: "Neo 2", marca: "DJI", tipo: "selfie", color: "#C9CDD2",
    perfil: "El dron de bolsillo para grabarse a uno mismo, sin control remoto.",
    vel: 12, velNota: "En modo Sport y siguiendo a alguien",
    techo: 2000, min: 19, minNota: "unos 17 min con los protectores de hélice", peso: 151,
    controles: ["app", "gestos", "voz", "reloj", "control", "gafas"],
    controlesTxt: "Despega desde la palma con un botón. Se maneja con gestos de la mano, con la app del celular (joysticks virtuales), con la voz a través del Apple Watch o de audífonos Bluetooth, con el control RC-N3 o con gafas y el control de movimiento RC Motion 3.",
    modos: ["Seguimiento (ActiveTrack)", "Spotlight", "SelfieShot", "QuickShots", "MasterShots", "Easy ACRO (con gafas)"],
    recorridos: ["dronie", "rocket", "circle", "follow"],
    sensores: "Visión monocular en todas las direcciones, LiDAR frontal y sensor infrarrojo abajo",
    clave: "Pesa 151 g: por debajo de 200 g, en Colombia no hay que registrarlo para uso recreativo.",
    fuente: ["DJI: especificaciones del Neo 2", "https://www.dji.com/se/neo-2/specs"]
  },
  {
    id: "dji-mini-5-pro", nombre: "Mini 5 Pro", marca: "DJI", tipo: "plegable", color: "#4A4F57",
    perfil: "Calidad de cámara grande en un dron de menos de 250 g.",
    vel: 18, velNota: "Sport, batería normal (19 m/s con la batería Plus)",
    techo: 6000, min: 36, minNota: "52 min con la batería Plus", peso: 249.9,
    controles: ["control", "pantalla"],
    controlesTxt: "Control remoto RC-N3, que usa el celular como pantalla, o DJI RC 2, que trae pantalla propia.",
    modos: ["ActiveTrack 360°", "Dronie", "Circle", "Helix", "Rocket", "Boomerang", "Asteroid", "Vuelo por waypoints", "Modos Cine, Normal y Sport"],
    recorridos: ["dronie", "helix", "boomerang", "waypoints"],
    sensores: "Visión binocular en todas las direcciones, LiDAR frontal y sensor infrarrojo abajo",
    clave: "Con la batería Plus supera los 250 g y en Europa cambia de clase (C0 a C1).",
    fuente: ["DJI: especificaciones del Mini 5 Pro", "https://www.dji.com/se/mini-5-pro/specs"]
  },
  {
    id: "dji-mavic-4-pro", nombre: "Mavic 4 Pro", marca: "DJI", tipo: "grande", color: "#2E3238",
    perfil: "El buque insignia para foto y video profesional, con tres cámaras.",
    vel: 25, velNota: "Sport, sin viento",
    techo: 6000, min: 51, minNota: "45 min en vuelo estacionario", peso: 1063,
    controles: ["control", "pantalla"],
    controlesTxt: "Controles con pantalla DJI RC 2 o DJI RC Pro 2.",
    modos: ["ActiveTrack 360°", "FocusTrack", "Cardán Infinity con giro de 360°", "Modos Cine, Normal y Sport"],
    recorridos: ["follow", "circle", "dronie"],
    sensores: "Visión binocular en todas las direcciones, LiDAR frontal y sensor infrarrojo abajo",
    clave: "Tres cámaras: la principal es Hasselblad de 100 MP y graba video 6K.",
    fuente: ["DJI: especificaciones del Mavic 4 Pro", "https://www.dji.com/se/mavic-4-pro/specs"]
  },
  {
    id: "dji-avata-360", nombre: "Avata 360", marca: "DJI", tipo: "fpv", color: "#3B3F46",
    perfil: "Vuelo inmersivo con gafas y video en 360° de 8K.",
    vel: 18, velNota: "Sport (12 m/s en Normal por defecto)",
    techo: 4500, min: 23, minNota: "", peso: 455,
    controles: ["gafas", "movimiento", "control"],
    controlesTxt: "Con gafas DJI Goggles 3 o N3 más el control de movimiento RC Motion 3 o el FPV Remote Controller 3. También con controles normales RC 2, RC-N2 o RC-N3.",
    modos: ["Vuelo FPV manual", "Easy ACRO", "ActiveTrack 360°", "Dronie", "Modo 360° o de una lente", "Modos Cine, Normal y Sport"],
    recorridos: ["fpv", "flip", "dronie"],
    sensores: "Visión en todas las direcciones, LiDAR frontal y sensor infrarrojo abajo",
    clave: "Si vuelas con gafas (FPV), la norma colombiana exige un observador que mire el dron sin ayudas.",
    fuente: ["DJI: especificaciones del Avata 360", "https://www.dji.com/se/avata-360/specs"]
  },
  {
    id: "dji-lito-x1", nombre: "Lito X1", marca: "DJI", tipo: "plegable", color: "#6B7079",
    perfil: "El dron para aprender: económico, estable y difícil de chocar.",
    vel: 18, velNota: "Sport, batería normal",
    techo: 4500, min: 36, minNota: "52 min con la batería Plus", peso: 249,
    controles: ["control", "pantalla"],
    controlesTxt: "Control RC-N3 con el celular como pantalla, o DJI RC 2 con pantalla propia.",
    modos: ["ActiveTrack", "Dronie", "Rocket", "Circle", "Helix", "Boomerang", "Asteroid", "Modos Cine, Normal y Sport"],
    recorridos: ["rocket", "circle", "asteroid"],
    sensores: "Visión monocular en todas las direcciones, LiDAR frontal y sensor infrarrojo abajo",
    clave: "Llegó en abril de 2026 como la puerta de entrada de DJI; no se vende oficialmente en EE. UU.",
    fuente: ["DJI: especificaciones del Lito X1", "https://www.dji.com/se/lito-x1/specs"]
  },
  {
    id: "antigravity-a1", nombre: "A1", marca: "Antigravity", tipo: "a1", color: "#1F2A44",
    perfil: "El primer dron 360° que se vuela señalando con la mano.",
    vel: 16, velNota: "Sport (12 m/s en Normal)",
    techo: 4000, min: 24, minNota: "39 min con la batería de alta capacidad", peso: 249,
    controles: ["gafas", "movimiento"],
    controlesTxt: "Con las gafas Vision, que siguen el movimiento de la cabeza para mirar en 360°, y el control Grip: se apunta, se aprieta el gatillo y el dron va hacia allá.",
    modos: ["FreeMotion (apunta y vuela)", "Modo FPV", "Sky Path", "Modos Cine, Normal y Sport"],
    recorridos: ["freemotion", "fpv", "circle"],
    sensores: "Sensado 360° con visión binocular adelante y abajo",
    clave: "Graba en 360° y 8K: con las gafas miras a cualquier lado girando la cabeza. En Colombia, volar con gafas exige un observador.",
    fuente: ["Antigravity: especificaciones del A1", "https://www.antigravity.tech/drone/antigravity-a1/specs"]
  },
  {
    id: "hoverair-x1-promax", nombre: "X1 PROMAX", marca: "HOVERAir", tipo: "caja", color: "#E9E6DF",
    perfil: "Una cámara voladora que te sigue sola, ideal para deportes.",
    vel: 11.7, velNota: "Seguimiento de hasta 42 km/h",
    techo: 5000, min: 16, minNota: "", peso: 192,
    controles: ["boton", "app", "voz", "beacon"],
    controlesTxt: "Se elige el modo con un botón y despega de la mano. También con la app, con comandos de voz o con el Beacon de muñeca y sus JoySticks.",
    modos: ["Hover", "Zoom Out", "Follow", "Orbit", "Bird's Eye", "Dolly Track", "Angle Track", "Giro de 360°", "Spiral", "Orbit Follow", "Ski", "Ciclismo", "Manual", "CoPilot"],
    recorridos: ["zoomout", "birdseye", "dolly", "orbitfollow"],
    sensores: "Sensores adelante y atrás para algunos modos de seguimiento",
    clave: "Pesa 192 g: por debajo de 200 g, en Colombia no hay que registrarlo para uso recreativo.",
    fuente: ["HOVERAir: comparativa oficial de modelos", "https://support.hoverair.com/hc/en-us/articles/44558370815257"]
  },
  {
    id: "potensic-atom-2", nombre: "Atom 2", marca: "Potensic", tipo: "plegable", color: "#7A7F86",
    perfil: "La alternativa barata con GPS, cardán de 3 ejes y video 4K.",
    vel: 16, velNota: "Sport (10 m/s en Normal)",
    techo: 4000, min: 32, minNota: "29 min en vuelo estacionario", peso: 249,
    pesoTxt: "menos de 250 g",
    controles: ["control", "app"],
    controlesTxt: "Control remoto con el celular como pantalla y la app de Potensic. Alcance de hasta 10 km sin obstáculos.",
    modos: ["AI Follow", "AI Spotlight", "AI Parallel", "Pull-away", "Spiral", "Rocket", "Circle", "Boomerang", "Dolly Zoom", "Control de crucero"],
    recorridos: ["parallel", "helix", "cruise"],
    sensores: "Solo visión hacia abajo, para mantenerse quieto; no detecta obstáculos a los lados",
    clave: "Clase C0 en Europa. Su fabricante limita el vuelo a 120 m, por debajo del tope colombiano.",
    fuente: ["Potensic: especificaciones del Atom 2", "https://www.potensic.com/atom-2-specs.html"]
  },
  {
    id: "skydio-x10", nombre: "X10", marca: "Skydio", tipo: "empresa", color: "#1B1D22",
    perfil: "El dron estadounidense para seguridad pública, rescate e inspección.",
    vel: 20, velNota: "72 km/h (45 mph) en aire estable",
    techo: 4570, techoTxt: "techo de servicio", min: 40, minNota: "", peso: 2130, pesoTxt: "menos de 2,1 kg",
    controles: ["control", "pantalla", "remoto"],
    controlesTxt: "Skydio Controller 2 con la app Flight Deck; también se puede operar a distancia con enlaces de radio y celular.",
    modos: ["Autonomía Skydio (evita obstáculos solo)", "Vuelo autónomo de noche", "Seguimiento de personas y vehículos", "Vuelo sin GPS", "Cámara térmica"],
    recorridos: ["mapeo", "follow"],
    sensores: "Navegación por cámaras con IA, incluso de noche con luz visible o infrarroja",
    clave: "Resiste agua y polvo (IP55) y cumple la norma de seguridad NDAA de EE. UU.",
    fuente: ["Skydio: X10", "https://www.skydio.com/x10"]
  },
  {
    id: "parrot-anafi-ukr", nombre: "ANAFI UKR", marca: "Parrot", tipo: "empresa", color: "#4B5A3C",
    perfil: "El dron europeo para defensa y seguridad, con cámara térmica.",
    vel: 17, velNota: "Velocidad respecto al aire",
    techo: 5000, techoTxt: "techo de servicio", min: 38, minNota: "70 min con la batería XLR", peso: 1033, pesoTxt: "menos de 1.033 g",
    controles: ["control", "pantalla"],
    controlesTxt: "Estación SkyController UKR con tableta incluida. Despega y aterriza en la mano del operador.",
    modos: ["Navegación óptica sin GPS", "Vuelo en interiores", "Despegue y aterrizaje en la mano", "Cámara térmica"],
    recorridos: ["interior", "circle"],
    sensores: "Cámaras para navegar sin señal satelital",
    clave: "No trae zonas de no vuelo de fábrica: cumplir las restricciones depende por completo del operador.",
    fuente: ["Parrot: especificaciones del ANAFI UKR", "https://www.parrot.com/en/anafi-ukr-technical-specifications"]
  }
];

window.CONTROLES = {
  control: ["Control remoto", "Joysticks clásicos; el celular hace de pantalla"],
  pantalla: ["Control con pantalla", "Trae pantalla propia, sin depender del celular"],
  app: ["App del celular", "Joysticks virtuales en la pantalla"],
  gestos: ["Gestos", "Se dirige con la palma de la mano"],
  voz: ["Voz", "Comandos hablados"],
  reloj: ["Reloj", "Apple Watch como control"],
  gafas: ["Gafas FPV", "Ves lo que ve el dron"],
  movimiento: ["Control de movimiento", "Apuntas con la mano y el dron va"],
  boton: ["Botón a bordo", "Eliges el modo en el propio dron"],
  beacon: ["Beacon de muñeca", "Pantalla pequeña con joysticks"],
  remoto: ["Operación a distancia", "Por radio y red celular"]
};

window.RECORRIDOS = {
  dronie: ["Dronie", "Se aleja hacia atrás y sube, sin dejar de mirarte."],
  rocket: ["Rocket", "Sube en vertical con la cámara apuntando hacia abajo."],
  circle: ["Circle", "Gira alrededor de ti a la misma altura."],
  helix: ["Helix / Spiral", "Sube en espiral mientras se aleja."],
  boomerang: ["Boomerang", "Hace un óvalo a tu alrededor: sube al alejarse y baja al volver."],
  asteroid: ["Asteroid", "Se aleja y sube muy alto para un efecto de «planeta pequeño»."],
  follow: ["Seguimiento", "Te sigue mientras te mueves, esquivando obstáculos."],
  waypoints: ["Waypoints", "Recorre una ruta de puntos guardada."],
  fpv: ["FPV", "Vuelo libre en primera persona: curvas, picadas y giros."],
  flip: ["Easy ACRO", "Acrobacias como una voltereta con un solo botón."],
  freemotion: ["FreeMotion", "Señalas con el control y el dron vuela en esa dirección."],
  zoomout: ["Zoom Out", "Se aleja en diagonal para revelar el paisaje."],
  birdseye: ["Bird's Eye", "Sube en vertical mirando hacia abajo."],
  dolly: ["Dolly Track", "Vuela de espaldas delante de ti mientras avanzas."],
  orbitfollow: ["Orbit Follow", "Te rodea mientras te mueves."],
  parallel: ["AI Parallel", "Vuela a tu lado, en paralelo."],
  cruise: ["Control de crucero", "Mantiene rumbo y velocidad constantes."],
  mapeo: ["Barrido de inspección", "Recorre un área en franjas para levantar datos."],
  interior: ["Vuelo sin GPS", "Navega en interiores guiándose con sus cámaras."]
};
