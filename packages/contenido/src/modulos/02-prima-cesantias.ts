import { consultarNorma } from "@makers/conocimiento";
import {
  cesantias,
  diasTrabajados,
  eventosDePlata,
  formatearCOP,
  interesesDeCesantias,
  type Modulo,
  type PerfilFinanciero,
  prima,
  tieneAuxilioDeTransporte,
} from "@makers/core";

/*
 * Módulo 2 del núcleo: prima y cesantías (E4 y E5 del currículo, docs/ideas/10).
 * Ninguna cifra legal va escrita en el texto: fechas y tasas salen de @makers/conocimiento y
 * los montos de las cuentas de @makers/core. La prueba lo revisa sobre este archivo.
 */

/** Sueldo del ejemplo (ficticio). Va por encima del tope del auxilio de transporte, que core todavía no calcula. */
export const SALARIO_EJEMPLO = 4_200_000;

function valor(clave: string, hoy: string): number {
  const n = consultarNorma(clave, hoy);
  if (!n) throw new Error(`No hay una norma vigente "${clave}" al ${hoy}`);
  return n.valor;
}

/** Monto del próximo evento de ese tipo para la persona, o null si Luca no lo puede calcular. */
function proximo(perfil: PerfilFinanciero | null, hoy: string, tipo: "prima" | "cesantias" | "intereses_cesantias") {
  if (!perfil) return null;
  return eventosDePlata(perfil, hoy).find((e) => e.tipo === tipo) ?? null;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fechaLarga = (f: string) => `${Number(f.slice(8))} de ${MESES[Number(f.slice(5, 7)) - 1]}`;

/** Lo que va en "tuyo" cuando hay perfil: el monto calculado, o por qué no se pudo. */
function tuyo(perfil: PerfilFinanciero | null, hoy: string, tipo: "prima" | "cesantias" | "intereses_cesantias", frase: (monto: string, fecha: string) => string) {
  if (!perfil || perfil.salario === null || !perfil.fechaIngreso) return null;
  const evento = proximo(perfil, hoy, tipo);
  if (!evento) return null;
  if (evento.monto === null) {
    return tieneAuxilioDeTransporte(perfil.salario, hoy)
      ? "Con tu sueldo también recibes auxilio de transporte, y ese auxilio entra en la cuenta. Luca todavía no lo calcula, así que mira el valor exacto en tu desprendible."
      : null;
  }
  return frase(formatearCOP(evento.monto), fechaLarga(evento.fecha));
}

export function primaYCesantias(perfil: PerfilFinanciero | null, hoy: string): Modulo {
  const año = hoy.slice(0, 4);
  const s = SALARIO_EJEMPLO;
  const sueldo = formatearCOP(s);

  const diaJunio = valor("prima_pago_junio", hoy);
  const diaDiciembre = valor("prima_pago_diciembre", hoy);
  const diaIntereses = valor("intereses_cesantias_pago_enero", hoy);
  const diaFondo = valor("cesantias_consignacion_febrero", hoy);
  const tasa = valor("intereses_cesantias_tasa", hoy);

  // Semestre completo y alguien que entró en abril.
  const diasSemestre = diasTrabajados(`${año}-01-01`, `${año}-01-01`, `${año}-06-30`);
  const diasDesdeAbril = diasTrabajados(`${año}-04-01`, `${año}-01-01`, `${año}-06-30`);
  const primaCompleta = prima(s, diasSemestre);
  const primaDesdeAbril = prima(s, diasDesdeAbril);

  // Año completo y alguien que entró en mayo.
  const diasAño = diasTrabajados(`${año}-01-01`, `${año}-01-01`, `${año}-12-31`);
  const diasDesdeMayo = diasTrabajados(`${año}-05-01`, `${año}-01-01`, `${año}-12-31`);
  const cesantiasAño = cesantias(s, diasAño);
  const cesantiasDesdeMayo = cesantias(s, diasDesdeMayo);
  const interesesDesdeMayo = interesesDeCesantias(cesantiasDesdeMayo, diasDesdeMayo, hoy);

  const primaPersona = proximo(perfil, hoy, "prima")?.monto ?? null;
  const totalReparto = primaPersona ?? primaCompleta;

  return {
    id: "prima-cesantias",
    orden: 2,
    capacidad: "E",
    titulo: "Prima y cesantías",
    promesa: "Al terminar sabes cuánto te llega de prima y de cesantías, cuándo, y qué vas a hacer con esa plata antes de que caiga.",
    portada: "02-prima-cesantias",
    medalla: "02-prima-cesantias",
    publicado: false,
    lecciones: [
      {
        id: "prima-cesantias.cuanto-y-cuando",
        titulo: "Cuánto y cuándo llega la prima",
        minutos: 4,
        pasos: [
          {
            tipo: "idea",
            titulo: "Medio sueldo por cada semestre trabajado",
            texto:
              `La prima es una plata extra que te paga tu empleador por tener contrato laboral. Llega en dos pagos: ` +
              `el primero a más tardar el ${diaJunio} de junio y el segundo a más tardar el ${diaDiciembre} de diciembre. ` +
              `Si trabajaste el semestre completo, cada pago es la mitad de tu sueldo. Si entraste a mitad de semestre, ` +
              `te pagan solo por los días que trabajaste: sueldo por días trabajados, dividido entre ${diasAño}. ` +
              `Si recibes auxilio de transporte, ese auxilio también entra en la cuenta.`,
            tuyo: tuyo(perfil, hoy, "prima", (monto, fecha) => `Si sigues en tu trabajo, tu próxima prima llega a más tardar el ${fecha} y sería cerca de ${monto}.`),
          },
          {
            tipo: "estimar",
            pregunta: `Laura gana ${sueldo} y entró a trabajar el primero de abril. ¿Cuánto le llega de prima en junio?`,
            min: 0,
            max: s,
            paso: 50_000,
            respuesta: primaDesdeAbril,
            cuenta:
              `De abril a junio son ${diasDesdeAbril} días en la cuenta de la prima. ` +
              `${sueldo} por ${diasDesdeAbril}, dividido entre ${diasAño}, da ${formatearCOP(primaDesdeAbril)}. ` +
              `Con el semestre completo serían ${formatearCOP(primaCompleta)}.`,
          },
          {
            tipo: "opcion_multiple",
            pregunta: "Llega diciembre y la prima no ha caído. ¿Qué es lo más útil?",
            opciones: [
              { id: "esperar", texto: "Esperar a enero, a veces se demora" },
              { id: "revisar", texto: "Revisar la fecha límite y preguntarle a recursos humanos" },
              { id: "nada", texto: "Nada, la prima es un regalo de la empresa" },
            ],
            correcta: "revisar",
            siAcierta: `Eso. La prima no es un regalo: es un derecho con fecha. Si pasa el ${diaDiciembre} de diciembre y no llegó, preguntar es lo normal.`,
            siFalla: `La prima no es un favor de la empresa: la ley pone una fecha límite, el ${diaDiciembre} de diciembre. Si no llegó, vale la pena preguntar en recursos humanos.`,
          },
          { tipo: "regla", texto: "Mi prima es mi sueldo por los días que trabajé en el semestre, dividido entre los días del año comercial." },
        ],
      },
      {
        id: "prima-cesantias.repartir",
        titulo: "Repartirla antes de que llegue",
        minutos: 5,
        pasos: [
          {
            tipo: "idea",
            titulo: "La plata sin destino se evapora",
            texto:
              "Cuando la prima cae sin plan, se va en cosas pequeñas y a las dos semanas no sabes en qué. " +
              "Lo que funciona es decidir antes. Casi siempre hay cuatro destinos posibles: tu colchón para imprevistos, " +
              "una deuda que te está cobrando intereses, una meta que tengas y un gusto. Ninguno está prohibido; lo que importa es que lo decidas tú, con calma.",
            tuyo: null,
          },
          {
            tipo: "ordenar",
            pregunta: "Una pista para ordenar: ¿qué conviene mirar primero cuando llega plata extra?",
            tarjetas: [
              { id: "gusto", texto: "Un gusto" },
              { id: "colchon", texto: "El colchón para imprevistos" },
              { id: "deuda", texto: "La deuda que más intereses cobra" },
              { id: "meta", texto: "Una meta, como un viaje o un curso" },
            ],
            ordenCorrecto: ["deuda", "colchon", "meta", "gusto"],
          },
          {
            tipo: "repartir",
            pregunta:
              primaPersona === null
                ? `Imagina que te llegan ${formatearCOP(totalReparto)} de prima. ¿Cómo los repartirías?`
                : `Tu próxima prima sería cerca de ${formatearCOP(totalReparto)}. ¿Cómo la repartirías?`,
            total: totalReparto,
            paso: 50_000,
            destinos: [
              { id: "deuda", texto: "Deuda" },
              { id: "colchon", texto: "Colchón" },
              { id: "meta", texto: "Meta" },
              { id: "gusto", texto: "Gusto" },
            ],
          },
          { tipo: "regla", texto: "Primero lo que me cuesta, después lo que me protege, después lo que quiero. Y lo decido antes de que llegue la plata." },
        ],
      },
      {
        id: "prima-cesantias.cesantias",
        titulo: "Cesantías: tu plata para cuando no tengas trabajo",
        minutos: 4,
        pasos: [
          {
            tipo: "idea",
            titulo: "Un sueldo por año, guardado en un fondo",
            texto:
              `Por cada año trabajado, tu empleador te reconoce un sueldo de cesantías. Esa plata no te llega a la cuenta: ` +
              `la consigna en un fondo de cesantías a más tardar el ${diaFondo} de febrero del año siguiente. ` +
              `Su idea es protegerte si te quedas sin trabajo, por eso la ley solo deja sacarlas en casos puntuales. ` +
              `Tu fondo te dice cuáles aplican para ti.`,
            tuyo: tuyo(perfil, hoy, "cesantias", (monto, fecha) => `Si sigues en tu trabajo, el ${fecha} tu empleador consignaría cerca de ${monto} en tu fondo.`),
          },
          {
            tipo: "estimar",
            pregunta: `Laura gana ${sueldo} y entró el primero de mayo. ¿Cuánto le consignan de cesantías por este año?`,
            min: 0,
            max: s,
            paso: 50_000,
            respuesta: cesantiasDesdeMayo,
            cuenta:
              `De mayo a diciembre son ${diasDesdeMayo} días. ${sueldo} por ${diasDesdeMayo}, dividido entre ${diasAño}, ` +
              `da ${formatearCOP(cesantiasDesdeMayo)}. Con el año completo serían ${formatearCOP(cesantiasAño)}, un sueldo entero.`,
          },
          {
            tipo: "opcion_multiple",
            pregunta: "¿Para qué existen las cesantías?",
            opciones: [
              { id: "vacaciones", texto: "Para las vacaciones de fin de año" },
              { id: "desempleo", texto: "Para tener un respaldo si te quedas sin trabajo" },
              { id: "bono", texto: "Son un bono por buen desempeño" },
            ],
            correcta: "desempleo",
            siAcierta: "Exacto. Funcionan como un colchón que se arma solo mientras trabajas.",
            siFalla: "No del todo. Las cesantías son un respaldo para cuando te quedas sin trabajo; por eso no se sacan para cualquier cosa.",
          },
          { tipo: "regla", texto: "Mis cesantías son mi respaldo si me quedo sin trabajo. Sé en qué fondo están y lo reviso cada febrero." },
        ],
      },
      {
        id: "prima-cesantias.intereses",
        titulo: "Los intereses que llegan en enero",
        minutos: 4,
        pasos: [
          {
            tipo: "idea",
            titulo: "Una plata que sí cae en tu cuenta",
            texto:
              `Además de las cesantías, tu empleador te paga intereses sobre ellas: el ${tasa} % al año, o la parte que corresponda si no trabajaste el año completo. ` +
              `A diferencia de las cesantías, esos intereses te llegan directo, a más tardar el ${diaIntereses} de enero. ` +
              `Como caen justo después de diciembre, es fácil confundirlos con plata libre.`,
            tuyo: tuyo(perfil, hoy, "intereses_cesantias", (monto, fecha) => `A más tardar el ${fecha} te llegarían cerca de ${monto} de intereses de cesantías.`),
          },
          {
            tipo: "estimar",
            pregunta: `Las cesantías de Laura por este año son ${formatearCOP(cesantiasDesdeMayo)}. ¿Cuánto le llega de intereses en enero?`,
            min: 0,
            max: cesantiasDesdeMayo,
            paso: 1_000,
            respuesta: interesesDesdeMayo,
            cuenta:
              `Los intereses son el ${tasa} % al año. Laura trabajó ${diasDesdeMayo} de ${diasAño} días, así que le toca esa parte: ` +
              `${formatearCOP(cesantiasDesdeMayo)} por ${tasa} %, por ${diasDesdeMayo} entre ${diasAño}, da ${formatearCOP(interesesDesdeMayo)}.`,
          },
          {
            tipo: "opcion_multiple",
            pregunta: "En enero te cae una plata que no esperabas y no sabes de dónde salió. ¿Qué haces primero?",
            opciones: [
              { id: "gastar", texto: "Gastarla, seguro es un error a mi favor" },
              { id: "mirar", texto: "Mirar de dónde viene: puede ser el pago de intereses de cesantías" },
              { id: "devolver", texto: "Devolverla al banco" },
            ],
            correcta: "mirar",
            siAcierta: "Bien. Saber de dónde viene la plata es lo que te deja decidir a dónde va.",
            siFalla: "Antes de moverla, mira de dónde viene. En enero lo más común es que sean los intereses de tus cesantías, y esa plata es tuya.",
          },
          { tipo: "regla", texto: "Los intereses de mis cesantías tienen destino antes de llegar." },
          {
            tipo: "accion",
            texto:
              "Antes de tu próxima prima, guarda en Luca cómo la vas a repartir. Y averigua en qué fondo están tus cesantías y cuánto tienen hoy: lo ves en la app o la página de tu fondo, o en el certificado que te mandan.",
            comoSeComprueba: "Guardó el reparto de la prima como una decisión en Luca antes de la fecha de pago, y anotó el nombre de su fondo de cesantías y el saldo.",
          },
        ],
      },
    ],
  };
}
