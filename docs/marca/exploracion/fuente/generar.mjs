// Genera una página de brand book por dirección: docs/marca/exploracion/<slug>.html
// Uso: node docs/marca/exploracion/fuente/generar.mjs
// El contraste WCAG se verifica aquí y no se muestra en la página: si un texto queda bajo 4,5:1
// (o un elemento de interfaz bajo 3:1) en cualquiera de los dos temas, el script falla.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastes, js } from './comun.mjs';
import luca from './luca.mjs';
import morada from './morada.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
console.assert(Math.abs(contraste('#FFFFFF', '#000000') - 21) < 0.01, 'fórmula de contraste rota');

const vars = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');
const pantallas = [['entrada', 'Entrada'], ['inicio', 'Inicio'], ['leccion', 'Lección'], ['documento', 'Desprendible'], ['reparto', 'Reparto']];

function pagina(d) {
  const { claro: c, oscuro: o } = d.temas;
  const tels = (tema) => pantallas.map(([k, n]) => `<figure class="marco"><figcaption>${n}</figcaption><div class="tel" data-tema="${tema}" style="${vars(d.temas[tema])}"><div class="barra" aria-hidden="true"><span>9:41</span><span>5G ▮▮▮</span></div>${d.pantallas[k](tema)}</div></figure>`).join('');
  const toc = [['logo', 'Logo'], ['color', 'Color'], ['tipografia', 'Tipografía'], ['assets', 'Assets'], ['pantallas', 'Pantallas']];
  const css = `
:root{${vars(c)};color-scheme:light}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(o)};color-scheme:dark}}
:root[data-theme="dark"]{${vars(o)};color-scheme:dark}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--texto);font:16px/1.55 ${d.fuenteUI};-webkit-font-smoothing:antialiased}
[hidden]{display:none!important}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
a{color:inherit;text-decoration-color:var(--acentoTexto);text-underline-offset:3px}
:focus-visible{outline:2px solid var(--foco);outline-offset:3px;border-radius:4px}
.doc{max-width:1360px;margin:0 auto;padding:24px 16px 0}
@media (min-width:900px){.doc{padding:32px 40px 0}}
.doc-cab{display:flex;justify-content:space-between;align-items:center;gap:16px;padding-bottom:14px;border-bottom:1px solid var(--texto);margin-bottom:40px}
.doc-cab span{font-size:13px;color:var(--suave)}
.doc-cuerpo{display:grid;grid-template-columns:minmax(0,1fr);gap:32px}
@media (min-width:900px){.doc-cuerpo{grid-template-columns:200px minmax(0,1fr);gap:56px}.toc{position:sticky;top:32px;align-self:start}}
.toc-t{font-size:13px;color:var(--suave);margin:0 0 10px}
.toc ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px 16px;font-size:15px}
@media (min-width:900px){.toc ol{display:block}.toc li{margin-bottom:8px}}
main{min-width:0}
main h1,.doc h2,.pants>h2,.doc h3,.pants>h3{font-family:${d.fuenteDisplay};font-weight:${d.pesoDisplay};letter-spacing:${d.tracking};line-height:1.05;text-wrap:balance}
main h1{font-size:clamp(36px,6vw,60px);margin:0 0 10px}
.bajada{color:var(--suave);font-size:15px;margin:0 0 8px}
.doc h2,.pants>h2{font-size:30px;margin:72px 0 22px;padding-top:24px;border-top:1px solid var(--linea);display:flex;align-items:center;gap:12px}
.doc h2::before,.pants>h2::before{content:"";width:18px;height:18px;flex:none;${d.marcador}}
.doc h3,.pants>h3{font-size:17px;margin:36px 0 14px;font-family:${d.fuenteUI};font-weight:600;letter-spacing:0}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.tile{margin:0;border-radius:${d.radio}px;min-height:200px;display:flex;flex-direction:column;justify-content:space-between;padding:20px;border:1px solid var(--linea);overflow:hidden}
.tile .arte{flex:1;display:grid;place-items:center;padding:12px 0}
.tile svg{max-width:100%;height:auto}
.tile figcaption{font-size:13px}
.tile.ancho{grid-column:1/-1}
.muestras{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.muestra{margin:0;border:1px solid var(--linea);border-radius:${d.radio}px;overflow:hidden;font-size:14px}
.muestra i{display:block;height:110px}
.muestra figcaption{padding:10px 12px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
.muestra code{font:13px ui-monospace,Menlo,monospace;color:var(--suave)}
.espec{border-top:1px solid var(--linea);padding:22px 0 26px;display:grid;gap:10px}
.espec .rol{font-size:14px;color:var(--suave)}
.espec .rol b{color:var(--texto);font-weight:600}
.espec .m{overflow-wrap:anywhere}
.pants{max-width:1760px;margin:0 auto;padding:0 16px 96px}
@media (min-width:900px){.pants{padding:0 40px 120px}}
.tels{display:flex;flex-wrap:wrap;gap:22px}
.marco{margin:0;width:min(390px,100%)}
.marco figcaption{font-size:13px;color:var(--suave);margin-bottom:8px}
.tel{width:100%;min-height:844px;border-radius:40px;overflow:hidden;display:flex;flex-direction:column;background:var(--bg);color:var(--texto);border:1px solid var(--linea);font-family:${d.fuenteUI};font-size:15px;line-height:1.45}
.barra{display:flex;justify-content:space-between;padding:15px 30px 6px;font:600 14px/1 system-ui,sans-serif;color:var(--texto)}
.tel :focus-visible{outline:3px solid var(--foco);outline-offset:2px}
.tel button{cursor:pointer;font:inherit;color:inherit}
.tel button:disabled{opacity:.35;cursor:default}
.tel input[type=range]{width:100%}
.oculto{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.cifra{font-variant-numeric:tabular-nums lining-nums}
${d.css}`;
  const tile = (bg, tx, arte, cap, extra = '') => `<figure class="tile" style="background:${bg};color:${tx};${extra}"><div class="arte">${arte}</div><figcaption>${cap}</figcaption></figure>`;
  const cuerpo = `
<div class="doc">
<header class="doc-cab"><div>${d.wordmark(c, 34)}</div><span>Propuesta preliminar</span></header>
<div class="doc-cuerpo">
<nav class="toc" aria-label="Contenido"><p class="toc-t">Contenido</p><ol>${toc.map(([id, n], i) => `<li><a href="#${id}">${i + 1}. ${n}</a></li>`).join('')}</ol></nav>
<main>
<h1>Brand book · ${d.nombre}</h1>
<p class="bajada"><em>${d.bajada}</em></p>
<section><h2 id="logo">1. Logo</h2>
<div class="tiles">
${tile(c.bg, c.texto, d.wordmark(c, 64), 'Positivo')}
${tile(o.bg, o.texto, d.wordmark(o, 64), 'Negativo', `border-color:${o.bg}`)}
${tile(d.sobre.bg, d.sobre.texto, d.wordmark(d.sobre, 64), d.sobre.nombre, `border-color:${d.sobre.bg}`)}
${tile(c.bg, c.texto, d.simbolo(c, 104), 'Símbolo')}
${tile(c.superficie, c.texto, d.appIcon(116), 'Ícono de app')}
</div>
${d.enUso ? `<h3>${d.enUso.titulo}</h3><div class="tiles">${d.enUso.items.map((x) => tile(x.bg, x.tx, x.html, x.nombre)).join('')}</div>` : ''}
</section>
<section><h2 id="color">2. Color</h2>
<div class="muestras">${d.colores.map((x) => `<figure class="muestra"><i style="background:${x.hex}"></i><figcaption><span>${x.nombre}</span><code>${x.hex}</code></figcaption></figure>`).join('')}</div>
</section>
<section><h2 id="tipografia">3. Tipografía</h2>
${d.tipografia.map((x) => `<div class="espec"><div class="rol"><b>${x.familia}</b> · ${x.rol}</div><div class="m" style="${x.css}">${x.muestra}</div></div>`).join('')}
</section>
<section><h2 id="assets">4. Assets</h2>
<div class="tiles">${d.assets.map((x) => `<figure class="tile${x.ancho ? ' ancho' : ''}" style="background:${x.fondo || 'var(--superficie)'};color:${x.color || 'var(--texto)'};${x.fondo ? 'border-color:transparent' : ''}"><div class="arte">${x.html}</div><figcaption>${x.nombre}</figcaption></figure>`).join('')}</div>
</section>
</main>
</div>
</div>
<section class="pants"><h2 id="pantallas">5. Pantallas</h2>
<h3>Claro</h3><div class="tels">${tels('claro')}</div>
<h3>Oscuro</h3><div class="tels">${tels('oscuro')}</div>
</section>${js}`;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brand book · ${d.nombre}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${d.fuentesUrl}">
<style>${css}</style>
</head>
<body>${cuerpo}
</body>
</html>
`;
}

let fallas = 0;
for (const d of [luca, morada]) {
  let min = 99;
  for (const tema of ['claro', 'oscuro']) {
    const t = d.temas[tema];
    for (const [etq, fg, bg, tipo] of [...contrastes, ...(d.contrastesExtra || [])]) {
      const r = contraste(t[fg], t[bg]), m = tipo === 'ui' ? 3 : 4.5;
      if (tipo !== 'ui') min = Math.min(min, r);
      if (r < m) { fallas++; console.error(`[${d.slug}] ${tema} · ${etq}: ${r.toFixed(2)}:1 < ${m}`); }
    }
  }
  writeFileSync(join(raiz, `${d.slug}.html`), pagina(d));
  console.log(`${d.slug}.html: contraste mínimo de texto ${min.toFixed(2)}:1`);
}
if (fallas) { console.error(`${fallas} pares no pasan`); process.exit(1); }
