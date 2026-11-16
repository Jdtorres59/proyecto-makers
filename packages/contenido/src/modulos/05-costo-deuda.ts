import type { Modulo } from "@makers/core";

/** Solo ficha: las lecciones se escriben cuando el diseño de la app esté aprobado. */
export const costoDeuda: Modulo = {
  id: "costo-deuda",
  orden: 5,
  capacidad: "D",
  titulo: "Lo que cuesta una deuda",
  promesa: "Al terminar calculas el costo total de cualquier crédito y lo comparas con la tasa de usura vigente.",
  portada: "05-costo-deuda",
  medalla: "05-costo-deuda",
  publicado: false,
  lecciones: [],
};
