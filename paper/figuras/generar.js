#!/usr/bin/env node
// Genera las figuras del paper (SVG) en esta carpeta y escribe las cifras que cita el texto.
// Uso: node paper/figuras/generar.js
// Contiene solo las funciones del modelo que hacen falta. Licencia MIT (ver LICENSE).
// Unidades: densidades con 8πG/3 = 1 (en un universo plano son los Ω de hoy) y tiempo en 1/H₀.
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const COLORES = ["#2a55c9", "#c25a00", "#1f7a4d", "#b3261e", "#7a3fb8", "#555555"];
const FUENTE = 'font-family="DejaVu Sans, Helvetica, Arial, sans-serif"';

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Números con coma decimal y signo menos tipográfico.
function num(x) {
  if (x === 0) return "0";
  const a = Math.abs(x);
  let s;
  if (a >= 1e4 || a < 1e-3) {
    const e = Math.floor(Math.log10(a));
    const m = x / 10 ** e;
    s = (Math.abs(m - 1) < 1e-9 ? "" : `${Number(m.toPrecision(2))}×`) + `10^${e}`;
  } else s = String(Number(x.toPrecision(3)));
  return s.replace(".", ",").replace(/-/g, "−");
}

function marcas(min, max, n = 5) {
  const crudo = (max - min) / n;
  const pot = 10 ** Math.floor(Math.log10(crudo));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * pot).find((p) => p >= crudo);
  const out = [];
  for (let x = Math.ceil(min / paso - 1e-9) * paso; x <= max + paso * 1e-9; x += paso) out.push(Math.abs(x) < paso * 1e-9 ? 0 : x);
  return out;
}

function potencias(min, max) {
  const out = [];
  for (let k = Math.floor(Math.log10(min)); k <= Math.ceil(Math.log10(max)); k++) out.push(10 ** k);
  return out;
}

