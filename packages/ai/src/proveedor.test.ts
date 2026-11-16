import { expect, test } from "vitest";
import { modeloEfectivo } from "./modelos";
import { crearProveedor, idBedrock } from "./proveedor";

test("Bedrock: región y credenciales propias, o falla al arrancar", () => {
  expect(() => crearProveedor({ AI_PROVIDER: "bedrock", AWS_REGION: "us-east-1", AWS_ACCESS_KEY_ID: "x", AWS_SECRET_ACCESS_KEY: "y" })).toThrow(/BEDROCK_REGION/);
  expect(() => crearProveedor({ AI_PROVIDER: "bedrock", BEDROCK_REGION: "us-east-1" })).toThrow(/AWS_BEARER_TOKEN_BEDROCK/);
  expect(() => crearProveedor({ AI_PROVIDER: "bedrock", BEDROCK_REGION: "us-east-1", BEDROCK_AWS_ACCESS_KEY_ID: "x" })).toThrow(/van juntas/);
  // Valores ficticios: construir el cliente no llama a la red.
  expect(crearProveedor({ AI_PROVIDER: "bedrock", BEDROCK_REGION: "us-east-1", BEDROCK_AWS_ACCESS_KEY_ID: "x", BEDROCK_AWS_SECRET_ACCESS_KEY: "y" }).nombre).toBe("bedrock");
  expect(crearProveedor({ AI_PROVIDER: "bedrock", BEDROCK_REGION: "us-east-1", AWS_BEARER_TOKEN_BEDROCK: "z" }).nombre).toBe("bedrock");
});

test("Bedrock: el ID lleva el prefijo anthropic. y se puede fijar por variable", () => {
  expect(idBedrock({})("claude-opus-5-5")).toBe("anthropic.claude-opus-5-5");
  expect(idBedrock({ BEDROCK_MODELO_PRINCIPAL: "us.anthropic.claude-opus-5-5" })("claude-opus-5-5")).toBe("us.anthropic.claude-opus-5-5");
  expect(idBedrock({ BEDROCK_MODELO_PRINCIPAL: "otro" })("claude-haiku-5-5")).toBe("anthropic.claude-haiku-5-5");
  expect(idBedrock({ BEDROCK_MODELO_ECONOMICO: "anthropic.claude-haiku-4-5" })("claude-haiku-5-5")).toBe("anthropic.claude-haiku-4-5");
});

test("AI_MODELO elige el modelo de todos los agentes; uno desconocido falla al arrancar", () => {
  expect(modeloEfectivo("principal", {})).toBe("principal");
  expect(modeloEfectivo("principal", { AI_MODELO: "economico" })).toBe("economico");
  expect(() => crearProveedor({ AI_MODELO: "toString" })).toThrow(/AI_MODELO desconocido/);
});
