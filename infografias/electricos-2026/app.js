/* Infografía interactiva «5 eléctricos frente a frente». Navegación por #ancla: #panorama, #rinde, #carga, #suscripciones o #<id> de cada modelo.
   Usa los estilos de la infografía de drones (dr-*) y los suyos (ev-*). Datos en datos.js. */
(() => {
  const raiz = document.getElementById("ev-app");
  if (!raiz || !window.EVS) return;
  const E = window.EVS;
  const num = (n, d = 0) => Number(n).toFixed(d).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const nombre = (e) => `${e.marca} ${e.modelo}`;
  const chip = (e, cls = "") => `<span class="ev-chip${cls}" style="--c:${e.color}">${nombre(e)}</span>`;

  /* Ilustración propia de cada carro (sin logos): SUV o carro de ciudad, en el color de la marca. */
  const carro = (e, w = 220) => {
    const c = e.color, suv = e.forma === "suv";
    const cuerpo = suv ? "M20 78 Q22 58 44 54 L82 36 Q96 28 116 28 L168 28 Q186 28 198 40 L218 56 Q236 60 238 76 L238 88 L20 88 Z"
      : "M30 80 Q30 62 48 58 L74 38 Q84 30 100 30 L156 30 Q172 30 180 42 L194 60 Q210 64 212 78 L212 88 L30 88 Z";
    const vidrio = suv ? "M92 40 L118 34 L160 34 Q172 34 182 44 L194 56 L84 56 Z" : "M84 44 L102 36 L150 36 Q162 36 170 46 L180 58 L76 58 Z";
    const r = suv ? [[62, 90], [196, 90]] : [[70, 90], [176, 90]];
    return `<svg viewBox="0 0 260 110" width="${w}" role="img" aria-label="Ilustración del ${nombre(e)}"><ellipse cx="130" cy="100" rx="112" ry="6" fill="#000" opacity=".08"/>
      <path d="${cuerpo}" fill="${c}"/><path d="${vidrio}" fill="#cfe3f0" opacity=".9"/><line x1="${suv ? 134 : 126}" y1="${suv ? 34 : 36}" x2="${suv ? 132 : 124}" y2="${suv ? 56 : 58}" stroke="${c}" stroke-width="4"/>
      <rect x="${suv ? 224 : 200}" y="66" width="12" height="6" rx="3" fill="#ffe08a"/>
      ${r.map(([x, y]) => `<g class="ev-rueda" style="transform-origin:${x}px ${y}px"><circle cx="${x}" cy="${y}" r="15" fill="#1b1b1b"/><circle cx="${x}" cy="${y}" r="7" fill="#9aa0a6"/><line x1="${x - 7}" y1="${y}" x2="${x + 7}" y2="${y}" stroke="#555" stroke-width="2"/></g>`).join("")}
      <path d="M118 66 l-6 12 h7 l-4 10 l12 -15 h-7 l4 -7 z" fill="#fff" opacity=".85"/></svg>`;
  };

  /* ---------- Panorama: comparador con botones ---------- */
  const METRICAS = {
    autonomia: { t: "Autonomía", u: "km", v: (e) => e.autonomia, f: (e) => `${num(e.autonomia)} km`, nota: "Autonomía oficial de la versión de entrada, en ciclo WLTP. La del Kwid se mide en ciclo urbano (SAE J1634), que da cifras más altas que el WLTP. En la vida real suele ser menor." },
    precio: { t: "Precio", u: "millones", v: (e) => e.precio, f: (e) => `$${num(e.precio, 2)} M`, nota: "Precio de la versión de entrada en Colombia. El del Volvo EX30 es el de su lanzamiento; Volvo no lo bajó en la guerra de precios de 2026, según El Colombiano.", menor: true },
    hp: { t: "Potencia", u: "hp", v: (e) => e.hp, f: (e) => `${num(e.hp)} hp`, nota: "Caballos de fuerza del motor eléctrico de la versión de entrada." },
    dc: { t: "Carga rápida", u: "kW", v: (e) => e.dc, f: (e) => `${num(e.dc)} kW`, nota: "Potencia máxima de carga en corriente continua (DC). A más kW, menos tiempo en el cargador rápido. Model Y: dato de EV Database." },
    bateria: { t: "Batería", u: "kWh", v: (e) => e.bateria, f: (e) => `${num(e.bateria, 1)} kWh`, nota: "Capacidad de la batería de la versión de entrada." }
  };
  const comparador = () => `<div class="ev-btns" role="tablist">${Object.entries(METRICAS).map(([k, m], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-m="${k}">${m.t}</button>`).join("")}</div>
      <div class="ev-comp" data-comp></div><p class="dr-nota" data-comp-nota></p>`;
  const pintaComp = (k) => {
    const m = METRICAS[k], L = [...E].sort((a, b) => m.menor ? m.v(a) - m.v(b) : m.v(b) - m.v(a)), max = Math.max(...E.map(m.v));
    raiz.querySelector("[data-comp]").innerHTML = L.map((e, i) => `<a class="ev-comp__f" href="#${e.id}" style="--d:${i * 0.07}s">
        <span class="ev-comp__n">${chip(e)}<small>${e.version}</small></span>
        <span class="ev-comp__p"><i style="--v:${(m.v(e) / max * 100).toFixed(1)}%;background:${e.color}"></i>${carro(e, 64).replace("<svg ", '<svg class="ev-comp__car" style="--v:' + (m.v(e) / max * 100).toFixed(1) + '%" ')}</span>
        <b>${m.f(e)}</b></a>`).join("").replace(/href="#/g, `href="${location.pathname}#`);
    raiz.querySelector("[data-comp-nota]").textContent = m.nota;
    raiz.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.m === k)));
  };
  const tabla = () => `<div class="ev-tabla"><table><thead><tr><th></th>${E.map((e) => `<th>${chip(e)}</th>`).join("")}</tr></thead><tbody>
      <tr><th>Precio</th>${E.map((e) => `<td>${e.precioTxt}</td>`).join("")}</tr>
      <tr><th>Autonomía</th>${E.map((e) => `<td><b>${e.autonomia} km</b><small>${e.ciclo}</small></td>`).join("")}</tr>
      <tr><th>Potencia</th>${E.map((e) => `<td>${e.hp} hp</td>`).join("")}</tr>
      <tr><th>Batería</th>${E.map((e) => `<td>${num(e.bateria, 1)} kWh<small>${e.quimica}</small></td>`).join("")}</tr>
      <tr><th>Conector</th>${E.map((e) => `<td>${e.conector}</td>`).join("")}</tr>
      <tr><th>Carga en casa (AC)</th>${E.map((e) => `<td>${e.ac} kW</td>`).join("")}</tr>
      <tr><th>Carga rápida (DC)</th>${E.map((e) => `<td>${e.dc} kW</td>`).join("")}</tr>
      <tr><th>Suscripción</th>${E.map((e) => `<td>${e.suscripcion.tipo === "pago" ? "<b>$69.900/mes</b><small>opcional</small>" : "Sin tarifa publicada"}</td>`).join("")}</tr>
    </tbody></table></div>`;
  const panorama = () => `<section class="dr-vista" data-vista="panorama">
    <div class="dr-bloque"><h3><span>01</span> Compáralos</h3><p class="dr-sub">Toca un dato y mira cómo se ordenan. Toca un carro para ver su ficha.</p>${comparador()}</div>
    <div class="dr-bloque"><h3><span>02</span> Todo en una tabla</h3>${tabla()}</div>
    <div class="dr-bloque dr-bloque--clave"><h4>La mirada crítica</h4><p>Tesla bajó el precio de entrada de los eléctricos y subió el de la conectividad: el carro se vende barato, pero lo que conecta al carro se cobra cada mes.</p></div>
  </section>`;

  /* ---------- ¿Cuánto te rinde? ---------- */
  const rinde = () => `<section class="dr-vista" data-vista="rinde">
    <div class="dr-bloque"><h3><span>01</span> ¿Cada cuánto tendrías que cargarlo?</h3><p class="dr-sub">Mueve la barra según los kilómetros que manejas al día. El cálculo usa la autonomía oficial; en la vida real, con aire acondicionado, subidas o velocidad alta, rinde menos.</p>
      <div class="ev-km"><label for="ev-km">Manejo <b data-km-v>40</b> km al día</label><input id="ev-km" type="range" min="10" max="150" step="5" value="40" data-km></div>
      <div class="ev-rinde" data-rinde></div>
      <p class="dr-nota">Días = autonomía oficial ÷ kilómetros al día, cargando del 0 al 100 %. Es una referencia para comparar, no una promesa.</p></div>
  </section>`;
  const pintaRinde = (km) => {
    raiz.querySelector("[data-km-v]").textContent = km;
    const max = Math.max(...E.map((e) => e.autonomia / km));
    raiz.querySelector("[data-rinde]").innerHTML = [...E].sort((a, b) => b.autonomia - a.autonomia).map((e) => { const d = e.autonomia / km;
      return `<div class="ev-rinde__f"><span>${chip(e)}</span><span class="ev-rinde__dias">${Array.from({ length: Math.min(30, Math.floor(d)) }, () => `<i style="background:${e.color}"></i>`).join("")}${Math.floor(d) > 30 ? "<em>+</em>" : ""}</span><b>${num(d, d < 10 ? 1 : 0)} <small>días</small></b></div>`; }).join("");
  };

  /* ---------- Carga ---------- */
  const conector = (tipo) => tipo.includes("Tipo 2")
    ? `<svg viewBox="0 0 120 150" class="ev-con" aria-hidden="true"><circle cx="60" cy="48" r="40" fill="#fff" stroke="#111" stroke-width="5"/>${[[42, 30], [78, 30], [36, 52], [60, 50], [84, 52], [48, 72], [72, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#111"/>`).join("")}<rect x="28" y="100" width="64" height="40" rx="14" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="46" cy="120" r="9" fill="#111"/><circle cx="74" cy="120" r="9" fill="#111"/></svg>`
    : `<svg viewBox="0 0 120 150" class="ev-con" aria-hidden="true"><circle cx="60" cy="48" r="40" fill="#fff" stroke="#111" stroke-width="5"/>${[[44, 38], [76, 38], [60, 30], [48, 62], [72, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#111"/>`).join("")}<rect x="28" y="100" width="64" height="40" rx="14" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="46" cy="120" r="9" fill="#111"/><circle cx="74" cy="120" r="9" fill="#111"/></svg>`;
  const carga = () => {
    const g2 = E.filter((e) => e.conector.includes("Tipo 2")), g1 = E.filter((e) => !e.conector.includes("Tipo 2")), maxDc = Math.max(...E.map((e) => e.dc));
    return `<section class="dr-vista" data-vista="carga">
      <div class="dr-bloque"><h3><span>01</span> Dos enchufes distintos</h3><p class="dr-sub">En Colombia conviven dos estándares. El conector define en qué cargadores puedes enchufarte sin adaptador.</p>
        <div class="ev-dos">
          <div>${conector("Tipo 2")}<h4>Tipo 2 / CCS2</h4><p class="dr-txt">El estándar europeo. Arriba, la parte de corriente alterna; abajo, las dos clavijas de carga rápida.</p><div class="ev-chips">${g2.map((e) => chip(e)).join("")}</div></div>
          <div>${conector("Tipo 1")}<h4>Tipo 1 / CCS1</h4><p class="dr-txt">El estándar estadounidense. Funciona igual, pero la parte de corriente alterna tiene otra forma.</p><div class="ev-chips">${g1.map((e) => chip(e)).join("")}</div></div>
        </div></div>
      <div class="dr-bloque"><h3><span>02</span> En la casa y en la calle</h3><p class="dr-sub">En corriente alterna (casa, oficina, centros comerciales) se carga despacio; en corriente continua (cargadores rápidos) se carga en minutos.</p>
        <div class="ev-carga">${E.map((e, i) => `<div class="ev-carga__f" style="--d:${i * 0.1}s"><span>${chip(e)}</span>
          <span class="ev-carga__b"><i class="ev-ac" style="--v:${(e.ac / maxDc * 100).toFixed(1)}%"></i><em>AC ${e.ac} kW</em></span>
          <span class="ev-carga__b"><i class="ev-dc" style="--v:${(e.dc / maxDc * 100).toFixed(1)}%;background:${e.color}"></i><em>DC ${e.dc} kW</em></span>
          <small>${e.dcTxt}</small></div>`).join("")}</div>
        <p class="dr-nota">Potencias máximas que acepta cada carro; el cargador también limita la velocidad. El Kwid además se carga en un enchufe doméstico de 110 o 220 voltios.</p></div>
    </section>`;
  };

  /* ---------- Suscripciones ---------- */
  const suscripciones = () => `<section class="dr-vista" data-vista="suscripciones">
    <div class="dr-bloque"><h3><span>01</span> ¿Hay que pagar cada mes?</h3><p class="dr-sub">Solo Tesla tiene una suscripción publicada en Colombia. En los demás no encontramos planes de pago; usan el celular con Android Auto o Apple CarPlay, o los servicios de Google.</p>
      <div class="ev-sus">${E.map((e, i) => `<a class="ev-sus__c ev-sus__c--${e.suscripcion.tipo}" href="#${e.id}" style="--c:${e.color};--d:${i * 0.08}s">${chip(e)}<h4>${e.suscripcion.titulo}</h4><p>${e.suscripcion.txt}</p>${e.app ? `<small>${e.app}</small>` : ""}</a>`).join("")}</div>
      <div class="ev-cuenta"><b>$838.800</b><p>es lo que suma la Conectividad Premium de Tesla en un año (12 × $69.900). En 5 años, $4.194.000: más del 3 % del precio del carro.</p></div></div>
  </section>`;

  /* ---------- Ficha de cada modelo ---------- */
  const ficha = (e, i) => { const ant = E[(i + E.length - 1) % E.length], sig = E[(i + 1) % E.length];
    return `<section class="dr-vista dr-ficha" data-vista="${e.id}">
      <div class="ev-cab" style="--c:${e.color}"><div><span class="dr-ficha__n">${String(i + 1).padStart(2, "0")} / ${E.length} · ${e.version}</span><h3 class="ev-cab__t">${e.marca} <em>${e.modelo}</em></h3><p class="dr-txt">${e.clave}</p></div><div class="ev-cab__car">${carro(e, 320)}</div></div>
      <div class="dr-datos">
        <div><span>Precio</span><b>${e.precioTxt.replace("Desde ", "")}</b><em>${e.precioNota}</em></div>
        <div><span>Autonomía</span><b>${e.autonomia} <small>km</small></b><em>ciclo ${e.ciclo}</em></div>
        <div><span>Potencia</span><b>${e.hp} <small>hp</small></b><em>${e.cero100 ? `0 a 100 km/h en ${num(e.cero100, 1)} s` : "motor eléctrico de la versión de entrada"}</em></div>
        <div><span>Batería</span><b>${num(e.bateria, 1)} <small>kWh</small></b><em>${e.quimica !== "—" ? e.quimica : "capacidad total"}</em></div>
      </div>
      <div class="dr-ficha__rej">
        <div class="dr-bloque"><h4>Carga</h4><p class="dr-txt"><b>${e.conector}</b> · hasta ${e.ac} kW en corriente alterna y ${e.dc} kW en carga rápida. ${e.dcTxt}.</p><h4 class="dr-mt">Garantía</h4><p class="dr-txt">${e.garantia}.</p></div>
        <div class="dr-bloque"><h4>Suscripción y servicios</h4><p class="dr-txt"><b>${e.suscripcion.titulo}.</b> ${e.suscripcion.txt}</p>${e.app ? `<p class="dr-txt">${e.app}</p>` : ""}<h4 class="dr-mt">Otra versión</h4><p class="dr-txt">${e.otra}</p></div>
      </div>
      <div class="dr-bloque"><h4>Fuentes</h4><ul class="st-fuentes">${e.fuentes.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`).join("")}</ul></div>
      <nav class="dr-pasos" aria-label="Cambiar de carro"><a href="#${ant.id}">← ${nombre(ant)}</a><a href="#panorama">Panorama</a><a href="#${sig.id}">${nombre(sig)} →</a></nav>
    </section>`; };

  /* ---------- Armado y navegación (las páginas usan <base href="/">) ---------- */
  const aqui = location.pathname;
  raiz.innerHTML = (`<nav class="dr-nav" aria-label="Navegación de la infografía"><div class="dr-nav__carril">
      <a href="#panorama" data-ir="panorama"><span class="dr-nav__ico">▦</span>Panorama</a>
      <a href="#rinde" data-ir="rinde"><span class="dr-nav__ico">⟳</span>¿Cada cuánto cargo?</a>
      <a href="#carga" data-ir="carga"><span class="dr-nav__ico">ϟ</span>Carga</a>
      <a href="#suscripciones" data-ir="suscripciones"><span class="dr-nav__ico">$</span>Suscripciones</a>
      ${E.map((e) => `<a href="#${e.id}" data-ir="${e.id}"><span class="ev-nav__p" style="--c:${e.color}"></span>${nombre(e)}</a>`).join("")}
    </div></nav>
    <div class="dr-vistas">${panorama()}${rinde()}${carga()}${suscripciones()}${E.map(ficha).join("")}</div>`).replace(/href="#/g, `href="${aqui}#`);

  raiz.querySelector(".ev-btns").addEventListener("click", (ev) => { const b = ev.target.closest("[data-m]"); if (b) pintaComp(b.dataset.m); });
  pintaComp("autonomia");
  const km = raiz.querySelector("[data-km]"); km.addEventListener("input", () => pintaRinde(+km.value)); pintaRinde(+km.value);

  const ir = (id, desplazar) => {
    if (!raiz.querySelector(`[data-vista="${id}"]`)) id = "panorama";
    raiz.querySelectorAll("[data-vista]").forEach((v) => { v.hidden = v.dataset.vista !== id; });
    raiz.querySelectorAll("[data-ir]").forEach((a) => { if (a.dataset.ir === id) { a.setAttribute("aria-current", "page");
      const car = a.parentElement; car.scrollTo({ left: a.offsetLeft - (car.clientWidth - a.offsetWidth) / 2, behavior: "smooth" }); } else a.removeAttribute("aria-current"); });
    const vista = raiz.querySelector(`[data-vista="${id}"]`);
    vista.classList.remove("ve"); void vista.offsetWidth; vista.classList.add("ve");
    vista.querySelectorAll(".dr-datos b, .ev-cuenta b").forEach((el) => {
      const nodo = el.firstChild; if (!nodo || nodo.nodeType !== 3) return;
      if (!el.dataset.final) el.dataset.final = nodo.textContent;
      const txt = el.dataset.final, m = txt.match(/[\d.,]+/); if (!m || /\.\d{3}/.test(m[0])) return;
      const fin = parseFloat(m[0].replace(",", ".")), dec = (m[0].split(",")[1] || "").length, ini = performance.now();
      const paso = (now) => { const k = Math.min((now - ini) / 900, 1), e = 1 - Math.pow(1 - k, 3);
        nodo.textContent = txt.replace(m[0], k < 1 ? (fin * e).toFixed(dec).replace(".", ",") : m[0]); if (k < 1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    });
    if (desplazar) raiz.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const desdeAncla = (desplazar) => ir(decodeURIComponent(location.hash.slice(1)) || "panorama", desplazar);
  window.addEventListener("hashchange", () => desdeAncla(true));
  desdeAncla(false);
})();
