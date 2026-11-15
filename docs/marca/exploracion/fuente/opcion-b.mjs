// Luca · opción B, morada. El arco es una puerta con la luz prendida: la casa propia.
import { icono, caso, lineas, reparto, controles, cop } from './comun.mjs';

const MORADA = '#4B1F80', UVA = '#1F1030', CAL = '#F6F2EC', NOCHE = '#150B21', LILA = '#C8B3F5', DURAZNO = '#F2A97E';

const temas = {
  claro: {
    bg: CAL, superficie: '#EDE6F3', texto: UVA, suave: '#5E536B',
    acento: MORADA, sobreAcento: CAL, acentoTexto: MORADA,
    alarma: '#B3261E', linea: '#DED4E8', foco: MORADA, control: '#8A7F96',
    hero: MORADA, heroTexto: CAL, heroCifra: LILA, luz: DURAZNO,
    b1: MORADA, b2: DURAZNO, b3: '#9B7BD6', arco: MORADA, ventana: '#E3D8F0',
  },
  oscuro: {
    bg: NOCHE, superficie: '#221433', texto: '#F1EBF8', suave: '#B4A6C6',
    acento: LILA, sobreAcento: NOCHE, acentoTexto: LILA,
    alarma: '#FF8F85', linea: '#35254A', foco: LILA, control: '#7F6F94',
    hero: '#2E1A4A', heroTexto: '#F1EBF8', heroCifra: LILA, luz: DURAZNO,
    b1: LILA, b2: DURAZNO, b3: '#7E5BC2', arco: LILA, ventana: '#2E1A4A',
  },
};

const ys = "'Young Serif', Georgia, serif";
const hg = "'Host Grotesk', system-ui, sans-serif";

const arco = (x, y, w, h) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;
const puerta = (fuera, luz, extra = '') => `<path d="${arco(4, 4, 72, 92)}" fill="${fuera}"/><path d="${arco(28, 62, 24, 34)}" fill="${luz}"${extra}/>`;
const simbolo = (t, h = 96) => `<svg viewBox="0 0 80 100" height="${h}" role="img" aria-label="Símbolo">${puerta(t.arco || t.acento, DURAZNO)}</svg>`;
const wordmark = (t, h = 40) => `<span class="wm" style="font-size:${h}px;color:${t.texto}" role="img" aria-label="luca, nombre de trabajo"><svg viewBox="0 0 80 100" aria-hidden="true">${puerta(t.arco || t.acento, DURAZNO)}</svg>luca</span>`;
const appIcon = (h = 112) => `<svg viewBox="0 0 120 120" width="${h}" height="${h}" role="img" aria-label="Ícono de la app"><rect width="120" height="120" rx="28" fill="${MORADA}"/><g transform="translate(32 22) scale(.7)">${puerta(LILA, DURAZNO)}</g></svg>`;

// Patrón: ventanas en arco, algunas con la luz prendida. Determinista.
const ventanas = (cols, filas, fuera, luz, fondo) => {
  let s = '';
  for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
    const x = c * 60 + 14, y = f * 84 + 12, k = (f * 5 + c * 3) % 7;
    s += `<path d="${arco(x, y, 32, 60)}" fill="${fuera}"/>`;
    if (k === 0 || k === 3) s += `<path d="${arco(x + 6, y + 18, 20, 42)}" fill="${luz}"/>`;
  }
  return `<svg viewBox="0 0 ${cols * 60} ${filas * 84}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="width:100%;height:100%;display:block;background:${fondo}">${s}</svg>`;
};

const barrasEstaticas = (t) => {
  const v = [[0, 'Deudas'], [44, 'Colchón'], [33, 'Meta'], [22, 'Gusto']], col = [t.suave, t.b1, t.b2, t.b3];
  return `<svg viewBox="0 0 240 150" width="240" aria-hidden="true">${v.map(([p, n], i) => { const h = Math.max(4, p * 2.4), x = 12 + i * 58; return `<path d="${p ? arco(x, 120 - h, 40, h) : `M${x} 116h40v4h-40z`}" fill="${col[i]}"/><text x="${x + 20}" y="140" text-anchor="middle" font-family="Host Grotesk" font-size="12" fill="${t.texto}">${n}</text>`; }).join('')}</svg>`;
};

const meta = (p, w = 44) => `<span class="m-meta" style="--p:${p};width:${w}px" aria-hidden="true"><i></i></span>`;

