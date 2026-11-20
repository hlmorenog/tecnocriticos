/* TECNOCRÍTICOS — interacciones del portal */
(function () {
  const raiz = document.documentElement;

  /* --- Tema claro / oscuro (se recuerda por visitante) --- */
  try {
    const guardado = localStorage.getItem("tc-tema");
    if (guardado) raiz.setAttribute("data-theme", guardado);
  } catch (e) {}
  const btnTema = document.querySelector("[data-tema]");
  const esOscuro = () =>
    raiz.getAttribute("data-theme") === "dark" ||
    (!raiz.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
  const pintarBoton = () => { if (btnTema) btnTema.textContent = esOscuro() ? "☀ Modo claro" : "◐ Modo oscuro"; };
  if (btnTema) {
    pintarBoton();
    btnTema.addEventListener("click", () => {
      const nuevo = esOscuro() ? "light" : "dark";
      raiz.setAttribute("data-theme", nuevo);
      try { localStorage.setItem("tc-tema", nuevo); } catch (e) {}
      pintarBoton();
    });
  }

  /* --- Fecha de hoy --- */
  const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  document.querySelectorAll("[data-fecha]").forEach((el) => {
    el.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  });

  /* --- Menú móvil y buscador --- */
  const nav = document.querySelector(".nav");
  const hamb = document.querySelector(".nav__hamb");
  if (hamb) hamb.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    hamb.setAttribute("aria-expanded", abierto);
  });
  const btnBuscar = document.querySelector(".nav__buscar");
  const buscador = document.querySelector(".buscador");
  if (btnBuscar && buscador) btnBuscar.addEventListener("click", () => {
    buscador.classList.toggle("abierto");
    if (buscador.classList.contains("abierto")) buscador.querySelector("input").focus();
  });

  /* --- Encuesta de La Mesa --- */
  const debate = document.querySelector(".debate");
  if (debate) {
    const opciones = [...debate.querySelectorAll(".opcion")];
    const total = debate.querySelector("[data-total]");
    const pintar = (elegida) => {
      const votos = opciones.map((o, i) => Number(o.dataset.votos) + (i === elegida ? 1 : 0));
      const suma = votos.reduce((a, b) => a + b, 0);
      opciones.forEach((o, i) => {
        const pct = Math.round((votos[i] / suma) * 100);
        o.querySelector(".opcion__fondo").style.width = pct + "%";
        o.querySelector(".opcion__pct").textContent = pct + "%";
        o.setAttribute("aria-pressed", i === elegida);
        o.disabled = true;
      });
      debate.classList.add("votado");
      if (total) total.textContent = suma.toLocaleString("es-ES") + " votos";
    };
    let previo = null;
    try { previo = localStorage.getItem("tc-voto-" + debate.dataset.id); } catch (e) {}
    if (previo !== null) pintar(Number(previo));
    opciones.forEach((o, i) => o.addEventListener("click", () => {
      pintar(i);
      try { localStorage.setItem("tc-voto-" + debate.dataset.id, i); } catch (e) {}
    }));
  }

  /* --- Onda del reproductor --- */
  const onda = document.querySelector(".onda");
  if (onda) {
    let html = "";
    for (let i = 0; i < 64; i++) {
      const h = 18 + Math.abs(Math.sin(i * 0.55) * 60) + ((i * 37) % 22);
      html += `<i style="height:${Math.min(h, 100)}%" class="${i < 22 ? "on" : ""}"></i>`;
    }
    onda.innerHTML = html;
  }

  /* --- Boletín (demo: conectar a tu proveedor de email) --- */
  document.querySelectorAll("[data-boletin]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.outerHTML = '<p class="boletin__ok">✓ Listo. Revisa tu bandeja: te llegará el primer Boletín Crítico el lunes.</p>';
    });
  });

  /* --- Barra de progreso de lectura (página de columna) --- */
  const barra = document.querySelector(".barra-progreso");
  const cuerpo = document.querySelector(".cuerpo");
  if (barra && cuerpo) {
    const act = () => {
      const r = cuerpo.getBoundingClientRect();
      const avance = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1);
      barra.style.width = avance * 100 + "%";
    };
    addEventListener("scroll", act, { passive: true });
    act();
  }

  /* --- Noticias diarias (archivos noticias/AAAA-MM-DD.json) --- */
  const SECCIONES = {
    "Colombia": { clase: "img--co", glifo: "CO" },
    "IA y tecnología": { clase: "img--ia", glifo: "IA" },
    "Videojuegos y series": { clase: "img--juegos", glifo: "▶" },
  };
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const urlSegura = (u) => (/^https?:\/\//i.test(u || "") ? esc(u) : "#");
  const diaBogota = (d) => new Date(d.getTime() - 5 * 3600e3).toISOString().slice(0, 10);
  const fechaLarga = (iso) => {
    const t = new Date(iso + "T12:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const haceCuanto = (iso) => {
    const dias = Math.round((new Date(diaBogota(new Date()) + "T12:00:00") - new Date(iso + "T12:00:00")) / 864e5);
    return dias <= 0 ? "Hoy" : dias === 1 ? "Ayer" : "Hace " + dias + " días";
  };

  async function cargarNoticias(dias) {
    const hoy = Date.now();
    const fechas = Array.from({ length: dias }, (_, i) => diaBogota(new Date(hoy - i * 864e5)));
    const ediciones = await Promise.all(fechas.map((f) =>
      fetch("noticias/" + f + ".json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null)).catch(() => null)));
    return ediciones.filter((e) => e && Array.isArray(e.noticias) && e.noticias.length)
      .map((e) => ({ fecha: e.fecha, noticias: e.noticias.map((n) => ({ ...n, fecha: e.fecha })) }));
  }

  const tarjeta = (n) => {
    const s = SECCIONES[n.seccion] || SECCIONES["IA y tecnología"];
    const enlace = "noticias.html#" + esc(n.id);
    return `<article class="tarjeta">
      <a href="${enlace}" class="img ${s.clase}" data-glifo="${esc(s.glifo)}"><span class="chip">${esc(n.seccion)}</span></a>
      <h3 class="titular"><a href="${enlace}">${esc(n.titular)}</a></h3>
      <p class="entradilla">${esc(n.entradilla)}</p>
      <span class="meta">${haceCuanto(n.fecha)}</span>
    </article>`;
  };

  // Portada: la noticia más importante como principal y las tres siguientes como secundarias.
  // Si no hay noticias (por ejemplo, al abrir el HTML desde el PC), se queda el contenido fijo.
  const principal = document.querySelector(".portada .principal");
  const secundarias = document.querySelector(".portada .secundarias");
  const llenarPortada = (todas) => {
    if (!principal || !secundarias || !todas.length) return 0;
    const n = todas[0];
    const s = SECCIONES[n.seccion] || SECCIONES["IA y tecnología"];
    const enlace = "noticias.html#" + esc(n.id);
    principal.innerHTML = `
      <a href="${enlace}" class="img ${s.clase}" data-glifo="${esc(s.glifo)}"><span class="chip">Noticia</span></a>
      <span class="etiqueta" style="display:block;margin-top:16px">${esc(n.seccion)}</span>
      <h1 class="titular"><a href="${enlace}">${esc(n.titular)}</a></h1>
      <p class="entradilla">${esc(n.entradilla)}</p>
      <span class="meta">${haceCuanto(n.fecha)} · ${esc(fechaLarga(n.fecha))}</span>`;
    const resto = todas.slice(1, 4);
    if (resto.length) {
      secundarias.innerHTML = resto.map((m) => `
        <article>
          <span class="etiqueta">${esc(m.seccion)}</span>
          <h2 class="titular"><a href="noticias.html#${esc(m.id)}">${esc(m.titular)}</a></h2>
          <span class="meta">${haceCuanto(m.fecha)}</span>
        </article>`).join("");
    }
    return 1 + resto.length;
  };

  // Rejilla de noticias (las que no caben en la portada) + cinta de "última hora"
  const rejillaPortada = document.querySelector("[data-noticias-portada]");
  const cinta = document.querySelector("[data-cinta]");
  if (rejillaPortada || cinta || principal) {
    cargarNoticias(10).then((eds) => {
      const todas = eds.flatMap((e) => e.noticias);
      const enPortada = llenarPortada(todas);
      if (rejillaPortada) {
        const siguientes = todas.slice(enPortada, enPortada + 4);
        rejillaPortada.innerHTML = siguientes.length
          ? siguientes.map(tarjeta).join("")
          : todas.length
            ? '<p class="noticias-vacio">Todas las noticias de hoy están arriba. <a href="noticias.html">Ver el archivo completo</a>.</p>'
            : '<p class="noticias-vacio">La primera edición de noticias llega muy pronto.</p>';
      }
      if (cinta) {
        const titulares = todas.slice(0, 6).map((n) =>
          `<a href="noticias.html#${esc(n.id)}">${esc(n.titular)}</a>`).join("");
        if (titulares) cinta.innerHTML = titulares + titulares; // duplicado para el desplazamiento continuo
        else cinta.closest(".ticker").hidden = true;
      }
    });
  }

  // Página de noticias: archivo completo con filtro por sección
  const archivo = document.querySelector("[data-noticias-archivo]");
  if (archivo) {
    const filtros = document.querySelector("[data-filtros]");
    let ediciones = [];
    let filtro = "Todas";
    const pintarArchivo = () => {
      const html = ediciones.map((e) => {
        const lista = e.noticias.filter((n) => filtro === "Todas" || n.seccion === filtro);
        if (!lista.length) return "";
        return `<section class="edicion">
          <h2 class="edicion__fecha">${fechaLarga(e.fecha)}</h2>
          ${lista.map((n) => {
            const s = SECCIONES[n.seccion] || SECCIONES["IA y tecnología"];
            const cuerpo = (Array.isArray(n.cuerpo) ? n.cuerpo : [n.cuerpo]).map((p) => `<p>${esc(p)}</p>`).join("");
            const fuentes = (n.fuentes || []).map((f) =>
              `<li><a href="${urlSegura(f.url)}" target="_blank" rel="noopener">${esc(f.nombre || f.url)}</a></li>`).join("");
            return `<article class="noticia" id="${esc(n.id)}">
              <span class="etiqueta noticia__seccion">${esc(n.seccion)}</span>
              <h3 class="titular noticia__titular">${esc(n.titular)}</h3>
              <p class="entradilla">${esc(n.entradilla)}</p>
              <div class="noticia__cuerpo">${cuerpo}</div>
              ${n.mirada ? `<p class="noticia__mirada"><strong>La mirada crítica.</strong> ${esc(n.mirada)}</p>` : ""}
              ${fuentes ? `<div class="noticia__fuentes"><span>Fuentes</span><ul>${fuentes}</ul></div>` : ""}
            </article>`;
          }).join("")}
        </section>`;
      }).join("");
      archivo.innerHTML = html || '<p class="noticias-vacio">Todavía no hay noticias publicadas en esta sección.</p>';
    };
    if (filtros) filtros.addEventListener("click", (ev) => {
      const b = ev.target.closest("button[data-seccion]");
      if (!b) return;
      filtro = b.dataset.seccion;
      filtros.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      pintarArchivo();
    });
    cargarNoticias(60).then((eds) => {
      ediciones = eds;
      pintarArchivo();
      if (location.hash) {
        const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (el) { el.classList.add("noticia--destacada"); el.scrollIntoView(); }
      }
    });
  }

  /* --- Copiar enlace --- */
  document.querySelectorAll("[data-copiar]").forEach((b) => b.addEventListener("click", () => {
    navigator.clipboard && navigator.clipboard.writeText(location.href);
    b.textContent = "¡Copiado!";
    setTimeout(() => (b.textContent = "Copiar enlace"), 1800);
  }));
})();
