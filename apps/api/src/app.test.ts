import { proveedorSimulado, type RegistroIA } from "@makers/ai";
import { expect, test } from "vitest";
import { crearApp } from "./app";

function preparar(gastado = 0) {
  const registros: RegistroIA[] = [];
  const app = crearApp({
    proveedor: proveedorSimulado(),
    topeDiarioUsd: 0.5,
    verificarToken: async (token) => (token === "bueno" ? "u1" : null),
    gastoDeHoyUsd: async () => gastado,
    registrar: async (r) => `run_${registros.push(r)}`,
  });
  const pedir = (cuerpo: unknown, token?: string) =>
    app.request("/ai/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: JSON.stringify(cuerpo),
    });
  return { app, pedir, registros };
}

test("health es público; lo demás exige sesión", async () => {
  const { app, pedir } = preparar();
  expect((await app.request("/health")).status).toBe(200);
  expect((await app.request("/me")).status).toBe(401);
  expect((await pedir({ agente: "base", mensaje: "hola" })).status).toBe(401);
  expect((await pedir({ agente: "base", mensaje: "hola" }, "malo")).status).toBe(401);
});

test("valida la solicitud y el agente", async () => {
  const { pedir } = preparar();
  expect((await pedir({ agente: "base", mensaje: "" }, "bueno")).status).toBe(400);
  expect((await pedir({ agente: "no_existe", mensaje: "hola" }, "bueno")).status).toBe(404);
});

test("corta cuando el usuario llegó al tope de gasto del día", async () => {
  const { pedir, registros } = preparar(0.5);
  expect((await pedir({ agente: "base", mensaje: "hola" }, "bueno")).status).toBe(429);
  expect(registros).toHaveLength(0);
});

test("responde en streaming y registra la ejecución a nombre del usuario", async () => {
  const { pedir, registros } = preparar();
  const respuesta = await pedir({ agente: "base", mensaje: "¿Cuánto es el 4% de $3.600.000?" }, "bueno");
  expect(respuesta.status).toBe(200);
  const eventos = (await respuesta.text()).trim().split("\n").map((linea) => JSON.parse(linea));
  expect(eventos.at(-1)).toEqual({ tipo: "fin", runId: "run_1", estado: "ok" });
  expect(eventos).toContainEqual({ tipo: "herramienta", nombre: "calcular_porcentaje" });
  expect(eventos.filter((e) => e.tipo === "texto").map((e) => e.delta).join("")).toContain("$144.000");
  expect(registros[0]).toMatchObject({ user_id: "u1", agent: "base", status: "ok" });
});
