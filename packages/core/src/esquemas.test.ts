import { expect, test } from "vitest";
import { Modulo, PerfilFinanciero } from "./esquemas";

test("un perfil vacío es válido: Luca empieza sin saber nada", () => {
  const vacio = { nombre: null, empresa: null, cargo: null, salario: null, diaDePago: null, fechaIngreso: null, deudas: [], meta: null, vivienda: null };
  expect(PerfilFinanciero.parse(vacio)).toEqual(vacio);
  expect(() => PerfilFinanciero.parse({ ...vacio, salario: 3_600_000.5 })).toThrow();
  expect(() => PerfilFinanciero.parse({ ...vacio, fechaIngreso: "01/10/2026" })).toThrow();
});

test("un módulo rechaza un tipo de paso que la app no sabe pintar", () => {
  const modulo = (pasos: unknown[]) => ({
    id: "prima", orden: 2, capacidad: "E", titulo: "Prima y cesantías", promesa: "Saber cuánto te llega y cuándo",
    portada: "portada-prima", medalla: "medalla-prima", publicado: false,
    lecciones: [{ id: "prima-1", titulo: "Tu primera prima", minutos: 3, pasos }],
  });
  const estimar = { tipo: "estimar", pregunta: "¿Cuánto crees que te llega?", min: 0, max: 1_800_000, paso: 50_000, respuesta: 900_000, cuenta: "3.600.000 × 90 ÷ 360" };
  expect(Modulo.parse(modulo([estimar, { tipo: "regla", texto: "La prima es medio sueldo por semestre trabajado." }])).lecciones[0]!.pasos).toHaveLength(2);
  expect(() => Modulo.parse(modulo([{ tipo: "video", url: "x" }]))).toThrow();
});