// Texto con superíndices para etiquetas del tipo 10^3.
function textoSVG(s) {
  return esc(s).replace(/\^(−?\d+)/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>');
}

/**
 * Gráfico de líneas.
 * op: { series: [{nombre, puntos: [[x,y]], color?, punteada?, grosor?}], xMin, xMax, yMin, yMax,
 *       xEtiqueta, yEtiqueta, logX, logY, verticales: [{x, etiqueta}], horizontales: [{y, etiqueta}],
 *       ancho, alto, leyenda: "arriba" | "abajo" | null }
 */
function grafico(op) {
  const W = op.ancho || 640, H = op.alto || 400;
  const m = { l: 70, r: 18, t: op.leyenda === null ? 16 : 40, b: 56 };
  const tx = (x) => (op.logX ? Math.log10(x) : x);
  const ty = (y) => (op.logY ? Math.log10(y) : y);
  const pts = op.series.flatMap((s) => s.puntos).filter(([x, y]) => isFinite(tx(x)) && isFinite(ty(y)));
  const xMin = op.xMin ?? Math.min(...pts.map((p) => p[0]));
  const xMax = op.xMax ?? Math.max(...pts.map((p) => p[0]));
  const yMin = op.yMin ?? Math.min(...pts.map((p) => p[1]));
  const yMax = op.yMax ?? Math.max(...pts.map((p) => p[1]));
  const X = (x) => m.l + ((tx(x) - tx(xMin)) / (tx(xMax) - tx(xMin))) * (W - m.l - m.r);
  const Y = (y) => H - m.b - ((ty(y) - ty(yMin)) / (ty(yMax) - ty(yMin))) * (H - m.t - m.b);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  const mx = op.logX ? potencias(xMin, xMax) : marcas(xMin, xMax, op.marcasX || 6);
  const my = op.logY ? potencias(yMin, yMax) : marcas(yMin, yMax, op.marcasY || 5);
  for (const x of mx) {
    if (x < xMin - 1e-12 || x > xMax + 1e-12) continue;
    o.push(`<line x1="${X(x)}" y1="${m.t}" x2="${X(x)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(x)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${textoSVG(num(x))}</text>`);
  }
  for (const y of my) {
    if (y < yMin - 1e-12 || y > yMax + 1e-12) continue;
    o.push(`<line x1="${m.l}" y1="${Y(y)}" x2="${W - m.r}" y2="${Y(y)}" stroke="#e3e1db"/>`);
    o.push(`<text x="${m.l - 8}" y="${Y(y) + 4}" text-anchor="end" fill="#333">${textoSVG(num(y))}</text>`);
  }
  o.push(`<rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}" fill="none" stroke="#333"/>`);
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 14}" text-anchor="middle" fill="#111">${textoSVG(op.xEtiqueta)}</text>`);
  if (op.yEtiqueta) o.push(`<text transform="translate(18 ${m.t + (H - m.t - m.b) / 2}) rotate(-90)" text-anchor="middle" fill="#111">${textoSVG(op.yEtiqueta)}</text>`);
  o.push(`<clipPath id="area"><rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}"/></clipPath><g clip-path="url(#area)">`);
  (op.verticales || []).forEach((v, j) => {
    o.push(`<line x1="${X(v.x)}" y1="${m.t}" x2="${X(v.x)}" y2="${H - m.b}" stroke="#666" stroke-dasharray="4 4"/>`);
    // etiquetas escalonadas para que no se pisen si las líneas están cerca
    if (v.etiqueta) o.push(`<text x="${X(v.x) + 5}" y="${m.t + 16 + 15 * j}" fill="#444" font-size="12">${textoSVG(v.etiqueta)}</text>`);
  });
  for (const h of op.horizontales || []) {
    o.push(`<line x1="${m.l}" y1="${Y(h.y)}" x2="${W - m.r}" y2="${Y(h.y)}" stroke="#666" stroke-dasharray="4 4"/>`);
    if (h.etiqueta) o.push(`<text x="${W - m.r - 6}" y="${Y(h.y) - 6}" text-anchor="end" fill="#444" font-size="12">${textoSVG(h.etiqueta)}</text>`);
  }
  op.series.forEach((s, i) => {
    const d = [];
    let abierto = false;
    for (const [x, y] of s.puntos) {
      if (!isFinite(tx(x)) || !isFinite(ty(y))) { abierto = false; continue; }
      d.push(`${abierto ? "L" : "M"}${X(x).toFixed(2)} ${Y(y).toFixed(2)}`);
      abierto = true;
    }
    const color = s.color || COLORES[i % COLORES.length];
    o.push(`<path d="${d.join(" ")}" fill="none" stroke="${color}" stroke-width="${s.grosor || 2.2}"${s.punteada ? ' stroke-dasharray="7 5"' : ""} stroke-linejoin="round"/>`);
  });
  o.push("</g>");
  if (op.leyenda !== null) {
    let lx = m.l;
    op.series.forEach((s, i) => {
      if (!s.nombre) return;
      const color = s.color || COLORES[i % COLORES.length];
      o.push(`<line x1="${lx}" y1="${m.t - 16}" x2="${lx + 22}" y2="${m.t - 16}" stroke="${color}" stroke-width="3"${s.punteada ? ' stroke-dasharray="6 4"' : ""}/>`);
      o.push(`<text x="${lx + 28}" y="${m.t - 12}" fill="#111">${textoSVG(s.nombre)}</text>`);
      lx += 40 + s.nombre.length * 7.2;
    });
  }
  o.push("</svg>");
  return o.join("\n");
}

function guardar(nombre, svg) {
  fs.writeFileSync(path.join(__dirname, nombre + ".svg"), svg + "\n");
  console.log("figura:", nombre + ".svg");
}

/**
 * Barras apiladas horizontales. grupos: [{nombre, partes: [valor...]}], categorias: [nombre...]
 */
