// Prueba de humo del proveedor real: UNA llamada a leer_documento con el desprendible ficticio de los evals.
// Cuesta plata si AI_PROVIDER no es mock. Uso: pnpm --filter @makers/api humo (lee apps/api/.env).
import { readFileSync } from "node:fs";
import { AGENTES, crearProveedor, ejecutarAgente } from "@makers/ai";

const pdf = readFileSync(new URL("../../../evals/fixtures/desprendible-ficticio.pdf", import.meta.url));
const { registro } = await ejecutarAgente({
  agente: AGENTES.leer_documento!,
  mensaje: "Lee este documento.",
  adjunto: { mediaType: "application/pdf", datos: pdf.toString("base64") },
  usuarioId: "prueba-de-humo",
  proveedor: crearProveedor(),
  registrar: async () => null, // No escribe en la base.
});
console.log(`proveedor: ${registro.provider}  modelo: ${registro.model}  estado: ${registro.status}`);
console.log(`tokens: entrada ${registro.input_tokens}, salida ${registro.output_tokens}, caché ${registro.cache_read_tokens}/${registro.cache_write_tokens}`);
console.log(`costo: US$${registro.cost_usd.toFixed(4)}  (${registro.latency_ms} ms)`);
if (registro.error) console.log(`error: ${registro.error}`);
process.exitCode = registro.status === "ok" ? 0 : 1;
