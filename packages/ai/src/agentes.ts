import type { z } from "zod";
import {
  calcularNeto,
  calcularPorcentaje,
  calcularPrestaciones,
  consultarNormaVigente,
  costoDePagoMinimo,
  costoDePrestamo,
  costoDeTarjeta,
  type Herramienta,
  porcentajeDelSueldoEnCuotas,
} from "./herramientas";
import type { NombreModelo } from "./modelos";
import { acompanarDecision } from "./prompts/acompanar-decision";
import { explicarDocumento } from "./prompts/explicar-documento";
import { leerDocumento } from "./prompts/leer-documento";
import { Explicaciones, LecturaDocumento } from "./salidas";

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
  /** Si existe, el modelo responde JSON con este esquema (salida estructurada) y se valida con zod. */
  salida?: z.ZodType;
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
  leer_documento: {
    nombre: "leer_documento",
    modelo: "principal",
    prompt: leerDocumento,
    herramientas: [],
    salida: LecturaDocumento,
  },
  explicar_documento: {
    nombre: "explicar_documento",
    modelo: "principal",
    prompt: explicarDocumento,
    herramientas: [calcularNeto, calcularPrestaciones, calcularPorcentaje, consultarNormaVigente],
    salida: Explicaciones,
  },
  acompanar_decision: {
    nombre: "acompanar_decision",
    modelo: "principal",
    prompt: acompanarDecision,
    herramientas: [costoDeTarjeta, costoDePagoMinimo, costoDePrestamo, porcentajeDelSueldoEnCuotas, calcularNeto, consultarNormaVigente],
  },
};