function barras(op) {
  const W = op.ancho || 640, alto = op.alturaBarra || 34, sep = op.separacion || 22;
  const m = { l: op.margenIzq || 210, r: 30, t: 54, b: 46 };
  const H = m.t + op.grupos.length * (alto + sep) - sep + m.b;
  const total = op.maximo || Math.max(...op.grupos.map((g) => g.partes.reduce((a, b) => a + b, 0)));
  const X = (v) => m.l + (v / total) * (W - m.l - m.r);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  let lx = m.l;
  op.categorias.forEach((c, i) => {
    o.push(`<rect x="${lx}" y="${m.t - 36}" width="14" height="14" fill="${(op.colores || COLORES)[i]}"/>`);
    o.push(`<text x="${lx + 20}" y="${m.t - 24}" fill="#111">${esc(c)}</text>`);
    lx += 34 + c.length * 7.2;
  });
  for (const v of marcas(0, total, op.marcas || 5)) {
    o.push(`<line x1="${X(v)}" y1="${m.t - 6}" x2="${X(v)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(v)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${num(v)}</text>`);
  }
  op.grupos.forEach((g, k) => {
    const y = m.t + k * (alto + sep);
    o.push(`<text x="${m.l - 10}" y="${y + alto / 2 + 5}" text-anchor="end" fill="#111">${esc(g.nombre)}</text>`);
    let acum = 0;
    g.partes.forEach((v, i) => {
      if (!v) return;
      o.push(`<rect x="${X(acum)}" y="${y}" width="${X(acum + v) - X(acum)}" height="${alto}" fill="${(op.colores || COLORES)[i]}"/>`);
      o.push(`<text x="${(X(acum) + X(acum + v)) / 2}" y="${y + alto / 2 + 5}" text-anchor="middle" fill="#fff" font-weight="bold">${num(v)}</text>`);
      acum += v;
    });
  });
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 10}" text-anchor="middle" fill="#111">${esc(op.xEtiqueta)}</text>`);
  o.push("</svg>");
  return o.join("\n");
}

