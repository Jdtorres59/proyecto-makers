import type { DocumentoLeido, EventoDePlata, Modulo, PerfilFinanciero, TipoDocumento } from '@makers/core';

/**
 * Lo que las pantallas le piden a "los datos de Luca". Hoy lo cumple `fuenteDeMuestra` (el caso de
 * Valentina, calculado con packages/core); en el paso 5 se cambia por una que llame a la API
 * (GET/PUT /perfil, POST /documentos/:id/leer y /explicar, GET /eventos, DELETE /yo) sin tocar pantallas.
 */
export interface FuenteDeDatos {
  /** Fecha de hoy para las cuentas, "AAAA-MM-DD". */
  hoy(): string;
  /** Lo que Luca sabe de la persona al entrar (con la sesión llega al menos el nombre). */
  perfil(): Promise<PerfilFinanciero>;
  guardarPerfil(perfil: PerfilFinanciero): Promise<void>;
  /** Sube y lee un documento del tipo dado. Con la API: subir al bucket, registrar y POST /documentos/:id/leer. */
  leerDocumento(tipo: TipoDocumento, perfil: PerfilFinanciero): Promise<DocumentoLeido>;
  /** Llena `explicacion` en cada renglón (POST /documentos/:id/explicar). */
  explicarDocumento(doc: DocumentoLeido): Promise<DocumentoLeido>;
  /** "Lo que viene": las próximas fechas de su plata. */
  eventos(perfil: PerfilFinanciero): Promise<EventoDePlata[]>;
  /** Los 12 módulos del núcleo. Único punto de carga: aquí se enchufa packages/contenido. */
  modulos(perfil: PerfilFinanciero): Promise<Modulo[]>;
  /** Borra todo lo que Luca sabe (DELETE /yo). */
  borrarTodo(): Promise<void>;
}
