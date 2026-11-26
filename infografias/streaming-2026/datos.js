/* Datos de la infografía «Las plataformas de streaming que mandan» (noviembre de 2026).
   subs: último dato oficial de suscriptores en el mundo (millones) · subsFecha: a qué fecha corresponde.
   co: cuota de mercado en Colombia según JustWatch, tercer trimestre de 2025 (%). */
window.PLATAFORMAS = [
  {
    id: "netflix", nombre: "Netflix", color: "#E50914", tinta: "#fff",
    dueno: "Netflix, Inc.", nace: 2007, naceTxt: "16 de enero de 2007 (streaming); la empresa nació en 1997 alquilando DVD por correo",
    latam: "septiembre de 2011", latamAnio: 2011,
    subs: 325, subsTxt: "más de 325 millones", subsFecha: "fin de 2025, última cifra publicada",
    subsLatam: "53,3 millones en Latinoamérica (fin de 2024, último dato regional que publicó)",
    co: 20, co26: 20,
    colores: [["2000–2014", "#E50914", "Letras rojas con sombra"], ["2014", "#E50914", "Logo plano, con tipografía actualizada"], ["2019", "#E50914", "La «N» estalla en colores en la entrada de sus originales"]],
    colorTxt: "El rojo nunca ha cambiado: lo que cambió fue el dibujo del logo.",
    contenido: ["Series", "Películas", "Documentales", "Anime", "Realities", "Juegos", "Eventos en vivo"],
    hitos: [[1997, "Nace como alquiler de DVD por correo"], [2007, "Lanza su servicio de streaming"], [2011, "Llega a Latinoamérica"], [2017, "Anuncia su primera serie original colombiana"], [2025, "Estrena WWE Raw en vivo cada semana"], [2026, "Anuncia que su plan con anuncios llegará a Colombia en 2027"]],
    premios: "En los Óscar de 2026 ganó 7 estatuillas (Frankenstein, KPop Demon Hunters y dos cortos) e igualó su récord. En los Emmy de 2026 sumó 16.",
    clave: "Es la más grande del mundo, pero en Colombia ya no está sola: empató con Disney+ en 2025.",
    fuentes: [["Netflix: carta a accionistas, cuarto trimestre de 2024", "https://s22.q4cdn.com/959853165/files/doc_financials/2024/q4/FINAL-Q4-24-Shareholder-Letter.pdf"], ["Axios: Netflix supera los 325 millones", "https://www.axios.com/2026/01/20/netflix-stock-nflx-subscribers-warner-bros"]]
  },
  {
    id: "disney-plus", nombre: "Disney+", color: "#0E7C86", tinta: "#fff",
    dueno: "The Walt Disney Company", nace: 2019, naceTxt: "12 de noviembre de 2019",
    latam: "17 de noviembre de 2020", latamAnio: 2020,
    subs: 131.6, subsTxt: "131,6 millones", subsFecha: "septiembre de 2025, la última que reportó",
    subsLatam: "Disney no publica suscriptores por región",
    co: 20, co26: null,
    colores: [["2019", "#113CCF", "Azul oscuro con el arco de luz del castillo"], ["2024", "#0E7C86", "Verde azulado «Aurora», en homenaje a la Bella Durmiente"]],
    colorTxt: "En marzo de 2024 cambió el azul por un verde azulado llamado «Aurora».",
    contenido: ["Disney", "Pixar", "Marvel", "Star Wars", "National Geographic", "Hulu", "Deportes de ESPN"],
    hitos: [[2019, "Lanzamiento en Estados Unidos"], [2020, "Llega a Latinoamérica"], [2021, "Nace Star+, aparte, en Latinoamérica"], [2024, "Star+ se integra a Disney+ y estrena el color «Aurora»"], [2025, "Hulu reemplaza a Star como marca de entretenimiento general"]],
    premios: "En los Emmy de 2026, las marcas de Disney sumaron 15. «Soul», de Pixar, estrenada directamente en Disney+, ganó el Óscar a mejor película animada.",
    clave: "En el tercer trimestre de 2025 empató por primera vez con Netflix en Colombia, con 20 % del mercado.",
    fuentes: [["Variety: suscriptores de Disney+ a septiembre de 2025", "https://variety.com/2025/tv/news/disney-plus-hulu-subscriber-gains-kimmel-controversy-1236580606/"]]
  },
  {
    id: "prime-video", nombre: "Prime Video", color: "#1399FF", tinta: "#fff",
    dueno: "Amazon", nace: 2006, naceTxt: "2006, como Amazon Unbox; desde 2011 viene incluido con Prime",
    latam: "14 de diciembre de 2016", latamAnio: 2016,
    subs: null, subsTxt: "Amazon no publica suscriptores de Prime Video", subsCorto: "No lo publica. Prime: más de 200 M de miembros (2021); con anuncios llega a 315 M de espectadores al mes", subsFecha: "viene incluido en Prime, que tenía más de 200 millones de miembros en 2021 (su último dato oficial); la versión con anuncios llega a 315 millones de espectadores al mes en 16 países, según Amazon (2025)",
    subsLatam: "Amazon no publica suscriptores por región",
    co: 19, co26: null,
    colores: [["Desde siempre", "#1399FF", "Azul, el color de la marca Prime"]],
    colorTxt: "Siempre ha usado el azul de Prime.",
    contenido: ["Series", "Películas", "Canales de terceros", "Deportes en algunos países", "Alquiler y compra de películas"],
    hitos: [[2006, "Nace como Amazon Unbox"], [2011, "Se incluye en la suscripción a Prime"], [2016, "Se lanza en todo el mundo, Colombia incluida"], [2020, "Estrena «El Presidente», producida en Colombia y Chile"]],
    premios: "En los Emmy de 2026 ganó 10. Con «Manchester by the Sea» (2017), Amazon fue el primer servicio de streaming con una película nominada a mejor película en los Óscar.",
    clave: "Es la tercera de Colombia con 19 %, a un punto de las líderes, aunque mucha gente la tiene «gratis» con Prime.",
    fuentes: [["La República: cuota de JustWatch en Colombia, tercer trimestre de 2025", "https://www.larepublica.co/ocio/por-primera-vez-disney-empata-a-netflix-en-cuota-de-mercado-en-el-streaming-4281327"]]
  },
  {
    id: "hbo-max", nombre: "HBO Max", color: "#5A2BE2", tinta: "#fff",
    dueno: "Skydance (antes Paramount Skydance), dueña de Warner Bros. Discovery desde octubre de 2026", nace: 2020, naceTxt: "27 de mayo de 2020",
    latam: "29 de junio de 2021", latamAnio: 2021,
    subs: 131.6, subsTxt: "131,6 millones", subsFecha: "fin de 2025, la última que reportó Warner Bros. Discovery",
    subsLatam: "No se publican cifras por región",
    co: 12, co26: 12,
    colores: [["2020", "#5A2BE2", "Morado, como HBO Max"], ["2023 (2024 en Latinoamérica)", "#002BE7", "Azul, al cambiar de nombre a Max"], ["2025", "#111111", "Blanco y negro al volver a llamarse HBO Max"]],
    colorTxt: "Es la que más ha cambiado: de morado a azul y luego a blanco y negro, con tres nombres en cinco años.",
    contenido: ["HBO", "Warner Bros.", "DC", "Discovery", "Cartoon Network", "Novelas de Globo", "Deportes en algunos países"],
    hitos: [[2020, "Lanzamiento en Estados Unidos"], [2021, "Llega a 39 territorios de Latinoamérica y el Caribe"], [2024, "En Latinoamérica pasa a llamarse Max"], [2025, "Vuelve a llamarse HBO Max"], [2026, "Paramount Skydance completa la compra de Warner Bros. Discovery"]],
    premios: "En los Emmy de 2026 quedó segunda, con 21 premios para HBO y HBO Max, detrás de Apple TV.",
    clave: "Desde octubre de 2026 tiene el mismo dueño que Paramount+: en 2027 se venderán juntas en un paquete.",
    fuentes: [["TheWrap: resultados de Skydance, tercer trimestre de 2026", "https://www.thewrap.com/industry-news/business/paramount-earnings-q3-2026/"], ["Agencia PI: JustWatch en Colombia, primer semestre de 2026", "https://www.agenciapi.co/noticia/estilo-de-vida/apple-tv-lidera-el-crecimiento-del-streaming-en-colombia"]]
  },
  {
    id: "paramount-plus", nombre: "Paramount+", color: "#0064FF", tinta: "#fff",
    dueno: "Skydance (antes Paramount Skydance)", nace: 2014, naceTxt: "28 de octubre de 2014, como CBS All Access; Paramount+ desde el 4 de marzo de 2021",
    latam: "4 de marzo de 2021", latamAnio: 2021,
    subs: 82.2, subsTxt: "82,2 millones", subsFecha: "30 de septiembre de 2026, la última que reportará cada trimestre",
    subsLatam: "No se publican cifras por región",
    co: 7, co26: null,
    colores: [["2014", "#5B6270", "Nace como CBS All Access, con la marca de CBS"], ["2021", "#0064FF", "Azul, con la montaña y las estrellas de Paramount"]],
    colorTxt: "Nació como CBS All Access y en 2021 adoptó el azul y la montaña de Paramount.",
    contenido: ["Películas de Paramount", "CBS", "Nickelodeon", "MTV", "UFC en Latinoamérica"],
    hitos: [[2014, "Nace como CBS All Access"], [2021, "Se convierte en Paramount+ y llega a Latinoamérica"], [2026, "Su dueña compra Warner Bros. Discovery; HBO, HBO Max y Paramount+ suman 203 millones"]],
    premios: "No figura entre las cinco plataformas con más premios en los Emmy de 2026.",
    clave: "Junto con HBO y HBO Max suma 203 millones de suscriptores: el segundo grupo más grande después de Netflix.",
    fuentes: [["TheWrap: resultados de Skydance, tercer trimestre de 2026", "https://www.thewrap.com/industry-news/business/paramount-earnings-q3-2026/"]]
  },
  {
    id: "apple-tv", nombre: "Apple TV", color: "#111111", tinta: "#fff",
    dueno: "Apple", nace: 2019, naceTxt: "1 de noviembre de 2019, como Apple TV+",
    latam: "1 de noviembre de 2019", latamAnio: 2019,
    subs: null, subsTxt: "Apple no lo publica", subsFecha: "la firma Ampere Analysis lo estima en unos 45 millones",
    subsLatam: "Apple no publica cifras por región",
    co: 8, co26: 12,
    colores: [["2019", "#111111", "La manzana y «tv» en blanco sobre negro, como Apple TV+"], ["2025", "negro-color", "Sobre el mismo fondo negro, la manzana y «tv» se llenan de colores con efecto de vidrio"]],
    colorTxt: "Su marca va sobre fondo negro. En octubre de 2025, al dejar de llamarse Apple TV+, la manzana y «tv» pasaron del blanco a un degradado de colores: Apple llevaba años con logos en blanco y negro.",
    contenido: ["Solo producciones propias", "Series", "Películas", "Fútbol de la MLS (con pase aparte)"],
    hitos: [[2019, "Lanzamiento en unos 100 países, Colombia incluida"], [2022, "«CODA» gana el Óscar a mejor película"], [2023, "Transmite la MLS en todo el mundo"], [2025, "Deja de llamarse Apple TV+"], [2026, "Gana más Emmy que nadie: 28"]],
    premios: "Lideró los Emmy de 2026 con 28 premios, 14 de ellos para «Widow's Bay». Con «CODA» (2022) fue el primer streaming en ganar el Óscar a mejor película.",
    clave: "Es la que más crece en Colombia: pasó de 8 % a 12 % en un año, empatada con HBO Max.",
    fuentes: [["Gold Derby: Emmy 2026 por plataforma", "https://www.goldderby.com/tv/2026/2026-emmy-wins-by-network-apple-tv-hbo-netflix-totals/"], ["Agencia PI: JustWatch en Colombia, primer semestre de 2026", "https://www.agenciapi.co/noticia/estilo-de-vida/apple-tv-lidera-el-crecimiento-del-streaming-en-colombia"]]
  }
];

/* Emmy de 2026 (Gold Derby, incluye Artes Creativas). Óscar de 2026 por plataforma. */
window.EMMY26 = [["apple-tv", 28], ["hbo-max", 21], ["netflix", 16], ["disney-plus", 15], ["prime-video", 10]];
window.OSCAR26 = [["netflix", 7], ["apple-tv", 1]];
