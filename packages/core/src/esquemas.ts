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

/*
 * Contratos de Luca 1.0. Son el acuerdo entre la app y la API: la app arma sus datos de
 * muestra con estos tipos y la API responde con ellos. Los edita solo quien trabaja el backend.
 * Plata: entero en pesos. Fechas: "AAAA-MM-DD".
 */

const Plata = z.number().int().nonnegative();
const Fecha = z.iso.date();

export const Deuda = z.object({
  id: z.string(),
  tipo: z.enum(["tarjeta", "celular", "credito", "educativo", "otra"]),
  nombre: z.string(),
  cuotaMensual: Plata.nullable(),
  cuotasRestantes: z.number().int().nonnegative().nullable(),
  saldo: Plata.nullable(),
  /** Tasa efectiva anual en porcentaje, por ejemplo 26.5. */
  tasaEA: z.number().nonnegative().nullable(),
  /** Día del mes en que se paga la cuota. Opcional para no romper datos de muestra anteriores. */
  diaDePago: z.number().int().min(1).max(31).nullable().optional(),
});
export type Deuda = z.infer<typeof Deuda>;

/** Lo que Luca sabe de la persona. Todo campo puede faltar: se llena de a poco. */
export const PerfilFinanciero = z.object({
  nombre: z.string().nullable(),
  empresa: z.string().nullable(),
  cargo: z.string().nullable(),
  salario: Plata.nullable(),
  diaDePago: z.number().int().min(1).max(31).nullable(),
  fechaIngreso: Fecha.nullable(),
  deudas: z.array(Deuda),
  meta: z.string().nullable(),
  vivienda: z.enum(["familia", "arriendo", "propia", "otra"]).nullable(),
});
export type PerfilFinanciero = z.infer<typeof PerfilFinanciero>;

export const TipoDocumento = z.enum(["desprendible", "extracto", "oferta_credito", "certificado_cesantias", "contrato", "otro"]);
export type TipoDocumento = z.infer<typeof TipoDocumento>;

/** Un renglón que la IA leyó de un documento. La persona siempre puede corregirlo. */
export const Renglon = z.object({
  clave: z.string(),
  etiqueta: z.string(),
  /** Tal como aparece en el papel. */
  texto: z.string(),
  monto: Plata.nullable(),
  confianza: z.enum(["alta", "media", "baja"]),
  /** Explicación en lenguaje llano; llega después, con /documentos/:id/explicar. */
  explicacion: z.string().nullable(),
});
export type Renglon = z.infer<typeof Renglon>;

export const DocumentoLeido = z.object({
  id: z.string(),
  tipo: TipoDocumento,
  titulo: z.string(),
  periodo: z.string().nullable(),
  subidoEn: z.iso.datetime(),
  renglones: z.array(Renglon),
});
export type DocumentoLeido = z.infer<typeof DocumentoLeido>;

/** Algo que le pasa a la plata de la persona en una fecha. Alimenta "Lo que viene". */
export const EventoDePlata = z.object({
  fecha: Fecha,
  tipo: z.enum(["sueldo", "prima", "cesantias", "intereses_cesantias", "cuota", "decision"]),
  titulo: z.string(),
  monto: Plata.nullable(),
  sentido: z.enum(["entra", "sale"]),
});
export type EventoDePlata = z.infer<typeof EventoDePlata>;

const Opcion = z.object({ id: z.string(), texto: z.string() });

/** Los tipos de paso que la app sabe pintar. Un tipo nuevo exige pantalla nueva. */
export const Paso = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("idea"), titulo: z.string(), texto: z.string(), tuyo: z.string().nullable() }),
  z.object({
    tipo: z.literal("opcion_multiple"),
    pregunta: z.string(),
    opciones: z.array(Opcion).min(2),
    correcta: z.string(),
    siAcierta: z.string(),
    siFalla: z.string(),
  }),
  z.object({
    tipo: z.literal("estimar"),
    pregunta: z.string(),
    min: Plata,
    max: Plata,
    paso: Plata,
    respuesta: Plata,
    /** Cómo se llega a la respuesta, para mostrar al revelar. */
    cuenta: z.string(),
  }),
  z.object({ tipo: z.literal("ordenar"), pregunta: z.string(), tarjetas: z.array(Opcion).min(2), ordenCorrecto: z.array(z.string()) }),
  z.object({ tipo: z.literal("repartir"), pregunta: z.string(), total: Plata, paso: Plata, destinos: z.array(Opcion).min(2) }),
  z.object({
    tipo: z.literal("comparar"),
    pregunta: z.string(),
    caminos: z.array(z.object({ id: z.string(), titulo: z.string(), total: Plata, cuotaMensual: Plata, meses: z.number().int().positive() })).min(2),
  }),
  z.object({ tipo: z.literal("regla"), texto: z.string() }),
  /** Lo que la persona hace fuera de la lección para completar el módulo. */
  z.object({ tipo: z.literal("accion"), texto: z.string(), comoSeComprueba: z.string() }),
]);
export type Paso = z.infer<typeof Paso>;

export const Leccion = z.object({ id: z.string(), titulo: z.string(), minutos: z.number().int().positive(), pasos: z.array(Paso).min(1) });
export type Leccion = z.infer<typeof Leccion>;

export const Modulo = z.object({
  id: z.string(),
  orden: z.number().int().positive(),
  capacidad: z.enum(["E", "G", "S", "D", "P", "I", "F"]),
  titulo: z.string(),
  /** "Al terminar puedes…" */
  promesa: z.string(),
  /** Nombres de los assets en apps/mobile/assets. */
  portada: z.string(),
  medalla: z.string(),
  /** false mientras una persona no haya verificado sus cifras: la app lo muestra bloqueado. */
  publicado: z.boolean(),
  lecciones: z.array(Leccion),
});
export type Modulo = z.infer<typeof Modulo>;

export const Progreso = z.object({
  leccionesTerminadas: z.array(z.string()),
  /** Ids de módulo cuya acción ya se cumplió. */
  medallas: z.array(z.string()),
});
export type Progreso = z.infer<typeof Progreso>;

/** Una decisión de plata que la persona tomó con ayuda de Luca. Decide ella, no Luca. */
export const Decision = z.object({
  id: z.string(),
  pregunta: z.string(),
  documentos: z.array(z.string()),
  caminoElegido: z.string().nullable(),
  motivos: z.array(z.string()),
  nota: z.string().nullable(),
  creadaEn: z.iso.datetime(),
});
export type Decision = z.infer<typeof Decision>;
