/* Datos de la infografía «Carros eléctricos en Colombia: Tesla, BYD, Volvo, Kia y Renault» (noviembre de 2026).
   Versión de entrada de cada modelo. Autonomía: ciclo WLTP, salvo el Kwid (ciclo urbano SAE J1634, más favorable).
   Precios en pesos colombianos, según la fuente indicada en cada modelo. */
window.EVS = [
  {
    id: "tesla-model-y", marca: "Tesla", modelo: "Model Y", version: "RWD (tracción trasera)", color: "#E31937", forma: "suv",
    precio: 119.99, precioTxt: "$119.990.000", precioNota: "Precio publicado por Tesla desde su llegada; ha cambiado varias veces.",
    autonomia: 466, ciclo: "WLTP", hp: 299, bateria: 60, quimica: "LFP", cero100: 5.9,
    conector: "Tipo 2 / CCS2", ac: 11, dc: 175, dcTxt: "Supercargadores Tesla y cargadores CCS2",
    garantia: "Batería y motor: 8 años o 160.000 km",
    otra: "Long Range AWD: $144.990.000, 600 km y 514 hp.",
    suscripcion: { tipo: "pago", titulo: "Conectividad Premium: $69.900 al mes", txt: "Desde el 1 de octubre de 2026 Tesla cobra en Colombia la Conectividad Premium, que es opcional: tráfico en tiempo real, cámaras a distancia, streaming y navegación avanzada. La Conectividad Estándar, con mapas, navegación y Supercargadores, viene incluida por 8 años." },
    app: "App de Tesla: abre, enciende y climatiza el carro, y controla la carga a distancia.",
    clave: "El eléctrico más vendido de Colombia en 2026: su llegada desató una guerra de precios.",
    fuentes: [["El Carro Colombiano: Tesla Model Y en Colombia", "https://www.elcarrocolombiano.com/lanzamientos/tesla-model-y-colombia-precios-versiones-datos/"],
      ["El Colombiano: la guerra de precios de los eléctricos", "https://www.elcolombiano.com/negocios/guerra-precios-carros-electricos-colombia-tesla-kia-byd-2026-HF35471723"],
      ["El Colombiano: Tesla cobra la conectividad premium", "https://www.elcolombiano.com/negocios/tesla-cobrara-69900-pesos-mensuales-conectividad-premium-colombia-KK40680039"],
      ["EV Database: potencia de carga del Model Y RWD", "https://ev-database.org/car/3741/Tesla-Model-Y-RWD"]]
  },
  {
    id: "byd-sealion-7", marca: "BYD", modelo: "Sealion 7", version: "RWD (tracción trasera)", color: "#1E6FD9", forma: "suv",
    precio: 116.99, precioTxt: "$116.990.000", precioNota: "Precio de lanzamiento de noviembre de 2026; las primeras 200 unidades se entregan en diciembre.",
    autonomia: 440, ciclo: "WLTP", hp: 228, bateria: 71.8, quimica: "LFP (Blade)", cero100: 7.3,
    conector: "Tipo 2 / CCS2", ac: 7, dc: 110, dcTxt: "Cargadores rápidos CCS2",
    garantia: "Batería: 8 años o 150.000 km · vehículo: 6 años o 150.000 km",
    otra: "La versión AWD tiene más de 520 hp.",
    suscripcion: { tipo: "sin", titulo: "Sin suscripción publicada", txt: "No encontramos un plan de pago de servicios conectados de BYD en Colombia. El carro trae Android Auto y Apple CarPlay inalámbricos y el asistente de voz «Hi BYD»." },
    app: "BYD App: encendido remoto y control y monitoreo a distancia.",
    clave: "Es la respuesta directa de BYD al Model Y: 3 millones de pesos más barata, con menos potencia y menos autonomía.",
    fuentes: [["El Carro Colombiano: BYD Sealion 7 RWD en Colombia", "https://www.elcarrocolombiano.com/novedades/byd-sealion-7-rwd-colombia-precio-ficha-tecnica-autonomia/"]]
  },
  {
    id: "volvo-ex30", marca: "Volvo", modelo: "EX30", version: "Versión de entrada (batería de 51 kWh)", color: "#2E4A62", forma: "suv",
    precio: 179.99, precioTxt: "Desde $179.990.000", precioNota: "Precio de lanzamiento en Colombia (2024). En abril de 2026 El Colombiano reportó que Volvo no bajó sus precios.",
    autonomia: 351, ciclo: "WLTP", hp: 272, bateria: 51, quimica: "LFP", cero100: null,
    conector: "Tipo 1 / CCS1", ac: 22, dc: 150, dcTxt: "Cargadores rápidos CCS1: del 10 al 80 % en 26 minutos",
    garantia: "Consúltala con Volvo Colombia",
    otra: "Las versiones con batería de 69 kWh llegan a 475 km.",
    suscripcion: { tipo: "sin", titulo: "Google integrado", txt: "Trae los servicios de Google en el carro (Asistente, Maps y Play Store) y Apple CarPlay inalámbrico. No encontramos el plazo de los servicios conectados ni una tarifa publicada para Colombia." },
    app: "",
    clave: "Es el más caro y el de menos autonomía de esta lista, pero el único premium y el que más rápido carga en corriente alterna.",
    fuentes: [["El Carro Colombiano: Volvo EX30 en Colombia", "https://www.elcarrocolombiano.com/lanzamientos/volvo-ex30-colombia-precios-y-datos-suv-electrico-premium-a-precio-de-byd/"],
      ["Yahoo Finanzas: el EX30 llegó a Colombia desde $179 millones", "https://es-us.finanzas.yahoo.com/noticias/volvo-ex30-suv-el%C3%A9ctrica-colombia-130000469.html"],
      ["El Colombiano: la guerra de precios de los eléctricos", "https://www.elcolombiano.com/negocios/guerra-precios-carros-electricos-colombia-tesla-kia-byd-2026-HF35471723"]]
  },
  {
    id: "kia-ev3", marca: "Kia", modelo: "EV3", version: "Light (batería de 58,3 kWh)", color: "#111111", forma: "suv",
    precio: 119.99, precioTxt: "Desde $119.990.000", precioNota: "Precio publicado en la página de Kia Colombia. Llegó en 2025 por $164.990.000.",
    autonomia: 436, ciclo: "WLTP", hp: 201, bateria: 58.3, quimica: "NMC", cero100: null,
    conector: "Tipo 1 / CCS1", ac: 11, dc: 102, dcTxt: "Cargadores rápidos CCS1: hasta el 80 % en 29 minutos",
    garantia: "Consúltala con Kia Colombia",
    otra: "La versión Light+ (81,4 kWh) llega a 605 km y carga hasta a 128 kW.",
    suscripcion: { tipo: "sin", titulo: "Sin suscripción publicada", txt: "No encontramos las condiciones de Kia Connect para Colombia. El carro trae Android Auto y Apple CarPlay inalámbricos." },
    app: "Conectividad con el celular por Android Auto y Apple CarPlay.",
    clave: "Bajó unos 45 millones de pesos desde su llegada: hoy cuesta lo mismo que el Model Y.",
    fuentes: [["Kia Colombia: EV3", "https://kia.com.co/nuestros-vehiculos/ev3"],
      ["El Carro Colombiano: Kia EV3 en Colombia", "https://www.elcarrocolombiano.com/lanzamientos/kia-ev3-colombia-precios-versiones-electrico-de-mas-autonomia-por-su-precio/"]]
  },
  {
    id: "renault-kwid-e-tech", marca: "Renault", modelo: "Kwid E-Tech", version: "Techno (única versión)", color: "#E0A800", forma: "ciudad",
    precio: 72.99, precioTxt: "$72.990.000", precioNota: "Precio de la versión renovada (octubre de 2025), vigente en abril de 2026 según El Colombiano.",
    autonomia: 298, ciclo: "urbano (SAE J1634)", hp: 65, bateria: 26.8, quimica: "—", cero100: null,
    conector: "Tipo 2 / CCS2", ac: 7, dc: 30, dcTxt: "Cargadores rápidos CCS2: del 20 al 80 % en unos 45 minutos",
    garantia: "Consúltala con Renault",
    otra: "Se carga también en un enchufe de la casa, de 110 o 220 voltios: del 20 al 80 % en menos de 9 horas.",
    suscripcion: { tipo: "sin", titulo: "Sin suscripción publicada", txt: "No encontramos un plan de servicios conectados de pago. Trae Android Auto y Apple CarPlay inalámbricos." },
    app: "Conectividad con el celular por Android Auto y Apple CarPlay.",
    clave: "Es el eléctrico de entrada: cuesta menos de la mitad que los demás, pero su autonomía se mide en ciclo urbano, más favorable.",
    fuentes: [["El Carro Colombiano: Renault Kwid E-Tech 2026", "https://www.elcarrocolombiano.com/novedades/renault-kwid-e-tech-2026-colombia-carro-electrico-mas-seguro-y-a-mejor-precio/"],
      ["El Colombiano: la guerra de precios de los eléctricos", "https://www.elcolombiano.com/negocios/guerra-precios-carros-electricos-colombia-tesla-kia-byd-2026-HF35471723"]]
  }
];
