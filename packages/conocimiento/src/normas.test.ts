import { expect, test } from "vitest";
import { consultarNorma, hoyEnColombia, NORMAS } from "./normas";

test("consulta por clave y fecha", () => {
  expect(consultarNorma("smmlv", "2026-06-15")?.valor).toBe(1_750_905);
  expect(consultarNorma("smmlv", "2025-06-15")).toBeUndefined();
  expect(consultarNorma("no_existe")).toBeUndefined();
});

// Esta prueba falla a propósito cuando una norma se vence (por ejemplo, cada 1 de enero con el
// salario mínimo). Mostrar una cifra legal vieja es peor que un CI en rojo: se arregla cargando
// la norma nueva en normas.ts, con fuente y verificación.
test("toda clave tiene una norma vigente hoy", () => {
  const hoy = hoyEnColombia();
  const vencidas = [...new Set(NORMAS.map((n) => n.clave))].filter((clave) => !consultarNorma(clave, hoy));
  expect(vencidas, `Normas sin valor vigente al ${hoy}`).toEqual([]);
});
