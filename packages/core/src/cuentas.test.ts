import { describe, expect, test } from "vitest";
import {
  aportesDelEmpleado,
  cesantias,
  costoPagoMinimo,
  costoPrestamo,
  costoTarjeta,
  dias360,
  diasTrabajados,
  eventosDePlata,
  interesesDeCesantias,
  netoDelMes,
  porcentajeDelSueldo,
  prima,
} from "./cuentas";
import type { PerfilFinanciero } from "./esquemas";

// Valentina, la persona del prototipo (datos ficticios).
const valentina: PerfilFinanciero = {
  nombre: "Valentina",
  empresa: "Logística Andina S.A.S.",
  cargo: "Analista de compras",
  salario: 3_600_000,
  diaDePago: 30,
  fechaIngreso: "2026-10-01",
  deudas: [
    { id: "d1", tipo: "celular", nombre: "Celular", cuotaMensual: 186_000, cuotasRestantes: 3, saldo: null, tasaEA: null, diaDePago: 5 },
  ],
  meta: "Irme a vivir sola",
  vivienda: "familia",
};

describe("sueldo", () => {
  test("neto del prototipo: 3.600.000 menos 4 % de salud y 4 % de pensión", () => {
    expect(aportesDelEmpleado(3_600_000, "2026-11-30")).toEqual({ salud: 144_000, pension: 144_000, solidaridad: 0 });
    expect(netoDelMes(3_600_000, "2026-11-30")).toBe(3_312_000);
  });

  test("desde 4 salarios mínimos se suma el 1 % al Fondo de Solidaridad Pensional", () => {
    const cuatro = 4 * 1_750_905;
    expect(aportesDelEmpleado(cuatro, "2026-11-30").solidaridad).toBe(70_036);
    expect(aportesDelEmpleado(cuatro - 1, "2026-11-30").solidaridad).toBe(0);
  });

  test("por encima de 16 salarios mínimos no inventa un neto", () => {
    expect(() => netoDelMes(16 * 1_750_905, "2026-11-30")).toThrow(RangeError);
  });

  test("sin norma vigente en la fecha, lanza en vez de usar una cifra vieja", () => {
    expect(() => netoDelMes(3_600_000, "2020-01-01")).toThrow(/smmlv/);
  });
});

describe("días en año de 360", () => {
  test("cuenta meses de 30 días, con ambos extremos incluidos", () => {
    expect(dias360("2026-10-01", "2026-12-31")).toBe(90);
    expect(dias360("2026-07-01", "2026-12-31")).toBe(180);
    expect(dias360("2026-01-01", "2026-12-31")).toBe(360);
    expect(dias360("2026-02-01", "2026-02-28")).toBe(30);
    expect(dias360("2026-10-15", "2026-10-15")).toBe(1);
  });

  test("solo cuenta desde la fecha de ingreso", () => {
    expect(diasTrabajados("2026-10-01", "2026-07-01", "2026-12-31")).toBe(90);
    expect(diasTrabajados("2025-03-01", "2026-07-01", "2026-12-31")).toBe(180);
    expect(diasTrabajados("2027-01-10", "2026-07-01", "2026-12-31")).toBe(0);
  });
});

describe("prestaciones", () => {
  test("prima, cesantías e intereses del prototipo con 90 días", () => {
    expect(prima(3_600_000, 90)).toBe(900_000);
    expect(cesantias(3_600_000, 90)).toBe(900_000);
    expect(interesesDeCesantias(900_000, 90, "2027-01-31")).toBe(27_000);
  });

  test("un año completo: un salario de cesantías y 12 % de intereses", () => {
    expect(cesantias(3_600_000, 360)).toBe(3_600_000);
    expect(interesesDeCesantias(3_600_000, 360, "2027-01-31")).toBe(432_000);
  });
});

