/* Ilustraciones propias de los dos plegables (dibujos de Tecnocríticos, sin logos). */
(() => {
  const lentes = (pos, r, fondo) => pos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fondo}" stroke="#555" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r * 0.48}" fill="#0b1020"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${r * 0.16}" fill="#9fb4ff" opacity=".7"/>`).join("");
  // iPhone Duo: más ancho y corto, marco plateado, pantalla interior mate.
  const duo = (id) => `<svg viewBox="0 0 340 280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dm${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2d31"/><stop offset="1" stop-color="#1a1b1e"/></linearGradient>
      <linearGradient id="dp${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9E9E4"/><stop offset=".5" stop-color="#C9CAC6"/><stop offset="1" stop-color="#E4E4DF"/></linearGradient>
      <linearGradient id="dw${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E9AAF"/><stop offset=".55" stop-color="#C7B7A3"/><stop offset="1" stop-color="#6E7C91"/></linearGradient>
    </defs>
    <g transform="translate(262 20)"><rect x="0" y="0" width="70" height="236" rx="18" fill="url(#dp${id})" stroke="#9a9a94" stroke-width="3"/>
      <rect x="8" y="10" width="54" height="60" rx="16" fill="#D8D8D3" stroke="#9a9a94" stroke-width="2"/>${lentes([[24, 28], [46, 52]], 10, "#2a2a2a")}</g>
    <rect x="8" y="30" width="268" height="232" rx="26" fill="url(#dp${id})" stroke="#9a9a94" stroke-width="3"/>
    <rect x="20" y="42" width="244" height="208" rx="16" fill="url(#dm${id})"/>
    <rect x="20" y="42" width="244" height="208" rx="16" fill="url(#dw${id})" opacity=".55"/>
    <rect x="20" y="42" width="244" height="208" rx="16" fill="#fff" opacity=".06"/>
    <line x1="142" y1="44" x2="142" y2="248" stroke="#000" stroke-opacity=".18" stroke-width="2"/>
    <circle cx="232" cy="58" r="5" fill="#0b0b0b"/>
    <g fill="#fff" opacity=".85"><rect x="40" y="70" width="80" height="8" rx="4"/><rect x="40" y="88" width="64" height="8" rx="4"/><rect x="40" y="106" width="76" height="8" rx="4"/><rect x="40" y="124" width="58" height="8" rx="4"/></g>
  </svg>`;
  // Galaxy Z Fold 8: más alto y delgado, marco azul oscuro, pantalla brillante.
  const fold = (id) => `<svg viewBox="0 0 340 280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fw${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F6FED"/><stop offset=".5" stop-color="#7B4BE0"/><stop offset="1" stop-color="#14B8C8"/></linearGradient>
      <linearGradient id="fp${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2A3A5E"/><stop offset=".5" stop-color="#1B2742"/><stop offset="1" stop-color="#2E4068"/></linearGradient>
      <linearGradient id="fb${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <g transform="translate(250 6)"><rect x="0" y="0" width="76" height="266" rx="14" fill="url(#fp${id})" stroke="#0f1830" stroke-width="3"/>
      <rect x="10" y="12" width="30" height="104" rx="15" fill="#16213a"/>${lentes([[25, 30], [25, 64], [25, 98]], 11, "#1f2b48")}</g>
    <rect x="18" y="8" width="234" height="264" rx="16" fill="url(#fp${id})" stroke="#0f1830" stroke-width="3"/>
    <rect x="27" y="17" width="216" height="246" rx="8" fill="url(#fw${id})"/>
    <rect x="27" y="17" width="216" height="246" rx="8" fill="url(#fb${id})"/>
    <line x1="135" y1="19" x2="135" y2="261" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
    <circle cx="218" cy="32" r="5" fill="#0b0b0b"/>
    <g fill="#fff" opacity=".9"><rect x="44" y="190" width="70" height="44" rx="10" opacity=".35"/><rect x="152" y="190" width="70" height="44" rx="10" opacity=".35"/><rect x="44" y="60" width="90" height="10" rx="5"/><rect x="44" y="80" width="60" height="10" rx="5"/></g>
  </svg>`;
  let n = 0;
  window.TEL = (k) => (k === "a" ? duo : fold)(++n);
  window.TELINFO = { a: { marca: "Apple", nombre: "iPhone Duo" }, b: { marca: "Samsung", nombre: "Galaxy Z Fold 8" } };
})();
