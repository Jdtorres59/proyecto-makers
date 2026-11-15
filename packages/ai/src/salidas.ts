import { DocumentoLeido, Renglon } from "@makers/core";
import { z } from "zod";

/** Lo que devuelve leer_documento. El id y la fecha de subida los pone la API, no el modelo. */
export const LecturaDocumento = DocumentoLeido.pick({ tipo: true, titulo: true, periodo: true }).extend({
  renglones: z.array(Renglon.omit({ explicacion: true })),
});
export type LecturaDocumento = z.infer<typeof LecturaDocumento>;

/** Lo que devuelve explicar_documento: una explicación por clave de renglón. */
export const Explicaciones = z.object({
  explicaciones: z.array(z.object({ clave: z.string(), explicacion: z.string().min(1) })),
});
export type Explicaciones = z.infer<typeof Explicaciones>;
