const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/cosmos.js");

const cerca = (a, b, eps, msg) => assert.ok(Math.abs(a - b) < eps, msg || `${a} ≈ ${b}`);
const base = { materia: 0, radiacion: 0, lambda: 0, nodos: 0, w: -1, k: 0, empujon: 0 };

test("ΛCDM: q₀ = Ωm/2 − ΩΛ = −0,55 y la edad es 0,964/H₀", () => {
  const r = C.resumen(C.ESCENARIOS.hoy);
  cerca(r.q0, -0.55, 1e-9);
  assert.equal(r.acelera, true);
  cerca(r.edad, 0.964, 0.005, `edad ${r.edad}`);
});

test("solo materia (Einstein–de Sitter): edad 2/3 y q₀ = 1/2", () => {
  const r = C.resumen({ ...base, materia: 1 });
  cerca(r.q0, 0.5, 1e-9);
  cerca(r.edad, 2 / 3, 0.005, `edad ${r.edad}`);
});

test("nodos con w = −1 se comportan igual que la constante cosmológica", () => {
  const a = C.resumen(C.ESCENARIOS.hoy);
  const b = C.resumen(C.ESCENARIOS.empujan);
  cerca(a.q0, b.q0, 1e-12);
  cerca(a.edad, b.edad, 1e-9);
});

test("presión negativa empuja, positiva frena; el límite es w = −1/3", () => {
  assert.equal(C.efecto(-1), "empuja");
  assert.equal(C.efecto(-0.5), "empuja");
  assert.equal(C.efecto(-1 / 3), "neutro");
  assert.equal(C.efecto(0), "frena");
  assert.equal(C.efecto(1 / 3), "frena");
  assert.equal(C.resumen(C.ESCENARIOS.frenan).acelera, false);
});

test("Einstein 1917: sin empujón se queda quieto, con empujón se escapa", () => {
  const quieto = C.integrar({ ...C.ESCENARIOS.einstein, empujon: 0 }, { tMax: 5 });
  const ultimo = quieto.pts[quieto.pts.length - 1];
  cerca(ultimo.a, 1, 1e-9);
  const empujado = C.integrar(C.ESCENARIOS.einstein, { tMax: 12 });
  assert.ok(empujado.pts[empujado.pts.length - 1].a > 1.5, "una perturbación chica crece");
  const frenado = C.integrar({ ...C.ESCENARIOS.einstein, empujon: -0.001 }, { tMax: 30 });
  assert.equal(frenado.fin, "recolapso", "hacia el otro lado, colapsa");
});

test("universo cerrado con mucha materia recolapsa", () => {
  const r = C.resumen({ ...base, materia: 3, k: 2 });
  assert.equal(r.destino, "recolapso");
  assert.equal(C.resumen({ ...C.ESCENARIOS.einstein, empujon: 0 }).destino, "quieto");
  assert.equal(C.resumen(C.ESCENARIOS.einstein).destino, "expansion");
  assert.equal(C.resumen({ ...C.ESCENARIOS.einstein, empujon: -0.001 }).destino, "recolapso");
});

test("densidades imposibles (Σρ < k) se detectan", () => {
  assert.equal(C.velocidadInicial({ ...base, materia: 0.5, k: 1 }), null);
  assert.equal(C.resumen({ ...base, materia: 0.5, k: 1 }).posible, false);
});
