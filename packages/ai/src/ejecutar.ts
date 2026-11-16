import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { EventoIA } from "@makers/core";
import { z } from "zod";
import type { Agente } from "./agentes";
import { costoUsd, MODELOS, modeloEfectivo } from "./modelos";
import { constitucion } from "./prompts/constitucion";
import type { Proveedor } from "./proveedor";

/** Una fila de la tabla ai_runs. Los nombres coinciden con las columnas. */
export type RegistroIA = {
  user_id: string;
  agent: string;
  prompt_version: string;
  model: string;
  provider: string;
  status: "ok" | "rechazo" | "truncado" | "error";
  input: string;
  output: string;
  tools: string[];
  iterations: number;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  cost_usd: number;
  latency_ms: number;
  error: string | null;
};

const MAX_ITERACIONES = 8;

/** Un PDF o una imagen en base64 que el modelo debe leer. */
export type Adjunto = { mediaType: "application/pdf" | "image/jpeg" | "image/png" | "image/webp"; datos: string };

/** Turnos anteriores de una conversación, en texto. */
export type Turno = { rol: "persona" | "luca"; texto: string };

/**
 * Punto único de entrada a la IA. Toda llamada al modelo pasa por aquí para que quede registrada.
 * Corre el ciclo modelo -> herramientas -> modelo hasta que el modelo termina, y nunca lanza:
 * si algo falla, el registro queda con status "error".
 */
