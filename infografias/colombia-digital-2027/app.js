/* Infografía interactiva «Colombia digital 2027». Navegación por #ancla: #panorama, #horas, #sitios, #redes, #poblacion, #tecnologia.
   Usa los estilos de la infografía de drones (dr-*) y los suyos (cd-*). Datos en datos.js (DataReportal, Digital 2027: Colombia). */
(() => {
  const raiz = document.getElementById("cd-app");
  if (!raiz || !window.CO27) return;
  const D = window.CO27;
  const num = (n, d = 1) => Number(n).toFixed(d).replace(".", ",");
  const hm = ([h, m]) => `${h} h ${String(m).padStart(2, "0")} min`;
  const min = (h, m) => h * 60 + m;
  const tiempo = (s) => s >= 60 ? `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s` : `${s} s`;
  const barra = (n, v, max, txt, color, extra = "") => `<div class="dr-barra${extra}"><span class="dr-barra__n"><b>${n}</b></span><span class="dr-barra__p"><i style="--v:${(v / max * 100).toFixed(1)}%${color ? `;background:${color}` : ""}"></i></span><span class="dr-barra__v">${txt}</span></div>`;

  /* ---------- 1. Panorama: si Colombia fuera 100 personas ---------- */
  const CIEN = [
    ["internet", "Usan internet", Math.round(D.internet.pct), "de cada 100 colombianos usan internet. Más de 10 millones siguen desconectados."],
    ["ciudad", "Viven en ciudades", Math.round(D.pais.urbana), "de cada 100 viven en pueblos y ciudades; el resto, en zonas rurales, donde la conexión llega peor."],
    ["mujeres", "Son mujeres", Math.round(D.pais.mujeres), "de cada 100 son mujeres. En las redes, en cambio, el 56 % de las identidades son de hombres."],
    ["jovenes", "Tienen menos de 25", Math.round(D.edades.slice(0, 4).reduce((a, e) => a + e[1], 0)), "de cada 100 tienen menos de 25 años. La edad mediana es de 33."]
  ];
  const cien = () => `<div class="cd-cien">
      <div class="cd-cien__btns" role="tablist">${CIEN.map(([k, t], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-cien="${k}">${t}</button>`).join("")}</div>
      <div class="cd-cien__rej"><div class="cd-cien__puntos" aria-hidden="true">${Array.from({ length: 100 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div>
        <div class="cd-cien__dato"><b data-cien-n>81</b><p data-cien-t>${CIEN[0][3]}</p></div></div></div>`;

  const cifras = () => `<div class="dr-datos cd-datos">
      <div><span>Población</span><b>${num(D.pais.poblacion)} <small>M</small></b><em>Naciones Unidas, octubre de 2026</em></div>
      <div><span>Usan internet</span><b>${num(D.internet.usuarios)} <small>M</small></b><em>${num(D.internet.pct)} % de la población · +${num(D.internet.nuevos)} M en un año</em></div>
      <div><span>Conexiones móviles</span><b>${num(D.movil.conexiones)} <small>M</small></b><em>${D.movil.pct} % de la población: muchos tienen más de una SIM</em></div>
      <div><span>Identidades en redes</span><b>${num(D.redes.identidades)} <small>M</small></b><em>${num(D.redes.pct)} % de la población · no son personas únicas</em></div>
    </div>`;

  const mundo = () => `<div class="cd-vs">
      <div><span class="cd-vs__k">Usan internet</span><div class="cd-vs__f"><b>${num(D.internet.pct)} %</b><small>Colombia</small></div><div class="cd-vs__f cd-vs__f--m"><b>${num(D.mundo.internetPct)} %</b><small>Mundo</small></div></div>
      <div><span class="cd-vs__k">Usan redes</span><div class="cd-vs__f"><b>${num(D.redes.pct)} %</b><small>Colombia</small></div><div class="cd-vs__f cd-vs__f--m"><b>${num(D.mundo.redesPct)} %</b><small>Mundo</small></div></div>
      <div><span class="cd-vs__k">Horas en redes a la semana</span><div class="cd-vs__f"><b>${D.horas.redesCO[0]} h ${D.horas.redesCO[1]}</b><small>Colombia</small></div><div class="cd-vs__f cd-vs__f--m"><b>${D.horas.redesMundo[0]} h ${D.horas.redesMundo[1]}</b><small>Mundo</small></div></div>
    </div>`;

  const panorama = () => `<section class="dr-vista" data-vista="panorama">
    <div class="dr-bloque"><h3><span>01</span> Si Colombia fuera 100 personas</h3><p class="dr-sub">Toca cada opción y mira cómo se reparten.</p>${cien()}</div>
    <div class="dr-bloque"><h3><span>02</span> El país conectado</h3><p class="dr-sub">Cifras de octubre de 2026, el corte del informe.</p>${cifras()}</div>
    <div class="dr-bloque"><h3><span>03</span> Colombia frente al mundo</h3><p class="dr-sub">Estamos por encima del promedio mundial en todo, y muy por encima en el tiempo que pasamos en redes.</p>${mundo()}</div>
    <div class="dr-bloque dr-bloque--clave"><h4>La mirada crítica</h4><p>Colombia ya pasa más horas en redes que casi todo el mundo, pero uno de cada cinco colombianos sigue sin internet: el país conectado avanza más rápido que el país incluido.</p></div>
  </section>`;

  /* ---------- 2. Horas ---------- */
  const reloj = () => {
    const sem = min(...D.horas.semana), dia = sem / 7, frac = dia / (24 * 60), R = 110, C = 2 * Math.PI * R;
    return `<div class="cd-reloj"><svg viewBox="0 0 280 280" role="img" aria-label="Tiempo diario conectado frente a las 24 horas del día">
        <circle cx="140" cy="140" r="${R}" fill="none" stroke="#F1F1EE" stroke-width="34"/>
        <circle cx="140" cy="140" r="${R}" fill="none" stroke="var(--dr-verde)" stroke-width="34" stroke-dasharray="${C * frac} ${C}" transform="rotate(-90 140 140)" class="cd-arco" style="--c:${C}"/>
        ${Array.from({ length: 24 }, (_, h) => { const a = h / 24 * Math.PI * 2 - Math.PI / 2; return `<line x1="${140 + Math.cos(a) * 82}" y1="${140 + Math.sin(a) * 82}" x2="${140 + Math.cos(a) * (h % 6 ? 88 : 76)}" y2="${140 + Math.sin(a) * (h % 6 ? 88 : 76)}" stroke="#bdbdb7" stroke-width="${h % 6 ? 1.5 : 3}"/>`; }).join("")}
        <text x="140" y="138" text-anchor="middle" class="cd-reloj__h">${Math.floor(dia / 60)} h ${Math.round(dia % 60)} min</text><text x="140" y="164" text-anchor="middle" class="cd-reloj__s">AL DÍA</text></svg>
      <div><p class="cd-gran"><b>${D.horas.semana[0]} h ${D.horas.semana[1]} min</b> a la semana conectados a internet</p>
        <p class="dr-txt">Es el promedio de los internautas de 16 años o más, sumando todos sus aparatos. Las redes sociales y el video se llevan ${D.horas.redesCO[0]} h ${D.horas.redesCO[1]} min de ese tiempo; el promedio del mundo es de ${D.horas.redesMundo[0]} h ${D.horas.redesMundo[1]} min.</p></div></div>`;
  };
  const medios = () => { const max = min(D.medios[0][1], D.medios[0][2]);
    return `<div class="dr-barras">${D.medios.map(([n, h, m, total]) => barra(n, min(h, m), max, `${h}:${String(m).padStart(2, "0")}`, total ? "#c9cdd2" : "", total ? " cd-total" : "")).join("")}</div>
      <p class="dr-nota">Horas y minutos por semana. Las barras grises suman las que siguen (por ejemplo, «Televisión (total)» = tradicional + streaming). Se pueden usar varios medios a la vez.</p>`; };
  const apps = () => `<div class="dr-barras">${D.appMin.map(([n, m]) => barra(n, m, D.appMin[0][1], m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min`, "#F59E0B")).join("")}</div>
      <p class="dr-nota">Tiempo diario promedio de cada usuario activo en la app, en agosto de 2026. Fuente: Similarweb.</p>`;
  const horas = () => `<section class="dr-vista" data-vista="horas">
    <div class="dr-bloque"><h3><span>01</span> Casi 7 horas al día</h3>${reloj()}</div>
    <div class="dr-bloque"><h3><span>02</span> En qué se nos va la semana</h3><p class="dr-sub">El video en línea ya le gana a la televisión, y los videos cortos ocupan casi tantas horas como la música.</p>${medios()}</div>
    <div class="dr-bloque"><h3><span>03</span> El tiempo de cada app, al día</h3><p class="dr-sub">TikTok es la que más tiempo se lleva: más de 2 horas diarias por usuario.</p>${apps()}</div>
  </section>`;

  /* ---------- 3. Sitios y búsquedas ---------- */
  const COLCAT = { Buscador: "#4285F4", Video: "#E50914", Mensajería: "#25D366", Redes: "#E1306C", IA: "#7C3AED", Correo: "#0078D4", Trabajo: "#0078D4", Compras: "#F59E0B", Adultos: "#9a9a94", Pagos: "#00875A", Consulta: "#555", Banca: "#F2C500", Tecnología: "#0078D4", Noticias: "#111" };
  const sitios = () => `<div class="cd-orden" role="tablist"><button type="button" aria-selected="true" data-orden="1">Visitas al mes</button><button type="button" aria-selected="false" data-orden="2">Visitantes únicos</button><button type="button" aria-selected="false" data-orden="3">Tiempo por visita</button></div>
      <ol class="cd-sitios" data-sitios></ol>
      <p class="dr-nota">Promedio mensual entre junio y agosto de 2026. Fuente: Similarweb. Las categorías son de Tecnocríticos. El puesto 15 es un sitio para adultos.</p>`;
  const pintaSitios = (ol, col) => {
    const L = [...D.sitios].sort((a, b) => b[col] - a[col]), max = L[0][col];
    ol.innerHTML = L.map((s, i) => { const v = s[col], txt = col === 3 ? tiempo(v) : v >= 1000 ? `${String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} M` : `${num(v, v < 10 ? 2 : v < 100 ? 1 : 0)} M`;
      return `<li style="--d:${i * 0.03}s"><span class="cd-sitios__p">${String(i + 1).padStart(2, "0")}</span><span class="cd-sitios__n">${s[0]}<small style="--c:${COLCAT[s[4]]}">${s[4]}</small></span>
        <span class="dr-barra__p"><i class="ve" style="--v:${(v / max * 100).toFixed(1)}%;background:${COLCAT[s[4]]}"></i></span><span class="cd-sitios__v">${txt}</span></li>`; }).join("");
  };
  const busquedas = () => `<div class="cd-nube">${D.busquedas.map(([q, v], i) => `<span style="--s:${(0.8 + v / 100 * 1.6).toFixed(2)};--d:${i * 0.04}s" title="Índice ${v}">${q}<small>${v}</small></span>`).join("")}</div>
      <p class="dr-nota">Índice frente a la búsqueda más popular («colombia» = 100). Entre el 1 de julio de 2025 y el 30 de junio de 2026. Fuente: Google Trends.</p>`;
  const sitiosV = () => `<section class="dr-vista" data-vista="sitios">
    <div class="dr-bloque"><h3><span>01</span> Los 20 sitios más visitados</h3><p class="dr-sub">Google recibe más de mil millones de visitas al mes, y dos asistentes de IA ya están en el top 10: ChatGPT y Gemini. Cambia el orden con los botones.</p>${sitios()}</div>
    <div class="dr-bloque"><h3><span>02</span> Lo que más buscamos en Google</h3><p class="dr-sub">Buscamos el clima de cuatro formas distintas («clima», «tiempo», «tiempo mañana» y «tiempo de mañana»), WhatsApp de tres y ChatGPT ya aparece en el puesto 12.</p>${busquedas()}</div>
  </section>`;

  /* ---------- 4. Redes ---------- */
  const uso = () => `<div class="dr-barras">${D.redesUso.map(([n, v, c]) => barra(n, v, 100, `${num(v)} %`, c)).join("")}</div>
      <p class="dr-nota">Internautas de 16 años o más que dicen haber usado cada plataforma el último mes. Fuente: GWI, segundo trimestre de 2026.</p>`;
  const favorita = () => `<div class="cd-fav">${D.favorita.map(([n, v], i) => `<div style="--v:${v};--d:${i * 0.08}s"><b>${num(v)} %</b><i></i><span>${n}</span></div>`).join("")}</div>
      <p class="dr-nota">Red favorita de quienes usan redes. YouTube no era una opción en la encuesta. Fuente: GWI.</p>`;
  const audiencias = () => `<div class="cd-aud">${D.audiencias.map(([n, v, nota]) => `<div><b>${num(v, v < 10 ? 2 : 1)} <small>M</small></b><span>${n}</span>${nota ? `<em>${nota}</em>` : ""}</div>`).join("")}</div>
      <p class="dr-nota">Personas a las que cada plataforma dice que puede mostrarles anuncios en Colombia, a fines de 2026. No son usuarios activos y pueden incluir cuentas duplicadas: TikTok reporta más adultos que los que hay en el país.</p>`;
  const redes = () => `<section class="dr-vista" data-vista="redes">
    <div class="dr-bloque"><h3><span>01</span> Las redes que más usamos</h3><p class="dr-sub">93 de cada 100 internautas usaron WhatsApp el último mes. En promedio, cada usuario entra a 7 plataformas al mes.</p>${uso()}</div>
    <div class="dr-bloque"><h3><span>02</span> La favorita</h3><p class="dr-sub">Una de cada tres personas elige WhatsApp; TikTok ya supera a Instagram y a Facebook.</p>${favorita()}</div>
    <div class="dr-bloque"><h3><span>03</span> Lo que reportan las plataformas</h3>${audiencias()}</div>
  </section>`;

  /* ---------- 5. Población ---------- */
  const edades = () => { const max = Math.max(...D.edades.map((e) => e[1]));
    return `<div class="cd-edades">${D.edades.map(([r, v], i) => `<div style="--h:${(v / max * 100).toFixed(1)}%;--d:${i * 0.07}s"><b>${num(v)} %</b><i></i><span>${r}</span></div>`).join("")}</div>
      <p class="dr-nota">Porcentaje de la población por grupo de edad, a fines de 2026. Fuente: Naciones Unidas.</p>`; };
  const poblacion = () => `<section class="dr-vista" data-vista="poblacion">
    <div class="dr-datos cd-datos">
      <div><span>Población</span><b>${num(D.pais.poblacion)} <small>M</small></b><em>+${D.pais.crece} mil personas en un año (+0,9 %)</em></div>
      <div><span>Edad mediana</span><b>${num(D.pais.edadMediana)} <small>años</small></b><em>la mitad del país tiene menos de 33</em></div>
      <div><span>Vive en ciudades</span><b>${num(D.pais.urbana)} <small>%</small></b><em>17,6 % en zonas rurales</em></div>
      <div><span>Esperanza de vida</span><b>${num(D.pais.vida)} <small>años</small></b><em>alfabetismo de adultos: ${num(D.pais.alfabetismo)} %</em></div>
    </div>
    <div class="dr-bloque"><h3><span>01</span> Cómo se reparte por edad</h3><p class="dr-sub">El grupo más grande es el de 25 a 34 años: el 17 % del país.</p>${edades()}</div>
    <div class="dr-bloque"><h3><span>02</span> Mujeres y hombres</h3><div class="cd-gen"><div style="--v:${D.pais.mujeres}%"><b>${num(D.pais.mujeres)} %</b><span>mujeres</span></div><div><b>${num(D.pais.hombres)} %</b><span>hombres</span></div></div>
      <p class="dr-nota">En las redes la proporción se invierte: el 56,1 % de las identidades son de hombres y el 43,9 %, de mujeres.</p></div>
  </section>`;

  /* ---------- 6. Tecnología: dispositivos, IA y velocidad ---------- */
  const dispositivos = () => `<div class="dr-barras">${D.dispositivos.map(([n, v, total]) => barra(n, v, 100, `${num(v)} %`, total ? "#c9cdd2" : "#0EA5E9", total ? " cd-total" : "")).join("")}</div>
      <p class="dr-nota">Internautas de 16 años o más que usan cada aparato para conectarse. Las barras grises suman las que siguen. Fuente: GWI.</p>`;
  const ia = () => `<div class="cd-ia">${D.ia.map(([t, v], i) => { const R = 40, C = 2 * Math.PI * R;
      return `<div style="--d:${i * 0.08}s"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${R}" fill="none" stroke="#F1F1EE" stroke-width="12"/><circle cx="50" cy="50" r="${R}" fill="none" stroke="#7C3AED" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C * v / 100} ${C}" transform="rotate(-90 50 50)" class="cd-arco" style="--c:${C}"/><text x="50" y="57" text-anchor="middle">${num(v)}%</text></svg><span>${t}</span></div>`; }).join("")}</div>
      <p class="dr-nota">Internautas de 16 años o más. En el mundo, el 83,5 % usa IA cada mes. Fuente: GWI, segundo trimestre de 2026.</p>`;
  const velocidad = () => `<div class="dr-datos cd-datos cd-datos--2">
      <div><span>Internet móvil (mediana)</span><b>${num(D.velocidad.movil, 2)} <small>Mbps</small></b><em>+${num(D.velocidad.movilCrece)} % en un año</em></div>
      <div><span>Internet fijo (mediana)</span><b>${num(D.velocidad.fija, 2)} <small>Mbps</small></b><em>+${num(D.velocidad.fijaCrece)} % en un año</em></div>
    </div><p class="dr-nota">Velocidad de descarga, agosto de 2026. Fuente: Ookla.</p>`;
  const tecnologia = () => `<section class="dr-vista" data-vista="tecnologia">
    <div class="dr-bloque"><h3><span>01</span> La IA ya es masiva</h3><p class="dr-sub">9 de cada 10 internautas usaron IA el último mes, pero solo 6 de cada 100 pagan por ella.</p>${ia()}</div>
    <div class="dr-bloque"><h3><span>02</span> Con qué nos conectamos</h3><p class="dr-sub">El celular es la puerta de entrada de casi todos; el computador, de dos de cada tres.</p>${dispositivos()}</div>
    <div class="dr-bloque"><h3><span>03</span> Qué tan rápido</h3>${velocidad()}</div>
  </section>`;

  /* ---------- Armado y navegación (las páginas usan <base href="/">) ---------- */
  const PEST = [["panorama", "▦", "Panorama"], ["horas", "◷", "Horas en internet"], ["sitios", "◎", "Sitios y búsquedas"], ["redes", "◍", "Redes sociales"], ["poblacion", "◉", "Población"], ["tecnologia", "✦", "Dispositivos e IA"]];
  const aqui = location.pathname;
  raiz.innerHTML = (`<nav class="dr-nav" aria-label="Navegación de la infografía"><div class="dr-nav__carril">
      ${PEST.map(([id, ico, t]) => `<a href="#${id}" data-ir="${id}"><span class="dr-nav__ico">${ico}</span>${t}</a>`).join("")}
    </div></nav>
    <div class="dr-vistas">${panorama()}${horas()}${sitiosV()}${redes()}${poblacion()}${tecnologia()}</div>`).replace(/href="#/g, `href="${aqui}#`);

  // Interacción: 100 personas.
  const puntos = raiz.querySelectorAll(".cd-cien__puntos i");
  const verCien = (k) => { const c = CIEN.find((x) => x[0] === k);
    raiz.querySelectorAll("[data-cien]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.cien === k)));
    puntos.forEach((p, i) => p.classList.toggle("si", i < c[2]));
    raiz.querySelector("[data-cien-n]").textContent = c[2]; raiz.querySelector("[data-cien-t]").textContent = c[3]; };
  raiz.querySelector(".cd-cien__btns").addEventListener("click", (e) => { const b = e.target.closest("[data-cien]"); if (b) verCien(b.dataset.cien); });
  verCien("internet");
  // Interacción: orden de los sitios.
  const ol = raiz.querySelector("[data-sitios]");
  raiz.querySelector(".cd-orden").addEventListener("click", (e) => { const b = e.target.closest("[data-orden]"); if (!b) return;
    raiz.querySelectorAll("[data-orden]").forEach((x) => x.setAttribute("aria-selected", String(x === b))); pintaSitios(ol, +b.dataset.orden); });
  pintaSitios(ol, 1);

  const ir = (id, desplazar) => {
    if (!raiz.querySelector(`[data-vista="${id}"]`)) id = "panorama";
    raiz.querySelectorAll("[data-vista]").forEach((v) => { v.hidden = v.dataset.vista !== id; });
    raiz.querySelectorAll("[data-ir]").forEach((a) => { if (a.dataset.ir === id) { a.setAttribute("aria-current", "page");
      const car = a.parentElement; car.scrollTo({ left: a.offsetLeft - (car.clientWidth - a.offsetWidth) / 2, behavior: "smooth" }); } else a.removeAttribute("aria-current"); });
    const vista = raiz.querySelector(`[data-vista="${id}"]`);
    vista.classList.remove("ve"); void vista.offsetWidth; vista.classList.add("ve");
    vista.querySelectorAll(".dr-barra__p i").forEach((el) => { el.classList.remove("ve"); void el.offsetWidth; el.classList.add("ve"); });
    // Las cifras cuentan hasta su valor, como en los videos.
    vista.querySelectorAll(".dr-datos b, .cd-vs b, .cd-aud b").forEach((el) => {
      const nodo = el.firstChild; if (!nodo || nodo.nodeType !== 3) return;
      if (!el.dataset.final) el.dataset.final = nodo.textContent;
      const txt = el.dataset.final, m = txt.match(/[\d.,]+/); if (!m) return;
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
