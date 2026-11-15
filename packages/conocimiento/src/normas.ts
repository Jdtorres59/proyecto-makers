import { z } from "zod";

/**
 * Una norma colombiana con cifra. Toda cifra legal que el producto muestre sale de aquí,
 * nunca de la memoria del modelo. Agregar o cambiar una entrada exige fuente y verificación humana.
 */
export const Norma = z.object({
  clave: z.string().regex(/^[a-z0-9_]+$/),
  nombre: z.string().min(1),
  valor: z.number(),
  /** "dia": día del mes que fija la norma; el mes va en la clave y en el nombre. */
  unidad: z.enum(["COP", "porcentaje", "dia"]),
  fuente: z.string().min(1),
  url: z.url(),
  vigenteDesde: z.iso.date(),
  /** null cuando la norma no trae fecha de fin. */
  vigenteHasta: z.iso.date().nullable(),
  verificadoPor: z.string().min(1),
  verificadoEl: z.iso.date(),
  nota: z.string().optional(),
});
export type Norma = z.infer<typeof Norma>;

export const NORMAS: Norma[] = z.array(Norma).parse([
  {
    clave: "smmlv",
    nombre: "Salario mínimo mensual legal vigente",
    valor: 1_750_905,
    unidad: "COP",
    fuente: "Decreto 1469 de 2025; mismo valor en el Decreto 0159 de 2026 (Diario Oficial 53.403)",
    url: "https://normativa.colpensiones.gov.co/colpens/compilacion/docs/decreto_0159_2026.htm",
    vigenteDesde: "2026-01-01",
    vigenteHasta: "2026-12-31",
    verificadoPor: "Claude, contra la compilación normativa de Colpensiones",
    verificadoEl: "2026-11-14",
    nota: "El Consejo de Estado suspendió el Decreto 1469 y el Gobierno expidió el 0159 con el mismo valor. El estado jurídico final de ambos decretos no se revisó; la cifra no cambió.",
  },
  {
    clave: "aporte_salud_empleado",
    nombre: "Aporte a salud a cargo del empleado",
    valor: 4,
    unidad: "porcentaje",
    fuente: "Ley 1122 de 2007, art. 10 (modifica el art. 204 de la Ley 100 de 1993): 12,5 % en total, 4 % a cargo del empleado",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/ley_1122_2007.html",
    vigenteDesde: "2007-01-01",
    vigenteHasta: null,
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
  },
  {
    clave: "aporte_pension_empleado",
    nombre: "Aporte a pensión a cargo del empleado",
    valor: 4,
    unidad: "porcentaje",
    fuente: "Decreto 4982 de 2007, art. 1 (cotización del 16 % desde 2008) y Ley 797 de 2003, art. 7 (el trabajador paga el 25 % de la cotización): 16 % × 25 % = 4 %",
    url: "https://normativa.colpensiones.gov.co/colpens/compilacion/docs/decreto_4982_2007.htm",
    vigenteDesde: "2008-01-01",
    vigenteHasta: null,
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
    nota: "El 75/25 se leyó en http://www.secretariasenado.gov.co/senado/basedoc/ley_0797_2003.html. La Ley 2381 de 2024 (art. 20) mantiene 16 % y 25 % para el trabajador; según la nota del Senado, sus artículos exequibles rigen desde el 1 de abril de 2027 (Sentencia C-264-26).",
  },
  {
    clave: "fondo_solidaridad_pensional",
    nombre: "Aporte adicional al Fondo de Solidaridad Pensional desde 4 salarios mínimos",
    valor: 1,
    unidad: "porcentaje",
    fuente: "Ley 797 de 2003, art. 8 (modifica el art. 27 de la Ley 100 de 1993): 1 % adicional para bases iguales o superiores a 4 SMMLV",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/ley_0797_2003.html",
    vigenteDesde: "2003-01-29",
    // La Ley 2381 de 2024 cambia la escala (1,5 % desde 4 SMMLV) a partir del 1 de abril de 2027; esa escala no se cargó.
    vigenteHasta: "2027-03-31",
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
    nota: "Desde 16 SMMLV hay un aporte adicional escalonado (0,2 % a 1 %) que no está cargado: las cuentas de core no calculan el neto por encima de 16 SMMLV.",
  },
  {
    clave: "prima_pago_junio",
    nombre: "Último día para pagar la prima del primer semestre (junio)",
    valor: 30,
    unidad: "dia",
    fuente: "Código Sustantivo del Trabajo, art. 306 (modificado por la Ley 1788 de 2016): 30 días de salario por año, la mitad máximo el 30 de junio",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/codigo_sustantivo_trabajo_pr010.html",
    vigenteDesde: "2016-07-07",
    vigenteHasta: null,
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
  },
  {
    clave: "prima_pago_diciembre",
    nombre: "Último día para pagar la prima del segundo semestre (diciembre)",
    valor: 20,
    unidad: "dia",
    fuente: "Código Sustantivo del Trabajo, art. 306 (modificado por la Ley 1788 de 2016): la otra mitad a más tardar los primeros veinte días de diciembre",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/codigo_sustantivo_trabajo_pr010.html",
    vigenteDesde: "2016-07-07",
    vigenteHasta: null,
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
  },
  {
    clave: "cesantias_consignacion_febrero",
    nombre: "Último día para consignar las cesantías del año anterior en el fondo (febrero)",
    valor: 14,
    unidad: "dia",
    fuente: "Ley 50 de 1990, art. 99, numeral 3: se consignan antes del 15 de febrero del año siguiente. Cesantía de un mes de salario por año: Código Sustantivo del Trabajo, art. 249",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=281",
    vigenteDesde: "1991-01-01",
    vigenteHasta: null,
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
    nota: "La norma dice antes del 15 de febrero, por eso el último día es el 14. El art. 249 se leyó en http://www.secretariasenado.gov.co/senado/basedoc/codigo_sustantivo_trabajo_pr008.html",
  },
  {
    clave: "intereses_cesantias_tasa",
    nombre: "Intereses sobre las cesantías, por año",
    valor: 12,
    unidad: "porcentaje",
    fuente: "Ley 50 de 1990, art. 99, numeral 2: intereses legales del 12 % anual o proporcionales por fracción",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=281",
    vigenteDesde: "1991-01-01",
    vigenteHasta: null,
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
  },
  {
    clave: "intereses_cesantias_pago_enero",
    nombre: "Último día para pagar los intereses de cesantías del año anterior (enero)",
    valor: 31,
    unidad: "dia",
    fuente: "Decreto 116 de 1976, art. 1 (compilado en el art. 2.2.1.3.4 del Decreto 1072 de 2015): se pagan en el mes de enero del año siguiente",
    url: "https://alphasig.metropol.gov.co/normograma/compilacion/docs/decreto_0116_1976.htm",
    vigenteDesde: "1976-02-16",
    vigenteHasta: null,
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
    nota: "Se leyó en el normograma del Área Metropolitana del Valle de Aburrá porque el Gestor Normativo de Función Pública no cargó. Conviene confirmarlo en Función Pública o en el Diario Oficial.",
  },
  {
    clave: "tasa_usura_consumo",
    nombre: "Tasa de usura para crédito de consumo y ordinario (efectiva anual)",
    valor: 28.34,
    unidad: "porcentaje",
    fuente: "Superintendencia Financiera, Resolución 1707 de 2026: interés bancario corriente de 18,89 % E.A.; la usura es 1,5 veces ese valor",
    url: "https://www.superfinanciera.gov.co/publicaciones/10116308/superfinanciera-certifica-el-interes-bancario-corriente/",
    vigenteDesde: "2026-11-01",
    vigenteHasta: "2026-11-30",
    verificadoPor: "Falta verificación de una persona. Leída por Claude en la fuente citada",
    verificadoEl: "2026-11-15",
    nota: "Cambia cada mes: el 1 de diciembre de 2026 esta prueba se pone en rojo hasta cargar la de diciembre.",
  },
]);

/** Fecha de hoy en Colombia, AAAA-MM-DD. */
export function hoyEnColombia(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

/** La norma vigente en una fecha, o undefined si no hay una cargada para esa fecha. */
export function consultarNorma(clave: string, fecha: string = hoyEnColombia()): Norma | undefined {
  return NORMAS.find(
    (n) => n.clave === clave && n.vigenteDesde <= fecha && (n.vigenteHasta === null || fecha <= n.vigenteHasta),
  );
}