const pasos = (hechos, total = 6) => `<span class="m-pasos" role="img" aria-label="Paso ${hechos} de ${total}">${Array.from({ length: total }, (_, i) => `<i class="${i < hechos ? 'on' : ''}"></i>`).join('')}</span>`;

export default {
  slug: 'b',
  opcion: 'Opción B · Morada',
  nombre: 'Luca',
  bajada: 'Opción B, morada. Propuesta preliminar: "Luca" es un nombre de trabajo.',
  temas,
  contrastesExtra: [
    ['Texto sobre tarjeta', 'heroTexto', 'hero'],
    ['Cifra sobre tarjeta', 'heroCifra', 'hero'],
  ],
  fuentesUrl: 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Host+Grotesk:wght@300..800&display=swap',
  fuenteUI: hg,
  fuenteDisplay: ys,
  pesoDisplay: 400,
  tracking: '-.02em',
  radio: 16,
  marcador: `background:var(--acentoTexto);border-radius:9px 9px 2px 2px;width:14px`,
  wordmark,
  simbolo,
  appIcon,
  sobre: { bg: MORADA, texto: CAL, arco: LILA, nombre: 'Sobre morada' },
  colores: [
    { nombre: 'Luca', hex: MORADA },
    { nombre: 'Uva', hex: UVA },
    { nombre: 'Cal', hex: CAL },
    { nombre: 'Lila niebla', hex: '#EDE6F3' },
    { nombre: 'Noche', hex: NOCHE },
    { nombre: 'Lila', hex: LILA },
    { nombre: 'Durazno', hex: DURAZNO },
    { nombre: 'Granada', hex: '#B3261E' },
  ],
  tipografia: [
    { familia: 'Young Serif', rol: 'Cifras y titulares', muestra: '$900.000', css: `font-family:${ys};font-size:clamp(56px,10vw,104px);letter-spacing:-.03em;line-height:.95` },
    { familia: 'Young Serif', rol: 'Titulares', muestra: 'Un lugar para entender tu plata.', css: `font-family:${ys};font-size:clamp(30px,5vw,44px);letter-spacing:-.02em;line-height:1.08` },
    { familia: 'Host Grotesk 400 y 600', rol: 'Texto e interfaz', muestra: 'Va a tu EPS y es lo que te da derecho a citas, exámenes y urgencias.', css: `font-family:${hg};font-size:20px;line-height:1.45;max-width:36ch` },
  ],
  assets: [
    { nombre: 'Patrón de ventanas', ancho: true, fondo: MORADA, color: CAL, html: `<div style="width:100%;height:230px;border-radius:12px;overflow:hidden">${ventanas(20, 3, '#5E3396', DURAZNO, MORADA)}</div>` },
    { nombre: 'Patrón de ventanas, claro', ancho: true, fondo: CAL, color: UVA, html: `<div style="width:100%;height:150px;border-radius:12px;overflow:hidden">${ventanas(24, 2, '#E3D8F0', DURAZNO, CAL)}</div>` },
    { nombre: 'Meta que se llena', html: `<span style="display:flex;gap:18px;align-items:flex-end">${meta(20, 44)}${meta(55, 56)}${meta(100, 68)}</span>` },
    { nombre: 'Reparto en arcos', html: barrasEstaticas(temas.claro) },
    { nombre: 'Progreso', html: `<span style="font-size:30px;color:${MORADA}">${pasos(4)}</span>` },
    { nombre: 'Botones', html: `<span style="display:grid;gap:10px;width:100%;max-width:240px"><span class="m-btn pri">Armar mi plan</span><span class="m-btn">Preguntar</span></span>` },
  ],
  css: `
.wm{font-family:${ys};letter-spacing:-.025em;line-height:1;white-space:nowrap;display:inline-flex;align-items:baseline;gap:.16em}
.wm svg{height:.86em;width:auto;align-self:baseline;transform:translateY(.02em)}
.m-meta{display:inline-block;position:relative;aspect-ratio:4/5;border-radius:999px 999px 4px 4px;overflow:hidden;background:var(--superficie);border:1.5px solid var(--acentoTexto);flex:none}
.m-meta i{position:absolute;left:0;right:0;bottom:0;height:calc(var(--p)*1%);background:${DURAZNO}}
.m-pasos{display:inline-flex;gap:.25em}
.m-pasos i{width:.5em;height:.66em;border-radius:999px 999px 2px 2px;border:2px solid currentColor;opacity:.35}
.m-pasos i.on{background:currentColor;opacity:1}
.m-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:54px;border-radius:16px;font:600 16px/1 ${hg};border:1.5px solid var(--control);background:transparent;color:var(--texto);transition:transform .14s cubic-bezier(.23,1,.32,1);text-decoration:none}
.m-btn:active{transform:scale(.97)}
.m-btn.pri{background:var(--acento);color:var(--sobreAcento);border-color:var(--acento)}
.m-btn.inv{background:var(--texto);color:var(--bg);border-color:var(--texto)}
.m-btn.luz{background:var(--heroTexto);color:var(--hero);border-color:var(--heroTexto)}
.m-t{font-family:${ys};font-weight:400;letter-spacing:-.025em;line-height:1.06;text-wrap:balance;margin:0}
.m-et{font-size:14px;color:var(--suave);margin:0}
.pant{flex:1;display:flex;flex-direction:column;padding:6px 22px 24px}
/* entrada */
.m-hero{position:relative;flex:1;min-height:340px;border-radius:180px 180px 28px 28px;overflow:hidden;margin-top:10px;background:var(--hero)}
.m-hero>svg{height:76%!important}
.m-hero .wm{position:absolute;left:0;right:0;bottom:24px;justify-content:center;color:${CAL}}
.m-ent h2{font-size:40px;margin:26px 0 10px}
.m-ent p{margin:0 0 22px;font-size:16px;color:var(--suave);max-width:32ch}
.m-acc{display:grid;gap:10px}
.m-link{background:none;border:0;color:var(--acentoTexto);font:600 16px ${hg};text-decoration:underline;text-underline-offset:4px;min-height:44px}
/* inicio */
.m-ini .m-et{margin-top:12px}
.m-ini h2{font-size:34px;margin:2px 0 16px}
.m-arco{background:var(--hero);color:var(--heroTexto);border-radius:175px 175px 26px 26px;padding:72px 24px 22px;text-align:center}
.m-arco .et{font-size:14px;opacity:.9;margin:0}
.m-arco .n{font-family:${ys};font-size:58px;letter-spacing:-.035em;line-height:1;margin:10px 0 8px;color:var(--heroCifra)}
.m-arco p{margin:0 auto 18px;font-size:15px;max-width:26ch}
.m-metafila{display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid var(--linea)}
.m-metafila b{display:block;font-weight:600}
.m-metafila span{font-size:14px;color:var(--suave)}
.m-lista{list-style:none;margin:0 0 auto;padding:0}
.m-lista li{display:grid;grid-template-columns:62px 1fr auto;gap:10px;align-items:baseline;padding:13px 0;border-bottom:1px solid var(--linea)}
.m-lista .f{font-family:${ys};font-size:18px}
.m-nav{display:flex;justify-content:space-around;border-top:1px solid var(--linea);margin:16px -22px -24px;padding:8px 8px 26px}
.m-nav a{color:var(--suave);text-decoration:none;font-size:14px;padding:12px;min-height:44px}
.m-nav a[aria-current]{color:var(--texto);font-weight:600}
/* lección */
.m-top{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:14px;color:var(--suave)}
.m-top .m-pasos{font-size:16px;color:var(--acentoTexto)}
.m-lec h2{font-size:32px;margin:26px 0 8px}
.m-lec .ctx{margin:0;color:var(--suave)}
.m-ventana{margin:auto 0 14px;border:1.5px solid var(--linea);background:var(--superficie);border-radius:170px 170px 22px 22px;padding:70px 18px 18px;text-align:center;transition:padding .3s cubic-bezier(.23,1,.32,1),border-radius .3s}
.m-ventana .n{font-family:${ys};font-size:66px;letter-spacing:-.035em;line-height:1;margin:6px 0 16px;transition:font-size .3s cubic-bezier(.23,1,.32,1)}
.m-lec input[type=range]{accent-color:var(--acento);height:44px;margin:0}
.m-esc{display:flex;justify-content:space-between;font-size:13px;color:var(--suave)}
.leccion[data-revelado] .m-ventana{padding:12px 16px;border-radius:16px;text-align:left;margin-top:auto;display:flex;justify-content:space-between;align-items:baseline}
.leccion[data-revelado] .m-ventana .n{font-size:22px;margin:0;color:var(--suave)}
.leccion[data-revelado] .m-ventana label,.leccion[data-revelado] .m-esc{display:none}
.m-res{background:var(--hero);color:var(--heroTexto);border-radius:170px 170px 22px 22px;padding:64px 22px 22px;text-align:center;margin-bottom:12px}
.m-res .n{font-family:${ys};font-size:70px;letter-spacing:-.035em;line-height:1;margin:6px 0 10px;color:var(--heroCifra);outline-offset:6px}
.m-res p{margin:0 0 8px}
.m-res .nota{font-size:14px;opacity:.9;max-width:30ch;margin:8px auto 0}
/* documento */
.m-doc .m-et{margin-top:12px}
.m-doc h2{font-size:32px;margin:2px 0 4px}
.m-doc .emp{font-size:13px;color:var(--suave);margin:0 0 16px}
.m-doc details{border-bottom:1px solid var(--linea)}
.m-doc summary{list-style:none;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:baseline;padding:15px 0;min-height:52px;cursor:pointer}
.m-doc summary::-webkit-details-marker{display:none}
.m-doc summary .v{font-family:${ys};font-size:19px}
.m-doc summary .d{font-size:13px;color:var(--suave)}
.m-doc details[open] summary{color:var(--acentoTexto)}
.m-doc details p{margin:0 0 14px;background:var(--superficie);border-radius:14px;padding:12px 14px;line-height:1.5}
.m-doc .tot{border:0;background:var(--hero);color:var(--heroTexto);border-radius:18px;padding:0 16px;margin-top:12px}
.m-doc .tot summary{color:var(--heroTexto)!important}
.m-doc .tot summary .v{font-size:30px;color:var(--heroCifra)}
.m-doc .tot p{background:transparent;padding:0 0 4px;color:var(--heroTexto)}
.m-doc .pie2{margin-top:auto;display:grid;gap:4px;padding-top:16px}
/* reparto */
.m-rep .m-et{margin-top:12px}
.m-rep h2{font-size:32px;margin:2px 0 4px}
.m-libre{font-size:14px;color:var(--suave);margin:0}
.m-libre b{font-family:${ys};font-weight:400;font-size:20px;color:var(--texto)}
.m-barras{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;height:180px;align-items:end;margin:18px 0 6px;padding:0 4px;border-bottom:1.5px solid var(--texto)}
.m-barras i{display:block;height:calc(var(--p)*1.6%);min-height:3px;max-height:100%;border-radius:999px 999px 0 0;transition:height .25s cubic-bezier(.23,1,.32,1)}
.m-etq{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:0 4px;font-size:12px;color:var(--suave);text-align:center;margin-bottom:10px}
.m-filas{list-style:none;margin:0 0 auto;padding:0}
.m-fila{display:grid;grid-template-columns:10px 1fr auto auto;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--linea)}
.m-fila .pt{width:10px;height:13px;border-radius:999px 999px 2px 2px}
.m-fila b{display:block;font-weight:600}
.m-fila small{font-size:13px;color:var(--suave)}
.m-fila .mon{font-family:${ys};font-size:18px}
.m-ctl{display:flex;gap:6px}
.m-ctl button{width:44px;height:44px;border-radius:14px;border:1.5px solid var(--control);background:transparent;font-size:20px}
.m-fija{grid-column:3/5;justify-self:end;font-size:13px;color:var(--suave)}
.m-fila:first-child .mon{display:none}
.m-regla{font-size:14px;color:var(--suave);margin:12px 0}
`,
  pantallas: {
    entrada: (tema) => `<div class="pant m-ent">
      <div class="m-hero">${ventanas(6, 5, temas[tema].hero === MORADA ? '#5E3396' : '#3D2560', DURAZNO, temas[tema].hero)}${wordmark({ texto: CAL, arco: LILA }, 40)}</div>
      <h2 class="m-t">Un lugar para entender tu plata.</h2>
      <p>Sube tu desprendible y te explico cada línea con tus números. Nadie te va a vender nada.</p>
      <div class="m-acc">
        <button class="m-btn inv" type="button">${icono('apple', temas[tema].bg)}Continuar con Apple</button>
        <button class="m-btn" type="button">${icono('google', temas[tema].texto)}Continuar con Google</button>
        <button class="m-link" type="button">Entrar con mi correo</button>
      </div>
    </div>`,
    inicio: () => `<div class="pant m-ini">
      <p class="m-et">${caso.fecha}</p>
      <h2 class="m-t">Hola, ${caso.nombre}.</h2>
      <section class="m-arco" aria-label="Lo próximo">
        <p class="et">En ${caso.diasPrima} días te llega la prima</p>
        <p class="n cifra">${caso.prima}</p>
        <p>Todavía no decides qué hacer con ella. Toma cinco minutos.</p>
        <button class="m-btn luz" type="button">Armar mi plan</button>
      </section>
      <div class="m-metafila">${meta(20, 40)}<div><b>Irte a vivir sola</b><span class="cifra">$1.200.000 de $6.000.000</span></div></div>
      <ul class="m-lista" aria-label="Lo que viene">
        <li><span class="f">30 nov</span><span>Pago de nómina</span><span class="cifra">${caso.neto}</span></li>
        <li><span class="f">31 ene</span><span>Intereses de cesantías</span><span>Te explico</span></li>
      </ul>
      <nav class="m-nav" aria-label="Principal"><a href="#" aria-current="page" onclick="return false">Inicio</a><a href="#" onclick="return false">Documentos</a><a href="#" onclick="return false">Preguntar</a></nav>
    </div>`,
    leccion: () => `<div class="pant m-lec leccion">
      <div class="m-top"><span>Mi prima</span>${pasos(2)}</div>
      <h2 class="m-t">¿Cuánto crees que te llega de prima en diciembre?</h2>
      <p class="ctx">Entraste el 1 de octubre y ganas ${caso.salario}. Apuesta antes de ver la cuenta.</p>
      <div class="m-ventana">
        <p class="m-et">Tu apuesta</p>
        <p class="n cifra" data-apuesta aria-live="polite">$500.000</p>
        <label><span class="oculto">Cuánto crees que te llega</span><input type="range" min="0" max="3600000" step="50000" value="500000"></label>
        <div class="m-esc" aria-hidden="true"><span>$0</span><span>$3.600.000</span></div>
      </div>
      <div class="m-res" data-resultado hidden>
        <p style="font-size:14px;margin:0">Te llega</p>
        <p class="n cifra" data-real data-foco tabindex="-1"></p>
        <p data-dif></p>
        <p class="nota">La prima es medio salario por semestre completo. Llevas 90 días de 180.</p>
      </div>
      <button class="m-btn pri" type="button" data-revelar>Ver lo que me llega</button>
    </div>`,
    documento: () => `<div class="pant m-doc">
      <p class="m-et">Documentos</p>
      <h2 class="m-t">Tu desprendible de octubre</h2>
      <p class="emp">${caso.empresa}</p>
      ${lineas.map((l) => `<details ${l.abierta ? 'open' : ''} class="${l.total ? 'tot' : ''}"><summary><span>${l.concepto}${l.detalle ? ` <span class="d">${l.detalle}</span>` : ''}</span><span class="v cifra">${l.signo}${l.valor}</span></summary><p>${l.texto}</p></details>`).join('')}
      <div class="pie2"><button class="m-btn pri" type="button">Ver lo que viene: tu prima</button><button class="m-link" type="button">Algo no me cuadra</button></div>
    </div>`,
    reparto: () => `<div class="pant m-rep" data-reparto data-total="${reparto.total}" data-paso="${reparto.paso}">
      <p class="m-et">Tu prima · ${caso.prima}</p>
      <h2 class="m-t">Reparte antes de que llegue</h2>
      <p class="m-libre">Sin repartir: <b class="cifra" data-libre aria-live="polite">$0</b></p>
      <div class="m-barras" aria-hidden="true">${reparto.filas.map((f, i) => `<i data-barra="${i}" style="--p:${(f.valor / reparto.total * 100).toFixed(2)};background:var(--${['suave', 'b1', 'b2', 'b3'][i]})"></i>`).join('')}</div>
      <div class="m-etq" aria-hidden="true">${reparto.filas.map((f) => `<span>${f.nombre}</span>`).join('')}</div>
      <ul class="m-filas">${reparto.filas.map((f, i) => `<li class="m-fila" data-fila data-valor="${f.valor}"><i class="pt" style="background:var(--${['suave', 'b1', 'b2', 'b3'][i]})"></i><span><b>${f.nombre}</b><small>${f.detalle}</small></span><span class="mon cifra" data-monto>${cop(f.valor)}</span>${controles(f, i, 'm')}</li>`).join('')}</ul>
      <p class="m-regla">Primero lo que te cuesta, después lo que te protege, después lo que quieres.</p>
      <button class="m-btn pri" type="button">Guardar mi plan</button>
    </div>`,
  },
};
