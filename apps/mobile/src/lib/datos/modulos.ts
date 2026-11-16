import { cesantias, costoTarjeta, formatearCOP, type Leccion, type Modulo, type PerfilFinanciero, prima } from '@makers/core';

/*
 * Único punto de carga de los módulos de Aprender. Cuando la sesión de currículo publique
 * packages/contenido, `cargarModulos` devuelve esos módulos y nada más cambia.
 *
 * Los 12 módulos del núcleo salen de docs/ideas/10 - Curriculo completo.md: título, portada, medalla y una
 * promesa tomada de su capacidad y sus reglas. Ninguno trae lecciones inventadas, salvo el 2, que mientras
 * llega el contenido real lleva dos lecciones DE MUESTRA armadas con los textos del prototipo y las cifras
 * de la persona calculadas con packages/core. Sirven para probar todos los tipos de paso.
 */

type Base = Pick<Modulo, 'id' | 'orden' | 'capacidad' | 'titulo' | 'promesa'>;

const NUCLEO: Base[] = [
  { id: '01-desprendible', orden: 1, capacidad: 'E', titulo: 'Mi desprendible', promesa: 'Explicar cada línea de tu desprendible y saber cuánto te queda de verdad este mes.' },
  { id: '02-prima-cesantias', orden: 2, capacidad: 'E', titulo: 'Mi prima y mis cesantías', promesa: 'Saber cuánto te llega y cuándo, y decidir a dónde va antes de que llegue.' },
  { id: '03-plan-del-mes', orden: 3, capacidad: 'G', titulo: 'Mi plan del mes', promesa: 'Armar el plan de tu próximo mes, con los gastos que llegan una vez al año.' },
  { id: '04-colchon', orden: 4, capacidad: 'P', titulo: 'Mi colchón', promesa: 'Saber cuántos meses de gastos necesitas guardados y dónde tenerlos.' },
  { id: '05-costo-deuda', orden: 5, capacidad: 'D', titulo: 'Lo que cuesta una deuda', promesa: 'Calcular el costo total de un crédito y compararlo con la usura vigente.' },
  { id: '06-tarjeta', orden: 6, capacidad: 'D', titulo: 'Mi tarjeta de crédito', promesa: 'Leer tu extracto y saber qué pasa con el pago mínimo y con las cuotas.' },
  { id: '07-historial', orden: 7, capacidad: 'D', titulo: 'Mi historial crediticio', promesa: 'Consultar gratis tu historial y saber qué lo daña y qué lo construye.' },
  { id: '08-si-no-puedo-pagar', orden: 8, capacidad: 'D', titulo: 'Si no puedo pagar', promesa: 'Listar tus deudas, decidir cuál pagas primero y conocer tus derechos ante la cobranza.' },
  { id: '09-fraudes', orden: 9, capacidad: 'S', titulo: 'Fraudes y estafas', promesa: 'Reconocer una estafa a tiempo y saber qué hacer en la primera hora.' },
  { id: '10-invertir-simple', orden: 10, capacidad: 'I', titulo: 'Invertir simple', promesa: 'Explicar qué compras con un fondo indexado, cuánto cuesta y qué riesgo corres.' },
  { id: '11-primera-inversion', orden: 11, capacidad: 'I', titulo: 'Mi primera inversión', promesa: 'Hacer una primera inversión, o decidir informado no hacerla todavía.' },
  { id: '12-cripto', orden: 12, capacidad: 'I', titulo: 'Cripto: qué es y qué no', promesa: 'Saber qué compra quien compra cripto, cuánto puede caer y cómo se ven las estafas.' },
];