describe("deudas", () => {
  test("tarjeta diferida a 12 cuotas: 2.400.000 al 26,5 % E.A.", () => {
    expect(costoTarjeta(2_400_000, 26.5, 12)).toEqual({ cuotas: 12, primeraCuota: 247_478, intereses: 308_607, seguro: 0, total: 2_708_607 });
  });

  test("a una cuota la tarjeta no cobra intereses", () => {
    expect(costoTarjeta(2_400_000, 26.5, 1)).toMatchObject({ primeraCuota: 2_400_000, intereses: 0, total: 2_400_000 });
  });

  test("pagar el mínimo cuesta más en total aunque la cuota sea menor", () => {
    const minimo = costoPagoMinimo(2_400_000, 26.5);
    expect(minimo).toMatchObject({ cuotas: 36, primeraCuota: 114_145, intereses: 878_342, total: 3_278_342 });
    expect(minimo.total).toBeGreaterThan(costoTarjeta(2_400_000, 26.5, 12).total);
  });

  test("préstamo de cuota fija al 18,9 % E.A. con seguro de 4.800", () => {
    expect(costoPrestamo(2_400_000, 18.9, 12, 4_800)).toEqual({ cuotas: 12, primeraCuota: 224_189, intereses: 232_668, seguro: 57_600, total: 2_690_268 });
    expect(costoPrestamo(1_200_000, 0, 12)).toMatchObject({ primeraCuota: 100_000, intereses: 0, total: 1_200_000 });
  });

  test("porcentaje del sueldo que se va en cuotas", () => {
    expect(porcentajeDelSueldo(247_478 + 186_000, 3_312_000)).toBe(13);
    expect(() => porcentajeDelSueldo(100, 0)).toThrow();
  });

  test("rechaza plazos y montos inválidos", () => {
    expect(() => costoTarjeta(2_400_000, 26.5, 0)).toThrow();
    expect(() => costoPrestamo(2_400_000.5, 18.9, 12)).toThrow();
  });
});

describe("lo que viene", () => {
  test("Valentina el 15 de noviembre de 2026", () => {
    expect(eventosDePlata(valentina, "2026-11-15")).toEqual([
      { fecha: "2026-11-30", tipo: "sueldo", titulo: "Tu sueldo", monto: 3_312_000, sentido: "entra" },
      { fecha: "2026-12-05", tipo: "cuota", titulo: "Cuota: Celular", monto: 186_000, sentido: "sale" },
      { fecha: "2026-12-20", tipo: "prima", titulo: "Tu prima", monto: 900_000, sentido: "entra" },
      { fecha: "2027-01-31", tipo: "intereses_cesantias", titulo: "Intereses de tus cesantías", monto: 27_000, sentido: "entra" },
      { fecha: "2027-02-14", tipo: "cesantias", titulo: "Tus cesantías llegan a tu fondo", monto: 900_000, sentido: "entra" },
    ]);
  });

  test("después del 20 de diciembre la próxima prima es la de junio, con el semestre completo", () => {
    const eventos = eventosDePlata({ ...valentina, deudas: [] }, "2026-12-21");
    expect(eventos.find((e) => e.tipo === "prima")).toMatchObject({ fecha: "2027-06-30", monto: 1_800_000 });
    expect(eventos.find((e) => e.tipo === "sueldo")).toMatchObject({ fecha: "2026-12-30" });
  });

  test("un día de pago 31 cae el último día de los meses cortos", () => {
    expect(eventosDePlata({ ...valentina, diaDePago: 31 }, "2026-11-15")[0]).toMatchObject({ fecha: "2026-11-30", tipo: "sueldo" });
  });

  test("con salario de hasta 2 mínimos no da montos que dependen del auxilio de transporte", () => {
    const eventos = eventosDePlata({ ...valentina, salario: 1_750_905 }, "2026-11-15");
    expect(eventos.filter((e) => e.tipo !== "cuota").every((e) => e.monto === null)).toBe(true);
  });

  test("un perfil vacío no tiene eventos", () => {
    const vacio = { nombre: null, empresa: null, cargo: null, salario: null, diaDePago: null, fechaIngreso: null, deudas: [], meta: null, vivienda: null };
    expect(eventosDePlata(vacio, "2026-11-15")).toEqual([]);
  });
});
