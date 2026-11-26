/* Infografía interactiva «iPhone Duo vs. Galaxy Z Fold 8». Navegación por #ancla: #panorama, #pruebas, #cual, #iphone-duo, #galaxy-z-fold-8.
   Datos: RTÉ, Trusted Reviews, Absolute Geeks, MakeUseOf y Enter.co (consultados el 25 y 26 de noviembre de 2026). */
(() => {
  const raiz = document.getElementById("pl-app");
  if (!raiz || !window.TEL) return;
  const A = { id: "iphone-duo", k: "a", nombre: "iPhone Duo", marca: "Apple", color: "#8d9299", chip: "#E8E8E4", tinta: "#111" };
  const B = { id: "galaxy-z-fold-8", k: "b", nombre: "Galaxy Z Fold 8", marca: "Samsung", color: "#2F6FED", chip: "#2F6FED", tinta: "#fff" };
  const chip = (p) => `<span class="pl-chip" style="background:${p.chip};color:${p.tinta}">${p.nombre}</span>`;
  const tel = (p, w = 220) => TEL(p.k).replace("<svg ", `<svg width="${w}" height="${Math.round(w * 280 / 340)}" role="img" aria-label="Ilustración del ${p.nombre}" `);

  /* Frente a frente: [dato, Duo, Fold, quién gana: "a", "b" o ""] */
  const FILAS = [
    ["Precio en EE. UU. (256 GB)", "1.999 dólares", "1.899 dólares", "b"],
    ["Precio en Colombia", "Desde $9.199.000", "Sin precio oficial", ""],
    ["Pantallas", "5,4″ fuera + 7,6″ dentro", "5,5″ fuera + 7,6″ dentro", ""],
    ["Pantalla interior", "Mate, como papel", "Brillante, refleja más", ""],
    ["Peso", "254 g", "201 g", "b"],
    ["Grosor cerrado", "11,3 mm", "9,7 mm", "b"],
    ["Batería al acostarse", "Más del 50 %", "Cerca del 40 %", "a"],
    ["Chip", "A20 Pro", "Snapdragon 8 Elite Gen 5", "a"],
    ["Agua y polvo", "IP68", "IP48", "a"],
    ["Cámara principal", "48 MP · mejor en video", "50 MP · selfis más nítidas", ""]
  ];
  const tabla = () => `<div class="pl-tabla"><div class="pl-fila pl-fila--cab"><span></span><span>${chip(A)}</span><span>${chip(B)}</span></div>
    ${FILAS.map(([k, a, b, g], i) => `<div class="pl-fila" style="--d:${(0.08 * i).toFixed(2)}s"><span class="pl-k">${k}</span><span class="${g === "a" ? "pl-gana" : ""}">${a}</span><span class="${g === "b" ? "pl-gana" : ""}">${b}</span></div>`).join("")}</div>
    <p class="dr-nota">● Mejor dato de cada fila. Batería: prueba de uso diario de un periodista de RTÉ, con días de unas 15 horas.</p>`;

  /* ---------- Pruebas animadas ---------- */
  const PRUEBAS = {
    peso: { t: "En la mano", d: "La balanza se inclina hacia el que más pesa: el Duo. Tras un buen rato de uso, a un reseñista le dolía la muñeca." },
    bateria: { t: "Batería", d: "Al final de un día de 15 horas, el Duo llegaba con más del 50 % y el Fold 8 con cerca del 40 %." },
    pantalla: { t: "Pantalla", d: "En el Duo, leer se parece a leer en papel. El Fold 8 se ve más vivo, pero refleja más la luz." },
    alcance: { t: "Alcance", d: "El Duo es más corto: el pulgar llega mejor a la parte de arriba de la pantalla." },
    resistencia: { t: "Resistencia", d: "El Duo resiste agua y polvo (IP68). El Fold 8 resiste agua, pero protege menos del polvo (IP48)." },
    apps: { t: "Apps", d: "El Fold 8 es la octava generación de Samsung. En el Duo aún hay apps con franjas negras, aunque cada semana son menos." }
  };
  function prueba(id) {
    const s = { peso: pesoSvg, bateria: bateriaSvg, pantalla: pantallaSvg, alcance: alcanceSvg, resistencia: resistenciaSvg, apps: appsSvg }[id]();
    return `<div class="pl-escena">${s}</div><p class="pl-desc">${PRUEBAS[id].d}</p>`;
  }
  function pesoSvg() {
    const t = (p, x, y) => `<g transform="translate(${x} ${y})">${TEL(p.k).replace("<svg ", '<svg x="-70" y="-58" width="140" height="115" ')}</g>`;
    return `<svg viewBox="0 0 700 380" class="pl-svg" role="img" aria-label="Balanza: el iPhone Duo pesa más">
      <path d="M320 360 L380 360 L356 120 L344 120 Z" fill="#00875A" fill-opacity=".1" stroke="#00875A" stroke-width="4"/>
      <g class="pl-balanza"><line x1="120" y1="120" x2="580" y2="120" stroke="#111" stroke-width="7" stroke-linecap="round"/>
        <g class="pl-plato pl-plato--a"><line x1="120" y1="120" x2="65" y2="230" stroke="#111" stroke-width="3"/><line x1="120" y1="120" x2="175" y2="230" stroke="#111" stroke-width="3"/><path d="M45 230 Q120 268 195 230" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>${t(A, 120, 188)}<text x="120" y="320" text-anchor="middle" class="pl-cifra">254 g</text></g>
        <g class="pl-plato pl-plato--b"><line x1="580" y1="120" x2="525" y2="230" stroke="#111" stroke-width="3"/><line x1="580" y1="120" x2="635" y2="230" stroke="#111" stroke-width="3"/><path d="M505 230 Q580 268 655 230" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>${t(B, 580, 188)}<text x="580" y="320" text-anchor="middle" class="pl-cifra" fill="#2F6FED">201 g</text></g>
        <circle cx="350" cy="120" r="7" fill="#fff"><animateMotion dur="2.4s" repeatCount="indefinite" path="M-230 0 L230 0"/></circle></g>
      <circle cx="350" cy="120" r="16" fill="#00875A"/><circle cx="350" cy="120" r="6" fill="#fff"/></svg>`;
  }
  function bateriaSvg() {
    const bat = (p, y, fin) => `<g transform="translate(60 ${y})"><text x="0" y="-14" class="pl-mono" fill="${p === A ? "#111" : "#2F6FED"}">${p.nombre.toUpperCase()}</text>
      <rect x="0" y="0" width="470" height="90" rx="22" fill="#fff" stroke="#111" stroke-width="7"/><rect x="478" y="28" width="20" height="34" rx="6" fill="#111"/>
      <rect x="12" y="12" width="446" height="66" rx="13" fill="${p === A ? "#00875A" : "#2F6FED"}" class="pl-carga" style="--fin:${fin}"/>
      <text x="530" y="62" class="pl-cifra" fill="${p === A ? "#00875A" : "#2F6FED"}">${p === A ? "50 %" : "40 %"}</text></g>`;
    // El arco del sol cabe completo (punto más alto en y = 30) y la segunda batería deja margen abajo.
    return `<svg viewBox="0 0 700 480" class="pl-svg" role="img" aria-label="Batería al final del día: 50 % y 40 %">
      <path d="M90 170 A 260 140 0 0 1 610 170" fill="none" stroke="#111" stroke-opacity=".12" stroke-width="3" stroke-dasharray="8 10"/>
      <circle r="20" fill="#F0C36B" class="pl-sol"><animateMotion dur="3s" fill="freeze" path="M90 170 A 260 140 0 0 1 610 170"/></circle>
      <text x="350" y="125" text-anchor="middle" class="pl-mono">UN DÍA DE 15 HORAS</text>
      ${bat(A, 230, 0.5)}${bat(B, 360, 0.4)}</svg>`;
  }
  function pantallaSvg() {
    const lineas = Array.from({ length: 8 }, (_, i) => `<rect x="80" y="${110 + i * 26}" width="${i % 3 === 2 ? 120 : 200}" height="10" rx="5" fill="#6b6b66" opacity=".55" class="pl-linea" style="--d:${0.15 * i}s"/>`).join("");
    return `<svg viewBox="0 0 700 380" class="pl-svg" role="img" aria-label="Pantalla mate del Duo y brillante del Fold 8">
      <defs><linearGradient id="pl-viva" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b9cff"/><stop offset=".5" stop-color="#7B4BE0"/><stop offset="1" stop-color="#14B8C8"/></linearGradient>
        <linearGradient id="pl-ref" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <clipPath id="pl-clip"><rect x="410" y="80" width="230" height="270" rx="16"/></clipPath></defs>
      <rect x="50" y="60" width="270" height="310" rx="30" fill="#202322"/><rect x="60" y="80" width="250" height="270" rx="16" fill="#ECE8DD"/>${lineas}
      <text x="185" y="40" text-anchor="middle" class="pl-mono">IPHONE DUO · MATE</text>
      <rect x="400" y="60" width="250" height="310" rx="30" fill="#141a2b"/><rect x="410" y="80" width="230" height="270" rx="16" fill="url(#pl-viva)"/>
      <g clip-path="url(#pl-clip)"><rect x="300" y="20" width="90" height="420" fill="url(#pl-ref)" transform="rotate(20 525 215)"><animate attributeName="x" from="250" to="760" dur="2.6s" repeatCount="indefinite"/></rect></g>
      <text x="525" y="40" text-anchor="middle" class="pl-mono" fill="#2F6FED">FOLD 8 · BRILLANTE</text></svg>`;
  }
  function alcanceSvg() {
    const fon = (x, w, h, p, llega) => { const top = 190 - h / 2, base = 190 + h / 2, yA = llega ? top + 40 : top + h * 0.38;
      return `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="24" fill="#fff" stroke="${p.color}" stroke-width="7"/>
        <line x1="${x - w / 2 + 14}" x2="${x + w / 2 - 14}" y1="${top + 40}" y2="${top + 40}" stroke="${llega ? "#00875A" : "#C0392B"}" stroke-width="4" stroke-dasharray="8 8"/>
        <path d="M${x - w / 2 - 20} ${base + 14} Q ${x - w / 2 + 30} ${yA + 30} ${x + 10} ${yA}" fill="none" stroke="${llega ? "#00875A" : "#C0392B"}" stroke-width="10" stroke-linecap="round" class="pl-arco"/>
        <circle cx="${x + 10}" cy="${yA}" r="12" fill="${llega ? "#00875A" : "#C0392B"}" class="pl-punta"/>
        <text x="${x}" y="${base + 50}" text-anchor="middle" class="pl-mono" fill="${llega ? "#00875A" : "#C0392B"}">${llega ? "LLEGA ARRIBA" : "SE QUEDA CORTO"}</text>`; };
    return `<svg viewBox="0 0 700 420" class="pl-svg" role="img" aria-label="El pulgar llega mejor arriba en el Duo">${fon(210, 200, 250, A, true)}${fon(500, 210, 330, B, false)}</svg>`;
  }
  function resistenciaSvg() {
    const medidor = (x, p, agua, polvo, cod) => `<g transform="translate(${x} 0)"><text x="0" y="60" text-anchor="middle" class="pl-cifra" fill="${p === A ? "#111" : "#2F6FED"}">${cod}</text>
      <text x="0" y="92" text-anchor="middle" class="pl-mono">${p.nombre.toUpperCase()}</text>
      ${[["POLVO", polvo, 6, 130], ["AGUA", agua, 9, 230]].map(([n, v, max, y]) => `<text x="-140" y="${y - 10}" class="pl-mono">${n}</text>
        ${Array.from({ length: max }, (_, i) => `<rect x="${-140 + i * 30}" y="${y}" width="24" height="40" rx="6" fill="${i < v ? (p === A ? "#00875A" : "#2F6FED") : "#ecece8"}" class="pl-nivel" style="--d:${(0.08 * i).toFixed(2)}s"/>`).join("")}`).join("")}</g>`;
    return `<svg viewBox="0 0 700 300" class="pl-svg" role="img" aria-label="Resistencia: IP68 frente a IP48">${medidor(190, A, 8, 6, "IP68")}${medidor(530, B, 8, 4, "IP48")}</svg>
      <p class="dr-nota">El primer número del código IP mide la protección contra el polvo (de 0 a 6) y el segundo contra el agua (de 0 a 9).</p>`;
  }
  function appsSvg() {
    const gens = Array.from({ length: 8 }, (_, i) => `<g class="pl-gen" style="--d:${(0.18 * i).toFixed(2)}s"><circle cx="${70 + i * 70}" cy="80" r="${i === 7 ? 26 : 18}" fill="${i === 7 ? "#2F6FED" : "#fff"}" stroke="#2F6FED" stroke-width="4"/>
      <text x="${70 + i * 70}" y="${i === 7 ? 89 : 87}" text-anchor="middle" font-family="Inter Tight" font-weight="900" font-size="${i === 7 ? 24 : 18}" fill="${i === 7 ? "#fff" : "#2F6FED"}">${i + 1}</text></g>`).join("");
    return `<svg viewBox="0 0 700 420" class="pl-svg" role="img" aria-label="Ocho generaciones del Fold y franjas negras en el Duo">
      <line x1="70" x2="560" y1="80" y2="80" stroke="#2F6FED" stroke-width="4"/>${gens}
      <text x="315" y="135" text-anchor="middle" class="pl-mono" fill="#2F6FED">8 GENERACIONES DE PLEGABLES TIPO LIBRO</text>
      <rect x="170" y="170" width="360" height="230" rx="24" fill="#202322"/><rect x="182" y="182" width="336" height="206" rx="12" fill="#000"/>
      <g class="pl-app-franja"><rect x="232" y="182" width="236" height="206" fill="#f4f4f1"/><rect x="248" y="198" width="204" height="40" rx="8" fill="#00875A"/>
        ${[0, 1, 2].map((i) => `<rect x="248" y="${252 + i * 44}" width="204" height="32" rx="8" fill="#dcdcd6"/>`).join("")}</g>
      <text x="350" y="160" text-anchor="middle" class="pl-mono">IPHONE DUO · FRANJAS NEGRAS</text></svg>`;
  }

  /* ---------- ¿Cuál te conviene? ---------- */
  const PREGUNTAS = [
    ["liviano", "Quiero un plegable liviano", "b"], ["apps", "Trabajo con varias apps a la vez", "b"],
    ["iphone", "Vengo del iPhone", "a"], ["leer", "Leo mucho en la pantalla", "a"],
    ["lapiz", "Quiero escribir con lápiz", "a"], ["agua", "Me importa que resista agua y polvo", "a"],
    ["bateria", "Necesito que la batería dure todo el día", "a"], ["precio", "Busco el más barato en EE. UU.", "b"]
  ];
  const cual = () => `<div class="pl-cual"><div class="pl-preg">${PREGUNTAS.map(([id, t]) => `<label><input type="checkbox" data-preg="${id}"><span>${t}</span></label>`).join("")}</div>
    <div class="pl-res" data-res><span class="dr-portada__k">Tu resultado</span><p>Marca lo que te importa y te decimos cuál se ajusta mejor.</p></div></div>`;
  function calcular() {
    const marcadas = [...raiz.querySelectorAll("[data-preg]:checked")].map((c) => PREGUNTAS.find((q) => q[0] === c.dataset.preg));
    const a = marcadas.filter((q) => q[2] === "a").length, b = marcadas.filter((q) => q[2] === "b").length, res = raiz.querySelector("[data-res]");
    if (!marcadas.length) { res.innerHTML = `<span class="dr-portada__k">Tu resultado</span><p>Marca lo que te importa y te decimos cuál se ajusta mejor.</p>`; return; }
    const g = a === b ? null : a > b ? A : B;
    res.innerHTML = `<span class="dr-portada__k">Tu resultado</span>${g ? `<div class="pl-res__tel">${tel(g, 180)}</div>${chip(g)}<p><b>${a > b ? a : b} de ${marcadas.length}</b> de tus prioridades apuntan al ${g.nombre}.</p>`
      : `<p><b>Empate.</b> Los dos cumplen lo mismo de lo que marcaste: decide el precio y el ecosistema que ya usas.</p>`}
      <div class="pl-marcador"><span style="--v:${a / marcadas.length}">${A.nombre} · ${a}</span><span style="--v:${b / marcadas.length}">${B.nombre} · ${b}</span></div>`;
    res.classList.remove("ve"); void res.offsetWidth; res.classList.add("ve");
  }

  /* ---------- Fichas ---------- */
  const FICHA = {
    "iphone-duo": { p: A, pros: ["Leer en la pantalla interior se parece a leer en papel", "Más corto: el pulgar llega mejor arriba", "Mejor batería al final del día", "IP68: resiste agua y polvo", "Chip más potente para video y juegos"],
      contras: ["Tras un buen rato de uso, a un reseñista le dolía la muñeca", "Aún hay apps que no llenan la pantalla grande", "Algunas unidades salieron con la pantalla interior rota; Apple reconoce el problema en pocas unidades y las cambia"],
      precio: "1.999 dólares en EE. UU. (256 GB) · desde $9.199.000 en Colombia" },
    "galaxy-z-fold-8": { p: B, pros: ["Se siente casi como un celular normal, sin doblar", "Con dos apps en pantalla dividida no se traba", "Es la octava generación de plegables tipo libro de Samsung, y en las apps se nota", "En EE. UU., Samsung cambia gratis el protector de pantalla el primer año"],
      contras: ["La pantalla brillante refleja más la luz", "IP48: protege menos del polvo", "Llega a la noche con menos batería"],
      precio: "1.899 dólares en EE. UU. (256 GB) · sin precio oficial en Colombia" }
  };
  const ficha = (id) => { const f = FICHA[id], p = f.p, otro = p === A ? B : A;
    return `<section class="dr-vista dr-ficha" data-vista="${id}">
      <div class="dr-ficha__cab"><div class="dr-ficha__img pl-ficha__img">${tel(p, 260)}</div>
        <div><span class="dr-ficha__n">${p.marca}</span><h3>${p.nombre}</h3><p>${f.precio}</p></div></div>
      <div class="dr-ficha__rej"><div class="dr-bloque"><h4>Lo que destacan quienes lo usan</h4><ul class="dr-col">${f.pros.map((x) => `<li class="ok">${x}</li>`).join("")}</ul></div>
        <div class="dr-bloque"><h4>Lo que les molesta</h4><ul class="dr-col">${f.contras.map((x) => `<li class="ojo">${x}</li>`).join("")}</ul></div></div>
      <nav class="dr-pasos" aria-label="Cambiar de vista"><a href="#panorama">Frente a frente</a><a href="#pruebas">Pruebas</a><a href="#${otro.id}">${otro.nombre} →</a></nav></section>`; };

  /* ---------- Armado ---------- */
  const aqui = location.pathname;
  raiz.innerHTML = (`<nav class="dr-nav" aria-label="Navegación de la infografía"><div class="dr-nav__carril">
      <a href="#panorama" data-ir="panorama"><span class="dr-nav__ico">▦</span>Frente a frente</a>
      <a href="#pruebas" data-ir="pruebas"><span class="dr-nav__ico">▶</span>Pruebas</a>
      <a href="#cual" data-ir="cual"><span class="dr-nav__ico">?</span>¿Cuál te conviene?</a>
      <a href="#${A.id}" data-ir="${A.id}"><span class="st-nav__p" style="--c:${A.chip}"></span>${A.nombre}</a>
      <a href="#${B.id}" data-ir="${B.id}"><span class="st-nav__p" style="--c:${B.chip}"></span>${B.nombre}</a></div></nav>
    <div class="dr-vistas">
      <section class="dr-vista" data-vista="panorama"><div class="pl-heroe"><div>${tel(A, 240)}${chip(A)}</div><span class="pl-vs">vs.</span><div>${tel(B, 240)}${chip(B)}</div></div>
        <div class="dr-bloque"><h3><span>01</span> Frente a frente</h3><p class="dr-sub">Lo que dicen las fichas y las pruebas de quienes ya los usan.</p>${tabla()}</div>
        <div class="dr-bloque dr-bloque--clave"><h4>La mirada crítica</h4><p>El mejor plegable no es el de más números, sino el que te hace olvidar que se dobla.</p></div></section>
      <section class="dr-vista" data-vista="pruebas"><div class="dr-bloque"><h3><span>02</span> Pruébalos</h3><p class="dr-sub">Elige una prueba y mira la diferencia.</p>
        <div class="dr-sim__btns pl-tabs" role="tablist">${Object.entries(PRUEBAS).map(([k, v], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-prueba="${k}">${v.t}</button>`).join("")}</div>
        <div class="pl-prueba" data-prueba-caja></div></div></section>
      <section class="dr-vista" data-vista="cual"><div class="dr-bloque"><h3><span>03</span> ¿Cuál te conviene?</h3><p class="dr-sub">Marca lo que más te importa.</p>${cual()}</div></section>
      ${ficha(A.id)}${ficha(B.id)}
    </div>`).replace(/href="#/g, `href="${aqui}#`);

  const caja = raiz.querySelector("[data-prueba-caja]");
  const verPrueba = (k) => { caja.innerHTML = prueba(k); caja.classList.remove("ve"); void caja.offsetWidth; caja.classList.add("ve");
    raiz.querySelectorAll("[data-prueba]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.prueba === k))); };
  raiz.querySelector(".pl-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-prueba]"); if (b) verPrueba(b.dataset.prueba); });
  verPrueba("peso");
  raiz.querySelectorAll("[data-preg]").forEach((c) => c.addEventListener("change", calcular));

  const ir = (id, desplazar) => {
    if (!raiz.querySelector(`[data-vista="${id}"]`)) id = "panorama";
    raiz.querySelectorAll("[data-vista]").forEach((v) => { v.hidden = v.dataset.vista !== id; });
    raiz.querySelectorAll("[data-ir]").forEach((a) => { if (a.dataset.ir === id) { a.setAttribute("aria-current", "page");
      const car = a.parentElement; car.scrollTo({ left: a.offsetLeft - (car.clientWidth - a.offsetWidth) / 2, behavior: "smooth" }); } else a.removeAttribute("aria-current"); });
    const v = raiz.querySelector(`[data-vista="${id}"]`); v.classList.remove("ve"); void v.offsetWidth; v.classList.add("ve");
    if (id === "pruebas") verPrueba(raiz.querySelector('[data-prueba][aria-selected="true"]').dataset.prueba);
    if (desplazar) raiz.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  window.addEventListener("hashchange", () => ir(decodeURIComponent(location.hash.slice(1)) || "panorama", true));
  ir(decodeURIComponent(location.hash.slice(1)) || "panorama", false);
})();
