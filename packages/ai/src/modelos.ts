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
} as const;

export type NombreModelo = keyof typeof MODELOS;

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
