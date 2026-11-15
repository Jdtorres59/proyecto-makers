import { z } from "zod";

/**
 * Una norma colombiana con cifra. Toda cifra legal que el producto muestre sale de aquí,
 * nunca de la memoria del modelo. Agregar o cambiar una entrada exige fuente y verificación humana.
 */
export const Norma = z.object({
  clave: z.string().regex(/^[a-z0-9_]+$/),
  nombre: z.string().min(1),
  valor: z.number(),
  unidad: z.enum(["COP", "porcentaje"]),
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
