/** Pesos colombianos como entero. Sin decimales, para no arrastrar errores de punto flotante en plata. */
export type Pesos = number;

export function pesos(valor: number): Pesos {
  if (!Number.isSafeInteger(valor)) throw new RangeError(`Monto inválido en pesos: ${valor}`);
  return valor;
}

/** "$3.600.000", como lo muestra un banco colombiano. */
export function formatearCOP(valor: Pesos): string {
  const miles = Math.abs(pesos(valor)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${valor < 0 ? "-" : ""}$${miles}`;
}

/** Porcentaje de un monto, redondeado al peso. aplicarPorcentaje(3_600_000, 4) === 144_000 */
export function aplicarPorcentaje(valor: Pesos, porcentaje: number): Pesos {
  if (!Number.isFinite(porcentaje)) throw new RangeError(`Porcentaje inválido: ${porcentaje}`);
  return Math.round((pesos(valor) * porcentaje) / 100);
}
