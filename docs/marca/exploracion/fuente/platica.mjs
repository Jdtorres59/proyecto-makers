// Dirección 2 · Platica (nombre de trabajo). Calidez y juego: maíz, crema y tinta verde.
import { contrastes, icono, caso, lineas } from './comun.mjs';

const temas = {
  claro: {
    bg: '#FBF4E6', superficie: '#F3E3C4', texto: '#1E291F', suave: '#5A5242',
    acento: '#F2BE22', sobreAcento: '#1E291F', acentoTexto: '#6B4C00',
    alarma: '#B02A1C', linea: '#E3D2B0', foco: '#1E291F', control: '#8A7C62',
  },
  oscuro: {
    bg: '#1B1812', superficie: '#2B261C', texto: '#F7EEDB', suave: '#BFB399',
    acento: '#F2BE22', sobreAcento: '#1B1812', acentoTexto: '#F2BE22',
    alarma: '#FF8B7B', linea: '#3E3628', foco: '#F2BE22', control: '#82765E',
  },
};

const bri = "'Bricolage Grotesque', system-ui, sans-serif";

const marca = (t, h = 44) => `<svg viewBox="0 0 194 64" height="${h}" role="img" aria-label="platica, nombre de trabajo"><text x="0" y="46" font-family="'Bricolage Grotesque', system-ui, sans-serif" font-size="54" font-weight="800" letter-spacing="-2" style="font-variation-settings:'opsz' 96" fill="${t.texto}">platica</text><circle cx="176" cy="33" r="14" fill="${t.moneda || '#F2BE22'}" stroke="${t.texto}" stroke-width="3"/></svg>`;
const simbolo = (t, h = 72) => `<svg viewBox="0 0 72 72" height="${h}" role="img" aria-label="Símbolo de platica"><circle cx="36" cy="36" r="33" fill="#F2BE22" stroke="#1E291F" stroke-width="4"/><text x="36" y="49" text-anchor="middle" font-family="'Bricolage Grotesque', system-ui, sans-serif" font-size="40" font-weight="800" fill="#1E291F">p</text></svg>`;

