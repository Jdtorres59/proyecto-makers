// Piezas compartidas: pares de contraste (se verifican, no se muestran), logos de Google y Apple y contenido de ejemplo.
import { readFileSync } from 'node:fs';
// El contenido sale de docs/ideas/05 y docs/investigacion/08. Datos ficticios.

export const contrastes = [
  ['Texto sobre fondo', 'texto', 'bg'],
  ['Texto suave sobre fondo', 'suave', 'bg'],
  ['Texto sobre superficie', 'texto', 'superficie'],
  ['Texto suave sobre superficie', 'suave', 'superficie'],
  ['Texto del botón sobre acento', 'sobreAcento', 'acento'],
  ['Acento como texto sobre fondo', 'acentoTexto', 'bg'],
  ['Alarma sobre fondo', 'alarma', 'bg'],
  ['Anillo de foco sobre fondo', 'foco', 'bg', 'ui'],
  ['Borde de control sobre fondo', 'control', 'bg', 'ui'],
];

// Logos de Google y Apple de Simple Icons (CC0), guardados en fuente/iconos e incrustados en la página
// porque el artifact no deja cargar imágenes de otros sitios.
const svgIcono = (marca) => readFileSync(new URL(`./iconos/${marca}.svg`, import.meta.url), 'utf8');
export const icono = (marca, hex) => {
  const svg = svgIcono(marca).replace(/fill="#[0-9A-Fa-f]{6}"/, `fill="${hex}"`).replace(/<title>.*?<\/title>/, '');
  return `<img src="data:image/svg+xml,${encodeURIComponent(svg)}" alt="" width="20" height="20">`;
};

// $1.234.567, igual en Node y en el navegador (Intl con es-CO no agrupa números de 4 cifras)
export const cop = (n) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const caso = {
  nombre: 'Valentina',
  fecha: 'Sábado 15 de noviembre',
  salario: '$3.600.000',
  neto: '$3.312.000',
  prima: '$900.000',
  diasPrima: 35,
  empresa: 'Logística Andina S.A.S. (ficticia)',
};

export const lineas = [
  { concepto: 'Salario básico', valor: '$3.600.000', signo: '', texto: 'Lo que pactaste en el contrato por un mes completo. De aquí salen casi todas las demás cuentas: salud, pensión, prima y cesantías.' },
  { concepto: 'Salud', detalle: '4 %', valor: '$144.000', signo: '−', texto: 'Va a tu EPS y es lo que te da derecho a citas, exámenes y urgencias. Es el 4 % de tu salario: 3.600.000 × 4 % = 144.000.', abierta: true },
  { concepto: 'Pensión', detalle: '4 %', valor: '$144.000', signo: '−', texto: 'Va a tu ahorro para la vejez, a tu nombre. También es el 4 % de tu salario. Tu empresa pone otra parte que no ves en este papel.' },
  { concepto: 'Neto a pagar', valor: '$3.312.000', signo: '', texto: 'Lo que te consignan: el salario menos los dos descuentos. 3.600.000 − 144.000 − 144.000.', total: true },
];

// Reparto de la prima. Orden de la regla: lo que cuesta, lo que protege, lo que quiero.
export const reparto = {
  total: 900000,
  paso: 50000,
  filas: [
    { nombre: 'Deudas', detalle: 'No tienes', valor: 0, fija: true },
    { nombre: 'Colchón', detalle: 'Para imprevistos', valor: 400000 },
    { nombre: 'Mi meta', detalle: 'Irme a vivir sola', valor: 300000 },
    { nombre: 'Un gusto', detalle: 'Algo para mí', valor: 200000 },
  ],
};

// Controles del reparto: los usa cada dirección dentro de su propio diseño
export const controles = (f, i, clase) => f.fija
  ? `<span class="${clase}-fija">Nada que pagar</span>`
  : `<span class="${clase}-ctl"><button type="button" data-menos aria-label="Quitar ${cop(reparto.paso)} a ${f.nombre}">−</button><button type="button" data-mas aria-label="Sumar ${cop(reparto.paso)} a ${f.nombre}">+</button></span>`;

// Comportamiento de la lección (predecir y revelar) y del reparto. Va dentro de cada página.
export const js = `
<script>
const cop = (n) => '$' + String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.');
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
document.querySelectorAll('[data-reparto]').forEach((rp) => {
  const total = +rp.dataset.total, paso = +rp.dataset.paso, filas = [...rp.querySelectorAll('[data-fila]')];
  const pinta = () => {
    let acum = 0, usado = 0;
    filas.forEach((f, i) => {
      const v = +f.dataset.valor; usado += v; acum += v / total * 100;
      f.querySelector('[data-monto]').textContent = cop(v);
      rp.style.setProperty('--c' + (i + 1), acum.toFixed(2));
      rp.querySelectorAll('[data-barra="' + i + '"]').forEach((b) => b.style.setProperty('--p', (v / total * 100).toFixed(2)));
      const menos = f.querySelector('[data-menos]');
      if (menos) menos.disabled = v === 0;
    });
    rp.querySelectorAll('[data-libre]').forEach((x) => { x.textContent = cop(total - usado); });
    filas.forEach((f) => { const mas = f.querySelector('[data-mas]'); if (mas) mas.disabled = total - usado < paso; });
  };
  filas.forEach((f) => {
    f.querySelector('[data-mas]')?.addEventListener('click', () => { f.dataset.valor = +f.dataset.valor + paso; pinta(); });
    f.querySelector('[data-menos]')?.addEventListener('click', () => { f.dataset.valor = Math.max(0, +f.dataset.valor - paso); pinta(); });
  });
  pinta();
});
</script>`;
