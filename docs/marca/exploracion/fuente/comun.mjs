// Piezas que comparten las tres direcciones: pares de contraste, iconos de marca y el contenido de ejemplo.
// El contenido sale de docs/ideas/05 y docs/investigacion/08. Datos ficticios.

export const contrastes = [
  ['Texto sobre fondo', 'texto', 'bg'],
  ['Texto suave sobre fondo', 'suave', 'bg'],
  ['Texto sobre superficie', 'texto', 'superficie'],
  ['Texto suave sobre superficie', 'suave', 'superficie'],
  ['Texto del botón sobre acento', 'sobreAcento', 'acento'],
  ['Acento como texto sobre fondo', 'acentoTexto', 'bg'],
  ['Alarma sobre fondo', 'alarma', 'bg'],
  ['Alarma sobre superficie', 'alarma', 'superficie'],
  ['Anillo de foco sobre fondo', 'foco', 'bg', 'ui'],
  ['Borde de control sobre fondo', 'control', 'bg', 'ui'],
];

// Logos oficiales de Google y Apple desde Simple Icons (CC0). El color va sin "#".
export const icono = (marca, hex) =>
  `<img src="https://cdn.simpleicons.org/${marca}/${hex.slice(1)}" alt="" width="20" height="20">`;

// Contenido de ejemplo
export const caso = {
  nombre: 'Valentina',
  fecha: 'Sábado 15 de noviembre',
  salario: '$3.600.000',
  neto: '$3.312.000',
  salud: '$144.000',
  pension: '$144.000',
  prima: '$900.000',
  diasPrima: 35,
  empresa: 'Logística Andina S.A.S. (ficticia)',
};

// Explicaciones por línea del desprendible. Reglas: cifras de la persona, sin regaños, una idea por línea.
export const lineas = [
  {
    concepto: 'Salario básico',
    valor: '$3.600.000',
    signo: '',
    texto: 'Lo que pactaste en el contrato por un mes completo. De aquí salen casi todas las demás cuentas: salud, pensión, prima y cesantías.',
  },
  {
    concepto: 'Salud',
    detalle: '4 %',
    valor: '$144.000',
    signo: '−',
    texto: 'Va a tu EPS y es lo que te da derecho a citas, exámenes y urgencias. Es el 4 % de tu salario: 3.600.000 × 4 % = 144.000.',
    abierta: true,
  },
  {
    concepto: 'Pensión',
    detalle: '4 %',
    valor: '$144.000',
    signo: '−',
    texto: 'Va a tu ahorro para la vejez, a tu nombre. También es el 4 % de tu salario. Tu empresa pone otra parte que no ves en este papel.',
  },
  {
    concepto: 'Neto a pagar',
    valor: '$3.312.000',
    signo: '',
    texto: 'Lo que te consignan. Es el salario menos los dos descuentos: 3.600.000 − 144.000 − 144.000.',
    total: true,
  },
];
