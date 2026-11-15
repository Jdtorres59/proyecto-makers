// Dirección 3 · Renglón (nombre de trabajo). Precisión de instrumento: densidad, cifras en monoespaciada, cobalto.
import { contrastes, icono, caso, lineas } from './comun.mjs';

const temas = {
  claro: {
    bg: '#F4F5F1', superficie: '#E8EAE5', texto: '#14171B', suave: '#545A62',
    acento: '#2443D0', sobreAcento: '#FFFFFF', acentoTexto: '#2443D0',
    alarma: '#BE2519', linea: '#D2D6CF', foco: '#2443D0', control: '#80868D',
  },
  oscuro: {
    bg: '#111417', superficie: '#1A1F24', texto: '#E8EBEE', suave: '#9BA3AC',
    acento: '#8DA2FF', sobreAcento: '#0E1116', acentoTexto: '#8DA2FF',
    alarma: '#FF7A6B', linea: '#2A3038', foco: '#8DA2FF', control: '#6A727C',
  },
};

const ins = "'Instrument Sans', system-ui, sans-serif";
const mono = "'JetBrains Mono', ui-monospace, Menlo, monospace";

const marca = (t, h = 40) => `<svg viewBox="0 0 146 60" height="${h}" role="img" aria-label="renglón, nombre de trabajo"><text x="0" y="38" font-family="'Instrument Sans', system-ui, sans-serif" font-size="44" font-weight="600" font-stretch="85%" letter-spacing="-1.2" fill="${t.texto}">renglón</text><rect x="0" y="50" width="138" height="2" fill="${t.texto}"/><rect x="138" y="44" width="4" height="14" fill="${t.acentoTexto}"/></svg>`;
const simbolo = (t, h = 72) => `<svg viewBox="0 0 72 72" height="${h}" role="img" aria-label="Símbolo de renglón"><rect width="72" height="72" rx="10" fill="${t.texto}"/><rect x="14" y="20" width="44" height="5" fill="${t.acento}"/><rect x="14" y="34" width="32" height="5" fill="${t.bg}"/><rect x="14" y="48" width="38" height="5" fill="${t.bg}"/></svg>`;

const tabs = (activo) => `<nav class="r-tabs" aria-label="Principal">${['Línea', 'Documentos', 'Preguntar'].map((x) => `<a href="#" onclick="return false" ${x === activo ? 'aria-current="page"' : ''}>${x}</a>`).join('')}<button type="button" class="r-mas">+ Me llegó esto</button></nav>`;