/** Diagrama de pasos en fila: cajas con número y texto, unidas por flechas. */
function pasos(lista, op = {}) {
  const W = op.ancho || 640, porFila = op.porFila || 3, cw = (W - 40 - (porFila - 1) * 30) / porFila, ch = op.altoCaja || 92;
  const filas = Math.ceil(lista.length / porFila);
  const H = 20 + filas * ch + (filas - 1) * 40 + 20;
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`,
    `<defs><marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#555"/></marker></defs>`];
  const pos = lista.map((_, i) => {
    const f = Math.floor(i / porFila), c = f % 2 === 0 ? i % porFila : porFila - 1 - (i % porFila);
    return { x: 20 + c * (cw + 30), y: 20 + f * (ch + 40) };
  });
  lista.forEach((p, i) => {
    const { x, y } = pos[i];
    o.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="10" fill="#f3f5fc" stroke="${COLORES[0]}" stroke-width="1.5"/>`);
    o.push(`<text x="${x + 12}" y="${y + 24}" fill="${COLORES[0]}" font-weight="bold" font-size="14">${esc(p.titulo)}</text>`);
    (p.lineas || []).forEach((l, j) => o.push(`<text x="${x + 12}" y="${y + 46 + j * 17}" fill="#222">${esc(l)}</text>`));
    if (i + 1 < lista.length) {
      const a = pos[i], b = pos[i + 1];
      if (a.y === b.y) {
        const izq = b.x > a.x;
        o.push(`<line x1="${izq ? a.x + cw : a.x}" y1="${a.y + ch / 2}" x2="${izq ? b.x - 2 : b.x + cw + 2}" y2="${b.y + ch / 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      } else {
        o.push(`<line x1="${a.x + cw / 2}" y1="${a.y + ch}" x2="${b.x + cw / 2}" y2="${b.y - 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      }
    }
  });
  o.push("</svg>");
  return o.join("\n");
}

// ---------------------------------------------------------------------------
// Modelo de Friedmann con materia, radiación, Λ y una componente extra ("nodos") de w constante
// ---------------------------------------------------------------------------
const H0_GYR = 977.8 / 70; // 1/H₀ en miles de millones de años para H₀ = 70 km/s/Mpc

function componentes(p) {
  return [
    { rho: p.materia || 0, w: 0 },
    { rho: p.radiacion || 0, w: 1 / 3 },
    { rho: p.lambda || 0, w: -1 },
    { rho: p.nodos || 0, w: p.w ?? -1 },
  ].filter((c) => c.rho !== 0);
}
// Segunda ecuación de Friedmann: ä = −(a/2) Σ ρᵢ (1 + 3wᵢ) a^(−3(1+wᵢ))
const aceleracion = (a, p) => (-a / 2) * componentes(p).reduce((s, c) => s + c.rho * (1 + 3 * c.w) * a ** (-3 * (1 + c.w)), 0);
const densidadTotal = (a, p) => componentes(p).reduce((s, c) => s + c.rho * a ** (-3 * (1 + c.w)), 0);
// Primera ecuación de Friedmann en a = 1: ȧ₀² = Σρ − k
function velocidadInicial(p) {
  const v2 = densidadTotal(1, p) - (p.k || 0);
  if (v2 < -1e-12) return null;
  return Math.sqrt(Math.max(0, v2)) + (p.empujon || 0);
}
const q0 = (p) => (-aceleracion(1, p)) / velocidadInicial(p) ** 2;

// RK4 con paso adaptativo desde a = 1, hacia adelante (sentido 1) o hacia atrás (−1).
function integrar(p, { sentido = 1, tMax = 3, dt = 0.002, aMin = 1e-3, aMax = 1e6 } = {}) {
  let a = 1, v = velocidadInicial(p), t = 0;
  const pts = [[0, 1]];
  const f = (a_, v_) => [v_, aceleracion(a_, p)];
  let fin = "límite";
  while (Math.abs(t) < tMax) {
    const h = sentido * Math.min(dt, (0.05 * a) / Math.max(Math.abs(v), 1e-12));
    const [k1a, k1v] = f(a, v);
    const [k2a, k2v] = f(a + (h / 2) * k1a, v + (h / 2) * k1v);
    const [k3a, k3v] = f(a + (h / 2) * k2a, v + (h / 2) * k2v);
    const [k4a, k4v] = f(a + h * k3a, v + h * k3v);
    const aN = a + (h / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
    const vN = v + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    if (!(aN > aMin) || !isFinite(aN)) {
      const frac = isFinite(aN) ? (a - aMin) / (a - aN) : 1;
      t += h * Math.max(0, Math.min(1, frac));
      pts.push([t, aMin]);
      fin = sentido > 0 ? "recolapso" : "big bang";
      break;
    }
    a = aN; v = vN; t += h;
    pts.push([t, a]);
    if (a > aMax) { fin = "tope"; break; }
  }
  return { pts, fin, t };
}
const edad = (p) => { const r = integrar(p, { sentido: -1, tMax: 20, dt: 0.001 }); return r.fin === "big bang" ? -r.t : null; };

// Edad por cuadratura, para chequear la integración: t₀ = ∫₀¹ da / ȧ, con ȧ = √(Σρ a^(−1−3w) − k).
function edadCuadratura(p, n = 200000) {
  // cambio de variable a = u² para suavizar el integrando cerca de a = 0
  let s = 0;
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, a = u * u;
    const v = Math.sqrt(componentes(p).reduce((acc, c) => acc + c.rho * a ** (-1 - 3 * c.w), 0) - (p.k || 0));
    s += (2 * u) / v / n;
  }
  return s;
}

const f4 = (x) => Number(x.toPrecision(4));
const ESC = {
  hoy: { materia: 0.3, lambda: 0.7 },
  A: { materia: 0.3, nodos: 0.7, w: -1 },
  B: { materia: 0.3, nodos: 0.7, w: 1 / 3 },
  w02: { materia: 0.3, nodos: 0.7, w: -0.2 },
  eds: { materia: 1 },
  einstein: { materia: 2 / 3, lambda: 1 / 3, k: 1 },
};

// ---------------------------------------------------------------------------
// Cifras del texto
// ---------------------------------------------------------------------------
for (const [n, p] of Object.entries(ESC)) {
  if (n === "einstein") continue;
  const e = edad(p);
  console.log(`${n}: q0 = ${f4(q0(p))}, edad = ${f4(e)}/H0 = ${f4(e * H0_GYR)} Gyr (cuadratura ${f4(edadCuadratura(p))}/H0)`);
}
const analitica = (2 / (3 * Math.sqrt(0.7))) * Math.asinh(Math.sqrt(0.7 / 0.3));
console.log(`ΛCDM analítica: ${f4(analitica)}/H0; con H0 = 67,4 y 73: ${f4(analitica * 977.8 / 67.4)} y ${f4(analitica * 977.8 / 73)} Gyr`);
console.log(`w con q0 = 0: ${f4((-0.3 / 0.7 - 1) / 3)}`);
{
  // Comienzo de la aceleración y de la dominación de Λ, en el pasado
  const aAcel = (0.3 / 1.4) ** (1 / 3), aIgual = (0.3 / 0.7) ** (1 / 3);
  const atras = integrar(ESC.hoy, { sentido: -1, tMax: 2, dt: 0.0005 }).pts;
  const cuando = (aObj) => { for (let i = 1; i < atras.length; i++) if (atras[i][1] < aObj) { const [t1, a1] = atras[i - 1], [t2, a2] = atras[i]; return t1 + ((aObj - a1) * (t2 - t1)) / (a2 - a1); } };
  console.log(`Aceleración desde a = ${f4(aAcel)} (z = ${f4(1 / aAcel - 1)}), hace ${f4(-cuando(aAcel) * H0_GYR)} Gyr`);
  console.log(`Λ domina desde a = ${f4(aIgual)} (z = ${f4(1 / aIgual - 1)}), hace ${f4(-cuando(aIgual) * H0_GYR)} Gyr`);
  const adel = integrar(ESC.hoy, { sentido: 1, tMax: 4 }).pts;
  console.log(`ΛCDM en t = 4/H0: a = ${f4(adel[adel.length - 1][1])}`);
}
// Einstein: inestabilidad
for (const e of [0.001, 0, -0.001]) {
  const r = integrar({ ...ESC.einstein, empujon: e }, { sentido: 1, tMax: 20, dt: 0.002, aMax: 3 });
  console.log(`Einstein, empujón ${e}: fin ${r.fin} en τ = ${f4(r.t)}, a final ${f4(r.pts[r.pts.length - 1][1])}`);
}
console.log(`Linealización: δa = δv sinh τ → δa = 1 en τ = ${f4(Math.asinh(1 / 0.001))}`);
// Gran desgarro
const tRip = (w, om = 0.3) => (2 / 3) / Math.abs(1 + w) / Math.sqrt(1 - om);
for (const w of [-1.5, -1.2]) {
  const r = integrar({ ...ESC.A, w }, { sentido: 1, tMax: 10, dt: 0.001, aMax: 1e6 });
  console.log(`w = ${w}: fórmula de Caldwell et al. ${f4(tRip(w))}/H0 (${f4(tRip(w) * H0_GYR)} Gyr); la integración llega a a = 10^6 en ${f4(r.t)}/H0`);
}
// Acoplamiento cosmológico: M ∝ a^kc → ρ ∝ a^(kc−3) → w = −kc/3
console.log(`kc = 3 → w = ${-3 / 3}`);

// ---------------------------------------------------------------------------
// Figura 1: tamaño del universo en el tiempo para varios escenarios
// ---------------------------------------------------------------------------
const curva = (p, tAtras = 2, tAdel = 3) => {
  const at = integrar(p, { sentido: -1, tMax: tAtras, dt: 0.002 }).pts.slice().reverse();
  const ad = integrar(p, { sentido: 1, tMax: tAdel, dt: 0.002 }).pts.slice(1);
  return [...at, ...ad];
};
guardar("escenarios", grafico({
  series: [
    { nombre: "ΛCDM = A (w = −1)", puntos: curva(ESC.hoy), color: COLORES[0] },
    { nombre: "w = −0,2", puntos: curva(ESC.w02), color: COLORES[2] },
    { nombre: "B (w = 1/3)", puntos: curva(ESC.B), color: COLORES[1] },
    { nombre: "Solo materia", puntos: curva(ESC.eds), color: COLORES[5], punteada: true },
  ],
  xMin: -1.2, xMax: 2, yMin: 0, yMax: 6,
  verticales: [{ x: 0, etiqueta: "hoy" }],
  xEtiqueta: "Tiempo desde hoy, H₀ t", yEtiqueta: "Factor de escala a",
}));

// ---------------------------------------------------------------------------
// Figura 2: q₀ y edad en función de w (Ωm = 0,3, Ωn = 0,7)
// ---------------------------------------------------------------------------
const ws = [];
for (let w = -1.5; w <= 1.0001; w += 0.05) ws.push(Number(w.toFixed(2)));
guardar("desaceleracion", grafico({
  series: [{ nombre: "q₀ = [Ωm + Ωn (1 + 3w)] / 2", puntos: ws.map((w) => [w, q0({ ...ESC.A, w })]), color: COLORES[0] }],
  xMin: -1.5, xMax: 1, yMin: -1.2, yMax: 1.6,
  horizontales: [{ y: 0, etiqueta: "q₀ = 0" }],
  verticales: [{ x: -1 / 3, etiqueta: "w = −1/3" }, { x: (-0.3 / 0.7 - 1) / 3, etiqueta: "w ≈ −0,48" }],
  xEtiqueta: "Ecuación de estado de los nodos, w", yEtiqueta: "Parámetro de desaceleración q₀",
}));
guardar("edad", grafico({
  series: [
    { nombre: "Integración RK4", puntos: ws.map((w) => [w, edad({ ...ESC.A, w }) * H0_GYR]), color: COLORES[1] },
    { nombre: "Cuadratura", puntos: ws.map((w) => [w, edadCuadratura({ ...ESC.A, w }, 20000) * H0_GYR]), color: COLORES[0], punteada: true },
  ],
  xMin: -1.5, xMax: 1, yMin: 0, yMax: 20,
  horizontales: [{ y: 13.8, etiqueta: "Planck: 13,8 mil millones de años" }],
  xEtiqueta: "Ecuación de estado de los nodos, w", yEtiqueta: "Edad (miles de millones de años)",
}));

// ---------------------------------------------------------------------------
// Figura 3: inestabilidad del universo de Einstein
// ---------------------------------------------------------------------------
const tau = Array.from({ length: 241 }, (_, i) => i * 0.05);
const ein = (e) => integrar({ ...ESC.einstein, empujon: e }, { sentido: 1, tMax: 12, dt: 0.002, aMax: 3 }).pts;
guardar("einstein", grafico({
  series: [
    { nombre: "Empujón +0,001", puntos: ein(0.001), color: COLORES[1] },
    { nombre: "Sin empujón", puntos: ein(0), color: COLORES[5] },
    { nombre: "Empujón −0,001", puntos: ein(-0.001), color: COLORES[0] },
    { nombre: "Lineal: 1 ± 0,001 sinh τ", puntos: tau.map((t) => [t, 1 + 0.001 * Math.sinh(t)]), color: COLORES[1], punteada: true, grosor: 1.4 },
    { nombre: "", puntos: tau.map((t) => [t, 1 - 0.001 * Math.sinh(t)]), color: COLORES[0], punteada: true, grosor: 1.4 },
  ],
  xMin: 0, xMax: 12, yMin: 0, yMax: 2.5,
  xEtiqueta: "Tiempo τ (unidades con 8πG/3 = 1)", yEtiqueta: "Factor de escala a",
}));

// ---------------------------------------------------------------------------
// Figura 4: el gran desgarro
// ---------------------------------------------------------------------------
const futuro = (w) => integrar({ ...ESC.A, w }, { sentido: 1, tMax: 5, dt: 0.001, aMax: 1e6 }).pts;
guardar("desgarro", grafico({
  series: [
    { nombre: "w = −1,5", puntos: futuro(-1.5), color: COLORES[3] },
    { nombre: "w = −1,2", puntos: futuro(-1.2), color: COLORES[1] },
    { nombre: "w = −1 (ΛCDM)", puntos: futuro(-1), color: COLORES[0] },
  ],
  logY: true, xMin: 0, xMax: 5, yMin: 1, yMax: 1e6,
  verticales: [{ x: tRip(-1.5), etiqueta: "t_rip(−1,5)" }, { x: tRip(-1.2), etiqueta: "t_rip(−1,2)" }],
  xEtiqueta: "Tiempo desde hoy, H₀ t", yEtiqueta: "Factor de escala a",
}));
