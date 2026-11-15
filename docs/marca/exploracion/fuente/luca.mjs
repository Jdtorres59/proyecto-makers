// Dirección · Luca (nombre de trabajo). Cálida y con juego: la moneda que se reparte.
import { icono, caso, lineas, reparto, controles, cop } from './comun.mjs';

const MAIZ = '#F2BE22', TINTA = '#1E291F', CREMA = '#FBF4E6';

const temas = {
  claro: {
    bg: CREMA, superficie: '#F3E3C4', texto: TINTA, suave: '#5A5242',
    acento: MAIZ, sobreAcento: TINTA, acentoTexto: '#6B4C00',
    alarma: '#B02A1C', linea: '#E3D2B0', foco: TINTA, control: '#8A7C62',
    s1: TINTA, s2: MAIZ, s3: '#5B8A5C', sombra: TINTA,
  },
  oscuro: {
    bg: '#1B1812', superficie: '#2B261C', texto: '#F7EEDB', suave: '#BFB399',
    acento: MAIZ, sobreAcento: '#1B1812', acentoTexto: MAIZ,
    alarma: '#FF8B7B', linea: '#3E3628', foco: MAIZ, control: '#82765E',
    s1: '#F7EEDB', s2: MAIZ, s3: '#86B886', sombra: '#8A6A0A',
  },
};

const bri = "'Bricolage Grotesque', system-ui, sans-serif";

// Tajada: sector circular de a1 a a2 grados (0 = derecha, sentido horario)
const pt = (cx, cy, r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)].map((v) => v.toFixed(2)).join(' ');
const tajada = (cx, cy, r, a1, a2) => `M${cx} ${cy}L${pt(cx, cy, r, a1)}A${r} ${r} 0 ${(a2 - a1) % 360 > 180 ? 1 : 0} 1 ${pt(cx, cy, r, a2)}Z`;
// La moneda repartida: cuerpo con una tajada afuera, corrida hacia arriba a la derecha
const moneda = (cuerpo, corte, { cx = 50, cy = 54, r = 40, a = 44, sep = 7 } = {}) => {
  const a1 = -40 - a / 2, a2 = -40 + a / 2;
  const dx = (sep * Math.cos((-40 * Math.PI) / 180)).toFixed(2), dy = (sep * Math.sin((-40 * Math.PI) / 180)).toFixed(2);
  return `<path d="${tajada(cx, cy, r, a2, a1 + 360)}" fill="${cuerpo}"/><path d="${tajada(cx, cy, r, a1, a2)}" fill="${corte}" transform="translate(${dx} ${dy})"/>`;
};

const pie = (t) => `<svg class="pie" viewBox="0 0 100 100" aria-hidden="true">${moneda(t.texto, t.corte || MAIZ, { cy: 50, r: 47, a: 54, sep: 10 })}</svg>`;
const wm = (t, h, antes, despues, label) => `<span class="wm" style="font-size:${h}px;color:${t.texto}" role="img" aria-label="${label}, nombre de trabajo">${antes}${pie(t)}${despues}</span>`;
const wordmark = (t, h = 40) => wm(t, h, 'lu', 'a', 'luca');
const simbolo = (t, h = 96) => `<svg viewBox="0 0 100 100" width="${h}" height="${h}" role="img" aria-label="Símbolo">${moneda(t.texto, t.corte || MAIZ)}</svg>`;
const appIcon = (h = 112) => `<svg viewBox="0 0 120 120" width="${h}" height="${h}" role="img" aria-label="Ícono de la app"><rect width="120" height="120" rx="28" fill="${MAIZ}"/>${moneda(TINTA, CREMA, { cx: 58, cy: 64, r: 34, a: 48, sep: 7 })}</svg>`;

