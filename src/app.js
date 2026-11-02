// Interfaz: escenarios, deslizadores y la curva a(t).
(() => {
  const $ = (id) => document.getElementById(id);
  const num = (x, d = 2) => Number(x.toFixed(d)).toLocaleString("es-AR");
  const CONTROLES = [
    ["materia", "Materia (Ωm)", 0, 3, 0.01],
    ["radiacion", "Radiación (Ωr)", 0, 0.5, 0.01],
    ["lambda", "Constante cosmológica (ΩΛ)", 0, 2, 0.01],
    ["nodos", "Nodos (Ωn)", 0, 2, 0.01],
    ["w", "Ecuación de estado de los nodos (w)", -1.5, 1, 0.01],
    ["k", "Curvatura (k > 0: cerrado)", -1, 3, 0.01],
    ["empujon", "Empujón inicial extra", -0.01, 0.01, 0.0005],
  ];
  const params = { ...Cosmos.ESCENARIOS.hoy };
  let activo = "hoy";

  for (const [k, e] of Object.entries(Cosmos.ESCENARIOS)) {
    const b = document.createElement("button");
    b.textContent = e.nombre;
    b.dataset.k = k;
    b.addEventListener("click", () => { activo = k; Object.assign(params, e); escribir(); render(); });
    $("escenarios").appendChild(b);
  }
  for (const [k, nombre, min, max, paso] of CONTROLES) {
    $("sliders").insertAdjacentHTML("beforeend",
      `<label for="c-${k}">${nombre} <span class="val" id="v-${k}"></span></label>
       <input type="range" id="c-${k}" min="${min}" max="${max}" step="${paso}">`);
  }
  for (const [k] of CONTROLES) {
    $("c-" + k).addEventListener("input", () => { params[k] = parseFloat($("c-" + k).value); activo = null; render(); });
  }

  function escribir() {
    for (const [k] of CONTROLES) $("c-" + k).value = params[k];
  }

  function serie(p) {
    const r = Cosmos.resumen(p);
    if (!r.posible) return { r, puntos: [] };
    const atras = r.atras.pts.slice().reverse().map((x) => [x.t * Cosmos.H0_GYR, x.a]);
    const adelante = r.adelante.pts.map((x) => [x.t * Cosmos.H0_GYR, x.a]);
    const todos = atras.concat(adelante.slice(1));
    const paso = Math.max(1, Math.floor(todos.length / 400));
    return { r, puntos: todos.filter((_, i) => i % paso === 0 || i === todos.length - 1) };
  }

  function render() {
    document.querySelectorAll("#escenarios button").forEach((b) => b.classList.toggle("activo", b.dataset.k === activo));
    for (const [k, , , , paso] of CONTROLES) $("v-" + k).textContent = num(params[k], paso < 0.01 ? 4 : 2);

    const { r, puntos } = serie(params);
    const ef = Cosmos.efecto(params.w);
    $("s-nodos").textContent = params.nodos === 0 ? "No hay" : ef === "empuja" ? "Empujan" : ef === "frena" ? "Frenan" : "Neutros";
    if (!r.posible) {
      for (const id of ["s-acelera", "s-edad", "s-destino"]) $(id).textContent = "—";
      $("txt-res").textContent = "Con esta curvatura la densidad no alcanza: no existe un universo que hoy se expanda con este contenido.";
      Grafico.lineas($("g-a"), { series: [], alto: 280 });
      return;
    }
    const quieto = r.q0 === null || Math.abs(r.q0) < 1e-6;
    $("s-acelera").textContent = quieto ? "Casi quieto" : r.acelera ? "Sí" : "No";
    $("s-edad").textContent = quieto ? "No aplica" : r.edad === null ? "Más de 280 mil millones de años" : num(r.edad * Cosmos.H0_GYR, 1) + " mil millones de años";
    $("s-destino").textContent = { recolapso: "Recolapsa", quieto: "Se queda quieto", expansion: "Sigue expandiéndose" }[r.destino];
    const sobreNodos = params.nodos === 0 ? "" : ` Los nodos tienen w = ${num(params.w)}, ${ef === "empuja" ? "menor" : ef === "frena" ? "mayor" : "igual"} que −1/3.`;
    $("txt-res").textContent = quieto
      ? "Universo casi estático: la atracción de la materia y el empuje de la constante cosmológica se compensan. Pero el equilibrio es inestable: con el empujón en 0 se queda quieto; con cualquier empujón, a favor o en contra, se escapa (Eddington, 1930)."
      : `Parámetro de desaceleración hoy: q₀ = ${num(r.q0)} (${r.acelera ? "negativo: acelera" : "positivo: frena"}).` + sobreNodos;

    const ref = serie(Cosmos.ESCENARIOS.hoy).puntos;
    const series = [{ nombre: "Este universo", puntos }];
    if (activo !== "hoy") series.push({ nombre: "Universo de hoy (ΛCDM)", puntos: ref, punteada: true });
    const xs = puntos.map((p) => p[0]);
    Grafico.lineas($("g-a"), {
      series,
      xMin: Math.max(-40, Math.min(...xs, -14)), xMax: Math.max(...xs),
      yMin: 0, yMax: Math.min(6, Math.max(2, ...puntos.map((p) => p[1]))),
      xEtiqueta: "tiempo desde hoy (miles de millones de años)", yEtiqueta: "tamaño relativo a hoy (a)",
      verticales: [{ x: 0, etiqueta: "hoy" }],
      alto: 280,
    });
  }

  window.addEventListener("resize", render);
  escribir();
  render();
})();
