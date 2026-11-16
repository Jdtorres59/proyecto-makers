import type Anthropic from "@anthropic-ai/sdk";

/**
 * Único lugar donde viven los IDs de modelo, el nivel de esfuerzo y los precios.
 * Cambiar de modelo o de esfuerzo es una decisión que se toma con evals (pnpm eval), no a ojo.
 * Precios en USD por millón de tokens, tarifa directa de Anthropic al 2026-11-03; en Bedrock pueden variar.
 */
export const MODELOS = {
  principal: {
    id: "claude-opus-5-5",
    esfuerzo: "medium",
    usdPorMTok: { entrada: 4, salida: 20, cacheLectura: 0.2, cacheEscritura: 5 },
  },
  /** El que usan hoy todos los agentes (agentes.ts), por presupuesto. Subir a "principal" se decide con evals contra el modelo real. */
  economico: {
    id: "claude-haiku-5-5",
    esfuerzo: "medium",
    // shortcut: tarifa de prompts de hasta 100K tokens (sube 5x arriba de eso); caché a 0,1x y 1,25x de la entrada. Revisar si se usa con documentos largos.
    usdPorMTok: { entrada: 0.1, salida: 0.5, cacheLectura: 0.01, cacheEscritura: 0.125 },
  },
} as const;

export type NombreModelo = keyof typeof MODELOS;

/** AI_MODELO fuerza un modelo para todos los agentes (por ejemplo "principal" para comparar calidad). Sin ella, cada agente usa el suyo. */
export function modeloEfectivo(delAgente: NombreModelo, env: Record<string, string | undefined> = process.env): NombreModelo {
  const forzado = env.AI_MODELO;
  if (!forzado) return delAgente;
  if (!Object.hasOwn(MODELOS, forzado)) throw new Error(`AI_MODELO desconocido: ${forzado}. Opciones: ${Object.keys(MODELOS).join(", ")}`);
  return forzado as NombreModelo;
}

export function costoUsd(modelo: NombreModelo, uso: Anthropic.Usage): number {
  const p = MODELOS[modelo].usdPorMTok;
  return (
    (uso.input_tokens * p.entrada +
      uso.output_tokens * p.salida +
      (uso.cache_read_input_tokens ?? 0) * p.cacheLectura +
      (uso.cache_creation_input_tokens ?? 0) * p.cacheEscritura) /
    1_000_000
  );
}
