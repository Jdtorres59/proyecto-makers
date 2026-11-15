// Genera, por cada dirección, brandbook.md, brandbook.html y maquetas.html.
// Uso: node docs/marca/exploracion/fuente/generar.mjs
// El contraste WCAG se calcula aquí; si un par de texto queda bajo 4,5:1 (o un par de interfaz bajo 3:1) el script falla.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import cuadre from './cuadre.mjs';
import luca from './luca.mjs';
import renglon from './renglon.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------- contraste WCAG 2.2 ----------
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// autocomprobación: blanco sobre negro es 21:1
console.assert(Math.abs(contraste('#FFFFFF', '#000000') - 21) < 0.01, 'fórmula de contraste rota');

const fmt = (r) => r.toFixed(2).replace('.', ',');
const md = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');

function medir(d) {
  const filas = [];
  for (const tema of ['claro', 'oscuro']) {
    const t = d.temas[tema];
    for (const [etiqueta, fg, bg, tipo] of d.contrastes) {
      const r = contraste(t[fg], t[bg]);
      const minimo = tipo === 'ui' ? 3 : 4.5;
      filas.push({ tema, etiqueta, fg: t[fg], bg: t[bg], r, minimo, pasa: r >= minimo, tipo });
    }
  }
  return filas;
}

// ---------- Markdown ----------
function brandbookMd(d, filas) {
  const L = [];
  L.push(`# Brand book · ${d.nombre} (nombre de trabajo)`, '');
  L.push(`*Dirección ${d.numero} de tres. Exploración, no decisión: el nombre "${d.nombre}" es una propuesta de trabajo y nada de esto está aprobado por el equipo. Eje: **${d.eje}**. Maquetas: [maquetas.html](maquetas.html). Versión navegable: [brandbook.html](brandbook.html).*`, '');
  L.push('## 1. Esencia', '', '| | |', '|---|---|');
  for (const [k, v] of d.esencia) L.push(`| **${k}** | ${v} |`);
  L.push('', `**La idea en una frase.** ${d.idea}`, '');
  L.push('## 2. Logo', '', ...d.logo.texto.map((x) => `- ${x}`), '');
  L.push('| Versión | Texto | Detalle | Fondo |', '|---|---|---|---|');
  for (const v of d.logo.versiones) L.push(`| ${v.join(' | ')} |`);
  L.push('', `- **Usos incorrectos:** ${d.logo.incorrectos}`, '- **Archivos:** el SVG vive dentro de `brandbook.html`. Si se elige esta dirección, se convierte a trazos y se exporta en SVG y PNG.', '');
  if (d.grafias) {
    L.push('### Grafías exploradas', '', d.grafias.intro, '', '| Grafía | Veredicto | Por qué |', '|---|---|---|');
    for (const [w, v, p] of d.grafias.filas) L.push(`| \`${w}\` | ${v} | ${p} |`);
    L.push('');
  }
  L.push('## 3. Color', '', '| Hex | Nombre | Uso |', '|---|---|---|');
  for (const c of d.colores) L.push(`| \`${c.hex}\` | ${c.nombre} | ${c.uso} |`);
  L.push('', ...d.reglasColor.map((x) => `- ${x}`), '');
  L.push('**Contraste medido** (WCAG 2.2; texto exige 4,5:1, elementos de interfaz 3:1):', '');
  L.push('| Tema | Par | Frente | Fondo | Contraste | Mínimo | Resultado |', '|---|---|---|---|---|---|---|');
  for (const f of filas) L.push(`| ${f.tema} | ${f.etiqueta} | \`${f.fg}\` | \`${f.bg}\` | ${fmt(f.r)}:1 | ${fmt(f.minimo)}:1 | ${f.pasa ? 'Pasa' : 'No pasa'} |`);
  L.push('');
  L.push('## 4. Tipografía', '', '| Rol | Familia | Pesos | Carácter |', '|---|---|---|---|');
  for (const t of d.tipografia) L.push(`| ${t.rol} | [${t.familia}](${t.url}) | ${t.pesos} | ${t.caracter} |`);
  L.push('', ...d.notasTipo.map((x) => `- ${x}`), '');
  L.push('## 5. Imagen', '', ...d.imagen.map((x) => `- ${x}`), '');
  L.push('## 6. Voz y tono', '', d.voz.intro, '', '| Sí lo decimos | No lo decimos |', '|---|---|');
  for (const [s, n] of d.voz.siNo) L.push(`| ${s} | ${n} |`);
  L.push('', '**Frases reales de la app:**', '', '| Dónde | Frase |', '|---|---|');
  for (const [w, f] of d.voz.frases) L.push(`| ${w} | ${f} |`);
  L.push('', `**Palabras que evitamos:** ${d.voz.evitamos}`, '');
  L.push('## 7. Mensajes clave', '');
  L.push(`- **Taglines (propuesta):** ${d.mensajes.taglines.map((t) => `*${t}*`).join(' · ')}`);
  L.push(`- **Propuesta de valor:** ${d.mensajes.valor}`);
  L.push('- **Mensajes de apoyo:**', ...d.mensajes.apoyo.map((x) => `  - ${x}`));
  L.push(`- **Llamado a la acción principal:** ${d.mensajes.cta}`);
  L.push(`- **Promesas que no hacemos:** ${d.mensajes.noPrometemos}`, '');
  L.push('## 8. A quién le habla mejor y riesgo', '', `- **Le habla mejor a:** ${d.aQuien}`, `- **Riesgo:** ${d.riesgo}`, ...(d.riesgoNombre ? [`- **Riesgo del nombre:** ${d.riesgoNombre}`] : []), `- **Costo de llevarla a la app:** ${d.costo}`, '');
  return L.join('\n');
}

