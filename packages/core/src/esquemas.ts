import { z } from "zod";

/** Lo que la app le pide a la API en POST /ai/run. */
export const SolicitudIA = z.object({
  agente: z.string().min(1),
  mensaje: z.string().trim().min(1).max(4000),
});
export type SolicitudIA = z.infer<typeof SolicitudIA>;

/** Lo que la API devuelve, una línea JSON por evento (NDJSON). */
export type EventoIA =
  | { tipo: "texto"; delta: string }
  | { tipo: "herramienta"; nombre: string }
  | { tipo: "fin"; runId: string | null; estado: "ok" | "rechazo" | "truncado" | "error" };
