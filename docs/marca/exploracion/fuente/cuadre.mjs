// Dirección 1 · Cuadre (nombre de trabajo). Base morada, calma editorial.
import { contrastes, icono, caso, lineas } from './comun.mjs';

const temas = {
  claro: {
    bg: '#F6F2EF', superficie: '#ECE4EA', texto: '#221A2A', suave: '#62586A',
    acento: '#4B2766', sobreAcento: '#F6F2EF', acentoTexto: '#4B2766',
    alarma: '#A23820', linea: '#DAD0D8', foco: '#4B2766', control: '#877B8E',
  },
  oscuro: {
    bg: '#1A1320', superficie: '#271D2F', texto: '#F2ECF3', suave: '#B5A8BD',
    acento: '#CDB4EA', sobreAcento: '#1A1320', acentoTexto: '#CDB4EA',
    alarma: '#F29A84', linea: '#3B2F45', foco: '#CDB4EA', control: '#85778F',
  },
};

const serif = "'Newsreader', Georgia, serif";
const sans = "'Onest', system-ui, sans-serif";

const marca = (t, h = 44) => `<svg viewBox="0 0 202 60" height="${h}" role="img" aria-label="cuadre, nombre de trabajo"><text x="0" y="44" font-family="Newsreader, Georgia, serif" font-size="52" font-weight="500" letter-spacing="-1.5" fill="${t.texto}">cuadre</text><rect x="160" y="22" width="40" height="6" rx="1" fill="${t.acentoTexto}"/><rect x="160" y="34" width="40" height="6" rx="1" fill="${t.acentoTexto}"/></svg>`;
const simbolo = (t, h = 72) => `<svg viewBox="0 0 72 72" height="${h}" role="img" aria-label="Símbolo de cuadre"><rect width="72" height="72" rx="18" fill="${t.acento}"/><rect x="18" y="25" width="36" height="7" rx="1.5" fill="${t.sobreAcento}"/><rect x="18" y="40" width="36" height="7" rx="1.5" fill="${t.sobreAcento}"/></svg>`;

const navInferior = (activo) => `<nav class="c-nav" aria-label="Principal">${['Inicio', 'Documentos', 'Preguntar'].map((x) => `<a href="#" ${x === activo ? 'aria-current="page"' : ''} onclick="return false">${x}</a>`).join('')}</nav>`;

