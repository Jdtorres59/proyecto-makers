import type Anthropic from "@anthropic-ai/sdk";
import { expect, test } from "vitest";
import { AGENTES } from "./agentes";
import { type Adjunto, ejecutarAgente } from "./ejecutar";
import { costoDePrestamo, porcentajeDelSueldoEnCuotas } from "./herramientas";
import type { Proveedor } from "./proveedor";
import { proveedorSimulado } from "./simulado";

const correr = (agente: string, mensaje: string, extra: { adjunto?: Adjunto; proveedor?: Proveedor } = {}) =>
  ejecutarAgente({ agente: AGENTES[agente]!, mensaje, usuarioId: "u1", proveedor: extra.proveedor ?? proveedorSimulado(), registrar: async () => "run", adjunto: extra.adjunto });

const pdf: Adjunto = { mediaType: "application/pdf", datos: Buffer.from("%PDF-1.4 ficticio").toString("base64") };

test("leer_documento devuelve una lectura validada con confianza por renglón", async () => {
  const { registro, salida } = await correr("leer_documento", "Lee este documento.", { adjunto: pdf });
  expect(registro).toMatchObject({ status: "ok", agent: "leer_documento", input: "[adjunto application/pdf] Lee este documento." });
  expect(salida).toMatchObject({ tipo: "desprendible", renglones: expect.arrayContaining([expect.objectContaining({ clave: "salud", monto: 144_000, confianza: "alta" })]) });
});

test("el adjunto llega al modelo como bloque de documento antes del texto", async () => {
  let enviado: Anthropic.MessageParam["content"] | undefined;
  const base = proveedorSimulado();
  const espia: Proveedor = { ...base, turno: (p, t) => ((enviado = p.messages.at(-1)?.content), base.turno(p, t)) };
  await correr("leer_documento", "Lee este documento.", { adjunto: pdf, proveedor: espia });
  expect(enviado).toMatchObject([{ type: "document", source: { type: "base64", media_type: "application/pdf" } }, { type: "text" }]);
});

test("una salida que no cumple el esquema queda como error", async () => {
  const roto: Proveedor = {
    ...proveedorSimulado(),
    turno: async (p) => ({ ...(await proveedorSimulado().turno(p, () => {})), content: [{ type: "text", text: '{"tipo":"desprendible"}', citations: null }] }),
  };
  const { registro, salida } = await correr("leer_documento", "Lee.", { adjunto: pdf, proveedor: roto });
  expect(registro.status).toBe("error");
  expect(registro.error).toMatch(/^Salida inválida/);
  expect(salida).toBeNull();
});

test("explicar_documento comprueba con la cuenta de core y explica cada renglón", async () => {
  const documento = { renglones: [{ clave: "salario_basico", monto: 3_600_000 }, { clave: "salud", monto: 144_000 }] };
  const { registro, salida } = await correr("explicar_documento", JSON.stringify({ documento, perfil: null }));
  expect(registro).toMatchObject({ status: "ok", tools: ["calcular_neto"] });
  const { explicaciones } = salida as { explicaciones: { clave: string; explicacion: string }[] };
  expect(explicaciones.map((e) => e.clave)).toEqual(["salario_basico", "salud"]);
  expect(explicaciones[1]!.explicacion).toContain("3312000");
});

test("acompanar_decision compara caminos con herramientas y deja la decisión a la persona", async () => {
  const { registro } = await correr("acompanar_decision", "Debo $2.400.000 en la tarjeta al 26,5% y me ofrecen un préstamo al 18,9%.");
  expect(registro.status).toBe("ok");
  expect(registro.tools).toEqual(["costo_tarjeta", "costo_pago_minimo", "costo_prestamo"]);
  expect(registro.output).toContain("$2.708.607");
  expect(registro.output).toContain("La decisión es tuya");
});

test("acompanar_decision pide el papel cuando faltan datos", async () => {
  const { registro } = await correr("acompanar_decision", "Tengo una deuda y no sé qué hacer.");
  expect(registro.tools).toEqual([]);
  expect(registro.output).toMatch(/extracto/);
});

test("las herramientas de deuda devuelven las cuentas de core", async () => {
  expect(JSON.parse(await costoDePrestamo.ejecutar({ monto: 2_400_000, tasaEA: 18.9, meses: 12, seguroMensual: 4_800 }))).toMatchObject({ total: 2_690_268 });
  expect(JSON.parse(await porcentajeDelSueldoEnCuotas.ejecutar({ cuotas: [247_478, 186_000], neto: 3_312_000 }))).toEqual({ total: 433_478, formato: "$433.478", porcentaje: 13 });
});
