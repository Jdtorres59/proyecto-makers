import { readFileSync } from "node:fs";
import { consultarNorma } from "@makers/conocimiento";
import { cesantias, eventosDePlata, Modulo, type PerfilFinanciero, prima, tieneAuxilioDeTransporte } from "@makers/core";
import { describe, expect, test } from "vitest";
import { MODULOS, modulosPara, SALARIO_EJEMPLO } from "./index";

const HOY = "2026-11-15";

// Persona ficticia por encima del tope del auxilio, para que core calcule montos.
const perfil: PerfilFinanciero = {
  nombre: "Camila",
  empresa: null,
  cargo: null,
  salario: 4_000_000,
  diaDePago: 30,
  fechaIngreso: "2026-03-01",
  deudas: [],
  meta: null,
  vivienda: "familia",
};

describe("núcleo", () => {
  const modulos = modulosPara(null, HOY);

  test("doce módulos válidos, en orden y con ids únicos", () => {
    for (const m of modulos) Modulo.parse(m);
    expect(modulos.map((m) => m.orden)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(new Set(modulos.map((m) => m.id)).size).toBe(12);
    expect(new Set(modulos.flatMap((m) => m.lecciones.map((l) => l.id))).size).toBe(modulos.flatMap((m) => m.lecciones).length);
  });

  test("portada y medalla con el nombre de DESIGN.md (orden con dos dígitos)", () => {
    for (const m of modulos) {
      expect(m.portada).toBe(`${String(m.orden).padStart(2, "0")}-${m.id}`);
      expect(m.medalla).toBe(m.portada);
    }
  });

  test("nada publicado hasta que una persona verifique", () => {
    expect(modulos.every((m) => !m.publicado)).toBe(true);
  });

  test("MODULOS se arma con la fecha de hoy", () => {
    expect(MODULOS).toHaveLength(12);
  });
});

describe("módulo 2: prima y cesantías", () => {
  const m = modulosPara(null, HOY)[1]!;
  const pasos = m.lecciones.flatMap((l) => l.pasos);

  test("de 3 a 5 lecciones, cada una con idea, ejercicio y regla; una acción al final", () => {
    expect(m.lecciones.length).toBeGreaterThanOrEqual(3);
    expect(m.lecciones.length).toBeLessThanOrEqual(5);
    for (const l of m.lecciones) {
      const tipos = l.pasos.map((p) => p.tipo);
      expect(tipos).toContain("idea");
      expect(tipos).toContain("regla");
      expect(tipos.some((t) => ["opcion_multiple", "estimar", "ordenar", "repartir", "comparar"].includes(t))).toBe(true);
    }
    expect(pasos.filter((p) => p.tipo === "accion")).toHaveLength(1);
    expect(m.lecciones.at(-1)!.pasos.at(-1)!.tipo).toBe("accion");
  });

  test("sin cifras escritas a mano: ningún texto del archivo lleva dígitos fuera de ${}", () => {
    const fuente = readFileSync(new URL("./modulos/02-prima-cesantias.ts", import.meta.url), "utf8");
    // Literales con texto (llevan un espacio): comillas dobles y plantillas, sin lo interpolado.
    const literales = [...fuente.matchAll(/"([^"\n]*)"|`([^`]*)`/g)].map((x) => (x[1] ?? x[2]!).replace(/\$\{[^}]*\}/g, ""));
    const conDigitos = literales.filter((t) => t.includes(" ") && /\d/.test(t));
    expect(conDigitos).toEqual([]);
  });

  test("las fechas y la tasa del texto salen de conocimiento", () => {
    const texto = JSON.stringify(m);
    for (const clave of ["prima_pago_junio", "prima_pago_diciembre", "intereses_cesantias_pago_enero", "cesantias_consignacion_febrero"]) {
      expect(texto).toContain(`el ${consultarNorma(clave, HOY)!.valor} de`);
    }
    expect(texto).toContain(`${consultarNorma("intereses_cesantias_tasa", HOY)!.valor} %`);
  });

  test("lo que el texto dice en palabras coincide con las cuentas de core", () => {
    // "Medio sueldo por semestre" y "un sueldo por año".
    expect(prima(SALARIO_EJEMPLO, 180)).toBe(SALARIO_EJEMPLO / 2);
    expect(cesantias(SALARIO_EJEMPLO, 360)).toBe(SALARIO_EJEMPLO);
    // El ejemplo no puede tener auxilio de transporte, que core no calcula.
    expect(tieneAuxilioDeTransporte(SALARIO_EJEMPLO, HOY)).toBe(false);
    const estimar = pasos.filter((p) => p.tipo === "estimar");
    expect(estimar.map((p) => p.respuesta)).toEqual([1_050_000, 2_800_000, 224_000]);
    for (const p of estimar) {
      expect(p.respuesta).toBeGreaterThanOrEqual(p.min);
      expect(p.respuesta).toBeLessThanOrEqual(p.max);
      expect(p.respuesta % p.paso).toBe(0);
    }
  });

  test("sin perfil, ningún paso trae montos de la persona", () => {
    expect(pasos.filter((p) => p.tipo === "idea").every((p) => p.tuyo === null)).toBe(true);
  });

  test("con perfil, la idea y el reparto usan los montos de la persona", () => {
    const suyo = modulosPara(perfil, HOY)[1]!;
    const eventos = eventosDePlata(perfil, HOY);
    const primaSuya = eventos.find((e) => e.tipo === "prima")!.monto!;
    const ideas = suyo.lecciones.flatMap((l) => l.pasos).filter((p) => p.tipo === "idea");
    expect(ideas[0]!.tuyo).toContain("$2.000.000");
    expect(primaSuya).toBe(2_000_000);
    const reparto = suyo.lecciones.flatMap((l) => l.pasos).find((p) => p.tipo === "repartir")!;
    expect(reparto.total).toBe(primaSuya);
  });

  test("con auxilio de transporte, avisa en vez de dar un monto equivocado", () => {
    const conAuxilio = modulosPara({ ...perfil, salario: 2_500_000 }, HOY)[1]!;
    const idea = conAuxilio.lecciones[0]!.pasos[0]!;
    expect(idea.tipo === "idea" && idea.tuyo).toContain("auxilio de transporte");
  });
});
