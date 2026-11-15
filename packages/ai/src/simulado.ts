import type Anthropic from "@anthropic-ai/sdk";
import type { Proveedor } from "./proveedor";

/**
 * Proveedor de mentira para pruebas, CI y para trabajar sin llave. No cuesta plata.
 * Sigue un guion fijo: pide la herramienta de porcentaje o la de normas si el mensaje lo amerita,
 * y después repite lo que la herramienta respondió. Toda respuesta empieza con "(simulado)".
 */
export function proveedorSimulado(): Proveedor {
  return {
    nombre: "mock",
    idModelo: (id) => id,
    async turno(params, alTexto) {
      const tiene = (nombre: string) => params.tools?.some((t) => "name" in t && t.name === nombre);
      const ultimo = params.messages.at(-1)?.content;

      if (typeof ultimo === "string") {
        const porcentaje = ultimo.match(/(\d+(?:[.,]\d+)?)\s*%\s*de\s*\$?\s*(\d[\d.]*)/i);
        if (porcentaje && tiene("calcular_porcentaje")) {
          return mensaje(params.model, "tool_use", [
            usoDeHerramienta("calcular_porcentaje", {
              monto: Number(porcentaje[2]!.replaceAll(".", "")),
              porcentaje: Number(porcentaje[1]!.replace(",", ".")),
            }),
          ]);
        }
        if (/salario m[ií]nimo/i.test(ultimo) && tiene("consultar_norma")) {
          return mensaje(params.model, "tool_use", [usoDeHerramienta("consultar_norma", { clave: "smmlv" })]);
        }
      }

      const resultados = Array.isArray(ultimo) ? ultimo.flatMap((b) => (b.type === "tool_result" ? [b.content] : [])) : [];
      const texto = resultados.length
        ? `(simulado) La herramienta respondió: ${resultados.map((r) => JSON.stringify(r)).join(" ")}`
        : `(simulado) Recibí: ${typeof ultimo === "string" ? ultimo : "un mensaje"}`;
      for (const palabra of texto.split(/(?<= )/)) alTexto(palabra);
      return mensaje(params.model, "end_turn", [{ type: "text", text: texto, citations: null }]);
    },
  };
}

let consecutivo = 0;

const usoDeHerramienta = (name: string, input: unknown) =>
  ({ type: "tool_use", id: `toolu_simulado_${++consecutivo}`, name, input }) as Anthropic.ToolUseBlock;

const mensaje = (model: string, stop_reason: Anthropic.StopReason, content: Anthropic.ContentBlock[]) =>
  ({
    id: `msg_simulado_${++consecutivo}`,
    type: "message",
    role: "assistant",
    model,
    content,
    stop_reason,
    stop_sequence: null,
    usage: { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
  }) as Anthropic.Message;
