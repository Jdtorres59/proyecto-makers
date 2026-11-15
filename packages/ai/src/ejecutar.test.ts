import type Anthropic from "@anthropic-ai/sdk";
import { expect, test } from "vitest";
import { AGENTES } from "./agentes";
import { ejecutarAgente, type RegistroIA } from "./ejecutar";
import type { Proveedor } from "./proveedor";
import { proveedorSimulado } from "./simulado";

const agente = AGENTES.base!;

function correr(mensaje: string, proveedor: Proveedor = proveedorSimulado()) {
  const guardados: RegistroIA[] = [];
  const registrar = async (r: RegistroIA) => `run_${guardados.push(r)}`;
  return ejecutarAgente({ agente, mensaje, usuarioId: "u1", proveedor, registrar }).then((r) => ({ ...r, guardados }));
}

test("el ciclo usa la herramienta de cálculo y deja un registro", async () => {
  const { runId, registro, guardados } = await correr("¿Cuánto es el 4% de $3.600.000?");
  expect(runId).toBe("run_1");
  expect(guardados).toEqual([registro]);
  expect(registro).toMatchObject({ status: "ok", user_id: "u1", agent: "base", provider: "mock", tools: ["calcular_porcentaje"], iterations: 2 });
  expect(registro.output).toContain("$144.000");
  expect(registro.input_tokens).toBe(200);
  expect(registro.cost_usd).toBeCloseTo((200 * 4 + 40 * 20) / 1_000_000);
});

test("las cifras legales salen de la base de normas", async () => {
  const { registro } = await correr("¿Cuánto es el salario mínimo?");
  expect(registro.tools).toEqual(["consultar_norma"]);
  expect(registro.output).toContain("1750905");
});

test("una entrada inválida vuelve al modelo como error y no ejecuta la herramienta", async () => {
  const enviados: Anthropic.MessageParam[][] = [];
  const base = proveedorSimulado();
  const proveedor: Proveedor = {
    ...base,
    async turno(params, alTexto) {
      enviados.push([...params.messages]);
      if (enviados.length > 1) return base.turno(params, alTexto);
      const pedido = await base.turno({ ...params, messages: [{ role: "user", content: "4% de $100" }] }, alTexto);
      (pedido.content[0] as Anthropic.ToolUseBlock).input = { monto: "cien" };
      return pedido;
    },
  };
  const { registro } = await correr("hola", proveedor);
  expect(registro.status).toBe("ok");
  expect(enviados[1]!.at(-1)!.content).toMatchObject([{ type: "tool_result", is_error: true }]);
});

test("si el proveedor falla, queda registrado como error y no lanza", async () => {
  const proveedor: Proveedor = { ...proveedorSimulado(), turno: () => Promise.reject(new Error("sin red")) };
  const { registro, guardados } = await correr("hola", proveedor);
  expect(registro).toMatchObject({ status: "error", error: "Error: sin red" });
  expect(guardados).toHaveLength(1);
});
