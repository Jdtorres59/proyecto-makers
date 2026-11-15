import { AnthropicBedrockMantle } from "@anthropic-ai/bedrock-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { proveedorSimulado } from "./simulado";

/** Quién responde las llamadas al modelo. El resto del código no sabe cuál es. */
export type Proveedor = {
  nombre: "anthropic" | "bedrock" | "mock";
  /** Traduce un ID de modelos.ts al que espera la plataforma. */
  idModelo(id: string): string;
  /** Un turno del modelo: avisa cada fragmento de texto y devuelve el mensaje completo. */
  turno(params: Anthropic.MessageStreamParams, alTexto: (delta: string) => void): Promise<Anthropic.Message>;
};

const real = (
  nombre: Proveedor["nombre"],
  cliente: Pick<Anthropic, "messages">,
  idModelo: Proveedor["idModelo"],
): Proveedor => ({
  nombre,
  idModelo,
  turno: (params, alTexto) => cliente.messages.stream(params).on("text", alTexto).finalMessage(),
});

/**
 * AI_PROVIDER = mock (por defecto) | anthropic | bedrock.
 * Las credenciales las resuelve cada SDK desde el entorno (ANTHROPIC_API_KEY, o las de AWS).
 * Solo se usan funciones que existen en las dos plataformas: mensajes, streaming y herramientas.
 */
export function crearProveedor(env: Record<string, string | undefined> = process.env): Proveedor {
  const nombre = env.AI_PROVIDER ?? "mock";
  if (nombre === "mock") return proveedorSimulado();
  if (nombre === "anthropic") return real("anthropic", new Anthropic(), (id) => id);
  if (nombre === "bedrock") {
    if (!env.AWS_REGION) throw new Error("AI_PROVIDER=bedrock necesita AWS_REGION");
    // Sin probar contra una cuenta real de Bedrock: verificar el primer día que haya credenciales.
    return real("bedrock", new AnthropicBedrockMantle({ awsRegion: env.AWS_REGION }), (id) => `anthropic.${id}`);
  }
  throw new Error(`AI_PROVIDER desconocido: ${nombre}`);
}
