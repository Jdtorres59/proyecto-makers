// Genera una sola página con los dos brand books de Luca (opción A cálida, opción B morada).
// Uso: node docs/marca/exploracion/fuente/generar.mjs [carpeta-para-el-artifact]
// Escribe docs/marca/exploracion/luca.html (documento completo, para abrir local) y, si se pasa
// una carpeta, la misma página sin el esqueleto <html>/<head>, que es el formato que publica el artifact.
// El contraste WCAG se verifica aquí y no se muestra: si un texto queda bajo 4,5:1 (o un elemento
// de interfaz bajo 3:1) en cualquiera de los dos temas, el script falla.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastes, js } from './comun.mjs';
import A from './opcion-a.mjs';
import B from './opcion-b.mjs';

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
const gutter = 'padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))';

// Estilos de una opción, anidados bajo .op-<slug> para que las dos convivan en la misma página
function cssOpcion(d) {
  const k = `.op-${d.slug}`;
  return `
${k}{${vars(d.temas.claro)};color-scheme:light}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) ${k}{${vars(d.temas.oscuro)};color-scheme:dark}}
:root[data-theme="dark"] ${k}{${vars(d.temas.oscuro)};color-scheme:dark}
${k}{background:var(--bg);color:var(--texto);font:16px/1.55 ${d.fuenteUI};
a{color:inherit;text-decoration-color:var(--acentoTexto);text-underline-offset:3px}
:focus-visible{outline:2px solid var(--foco);outline-offset:3px;border-radius:4px}
.doc{max-width:1360px;margin:0 auto;padding-block:28px 0;${gutter}}
@media (min-width:900px){.doc{padding-left:max(40px,env(safe-area-inset-left,0px));padding-right:max(40px,env(safe-area-inset-right,0px))}}
.doc-cab{display:flex;justify-content:space-between;align-items:center;gap:16px;padding-bottom:14px;border-bottom:1px solid var(--texto);margin-bottom:40px}
.doc-cab span{font-size:13px;color:var(--suave)}
.doc-cuerpo{display:grid;grid-template-columns:minmax(0,1fr);gap:32px}
@media (min-width:900px){.doc-cuerpo{grid-template-columns:200px minmax(0,1fr);gap:56px}.toc{position:sticky;top:96px;align-self:start}}
.toc-t{font-size:13px;color:var(--suave);margin:0 0 10px}
.toc ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px 16px;font-size:15px}
@media (min-width:900px){.toc ol{display:block}.toc li{margin-bottom:8px}}
main{min-width:0}
main h1,.doc h2,.pants>h2,.doc h3,.pants>h3{font-family:${d.fuenteDisplay};font-weight:${d.pesoDisplay};letter-spacing:${d.tracking};line-height:1.05;text-wrap:balance}
main h1{font-size:clamp(36px,6vw,60px);margin:0 0 10px}
.bajada{color:var(--suave);font-size:15px;margin:0 0 8px}
.doc h2,.pants>h2{font-size:30px;margin:72px 0 22px;padding-top:24px;border-top:1px solid var(--linea);display:flex;align-items:center;gap:12px;scroll-margin-top:84px}
.doc h2::before,.pants>h2::before{content:"";width:18px;height:18px;flex:none;${d.marcador}}
.doc h3,.pants>h3{font-size:17px;margin:36px 0 14px;font-family:${d.fuenteUI};font-weight:600;letter-spacing:0}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(250px,100%),1fr));gap:12px}
.tile{margin:0;border-radius:${d.radio}px;min-height:200px;display:flex;flex-direction:column;justify-content:space-between;padding:20px;border:1px solid var(--linea);overflow:hidden}
.tile .arte{flex:1;display:grid;place-items:center;padding:12px 0;min-width:0}
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
.pants{max-width:1760px;margin:0 auto;padding-block:0 96px;${gutter}}
@media (min-width:900px){.pants{padding-left:max(40px,env(safe-area-inset-left,0px));padding-right:max(40px,env(safe-area-inset-right,0px))}}
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
${d.css}
}`;
}

