import { AGENTES, ejecutarAgente, type Proveedor, type RegistroIA } from "@makers/ai";
import { type EventoIA, SolicitudIA } from "@makers/core";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { validator } from "hono/validator";

/** Todo lo que la API necesita de afuera. En producción lo arma index.ts; en pruebas son dobles. */
export type Dependencias = {
  /** Devuelve el id del usuario dueño del token, o null si no es válido. */
  verificarToken(token: string): Promise<string | null>;
  gastoDeHoyUsd(usuarioId: string): Promise<number>;
  registrar(registro: RegistroIA): Promise<string | null>;
  proveedor: Proveedor;
  topeDiarioUsd: number;
};

export function crearApp(d: Dependencias) {
  return new Hono<{ Variables: { usuarioId: string } }>()
    .get("/health", (c) => c.json({ ok: true, proveedor: d.proveedor.nombre }))
    // De aquí hacia abajo todo exige sesión.
    .use(async (c, next) => {
      const token = c.req.header("Authorization")?.match(/^Bearer (.+)$/)?.[1];
      const usuarioId = token ? await d.verificarToken(token) : null;
      if (!usuarioId) return c.json({ error: "Sesión inválida" }, 401);
      c.set("usuarioId", usuarioId);
      await next();
    })
    .get("/me", (c) => c.json({ id: c.get("usuarioId") }))
    .post(
      "/ai/run",
      validator("json", (valor, c) => {
        const solicitud = SolicitudIA.safeParse(valor);
        return solicitud.success ? solicitud.data : c.json({ error: "Solicitud inválida" }, 400);
      }),
      async (c) => {
        const { agente: nombre, mensaje } = c.req.valid("json");
        const usuarioId = c.get("usuarioId");
        const agente = AGENTES[nombre];
        if (!agente) return c.json({ error: "Ese agente no existe" }, 404);
        if ((await d.gastoDeHoyUsd(usuarioId)) >= d.topeDiarioUsd) {
          return c.json({ error: "Llegaste al tope de uso de hoy. Vuelve mañana." }, 429);
        }

        // Una línea JSON por evento (NDJSON); los tipos están en EventoIA.
        c.header("Content-Type", "application/x-ndjson");
        return stream(c, async (salida) => {
          const enviar = (evento: EventoIA) => salida.write(`${JSON.stringify(evento)}\n`);
          const { runId, registro } = await ejecutarAgente({
            agente,
            mensaje,
            usuarioId,
            proveedor: d.proveedor,
            registrar: d.registrar,
            alEvento: (evento) => void enviar(evento),
          });
          await enviar({ tipo: "fin", runId, estado: registro.status });
        });
      },
    );
}

/** Tipo de la API para el cliente tipado de la app (hono/client). */
export type AppType = ReturnType<typeof crearApp>;
