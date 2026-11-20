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

  /* --- Copiar enlace --- */
  document.querySelectorAll("[data-copiar]").forEach((b) => b.addEventListener("click", () => {
    navigator.clipboard && navigator.clipboard.writeText(location.href);
    b.textContent = "¡Copiado!";
    setTimeout(() => (b.textContent = "Copiar enlace"), 1800);
  }));
})();