function cuerpoOpcion(d) {
  const { claro: c, oscuro: o } = d.temas, p = d.slug;
  const tels = (tema) => pantallas.map(([k, n]) => `<figure class="marco"><figcaption>${n}</figcaption><div class="tel" data-tema="${tema}" style="${vars(d.temas[tema])}"><div class="barra" aria-hidden="true"><span>9:41</span><span>5G ▮▮▮</span></div>${d.pantallas[k](tema)}</div></figure>`).join('');
  const toc = [['logo', 'Logo'], ['color', 'Color'], ['tipografia', 'Tipografía'], ['assets', 'Assets'], ['pantallas', 'Pantallas']];
  const tile = (bg, tx, arte, cap, extra = '') => `<figure class="tile" style="background:${bg};color:${tx};${extra}"><div class="arte">${arte}</div><figcaption>${cap}</figcaption></figure>`;
  return `<div class="op op-${p}" id="opcion-${p}" data-op="${p}">
<div class="doc">
<header class="doc-cab"><div>${d.wordmark(c, 34)}</div><span>${d.opcion}</span></header>
<div class="doc-cuerpo">
<nav class="toc" aria-label="Contenido de la ${d.opcion}"><p class="toc-t">Contenido</p><ol>${toc.map(([id, n], i) => `<li><a href="#${p}-${id}">${i + 1}. ${n}</a></li>`).join('')}</ol></nav>
<main>
<h1>Brand book · ${d.nombre}</h1>
<p class="bajada"><em>${d.bajada}</em></p>
<section><h2 id="${p}-logo">1. Logo</h2>
<div class="tiles">
${tile(c.bg, c.texto, d.wordmark(c, 64), 'Positivo')}
${tile(o.bg, o.texto, d.wordmark(o, 64), 'Negativo', `border-color:${o.bg}`)}
${tile(d.sobre.bg, d.sobre.texto, d.wordmark(d.sobre, 64), d.sobre.nombre, `border-color:${d.sobre.bg}`)}
${tile(c.bg, c.texto, d.simbolo(c, 104), 'Símbolo')}
${tile(c.superficie, c.texto, d.appIcon(116), 'Ícono de app')}
</div>
${d.enUso ? `<h3>${d.enUso.titulo}</h3><div class="tiles">${d.enUso.items.map((x) => tile(x.bg, x.tx, x.html, x.nombre)).join('')}</div>` : ''}
</section>
<section><h2 id="${p}-color">2. Color</h2>
<div class="muestras">${d.colores.map((x) => `<figure class="muestra"><i style="background:${x.hex}"></i><figcaption><span>${x.nombre}</span><code>${x.hex}</code></figcaption></figure>`).join('')}</div>
</section>
<section><h2 id="${p}-tipografia">3. Tipografía</h2>
${d.tipografia.map((x) => `<div class="espec"><div class="rol"><b>${x.familia}</b> · ${x.rol}</div><div class="m" style="${x.css}">${x.muestra}</div></div>`).join('')}
</section>
<section><h2 id="${p}-assets">4. Assets</h2>
<div class="tiles">${d.assets.map((x) => `<figure class="tile${x.ancho ? ' ancho' : ''}" style="background:${x.fondo || 'var(--superficie)'};color:${x.color || 'var(--texto)'};${x.fondo ? 'border-color:transparent' : ''}"><div class="arte">${x.html}</div><figcaption>${x.nombre}</figcaption></figure>`).join('')}</div>
</section>
</main>
</div>
</div>
<section class="pants"><h2 id="${p}-pantallas">5. Pantallas</h2>
<h3>Claro</h3><div class="tels">${tels('claro')}</div>
<h3>Oscuro</h3><div class="tels">${tels('oscuro')}</div>
</section>
</div>`;
}

// Barra de arriba: cambiar de opción y comentar. Colores propios, neutros, para no favorecer a ninguna.
const cssShell = `
/* Una barra neutra arriba para cambiar de opción y comentar; debajo, el brand book de la opción activa con su propia identidad. */
:root{--s-bg:#F3F2EF;--s-tx:#1C1B19;--s-suave:#5D5A55;--s-linea:#D9D6CF;--s-activo:#1C1B19;--s-sobre:#F3F2EF;--s-campo:#FFFFFF;--s-foco:#1C1B19}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--s-bg:#1C1B19;--s-tx:#EEEBE5;--s-suave:#ABA69D;--s-linea:#3A3833;--s-activo:#EEEBE5;--s-sobre:#1C1B19;--s-campo:#26241F;--s-foco:#EEEBE5;color-scheme:dark}}
:root[data-theme="dark"]{--s-bg:#1C1B19;--s-tx:#EEEBE5;--s-suave:#ABA69D;--s-linea:#3A3833;--s-activo:#EEEBE5;--s-sobre:#1C1B19;--s-campo:#26241F;--s-foco:#EEEBE5;color-scheme:dark}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--s-bg);color:var(--s-tx);font:15px/1.5 'Host Grotesk',system-ui,sans-serif}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--s-bg)}
.sw{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--s-bg);border-bottom:1px solid var(--s-linea);padding-block:10px;${gutter}}
.sw-in{max-width:1360px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px}
.sw-t{font-weight:600;margin-right:auto;min-width:0}
.sw-t small{display:block;font-weight:400;color:var(--s-suave);font-size:13px}
.sw-tabs{display:flex;gap:4px;background:var(--s-campo);border:1px solid var(--s-linea);border-radius:999px;padding:3px}
.sw-tabs a{display:flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:999px;color:var(--s-tx);text-decoration:none;font-weight:500;white-space:nowrap}
.sw-tabs a[aria-current="true"]{background:var(--s-activo);color:var(--s-sobre)}
.sw-tabs i{width:12px;height:12px;border-radius:50%;flex:none}
.sw button,.sw a{font:inherit}
.sw :focus-visible{outline:2px solid var(--s-foco);outline-offset:2px}
.op[hidden]{display:none}
.sw-com{min-height:44px;padding:0 14px;border-radius:999px;border:1px solid var(--s-linea);background:var(--s-campo);color:var(--s-tx);cursor:pointer}
`;

