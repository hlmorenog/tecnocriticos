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

  /* ---------- Boletín Tecnocríticos (MailerLite) ----------
     El script de MailerLite y el reCAPTCHA se cargan solo cuando el formulario
     se acerca a la pantalla o el lector toca el campo, para no frenar la página. */
  $$("[data-boletin]").forEach((caja) => {
    const id = caja.dataset.boletin;
    window["ml_webform_success_" + id] = () => {
      $(".row-form", caja).hidden = true;
      $(".row-success", caja).hidden = false;
    };
    let cargado = false;
    const cargar = () => {
      if (cargado) return;
      cargado = true;
      [["https://www.google.com/recaptcha/api.js?hl=es-419"],
       ["https://groot.mailerlite.com/js/w/webforms.min.js?v83147fa8ce2d95cb73ece7f28b469519"]].forEach(([src]) => {
        const s = document.createElement("script");
        s.src = src; s.async = true;
        document.head.appendChild(s);
      });
    };
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((e) => {
        if (e.some((x) => x.isIntersecting)) { cargar(); obs.disconnect(); }
      }, { rootMargin: "400px" });
      obs.observe(caja);
    } else cargar();
    caja.addEventListener("focusin", cargar);
    // Si alguien envía antes de que cargue el script de MailerLite, no salimos del sitio.
    $("form", caja).addEventListener("submit", (e) => { if (!window.ml_jQuery) { e.preventDefault(); cargar(); } });
  });

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
  const ICONOS = {
    "WhatsApp": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
    "Facebook": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>',
    "X": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
    "LinkedIn": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    "Telegram": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
    "Correo": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    enlace: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    nativo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    listo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  const barraCompartir = (caja, url, titulo, desc) => {
    if (!caja) return;
    const enlaces = REDES.map(([red, f]) => {
      const destino = red === "Correo" ? "" : ' target="_blank" rel="noopener"';
      const texto = red === "Correo" ? "Enviar por correo" : "Compartir en " + red;
      return `<a class="red" href="${esc(f(url, titulo, desc))}"${destino} data-red="${red}" aria-label="${texto}" title="${texto}">${ICONOS[red]}</a>`;
    }).join("");
    caja.innerHTML = `<span class="compartir__lab">Compartir</span>
      <button type="button" class="red red--nativo" data-nativo hidden aria-label="Compartir…" title="Compartir…">${ICONOS.nativo}</button>${enlaces}
      <button type="button" class="red" data-copiar-url aria-label="Copiar enlace" title="Copiar enlace">${ICONOS.enlace}</button>
      <span class="compartir__aviso" role="status" aria-live="polite"></span>`;
    const nativo = caja.querySelector("[data-nativo]");
    if (navigator.share) {
      nativo.hidden = false;
      nativo.addEventListener("click", () => navigator.share({ title: titulo, text: desc || titulo, url }).catch(() => {}));
    }
    const copiar = caja.querySelector("[data-copiar-url]");
    const aviso = caja.querySelector(".compartir__aviso");
    copiar.addEventListener("click", () => {
      const ok = () => {
        copiar.innerHTML = ICONOS.listo; aviso.textContent = "Enlace copiado";
        setTimeout(() => { copiar.innerHTML = ICONOS.enlace; aviso.textContent = ""; }, 1800);
      };
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

  $$("[data-anio]").forEach((e) => (e.textContent = new Date().getFullYear()));

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
  // Lead periodístico en negrita (qué, quién, cuándo); reemplaza a la antigua cifra grande
  const bloqueCifra = (n) => n.lead ? `<p class="lead">${esc(n.lead)}</p>` : "";

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
        <span class="meta">${nombresFuentes(n) ? "Fuentes: " + esc(nombresFuentes(n)) + " · " : ""}${minutos(n)} min de lectura · <a href="${esc(enlace(n))}" style="color:var(--acento)">Leer completa →</a></span>`;

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

  /* ---------- Medición (Google Analytics 4) ----------
     Solo se carga si el lector acepta en el aviso de cookies. La elección se guarda
     en este navegador; «Preferencias de cookies», en el pie, permite cambiarla. */
  const GA_ID = "G-Z0GWP2011V";
  const CLAVE_COOKIES = "tc-cookies";
  const leerEleccion = () => { try { return localStorage.getItem(CLAVE_COOKIES); } catch (e) { return null; } };
  const guardarEleccion = (v) => { try { localStorage.setItem(CLAVE_COOKIES, v); } catch (e) {} };
  let gaCargado = false;
  const cargarGA = () => {
    if (gaCargado) return;
    gaCargado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  };
  const cerrarAviso = (aviso) => aviso.parentNode && aviso.parentNode.removeChild(aviso);
  const avisoCookies = () => {
    if ($(".cookies")) return;
    const aviso = document.createElement("div");
    aviso.className = "cookies";
    aviso.setAttribute("role", "dialog");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.innerHTML = '<p>Usamos cookies de Google Analytics para saber qué noticias se leen y mejorar el sitio. ' +
      'No vendemos tus datos. <a href="privacidad.html#cookies">Más información</a></p>' +
      '<div class="cookies__btns"><button type="button" data-cookies-no>Rechazar</button>' +
      '<button type="button" class="cookies__si" data-cookies-si>Aceptar</button></div>';
    document.body.appendChild(aviso);
    $("[data-cookies-si]", aviso).addEventListener("click", () => { guardarEleccion("si"); cerrarAviso(aviso); cargarGA(); });
    $("[data-cookies-no]", aviso).addEventListener("click", () => {
      guardarEleccion("no"); cerrarAviso(aviso);
      if (gaCargado) location.reload(); // si ya se había cargado, se recarga sin medición
    });
  };
  const eleccion = leerEleccion();
  if (eleccion === "si") cargarGA();
  else if (eleccion !== "no") avisoCookies();
  $$("[data-cookies]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); avisoCookies(); }));

  /* ---------- Multimedia: filtro por tipo ---------- */
  const rejMM = $("[data-mm-rej]");
  if (rejMM) $$("[data-mm-filtro]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-mm-filtro]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$(".mmx__card", rejMM).forEach((c) => { c.hidden = b.dataset.mmFiltro !== "todo" && c.dataset.tipo !== b.dataset.mmFiltro; });
  }));

  /* ---------- Enviar el archivo de video (WhatsApp, Instagram…) desde el celular ---------- */
  const archivosVideo = new Map();
  const traerVideo = (src) => {
    if (!archivosVideo.has(src)) {
      archivosVideo.set(src, fetch(src)
        .then((r) => { if (!r.ok) throw new Error("descarga"); return r.blob(); })
        .then((b) => new File([b], src.split("/").pop(), { type: "video/mp4" }))
        .catch((e) => { archivosVideo.set(src, null); throw e; }));
    }
    return archivosVideo.get(src) || (archivosVideo.clear(), traerVideo(src));
  };
  const puedeEnviar = !!(navigator.share && navigator.canShare) && (() => {
    try { return navigator.canShare({ files: [new File([""], "v.mp4", { type: "video/mp4" })] }); } catch (e) { return false; }
  })();
  const activarEnviar = (btn) => {
    if (!puedeEnviar || btn.dataset.activo) return;
    btn.dataset.activo = "1";
    const etiqueta = btn.textContent;
    // Empieza a bajar el video apenas el dedo toca el botón, para que el menú de compartir abra rápido.
    btn.addEventListener("pointerdown", () => { if (btn.dataset.src) traerVideo(btn.dataset.src).catch(() => {}); });
    btn.addEventListener("click", async () => {
      if (!btn.dataset.src) return;
      btn.disabled = true; btn.textContent = "Preparando…";
      try {
        const archivo = await traerVideo(btn.dataset.src);
        const url = new URL(btn.dataset.url || "", document.baseURI).href;
        await navigator.share({ files: [archivo], title: btn.dataset.titulo, text: `${btn.dataset.titulo} — ${url}` });
        btn.textContent = etiqueta;
      } catch (e) {
        // Si el celular pide volver a tocar (el video tardó en bajar), queda listo para el segundo toque.
        btn.textContent = e && e.name === "NotAllowedError" ? "Listo: toca otra vez" : etiqueta;
      } finally { btn.disabled = false; }
    });
  };
  $$("[data-enviar-video]").forEach((b) => { if (b.dataset.src) { activarEnviar(b); b.hidden = !puedeEnviar; } });
  $$("[data-compartir-url]").forEach((caja) => barraCompartir(caja, new URL(caja.dataset.compartirUrl, document.baseURI).href, caja.dataset.titulo, caja.dataset.desc));

  /* ---------- Multimedia: reproductor encima de la página ---------- */
  const modalMM = $("[data-mmz-modal]");
  if (modalMM && typeof modalMM.showModal === "function") {
    const media = $("[data-mmz-media]", modalMM);
    const cerrarMM = () => { media.innerHTML = ""; if (modalMM.open) modalMM.close(); };
    $$("[data-mmz-ver]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const d = a.dataset;
      media.innerHTML = d.tipo === "video"
        ? `<video controls autoplay playsinline poster="${esc(d.poster)}"><source src="${esc(d.src)}" type="video/mp4"></video>`
        : `<img src="${esc(d.src)}" alt="${esc(d.titulo)}">`;
      $("[data-mmz-titulo]", modalMM).textContent = d.titulo;
      $("[data-mmz-desc]", modalMM).textContent = d.desc;
      const ver = $("[data-mmz-url]", modalMM);
      ver.href = d.url; ver.textContent = d.url.indexOf("m/") === 0 ? "Ver la pieza y sus fuentes" : "Leer la nota";
      $("[data-mmz-bajar]", modalMM).href = d.src;
      const enviar = $("[data-mmz-enviar]", modalMM);
      Object.assign(enviar.dataset, { src: d.tipo === "video" ? d.src : "", titulo: d.titulo, url: d.url });
      activarEnviar(enviar); enviar.hidden = !puedeEnviar || d.tipo !== "video";
      barraCompartir($("[data-mmz-compartir]", modalMM), new URL(d.url, document.baseURI).href, d.titulo, d.desc);
      modalMM.showModal();
    }));
    $("[data-mmz-cerrar]", modalMM).addEventListener("click", cerrarMM);
    modalMM.addEventListener("click", (e) => { if (e.target === modalMM) cerrarMM(); });
    modalMM.addEventListener("close", () => { media.innerHTML = ""; });
  }
})();