// Patrón: monedas repartidas de muchas formas. Determinista para que el archivo no cambie en cada corrida.
const patron = (cols, filas, paso, cuerpo, corte, fondo) => {
  let s = '';
  for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
    const k = (f * 7 + c * 5) % 6, cx = c * paso + paso / 2 + (f % 2) * (paso / 2), cy = f * paso + paso / 2;
    const a = [40, 70, 100, 55, 130, 85][k];
    s += moneda(cuerpo, corte, { cx, cy, r: paso * 0.27, a, sep: paso * 0.07 });
  }
  return `<svg viewBox="0 0 ${cols * paso} ${filas * paso}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="width:100%;height:100%;display:block;background:${fondo}">${s}</svg>`;
};

// Dona del reparto en SVG estático (para el tile de assets)
const dona = (t) => {
  const v = [44.4, 33.3, 22.3], col = [t.s1, t.s2, t.s3];
  let a = -90, s = '';
  v.forEach((p, i) => { const b = a + p * 3.6; s += `<path d="${tajada(80, 80, 70, a + 1.2, b - 1.2)}" fill="${col[i]}"/>`; a = b; });
  return `<svg viewBox="0 0 160 160" width="170" aria-hidden="true">${s}<circle cx="80" cy="80" r="44" fill="${t.superficie}"/><text x="80" y="85" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="15" fill="${t.texto}">$900.000</text></svg>`;
};

const tajadas = (hechos, total = 6) => `<span class="l-taj" role="img" aria-label="Paso ${hechos} de ${total}">${Array.from({ length: total }, (_, i) => `<svg viewBox="0 0 100 100" aria-hidden="true">${i < hechos ? moneda('currentColor', MAIZ, { r: 42 }) : `<circle cx="50" cy="54" r="40" fill="none" stroke="currentColor" stroke-width="8"/>`}</svg>`).join('')}</span>`;

const filasReparto = () => reparto.filas.map((f, i) => `<li class="l-fila" data-fila data-valor="${f.valor}"><i class="l-pt" style="background:var(--${['suave', 's1', 's2', 's3'][i]})"></i><span class="l-nom"><b>${f.nombre}</b><small>${f.detalle}</small></span><span class="l-mon cifra" data-monto>${cop(f.valor)}</span>${controles(f, i, 'l')}</li>`).join('');