export default {
  slug: 'cuadre',
  numero: 1,
  nombre: 'Cuadre',
  eje: 'calma editorial (base morada)',
  idea: 'Tu plata se lee como una buena página: con aire, con jerarquía y con tus cifras en tipografía de libro. Morado ciruela de tinta, no de tarjeta.',
  esencia: [
    ['Qué es', 'Una app que te explica tu plata con tus propios documentos y te ayuda a decidir antes de que lleguen las fechas'],
    ['A quién', 'Jóvenes de 21 a 26 años en sus primeros 18 meses de empleo formal en Colombia'],
    ['Promesa', 'Entender tu plata con tus números y decidir con calma, sin que nadie te venda nada'],
    ['Por qué el nombre', '"Cuadrar" es lo que uno hace con las cuentas para que den. El cuadre es el momento en que todo tiene sentido'],
    ['Personalidad', 'Serena, clara, cuidadosa, con criterio, cercana sin confianzudería'],
    ['Lo que no somos', 'Banco, fintech de neón, gurú de inversiones, profesor que regaña'],
  ],
  logo: {
    texto: [
      '**Marca denominativa:** `cuadre` en minúscula, Newsreader 500, tracking cerrado, seguida de un signo igual en ciruela. El igual es el cuadre: dos lados que dan lo mismo.',
      '**Símbolo:** el signo igual dentro de un cuadrado redondeado ciruela. Para el ícono de la app y el avatar.',
      '**Área de respeto:** la altura de la "c" alrededor. **Tamaño mínimo:** 96 px de ancho; símbolo de 24 px.',
    ],
    versiones: [
      ['Positivo', 'Tinta `#221A2A`', 'Igual en ciruela `#4B2766`', 'Papel y claros'],
      ['Negativo', 'Bruma `#F2ECF3`', 'Igual en lavanda `#CDB4EA`', 'Noche y oscuros'],
      ['Símbolo', 'n/a', 'Igual en papel sobre ciruela', 'Ícono de app, avatar'],
    ],
    incorrectos: 'separar el igual del nombre, ponerlo en otro color que no sea el acento, escribir en mayúsculas, usar degradados.',
    svg: (t) => marca(t, 56),
    simbolo: (t) => simbolo(t, 80),
  },
  colores: [
    { hex: '#4B2766', nombre: 'Ciruela', uso: 'Acento de marca: botón principal, enlaces, el igual del logo. En claro es el único color fuerte' },
    { hex: '#F6F2EF', nombre: 'Papel', uso: 'Fondo claro. Cálido, para que el morado no se vuelva frío' },
    { hex: '#ECE4EA', nombre: 'Lila papel', uso: 'Superficies: tarjetas, línea abierta del desprendible' },
    { hex: '#221A2A', nombre: 'Tinta', uso: 'Texto sobre claro. Un negro teñido de ciruela, no un negro puro' },
    { hex: '#1A1320', nombre: 'Noche', uso: 'Fondo oscuro' },
    { hex: '#CDB4EA', nombre: 'Lavanda', uso: 'Acento en oscuro: botón principal y enlaces' },
    { hex: '#A23820', nombre: 'Arcilla', uso: 'Alarma, solo para lo que cuesta plata: intereses, mora, cobros que no deberían estar. En oscuro: `#F29A84`' },
  ],
  reglasColor: [
    'Un solo acento por tema: ciruela en claro, lavanda en oscuro. Nada de degradados morado a azul.',
    'Los descuentos de ley (salud, pensión) van en tinta, no en arcilla: no son un costo malo, son tu aporte.',
    'La arcilla nunca decora. Si aparece, es porque algo te está costando plata.',
  ],
  temas,
  contrastes,
  fuentesUrl: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..600&family=Onest:wght@400..700&display=swap',
  fuenteCuerpo: sans,
  fuenteDisplay: serif,
  pesoTitular: 500,
  tipografia: [
    { rol: 'Cifras y titulares', familia: 'Newsreader', url: 'https://fonts.google.com/specimen/Newsreader', pesos: '400, 500, itálica 400', caracter: 'Serif de periódico con tamaño óptico: a 72 px se vuelve fina y elegante, a 16 px aguanta. Tus cifras se leen como algo importante, no como un dato de app.', muestra: '$900.000', css: `font-family:${serif};font-size:64px;font-weight:400;letter-spacing:-.03em;line-height:1;font-variant-numeric:lining-nums tabular-nums` },
    { rol: 'Texto e interfaz', familia: 'Onest', url: 'https://fonts.google.com/specimen/Onest', pesos: '400, 500, 600', caracter: 'Grotesca humanista y tranquila, con buena legibilidad en pantallas pequeñas. Botones, etiquetas y párrafos.', muestra: 'Es el 4 % de tu salario: va a tu EPS.', css: `font-family:${sans};font-size:20px;font-weight:400` },
    { rol: 'Notas al margen', familia: 'Newsreader itálica', url: 'https://fonts.google.com/specimen/Newsreader', pesos: '400', caracter: 'La explicación de cada línea, como una nota escrita al lado del documento.', muestra: 'Lo que pactaste en el contrato por un mes completo.', css: `font-family:${serif};font-style:italic;font-size:20px` },
  ],
  notasTipo: [
    'Las dos son gratuitas (licencia SIL Open Font) y están en Google Fonts, así que se cargan con `expo-font` sin costo.',
    'Cifras siempre con `tabular-nums` y formato $1.234.567.',
    'Titulares grandes con tracking de -0,02 em a -0,03 em; cuerpo a 0.',
  ],
  imagen: [
    '**Fotografía:** real, cálida y de cerca: manos con un desprendible, una mesa de comedor con el celular, luz de tarde. Nunca fotos de banco con gente sonriendo a una gráfica.',
    '**Ilustración:** no se usa. El protagonista es el número de la persona.',
    '**Iconografía:** casi ninguna. La navegación es de texto. Si hace falta un ícono, lineal de 1,5 px (Phosphor Light).',
    '**Movimiento:** lento y corto: la cifra que aparece, la línea que se abre. Nada que rebote.',
  ],
  voz: {
    intro: 'Hablamos de **tú**, como una amiga que ya pasó por lo mismo y sabe explicarlo sin afán. Frases cortas, sin tecnicismos y sin signos de admiración. Con deuda, cuidado: cercano no es chistoso.',
    siNo: [
      ['Te explico qué es cada descuento', 'Te enseñamos educación financiera'],
      ['Esto es lo que te llega y cuándo', '¡Felicidades! Ganaste una medalla'],
      ['Tú decides cómo repartirla', 'Lo ideal es que ahorres el 20 %'],
      ['Pasa mucho, sigamos', 'Te equivocaste'],
      ['Este cobro te está costando $86.400 al mes', 'Estás botando la plata'],
    ],
    frases: [
      ['Entrada', 'Tu plata, explicada con tus números.'],
      ['Inicio', 'En 35 días te llega la prima. Todavía no decides qué hacer con ella.'],
      ['Lección', '¿Cuánto crees que te llega de prima en diciembre?'],
      ['Revelación', 'Te quedaste $400.000 por debajo. Pasa mucho: llevas 90 días, no el semestre completo.'],
      ['Desprendible', 'Va a tu EPS y es lo que te da derecho a citas, exámenes y urgencias.'],
      ['Error de lectura', 'No pude leer la fecha de ingreso. ¿Me la escribes?'],
    ],
    evitamos: 'invierte ya, libertad financiera, hack, regaño, deberías, error, ¡ups!',
  },
  mensajes: {
    taglines: ['Que tus cuentas cuadren.', 'Tu plata, con calma.'],
    valor: 'Entiendes cada línea de tu plata con tus propios documentos y decides antes de que llegue la fecha.',
    apoyo: [
      'Tus números, no ejemplos de otro país.',
      'Te explica; no te vende productos ni entidades.',
      'Cinco minutos cuando llega la plata, no todos los días.',
      'Lo que subes es tuyo y lo puedes borrar.',
    ],
    cta: 'Sube tu desprendible.',
    noPrometemos: 'que te vas a volver rico, rentabilidades, "el mejor" producto de algún banco.',
  },
  aQuien: 'Valentina (recién empleada, sin deuda, decisiones por tomar). Se siente adulta y seria sin parecer un banco.',
  riesgo: 'Puede leerse sobria de más para alguien de 19 años, y el serif en cifras exige cuidar el tamaño mínimo en Android. El morado está cerca de Nu en Colombia; la diferencia depende de no usar morado eléctrico ni degradados.',
  costo: 'Bajo. Dos fuentes de Google, paleta corta, casi sin íconos ni ilustración.',

  cssMaquetas: `
.tel{font-family:${sans}}
.pant{flex:1;display:flex;flex-direction:column;padding:8px 24px 24px}
.c-s{font-family:${serif};letter-spacing:-.02em;font-weight:400;line-height:1.08;text-wrap:balance}
.c-et{font-size:14px;color:var(--suave);margin:0}
.c-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:52px;border-radius:14px;font:500 16px/1 ${sans};border:1px solid var(--control);background:transparent;color:var(--texto);transition:transform .14s cubic-bezier(.23,1,.32,1)}
.c-btn:active{transform:scale(.97)}
.c-btn.pri{background:var(--acento);color:var(--sobreAcento);border-color:var(--acento)}
.c-btn.inv{background:var(--texto);color:var(--bg);border-color:var(--texto)}
.c-link{background:none;border:0;color:var(--acentoTexto);font:500 16px ${sans};text-decoration:underline;text-underline-offset:4px;min-height:44px}
.c-nav{display:flex;justify-content:space-around;border-top:1px solid var(--linea);padding:10px 8px 26px;margin:0 -24px -24px}
.c-nav a{color:var(--suave);text-decoration:none;font-size:14px;padding:10px 12px;min-height:44px}
.c-nav a[aria-current]{color:var(--texto);font-weight:600;text-decoration:underline;text-decoration-color:var(--acentoTexto);text-decoration-thickness:2px;text-underline-offset:6px}
/* entrada */
.c-ent h2{font-size:46px;margin:auto 0 16px}
.c-ent p{font-size:17px;color:var(--suave);margin:0 0 32px;max-width:30ch}
.c-ent .acc{display:grid;gap:10px}
.c-ent small{display:block;font-size:13px;color:var(--suave);margin-top:16px;line-height:1.45}
/* inicio */
.c-ini h2{font-size:34px;margin:4px 0 28px}
.c-hero{border-top:1px solid var(--texto);padding-top:16px}
.c-hero .n{font-family:${serif};font-size:76px;letter-spacing:-.035em;line-height:1;margin:6px 0 8px}
.c-hero p{margin:0 0 18px;font-size:16px;max-width:30ch}
.c-lista{list-style:none;margin:28px 0 0;padding:0}
.c-lista li{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:baseline;padding:13px 0;border-top:1px solid var(--linea);font-size:15px}
.c-lista .f{font-family:${serif};font-size:19px}
.c-lista .m{font-variant-numeric:tabular-nums}
.c-lista .s{grid-column:2/4;color:var(--suave);font-size:13px;margin-top:-8px}
.c-ya{margin:22px 0 auto;font-family:${serif};font-style:italic;font-size:17px}
.c-ya a{color:var(--acentoTexto)}
/* lección */
.c-prog{display:flex;justify-content:space-between;font-size:13px;color:var(--suave);margin-top:6px}
.c-barra{height:2px;background:var(--linea);margin:8px 0 28px}
.c-barra i{display:block;height:100%;width:33%;background:var(--acentoTexto)}
.c-lec h2{font-size:32px;margin:0 0 10px}
.c-lec .ctx{font-size:15px;color:var(--suave);margin:0}
.c-ap{margin:auto 0 0}
.c-ap .n{font-family:${serif};font-size:84px;letter-spacing:-.04em;line-height:1;margin:4px 0 20px;transition:font-size .3s cubic-bezier(.23,1,.32,1),color .3s}
.c-lec input[type=range]{accent-color:var(--acento);height:44px}
.c-esc{display:flex;justify-content:space-between;font-size:13px;color:var(--suave);margin:-6px 0 22px}
.leccion[data-revelado] .c-ap .n{font-size:30px;color:var(--suave)}
.leccion[data-revelado] .c-ap label,.leccion[data-revelado] .c-esc{display:none}
.c-res .n{font-family:${serif};font-size:76px;letter-spacing:-.04em;line-height:1;margin:2px 0 12px;outline-offset:6px}
.c-res p{margin:0 0 10px;font-size:16px}
.c-res .nota{font-family:${serif};font-style:italic;font-size:17px;color:var(--suave);border-left:2px solid var(--acentoTexto);padding-left:12px;margin:14px 0 20px}
/* documento */
.c-doc h2{font-size:32px;margin:6px 0 4px}
.c-doc .emp{font-size:13px;color:var(--suave);margin:0 0 18px}
.c-doc details{border-top:1px solid var(--linea)}
.c-doc details[open]{background:var(--superficie);margin:0 -12px;padding:0 12px;border-radius:12px;border-top-color:transparent}
.c-doc summary{list-style:none;display:grid;grid-template-columns:1fr auto;gap:8px;padding:15px 0;font-size:16px;min-height:48px}
.c-doc summary::-webkit-details-marker{display:none}
.c-doc summary .v{font-variant-numeric:tabular-nums}
.c-doc summary .d{color:var(--suave);font-size:13px}
.c-doc .tot summary{font-weight:600}
.c-doc .tot summary .v{font-family:${serif};font-size:26px;font-weight:500;letter-spacing:-.02em}
.c-doc details p{font-family:${serif};font-style:italic;font-size:18px;line-height:1.45;margin:0 0 16px;max-width:32ch}
.c-doc .pie{margin-top:auto;display:grid;gap:10px;padding-top:20px}
`,
  pantallas: {
    entrada: (tema) => `<div class="pant c-ent">
      <div style="margin-top:20px">${marca(temas[tema], 34)}</div>
      <h2 class="c-s">Tu plata, explicada con tus números.</h2>
      <p>Sube tu desprendible y entiende cada línea. Nadie te va a vender nada.</p>
      <div class="acc">
        <button class="c-btn inv" type="button">${icono('apple', temas[tema].bg)}Continuar con Apple</button>
        <button class="c-btn" type="button">${icono('google', temas[tema].texto)}Continuar con Google</button>
        <button class="c-link" type="button">Prefiero entrar con mi correo</button>
      </div>
      <small>Lo que subes es tuyo y lo puedes borrar cuando quieras. Al continuar aceptas la autorización de datos.</small>
    </div>`,
    inicio: () => `<div class="pant c-ini">
      <p class="c-et" style="margin-top:14px">${caso.fecha}</p>
      <h2 class="c-s">Hola, ${caso.nombre}.</h2>
      <section class="c-hero" aria-label="Lo próximo">
        <p class="c-et">En ${caso.diasPrima} días te llega la prima, más o menos</p>
        <p class="n cifra">${caso.prima}</p>
        <p>Todavía no decides qué hacer con ella. Toma cinco minutos.</p>
        <button class="c-btn pri" type="button">Armar mi plan</button>
      </section>
      <ul class="c-lista" aria-label="Lo que viene">
        <li><span class="f">30 nov</span><span>Pago de nómina</span><span class="m">${caso.neto}</span></li>
        <li><span class="f">20 dic</span><span>Prima</span><span class="m">${caso.prima}</span><span class="s">Plan pendiente</span></li>
        <li><span class="f">31 ene</span><span>Intereses de cesantías</span><span class="m">Te explico</span></li>
      </ul>
      <p class="c-ya">Ya entiendes <a href="#" onclick="return false">tu desprendible de octubre</a>.</p>
      ${navInferior('Inicio')}
    </div>`,
    leccion: () => `<div class="pant c-lec leccion">
      <div class="c-prog"><span>Mi prima</span><span>Paso 2 de 6</span></div>
      <div class="c-barra" aria-hidden="true"><i></i></div>
      <h2 class="c-s">¿Cuánto crees que te llega de prima en diciembre?</h2>
      <p class="ctx">Entraste el 1 de octubre y ganas ${caso.salario}. Apuesta antes de ver la cuenta.</p>
      <div class="c-ap">
        <p class="c-et">Tu apuesta</p>
        <p class="n cifra" data-apuesta aria-live="polite">$500.000</p>
        <label><span class="oculto">Cuánto crees que te llega</span><input type="range" min="0" max="3600000" step="50000" value="500000"></label>
        <div class="c-esc" aria-hidden="true"><span>$0</span><span>$3.600.000</span></div>
      </div>
      <div class="c-res" data-resultado hidden>
        <p class="c-et">Lo que te llega</p>
        <p class="n cifra" data-real data-foco tabindex="-1"></p>
        <p data-dif></p>
        <p class="nota">La prima es medio salario por semestre completo. Llevas 90 días de 180, así que te llega la mitad de esa mitad.</p>
        <button class="c-btn pri" type="button">Mover mi fecha de ingreso</button>
      </div>
      <button class="c-btn pri" type="button" data-revelar>Ver lo que me llega</button>
    </div>`,
    documento: () => `<div class="pant c-doc">
      <p class="c-et" style="margin-top:14px">Documentos</p>
      <h2 class="c-s">Tu desprendible de octubre</h2>
      <p class="emp">${caso.empresa}. Toca una línea para ver qué es.</p>
      ${lineas.map((l) => `<details ${l.abierta ? 'open' : ''} class="${l.total ? 'tot' : ''}"><summary><span>${l.concepto}${l.detalle ? ` <span class="d">${l.detalle}</span>` : ''}</span><span class="v cifra">${l.signo}${l.valor}</span></summary><p>${l.texto}</p></details>`).join('')}
      <div class="pie">
        <button class="c-btn pri" type="button">Ver lo que viene: tu prima</button>
        <button class="c-link" type="button">Algo no me cuadra</button>
      </div>
    </div>`,
  },
};
