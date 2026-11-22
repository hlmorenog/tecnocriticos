/* TECNOCRÍTICOS — interacciones del portal (rediseño 2026) */
(function () {
  "use strict";

  /* ---------- Utilidades ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const urlSegura = (u) => (/^https?:\/\//i.test(u || "") ? esc(u) : "#");
  const rutaLocal = (u) => (/^[\w\-/.]+$/.test(u || "") && !u.includes("..") ? esc(u) : "");
  const diaBogota = (d) => new Date(d.getTime() - 5 * 3600e3).toISOString().slice(0, 10);
  const fechaLarga = (iso) => {
    const t = new Date(iso + "T12:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const fechaCorta = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short" }).replace(".", "");
  const haceCuanto = (iso) => {
    const dias = Math.round((new Date(diaBogota(new Date()) + "T12:00:00") - new Date(iso + "T12:00:00")) / 864e5);
    return dias <= 0 ? "Hoy" : dias === 1 ? "Ayer" : "Hace " + dias + " días";
  };
  const minutos = (n) => Math.max(2, Math.round([n.entradilla, ...(n.cuerpo || []), n.mirada].join(" ").split(/\s+/).length / 200) + 1);

  /* ---------- Fecha en la cabecera ---------- */
  $$("[data-fecha]").forEach((el) => {
    const f = new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    el.textContent = f.charAt(0).toUpperCase() + f.slice(1);
  });

  /* ---------- La Mesa: el voto se guarda solo en este navegador ---------- */
  const mesa = $("[data-debate]");
  if (mesa) {
    const clave = "tc-voto-" + mesa.dataset.debate;
    const opciones = $$(".opcion", mesa);
    const gracias = $(".mesa__gracias", mesa);
    const marcar = (i) => {
      opciones.forEach((o, j) => { o.setAttribute("aria-pressed", String(i === j)); o.disabled = true; });
      if (gracias) gracias.hidden = false;
    };
    let previo = null;
    try { previo = localStorage.getItem(clave); } catch (e) {}
    if (previo !== null && opciones[Number(previo)]) marcar(Number(previo));
    opciones.forEach((o, i) => o.addEventListener("click", () => {
      marcar(i);
      try { localStorage.setItem(clave, String(i)); } catch (e) {}
    }));
  }

  /* ---------- Boletín: todavía no está conectado a un proveedor ---------- */
  $$("[data-boletin]").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.outerHTML = '<p class="bol__ok">Gracias. El Boletín Crítico abre muy pronto: estamos terminando de prepararlo.</p>';
  }));

  /* ---------- Compartir en redes ----------
     Cada noticia se comparte con su página n/<id>.html, que tiene la vista previa
     (titular, entradilla y foto) para WhatsApp, Facebook, X, LinkedIn y Telegram. */
  const REDES = [
    ["WhatsApp", (u, t) => `https://wa.me/?text=${encodeURIComponent(t + " " + u)}`],
    ["Facebook", (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`],
    ["X", (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`],
    ["LinkedIn", (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`],
    ["Telegram", (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`],
    ["Correo", (u, t, d) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent((d ? d + "\n\n" : "") + u)}`],
  ];
  const barraCompartir = (caja, url, titulo, desc) => {
    if (!caja) return;
    const enlaces = REDES.map(([red, f]) => {
      const destino = red === "Correo" ? "" : ' target="_blank" rel="noopener"';
      return `<a href="${esc(f(url, titulo, desc))}"${destino} data-red="${red}">${red}</a>`;
    }).join("");
    caja.innerHTML = `<span class="compartir__lab">Compartir</span>
      <button type="button" class="compartir__nativo" data-nativo hidden>Compartir…</button>${enlaces}
      <button type="button" data-copiar-url>Copiar enlace</button>`;
    const nativo = caja.querySelector("[data-nativo]");
    if (navigator.share) {
      nativo.hidden = false;
      nativo.addEventListener("click", () => navigator.share({ title: titulo, text: desc || titulo, url }).catch(() => {}));
    }
    const copiar = caja.querySelector("[data-copiar-url]");
    copiar.addEventListener("click", () => {
      const ok = () => { copiar.textContent = "¡Copiado!"; setTimeout(() => (copiar.textContent = "Copiar enlace"), 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, () => prompt("Copia este enlace:", url));
      else prompt("Copia este enlace:", url);
    });
  };
  // Dirección pública para compartir una noticia: su página n/<id>.html
  const urlCompartirNoticia = async (n) => new URL(enlace(n), location.href).href;
  // Páginas fijas (la columna): se comparten con su propia dirección.
  $$("[data-compartir]").forEach((caja) => {
    const desc = $('meta[property="og:description"]') || $('meta[name="description"]');
    const titulo = ($('meta[property="og:title"]') || {}).content || document.title;
    barraCompartir(caja, location.href.split("#")[0], titulo, desc ? desc.content : "");
  });

  /* ---------- Menú del celular ---------- */
  const botonMenu = $("[data-menu-btn]");
  const menuMovil = $("#menu-movil");
  if (botonMenu && menuMovil) {
    const abrir = (si) => {
      menuMovil.hidden = !si;
      botonMenu.setAttribute("aria-expanded", String(si));
      botonMenu.querySelector(".sr-only").textContent = si ? "Cerrar el menú" : "Abrir el menú";
      document.documentElement.classList.toggle("menu-abierto", si);
    };
    botonMenu.addEventListener("click", () => abrir(menuMovil.hidden));
    menuMovil.addEventListener("click", (e) => { if (e.target.closest("a")) abrir(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !menuMovil.hidden) { abrir(false); botonMenu.focus(); } });
    matchMedia("(min-width: 1101px)").addEventListener("change", (e) => { if (e.matches) abrir(false); });
  }

  /* ---------- Copiar un texto fijo (por ejemplo, la dirección del RSS) ---------- */
  $$("[data-copiar-texto]").forEach((b) => b.addEventListener("click", () => {
    const texto = b.dataset.copiarTexto;
    const ok = () => { b.textContent = "¡Copiada!"; setTimeout(() => (b.textContent = "Copiar dirección"), 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(texto).then(ok, () => prompt("Copia esta dirección:", texto));
    else prompt("Copia esta dirección:", texto);
  }));

  /* ---------- Copiar enlace y barra de lectura ---------- */
  $$("[data-copiar]").forEach((b) => b.addEventListener("click", () => {
    if (navigator.clipboard) navigator.clipboard.writeText(location.href);
    b.textContent = "¡Copiado!";
    setTimeout(() => (b.textContent = "Copiar enlace"), 1800);
  }));
  const barra = $(".barra-progreso");
  const cuerpoLectura = $(".cuerpo");
  if (barra && cuerpoLectura) {
    const act = () => {
      const r = cuerpoLectura.getBoundingClientRect();
      barra.style.width = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1) * 100 + "%";
    };
    addEventListener("scroll", act, { passive: true });
    act();
  }

  /* =========================================================
     NOTICIAS DIARIAS — archivos noticias/AAAA-MM-DD.json
     ========================================================= */
  const SECCIONES = {
    "Colombia": { clase: "foto--co", glifo: "CO" },
    "IA y tecnología": { clase: "foto--ia", glifo: "IA" },
    "Videojuegos y series": { clase: "foto--juegos", glifo: "▶" },
  };
  const seccionDe = (n) => SECCIONES[n.seccion] || SECCIONES["IA y tecnología"];
  // Cada noticia tiene su página estática (n/<id>.html), generada por herramientas/generar_paginas.py
  const enlace = (n) => "n/" + encodeURIComponent(n.id) + ".html";

  async function cargarNoticias(dias) {
    const hoy = Date.now();
    const fechas = Array.from({ length: dias }, (_, i) => diaBogota(new Date(hoy - i * 864e5)));
    const ediciones = await Promise.all(fechas.map((f) =>
      fetch("noticias/" + f + ".json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).catch(() => null)));
    return ediciones.filter((e) => e && Array.isArray(e.noticias) && e.noticias.length)
      .map((e) => ({ fecha: e.fecha, noticias: e.noticias.map((n) => ({ ...n, fecha: e.fecha })) }));
  }

  // Foto de la noticia (o un bloque de color de la sección si no tiene)
  const foto = (n, extra = "") => {
    const src = n.imagen && rutaLocal(n.imagen.archivo);
    if (src) return `<img class="foto ${n.imagen.encuadre === "completa" ? "foto--completa" : ""} ${extra}" src="${src}" alt="${esc(n.imagen.alt || "")}" loading="lazy">`;
    const s = seccionDe(n);
    return `<div class="foto foto--vacia ${s.clase} ${extra}" aria-hidden="true">${esc(s.glifo)}</div>`;
  };
  const credito = (n) => {
    const i = n.imagen;
    if (!i || !i.archivo) return "";
    const partes = ["Foto: " + esc(i.autor || "Autor desconocido"), esc(i.fuente || ""), esc(i.licencia || "")].filter(Boolean).join(" · ");
    return `<p class="cred">${i.url ? `<a href="${urlSegura(i.url)}" target="_blank" rel="noopener">${partes}</a>` : partes}</p>`;
  };
  const lineaDato = (n) => n.dato && n.dato.texto
    ? `<p><b>${esc(n.dato.etiqueta || "El dato")}:</b> ${esc(n.dato.texto)}</p>`
    : `<p>${esc(n.entradilla)}</p>`;
  const nombresFuentes = (n) => (n.fuentes || []).map((f) => f.nombre).filter(Boolean).join(", ");

  // La mirada crítica: la posición de la casa, en una frase, separada de los hechos
  const bloqueTri = (n) => {
    if (!n.mirada) return "";
    return `<div class="analisis">
      <div class="analisis__mirada"><h4>La mirada crítica</h4><p>${esc(n.mirada)}</p></div>
    </div>`;
  };
  const bloqueCifra = (n) => n.cifra && n.cifra.valor
    ? `<div class="dato"><strong>${esc(n.cifra.valor)}</strong><span>${esc(n.cifra.texto || "")}</span></div>` : "";

  const itemListado = (n) => `<article class="item">
      <span class="lab">${esc(n.seccion)}</span>
      <div><h3><a href="${esc(enlace(n))}">${esc(n.titular)}</a></h3>${lineaDato(n)}<span class="meta">${haceCuanto(n.fecha)}</span></div>
      <a href="${esc(enlace(n))}" tabindex="-1" aria-hidden="true">${foto(n)}</a>
    </article>`;

  const llenarMinuto = (lista) => {
    const ol = $("[data-minuto]");
    if (!ol) return;
    ol.innerHTML = lista.slice(0, 5).map((n) =>
      `<li><a href="${esc(enlace(n))}">${esc(n.titular_corto || n.titular)}</a></li>`).join("")
      || '<li>La edición de hoy llega pronto.</li>';
    const cuenta = $("[data-minuto-cuenta]");
    if (cuenta) cuenta.textContent = Math.min(lista.length, 5);
    // "Explora" se completa con titulares: solo se ven los que caben (ver equilibrar)
    const exp = $("[data-elastico] ol");
    const fija = $("[data-noticia-id]");
    const actual = fija ? fija.dataset.noticiaId : new URLSearchParams(location.search).get("id");
    if (exp && !exp.dataset.ampliado) {
      exp.dataset.ampliado = "1";
      exp.insertAdjacentHTML("beforeend", lista.filter((n) => n.id !== actual).slice(0, 10)
        .map((n) => `<li><a href="${esc(enlace(n))}">${esc(n.titular)}</a></li>`).join(""));
      dispatchEvent(new Event("resize"));
    }
  };

  /* ---------- Portada ---------- */
  const heroEl = $("[data-hero]");
  if (heroEl) {
    cargarNoticias(10).then((eds) => {
      const todas = eds.flatMap((e) => e.noticias);
      llenarMinuto(todas);
      if (!todas.length) {
        heroEl.innerHTML = '<p class="vacio">La primera edición de noticias llega muy pronto.</p>';
        return;
      }
      const n = todas[0];
      heroEl.innerHTML = `
        <div class="hero__top">
          <div class="hero__cab"><span class="lab">${esc(n.seccion)} · ${esc(fechaLarga(n.fecha))}</span>
            <h1><a href="${esc(enlace(n))}">${esc(n.titular)}</a></h1></div>
          <div class="hero__img"><a href="${esc(enlace(n))}" tabindex="-1" aria-hidden="true">${foto(n)}</a>${credito(n)}</div>
        </div>
        ${bloqueCifra(n)}
        <p class="bl"><b>Por qué importa:</b>${esc(n.por_que_importa || n.entradilla)}</p>
        ${n.dato && n.dato.texto && n.dato.texto !== n.por_que_importa ? `<p class="bl"><b>${esc(n.dato.etiqueta || "El dato")}:</b>${esc(n.dato.texto)}</p>` : ""}
        ${bloqueTri(n)}
        <span class="meta">${nombresFuentes(n) ? "Fuentes: " + esc(nombresFuentes(n)) + " · " : ""}${minutos(n)} min de lectura · <a href="${esc(enlace(n))}" style="color:var(--rojo)">Leer completa →</a></span>`;

      const feed = $("[data-feed]");
      const resto = todas.slice(1, 6);
      if (feed) feed.innerHTML = resto.map(itemListado).join("") || '<p class="vacio">No hay más noticias por ahora.</p>';
      const ed = $("[data-edicion]");
      if (ed) ed.textContent = "Edición del " + fechaCorta(n.fecha);

      const mas = $("[data-mas]");
      const extra = todas.slice(6, 10);
      if (mas && extra.length) {
        $("[data-mas-lista]", mas).innerHTML = extra.map((m) => `<article>
          <a href="${esc(enlace(m))}">${foto(m)}</a><span class="lab">${esc(m.seccion)}</span>
          <h4><a href="${esc(enlace(m))}">${esc(m.titular)}</a></h4><p>${esc(m.entradilla)}</p></article>`).join("");
        mas.hidden = false;
      }
    });
  }

  /* ---------- Página de Noticias (archivo con filtro) ---------- */
  const archivo = $("[data-noticias-archivo]");
  if (archivo) {
    if (location.hash.length > 1) { // enlaces antiguos noticias.html#id
      const viejo = decodeURIComponent(location.hash.slice(1));
      if (/^[a-z0-9-]+$/.test(viejo)) location.replace("n/" + viejo + ".html");
    }
    const filtros = $("[data-filtros]");
    let ediciones = [];
    let filtro = new URLSearchParams(location.search).get("seccion") || "Todas";
    const pintar = () => {
      if (filtros) $$("button", filtros).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.seccion === filtro)));
      const html = ediciones.map((e) => {
        const lista = e.noticias.filter((n) => filtro === "Todas" || n.seccion === filtro);
        return lista.length ? `<section class="edicion"><h2>${esc(fechaLarga(e.fecha))}</h2>${lista.map(itemListado).join("")}</section>` : "";
      }).join("");
      // Con un filtro activo, debajo se ofrecen las noticias de las otras secciones
      const otras = filtro === "Todas" ? [] : ediciones.flatMap((e) => e.noticias).filter((n) => n.seccion !== filtro).slice(0, 6);
      const extra = otras.length ? `<section class="edicion"><h2>De otras secciones</h2>${otras.map(itemListado).join("")}</section>` : "";
      archivo.innerHTML = (html || '<p class="vacio">Todavía no hay noticias publicadas en esta sección.</p>') + extra;
    };
    if (filtros) filtros.addEventListener("click", (ev) => {
      const b = ev.target.closest("button[data-seccion]");
      if (!b) return;
      filtro = b.dataset.seccion;
      const u = new URL(location.href);
      if (filtro === "Todas") u.searchParams.delete("seccion"); else u.searchParams.set("seccion", filtro);
      history.replaceState(null, "", u);
      pintar();
    });
    cargarNoticias(60).then((eds) => { ediciones = eds; llenarMinuto(eds.flatMap((e) => e.noticias)); pintar(); });
  }

  /* ---------- Página de una noticia ---------- */
  const detalle = $("[data-noticia]");
  if (detalle) {
    const id = new URLSearchParams(location.search).get("id");
    // Enlaces antiguos (noticia.html?id=…): llevar a la página estática de la noticia
    if (id && /^[a-z0-9-]+$/.test(id)) {
      fetch("n/" + id + ".html", { method: "HEAD", cache: "no-cache" })
        .then((r) => { if (r.ok) location.replace("n/" + id + ".html"); }).catch(() => {});
    }
    cargarNoticias(60).then((eds) => {
      const todas = eds.flatMap((e) => e.noticias);
      llenarMinuto(todas);
      const n = todas.find((x) => x.id === id);
      if (!n) {
        detalle.innerHTML = '<h1>No encontramos esta noticia</h1><p class="entradilla">Puede que el enlace esté incompleto o que la noticia sea muy antigua.</p><a class="cta" href="noticias.html">Ver todas las noticias</a>';
        return;
      }
      document.title = n.titular + " — Tecnocríticos";
      const desc = $('meta[name="description"]');
      if (desc) desc.setAttribute("content", n.entradilla || "");
      const cuerpo = (Array.isArray(n.cuerpo) ? n.cuerpo : [n.cuerpo]).map((p) => `<p>${esc(p)}</p>`).join("");
      const fuentes = (n.fuentes || []).map((f) =>
        `<li><a href="${urlSegura(f.url)}" target="_blank" rel="noopener">${esc(f.nombre || f.url)}</a></li>`).join("");
      detalle.innerHTML = `
        <div class="miga"><a href="index.html">Hoy</a> / <a href="noticias.html?seccion=${encodeURIComponent(n.seccion)}">${esc(n.seccion)}</a></div>
        <span class="lab">${esc(n.seccion)}</span>
        <h1>${esc(n.titular)}</h1>
        <p class="entradilla">${esc(n.entradilla)}</p>
        <div class="firma-linea">${esc(fechaLarga(n.fecha))} · Redacción Tecnocríticos · ${minutos(n)} min de lectura</div>
        <div class="compartir compartir--arriba" data-compartir-noticia></div>
        ${foto(n)}${credito(n)}
        ${bloqueCifra(n)}
        ${n.por_que_importa ? `<p class="bl"><b>Por qué importa:</b>${esc(n.por_que_importa)}</p>` : ""}
        <div class="cuerpo">${cuerpo}</div>
        ${bloqueTri(n)}
        ${fuentes ? `<div class="fuentes"><span class="lab" style="color:var(--gris)">Fuentes</span><ul>${fuentes}</ul></div>` : ""}
        <div class="compartir" data-compartir-noticia></div>`;
      urlCompartirNoticia(n).then((url) =>
        $$("[data-compartir-noticia]", detalle).forEach((caja) => barraCompartir(caja, url, n.titular, n.entradilla)));
      const rel = $("[data-relacionadas]");
      if (rel) {
        const otras = todas.filter((x) => x.id !== n.id)
          .sort((a, b) => (b.seccion === n.seccion) - (a.seccion === n.seccion)).slice(0, 4);
        rel.innerHTML = otras.length ? `<h2>Más noticias <span class="meta"><a href="noticias.html">Ver todas →</a></span></h2>${otras.map(itemListado).join("")}` : "";
      }
    });
  }

  /* ---------- Páginas sin noticias propias (columna): "En 1 minuto" ---------- */
  if (!heroEl && !archivo && !detalle && $("[data-minuto]")) {
    cargarNoticias(10).then((eds) => llenarMinuto(eds.flatMap((e) => e.noticias)));
  }

  /* =========================================================
     EQUILIBRIO DE COLUMNAS (solo escritorio)
     La columna derecha nunca debe dejar un hueco en blanco:
     - si es más larga que el contenido, se ocultan sus bloques
       secundarios (data-quitar: el número mayor se quita primero);
     - si es más corta, el espacio sobrante se reparte entre bloques.
     ========================================================= */
  const rail = $(".rail");
  const principalEl = $(".principal");
  function equilibrar() {
    if (!rail || !principalEl) return;
    const HUECO = 28;
    const opcionales = $$("[data-quitar]", rail).filter((e) => !e.hasAttribute("data-elastico"))
      .sort((a, b) => b.dataset.quitar - a.dataset.quitar);
    const elastico = $("[data-elastico]", rail);
    const itemsElasticos = elastico ? $$("li", elastico) : [];
    // 1) Todo visible, sin espacio extra
    opcionales.forEach((e) => (e.hidden = false));
    itemsElasticos.forEach((li) => (li.hidden = false));
    if (elastico) elastico.hidden = false;
    rail.style.gap = "";
    if (innerWidth <= 860) return;

    const altoRail = () => {
      const vis = [...rail.children].filter((c) => !c.hidden);
      return vis.reduce((s, c) => s + c.offsetHeight + (parseFloat(getComputedStyle(c).marginTop) || 0), 0) + HUECO * (vis.length - 1);
    };
    const meta = principalEl.offsetHeight;

    // 2) Sin el bloque elástico, se quitan bloques secundarios hasta que la columna quepa
    if (elastico) elastico.hidden = true;
    for (const e of opcionales) {
      if (altoRail() <= meta) break;
      e.hidden = true;
    }
    // 3) El bloque elástico rellena el espacio sobrante, enlace por enlace
    if (elastico) {
      itemsElasticos.forEach((li) => (li.hidden = true));
      elastico.hidden = false;
      let mostrados = 0;
      for (const li of itemsElasticos) {
        li.hidden = false;
        if (altoRail() > meta) { li.hidden = true; break; }
        mostrados++;
      }
      if (mostrados < 2) elastico.hidden = true;
    }
    // 4) El sobrante (menos de un enlace) se reparte entre los bloques para terminar exactos
    const vis = [...rail.children].filter((c) => !c.hidden);
    const sobra = meta - altoRail();
    if (sobra > 0 && vis.length > 1) rail.style.gap = Math.min(HUECO + sobra / (vis.length - 1), HUECO + 60) + "px";
  }
  if (rail && principalEl) {
    // Se recalcula cuando cambia el contenido (noticias cargadas, filtros) o el tamaño de la ventana
    let pendiente = 0;
    const programar = () => { cancelAnimationFrame(pendiente); pendiente = requestAnimationFrame(equilibrar); };
    new MutationObserver(programar).observe(principalEl, { childList: true, subtree: true });
    addEventListener("resize", programar);
    addEventListener("load", programar);
    if (document.fonts) document.fonts.ready.then(programar);
    $$("img", principalEl).forEach((i) => i.addEventListener("load", programar));
    principalEl.addEventListener("load", programar, true); // fotos cargadas después
    programar();
  }
})();