export default {
  slug: 'renglon',
  numero: 3,
  nombre: 'Renglón',
  eje: 'densidad y precisión (instrumento)',
  idea: 'Tu plata como un buen instrumento: cada renglón de tus documentos, numerado, medido y explicado. Cifras en monoespaciada, reglas finas, un solo azul cobalto.',
  esencia: [
    ['Qué es', 'Una app que lee tus documentos de plata renglón por renglón y te muestra las cuentas y las fechas que vienen'],
    ['A quién', 'Jóvenes de 21 a 27 años con empleo formal que quieren ver los números completos'],
    ['Promesa', 'Ver las cuentas completas de tu plata, con la fórmula a la vista, para decidir con datos'],
    ['Por qué el nombre', 'Un desprendible, un extracto y un contrato se leen renglón por renglón. Y "llevar las cuentas en renglón" es tenerlas en orden'],
    ['Personalidad', 'Precisa, honesta, sobria, transparente, sin adornos'],
    ['Lo que no somos', 'Plataforma de trading, hoja de cálculo intimidante, banco, app de presupuesto que obliga a anotar todo'],
  ],
  logo: {
    texto: [
      '**Marca denominativa:** `renglón` en Instrument Sans 600 condensada al 85 %, sobre una regla de 2 px que termina en una marca cobalto, como el último renglón de una cuenta.',
      '**Símbolo:** tres renglones dentro de un cuadrado; el primero en cobalto. Ícono de app y avatar.',
      '**Área de respeto:** la altura de la "r". **Tamaño mínimo:** 96 px de ancho; símbolo de 20 px.',
    ],
    versiones: [
      ['Positivo', 'Grafito `#14171B`', 'Marca cobalto `#2443D0`', 'Hueso y claros'],
      ['Negativo', 'Niebla `#E8EBEE`', 'Marca cobalto claro `#8DA2FF`', 'Grafito y oscuros'],
      ['Símbolo', 'n/a', 'Primer renglón en cobalto', 'Ícono de app, avatar'],
    ],
    incorrectos: 'quitar la regla, mover la marca cobalto al inicio, usar la palabra sin tilde, mayúsculas.',
    svg: (t) => marca(t, 52),
    simbolo: (t) => simbolo(t, 80),
  },
  colores: [
    { hex: '#2443D0', nombre: 'Cobalto', uso: 'Acento: botón principal, renglón activo, enlaces y la marca del logo' },
    { hex: '#F4F5F1', nombre: 'Hueso', uso: 'Fondo claro, gris con un punto de verde, como papel de cuenta' },
    { hex: '#E8EAE5', nombre: 'Hueso 2', uso: 'Superficies y renglón abierto' },
    { hex: '#14171B', nombre: 'Grafito', uso: 'Texto en claro y fondo del símbolo' },
    { hex: '#111417', nombre: 'Grafito noche', uso: 'Fondo oscuro' },
    { hex: '#8DA2FF', nombre: 'Cobalto claro', uso: 'Acento en oscuro' },
    { hex: '#BE2519', nombre: 'Señal', uso: 'Alarma, solo para lo que cuesta plata: intereses, mora, cobros extra. En oscuro: `#FF7A6B`' },
  ],
  reglasColor: [
    'Reglas finas de 1 px en lugar de tarjetas con sombra. La jerarquía la dan el tamaño y el espacio.',
    'El cobalto marca lo que se puede tocar o lo que está activo; no colorea cifras.',
    'Grises de una sola familia, fríos con un punto de verde. Nada de gris cálido mezclado.',
  ],
  temas,
  contrastes,
  fuentesUrl: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400..700&display=swap',
  fuenteCuerpo: ins,
  fuenteDisplay: ins,
  pesoTitular: 600,
  cssBrandbook: `h1,h2,h3{font-stretch:88%}table{font-family:${mono};font-size:13px}`,
  tipografia: [
    { rol: 'Cifras', familia: 'JetBrains Mono', url: 'https://fonts.google.com/specimen/JetBrains+Mono', pesos: '400, 500, 700', caracter: 'Monoespaciada de alta legibilidad: los ceros, los ochos y los puntos de miles no se confunden. Todas las columnas de plata quedan alineadas.', muestra: '$900.000', css: `font-family:${mono};font-size:56px;font-weight:500;letter-spacing:-.04em;line-height:1` },
    { rol: 'Titulares e interfaz', familia: 'Instrument Sans', url: 'https://fonts.google.com/specimen/Instrument+Sans', pesos: '400, 500, 600; ancho 85 a 100', caracter: 'Grotesca precisa con eje de ancho. Condensada en titulares para que quepa más en una pantalla; normal en texto.', muestra: 'Cada renglón de tu plata, explicado.', css: `font-family:${ins};font-size:26px;font-weight:600;font-stretch:85%;letter-spacing:-.02em` },
    { rol: 'Notas y fórmulas', familia: 'JetBrains Mono', url: 'https://fonts.google.com/specimen/JetBrains+Mono', pesos: '400', caracter: 'La fórmula visible: así se ve de dónde sale cada cifra.', muestra: '3.600.000 × 90 ÷ 360 = 900.000', css: `font-family:${mono};font-size:16px` },
  ],
  notasTipo: [
    'Las dos son gratuitas (SIL Open Font) y están en Google Fonts.',
    'Las cifras de plata van siempre en monoespaciada, alineadas a la derecha, con formato $1.234.567.',
    'Texto base de 15 px, más denso que las otras dos direcciones. Etiquetas y fechas en monoespaciada de 12 px; nada por debajo de eso.',
  ],
  imagen: [
    '**Fotografía:** casi no hay. Cuando aparece, es el documento real de la persona (su foto del desprendible) o un detalle de objeto en luz neutra. Nada de gente posando.',
    '**Ilustración:** no se usa. Los gráficos son datos reales: barras de la quincena, línea de tiempo.',
    '**Iconografía:** Phosphor Regular de 1,5 px, en grafito.',
    '**Movimiento:** funcional y rápido (menos de 200 ms): el renglón que se abre, la cifra que cambia con el deslizador.',
  ],
  voz: {
    intro: 'Hablamos de **tú**, con frases cortas y exactas. Primero el dato, después la explicación. Siempre decimos de dónde sale la cifra. Sin adjetivos que no midan nada.',
    siNo: [
      ['Te llegan $900.000 antes del 20 de diciembre', 'Te va a llegar una buena platica'],
      ['3.600.000 × 90 ÷ 360 = 900.000', 'Calculamos tu prima con nuestra tecnología'],
      ['Tú decides el reparto; aquí ves el efecto de cada opción', 'Te recomendamos este fondo'],
      ['Diferencia: $400.000', 'Fallaste por mucho'],
      ['Intereses de este mes: $86.400', 'Estás perdiendo plata'],
    ],
    frases: [
      ['Entrada', 'Cada renglón de tu plata, explicado.'],
      ['Inicio', 'Prima estimada: $900.000. Faltan 35 días.'],
      ['Lección', 'Apuesta: ¿cuánto te llega de prima?'],
      ['Revelación', 'Te llegan $900.000. Diferencia con tu apuesta: $400.000.'],
      ['Desprendible', 'Renglón 02. Salud, 4 % de tu salario. Va a tu EPS.'],
      ['Error de lectura', 'Renglón 05 ilegible: fecha de ingreso. Escríbela para seguir.'],
    ],
    evitamos: 'inteligente, revolucionario, increíble, genial, ¡ups!, mágico.',
  },
  mensajes: {
    taglines: ['Cada renglón, claro.', 'Tus cuentas, completas.'],
    valor: 'Lee tus documentos de plata renglón por renglón, te muestra la cuenta detrás de cada cifra y las fechas que vienen.',
    apoyo: [
      'Siempre ves la fórmula: nada sale de una caja negra.',
      'Tus números, con la norma y la fecha de donde salen.',
      'No vende productos ni entidades.',
      'Lo que subes es tuyo y lo puedes borrar.',
    ],
    cta: 'Escanea tu desprendible.',
    noPrometemos: 'rentabilidades, puntajes de crédito, recomendaciones de inversión.',
  },
  aQuien: 'Valentina en su versión analítica y quien estudia ingeniería o administración: quiere ver la cuenta, no que se la cuenten.',
  riesgo: 'Puede sentirse fría o intimidante para Santiago, que ya está angustiado con su deuda, y acercarse a una app de trading. La densidad choca con "una idea por pantalla" si no se cuida.',
  costo: 'Bajo en estilo, medio en componentes: tablas alineadas, deslizador con regla y renglones numerados necesitan cuidado en React Native.',

  cssMaquetas: `
.tel{font-family:${ins};font-size:15px}
.pant{flex:1;display:flex;flex-direction:column;padding:6px 20px 0}
.r-t{font-weight:600;font-stretch:85%;letter-spacing:-.02em;line-height:1.08;text-wrap:balance}
.r-m{font-family:${mono};font-variant-numeric:tabular-nums}
.r-et{font:500 12px/1.4 ${mono};color:var(--suave);margin:0}
.r-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:48px;border-radius:6px;font:500 15px/1 ${ins};border:1px solid var(--control);background:transparent;color:var(--texto);transition:transform .12s cubic-bezier(.23,1,.32,1),background-color .12s}
.r-btn:active{transform:scale(.97)}
.r-btn.pri{background:var(--acento);color:var(--sobreAcento);border-color:var(--acento)}
.r-tabs{display:flex;align-items:center;gap:2px;border-top:1px solid var(--linea);margin:auto -20px 0;padding:8px 12px 24px}
.r-tabs a{color:var(--suave);text-decoration:none;font-size:13px;padding:12px 8px;min-height:44px}
.r-tabs a[aria-current]{color:var(--texto);font-weight:600;box-shadow:inset 0 2px 0 var(--acentoTexto)}
.r-mas{margin-left:auto;border:1px solid var(--acento);background:var(--acento);color:var(--sobreAcento);border-radius:6px;font:500 13px ${ins};padding:0 12px;min-height:44px}
/* entrada */
.r-ent .spec{margin:auto 0 0;border-top:1px solid var(--texto)}
.r-ent .spec div{display:grid;grid-template-columns:28px 1fr auto;gap:8px;padding:9px 0;border-bottom:1px solid var(--linea);font-size:14px}
.r-ent .spec .act{box-shadow:inset 3px 0 0 var(--acentoTexto);padding-left:8px;margin-left:-8px;background:var(--superficie)}
.r-ent .spec .nota{grid-column:2/4;font:12px/1.45 ${mono};color:var(--suave)}
.r-ent h2{font-size:40px;margin:28px 0 8px}
.r-ent p.b{color:var(--suave);margin:0 0 22px;max-width:34ch}
.r-ent .acc{display:grid;gap:8px;padding-bottom:20px}
.r-ent small{font:12px/1.5 ${mono};color:var(--suave);display:block;margin-top:6px}
/* inicio */
.r-ini .r-cab{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px}
.r-ini h2{font-size:24px;margin:0}
.r-hero{border-top:1px solid var(--texto);margin-top:14px;padding-top:12px}
.r-hero .n{font:500 60px/1 ${mono};letter-spacing:-.05em;margin:8px 0 6px}
.r-hero .r-fila{display:flex;gap:16px;font:12.5px/1.4 ${mono};color:var(--suave);margin-bottom:14px}
.r-tl{width:100%;border-collapse:collapse;margin-top:22px;font-size:14px}
.r-tl caption{text-align:left;font:500 12px ${mono};color:var(--suave);padding-bottom:6px}
.r-tl td{border-top:1px solid var(--linea);padding:11px 0;vertical-align:top}
.r-tl td:first-child{font:13px ${mono};color:var(--suave);width:58px}
.r-tl td:last-child{text-align:right;font-family:${mono};font-size:13.5px}
.r-tl .s{display:block;font-size:12px;color:var(--suave)}
.r-q{margin-top:18px;border:1px solid var(--linea);border-radius:6px;padding:12px}
.r-q .bar{display:flex;height:10px;margin:10px 0 8px;gap:2px}
.r-q .bar i{display:block;height:100%}
.r-q .ley{display:flex;justify-content:space-between;font:12px ${mono};color:var(--suave)}
/* lección */
.r-lec .r-cab{display:flex;justify-content:space-between;margin-top:10px}
.r-lec .pasos{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin:10px 0 24px}
.r-lec .pasos i{height:3px;background:var(--linea)}
.r-lec .pasos i.on{background:var(--acentoTexto)}
.r-lec h2{font-size:30px;margin:0 0 10px}
.r-lec .ctx{margin:0;color:var(--suave)}
.r-lec .datos{margin:14px 0 0;font:13px/1.7 ${mono};color:var(--suave)}
.r-ap{margin:auto 0 0}
.r-ap .n{font:500 66px/1 ${mono};letter-spacing:-.05em;margin:6px 0 10px;transition:font-size .2s cubic-bezier(.23,1,.32,1)}
.r-lec input[type=range]{accent-color:var(--acento);height:44px;margin:0}
.r-regla{height:14px;background:repeating-linear-gradient(90deg,var(--control) 0 1px,transparent 1px 10%) ,repeating-linear-gradient(90deg,var(--linea) 0 1px,transparent 1px 2.5%);background-size:100% 14px,100% 7px;background-repeat:no-repeat;margin:0 0 4px}
.r-esc{display:flex;justify-content:space-between;font:12px ${mono};color:var(--suave);margin-bottom:18px}
.leccion[data-revelado] .r-ap .n{font-size:24px;color:var(--suave)}
.leccion[data-revelado] .r-ap label,.leccion[data-revelado] .r-regla,.leccion[data-revelado] .r-esc{display:none}
.r-res{border-top:1px solid var(--texto);padding-top:12px;margin-bottom:14px}
.r-res .n{font:500 66px/1 ${mono};letter-spacing:-.05em;margin:6px 0 10px}
.r-res p{margin:0 0 6px}
.r-res .f{font:13px/1.6 ${mono};background:var(--superficie);padding:10px 12px;border-radius:6px;margin-top:10px}
.r-lec .r-btn.pri{margin-bottom:24px}
/* documento */
.r-doc .r-cab{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px}
.r-doc h2{font-size:26px;margin:6px 0 2px}
.r-doc .emp{font:12px ${mono};color:var(--suave);margin:0 0 14px}
.r-doc .hoja{border-top:1px solid var(--texto)}
.r-doc details{border-bottom:1px solid var(--linea)}
.r-doc summary{list-style:none;display:grid;grid-template-columns:30px 1fr auto;gap:8px;align-items:baseline;padding:13px 0;min-height:48px}
.r-doc summary::-webkit-details-marker{display:none}
.r-doc summary .i{font:12px ${mono};color:var(--suave)}
.r-doc summary .v{font-family:${mono};font-size:14px}
.r-doc summary .d{font:12px ${mono};color:var(--suave)}
.r-doc details[open] summary{box-shadow:inset 3px 0 0 var(--acentoTexto);background:var(--superficie);padding-left:8px;margin-left:-8px;padding-right:8px;margin-right:-8px}
.r-doc details p{margin:0 0 0 30px;padding:10px 0 14px;font-size:14px;line-height:1.5;color:var(--texto)}
.r-doc .tot summary{font-weight:600;border-top:1px solid var(--texto)}
.r-doc .tot summary .v{font-size:20px;font-weight:600}
.r-doc .cheq{display:flex;justify-content:space-between;font:12px ${mono};color:var(--suave);margin:12px 0 0}
.r-doc .pie{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:auto 0 24px;padding-top:16px}
`,
  pantallas: {
    entrada: (tema) => `<div class="pant r-ent">
      <div style="margin-top:18px">${marca(temas[tema], 40)}</div>
      <div class="spec" aria-label="Ejemplo de un desprendible explicado">
        <div><span class="r-et">01</span><span>Salario básico</span><span class="r-m">3.600.000</span></div>
        <div class="act"><span class="r-et">02</span><span>Salud 4 %</span><span class="r-m">−144.000</span><span class="nota">Va a tu EPS. 3.600.000 × 4 %</span></div>
        <div><span class="r-et">03</span><span>Pensión 4 %</span><span class="r-m">−144.000</span></div>
      </div>
      <h2 class="r-t">Cada renglón de tu plata, explicado.</h2>
      <p class="b">Sube tu desprendible o tu extracto. Ves cada cifra, de dónde sale y qué viene.</p>
      <div class="acc">
        <button class="r-btn" type="button">${icono('google', temas[tema].texto)}Continuar con Google</button>
        <button class="r-btn" type="button">${icono('apple', temas[tema].texto)}Continuar con Apple</button>
        <button class="r-btn" type="button">Continuar con correo</button>
        <small>Tus documentos son tuyos. No vendemos productos financieros.</small>
      </div>
    </div>`,
    inicio: (tema) => `<div class="pant r-ini">
      <div class="r-cab"><h2 class="r-t">Tu línea</h2><span class="r-et">15.11.2026</span></div>
      <section class="r-hero" aria-label="Lo próximo">
        <p class="r-et">Prima estimada · llega antes del 20 dic</p>
        <p class="n cifra">${caso.prima}</p>
        <div class="r-fila"><span>Faltan 35 días</span><span>Plan: sin hacer</span></div>
        <button class="r-btn pri" type="button">Armar el plan de la prima</button>
      </section>
      <table class="r-tl"><caption>Lo que viene</caption><tbody>
        <tr><td>30.11</td><td>Pago de nómina<span class="s">Neto, según tu desprendible</span></td><td>${caso.neto}</td></tr>
        <tr><td>20.12</td><td>Prima<span class="s">90 días trabajados</span></td><td>${caso.prima}</td></tr>
        <tr><td>31.01</td><td>Intereses de cesantías<span class="s">Te explico qué son</span></td><td>pendiente</td></tr>
      </tbody></table>
      <div class="r-q" aria-label="Tu sueldo de octubre">
        <p class="r-et">Octubre · de ${caso.salario}</p>
        <div class="bar" aria-hidden="true"><i style="flex:3312;background:var(--texto)"></i><i style="flex:144;background:var(--control)"></i><i style="flex:144;background:var(--suave)"></i></div>
        <div class="ley"><span>Neto 92 %</span><span>Salud 4 %</span><span>Pensión 4 %</span></div>
      </div>
      ${tabs('Línea')}
    </div>`,
    leccion: () => `<div class="pant r-lec leccion">
      <div class="r-cab"><span class="r-et">Mi prima</span><span class="r-et">Paso 2 de 6</span></div>
      <div class="pasos" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i><i></i><i></i><i></i></div>
      <h2 class="r-t">Apuesta: ¿cuánto te llega de prima?</h2>
      <p class="ctx">Primero tu número, después la cuenta.</p>
      <p class="datos">Salario ........ ${caso.salario}<br>Ingreso ........ 01.10.2026<br>Días al 31.12 .. 90</p>
      <div class="r-ap">
        <p class="r-et">Tu apuesta</p>
        <p class="n cifra" data-apuesta aria-live="polite">$500.000</p>
        <label><span class="oculto">Cuánto crees que te llega</span><input type="range" min="0" max="3600000" step="50000" value="500000"></label>
        <div class="r-regla" aria-hidden="true"></div>
        <div class="r-esc" aria-hidden="true"><span>$0</span><span>$1.800.000</span><span>$3.600.000</span></div>
      </div>
      <div class="r-res" data-resultado hidden>
        <p class="r-et">Te llegan</p>
        <p class="n cifra" data-real data-foco tabindex="-1"></p>
        <p data-dif></p>
        <p class="f">3.600.000 × 90 ÷ 360 = 900.000<br>salario × días ÷ 360</p>
      </div>
      <button class="r-btn pri" type="button" data-revelar>Ver la cuenta</button>
    </div>`,
    documento: () => `<div class="pant r-doc">
      <div class="r-cab"><span class="r-et">Documento 01</span><span class="r-et">Leído 15.11</span></div>
      <h2 class="r-t">Desprendible · octubre</h2>
      <p class="emp">${caso.empresa}</p>
      <div class="hoja">
      ${lineas.map((l, i) => `<details ${l.abierta ? 'open' : ''} class="${l.total ? 'tot' : ''}"><summary><span class="i">0${i + 1}</span><span>${l.concepto}${l.detalle ? ` <span class="d">${l.detalle}</span>` : ''}</span><span class="v">${l.signo}${l.valor}</span></summary><p>${l.texto}</p></details>`).join('')}
      </div>
      <p class="cheq"><span>Comprobación</span><span>3.600.000 − 288.000 = 3.312.000</span></p>
      <div class="pie">
        <button class="r-btn" type="button">Algo no cuadra</button>
        <button class="r-btn pri" type="button">Siguiente: prima</button>
      </div>
    </div>`,
  },
};
