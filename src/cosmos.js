// Modelo de juguete de Friedmann con una componente extra: los "nodos".
//
// Unidades: tiempo en 1/H₀ y densidades en unidades donde 8πG/3 = 1, así que
// para un universo que hoy se expande a ritmo H₀ las densidades son los Ω de
// siempre. Cada componente tiene densidad ρᵢ·a^(−3(1+wᵢ)), donde w es la
// ecuación de estado (presión / densidad):
//   materia w = 0, radiación w = 1/3, constante cosmológica w = −1,
//   nodos: w elegible.
//
// Se integra la segunda ecuación de Friedmann (la de la aceleración):
//   ä = −(a/2) · Σ ρᵢ · (1 + 3wᵢ) · a^(−3(1+wᵢ))
// Cada componente frena si w > −1/3 y empuja si w < −1/3: la presión negativa
// suficiente acelera la expansión. La curvatura k no entra en ä, solo en el
// ritmo inicial: ȧ₀² = Σ ρᵢ − k.
const Cosmos = (() => {
  const H0_GYR = 13.97; // 1/H₀ en miles de millones de años, para H₀ = 70 km/s/Mpc

  const ESCENARIOS = {
    hoy: { nombre: "Universo de hoy (ΛCDM)", materia: 0.3, radiacion: 0, lambda: 0.7, nodos: 0, w: -1, k: 0, empujon: 0 },
    empujan: { nombre: "A: los nodos empujan (presión negativa)", materia: 0.3, radiacion: 0, lambda: 0, nodos: 0.7, w: -1, k: 0, empujon: 0 },
    frenan: { nombre: "B: los nodos frenan (presión positiva)", materia: 0.3, radiacion: 0, lambda: 0, nodos: 0.7, w: 1 / 3, k: 0, empujon: 0 },
    einstein: { nombre: "Einstein 1917: universo estático", materia: 2 / 3, radiacion: 0, lambda: 1 / 3, nodos: 0, w: -1, k: 1, empujon: 0.001 },
  };

  function componentes(p) {
    return [
      { rho: p.materia, w: 0 },
      { rho: p.radiacion, w: 1 / 3 },
      { rho: p.lambda, w: -1 },
      { rho: p.nodos, w: p.w },
    ].filter((c) => c.rho !== 0);
  }

  function aceleracion(a, p) {
    let s = 0;
    for (const c of componentes(p)) s += c.rho * (1 + 3 * c.w) * Math.pow(a, -3 * (1 + c.w));
    return (-a / 2) * s;
  }

  function densidadTotal(a, p) {
    let s = 0;
    for (const c of componentes(p)) s += c.rho * Math.pow(a, -3 * (1 + c.w));
    return s;
  }

  // Ritmo de expansión inicial (a = 1). Si Σρ − k < 0, el escenario no es posible.
  // "empujon" se suma para perturbar un universo estático.
  function velocidadInicial(p) {
    const v2 = densidadTotal(1, p) - p.k;
    if (v2 < -1e-12) return null;
    return Math.sqrt(Math.max(0, v2)) + (p.empujon || 0);
  }

  // Parámetro de desaceleración q = −ä·a / ȧ². Negativo = la expansión se acelera.
  function desaceleracion(a, v, p) {
    return v === 0 ? null : (-aceleracion(a, p) * a) / (v * v);
  }

  // Integra con RK4 desde a = 1 hacia adelante o hacia atrás en el tiempo.
  // Se detiene si a cae por debajo de aMin (big bang o big crunch) o al llegar a tMax.
  function integrar(p, { sentido = 1, tMax = 3, dt = 0.002, aMin = 1e-3 } = {}) {
    const v0 = velocidadInicial(p);
    if (v0 === null) return null;
    let a = 1, v = v0, t = 0;
    const pts = [{ t: 0, a, v }];
    const f = (a_, v_) => [v_, aceleracion(a_, p)];
    let fin = "límite";
    while (Math.abs(t) < tMax) {
      // Paso adaptativo: cerca de a → 0 el ritmo se dispara y un paso fijo
      // llevaría a a valores negativos.
      const h = sentido * Math.min(dt, (0.05 * a) / Math.max(Math.abs(v), 1e-12));
      const [k1a, k1v] = f(a, v);
      const [k2a, k2v] = f(a + (h / 2) * k1a, v + (h / 2) * k1v);
      const [k3a, k3v] = f(a + (h / 2) * k2a, v + (h / 2) * k2v);
      const [k4a, k4v] = f(a + h * k3a, v + h * k3v);
      const aN = a + (h / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
      const vN = v + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
      if (!(aN > aMin) || !isFinite(aN)) {
        // Interpolación lineal al momento en que a cruza aMin.
        const frac = isFinite(aN) ? (a - aMin) / (a - aN) : 1;
        t += h * Math.max(0, Math.min(1, frac));
        pts.push({ t, a: aMin, v: vN });
        fin = sentido > 0 ? "recolapso" : "big bang";
        break;
      }
      a = aN; v = vN; t += h;
      pts.push({ t, a, v });
      if (a > 1e6) { fin = "límite"; break; }
    }
    return { pts, fin };
  }

  // Un universo casi estático evoluciona muy lento: se lo sigue por más tiempo.
  function resumen(p) {
    const v0 = velocidadInicial(p);
    if (v0 === null) return { posible: false };
    const casiEstatico = Math.abs(v0) < 0.01;
    const atras = integrar(p, { sentido: -1, tMax: 20, dt: 0.001 });
    const adelante = integrar(p, { sentido: 1, tMax: casiEstatico ? 20 : 4 });
    const q0 = desaceleracion(1, v0, p);
    return {
      posible: true,
      q0,
      acelera: q0 !== null && q0 < 0,
      edad: atras.fin === "big bang" ? -atras.pts[atras.pts.length - 1].t : null,
      casiEstatico,
      destino: adelante.fin === "recolapso" ? "recolapso"
        : casiEstatico && Math.abs(adelante.pts[adelante.pts.length - 1].a - 1) < 0.01 ? "quieto" : "expansion",
      atras,
      adelante,
    };
  }

  // ¿Esta componente empuja o frena? Depende solo del signo de 1 + 3w.
  function efecto(w) {
    if (Math.abs(1 + 3 * w) < 1e-12) return "neutro";
    return 1 + 3 * w < 0 ? "empuja" : "frena";
  }

  return { H0_GYR, ESCENARIOS, aceleracion, densidadTotal, velocidadInicial, desaceleracion, integrar, resumen, efecto };
})();

if (typeof module !== "undefined") module.exports = Cosmos;
