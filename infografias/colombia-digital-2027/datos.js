/* Datos de la infografía «Colombia digital 2027».
   Fuente: DataReportal, «Digital 2027: Colombia» (5 de noviembre de 2026) y «Digital 2027 Global Overview Report»
   (21 de octubre de 2026), de We Are Social y Meltwater, con datos de GWI (segundo trimestre de 2026), Similarweb,
   Google Trends, GSMA Intelligence, Ookla, Naciones Unidas y las herramientas publicitarias de cada plataforma. */
window.CO27 = {
  pais: { poblacion: 54.1, mujeres: 50.7, hombres: 49.3, urbana: 82.4, edadMediana: 33.0, vida: 78.3, alfabetismo: 95.3, crece: 503 },
  internet: { usuarios: 43.7, pct: 80.9, nuevos: 1.2, sinInternet: 10.3, sinPct: 19.1, movil: 96.8, compu: 64.4 },
  movil: { conexiones: 87.6, pct: 162 },
  redes: { identidades: 44.0, pct: 81.4, crece: 16.8, plataformasMes: 7.0 },
  velocidad: { movil: 45.46, movilCrece: 23.2, fija: 230.60, fijaCrece: 20.1 },
  // Tiempo conectado (GWI, usuarios de 16 años o más): por semana.
  horas: { semana: [48, 38], redesCO: [25, 11], redesMundo: [19, 18] },
  // Tiempo semanal con cada medio (horas, minutos). GWI, segundo trimestre de 2026.
  medios: [
    ["Video en línea (total)", 14, 6, true], ["Televisión (total)", 12, 47, true], ["Redes sociales", 11, 5], ["Música en streaming", 9, 53],
    ["Videos cortos (tipo TikTok)", 9, 10], ["Videojuegos (total)", 8, 26, true], ["Televisión por streaming", 7, 39], ["Videojuegos en el celular", 5, 31],
    ["Televisión tradicional", 5, 8], ["Videos largos (tipo vlog)", 4, 56], ["Prensa (total)", 4, 35, true], ["Radio", 3, 53],
    ["Prensa en línea", 3, 0], ["Videojuegos en consola o PC", 2, 56], ["Pódcast", 2, 55], ["Prensa impresa", 1, 36]
  ],
  // Los 20 sitios más visitados (Similarweb, junio a agosto de 2026). Visitas y visitantes únicos al mes, en millones; tiempo por visita en segundos.
  sitios: [
    ["google.com", 1060, 41.5, 582, "Buscador"], ["youtube.com", 334, 24.2, 1423, "Video"], ["whatsapp.com", 148, 28.4, 469, "Mensajería"],
    ["facebook.com", 120, 12.2, 537, "Redes"], ["instagram.com", 116, 19.1, 475, "Redes"], ["chatgpt.com", 85.6, 7.92, 344, "IA"],
    ["x.com", 60.6, 7.32, 680, "Redes"], ["tiktok.com", 53.4, 20.7, 344, "Redes"], ["gemini.google.com", 42.3, 6.18, 388, "IA"],
    ["live.com", 41.9, 6.22, 347, "Correo"], ["cloud.microsoft", 40.2, 4.30, 612, "Trabajo"], ["mercadolibre.com.co", 39.0, 12.8, 257, "Compras"],
    ["temu.com", 34.6, 7.72, 211, "Compras"], ["netflix.com", 31.2, 7.93, 256, "Video"], ["stripchat.com", 31.1, 5.27, 558, "Adultos"],
    ["pse.com.co", 29.6, 12.7, 87, "Pagos"], ["wikipedia.org", 29.2, 9.76, 122, "Consulta"], ["bancolombia.com", 29.0, 9.59, 293, "Banca"],
    ["microsoft.com", 27.8, 12.0, 111, "Tecnología"], ["eltiempo.com", 22.3, 6.02, 110, "Noticias"]
  ],
  // Lo más buscado en Google (Google Trends, 1 de julio de 2025 a 30 de junio de 2026). Índice frente a la búsqueda más popular (100).
  busquedas: [["colombia", 100], ["whatsapp", 47], ["web whatsapp", 35], ["whatsapp web", 35], ["youtube", 34], ["clima", 30], ["traductor", 29],
    ["tiempo", 26], ["nacional", 21], ["google", 21], ["mundial", 21], ["chatgpt", 19], ["gmail", 14], ["tiempo mañana", 12], ["chat", 12],
    ["tiempo de mañana", 11], ["bancolombia", 11], ["gpt", 11], ["facebook", 11], ["juegos", 10]],
  // Redes: porcentaje de internautas de 16 años o más que las usaron en el último mes (GWI, segundo trimestre de 2026).
  redesUso: [["WhatsApp", 93.1, "#25D366"], ["Facebook", 86.2, "#1877F2"], ["Instagram", 82.6, "#E1306C"], ["TikTok", 76.0, "#111111"], ["YouTube", 64.7, "#FF0000"],
    ["Messenger", 57.3, "#0084FF"], ["Telegram", 46.9, "#229ED9"], ["Pinterest", 43.8, "#E60023"], ["X", 38.6, "#111111"], ["LinkedIn", 27.8, "#0A66C2"],
    ["Threads", 18.4, "#111111"], ["Snapchat", 15.3, "#E6C200"], ["iMessage", 12.1, "#34C759"], ["Discord", 10.1, "#5865F2"], ["Reddit", 9.0, "#FF4500"]],
  // Red favorita de quienes usan redes (GWI). YouTube no era una opción en la encuesta.
  favorita: [["WhatsApp", 34.2], ["TikTok", 22.1], ["Instagram", 17.6], ["Facebook", 16.5], ["X", 2.6], ["Pinterest", 2.0], ["Telegram", 1.1]],
  // Tiempo diario por usuario activo en cada app, agosto de 2026 (Similarweb), en minutos.
  appMin: [["TikTok", 139], ["WhatsApp", 108], ["Instagram", 103], ["YouTube", 81], ["Facebook", 46], ["X", 21], ["Reddit", 14], ["Discord", 10],
    ["Google Meet", 8], ["Pinterest", 8], ["LinkedIn", 7], ["Telegram", 6], ["Snapchat", 5], ["Messenger", 4], ["Threads", 3]],
  // Audiencia publicitaria que reporta cada plataforma (millones), fines de 2026.
  audiencias: [["TikTok", 44.0, "solo mayores de 18 años"], ["Facebook", 35.4, ""], ["YouTube", 32.8, ""], ["Instagram", 22.5, ""], ["LinkedIn", 21.0, "miembros registrados"],
    ["Pinterest", 11.8, ""], ["X", 4.45, ""], ["Threads", 3.80, ""], ["Snapchat", 3.78, ""], ["Reddit", 3.09, ""]],
  // Población por edad (porcentaje del total, Naciones Unidas, fin de 2026).
  edades: [["0–4", 6.5], ["5–12", 10.5], ["13–17", 6.9], ["18–24", 10.8], ["25–34", 17.0], ["35–44", 15.0], ["45–54", 12.2], ["55–64", 10.4], ["65+", 10.6]],
  // Dispositivos con los que se conectan los internautas de 16 años o más (GWI).
  dispositivos: [["Celular (cualquiera)", 96.8, true], ["Smartphone", 87.7], ["Computador (cualquiera)", 64.4, true], ["Computador personal", 53.5], ["Televisor conectado", 41.6],
    ["Computador del trabajo", 28.6], ["Tableta", 21.7], ["Celular básico", 15.3], ["Aparato de casa inteligente", 12.8], ["Consola de videojuegos", 10.0], ["Realidad virtual", 3.9]],
  // Inteligencia artificial: internautas de 16 años o más (GWI).
  ia: [["Usó una herramienta de IA el último mes", 91.6], ["La usó para buscar información", 59.4], ["Usó ChatGPT el último mes", 50.1], ["Usó Gemini el último mes", 40.7],
    ["Se siente cómodo usando IA", 31.4], ["Investiga compras con IA", 30.4], ["Descubre marcas o productos con IA", 17.8], ["Paga una suscripción de IA", 6.0]],
  mundo: { internet: 6.15, internetPct: 73.9, redes: 5.81, redesPct: 69.9, iaPct: 83.5 }
};