export default {
  slug: 'platica',
  numero: 2,
  nombre: 'Platica',
  eje: 'temperatura (cálida y con juego)',
  idea: 'Suena como hablamos de plata en Colombia: "la platica". Cálida, redonda, con un amarillo maíz que se siente de aquí y una tinta verde oscura en vez de negro.',
  esencia: [
    ['Qué es', 'Una app que te explica tu plata con tus documentos, como te la explicaría una amiga que sabe'],
    ['A quién', 'Jóvenes de 18 a 26 años: desde la mesada hasta el primer sueldo'],
    ['Promesa', 'Entender tu plata sin sentirte bruto por no saber'],
    ['Por qué el nombre', '"La platica" es como se dice en la casa, en el bus y en el trabajo. Es cariñoso y sin pretensión'],
    ['Personalidad', 'Cálida, directa, de buen humor, paciente, muy de aquí'],
    ['Lo que no somos', 'Juego de niños, banco, influenciador de trading, mamá que regaña'],
  ],
  logo: {
    texto: [
      '**Marca denominativa:** `platica` en Bricolage Grotesque 800, minúscula y apretada, con una moneda maíz al final con borde de tinta.',
      '**Símbolo:** la moneda con la "p". Ícono de app, avatar, sello en los planes guardados.',
      '**Área de respeto:** el diámetro de la moneda. **Tamaño mínimo:** 88 px de ancho; símbolo de 24 px.',
    ],
    versiones: [
      ['Positivo', 'Tinta `#1E291F`', 'Moneda maíz con borde tinta', 'Crema y claros'],
      ['Negativo', 'Crema `#F7EEDB`', 'Moneda maíz con borde crema', 'Tierra y oscuros'],
      ['Sobre maíz', 'Tinta', 'Moneda crema con borde tinta', 'Bloques maíz'],
    ],
    incorrectos: 'quitar el borde de la moneda, cambiar el maíz por dorado metálico, usar mayúsculas, inclinar el logo.',
    svg: (t) => marca(t, 56),
    simbolo: (t) => simbolo(t, 80),
  },
  colores: [
    { hex: '#F2BE22', nombre: 'Maíz', uso: 'Acento: botón principal, bloque del número que importa, moneda del logo. Nunca como texto sobre crema' },
    { hex: '#FBF4E6', nombre: 'Crema', uso: 'Fondo claro' },
    { hex: '#F3E3C4', nombre: 'Arepa', uso: 'Superficies y tarjetas' },
    { hex: '#1E291F', nombre: 'Tinta monte', uso: 'Texto y bordes en claro. Verde casi negro, para que el amarillo no se vuelva infantil' },
    { hex: '#1B1812', nombre: 'Tierra', uso: 'Fondo oscuro, café muy oscuro' },
    { hex: '#6B4C00', nombre: 'Miel', uso: 'El maíz cuando tiene que ser texto en claro (enlaces, cifras de apoyo)' },
    { hex: '#B02A1C', nombre: 'Ají', uso: 'Alarma, solo para lo que cuesta plata. En oscuro: `#FF8B7B`' },
  ],
  reglasColor: [
    'El maíz es superficie, no texto, en el tema claro. Como texto se usa miel.',
    'Bordes de 2 px en tinta y sombra dura de 3 px hacia abajo: es la marca, pero solo en lo que se toca (botones y la tarjeta principal).',
    'El ají no aparece en celebraciones ni decoración. Con temas de deuda, la calidez se baja: sin moneda, sin bromas.',
  ],
  temas,
  contrastes,
  fuentesUrl: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap',
  fuenteCuerpo: bri,
  fuenteDisplay: bri,
  pesoTitular: 800,
  cssBrandbook: 'h1,h2{letter-spacing:-.03em}',
  tipografia: [
    { rol: 'Cifras y titulares', familia: 'Bricolage Grotesque 800, tamaño óptico grande', url: 'https://fonts.google.com/specimen/Bricolage+Grotesque', pesos: '700, 800', caracter: 'Grotesca con carácter: terminaciones con tinta, un poco irregular, cálida. A tamaño grande tiene personalidad sin ser caricatura.', muestra: '$900.000', css: `font-family:${bri};font-size:68px;font-weight:800;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums` },
    { rol: 'Texto e interfaz', familia: 'Bricolage Grotesque, tamaño óptico pequeño', url: 'https://fonts.google.com/specimen/Bricolage+Grotesque', pesos: '400, 500, 600', caracter: 'La misma familia a tamaño óptico de texto se vuelve sobria y legible. Una sola fuente para todo: menos peso de descarga.', muestra: 'Va a tu EPS y te da derecho a citas.', css: `font-family:${bri};font-size:20px;font-weight:400;font-variation-settings:'opsz' 14` },
    { rol: 'Etiquetas y pastillas', familia: 'Bricolage Grotesque condensada', url: 'https://fonts.google.com/specimen/Bricolage+Grotesque', pesos: '600, ancho 80', caracter: 'Para fechas en pastilla y estados. Solo en tamaño pequeño.', muestra: '20 DIC · PLAN PENDIENTE', css: `font-family:${bri};font-size:16px;font-weight:600;font-stretch:80%;letter-spacing:.02em` },
  ],
  notasTipo: [
    'Una sola familia variable, gratuita (SIL Open Font), en Google Fonts.',
    'Cifras con `tabular-nums` y formato $1.234.567.',
    'En deuda y cobros se usa el peso 600, no el 800: menos grito.',
  ],
  imagen: [
    '**Fotografía:** real y colombiana, con color: buses, tiendas de barrio, la cocina de la casa, el celular en la mano. Gente de 18 a 27 años que se parezca a quien usa la app. Sin fotos de banco.',
    '**Ilustración:** no se usa. El juego lo ponen la moneda, el color y el movimiento, no muñecos.',
    '**Iconografía:** Phosphor Bold, redondeada, en tinta. Solo donde aclara.',
    '**Movimiento:** con resorte suave: la moneda que cae en el reparto, la tarjeta que se levanta al tocarla. Nunca en pantallas de deuda.',
  ],
  voz: {
    intro: 'Hablamos de **tú**, como hablan los parceros que saben de plata: directo, con palabras de aquí y buen humor. El humor se apaga cuando el tema es deuda o un cobro.',
    siNo: [
      ['Te cae la prima en 35 días', 'Recuerda tu pago de prima de servicios'],
      ['Esto es lo que te descuentan y por qué', 'Conceptos de nómina'],
      ['Tú decides; yo te muestro qué pasa con cada opción', 'Lo correcto es ahorrar'],
      ['Casi. Pasa mucho', '¡Ups! Respuesta incorrecta'],
      ['Esta tarjeta te cobra $86.400 al mes de intereses', 'Estás pagando una fortuna, ¡cuidado!'],
    ],
    frases: [
      ['Entrada', 'Tu plata, en tu idioma.'],
      ['Inicio', 'Quiubo, Valentina. En 35 días te cae la prima.'],
      ['Lección', '¿Cuánto crees que te cae de prima?'],
      ['Revelación', 'Te quedaste $400.000 por debajo. Normal: llevas 90 días, no el semestre entero.'],
      ['Desprendible', 'Esto va para tu EPS. Es lo que te da derecho a citas y urgencias.'],
      ['Error de lectura', 'La foto salió borrosa en la fecha. ¿Me la escribes tú?'],
    ],
    evitamos: 'billete, camello en exceso, ¡ups!, crack, hack, haz que tu dinero trabaje, libertad financiera.',
  },
  mensajes: {
    taglines: ['Tu platica, clarita.', 'Entiende tu plata sin pena.'],
    valor: 'Te explica tu desprendible, tu prima y tu tarjeta con tus números, en el idioma en que hablas de plata.',
    apoyo: [
      'Con tus números, no con ejemplos gringos.',
      'Sin vender tarjetas ni créditos.',
      'Te escribe cuando hay plata de por medio, no todos los días.',
      'Preguntar no da pena aquí.',
    ],
    cta: 'Muéstrame mi desprendible.',
    noPrometemos: 'que vas a ahorrar X % sin esfuerzo, rentabilidades, "salir de deudas en 30 días".',
  },
  aQuien: 'Andrés y la Valentina de primer mes: 18 a 23 años, que se acercan por curiosidad y se van si algo suena a banco.',
  riesgo: 'El juego puede leerse infantil o poco confiable cuando la persona sube un documento con datos sensibles, y le puede caer mal a alguien como Santiago que ya debe plata. Exige una regla clara para bajar la calidez en deuda.',
  costo: 'Medio. Una sola fuente, pero los bordes, sombras duras y movimientos con resorte piden componentes propios en React Native.',

  cssMaquetas: `
.tel{font-family:${bri};font-variation-settings:'opsz' 14}
.pant{flex:1;display:flex;flex-direction:column;padding:8px 20px 22px}
.p-t{font-weight:800;letter-spacing:-.035em;line-height:1.02;font-variation-settings:'opsz' 96;text-wrap:balance}
.p-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:56px;border-radius:999px;font:600 17px/1 ${bri};border:2px solid var(--texto);background:var(--bg);color:var(--texto);box-shadow:0 3px 0 var(--texto);transition:transform .12s cubic-bezier(.23,1,.32,1),box-shadow .12s}
.p-btn:active{transform:translateY(3px);box-shadow:0 0 0 var(--texto)}
.p-btn.pri{background:var(--acento);color:var(--sobreAcento);border-color:var(--sobreAcento);box-shadow:0 3px 0 var(--sobreAcento)}
.tel[data-tema=oscuro] .p-btn.pri{border-color:var(--acento);box-shadow:0 3px 0 #8A6A0A}
.p-pas{display:inline-block;font-size:13px;font-weight:600;font-stretch:80%;letter-spacing:.02em;border:1.5px solid var(--texto);border-radius:999px;padding:3px 10px}
/* entrada */
.p-foto{margin:10px 0 0;flex:1;min-height:260px;border-radius:28px;background:var(--acento);color:var(--sobreAcento);display:flex;flex-direction:column;justify-content:space-between;padding:20px;border:2px solid var(--texto)}
.p-foto .ph{border:2px dashed currentColor;border-radius:18px;padding:14px;font-size:13px;line-height:1.4;opacity:.9}
.p-ent h2{font-size:44px;margin:22px 0 8px}
.p-ent p{margin:0 0 20px;font-size:16px;color:var(--suave);max-width:32ch}
.p-ent .acc{display:grid;gap:12px}
.p-ent .corr{background:none;border:0;color:var(--texto);font:600 16px ${bri};text-decoration:underline;text-underline-offset:4px;min-height:44px}
/* inicio */
.p-ini h2{font-size:30px;margin:12px 0 16px}
.p-card{background:var(--acento);color:var(--sobreAcento);border:2px solid var(--texto);border-radius:28px;padding:20px;box-shadow:0 4px 0 var(--texto)}
.tel[data-tema=oscuro] .p-card{border-color:var(--acento);box-shadow:none}
.p-card .n{font-size:66px;font-weight:800;letter-spacing:-.045em;line-height:1;margin:10px 0 4px;font-variation-settings:'opsz' 96}
.p-card p{margin:0 0 16px;font-size:15px}
.p-card .p-btn{background:var(--sobreAcento);color:var(--acento);border-color:var(--sobreAcento);box-shadow:none;min-height:50px}
.p-h3{font-size:18px;font-weight:700;margin:24px 0 10px}
.p-items{display:grid;gap:10px;list-style:none;margin:0;padding:0}
.p-items li{display:flex;align-items:center;gap:12px;background:var(--superficie);border-radius:20px;padding:14px 16px;font-size:15px}
.p-items .m{margin-left:auto;font-weight:700;font-variant-numeric:tabular-nums}
.p-cuenta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0 auto}
.p-cuenta div{border:2px solid var(--linea);border-radius:20px;padding:12px 14px;font-size:14px}
.p-cuenta b{display:block;font-size:30px;font-weight:800;line-height:1.1}
.p-dock{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:18px}
.p-dock .p-btn{min-height:56px}
.p-dock .sec{width:auto;padding:0 22px}
/* lección */
.p-lec .top{display:flex;align-items:center;gap:12px;margin-top:8px}
.p-lec .x{width:44px;height:44px;border-radius:50%;border:2px solid var(--texto);background:none;color:var(--texto);font:600 18px ${bri}}
.p-lec .pr{flex:1;height:12px;border-radius:999px;border:2px solid var(--texto);overflow:hidden}
.p-lec .pr i{display:block;height:100%;width:33%;background:var(--acento)}
.p-lec h2{font-size:38px;margin:28px 0 8px}
.p-lec .ctx{margin:0;color:var(--suave);font-size:16px}
.p-ap{margin:auto 0 18px;text-align:center}
.p-ap .n{font-size:80px;font-weight:800;letter-spacing:-.05em;line-height:1;margin:0 0 18px;font-variation-settings:'opsz' 96;transition:font-size .3s cubic-bezier(.23,1,.32,1)}
.p-lec input[type=range]{-webkit-appearance:none;appearance:none;height:44px;background:transparent}
.p-lec input[type=range]::-webkit-slider-runnable-track{height:16px;border-radius:999px;background:var(--superficie);border:2px solid var(--texto)}
.p-lec input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:40px;height:40px;margin-top:-14px;border-radius:50%;background:var(--acento);border:3px solid var(--texto)}
.p-lec input[type=range]::-moz-range-track{height:12px;border-radius:999px;background:var(--superficie);border:2px solid var(--texto)}
.p-lec input[type=range]::-moz-range-thumb{width:34px;height:34px;border-radius:50%;background:var(--acento);border:3px solid var(--texto)}
.p-esc{display:flex;justify-content:space-between;font-size:13px;color:var(--suave)}
.leccion[data-revelado] .p-ap .n{font-size:28px;color:var(--suave)}
.leccion[data-revelado] .p-ap label,.leccion[data-revelado] .p-esc{display:none}
.p-res{background:var(--superficie);border-radius:28px;padding:20px;margin:0 0 16px}
.p-res .n{font-size:76px;font-weight:800;letter-spacing:-.05em;line-height:1;margin:6px 0 10px;font-variation-settings:'opsz' 96}
.p-res p{margin:0 0 8px;font-size:16px}
.p-res .por{font-size:15px;color:var(--suave)}
/* documento */
.p-doc h2{font-size:32px;margin:12px 0 4px}
.p-doc .emp{margin:0 0 16px;font-size:14px;color:var(--suave)}
.p-doc details{background:var(--superficie);border-radius:22px;margin-bottom:10px;border:2px solid transparent}
.p-doc details[open]{border-color:var(--texto)}
.p-doc summary{list-style:none;display:flex;align-items:center;gap:10px;padding:16px 18px;font-size:16px;font-weight:600;min-height:56px}
.p-doc summary::-webkit-details-marker{display:none}
.p-doc summary .v{margin-left:auto;font-variant-numeric:tabular-nums;font-weight:700}
.p-doc summary .d{font-weight:500;color:var(--suave);font-size:14px}
.p-doc details p{margin:0 14px 14px;background:var(--bg);border-radius:16px 16px 16px 4px;padding:12px 14px;font-size:15px;line-height:1.45}
.p-doc .tot{background:var(--acento);color:var(--sobreAcento)}
.p-doc .tot summary .v{font-size:24px;font-weight:800}
.p-doc .tot p{color:var(--texto)}
.p-doc .pie{margin-top:auto;display:grid;gap:12px;padding-top:16px}
`,
  pantallas: {
    entrada: (tema) => `<div class="pant p-ent">
      <div class="p-foto">
        <div>${marca({ texto: temas.claro.texto, moneda: temas.claro.bg }, 34)}</div>
        <div class="ph" role="img" aria-label="Espacio para foto pendiente">Foto pendiente: persona real de unos 23 años mirando su celular en un bus. Sin foto de banco.</div>
      </div>
      <h2 class="p-t">Tu plata, en tu idioma.</h2>
      <p>Te explico tu desprendible, tu prima y tu tarjeta con tus números. Sin vender nada.</p>
      <div class="acc">
        <button class="p-btn" type="button">${icono('google', temas[tema].texto)}Seguir con Google</button>
        <button class="p-btn" type="button">${icono('apple', temas[tema].texto)}Seguir con Apple</button>
        <button class="corr" type="button">Usar mi correo</button>
      </div>
    </div>`,
    inicio: () => `<div class="pant p-ini">
      <h2 class="p-t">Quiubo, ${caso.nombre}.</h2>
      <section class="p-card" aria-label="Lo próximo">
        <span class="p-pas">En ${caso.diasPrima} días</span>
        <p class="n cifra">${caso.prima}</p>
        <p>te cae de prima, más o menos. ¿Ya sabes qué vas a hacer con ella?</p>
        <button class="p-btn" type="button">Armemos el plan</button>
      </section>
      <h3 class="p-h3">Lo que viene</h3>
      <ul class="p-items">
        <li><span class="p-pas">30 nov</span>Te pagan<span class="m cifra">${caso.neto}</span></li>
        <li><span class="p-pas">31 ene</span>Intereses de cesantías<span class="m">Te cuento</span></li>
      </ul>
      <div class="p-cuenta" aria-label="Lo que ya tienes claro">
        <div><b>1</b>documento que ya entiendes</div>
        <div><b>0</b>decisiones tomadas</div>
      </div>
      <div class="p-dock">
        <button class="p-btn pri" type="button">Me llegó esto</button>
        <button class="p-btn sec" type="button">Preguntar</button>
      </div>
    </div>`,
    leccion: () => `<div class="pant p-lec leccion">
      <div class="top"><button class="x" type="button" aria-label="Salir de la lección">✕</button><div class="pr" role="progressbar" aria-label="Paso 2 de 6" aria-valuemin="1" aria-valuemax="6" aria-valuenow="2"><i></i></div></div>
      <h2 class="p-t">¿Cuánto crees que te cae de prima?</h2>
      <p class="ctx">Entraste el 1 de octubre y ganas ${caso.salario}. Apuesta antes de ver la cuenta.</p>
      <div class="p-ap">
        <p class="n cifra" data-apuesta aria-live="polite">$500.000</p>
        <label><span class="oculto">Cuánto crees que te cae</span><input type="range" min="0" max="3600000" step="50000" value="500000"></label>
        <div class="p-esc" aria-hidden="true"><span>$0</span><span>$3.600.000</span></div>
      </div>
      <div class="p-res" data-resultado hidden>
        <p class="por">Te cae</p>
        <p class="n cifra" data-real data-foco tabindex="-1"></p>
        <p data-dif></p>
        <p class="por">Normal: la prima es medio sueldo por semestre completo y llevas 90 días de 180.</p>
      </div>
      <button class="p-btn pri" type="button" data-revelar>Ver lo que me cae</button>
    </div>`,
    documento: () => `<div class="pant p-doc">
      <h2 class="p-t">Tu desprendible, clarito</h2>
      <p class="emp">Octubre · ${caso.empresa}</p>
      ${lineas.map((l) => `<details ${l.abierta ? 'open' : ''} class="${l.total ? 'tot' : ''}"><summary><span>${l.concepto}${l.detalle ? ` <span class="d">${l.detalle}</span>` : ''}</span><span class="v cifra">${l.signo}${l.valor}</span></summary><p>${l.texto}</p></details>`).join('')}
      <div class="pie">
        <button class="p-btn pri" type="button">Y ahora, mi prima</button>
      </div>
    </div>`,
  },
};
