import { calcularPorcentaje, consultarNormaVigente, type Herramienta } from "./herramientas";
import type { NombreModelo } from "./modelos";

/**
 * Un agente es datos: qué modelo usa, qué instrucciones recibe y qué herramientas tiene.
 * Las reglas comunes (prompts/constitucion.ts) se le anteponen siempre.
 * Para crear uno del producto: agrégalo a AGENTES y súmale al menos un caso en evals/casos.json.
 */
export type Agente = {
  nombre: string;
  modelo: NombreModelo;
  prompt: { version: string; texto: string };
  herramientas: Herramienta[];
};

export const AGENTES: Record<string, Agente> = {
  // Agente de prueba de la base técnica. No es una feature de producto.
  base: {
    nombre: "base",
    modelo: "principal",
    prompt: {
      version: "1",
      texto: "Responde de forma breve a lo que te pregunten. Usa las herramientas cuando la pregunta tenga cifras.",
    },
    herramientas: [calcularPorcentaje, consultarNormaVigente],
  },
};
