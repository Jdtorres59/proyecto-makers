import type Anthropic from "@anthropic-ai/sdk";
import type { Proveedor } from "./proveedor";

/**
 * Proveedor de mentira para pruebas, CI y para trabajar sin llave. No cuesta plata.
 * Sigue un guion fijo por agente (lo reconoce por sus herramientas o por el esquema de salida):
 * pide la herramienta que el mensaje amerita y después responde con lo que la herramienta dijo.
 * Las respuestas de texto empiezan con "(simulado)". No dice nada sobre la calidad del modelo real.
 */
export function proveedorSimulado(): Proveedor {
  return {
    nombre: "mock",
    idModelo: (id) => id,
    async turno(params, alTexto) {
      const tiene = (nombre: string) => params.tools?.some((t) => "name" in t && t.name === nombre);
      const ultimo = params.messages.at(-1)?.content;
      const resultados = Array.isArray(ultimo) ? ultimo.flatMap((b) => (b.type === "tool_result" ? [b] : [])) : [];
      const esquema = (params.output_config?.format?.schema as { properties?: Record<string, unknown> } | undefined)?.properties;

      if (esquema?.renglones) return responder(params.model, alTexto, JSON.stringify(lectura(ultimo)));

      if (esquema?.explicaciones) {
        const entrada = leerJSON(params.messages[0]?.content) as { documento?: { renglones?: { clave: string; monto: number | null }[] } } | null;
        const renglones = entrada?.documento?.renglones ?? [];
        const salario = renglones.find((r) => r.clave === "salario_basico")?.monto;
        if (!resultados.length && salario && tiene("calcular_neto")) {
          return mensaje(params.model, "tool_use", [usoDeHerramienta("calcular_neto", { salario })]);
        }
        const cuenta = resultados.map((r) => contenido(r)).join(" ");
        const explicaciones = renglones.map((r) => ({ clave: r.clave, explicacion: `(simulado) Explicación de ${r.clave}. ${cuenta}`.trim() }));
        return responder(params.model, alTexto, JSON.stringify({ explicaciones }));
      }

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
        if (tiene("costo_tarjeta")) {
          // Guion de acompanar_decision: con saldo y tasa compara caminos; sin ellos, pide el papel.
          const saldo = ultimo.match(/\$\s?(\d[\d.]*)/)?.[1];
          const tasas = [...ultimo.matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)].map((m) => Number(m[1]!.replace(",", ".")));
          if (!saldo || !tasas.length) {
            return responder(params.model, alTexto, "(simulado) Para mostrarte tus caminos necesito el saldo y la tasa. ¿Puedes subir el extracto?");
          }
          const monto = Number(saldo.replaceAll(".", ""));
          return mensaje(params.model, "tool_use", [
            usoDeHerramienta("costo_tarjeta", { saldo: monto, tasaEA: tasas[0], cuotas: 12 }),
            usoDeHerramienta("costo_pago_minimo", { saldo: monto, tasaEA: tasas[0] }),
            ...(tasas[1] !== undefined ? [usoDeHerramienta("costo_prestamo", { monto, tasaEA: tasas[1], meses: 12, seguroMensual: 0 })] : []),
          ]);
        }
      }

      if (resultados.length && tiene("costo_tarjeta")) {
        const caminos = resultados.map((r) => `total ${(leerJSON(contenido(r)) as { formato?: { total?: string } } | null)?.formato?.total}`);
        return responder(
          params.model,
          alTexto,
          `(simulado) Con tus números: ${caminos.join("; ")}. La decisión es tuya: ¿qué te pesa más, la cuota de cada mes o el total?`,
        );
      }

      const texto = resultados.length
        ? `(simulado) La herramienta respondió: ${resultados.map((r) => JSON.stringify(r.content)).join(" ")}`
        : `(simulado) Recibí: ${typeof ultimo === "string" ? ultimo : "un mensaje"}`;
      return responder(params.model, alTexto, texto);
    },
  };
}

/** Lectura fija de un desprendible ficticio cuando llega un adjunto; vacía si no llegó ninguno. */
function lectura(ultimo: Anthropic.MessageParam["content"] | undefined) {
  const conAdjunto = Array.isArray(ultimo) && ultimo.some((b) => b.type === "document" || b.type === "image");
  if (!conAdjunto) return { tipo: "otro", titulo: "Sin documento", periodo: null, renglones: [] };
  const r = (clave: string, etiqueta: string, texto: string, monto: number | null, confianza = "alta") => ({ clave, etiqueta, texto, monto, confianza });
  return {
    tipo: "desprendible",
    titulo: "Desprendible de nómina (simulado)",
    periodo: "noviembre de 2026",
    renglones: [
      r("salario_basico", "Salario básico", "$3.600.000", 3_600_000),
      r("salud", "Salud 4 %", "-$144.000", 144_000),
      r("pension", "Pensión 4 %", "-$144.000", 144_000),
      r("neto", "Neto a pagar", "$3.312.000", 3_312_000, "media"),
    ],
  };
}

const contenido = (r: Anthropic.ToolResultBlockParam) => (typeof r.content === "string" ? r.content : JSON.stringify(r.content));

function leerJSON(valor: unknown): unknown {
  if (typeof valor !== "string") return null;
  try {
    return JSON.parse(valor);
  } catch {
    return null;
  }
}

function responder(model: string, alTexto: (delta: string) => void, texto: string) {
  for (const palabra of texto.split(/(?<= )/)) alTexto(palabra);
  return mensaje(model, "end_turn", [{ type: "text", text: texto, citations: null }]);
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
