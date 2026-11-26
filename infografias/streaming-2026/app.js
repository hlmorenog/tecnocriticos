/* Infografía interactiva «Las plataformas de streaming que mandan». Navegación por #ancla: #panorama o #<id>.
   Usa los estilos de la infografía de drones (dr-*) y los suyos (st-*). */
(() => {
  const raiz = document.getElementById("st-app");
  if (!raiz || !window.PLATAFORMAS) return;
  const P = window.PLATAFORMAS, porId = Object.fromEntries(P.map((p) => [p.id, p]));
  const num = (n) => String(n).replace(".", ",");
  const marca = (p, tam = "") => `<span class="st-marca${tam}" style="--c:${p.color}">${p.nombre}</span>`;
  const muestra = (c) => c === "negro-color" ? "linear-gradient(120deg,#ff5f6d,#f5a623,#2fb383,#3d8bff,#8a5cff) center / 62% 34% no-repeat, #111" : c;  // fondo negro con el degradado del logo de 2025

  /* ---------- Panorama ---------- */
  const mundo = () => {
    const con = P.filter((p) => p.subs).sort((a, b) => b.subs - a.subs), sin = P.filter((p) => !p.subs);
    return `<div class="dr-barras">${con.map((p) => `<a class="dr-barra" href="#${p.id}"><span class="dr-barra__n">${marca(p)}</span><span class="dr-barra__p"><i style="--v:${(p.subs / 325 * 100).toFixed(1)}%;background:${p.color}"></i></span><span class="dr-barra__v">${num(p.subs)} <small>M</small></span></a>`).join("")}
      ${sin.map((p) => `<a class="dr-barra st-sin" href="#${p.id}"><span class="dr-barra__n">${marca(p)}</span><span class="st-nopub">${p.subsTxt}: ${p.subsFecha}</span><span></span></a>`).join("")}</div>
      <p class="dr-nota">Último dato oficial de cada empresa. Netflix: fin de 2025 · Disney+: septiembre de 2025 · HBO Max: fin de 2025 · Paramount+: septiembre de 2026. Disney y Warner dejaron de reportar suscriptores, y Skydance dejará de hacerlo cada trimestre.</p>
      <div class="st-fusion"><b>203 <small>millones</small></b><p><strong>HBO, HBO Max y Paramount+ juntos.</strong> Desde el 6 de octubre de 2026 tienen el mismo dueño: Skydance, la antigua Paramount, que compró Warner Bros. Discovery. En 2027 se venderán en un paquete.</p></div>`;
  };

  const DONA = [["netflix", 20], ["disney-plus", 20], ["prime-video", 19], ["hbo-max", 12], ["apple-tv", 8], ["paramount-plus", 7], ["otras", 14]];
  const dona = () => {
    const R = 120, C = 2 * Math.PI * R; let acc = 0;
    const arcos = DONA.map(([id, v], i) => { const p = porId[id], col = p ? p.color : "#D6D6D0", lon = v / 100 * C, ini = acc; acc += lon;
      return `<circle r="${R}" cx="160" cy="160" fill="none" stroke="${col}" stroke-width="56" stroke-dasharray="${lon - 3} ${C}" stroke-dashoffset="${-ini}" transform="rotate(-90 160 160)" class="st-arco" style="--d:${i * 0.12}s;--lon:${lon}"/>`; }).join("");
    const ley = DONA.map(([id, v]) => { const p = porId[id]; return `<li>${p ? `<a href="#${id}">${marca(p)}</a>` : `<span class="st-otras">Otras</span>`}<b>${v} %</b></li>`; }).join("");
    return `<div class="st-dona"><svg viewBox="0 0 320 320" role="img" aria-label="Cuota de mercado del streaming en Colombia, tercer trimestre de 2025">${arcos}
        <text x="160" y="152" text-anchor="middle" class="st-dona__t">Colombia</text><text x="160" y="182" text-anchor="middle" class="st-dona__s">3.er trimestre de 2025</text></svg>
      <ul class="st-ley">${ley}</ul></div>
      <p class="dr-nota">«Otras»: Mubi 3 %, ViX 2 %, Claro Video 2 % y plataformas locales 7 %. JustWatch mide la actividad de sus usuarios en Colombia, no suscriptores.</p>
      <div class="st-nuevo"><span class="dr-portada__k">Primer semestre de 2026</span><div>
        <a href="#netflix">${marca(porId.netflix)} <b>20 %</b><small>sigue líder</small></a>
        <a href="#apple-tv">${marca(porId["apple-tv"])} <b>12 % ↑</b><small>la que más crece: +4 puntos en un año</small></a>
        <a href="#hbo-max">${marca(porId["hbo-max"])} <b>12 % ↓</b><small>la que más cae: −2 puntos</small></a>
        <span><span class="st-marca" style="--c:#F47521">Crunchyroll</span> <b>4 %</b><small>entra por primera vez al ranking</small></span></div></div>`;
  };

  const lineaTiempo = () => {
    const x = (a) => 30 + (a - 1996) / (2027 - 1996) * 940, filas = [...P].sort((a, b) => a.nace - b.nace);
    const ejes = [2000, 2005, 2010, 2015, 2020, 2025].map((a) => `<line x1="${x(a)}" x2="${x(a)}" y1="20" y2="${40 + filas.length * 56}" class="st-eje"/><text x="${x(a)}" y="14" text-anchor="middle" class="st-ejet">${a}</text>`).join("");
    const nac = filas.map((p, i) => { const y = 50 + i * 56, desde = p.id === "netflix" ? 1997 : p.nace, hoy = x(2026.9);
      return `<a href="#${p.id}"><line x1="${x(desde)}" x2="${hoy}" y1="${y}" y2="${y}" stroke="${p.color === "#111111" ? "#3a3a3a" : p.color}" class="st-vida" style="--d:${i * 0.15}s;--l:${hoy - x(desde)}"/>
        <circle cx="${x(desde)}" cy="${y}" r="7" fill="#fff" stroke="${p.color}" stroke-width="3"/>
        <circle cx="${x(p.latamAnio + 0.5)}" cy="${y}" r="11" fill="${p.color}" class="st-llega" style="--d:${0.6 + i * 0.15}s"/>
        <text x="${x(desde) - 12}" y="${y + 5}" text-anchor="end" class="st-vidat">${p.nombre}</text>
        <circle r="4" fill="#fff"><animateMotion dur="${3 + i * 0.4}s" repeatCount="indefinite" path="M${x(desde)} ${y} L${hoy} ${y}"/></circle></a>`; }).join("");
    return `<svg viewBox="0 0 1000 ${60 + filas.length * 56}" class="st-tiempo" role="img" aria-label="Año de nacimiento de cada plataforma y llegada a Latinoamérica">${ejes}${nac}</svg>
      <p class="dr-nota"><span class="st-pt st-pt--b"></span> Nacimiento &nbsp; <span class="st-pt"></span> Llegada a Latinoamérica. Netflix nació en 1997 con DVD por correo; su streaming empezó en 2007.</p>`;
  };

  const colores = () => `<div class="st-colores">${P.map((p, i) => `<a class="st-col" href="#${p.id}"><span class="st-col__n">${marca(p)}</span><span class="st-col__fila">${p.colores.map(([a, c], j) => `<span class="st-sw" style="--bg:${muestra(c)};--d:${(i * 0.1 + j * 0.25).toFixed(2)}s"><small>${a}</small></span>`).join('<i class="st-flecha">→</i>')}</span></a>`).join("")}</div>`;

  const premios = () => `<div class="st-dos">
      <div><h4>Emmy 2026 · premios por plataforma</h4><div class="dr-barras">${window.EMMY26.map(([id, n]) => { const p = porId[id];
        return `<a class="dr-barra" href="#${id}"><span class="dr-barra__n">${marca(p)}</span><span class="dr-barra__p"><i style="--v:${(n / 28 * 100).toFixed(1)}%;background:${p.color}"></i></span><span class="dr-barra__v">${n}</span></a>`; }).join("")}</div>
        <p class="dr-nota">Incluye las categorías de Artes Creativas. Disney suma todas sus marcas. Fuente: Gold Derby.</p></div>
      <div><h4>Óscar 2026</h4><ul class="st-oscar"><li>${marca(porId.netflix)}<b>7</b><span>igualó su récord</span></li><li>${marca(porId["apple-tv"])}<b>1</b><span>mejor sonido, por «F1»</span></li></ul>
        <h4 class="dr-mt">Hitos de la historia</h4><ul class="st-hitos">
          <li><b>2017</b> Amazon es el primer streaming con una película nominada a mejor película: «Manchester by the Sea».</li>
          <li><b>2022</b> Apple gana el primer Óscar a mejor película de un streaming: «CODA».</li>
          <li><b>2026</b> Apple TV gana más Emmy que nadie: 28, 14 para «Widow's Bay».</li></ul></div></div>`;

  const contenido = () => `<div class="st-cont">${P.map((p) => `<a class="st-cont__f" href="#${p.id}"><span>${marca(p)}</span><span class="dr-modos">${p.contenido.map((c) => `<li>${c}</li>`).join("")}</span></a>`).join("")}</div>`;

  const panorama = () => `<section class="dr-vista" data-vista="panorama">
    <div class="dr-bloque"><h3><span>01</span> Suscriptores en el mundo</h3><p class="dr-sub">Millones de suscripciones pagas, según el último dato oficial de cada empresa.</p>${mundo()}</div>
    <div class="dr-bloque"><h3><span>02</span> ¿Qué se ve en Colombia?</h3><p class="dr-sub">Cuota de mercado del streaming por suscripción, según JustWatch. No hay cifras oficiales de suscriptores por país.</p>${dona()}</div>
    <div class="dr-bloque"><h3><span>03</span> Latinoamérica</h3><p class="dr-sub">Solo Netflix ha publicado sus suscriptores en la región.</p>
      <div class="st-latam"><b>53,3 <small>millones</small></b><p>suscripciones de ${marca(porId.netflix)} en Latinoamérica al cierre de 2024, su último dato regional. Las demás plataformas no publican cifras por región.</p></div></div>
    <div class="dr-bloque"><h3><span>04</span> Cuándo nacieron y cuándo llegaron</h3><p class="dr-sub">Netflix lleva casi 15 años en la región; Disney+, HBO Max y Paramount+, cinco o menos.</p>${lineaTiempo()}</div>
    <div class="dr-bloque"><h3><span>05</span> Sus cambios de color</h3><p class="dr-sub">HBO Max cambió tres veces en cinco años; Netflix nunca soltó el rojo.</p>${colores()}</div>
    <div class="dr-bloque"><h3><span>06</span> Premios</h3><p class="dr-sub">2026 fue el año de Apple TV en los Emmy y de Netflix en los Óscar.</p>${premios()}</div>
    <div class="dr-bloque"><h3><span>07</span> Qué hay en cada una</h3><p class="dr-sub">Toca una plataforma para ver su ficha completa.</p>${contenido()}</div>
  </section>`;

  /* ---------- Ficha de cada plataforma ---------- */
  function ficha(p, i) {
    const ant = P[(i + P.length - 1) % P.length], sig = P[(i + 1) % P.length];
    return `<section class="dr-vista dr-ficha" data-vista="${p.id}">
      <div class="st-cab" style="--c:${p.color}"><div><span class="dr-ficha__n">${String(i + 1).padStart(2, "0")} / ${P.length} · ${p.dueno}</span>${marca(p, " st-marca--xl")}</div>
        <div class="st-cab__sw">${p.colores.map(([a, c], j) => `<span class="st-sw st-sw--g" style="--bg:${muestra(c)};--d:${j * 0.3}s" title="${a}"></span>`).join("")}</div></div>
      <div class="dr-datos">
        <div><span>Suscriptores en el mundo</span><b>${p.subs ? `${num(p.subs)} <small>M</small>` : "<small>No los publica</small>"}</b><em>${p.subs ? p.subsFecha : p.subsFecha}</em></div>
        <div><span>Cuota en Colombia</span><b>${p.co} <small>%</small></b><em>JustWatch, 3.er trimestre de 2025${p.co26 ? ` · ${p.co26} % en el 1.er semestre de 2026` : ""}</em></div>
        <div><span>Nació</span><b>${p.nace}</b><em>${p.naceTxt}</em></div>
        <div><span>Llegó a Latinoamérica</span><b>${p.latamAnio}</b><em>${p.latam}</em></div>
      </div>
      <div class="dr-ficha__rej">
        <div class="dr-bloque"><h4>Su historia</h4>
          <ol class="st-hist" style="--c:${p.color === "#111111" ? "#3a3a3a" : p.color}">${p.hitos.map(([a, t], k) => `<li class="st-hito" style="--d:${0.3 + k * 0.22}s"><b>${a}</b><span>${t}</span></li>`).join("")}</ol></div>
        <div class="dr-bloque"><h4>Sus colores</h4><div class="st-evol">${p.colores.map(([a, c, t], j) => `<div class="st-evol__i" style="--d:${j * 0.35}s"><span class="st-sw st-sw--g" style="--bg:${muestra(c)}"></span><div><b>${a}</b><p>${t}</p></div></div>`).join("")}</div>
          <p class="dr-txt">${p.colorTxt}</p></div>
      </div>
      <div class="dr-ficha__rej">
        <div class="dr-bloque"><h4>Qué ofrece</h4><ul class="dr-modos">${p.contenido.map((c) => `<li>${c}</li>`).join("")}</ul>
          <h4 class="dr-mt">En Latinoamérica</h4><p class="dr-txt">${p.subsLatam}.</p></div>
        <div class="dr-bloque"><h4>Premios</h4><p class="dr-txt">${p.premios}</p></div>
      </div>
      <div class="dr-ficha__rej">
        <div class="dr-bloque"><h4>Fuentes</h4><ul class="st-fuentes">${p.fuentes.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`).join("")}</ul></div>
        <div class="dr-bloque dr-bloque--clave"><h4>Dato clave</h4><p>${p.clave}</p></div>
      </div>
      <nav class="dr-pasos" aria-label="Cambiar de plataforma"><a href="#${ant.id}">← ${ant.nombre}</a><a href="#panorama">Panorama</a><a href="#${sig.id}">${sig.nombre} →</a></nav>
    </section>`;
  }

  /* ---------- Armado y navegación (las páginas usan <base href="/">) ---------- */
  const aqui = location.pathname;
  raiz.innerHTML = (`<nav class="dr-nav" aria-label="Navegación de la infografía"><div class="dr-nav__carril">
      <a href="#panorama" data-ir="panorama"><span class="dr-nav__ico">▦</span>Panorama</a>
      ${P.map((p) => `<a href="#${p.id}" data-ir="${p.id}"><span class="st-nav__p" style="--c:${p.color}"></span>${p.nombre}</a>`).join("")}
    </div></nav>
    <div class="dr-vistas">${panorama()}${P.map(ficha).join("")}</div>`).replace(/href="#/g, `href="${aqui}#`);

  const ir = (id, desplazar) => {
    if (!raiz.querySelector(`[data-vista="${id}"]`)) id = "panorama";
    raiz.querySelectorAll("[data-vista]").forEach((v) => { v.hidden = v.dataset.vista !== id; });
    raiz.querySelectorAll("[data-ir]").forEach((a) => { if (a.dataset.ir === id) { a.setAttribute("aria-current", "page");
      const car = a.parentElement; car.scrollTo({ left: a.offsetLeft - (car.clientWidth - a.offsetWidth) / 2, behavior: "smooth" }); } else a.removeAttribute("aria-current"); });
    const vista = raiz.querySelector(`[data-vista="${id}"]`);
    vista.classList.remove("ve"); void vista.offsetWidth; vista.classList.add("ve");
    vista.querySelectorAll(".dr-barra__p i").forEach((el) => { el.classList.remove("ve"); void el.offsetWidth; el.classList.add("ve"); });
    // Las cifras cuentan hasta su valor, como en los videos.
    vista.querySelectorAll(".dr-datos b, .dr-barra__v, .st-fusion b, .st-latam b, .st-oscar b").forEach((el) => {
      const nodo = el.firstChild; if (!nodo || nodo.nodeType !== 3) return;
      if (!el.dataset.final) el.dataset.final = nodo.textContent;
      const txt = el.dataset.final, m = txt.match(/[\d.,]+/); if (!m) return;
      const fin = parseFloat(m[0].replace(",", ".")), dec = (m[0].split(",")[1] || "").length, ini = performance.now(), esAnio = fin > 1900 && fin < 2100;
      const paso = (now) => { const k = Math.min((now - ini) / 900, 1), e = 1 - Math.pow(1 - k, 3), v = esAnio ? Math.round(1990 + (fin - 1990) * e) : (fin * e).toFixed(dec).replace(".", ",");
        nodo.textContent = txt.replace(m[0], k < 1 ? String(v) : m[0]); if (k < 1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    });
    if (desplazar) raiz.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const desdeAncla = (desplazar) => ir(decodeURIComponent(location.hash.slice(1)) || "panorama", desplazar);
  window.addEventListener("hashchange", () => desdeAncla(true));
  desdeAncla(false);
})();
