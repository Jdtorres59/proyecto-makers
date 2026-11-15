import { expect, test } from "vitest";
import { aplicarPorcentaje, formatearCOP, pesos } from "./dinero";

test("formatea como un banco colombiano", () => {
  expect(formatearCOP(3_600_000)).toBe("$3.600.000");
  expect(formatearCOP(900)).toBe("$900");
  expect(formatearCOP(-1_750_905)).toBe("-$1.750.905");
});

test("porcentaje redondea al peso", () => {
  expect(aplicarPorcentaje(3_600_000, 4)).toBe(144_000);
  expect(aplicarPorcentaje(1_750_905, 4)).toBe(70_036);
});

test("rechaza montos que no son pesos enteros", () => {
  expect(() => pesos(10.5)).toThrow(RangeError);
  expect(() => formatearCOP(Number.NaN)).toThrow(RangeError);
  expect(() => aplicarPorcentaje(100, Number.POSITIVE_INFINITY)).toThrow(RangeError);
});
