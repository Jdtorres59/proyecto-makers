import type { DocumentoLeido, EventoDePlata, PerfilFinanciero } from '@makers/core';

/**
 * Lo que las pantallas le piden a "los datos de Luca". Hoy lo cumple `fuenteDeMuestra` (el caso de
 * Valentina, calculado con packages/core); en el paso 5 se cambia por una que llame a la API
 * (GET/PUT /perfil, POST /documentos/:id/leer, GET /eventos) sin tocar pantallas.
 */
export interface FuenteDeDatos {
  /** Fecha de hoy para las cuentas, "AAAA-MM-DD". */
  hoy(): string;
  /** Lo que Luca sabe de la persona al entrar (con la sesión llega al menos el nombre). */
  perfil(): Promise<PerfilFinanciero>;
  guardarPerfil(perfil: PerfilFinanciero): Promise<void>;
  /** Lee el desprendible que la persona eligió. */
  leerDesprendible(): Promise<DocumentoLeido>;
  /** "Lo que viene": las próximas fechas de su plata. */
  eventos(perfil: PerfilFinanciero): Promise<EventoDePlata[]>;
}
