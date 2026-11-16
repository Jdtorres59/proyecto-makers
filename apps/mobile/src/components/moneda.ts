/** Geometría de la moneda con su tajada (la "c" del wordmark), portada del prototipo. viewBox 0 0 100 100. */
const punto = (cx: number, cy: number, r: number, a: number) =>
  [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)].map((v) => v.toFixed(2)).join(' ');

export const tajada = (cx: number, cy: number, r: number, a1: number, a2: number) =>
  `M${cx} ${cy}L${punto(cx, cy, r, a1)}A${r} ${r} 0 ${(a2 - a1) % 360 > 180 ? 1 : 0} 1 ${punto(cx, cy, r, a2)}Z`;

/** Cuerpo de la moneda, la tajada y cuánto se separa la tajada (hacia arriba a la derecha). */
export function moneda({ cx = 50, cy = 50, r = 47, abertura = 54, separacion = 10 } = {}) {
  const a1 = -40 - abertura / 2;
  const a2 = -40 + abertura / 2;
  return {
    cuerpo: tajada(cx, cy, r, a2, a1 + 360),
    tajada: tajada(cx, cy, r, a1, a2),
    dx: separacion * Math.cos((-40 * Math.PI) / 180),
    dy: separacion * Math.sin((-40 * Math.PI) / 180),
  };
}