export async function ejecutarAgente(o: {
  agente: Agente;
  mensaje: string;
  usuarioId: string;
  adjunto?: Adjunto;
  historial?: Turno[];
  /** Datos de la persona para este turno (perfil, documentos). Va al final del system para no romper la caché de lo fijo. */
  contexto?: string;
  proveedor: Proveedor;
  /** Guarda el registro y devuelve su id. */
  registrar: (registro: RegistroIA) => Promise<string | null>;
  alEvento?: (evento: EventoIA) => void;
}): Promise<{ runId: string | null; registro: RegistroIA; salida: unknown }> {
  const { agente, proveedor } = o;
  const nombreModelo = modeloEfectivo(agente.modelo);
  const modelo = MODELOS[nombreModelo];
  const inicio = Date.now();
  const registro: RegistroIA = {
    user_id: o.usuarioId,
    agent: agente.nombre,
    prompt_version: `${constitucion.version}+${agente.prompt.version}`,
    model: modelo.id,
    provider: proveedor.nombre,
    status: "ok",
    input: o.adjunto ? `[adjunto ${o.adjunto.mediaType}] ${o.mensaje}` : o.mensaje,
    output: "",
    tools: [],
    iterations: 0,
    input_tokens: 0,
    output_tokens: 0,
    cache_read_tokens: 0,
    cache_write_tokens: 0,
    cost_usd: 0,
    latency_ms: 0,
    error: null,
  };

  // Sin strict: no pude probar contra la API qué palabras de JSON Schema acepta el modo estricto.
  // A cambio, cada entrada se valida abajo con el esquema zod antes de ejecutar la herramienta.
  const tools: Anthropic.Tool[] = agente.herramientas.map((h) => {
    const { $schema, ...esquema } = z.toJSONSchema(h.entrada);
    return { name: h.nombre, description: h.descripcion, input_schema: esquema as Anthropic.Tool.InputSchema };
  });
  const adjunto: Anthropic.ContentBlockParam[] = !o.adjunto
    ? []
    : o.adjunto.mediaType === "application/pdf"
      ? [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: o.adjunto.datos } }]
      : [{ type: "image", source: { type: "base64", media_type: o.adjunto.mediaType, data: o.adjunto.datos } }];
  const mensajes: Anthropic.MessageParam[] = [
    ...(o.historial ?? []).map((t): Anthropic.MessageParam => ({ role: t.rol === "persona" ? "user" : "assistant", content: t.texto })),
    { role: "user", content: adjunto.length ? [...adjunto, { type: "text", text: o.mensaje }] : o.mensaje },
  ];
  const system = [constitucion.texto, agente.prompt.texto, o.contexto].filter(Boolean).join("\n\n");
  let final: Anthropic.Message | null = null;

  try {
    for (;;) {
      if (++registro.iterations > MAX_ITERACIONES) {
        registro.status = "truncado";
        break;
      }
      const respuesta = await proveedor.turno(
        {
          model: proveedor.idModelo(modelo.id),
          max_tokens: 64000,
          system,
          output_config: { effort: modelo.esfuerzo, ...(agente.salida && { format: zodOutputFormat(agente.salida) }) },
          ...(tools.length > 0 && { tools }),
          messages: mensajes,
        },
        (delta) => {
          registro.output += delta;
          o.alEvento?.({ tipo: "texto", delta });
        },
      );
      registro.input_tokens += respuesta.usage.input_tokens;
      registro.output_tokens += respuesta.usage.output_tokens;
      registro.cache_read_tokens += respuesta.usage.cache_read_input_tokens ?? 0;
      registro.cache_write_tokens += respuesta.usage.cache_creation_input_tokens ?? 0;
      registro.cost_usd += costoUsd(nombreModelo, respuesta.usage);

      // Un rechazo o un corte por max_tokens pueden dejar una herramienta a medias: no se ejecuta.
      if (respuesta.stop_reason === "refusal") {
        registro.status = "rechazo";
        break;
      }
      if (respuesta.stop_reason === "max_tokens") {
        registro.status = "truncado";
        break;
      }
      const usos = respuesta.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      if (usos.length === 0) {
        final = respuesta;
        break;
      }

      // El contenido se devuelve completo y sin tocar: incluye los bloques de razonamiento.
      mensajes.push({ role: "assistant", content: respuesta.content });
      mensajes.push({ role: "user", content: await Promise.all(usos.map((uso) => usar(agente, uso, registro, o.alEvento))) });
    }
  } catch (e) {
    registro.status = "error";
    registro.error = e instanceof Anthropic.APIError ? `${e.status} ${e.name}: ${e.message}` : String(e);
  }

  // Salida estructurada: se valida con zod aunque el API la haya restringido. Si no cumple, es un error.
  let salida: unknown = null;
  if (agente.salida && registro.status === "ok") {
    const texto = final?.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("") ?? "";
    try {
      const resultado = agente.salida.safeParse(JSON.parse(texto));
      if (resultado.success) salida = resultado.data;
      else throw new Error(z.prettifyError(resultado.error));
    } catch (e) {
      registro.status = "error";
      registro.error = `Salida inválida: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  registro.latency_ms = Date.now() - inicio;
  const runId = await o.registrar(registro).catch((e) => {
    console.error("No se pudo guardar el registro de IA", e);
    return null;
  });
  return { runId, registro, salida };
}

async function usar(
  agente: Agente,
  uso: Anthropic.ToolUseBlock,
  registro: RegistroIA,
  alEvento?: (evento: EventoIA) => void,
): Promise<Anthropic.ToolResultBlockParam> {
  registro.tools.push(uso.name);
  alEvento?.({ tipo: "herramienta", nombre: uso.name });
  const fallo = (content: string) => ({ type: "tool_result" as const, tool_use_id: uso.id, is_error: true, content });

  const herramienta = agente.herramientas.find((h) => h.nombre === uso.name);
  if (!herramienta) return fallo(`La herramienta ${uso.name} no existe.`);
  const entrada = herramienta.entrada.safeParse(uso.input);
  if (!entrada.success) return fallo(`Entrada inválida: ${z.prettifyError(entrada.error)}`);
  try {
    return { type: "tool_result", tool_use_id: uso.id, content: await herramienta.ejecutar(entrada.data) };
  } catch (e) {
    return fallo(String(e));
  }
}