/** Lecciones de muestra del módulo 2, con las cifras de la persona. Se reemplazan por packages/contenido. */
function leccionesDeMuestra(perfil: PerfilFinanciero): Leccion[] {
  const salario = perfil.salario ?? 0;
  const primaDic = salario ? prima(salario, 90) : 0;
  const cesantiasAño = salario ? cesantias(salario, 90) : 0;
  const deudaCelular = perfil.deudas.find((d) => d.tipo === 'celular');
  const tarjeta6 = costoTarjeta(2_400_000, 26.5, 6);
  const tarjeta12 = costoTarjeta(2_400_000, 26.5, 12);
  const minimo = costoTarjeta(2_400_000, 26.5, 36);
  return [
    {
      id: '02-l1',
      titulo: 'Cuánto y cuándo',
      minutos: 3,
      pasos: [
        {
          tipo: 'idea',
          titulo: 'Un salario al año, en dos pagos',
          texto: 'La prima es un salario por cada año trabajado. Se paga en dos partes: a finales de junio y antes del 20 de diciembre, proporcional a los días que trabajaste en cada semestre.',
          tuyo: salario ? `Entraste en octubre: este semestre cuentas 90 días. Tu prima de diciembre es ${formatearCOP(primaDic)}.` : null,
        },
        {
          tipo: 'estimar',
          pregunta: 'Si ganas $3.000.000 y trabajaste el semestre completo, ¿cuánto te llega de prima en diciembre?',
          min: 0,
          max: 3_000_000,
          paso: 100_000,
          respuesta: prima(3_000_000, 180),
          cuenta: '$3.000.000 × 180 días ÷ 360 = $1.500.000. Medio salario por semestre completo.',
        },
        {
          tipo: 'opcion_multiple',
          pregunta: '¿Hasta cuándo tiene tu empresa para consignar tus cesantías?',
          opciones: [
            { id: 'dic', texto: '20 de diciembre' },
            { id: 'ene', texto: '31 de enero' },
            { id: 'feb', texto: '14 de febrero' },
          ],
          correcta: 'feb',
          siAcierta: `Eso. A más tardar el 14 de febrero llegan a tu fondo${cesantiasAño ? ` (las tuyas de este año: ${formatearCOP(cesantiasAño)})` : ''}. Los intereses llegan antes, el 31 de enero, directo a tu cuenta.`,
          siFalla: 'No, esa es otra fecha. Piensa que es lo último que llega en el año.',
        },
        { tipo: 'regla', texto: 'Mi prima es medio salario por semestre trabajado, y llega antes del 20 de diciembre.' },
      ],
    },
    {
      id: '02-l2',
      titulo: 'Qué va primero',
      minutos: 4,
      pasos: [
        {
          tipo: 'ordenar',
          pregunta: 'Hay un orden que casi siempre funciona. Toca las tres en el orden en que crees que van.',
          tarjetas: [
            { id: 'protege', texto: 'Lo que me protege: un colchón' },
            { id: 'quiero', texto: 'Lo que quiero: metas y gustos' },
            { id: 'cuesta', texto: 'Lo que me cuesta: deudas con interés' },
          ],
          ordenCorrecto: ['cuesta', 'protege', 'quiero'],
        },
        {
          tipo: 'comparar',
          pregunta: 'Una deuda de $2.400.000 en la tarjeta, al 26,5 % E.A. Mira cómo cambia el total según el plazo.',
          caminos: [
            { id: 'seis', titulo: 'A 6 cuotas', total: tarjeta6.total, cuotaMensual: tarjeta6.primeraCuota, meses: 6 },
            { id: 'doce', titulo: 'A 12 cuotas', total: tarjeta12.total, cuotaMensual: tarjeta12.primeraCuota, meses: 12 },
            { id: 'minimo', titulo: 'Solo el mínimo', total: minimo.total, cuotaMensual: minimo.primeraCuota, meses: 36 },
          ],
        },
        {
          tipo: 'repartir',
          pregunta: salario ? `Reparte tu prima de ${formatearCOP(primaDic)}. Tú decides.` : 'Reparte una prima de $1.000.000. Tú decides.',
          total: primaDic || 1_000_000,
          paso: 50_000,
          destinos: [
            { id: 'deuda', texto: deudaCelular ? 'Terminar el celular' : 'Deudas' },
            { id: 'colchon', texto: 'Colchón' },
            { id: 'meta', texto: perfil.meta && perfil.meta !== 'Todavía no sé' ? perfil.meta : 'Una meta' },
            { id: 'gusto', texto: 'Un gusto' },
          ],
        },
        { tipo: 'regla', texto: 'Primero lo que me cuesta, después lo que me protege y al final lo que quiero.' },
        {
          tipo: 'accion',
          texto: 'Escribe el plan de tu prima antes del 20 de diciembre: cuánto va a cada destino.',
          comoSeComprueba: 'Cuando guardas tu plan de la prima en el inicio, o me dices que ya lo escribiste.',
        },
      ],
    },
  ];
}

export function cargarModulos(perfil: PerfilFinanciero): Modulo[] {
  return NUCLEO.map((m) => {
    const lecciones = m.id === '02-prima-cesantias' ? leccionesDeMuestra(perfil) : [];
    return { ...m, portada: `portadas/${m.id}`, medalla: `medallas/${m.id}`, publicado: lecciones.length > 0, lecciones };
  });
}
