import { consultarNorma, NORMAS } from "@makers/conocimiento";
import { aplicarPorcentaje, formatearCOP } from "@makers/core";
import { z } from "zod";

/**
 * Una herramienta es lo único que el modelo puede hacer además de escribir.
 * Para agregar una: declárala aquí con su esquema y súmala a la lista del agente que la necesite.
 */
export type Herramienta<E extends z.ZodType = z.ZodType> = {
  nombre: string;
  descripcion: string;
  entrada: E;
  ejecutar(entrada: z.infer<E>): string | Promise<string>;
};

const herramienta = <E extends z.ZodType>(h: Herramienta<E>) => h;

export const calcularPorcentaje = herramienta({
  nombre: "calcular_porcentaje",
  descripcion:
    "Calcula el porcentaje de un monto en pesos colombianos, redondeado al peso. Úsala para cualquier cuenta de porcentajes en vez de hacerla mentalmente.",
  entrada: z.strictObject({
    monto: z.number().int().describe("Monto en pesos, entero y sin separadores. Ejemplo: 3600000"),
    porcentaje: z.number().describe("Porcentaje a aplicar. Ejemplo: 4 para el 4 %"),
  }),
  ejecutar({ monto, porcentaje }) {
    const resultado = aplicarPorcentaje(monto, porcentaje);
    return JSON.stringify({ resultado, formato: formatearCOP(resultado) });
  },
});

const claves = [...new Set(NORMAS.map((n) => n.clave))] as [string, ...string[]];

export const consultarNormaVigente = herramienta({
  nombre: "consultar_norma",
  descripcion:
    "Devuelve el valor vigente hoy de una norma colombiana, con su fuente. Es la única fuente válida para cifras legales.",
  entrada: z.strictObject({ clave: z.enum(claves).describe("Clave de la norma. smmlv = salario mínimo mensual") }),
  ejecutar({ clave }) {
    const norma = consultarNorma(clave);
    if (!norma) return "No hay una norma vigente cargada para esa clave. Dilo así y no des una cifra.";
    const { nombre, valor, unidad, fuente, vigenteDesde, vigenteHasta } = norma;
    return JSON.stringify({ nombre, valor, unidad, fuente, vigenteDesde, vigenteHasta });
  },
});
