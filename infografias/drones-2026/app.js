/* Infografía interactiva «Los 10 drones que importan». Navegación por #ancla: #panorama o #<id del dron>. */
(() => {
  const raiz = document.getElementById("dr-app");
  if (!window.DRONES) return;
  const D = window.DRONES, C = window.CONTROLES, R = window.RECORRIDOS;
  const kmh = (ms) => Math.round(ms * 3.6);
  const mil = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const gramos = (d) => d.pesoTxt || (d.peso < 1000 ? `${String(d.peso).replace(".", ",")} g` : `${String((d.peso / 1000).toFixed(2)).replace(".", ",")} kg`);
  const registro = (d) => d.peso >= 200;
  const LEGAL = 122;

  /* ---------- Ilustraciones propias (sin logos) ---------- */
  const helice = (x, y, r, c) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.22}" fill="${c}" opacity=".35"/><circle cx="${x}" cy="${y}" r="3" fill="#222"/>`;
  function dibujo(d, h = 120) {
    const c = d.color, osc = "#1d1f23";
    let s = "";
    if (d.tipo === "selfie") {
      s = `<rect x="40" y="38" width="120" height="44" rx="18" fill="${c}" stroke="#8d9299" stroke-width="2"/>
        ${[[30, 34], [170, 34], [30, 86], [170, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="#8d9299" stroke-width="5"/>${helice(x, y, 22, "#555")}`).join("")}
        <rect x="88" y="56" width="24" height="20" rx="6" fill="${osc}"/><circle cx="100" cy="66" r="6" fill="#33415c"/>`;
    } else if (d.tipo === "fpv") {
      s = `${[[38, 36], [162, 36], [38, 84], [162, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="30" fill="${c}" opacity=".9"/><circle cx="${x}" cy="${y}" r="24" fill="#2a2d32"/>${helice(x, y, 22, "#8a8f96")}`).join("")}
        <rect x="62" y="40" width="76" height="40" rx="14" fill="${c}"/><circle cx="100" cy="46" r="10" fill="#111" stroke="#7FD1B0" stroke-width="2"/><circle cx="100" cy="76" r="10" fill="#111" stroke="#7FD1B0" stroke-width="2"/>`;
    } else if (d.tipo === "a1") {
      s = `<path d="M100 60 L30 28 M100 60 L170 28 M100 60 L30 92 M100 60 L170 92" stroke="${c}" stroke-width="9" stroke-linecap="round"/>
        ${[[30, 28], [170, 28], [30, 92], [170, 92]].map(([x, y]) => helice(x, y, 28, "#7a8396")).join("")}
        <ellipse cx="100" cy="60" rx="34" ry="24" fill="${c}"/><circle cx="100" cy="38" r="11" fill="#0d1220" stroke="#9fb4ff" stroke-width="2"/><circle cx="100" cy="82" r="11" fill="#0d1220" stroke="#9fb4ff" stroke-width="2"/>`;
    } else if (d.tipo === "caja") {
      s = `<rect x="30" y="20" width="140" height="80" rx="16" fill="${c}" stroke="#a9a59b" stroke-width="3"/>
        ${[[58, 46], [142, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="#d8d4ca"/>${helice(x, y, 20, "#555")}`).join("")}
        <rect x="82" y="70" width="36" height="24" rx="8" fill="#2a2a2a"/><circle cx="100" cy="82" r="8" fill="#3b4a66"/>`;
    } else if (d.tipo === "empresa") {
      s = `<path d="M100 60 L22 22 M100 60 L178 22 M100 60 L22 98 M100 60 L178 98" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
        ${[[22, 22], [178, 22], [22, 98], [178, 98]].map(([x, y]) => helice(x, y, 30, "#6d7480")).join("")}
        <rect x="66" y="38" width="68" height="44" rx="12" fill="${c}"/><rect x="88" y="74" width="24" height="18" rx="5" fill="#111"/><circle cx="100" cy="83" r="6" fill="#c0392b" opacity=".8"/>`;
    } else { // plegable y grande
      const g = d.tipo === "grande";
      s = `<path d="M100 60 L${g ? 26 : 34} ${g ? 24 : 30} M100 60 L${g ? 174 : 166} ${g ? 24 : 30} M100 60 L${g ? 26 : 34} ${g ? 96 : 90} M100 60 L${g ? 174 : 166} ${g ? 96 : 90}" stroke="${c}" stroke-width="${g ? 9 : 7}" stroke-linecap="round"/>
        ${(g ? [[26, 24], [174, 24], [26, 96], [174, 96]] : [[34, 30], [166, 30], [34, 90], [166, 90]]).map(([x, y]) => helice(x, y, g ? 28 : 24, "#6d7480")).join("")}
        <rect x="${g ? 60 : 66}" y="${g ? 34 : 38}" width="${g ? 80 : 68}" height="${g ? 52 : 44}" rx="14" fill="${c}"/>
        <rect x="86" y="${g ? 78 : 74}" width="28" height="18" rx="6" fill="${osc}"/><circle cx="${g ? 94 : 100}" cy="${g ? 87 : 83}" r="5" fill="#3b4a66"/>${g ? '<circle cx="106" cy="87" r="3.5" fill="#3b4a66"/>' : ""}`;
    }
    return `<svg viewBox="0 0 200 120" height="${h}" role="img" aria-label="Ilustración del ${d.marca} ${d.nombre}">${s}</svg>`;
  }

  /* ---------- Íconos de los tipos de control ---------- */
  const ICO = {
    control: '<rect x="3" y="7" width="18" height="10" rx="5"/><circle cx="8" cy="12" r="1.8"/><circle cx="16" cy="12" r="1.8"/>',
    pantalla: '<rect x="2" y="9" width="20" height="9" rx="4"/><rect x="7" y="3" width="10" height="7" rx="1"/>',
    app: '<rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1"/>',
    gestos: '<path d="M8 13V5a1.5 1.5 0 013 0v6m0-1V4a1.5 1.5 0 013 0v7m0-1V6a1.5 1.5 0 013 0v8c0 4-3 7-6.5 7S6 18 5 15l-1.5-3.5a1.5 1.5 0 012.7-1.3L8 13"/>',
    voz: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    reloj: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6V2h6v4M9 18v4h6v-4"/>',
    gafas: '<path d="M2 9h20v6a2 2 0 01-2 2h-4l-2-2-2 2H4a2 2 0 01-2-2z"/>',
    movimiento: '<path d="M10 22v-8l-3-3a2 2 0 013-3l2 2V4a2 2 0 014 0v9"/><path d="M18 3l3-1-1 3"/>',
    boton: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    beacon: '<rect x="6" y="5" width="12" height="14" rx="3"/><path d="M9 5V2h6v3M9 19v3h6v-3"/><circle cx="12" cy="12" r="2"/>',
    remoto: '<path d="M5 12a10 10 0 0114 0M8 15a6 6 0 018 0"/><circle cx="12" cy="18" r="1.5"/>'
  };
  const icono = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICO[k]}</svg>`;
  window.DR_DIBUJO = dibujo; window.DR_ICONO = icono;
  if (!raiz) return;

  /* ---------- Simulador de recorridos (vista isométrica, no a escala) ---------- */
  const TAU = Math.PI * 2;
  const RUTAS = {
    dronie: (t) => ({ d: [2 + 10 * t, 0, 1.6 + 7 * t] }),
    rocket: (t) => ({ d: [2, 0, 1.6 + 11 * t] }),
    circle: (t) => ({ d: [5 * Math.cos(TAU * t), 5 * Math.sin(TAU * t), 4] }),
    helix: (t) => ({ d: [(3 + 6 * t) * Math.cos(TAU * 1.25 * t), (3 + 6 * t) * Math.sin(TAU * 1.25 * t), 2 + 8 * t] }),
    boomerang: (t) => ({ d: [7 * Math.cos(TAU * t), 3.5 * Math.sin(TAU * t), 2 + 5 * Math.sin(Math.PI * t)] }),
    asteroid: (t) => { const a = Math.min(t / 0.7, 1); return { d: [2 + 8 * a, 0, 1.6 + 11 * a * a], gira: t > 0.7 }; },
    follow: (t) => { const s = [-7 + 14 * t, 3 * Math.sin(TAU * t * 0.8), 0]; return { s, d: [s[0] - 4, s[1] - 1.5, 4] }; },
    waypoints: (t) => {
      const P = [[-6, -5, 3], [-2, 5, 6], [5, 4, 4], [6, -5, 8], [-6, -5, 3]];
      const n = P.length - 1, k = Math.min(Math.floor(t * n), n - 1), u = t * n - k;
      return { d: P[k].map((v, i) => v + (P[k + 1][i] - v) * u), puntos: P.slice(0, -1) };
    },
    fpv: (t) => ({ d: [8 * Math.sin(TAU * t), 6 * Math.sin(2 * TAU * t), 4 + 3 * Math.cos(3 * TAU * t)] }),
    flip: (t) => { const a = TAU * t; return { d: [-6 + 12 * t + 1.5 * Math.sin(a), 0, 5 + 2.5 * (1 - Math.cos(a))] }; },
    freemotion: (t) => {
      const P = [[0, 0, 2], [6, -2, 5], [2, 6, 7], [-6, 3, 4]];
      const n = P.length - 1, k = Math.min(Math.floor(t * n), n - 1), u = t * n - k;
      return { d: P[k].map((v, i) => v + (P[k + 1][i] - v) * u), apunta: P[k + 1] };
    },
    zoomout: (t) => ({ d: [2 + 9 * t, 2 + 4 * t, 1.6 + 6 * t] }),
    birdseye: (t) => ({ d: [0.5, 0, 1.6 + 10 * t] }),
    dolly: (t) => { const s = [-7 + 12 * t, 0, 0]; return { s, d: [s[0] + 3, 0, 1.8] }; },
    orbitfollow: (t) => { const s = [-6 + 12 * t, 0, 0]; return { s, d: [s[0] + 4 * Math.cos(TAU * 1.5 * t), 4 * Math.sin(TAU * 1.5 * t), 3] }; },
    parallel: (t) => { const s = [-7 + 14 * t, 0, 0]; return { s, d: [s[0], -4, 3] }; },
    cruise: (t) => ({ d: [-8 + 16 * t, -3 + 6 * t, 5] }),
    mapeo: (t) => {
      const f = 5, k = Math.min(Math.floor(t * f), f - 1), u = t * f - k, y = -6 + k * 3;
      return { d: [k % 2 ? 6 - 12 * u : -6 + 12 * u, y, 4], area: true };
    },
    interior: (t) => {
      const P = [[-5, -4, 1.5], [5, -4, 1.5], [5, 4, 2], [-5, 4, 2], [-5, -4, 1.5]];
      const n = P.length - 1, k = Math.min(Math.floor(t * n), n - 1), u = t * n - k;
      return { d: P[k].map((v, i) => v + (P[k + 1][i] - v) * u), techo: true };
    }
  };
  const ESC = 12, CX = 230, CY = 222;
  const pr = ([x, y, z]) => [CX + (x - y) * 0.866 * ESC, CY + (x + y) * 0.5 * ESC - z * ESC];
  const pts = (a) => a.map((p) => pr(p).map((v) => v.toFixed(1)).join(",")).join(" ");

  function suelo(extra) {
    let g = "";
    for (let i = -8; i <= 8; i += 2) {
      g += `<polyline points="${pts([[i, -8, 0], [i, 8, 0]])}" class="dr-sim__grid"/><polyline points="${pts([[-8, i, 0], [8, i, 0]])}" class="dr-sim__grid"/>`;
    }
    if (extra === "techo") g += `<polygon points="${pts([[-6, -5, 3.2], [6, -5, 3.2], [6, 5, 3.2], [-6, 5, 3.2]])}" class="dr-sim__techo"/>`;
    if (extra === "area") g += `<polygon points="${pts([[-7, -7, 0], [7, -7, 0], [7, 7, 0], [-7, 7, 0]])}" class="dr-sim__area"/>`;
    return g;
  }
  const persona = ([x, y]) => { const [a, b] = pr([x, y, 0]); return `<g class="dr-sim__persona"><circle cx="${a}" cy="${b - 22}" r="5"/><path d="M${a} ${b - 17} v12 M${a - 6} ${b - 12} h12 M${a} ${b - 5} l-5 7 M${a} ${b - 5} l5 7"/></g>`; };

  function simulador(cont, d) {
    // Estilo de los videos de Tecnocríticos: trazo nítido con halo detrás, partículas que viajan por la ruta,
    // cámara que respira, el dron dibujado con hélices que giran y la descripción que aparece palabra por palabra.
    const rutas = d.recorridos.filter((r) => RUTAS[r]);
    cont.innerHTML = `<div class="dr-sim__btns" role="tablist">${rutas.map((r, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-ruta="${r}">${R[r][0]}</button>`).join("")}</div>
      <div class="dr-sim__lienzo"><span class="dr-sim__kick"></span><p class="dr-sim__desc" aria-live="polite"></p>
      <svg viewBox="0 0 460 320" class="dr-sim__svg" aria-hidden="true"></svg><span class="dr-sim__nota">Recorrido simulado · no está a escala</span></div>`;
    const svg = cont.querySelector("svg"), desc = cont.querySelector(".dr-sim__desc"), kick = cont.querySelector(".dr-sim__kick");
    let ruta = rutas[0], t0 = performance.now(), anim = 0, palabras = [];
    const T = 5600, PAUSA = 1400;
    const suave = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
    const DEFS = `<defs><radialGradient id="sim-halo"><stop offset="0" stop-color="#7FD1B0" stop-opacity=".55"/><stop offset="1" stop-color="#7FD1B0" stop-opacity="0"/></radialGradient>
      <radialGradient id="sim-suelo"><stop offset="0" stop-color="#7FD1B0" stop-opacity=".12"/><stop offset="1" stop-color="#7FD1B0" stop-opacity="0"/></radialGradient>
      <radialGradient id="sim-ambar"><stop offset="0" stop-color="#f0c36b" stop-opacity=".5"/><stop offset="1" stop-color="#f0c36b" stop-opacity="0"/></radialGradient></defs>`;
    const dron = (x, y, now, gira) => {
      const g = (now / 30) % 360;
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})${gira ? ` rotate(${(now / 4) % 360})` : ""}">
        <circle r="26" fill="url(#sim-halo)"/>
        <path d="M-11 -7 L11 7 M-11 7 L11 -7" stroke="#e8e8e4" stroke-width="3" stroke-linecap="round"/>
        ${[[-11, -7], [11, -7], [-11, 7], [11, 7]].map(([a, b], i) => `<g transform="translate(${a} ${b}) rotate(${g + i * 45})"><ellipse rx="7" ry="1.8" fill="#fff" opacity=".85"/></g>`).join("")}
        <rect x="-5" y="-4" width="10" height="8" rx="3" fill="#00875A" stroke="#fff" stroke-width="1.5"/></g>`;
    };
    const dibujar = (now) => {
      const ciclo = Math.max(0, now - t0) % (T + PAUSA), t = ciclo / T, tt = Math.min(t, 1), f = RUTAS[ruta];
      const entra = suave(ciclo / 500), sale = 1 - suave((ciclo - T - PAUSA + 450) / 450);
      const traza = []; for (let i = 0; i <= 70; i++) traza.push(f((i / 70) * tt).d);
      const plan = []; for (let i = 0; i <= 70; i++) plan.push(f(i / 70).d);
      const r = f(tt), pd = pr(r.d), pb = pr([r.d[0], r.d[1], 0]);
      const sujeto = r.s || (["mapeo", "interior", "cruise", "waypoints", "fpv", "flip"].includes(ruta) ? null : [0, 0]);
      const zoom = 1 + 0.025 * Math.sin(now / 1400), dx = 6 * Math.sin(now / 2300);
      let h = DEFS + `<g transform="translate(${230 + dx} 200) scale(${zoom}) translate(-230 -200)" opacity="${entra * sale}">`;
      h += `<ellipse cx="${CX}" cy="${CY}" rx="210" ry="120" fill="url(#sim-suelo)"/>` + suelo(r.techo ? "techo" : r.area ? "area" : "");
      // Ruta prevista, tenue; la recorrida, con halo detrás y trazo nítido encima.
      h += `<polyline points="${pts(plan)}" class="dr-sim__plan"/>`;
      if (r.s) { const sp = []; for (let i = 0; i <= 40; i++) sp.push(f((i / 40) * tt).s); h += `<polyline points="${pts(sp)}" class="dr-sim__sujeto"/>`; }
      if (r.puntos) h += r.puntos.map((q, i) => { const [a, b] = pr(q); return `<circle cx="${a}" cy="${b}" r="6" class="dr-sim__wp"/><text x="${a + 9}" y="${b - 7}" class="dr-sim__wpn">${i + 1}</text>`; }).join("");
      h += `<polyline points="${pts(traza)}" class="dr-sim__halo"/><polyline points="${pts(traza)}" class="dr-sim__ruta"/>`;
      // Partículas de luz que viajan por el tramo recorrido.
      for (let i = 0; i < 4; i++) { const u = ((now / 1600 + i / 4) % 1) * tt, q = pr(f(u).d);
        h += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="2.6" fill="#fff" opacity="${(Math.sin(((now / 1600 + i / 4) % 1) * Math.PI) * 0.9).toFixed(2)}"/>`; }
      const p0 = pr(f(0).d); h += `<circle cx="${p0[0]}" cy="${p0[1]}" r="4" fill="none" stroke="#7FD1B0" stroke-width="1.5" opacity=".7"/>`;
      h += `<line x1="${pd[0]}" y1="${pd[1]}" x2="${pb[0]}" y2="${pb[1]}" class="dr-sim__alt"/><ellipse cx="${pb[0]}" cy="${pb[1]}" rx="10" ry="4" class="dr-sim__sombra"/>`;
      if (sujeto) { const [a, b] = pr([sujeto[0], sujeto[1], 0]); h += `<ellipse cx="${a}" cy="${b - 14}" rx="22" ry="22" fill="url(#sim-ambar)"/>` + persona(sujeto); }
      if (sujeto && !["rocket", "birdseye"].includes(ruta)) { const ps = pr([sujeto[0], sujeto[1], 1.2]); h += `<line x1="${pd[0]}" y1="${pd[1]}" x2="${ps[0]}" y2="${ps[1]}" class="dr-sim__mira"/>`; }
      if (r.apunta) { const pa = pr(r.apunta), pm = pr([0, 0, 1.4]); h += `<line x1="${pm[0]}" y1="${pm[1]}" x2="${pa[0]}" y2="${pa[1]}" class="dr-sim__apunta"/><circle cx="${pa[0]}" cy="${pa[1]}" r="5" fill="#f0c36b"/>` + persona([0, 0]); }
      h += dron(pd[0], pd[1], now, r.gira) + `</g>`;
      svg.innerHTML = h;
      // Descripción palabra por palabra, como los subtítulos de los videos.
      palabras.forEach((el, i) => { const a = suave((ciclo - 250 - i * 70) / 220); el.style.opacity = String(0.15 + 0.85 * a); el.style.transform = `translateY(${(1 - a) * 6}px)`; });
      anim = requestAnimationFrame(dibujar);
    };
    const elegir = (r) => {
      ruta = r; t0 = performance.now();
      kick.textContent = `Recorrido · ${R[r][0]}`;
      desc.innerHTML = R[r][1].split(" ").map((w) => `<span>${w}</span>`).join(" ");
      palabras = [...desc.querySelectorAll("span")];
      cont.querySelectorAll("[data-ruta]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.ruta === r)));
    };
    cont.querySelector(".dr-sim__btns").addEventListener("click", (e) => { const b = e.target.closest("[data-ruta]"); if (b) elegir(b.dataset.ruta); });
    elegir(ruta);
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { dibujar(t0 + T); cancelAnimationFrame(anim); }
    else anim = requestAnimationFrame(dibujar);
    return () => cancelAnimationFrame(anim);
  }

  /* ---------- Gráficas del panorama ---------- */
  const barras = (campo, fmt, max, unidad) => `<div class="dr-barras">${[...D].sort((a, b) => b[campo] - a[campo]).map((d) =>
    `<a class="dr-barra" href="#${d.id}"><span class="dr-barra__n">${d.marca} <b>${d.nombre}</b></span><span class="dr-barra__p"><i style="--v:${(d[campo] / max * 100).toFixed(1)}%"></i></span><span class="dr-barra__v">${fmt(d)} <small>${unidad}</small></span></a>`).join("")}</div>`;

  const montana = () => {
    const H = 300, max = 6500, y = (m) => H - (m / max) * (H - 20);
    const refs = [[2640, "Bogotá (2.640 m)"], [5321, "Nevado del Ruiz (5.321 m)"]];
    const w = 100 / D.length;
    return `<svg viewBox="0 0 1000 ${H + 70}" class="dr-mont" role="img" aria-label="Altura máxima de despegue de cada dron sobre el nivel del mar">
      <path d="M0 ${H} L180 ${y(2400)} L300 ${y(1900)} L470 ${y(5321)} L560 ${y(4200)} L700 ${y(3000)} L860 ${y(2640)} L1000 ${y(2300)} L1000 ${H}Z" class="dr-mont__cerro"/>
      ${refs.map(([m, t]) => `<line x1="0" x2="1000" y1="${y(m)}" y2="${y(m)}" class="dr-mont__ref"/><text x="8" y="${y(m) - 6}" class="dr-mont__reft">${t}</text>`).join("")}
      ${D.map((d, i) => { const x = (i + 0.5) * w * 10; return `<a href="#${d.id}"><line x1="${x}" x2="${x}" y1="${H}" y2="${y(d.techo)}" class="dr-mont__palo"/><circle cx="${x}" cy="${y(d.techo)}" r="9" class="dr-mont__punto"/>
        <text x="${x}" y="${y(d.techo) - 16}" class="dr-mont__val">${mil(d.techo)}</text><text x="${x}" y="${H + 24}" class="dr-mont__nom">${d.nombre}</text><text x="${x}" y="${H + 44}" class="dr-mont__mar">${d.marca}</text></a>`; }).join("")}
    </svg>`;
  };

  const legal = () => `<div class="dr-legal">
    <svg viewBox="0 0 420 300" role="img" aria-label="Límite legal de 122 metros de altura en Colombia">
      <line x1="40" x2="400" y1="270" y2="270" class="dr-legal__suelo"/>
      <rect x="70" y="${270 - 122 * 1.9}" width="70" height="${122 * 1.9}" class="dr-legal__edif"/>
      ${Array.from({ length: 13 }, (_, i) => `<line x1="76" x2="134" y1="${270 - (i + 1) * 17.8}" y2="${270 - (i + 1) * 17.8}" class="dr-legal__piso"/>`).join("")}
      <line x1="40" x2="400" y1="${270 - 122 * 1.9}" y2="${270 - 122 * 1.9}" class="dr-legal__tope"/>
      <text x="400" y="${270 - 122 * 1.9 - 10}" text-anchor="end" class="dr-legal__t">122 m (400 pies) sobre el terreno</text>
      <g transform="translate(300 ${270 - 122 * 1.9 + 26})"><circle r="10" class="dr-sim__dron"/><path d="M-14 -6h9M5 -6h9M-14 6h9M5 6h9" class="dr-sim__helices"/></g>
      <text x="105" y="292" text-anchor="middle" class="dr-legal__s">≈ edificio de 40 pisos</text>
      <line x1="180" x2="400" y1="258" y2="258" class="dr-legal__vlos"/><text x="400" y="248" text-anchor="end" class="dr-legal__s">hasta 750 m de distancia, siempre a la vista</text>
    </svg></div>`;

  const matriz = () => {
    const tipos = Object.keys(C);
    return `<div class="dr-matriz" role="table" aria-label="Tipos de control de cada dron"><div class="dr-matriz__fila dr-matriz__cab" role="row"><span role="columnheader"></span>${tipos.map((k) => `<span role="columnheader" title="${C[k][0]}">${icono(k)}<small>${C[k][0]}</small></span>`).join("")}</div>
      ${D.map((d) => `<a class="dr-matriz__fila" role="row" href="#${d.id}"><span role="rowheader">${d.marca} <b>${d.nombre}</b></span>${tipos.map((k) => `<span role="cell">${d.controles.includes(k) ? '<i class="si" aria-label="sí"></i>' : '<i aria-label="no"></i>'}</span>`).join("")}</a>`).join("")}</div>`;
  };

  const balanza = () => {
    const max = 2200, x = (g) => 20 + Math.log10(g / 100) / Math.log10(max / 100) * 940;
    return `<svg viewBox="0 0 1000 200" class="dr-peso" role="img" aria-label="Peso de cada dron frente al umbral de registro de 200 gramos">
      <rect x="20" y="96" width="${x(200) - 20}" height="12" class="dr-peso__libre"/><rect x="${x(200)}" y="96" width="${960 - x(200)}" height="12" class="dr-peso__reg"/>
      <line x1="${x(200)}" x2="${x(200)}" y1="30" y2="140" class="dr-peso__umbral"/><text x="${x(200)}" y="22" text-anchor="middle" class="dr-peso__ut">200 g: desde aquí hay que registrarlo</text>
      ${(() => {
        // Agrupa los drones de peso casi igual (por ejemplo, los cuatro de unos 249 g) para que los nombres no se monten.
        const grupos = [];
        [...D].sort((a, b) => a.peso - b.peso).forEach((d) => { const g = grupos[grupos.length - 1]; if (g && x(d.peso) - x(g[0].peso) < 14) g.push(d); else grupos.push([d]); });
        return grupos.map((g, i) => { const px = x(g[0].peso), arriba = i % 2, d = g[0];
          const aprox = d.peso < 1000 ? `≈ ${Math.round(d.peso)} g` : `≈ ${String((d.peso / 1000).toFixed(1)).replace(".", ",")} kg`;
          const nom = g.length > 2 ? `${g.length} drones` : g.map((e) => e.nombre).join(" y "), gr = g.length > 1 ? aprox : gramos(d);
          return `${g.map((e) => `<a href="#${e.id}"><circle cx="${x(e.peso)}" cy="102" r="8" class="${registro(e) ? "dr-peso__p" : "dr-peso__p dr-peso__p--libre"}"/></a>`).join("")}
          <text x="${px}" y="${arriba ? 80 : 134}" text-anchor="middle" class="dr-peso__n">${nom}</text><text x="${px}" y="${arriba ? 64 : 150}" text-anchor="middle" class="dr-peso__g">${gr}</text>`; }).join("");
      })()}
      <text x="20" y="190" class="dr-peso__eje">escala logarítmica · 100 g</text><text x="960" y="190" text-anchor="end" class="dr-peso__eje">2,2 kg</text>
    </svg>
    <div class="dr-peso__ley"><div><b class="ok">Sin registro (menos de 200 g)</b>${D.filter((d) => !registro(d)).map((d) => `<a href="#${d.id}">${d.marca} ${d.nombre} · ${gramos(d)}</a>`).join("")}</div>
    <div><b class="ojo">Con registro obligatorio</b>${[...D].filter(registro).sort((a, b) => a.peso - b.peso).map((d) => `<a href="#${d.id}">${d.marca} ${d.nombre} · ${gramos(d)}</a>`).join("")}</div></div>`;
  };

  const CONCEPTOS = [
    ["VLOS", "Línea de vista visual: tienes que ver el dron con tus propios ojos todo el tiempo, sin binoculares."],
    ["FPV", "Vista en primera persona: vuelas con gafas que muestran lo que ve la cámara. En Colombia exige un observador."],
    ["Altura de despegue", "Hasta qué altitud sobre el nivel del mar puede despegar (por el aire más delgado). No es cuánto puede subir."],
    ["Zonas GEO", "Áreas donde el dron no vuela, como aeropuertos. Muchos fabricantes las cargan en el software."],
    ["RTH", "Regreso a casa: vuelve solo al punto de despegue si se pierde la señal o se agota la batería."],
    ["LiDAR", "Sensor láser que mide distancias para detectar obstáculos, también con poca luz."],
    ["Seguimiento", "El dron reconoce a una persona o un vehículo y lo sigue (ActiveTrack, AI Follow…)."],
    ["QuickShots", "Movimientos de cámara automáticos de un toque: Dronie, Rocket, Circle, Helix…"],
    ["Cine / Normal / Sport", "Modos de velocidad: Cine es lento y suave para grabar; Sport es el más rápido."],
    ["Clase C0 / C1", "Etiquetas europeas por peso y riesgo. C0 es menos de 250 g."],
    ["NDAA", "Norma de seguridad de EE. UU. que exigen los organismos públicos a sus drones."],
    ["Techo de servicio", "Altitud máxima a la que el fabricante garantiza que el dron opera."]
  ];

  const REGLAS = [
    ["122 m", "Altura máxima sobre el terreno (400 pies) en la categoría abierta."],
    ["750 m", "Distancia horizontal máxima, siempre con el dron a la vista."],
    ["30 m", "Distancia mínima a personas que no participan en el vuelo."],
    ["200 g", "Desde este peso, el registro en la Plataforma UAS de la Aerocivil es obligatorio. Es gratis."],
    ["9 km", "Prohibido volar a menos de 9 km de un aeropuerto; entre 6 y 9 km se permite hasta 61 m de altura."],
    ["2 km", "Prohibido cerca de bases militares o de policía, cárceles, infraestructura crítica y del Presidente."],
    ["FPV", "Si vuelas con gafas, necesitas un observador que mantenga el dron a la vista."],
    ["Sin lucro", "La categoría abierta es solo recreativa: para trabajar con el dron se necesita licencia y permiso."]
  ];

  function panorama() {
    return `<section class="dr-vista" data-vista="panorama">
      <div class="dr-bloque"><h3><span>01</span> Velocidad máxima</h3><p class="dr-sub">Velocidad horizontal según cada fabricante, en km/h.</p>${barras("vel", (d) => kmh(d.vel), 25, "km/h")}</div>
      <div class="dr-bloque"><h3><span>02</span> ¿Hasta dónde pueden subir?</h3><p class="dr-sub">Altura máxima de <b>despegue</b> sobre el nivel del mar: dice desde qué altitud pueden volar, por ejemplo en el páramo. No es la altura a la que se pueden elevar.</p>${montana()}
        <div class="dr-dos"><div><h4>Pero la ley pone el techo</h4><p>En Colombia, ningún dron recreativo puede subir más de <b>122 metros</b> sobre el terreno, sin importar de qué sea capaz.</p></div>${legal()}</div></div>
      <div class="dr-bloque"><h3><span>03</span> Autonomía</h3><p class="dr-sub">Minutos de vuelo con la batería estándar, en condiciones ideales.</p>${barras("min", (d) => d.min, 51, "min")}</div>
      <div class="dr-bloque"><h3><span>04</span> Cómo se controla cada uno</h3><p class="dr-sub">Del control clásico con joysticks a volar con gafas, con la voz o señalando con la mano.</p>${matriz()}</div>
      <div class="dr-bloque"><h3><span>05</span> Peso y registro en Colombia</h3><p class="dr-sub">El peso decide si hay que registrar el dron ante la Aerocivil.</p>${balanza()}</div>
      <div class="dr-bloque dr-bloque--reglas"><h3><span>06</span> Las reglas para volar en Colombia</h3><p class="dr-sub">Categoría abierta (uso recreativo), según el RAC 100 de la Aerocivil.</p>
        <div class="dr-reglas">${REGLAS.map(([n, t]) => `<div><b>${n}</b><p>${t}</p></div>`).join("")}</div>
        <p class="dr-afuera"><b>Y en EE. UU.:</b> desde diciembre de 2025, la FCC no autoriza modelos nuevos de DJI ni de Autel. Los que ya estaban aprobados se pueden seguir usando. Esa restricción no aplica en Colombia.</p></div>
      <div class="dr-bloque"><h3><span>07</span> Conceptos clave</h3><dl class="dr-conceptos">${CONCEPTOS.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl></div>
    </section>`;
  }

  function ficha(d, i) {
    const ant = D[(i + D.length - 1) % D.length], sig = D[(i + 1) % D.length];
    const posTecho = [...D].sort((a, b) => b.techo - a.techo).findIndex((x) => x.id === d.id) + 1;
    return `<section class="dr-vista dr-ficha" data-vista="${d.id}">
      <div class="dr-ficha__cab">
        <div class="dr-ficha__img">${dibujo(d, 150)}</div>
        <div><span class="dr-ficha__n">${String(i + 1).padStart(2, "0")} / 10 · ${d.marca}</span><h3>${d.marca} ${d.nombre}</h3><p>${d.perfil}</p></div>
      </div>
      <div class="dr-datos">
        <div><span>Velocidad máxima</span><b>${kmh(d.vel)} <small>km/h</small></b><em>${d.velNota}</em></div>
        <div><span>Autonomía</span><b>${d.min} <small>min</small></b><em>${d.minNota || "con la batería estándar"}</em></div>
        <div><span>Peso</span><b>${gramos(d)}</b><em>${registro(d) ? "Hay que registrarlo en Colombia" : "No requiere registro recreativo"}</em></div>
        <div><span>Altura de despegue</span><b>${mil(d.techo)} <small>m</small></b><em>${d.techoTxt || "sobre el nivel del mar"} · puesto ${posTecho} de 10</em></div>
      </div>
      <div class="dr-ficha__rej">
        <div class="dr-bloque dr-bloque--sim"><h4>Recorridos de vuelo</h4><div class="dr-sim" data-sim="${d.id}"></div></div>
        <div class="dr-bloque"><h4>Altura: capacidad frente a la ley</h4>
          <div class="dr-alt"><div class="dr-alt__col"><i style="--h:${(d.techo / 6000 * 100).toFixed(1)}%"></i><b>${mil(d.techo)} m</b><span>puede despegar a esta altitud</span></div>
          <div class="dr-alt__col dr-alt__col--ley"><i style="--h:${(LEGAL / 6000 * 100 * 8).toFixed(1)}%"></i><b>122 m</b><span>máximo sobre el terreno en Colombia</span></div></div>
          <p class="dr-nota">La barra de los 122 m está ampliada 8 veces para que se vea.</p></div>
      </div>
      <div class="dr-ficha__rej">
        <div class="dr-bloque"><h4>Cómo se controla</h4><ul class="dr-ctrl">${d.controles.map((k) => `<li>${icono(k)}<span><b>${C[k][0]}</b>${C[k][1]}</span></li>`).join("")}</ul><p class="dr-txt">${d.controlesTxt}</p></div>
        <div class="dr-bloque"><h4>Modos de vuelo</h4><ul class="dr-modos">${d.modos.map((m) => `<li>${m}</li>`).join("")}</ul>
          <h4 class="dr-mt">Sensores</h4><p class="dr-txt">${d.sensores}</p></div>
      </div>
      <div class="dr-ficha__rej">
        <div class="dr-bloque dr-bloque--col"><h4>En Colombia</h4><ul class="dr-col">
          <li class="${registro(d) ? "ojo" : "ok"}">${registro(d) ? "Pesa 200 g o más: regístralo en la Plataforma UAS de la Aerocivil antes de volar." : "Pesa menos de 200 g: para uso recreativo no necesita registro."}</li>
          <li>Máximo 122 m de altura y 750 m de distancia, siempre a la vista.</li>
          ${d.controles.includes("gafas") ? "<li class=\"ojo\">Si vuelas con gafas (FPV), lleva un observador que vea el dron.</li>" : ""}
          ${d.tipo === "empresa" ? "<li class=\"ojo\">Es un equipo profesional: su uso comercial exige licencia de piloto y permiso de vuelo.</li>" : ""}
        </ul></div>
        <div class="dr-bloque dr-bloque--clave"><h4>Dato clave</h4><p>${d.clave}</p><p class="dr-fuente">Fuente: <a href="${d.fuente[1]}" target="_blank" rel="noopener">${d.fuente[0]}</a></p></div>
      </div>
      <nav class="dr-pasos" aria-label="Cambiar de dron"><a href="#${ant.id}">← ${ant.marca} ${ant.nombre}</a><a href="#panorama">Panorama</a><a href="#${sig.id}">${sig.marca} ${sig.nombre} →</a></nav>
    </section>`;
  }

  /* ---------- Armado y navegación ---------- */
  // Las páginas del sitio usan <base href="/">: los enlaces #ancla deben llevar la ruta de esta página.
  const aqui = location.pathname;
  raiz.innerHTML = (`<nav class="dr-nav" aria-label="Navegación de la infografía"><div class="dr-nav__carril">
      <a href="#panorama" data-ir="panorama"><span class="dr-nav__ico">▦</span>Panorama</a>
      ${D.map((d, i) => `<a href="#${d.id}" data-ir="${d.id}">${dibujo(d, 26)}<span><small>${d.marca}</small>${d.nombre}</span></a>`).join("")}
    </div></nav>
    <div class="dr-vistas">${panorama()}${D.map(ficha).join("")}</div>`).replace(/href="#/g, `href="${aqui}#`);

  let parar = null;
  const ir = (id, desplazar) => {
    if (!raiz.querySelector(`[data-vista="${id}"]`)) id = "panorama";
    raiz.querySelectorAll("[data-vista]").forEach((v) => { v.hidden = v.dataset.vista !== id; });
    raiz.querySelectorAll("[data-ir]").forEach((a) => { if (a.dataset.ir === id) { a.setAttribute("aria-current", "page");
      // Centra el dron activo moviendo solo la barra de lado (sin desplazar la página).
      const car = a.parentElement; car.scrollTo({ left: a.offsetLeft - (car.clientWidth - a.offsetWidth) / 2, behavior: "smooth" }); } else a.removeAttribute("aria-current"); });
    if (parar) { parar(); parar = null; }
    const d = D.find((x) => x.id === id);
    if (d) parar = simulador(raiz.querySelector(`[data-sim="${id}"]`), d);
    raiz.querySelectorAll(`[data-vista="${id}"] .dr-barra__p i, [data-vista="${id}"] .dr-alt i`).forEach((el) => { el.classList.remove("ve"); void el.offsetWidth; el.classList.add("ve"); });
    // Las cifras cuentan hasta su valor al aparecer, como en los videos.
    raiz.querySelectorAll(`[data-vista="${id}"] .dr-datos b, [data-vista="${id}"] .dr-barra__v, [data-vista="${id}"] .dr-alt__col b`).forEach((el) => {
      const nodo = el.firstChild; if (!nodo || nodo.nodeType !== 3) return;
      if (!el.dataset.final) el.dataset.final = nodo.textContent;
      const txt = el.dataset.final, m = txt.match(/[\d.,]+/); if (!m) return;
      const num = parseFloat(m[0].replace(/\./g, "").replace(",", ".")), dec = (m[0].split(",")[1] || "").length, ini = performance.now();
      const paso = (now) => { const k = Math.min((now - ini) / 900, 1), e = 1 - Math.pow(1 - k, 3);
        const v = (num * e).toFixed(dec).replace(".", ","), con = v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        nodo.textContent = txt.replace(m[0], k < 1 ? (dec ? v : con) : m[0]); if (k < 1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    });
    if (desplazar) raiz.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const desdeAncla = (desplazar) => ir(decodeURIComponent(location.hash.slice(1)) || "panorama", desplazar);
  window.addEventListener("hashchange", () => desdeAncla(true));
  desdeAncla(false);
})();