const shellHtml = (ops) => `
<header class="sw"><div class="sw-in">
  <div class="sw-t">Luca, dos estilos<small>Propuesta preliminar para opinar. El nombre es de trabajo.</small></div>
  <nav class="sw-tabs" aria-label="Opciones">${ops.map((d) => `<a href="#opcion-${d.slug}" data-tab="${d.slug}"><i style="background:${d.temas.claro.acento}" aria-hidden="true"></i>${d.opcion}</a>`).join('')}</nav>
  <button type="button" class="sw-com" id="comentar" hidden>Comentar</button>
</div></header>
`;

const shellJs = `
<script>
(() => {
  const use = (n) => (window.claude && window.claude.use ? window.claude.use(n) : Promise.resolve(null));
  const ops = [...document.querySelectorAll('.op')];
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const muestra = () => {
    const h = location.hash.slice(1);
    const k = ops.some((o) => h === 'opcion-' + o.dataset.op || h.startsWith(o.dataset.op + '-')) ? (h.startsWith('opcion-') ? h.slice(7) : h.split('-')[0]) : 'a';
    ops.forEach((o) => { o.hidden = o.dataset.op !== k; });
    tabs.forEach((t) => t.setAttribute('aria-current', String(t.dataset.tab === k)));
    if (h.startsWith('opcion-')) window.scrollTo(0, 0);
  };
  addEventListener('hashchange', muestra); muestra();

  // Comentarios: abre el compositor de comentarios del artifact sobre la opción que se está viendo
  (async () => {
    const com = await use('comments'); if (!com) return;
    const b = document.getElementById('comentar'); b.hidden = false;
    b.addEventListener('click', async () => { try { await com.openComposer({ element: ops.find((o) => !o.hidden) }); } catch (e) { b.hidden = true; } });
  })();
})();
</script>`;

let fallas = 0;
for (const d of [A, B]) {
  let min = 99;
  for (const tema of ['claro', 'oscuro']) {
    const t = d.temas[tema];
    for (const [etq, fg, bg, tipo] of [...contrastes, ...(d.contrastesExtra || [])]) {
      const r = contraste(t[fg], t[bg]), m = tipo === 'ui' ? 3 : 4.5;
      if (tipo !== 'ui') min = Math.min(min, r);
      if (r < m) { fallas++; console.error(`[${d.slug}] ${tema} · ${etq}: ${r.toFixed(2)}:1 < ${m}`); }
    }
  }
  console.log(`${d.opcion}: contraste mínimo de texto ${min.toFixed(2)}:1`);
}
// La barra de arriba también se mide
for (const [fg, bg] of [['#1C1B19', '#F3F2EF'], ['#5D5A55', '#F3F2EF'], ['#5D5A55', '#FFFFFF'], ['#EEEBE5', '#1C1B19'], ['#ABA69D', '#1C1B19'], ['#ABA69D', '#26241F']]) {
  if (contraste(fg, bg) < 4.5) { fallas++; console.error(`barra: ${fg} sobre ${bg}`); }
}
if (fallas) { console.error(`${fallas} pares no pasan`); process.exit(1); }

const fuentes = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Young+Serif&family=Host+Grotesk:wght@300..800&display=swap';
const contenido = `<title>Luca, dos estilos</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fuentes}">
<style>${cssShell}${cssOpcion(A)}${cssOpcion(B)}</style>
${shellHtml([A, B])}
${cuerpoOpcion(A)}
${cuerpoOpcion(B)}
${js}${shellJs}
`;
writeFileSync(join(raiz, 'luca.html'), `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${contenido}</body>\n</html>\n`);
console.log('luca.html');
if (process.argv[2]) {
  mkdirSync(process.argv[2], { recursive: true });
  writeFileSync(join(process.argv[2], 'luca-dos-estilos.html'), contenido);
  console.log(`artifact: ${join(process.argv[2], 'luca-dos-estilos.html')}`);
}