export default {
  slug: 'luca',
  nombre: 'Luca',
  bajada: 'Propuesta preliminar. "Luca" es un nombre de trabajo, no una decisión.',
  temas,
  fuentesUrl: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap',
  fuenteUI: bri,
  fuenteDisplay: bri,
  pesoDisplay: 800,
  tracking: '-.035em',
  radio: 20,
  marcador: `background:conic-gradient(from 20deg, transparent 0 40deg, var(--texto) 40deg);border-radius:50%`,
  wordmark,
  simbolo,
  appIcon,
  sobre: { bg: MAIZ, texto: TINTA, corte: CREMA, nombre: 'Sobre maíz' },
  enUso: {
    titulo: 'Nombre en uso',
    items: [['luca', wordmark(temas.claro, 52)], ['luk', `<span class="wm" style="font-size:52px;color:${TINTA}" role="img" aria-label="luk, nombre de trabajo">luk${pie(temas.claro)}</span>`], ['lucapp', wm(temas.claro, 52, 'lu', 'app', 'lucapp')]]
      .map(([n, w]) => ({ nombre: n, bg: CREMA, tx: TINTA, html: `<span class="l-uso">${w}<span class="l-home">${appIcon(64)}<span>${n}</span></span></span>` })),
  },
  colores: [
    { nombre: 'Maíz', hex: MAIZ },
    { nombre: 'Tinta monte', hex: TINTA },
    { nombre: 'Crema', hex: CREMA },
    { nombre: 'Arepa', hex: '#F3E3C4' },
    { nombre: 'Tierra', hex: '#1B1812' },
    { nombre: 'Miel', hex: '#6B4C00' },
    { nombre: 'Hoja', hex: '#5B8A5C' },
    { nombre: 'Ají', hex: '#B02A1C' },
  ],
  tipografia: [
    { familia: 'Bricolage Grotesque 800', rol: 'Cifras y titulares', muestra: '$900.000', css: `font-family:${bri};font-weight:800;font-size:clamp(56px,10vw,104px);letter-spacing:-.05em;line-height:.95;font-variation-settings:'opsz' 96` },
    { familia: 'Bricolage Grotesque 800', rol: 'Titulares', muestra: 'Tu plata, en tu idioma.', css: `font-family:${bri};font-weight:800;font-size:clamp(30px,5vw,44px);letter-spacing:-.035em;line-height:1.05;font-variation-settings:'opsz' 96` },
    { familia: 'Bricolage Grotesque 400 y 600', rol: 'Texto e interfaz', muestra: 'Va a tu EPS y es lo que te da derecho a citas, exámenes y urgencias.', css: `font-family:${bri};font-size:20px;line-height:1.45;max-width:36ch;font-variation-settings:'opsz' 14` },
    { familia: 'Bricolage Grotesque condensada', rol: 'Fechas y estados', muestra: '20 dic · Plan listo', css: `font-family:${bri};font-weight:600;font-stretch:78%;font-size:22px` },
  ],
  assets: [
    { nombre: 'Patrón de repartos', ancho: true, fondo: MAIZ, color: TINTA, html: `<div style="width:100%;height:220px;border-radius:12px;overflow:hidden">${patron(14, 4, 60, CREMA, TINTA, MAIZ)}</div>` },
    { nombre: 'Patrón de repartos, oscuro', ancho: true, fondo: '#1B1812', color: '#F7EEDB', html: `<div style="width:100%;height:160px;border-radius:12px;overflow:hidden">${patron(18, 3, 60, '#3E3628', MAIZ, '#1B1812')}</div>` },
    { nombre: 'Reparto', html: dona(temas.claro) },
    { nombre: 'Progreso en tajadas', html: `<span style="color:${TINTA};font-size:28px">${tajadas(4)}</span>` },
    { nombre: 'Botones', html: `<span style="display:grid;gap:12px;width:100%;max-width:240px"><span class="l-btn pri" style="--sombra:${TINTA}">Armemos el plan</span><span class="l-btn" style="--sombra:${TINTA}">Preguntar</span></span>` },
    { nombre: 'Pastillas', html: `<span style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><span class="l-pas">20 dic</span><span class="l-pas lleno">Plan listo</span><span class="l-pas">Te cuento</span></span>` },
  ],
  css: `
.wm{font-family:${bri};font-weight:800;letter-spacing:-.045em;line-height:1;font-variation-settings:'opsz' 96;white-space:nowrap;display:inline-flex;align-items:baseline}
.wm .pie{width:.55em;height:.55em;margin:0 .05em 0 .02em;align-self:baseline;overflow:visible}
.l-uso{display:grid;justify-items:center;gap:22px}
.l-home{display:grid;justify-items:center;gap:8px;font:500 15px system-ui,sans-serif}
.l-home svg{border-radius:18px}
.l-taj{display:inline-flex;gap:.3em}
.l-taj svg{width:1em;height:1em}
.l-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:54px;border-radius:999px;font:600 17px/1 ${bri};border:2px solid var(--texto);background:var(--bg);color:var(--texto);box-shadow:0 3px 0 var(--sombra);transition:transform .12s cubic-bezier(.23,1,.32,1),box-shadow .12s;text-decoration:none}
.l-btn:active{transform:translateY(3px);box-shadow:0 0 0 var(--sombra)}
.l-btn.pri{background:var(--acento);color:var(--sobreAcento);border-color:var(--sobreAcento)}
.tel[data-tema=oscuro] .l-btn.pri{border-color:var(--acento)}
.l-pas{display:inline-flex;align-items:center;font:600 14px/1 ${bri};font-stretch:78%;border:1.5px solid currentColor;border-radius:999px;padding:6px 11px}
.l-pas.lleno{background:${MAIZ};color:${TINTA};border-color:${MAIZ}}
.l-t{font-family:${bri};font-weight:800;letter-spacing:-.04em;line-height:1;font-variation-settings:'opsz' 96;text-wrap:balance;margin:0}
.pant{flex:1;display:flex;flex-direction:column;padding:6px 20px 24px}
/* entrada */
.l-bloque{position:relative;flex:1;min-height:330px;border-radius:32px;overflow:hidden;border:2px solid var(--texto);margin-top:8px}
.tel[data-tema=oscuro] .l-bloque{border-color:${MAIZ}}
.l-marca{margin:10px 0 14px}
.l-ent h2{font-size:44px;margin:24px 0 10px}
.l-ent p{margin:0 0 20px;font-size:16px;color:var(--suave);max-width:32ch}
.l-acc{display:grid;gap:12px}
.l-link{background:none;border:0;font:600 16px ${bri};text-decoration:underline;text-underline-offset:4px;min-height:44px}
/* inicio */
.l-cab{display:flex;justify-content:space-between;align-items:center;margin:10px 0 18px}
.l-cab h2{font-size:30px}
.l-av{width:44px;height:44px;border-radius:50%;border:2px solid var(--texto);display:grid;place-items:center;font:800 18px ${bri}}
.l-card{background:${MAIZ};color:${TINTA};border:2px solid var(--texto);border-radius:30px;padding:20px 20px 18px;box-shadow:0 4px 0 var(--sombra)}
.tel[data-tema=oscuro] .l-card{border-color:${MAIZ}}
.l-card .l-pas{border-color:${TINTA}}
.l-card .n{font-family:${bri};font-weight:800;font-size:72px;letter-spacing:-.055em;line-height:1;margin:14px 0 6px;font-variation-settings:'opsz' 96}
.l-card p{margin:0 0 16px;font-size:15px}
.l-card .l-btn{background:${TINTA};color:${MAIZ};border-color:${TINTA};box-shadow:none;min-height:50px}
.l-h3{font:700 17px ${bri};margin:24px 0 10px}
.l-lista{list-style:none;margin:0 0 auto;padding:0;display:grid;gap:8px}
.l-lista li{display:flex;align-items:center;gap:12px;background:var(--superficie);border-radius:20px;padding:13px 14px;font-size:15px}
.l-lista .m{margin-left:auto;font-weight:700}
.l-dock{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:18px}
.l-dock .l-btn:last-child{width:auto;padding:0 22px}
/* lección */
.l-top{display:flex;align-items:center;gap:14px;margin-top:8px}
.l-x{width:44px;height:44px;border-radius:50%;border:2px solid var(--texto);background:none;font-size:18px}
.l-top .l-taj{font-size:22px;color:var(--texto)}
.l-lec h2{font-size:38px;margin:30px 0 10px}
.l-lec .ctx{margin:0;color:var(--suave);font-size:16px}
.l-datos{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.l-ap{margin:auto 0 18px;text-align:center}
.l-ap .n{font-family:${bri};font-weight:800;font-size:82px;letter-spacing:-.06em;line-height:1;margin:0 0 20px;font-variation-settings:'opsz' 96;transition:font-size .3s cubic-bezier(.23,1,.32,1),color .3s}
.l-lec input[type=range]{-webkit-appearance:none;appearance:none;height:48px;background:transparent}
.l-lec input[type=range]::-webkit-slider-runnable-track{height:16px;border-radius:999px;background:var(--superficie);border:2px solid var(--texto)}
.l-lec input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:42px;height:42px;margin-top:-15px;border-radius:50%;background:${MAIZ};border:3px solid var(--texto)}
.l-lec input[type=range]::-moz-range-track{height:12px;border-radius:999px;background:var(--superficie);border:2px solid var(--texto)}
.l-lec input[type=range]::-moz-range-thumb{width:36px;height:36px;border-radius:50%;background:${MAIZ};border:3px solid var(--texto)}
.l-esc{display:flex;justify-content:space-between;font-size:13px;color:var(--suave)}
.leccion[data-revelado] .l-ap .n{font-size:28px;color:var(--suave)}
.leccion[data-revelado] .l-ap label,.leccion[data-revelado] .l-esc{display:none}
.l-res{background:var(--superficie);border-radius:28px;padding:20px;margin:0 0 16px}
.l-res .n{font-family:${bri};font-weight:800;font-size:78px;letter-spacing:-.06em;line-height:1;margin:6px 0 10px;font-variation-settings:'opsz' 96}
.l-res p{margin:0 0 8px;font-size:16px}
.l-res .por{font-size:15px;color:var(--suave)}
/* documento */
.l-doc h2{font-size:34px;margin:12px 0 10px}
.l-doc .meta{display:flex;gap:8px;margin-bottom:16px;font-size:14px;color:var(--suave)}
.l-doc details{background:var(--superficie);border-radius:22px;margin-bottom:10px;border:2px solid transparent}
.l-doc details[open]{border-color:var(--texto)}
.l-doc summary{list-style:none;display:flex;align-items:center;gap:10px;padding:16px 18px;font-size:16px;font-weight:600;min-height:56px;cursor:pointer}
.l-doc summary::-webkit-details-marker{display:none}
.l-doc summary .v{margin-left:auto;font-weight:700}
.l-doc summary .d{font-weight:500;color:var(--suave);font-size:14px}
.l-doc details p{margin:0 14px 14px;background:var(--bg);border-radius:18px 18px 18px 4px;padding:12px 14px;font-size:15px;line-height:1.45}
.l-doc .tot{background:${MAIZ};color:${TINTA}}
.l-doc .tot summary .v{font-size:26px;font-weight:800;letter-spacing:-.03em}
.l-doc .tot p{color:var(--texto)}
.l-doc .pie2{margin-top:auto;padding-top:16px}
/* reparto */
.l-rep h2{font-size:34px;margin:12px 0 4px}
.l-rep .sub{margin:0;color:var(--suave)}
.l-dona{position:relative;width:196px;aspect-ratio:1;border-radius:50%;margin:20px auto 16px;background:conic-gradient(var(--suave) 0 calc(var(--c1)*1%),var(--s1) 0 calc(var(--c2)*1%),var(--s2) 0 calc(var(--c3)*1%),var(--s3) 0 calc(var(--c4)*1%),var(--linea) 0);transition:background .2s}
.l-dona::after{content:"";position:absolute;inset:44px;border-radius:50%;background:var(--bg)}
.l-dona span{position:absolute;inset:0;display:grid;place-content:center;text-align:center;z-index:1;font-size:13px;color:var(--suave)}
.l-dona b{display:block;font:800 26px/1 ${bri};letter-spacing:-.04em;color:var(--texto);margin-top:4px}
.l-regla{font-size:14px;background:var(--superficie);border-radius:16px;padding:10px 14px;margin:0 0 12px}
.l-filas{list-style:none;margin:0 0 auto;padding:0}
.l-fila{display:grid;grid-template-columns:14px 1fr auto auto;align-items:center;gap:10px;padding:9px 0;border-bottom:1.5px solid var(--linea)}
.l-pt{width:14px;height:14px;border-radius:50%}
.l-nom b{display:block;font-weight:600}
.l-nom small{color:var(--suave);font-size:13px}
.l-mon{font-weight:700}
.l-ctl{display:flex;gap:6px}
.l-ctl button{width:44px;height:44px;border-radius:50%;border:2px solid var(--texto);background:var(--bg);font-size:20px;font-weight:700}
.l-fija{font-size:13px;color:var(--suave);grid-column:3/5;justify-self:end}
.l-fila:first-child .l-mon{display:none}
.l-rep .l-btn{margin-top:14px}
`,
  pantallas: {
    entrada: (tema) => `<div class="pant l-ent">
      <div class="l-marca">${wordmark(temas[tema], 40)}</div>
      <div class="l-bloque">${patron(6, 7, 60, CREMA, TINTA, MAIZ)}</div>
      <h2 class="l-t">Tu plata, en tu idioma.</h2>
      <p>Te explico tu desprendible, tu prima y tu tarjeta con tus números. Sin vender nada.</p>
      <div class="l-acc">
        <button class="l-btn" type="button">${icono('google', temas[tema].texto)}Seguir con Google</button>
        <button class="l-btn" type="button">${icono('apple', temas[tema].texto)}Seguir con Apple</button>
        <button class="l-link" type="button">Usar mi correo</button>
      </div>
    </div>`,
    inicio: () => `<div class="pant l-ini">
      <div class="l-cab"><h2 class="l-t">Quiubo, ${caso.nombre}.</h2><span class="l-av" aria-hidden="true">V</span></div>
      <section class="l-card" aria-label="Lo próximo">
        <span class="l-pas">En ${caso.diasPrima} días · 20 dic</span>
        <p class="n cifra">${caso.prima}</p>
        <p>te cae de prima, más o menos. ¿Ya sabes qué vas a hacer con ella?</p>
        <button class="l-btn" type="button">Armemos el plan</button>
      </section>
      <h3 class="l-h3">Lo que viene</h3>
      <ul class="l-lista">
        <li><span class="l-pas">30 nov</span>Te pagan<span class="m cifra">${caso.neto}</span></li>
        <li><span class="l-pas">31 ene</span>Intereses de cesantías<span class="m">Te cuento</span></li>
        <li><span class="l-pas lleno">Listo</span>Tu desprendible de octubre</li>
      </ul>
      <div class="l-dock"><button class="l-btn pri" type="button">Me llegó esto</button><button class="l-btn" type="button">Preguntar</button></div>
    </div>`,
    leccion: () => `<div class="pant l-lec leccion">
      <div class="l-top"><button class="l-x" type="button" aria-label="Salir de la lección">✕</button>${tajadas(2)}</div>
      <h2 class="l-t">¿Cuánto crees que te cae de prima?</h2>
      <p class="ctx">Apuesta antes de ver la cuenta. Estos son tus datos:</p>
      <div class="l-datos"><span class="l-pas">Ganas ${caso.salario}</span><span class="l-pas">Entraste el 1 oct</span><span class="l-pas">90 días al 31 dic</span></div>
      <div class="l-ap">
        <p class="n cifra" data-apuesta aria-live="polite">$500.000</p>
        <label><span class="oculto">Cuánto crees que te cae</span><input type="range" min="0" max="3600000" step="50000" value="500000"></label>
        <div class="l-esc" aria-hidden="true"><span>$0</span><span>$3.600.000</span></div>
      </div>
      <div class="l-res" data-resultado hidden>
        <p class="por">Te cae</p>
        <p class="n cifra" data-real data-foco tabindex="-1"></p>
        <p data-dif></p>
        <p class="por">Normal: la prima es medio sueldo por semestre completo y llevas 90 días de 180.</p>
      </div>
      <button class="l-btn pri" type="button" data-revelar>Ver lo que me cae</button>
    </div>`,
    documento: () => `<div class="pant l-doc">
      <h2 class="l-t">Tu desprendible, clarito</h2>
      <div class="meta"><span class="l-pas">Octubre</span><span style="align-self:center">${caso.empresa}</span></div>
      ${lineas.map((l) => `<details ${l.abierta ? 'open' : ''} class="${l.total ? 'tot' : ''}"><summary><span>${l.concepto}${l.detalle ? ` <span class="d">${l.detalle}</span>` : ''}</span><span class="v cifra">${l.signo}${l.valor}</span></summary><p>${l.texto}</p></details>`).join('')}
      <div class="pie2"><button class="l-btn pri" type="button">Y ahora, mi prima</button></div>
    </div>`,
    reparto: () => `<div class="pant l-rep" data-reparto data-total="${reparto.total}" data-paso="${reparto.paso}" style="--c1:0;--c2:44.44;--c3:77.78;--c4:100">
      <h2 class="l-t">Reparte tu prima</h2>
      <p class="sub">${caso.prima} para cuatro destinos. Tú decides.</p>
      <div class="l-dona"><span>Sin repartir<b class="cifra" data-libre aria-live="polite">$0</b></span></div>
      <p class="l-regla">Primero lo que te cuesta, después lo que te protege, después lo que quieres.</p>
      <ul class="l-filas">${filasReparto()}</ul>
      <button class="l-btn pri" type="button">Guardar mi plan</button>
    </div>`,
  },
};
