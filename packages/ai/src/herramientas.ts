import { consultarNorma, hoyEnColombia, NORMAS } from "@makers/conocimiento";
import {
  aplicarPorcentaje,
  aportesDelEmpleado,
  costoPagoMinimo,
  costoPrestamo,
  costoTarjeta,
  type CostoDeuda,
  eventosDePlata,
  formatearCOP,
  netoDelMes,
  porcentajeDelSueldo,
} from "@makers/core";
import { z } from "zod";

/**
 * Una herramienta es lo único que el modelo puede hacer además de escribir.
 * Para agregar una: declárala aquí con su esquema y súmala a la lista del agente que la necesite.
 */
export type Herramienta<E extends z.ZodType = z.ZodType> = {
  nombre: string;
  descripcion: string;
  entrada: E;
  ejecutar(entrada: z.infer<E>): string | Promise<string>;
};

const herramienta = <E extends z.ZodType>(h: Herramienta<E>) => h;

export const calcularPorcentaje = herramienta({
  nombre: "calcular_porcentaje",
  descripcion:
    "Calcula el porcentaje de un monto en pesos colombianos, redondeado al peso. Úsala para cualquier cuenta de porcentajes en vez de hacerla mentalmente.",
  entrada: z.strictObject({
    monto: z.number().int().describe("Monto en pesos, entero y sin separadores. Ejemplo: 3600000"),
    porcentaje: z.number().describe("Porcentaje a aplicar. Ejemplo: 4 para el 4 %"),
  }),
  ejecutar({ monto, porcentaje }) {
    const resultado = aplicarPorcentaje(monto, porcentaje);
    return JSON.stringify({ resultado, formato: formatearCOP(resultado) });
  },
});

const claves = [...new Set(NORMAS.map((n) => n.clave))] as [string, ...string[]];

export const consultarNormaVigente = herramienta({
  nombre: "consultar_norma",
  descripcion:
    "Devuelve el valor vigente hoy de una norma colombiana, con su fuente. Es la única fuente válida para cifras legales.",
  entrada: z.strictObject({
    clave: z.enum(claves).describe(`Clave de la norma. ${NORMAS.map((n) => `${n.clave} = ${n.nombre}`).join("; ")}`),
  }),
  ejecutar({ clave }) {
    const norma = consultarNorma(clave);
    if (!norma) return "No hay una norma vigente cargada para esa clave. Dilo así y no des una cifra.";
    const { nombre, valor, unidad, fuente, vigenteDesde, vigenteHasta } = norma;
    return JSON.stringify({ nombre, valor, unidad, fuente, vigenteDesde, vigenteHasta });
  },
});

const plata = (descripcion: string) => z.number().int().nonnegative().describe(`${descripcion}. Pesos enteros, sin separadores`);
const conFormato = (c: CostoDeuda) =>
  JSON.stringify({ ...c, formato: { primeraCuota: formatearCOP(c.primeraCuota), intereses: formatearCOP(c.intereses), seguro: formatearCOP(c.seguro), total: formatearCOP(c.total) } });

export const calcularNeto = herramienta({
  nombre: "calcular_neto",
  descripcion:
    "Calcula lo que le descuentan a un empleado por salud, pensión y Fondo de Solidaridad Pensional, y el neto del mes. No incluye auxilio de transporte ni retención en la fuente.",
  entrada: z.strictObject({ salario: plata("Salario básico mensual") }),
  ejecutar({ salario }) {
    const hoy = hoyEnColombia();
    const aportes = aportesDelEmpleado(salario, hoy);
    const neto = netoDelMes(salario, hoy);
    return JSON.stringify({ ...aportes, neto, formato: { salud: formatearCOP(aportes.salud), pension: formatearCOP(aportes.pension), neto: formatearCOP(neto) } });
  },
});

export const calcularPrestaciones = herramienta({
  nombre: "calcular_prestaciones",
  descripcion:
    "Calcula la próxima prima, los próximos intereses de cesantías y las próximas cesantías de un empleado, con su fecha límite de pago. Si devuelve monto null es porque el salario da derecho a auxilio de transporte y esa norma no está cargada: dilo así.",
  entrada: z.strictObject({
    salario: plata("Salario básico mensual"),
    fechaIngreso: z.iso.date().describe("Fecha de ingreso a la empresa, AAAA-MM-DD"),
  }),
  ejecutar({ salario, fechaIngreso }) {
    const perfil = { nombre: null, empresa: null, cargo: null, salario, diaDePago: null, fechaIngreso, deudas: [], meta: null, vivienda: null };
    return JSON.stringify(eventosDePlata(perfil, hoyEnColombia()));
  },
});

export const costoDeTarjeta = herramienta({
  nombre: "costo_tarjeta",
  descripcion:
    "Primera cuota, intereses y total de diferir una deuda de tarjeta de crédito a n cuotas (abono fijo a capital más intereses sobre saldo). A una cuota no cobra intereses. Úsala para cada plazo que quieras comparar.",
  entrada: z.strictObject({
    saldo: plata("Saldo de la tarjeta"),
    tasaEA: z.number().nonnegative().describe("Tasa efectiva anual en porcentaje. Ejemplo: 26.5"),
    cuotas: z.number().int().min(1).max(72).describe("Número de cuotas"),
  }),
  ejecutar: ({ saldo, tasaEA, cuotas }) => conFormato(costoTarjeta(saldo, tasaEA, cuotas)),
});

export const costoDePagoMinimo = herramienta({
  nombre: "costo_pago_minimo",
  descripcion:
    "Costo de pagar solo el mínimo de la tarjeta, modelado como diferir a 36 cuotas. Es un supuesto: el mínimo real lo fija el banco en el extracto; si la persona tiene el extracto, usa su cifra.",
  entrada: z.strictObject({ saldo: plata("Saldo de la tarjeta"), tasaEA: z.number().nonnegative().describe("Tasa efectiva anual en porcentaje") }),
  ejecutar: ({ saldo, tasaEA }) => conFormato(costoPagoMinimo(saldo, tasaEA)),
});

export const costoDePrestamo = herramienta({
  nombre: "costo_prestamo",
  descripcion: "Cuota fija, intereses, seguro y total de un préstamo de cuota fija (sistema francés) con un seguro mensual fijo.",
  entrada: z.strictObject({
    monto: plata("Monto del préstamo"),
    tasaEA: z.number().nonnegative().describe("Tasa efectiva anual en porcentaje. Ejemplo: 18.9"),
    meses: z.number().int().min(1).max(120).describe("Plazo en meses"),
    seguroMensual: plata("Seguro que se suma a cada cuota; 0 si no hay"),
  }),
  ejecutar: ({ monto, tasaEA, meses, seguroMensual }) => conFormato(costoPrestamo(monto, tasaEA, meses, seguroMensual)),
});

export const porcentajeDelSueldoEnCuotas = herramienta({
  nombre: "porcentaje_del_sueldo",
  descripcion: "Suma las cuotas de un mes y dice qué porcentaje del sueldo neto se llevan. Pasa cada cuota por separado; la herramienta suma.",
  entrada: z.strictObject({ cuotas: z.array(plata("Una cuota del mes")).min(1), neto: plata("Sueldo neto del mes") }),
  ejecutar({ cuotas, neto }) {
    const total = cuotas.reduce((a, b) => a + b, 0);
    return JSON.stringify({ total, formato: formatearCOP(total), porcentaje: porcentajeDelSueldo(total, neto) });
  },
});
