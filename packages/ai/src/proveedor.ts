import { AnthropicBedrockMantle } from "@anthropic-ai/bedrock-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { MODELOS, modeloEfectivo, type NombreModelo } from "./modelos";
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
 * En Bedrock el ID lleva el prefijo "anthropic." (anthropic.claude-opus-5-5). Como depende de lo que la cuenta
 * tenga habilitado, BEDROCK_MODELO_PRINCIPAL o BEDROCK_MODELO_ECONOMICO lo reemplazan sin tocar modelos.ts.
 */
export const idBedrock =
  (env: Record<string, string | undefined>) =>
  (id: string): string => {
    const nombre = (Object.keys(MODELOS) as NombreModelo[]).find((n) => MODELOS[n].id === id);
    return (nombre && env[`BEDROCK_MODELO_${nombre.toUpperCase()}`]) || `anthropic.${id}`;
  };

/**
 * AI_PROVIDER = mock (por defecto) | anthropic | bedrock.
 * Solo se usan funciones que existen en las dos plataformas: mensajes, streaming, herramientas, PDF y salida estructurada.
 * Falla al arrancar si falta algo, para no descubrirlo en la primera llamada de una persona.
 */
export function crearProveedor(env: Record<string, string | undefined> = process.env): Proveedor {
  modeloEfectivo("principal", env); // valida AI_MODELO
  const nombre = env.AI_PROVIDER ?? "mock";
  if (nombre === "mock") return proveedorSimulado();
  if (nombre === "anthropic") return real("anthropic", new Anthropic(), (id) => id);
  if (nombre === "bedrock") return real("bedrock", clienteBedrock(env), idBedrock(env));
  throw new Error(`AI_PROVIDER desconocido: ${nombre}`);
}

/**
 * Nombres propios y no AWS_REGION ni AWS_ACCESS_KEY_ID: Vercel puede poner esas en la función con valores
 * que no sirven como credenciales, y el SDK las tomaría sin avisar.
 * Credenciales: llave de acceso de IAM (firma SigV4) o, si no hay, llave de API de Bedrock (AWS_BEARER_TOKEN_BEDROCK).
 */
function clienteBedrock(env: Record<string, string | undefined>) {
  const awsRegion = env.BEDROCK_REGION;
  if (!awsRegion) throw new Error("AI_PROVIDER=bedrock necesita BEDROCK_REGION (por ejemplo us-east-1)");
  const { BEDROCK_AWS_ACCESS_KEY_ID: awsAccessKey, BEDROCK_AWS_SECRET_ACCESS_KEY: awsSecretAccessKey, AWS_BEARER_TOKEN_BEDROCK: apiKey } = env;
  if (Boolean(awsAccessKey) !== Boolean(awsSecretAccessKey)) {
    throw new Error("BEDROCK_AWS_ACCESS_KEY_ID y BEDROCK_AWS_SECRET_ACCESS_KEY van juntas");
  }
  if (awsAccessKey && awsSecretAccessKey) {
    return new AnthropicBedrockMantle({ awsRegion, awsAccessKey, awsSecretAccessKey, awsSessionToken: env.BEDROCK_AWS_SESSION_TOKEN || null });
  }
  if (apiKey) return new AnthropicBedrockMantle({ awsRegion, apiKey });
  throw new Error("AI_PROVIDER=bedrock necesita BEDROCK_AWS_ACCESS_KEY_ID y BEDROCK_AWS_SECRET_ACCESS_KEY, o AWS_BEARER_TOKEN_BEDROCK");
}