// ---------- HTML compartido ----------
const baseDoc = (titulo, fuentes, cuerpo, extraCss = '') => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fuentes}">
<style>
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0}
[hidden]{display:none!important}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
${extraCss}
</style>
</head>
<body>
${cuerpo}
</body>
</html>
`;

function brandbookHtml(d, filas) {
  const t = d.temas;
  const css = `
:root{--bg:${t.claro.bg};--sup:${t.claro.superficie};--tx:${t.claro.texto};--suave:${t.claro.suave};--ac:${t.claro.acento};--sobre:${t.claro.sobreAcento};--lin:${t.claro.linea};--foco:${t.claro.foco}}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:${t.oscuro.bg};--sup:${t.oscuro.superficie};--tx:${t.oscuro.texto};--suave:${t.oscuro.suave};--ac:${t.oscuro.acento};--sobre:${t.oscuro.sobreAcento};--lin:${t.oscuro.linea};--foco:${t.oscuro.foco}}}
:root[data-theme="dark"]{--bg:${t.oscuro.bg};--sup:${t.oscuro.superficie};--tx:${t.oscuro.texto};--suave:${t.oscuro.suave};--ac:${t.oscuro.acento};--sobre:${t.oscuro.sobreAcento};--lin:${t.oscuro.linea};--foco:${t.oscuro.foco}}
body{background:var(--bg);color:var(--tx);font:16px/1.6 ${d.fuenteCuerpo}}
.doc{max-width:1120px;margin:0 auto;padding:24px 16px 96px;display:grid;grid-template-columns:minmax(0,1fr);gap:32px}
main{min-width:0}
@media (min-width:900px){.doc{grid-template-columns:200px minmax(0,1fr);padding:40px 32px 120px;gap:56px}.toc{position:sticky;top:32px;align-self:start}}
.toc ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px 16px;font-size:14px}
@media (min-width:900px){.toc ol{display:block}.toc li{margin-bottom:8px}}
a{color:inherit;text-underline-offset:3px}
a:focus-visible,button:focus-visible{outline:2px solid var(--foco);outline-offset:3px;border-radius:4px}
h1,h2,h3{font-family:${d.fuenteDisplay};line-height:1.1;letter-spacing:-.02em;text-wrap:balance}
h1{font-size:clamp(34px,7vw,56px);margin:0 0 12px;font-weight:${d.pesoTitular}}
h2{font-size:28px;margin:64px 0 16px;padding-top:24px;border-top:1px solid var(--lin);font-weight:${d.pesoTitular}}
h3{font-size:19px;margin:28px 0 8px}
p,li{max-width:68ch;text-wrap:pretty}
.bajada{color:var(--suave);font-size:15px;max-width:60ch}
.aviso{background:var(--sup);border-radius:8px;padding:12px 16px;font-size:14px;margin:16px 0}
.tabla{overflow-x:auto;margin:16px 0}
table{border-collapse:collapse;width:100%;font-size:14px;font-variant-numeric:tabular-nums}
th,td{text-align:left;padding:10px 12px 10px 0;border-bottom:1px solid var(--lin);vertical-align:top}
th{font-weight:600;color:var(--suave);font-size:13px}
code{font-family:ui-monospace,Menlo,monospace;font-size:.9em}
.logos{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:16px 0}
.logos figure{margin:0;border-radius:12px;min-height:150px;display:grid;place-items:center;padding:24px;border:1px solid var(--lin)}
.logos figcaption{font-size:13px;margin-top:12px;text-align:center}
.logos svg{max-width:100%;height:auto}
.muestras{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin:16px 0}
.muestra{border:1px solid var(--lin);border-radius:12px;overflow:hidden;font-size:13px}
.muestra i{display:block;height:84px}
.muestra div{padding:10px 12px}
.muestra b{display:block;font-size:14px}
.esp{border-top:1px solid var(--lin);padding:20px 0}
.esp .rol{font-size:13px;color:var(--suave)}
.grafias{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin:16px 0}.grafias figure{margin:0;border:1px solid var(--lin);border-radius:12px;padding:20px 16px 12px}.grafias figcaption{font-size:13px;color:var(--suave);margin-top:10px}
.ok{font-weight:600}.mal{font-weight:700;text-decoration:underline}
.tema-btn{font:inherit;font-size:14px;background:var(--sup);color:var(--tx);border:1px solid var(--lin);border-radius:999px;padding:8px 14px;cursor:pointer;min-height:44px}
${d.cssBrandbook || ''}`;
  const toc = ['Esencia', 'Logo', 'Color', 'Tipografía', 'Imagen', 'Voz y tono', 'Mensajes clave', 'A quién y riesgo'];
  const sec = (i, cuerpo) => `<section id="s${i + 1}" aria-labelledby="h${i + 1}"><h2 id="h${i + 1}">${i + 1}. ${toc[i]}</h2>${cuerpo}</section>`;
  const tabla = (cab, filasT) => `<div class="tabla"><table><thead><tr>${cab.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${filasT.map((f) => `<tr>${f.map((c) => `<td>${md(String(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const cuerpo = `
<div class="doc">
<nav class="toc" aria-label="Contenido">
  <p style="margin:0 0 12px;font-weight:600">${d.nombre}</p>
  <ol>${toc.map((x, i) => `<li><a href="#s${i + 1}">${x}</a></li>`).join('')}<li><a href="maquetas.html">Maquetas</a></li><li><a href="../README.md">Comparación</a></li></ol>
  <p style="margin-top:20px"><button class="tema-btn" type="button" onclick="(function(r){r.dataset.theme=(r.dataset.theme==='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches))?'light':'dark'})(document.documentElement)">Cambiar claro / oscuro</button></p>
</nav>
<main>
<h1>Brand book · ${d.nombre}</h1>
<p class="bajada">Dirección ${d.numero} de tres. Eje: <strong>${d.eje}</strong>. ${d.idea}</p>
<p class="aviso"><strong>Exploración, no decisión.</strong> "${d.nombre}" es un nombre de trabajo propuesto para esta dirección; el producto no tiene nombre confirmado.</p>
${sec(0, tabla(['', ''], d.esencia.map(([k, v]) => [`<strong>${k}</strong>`, md(v)])))}
${sec(1, `<div class="logos">
  <figure style="background:${t.claro.bg};color:${t.claro.texto}">${d.logo.svg(t.claro)}<figcaption>Positivo, sobre ${t.claro.bg}</figcaption></figure>
  <figure style="background:${t.oscuro.bg};color:${t.oscuro.texto}">${d.logo.svg(t.oscuro)}<figcaption>Negativo, sobre ${t.oscuro.bg}</figcaption></figure>
  <figure style="background:${t.claro.bg};color:${t.claro.texto}">${d.logo.simbolo(t.claro)}<figcaption>Símbolo</figcaption></figure>
</div>
<ul>${d.logo.texto.map((x) => `<li>${md(x)}</li>`).join('')}</ul>
${tabla(['Versión', 'Texto', 'Detalle', 'Fondo'], d.logo.versiones)}
<p><strong>Usos incorrectos:</strong> ${d.logo.incorrectos}</p>
${d.grafias ? `<h3>Grafías exploradas</h3><p>${md(d.grafias.intro)}</p><div class="grafias">${d.grafias.filas.map(([w, v]) => `<figure><span style="font-family:${d.fuenteDisplay};font-weight:${d.pesoTitular};font-size:44px;letter-spacing:-.04em;line-height:1">${w}</span><figcaption>${v}</figcaption></figure>`).join('')}</div>${tabla(['Grafía', 'Veredicto', 'Por qué'], d.grafias.filas.map(([w, v, p]) => [`<code>${w}</code>`, v, p]))}` : ''}`)}
${sec(2, `<div class="muestras">${d.colores.map((c) => `<div class="muestra"><i style="background:${c.hex}"></i><div><b>${c.nombre}</b><code>${c.hex}</code><br>${md(c.uso)}</div></div>`).join('')}</div>
<ul>${d.reglasColor.map((x) => `<li>${md(x)}</li>`).join('')}</ul>
<h3>Contraste medido</h3><p class="bajada">Calculado con la fórmula de WCAG 2.2 por el generador. Texto exige 4,5:1; elementos de interfaz, 3:1.</p>
${tabla(['Tema', 'Par', 'Frente', 'Fondo', 'Contraste', 'Resultado'], filas.map((f) => [f.tema, f.etiqueta, `<code>${f.fg}</code>`, `<code>${f.bg}</code>`, `${fmt(f.r)}:1`, f.pasa ? `<span class="ok">Pasa (${fmt(f.minimo)})</span>` : `<span class="mal">No pasa</span>`]))}`)}
${sec(3, d.tipografia.map((x) => `<div class="esp"><div class="rol">${x.rol} · <a href="${x.url}">${x.familia}</a> · ${x.pesos}</div><div style="${x.css}">${x.muestra}</div><p class="bajada">${x.caracter}</p></div>`).join('') + `<ul>${d.notasTipo.map((x) => `<li>${md(x)}</li>`).join('')}</ul>`)}
${sec(4, `<ul>${d.imagen.map((x) => `<li>${md(x)}</li>`).join('')}</ul>`)}
${sec(5, `<p>${md(d.voz.intro)}</p>${tabla(['Sí lo decimos', 'No lo decimos'], d.voz.siNo)}<h3>Frases reales de la app</h3>${tabla(['Dónde', 'Frase'], d.voz.frases)}<p><strong>Palabras que evitamos:</strong> ${d.voz.evitamos}</p>`)}
${sec(6, `<ul><li><strong>Taglines (propuesta):</strong> ${d.mensajes.taglines.map((x) => `<em>${x}</em>`).join(' · ')}</li><li><strong>Propuesta de valor:</strong> ${d.mensajes.valor}</li><li><strong>Mensajes de apoyo:</strong><ul>${d.mensajes.apoyo.map((x) => `<li>${x}</li>`).join('')}</ul></li><li><strong>Llamado a la acción principal:</strong> ${d.mensajes.cta}</li><li><strong>Promesas que no hacemos:</strong> ${d.mensajes.noPrometemos}</li></ul>`)}
${sec(7, `<ul><li><strong>Le habla mejor a:</strong> ${d.aQuien}</li><li><strong>Riesgo:</strong> ${d.riesgo}</li>${d.riesgoNombre ? `<li><strong>Riesgo del nombre:</strong> ${d.riesgoNombre}</li>` : ''}<li><strong>Costo de llevarla a la app:</strong> ${d.costo}</li></ul><p><a href="maquetas.html">Ver las maquetas de esta dirección</a></p>`)}
</main>
</div>`;
  return baseDoc(`${d.nombre} · brand book`, d.fuentesUrl, cuerpo, css);
}

// ---------- Maquetas ----------
const varsTema = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');

function maquetasHtml(d) {
  const pantallas = [
    ['entrada', 'Entrada'],
    ['inicio', 'Inicio'],
    ['leccion', 'Lección: predecir y revelar'],
    ['documento', 'Tu desprendible, línea por línea'],
  ];
  const fila = (tema) => `
<section class="fila" aria-label="Tema ${tema}">
  <h2 class="fila-t">Tema ${tema}</h2>
  <div class="tels">
  ${pantallas.map(([k, nombre]) => `<figure class="marco"><figcaption>${nombre}</figcaption>
    <div class="tel" data-tema="${tema}" style="${varsTema(d.temas[tema])}">
      <div class="barra" aria-hidden="true"><span>9:41</span><span>5G ▮▮▮</span></div>
      ${d.pantallas[k](tema)}
    </div></figure>`).join('')}
  </div>
</section>`;
  const css = `
body{background:#E9E9E6;color:#1B1B1A;font:15px/1.5 system-ui,-apple-system,sans-serif}
@media (prefers-color-scheme: dark){body{background:#1A1A19;color:#E6E6E3}}
.cab{max-width:1720px;margin:0 auto;padding:24px 16px 8px}
.cab h1{font-size:22px;margin:0 0 4px;letter-spacing:-.01em}
.cab p{margin:0;max-width:70ch;opacity:.85}
.cab a{color:inherit}
.fila{max-width:1720px;margin:0 auto;padding:16px}
.fila-t{font-size:15px;font-weight:600;margin:16px 0 12px}
.tels{display:flex;flex-wrap:wrap;gap:24px}
.marco{margin:0;width:min(390px,100%)}
.marco figcaption{font-size:13px;margin-bottom:8px;opacity:.85}
.tel{width:100%;min-height:844px;border-radius:36px;overflow:hidden;position:relative;display:flex;flex-direction:column;background:var(--bg);color:var(--texto);box-shadow:0 1px 0 rgba(0,0,0,.06),0 12px 32px rgba(0,0,0,.12)}
.barra{display:flex;justify-content:space-between;padding:14px 28px 6px;font:600 14px/1 system-ui,sans-serif;color:var(--texto)}
.tel :focus-visible{outline:3px solid var(--foco);outline-offset:2px}
.tel button,.tel summary,.tel a{cursor:pointer}
.tel input[type=range]{width:100%}
.oculto{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.cifra{font-variant-numeric:tabular-nums lining-nums}
${d.cssMaquetas}`;
  const js = `
<script>
// Formato colombiano: $1.234.567 (Intl con es-CO agrupa con punto desde 5 cifras, que es lo que se usa aquí)
const cop = (n) => '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(n);
const PRIMA = 900000;
document.querySelectorAll('.leccion').forEach((l) => {
  const r = l.querySelector('input[type=range]'), c = l.querySelector('[data-apuesta]'), b = l.querySelector('[data-revelar]'), res = l.querySelector('[data-resultado]');
  const pinta = () => { c.textContent = cop(+r.value); r.setAttribute('aria-valuetext', cop(+r.value)); };
  r.addEventListener('input', pinta); pinta();
  b.addEventListener('click', () => {
    const dif = PRIMA - +r.value;
    l.dataset.revelado = '1';
    res.hidden = false;
    res.querySelector('[data-real]').textContent = cop(PRIMA);
    res.querySelector('[data-dif]').textContent = dif === 0 ? 'Le pegaste exacto.' : (dif > 0 ? 'Te quedaste ' + cop(dif) + ' por debajo.' : 'Te pasaste por ' + cop(-dif) + '.');
    b.hidden = true;
    res.querySelector('[data-foco]').focus();
  });
});
</script>`;
  const cuerpo = `
<header class="cab">
  <h1>${d.nombre} · maquetas (nombre de trabajo)</h1>
  <p>Dirección ${d.numero} de tres, eje: ${d.eje}. Cuatro pantallas a 390 px en claro y en oscuro. Contenido de ejemplo con datos ficticios, tomado de los documentos 05 y 08; no son decisiones de producto. La lección y el desprendible se pueden tocar. <a href="brandbook.html">Brand book</a> · <a href="../README.md">Comparación</a></p>
</header>
<main>${fila('claro')}${fila('oscuro')}</main>${js}`;
  return baseDoc(`${d.nombre} · maquetas`, d.fuentesUrl, cuerpo, css);
}

// ---------- correr ----------
let fallas = 0;
for (const d of [cuadre, luca, renglon]) {
  const filas = medir(d);
  for (const f of filas.filter((x) => !x.pasa)) {
    fallas++;
    console.error(`[${d.slug}] ${f.tema} · ${f.etiqueta}: ${fmt(f.r)}:1 < ${f.minimo}`);
  }
  const dir = join(raiz, d.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'brandbook.md'), brandbookMd(d, filas));
  writeFileSync(join(dir, 'brandbook.html'), brandbookHtml(d, filas));
  writeFileSync(join(dir, 'maquetas.html'), maquetasHtml(d));
  console.log(`${d.slug}: ${filas.length} pares medidos, mínimo ${fmt(Math.min(...filas.filter((f) => f.tipo !== 'ui').map((f) => f.r)))}:1 en texto`);
}
if (fallas) { console.error(`${fallas} pares no pasan`); process.exit(1); }
