import { readFileSync } from "node:fs";
import { type Adjunto, AGENTES, crearProveedor, ejecutarAgente } from "@makers/ai";
import { expect, test } from "vitest";

/**
 * Evals: casos que el producto no puede fallar. Cada caso de casos.json corre un agente y revisa
 * de forma determinista qué herramientas usó y qué dijo. debeContener y noDebeContener son
 * expresiones regulares. adjunto es un archivo de fixtures/ (datos ficticios) que se manda como PDF o imagen.
 * Para agentes con salida estructurada, status "ok" ya garantiza que el JSON cumplió el esquema.
 *
 *   pnpm eval                        contra el proveedor simulado (gratis; solo prueba el arnés)
 *   AI_PROVIDER=anthropic pnpm eval  contra el modelo real (cuesta plata: correr a mano)
 *
 * Regla del repo: todo cambio de prompt, modelo o herramienta suma o ajusta un caso aquí.
 */
type Caso = {
  nombre: string;
  agente: string;
  mensaje: string;
  debeUsar: string[];
  debeContener: string[];
  noDebeContener: string[];
  adjunto?: string;
};

const TIPOS: Record<string, Adjunto["mediaType"]> = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
const adjunto = (archivo: string): Adjunto => ({
  mediaType: TIPOS[archivo.split(".").pop()!]!,
  datos: readFileSync(new URL(`./fixtures/${archivo}`, import.meta.url)).toString("base64"),
});

const casos: Caso[] = JSON.parse(readFileSync(new URL("./casos.json", import.meta.url), "utf8"));
const proveedor = crearProveedor();

test.each(casos)("$nombre", { timeout: 120_000 }, async (caso) => {
  const { registro } = await ejecutarAgente({
    agente: AGENTES[caso.agente]!,
    mensaje: caso.mensaje,
    ...(caso.adjunto && { adjunto: adjunto(caso.adjunto) }),
    usuarioId: "eval",
    proveedor,
    registrar: async () => null,
  });
  expect(registro.status, registro.error ?? "").toBe("ok");
  expect(registro.tools).toEqual(expect.arrayContaining(caso.debeUsar));
  for (const patron of caso.debeContener) expect(registro.output).toMatch(new RegExp(patron));
  for (const patron of caso.noDebeContener) expect(registro.output).not.toMatch(new RegExp(patron, "i"));
});
