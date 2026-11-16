import type { Decision, DocumentoLeido, EventoDePlata, EventoIA, Modulo, PerfilFinanciero, Progreso, TipoDocumento } from '@makers/core';

/** Un archivo elegido por la persona (selector o cámara). En el modo demostración solo trae `pista`. */
export type Archivo = { uri: string; nombre: string; mime: string; pista?: TipoDocumento };

export type Turno = { rol: 'persona' | 'luca'; texto: string };
export type Cierre = { caminoElegido: string; motivos: string[]; nota: string | null; documentos: string[] };

/**
 * Lo que las pantallas le piden a "los datos de Luca". Dos implementaciones: `fuenteDeMuestra` (modo
 * demostración, el caso ficticio de Valentina) y `fuenteDeApi` (la API real con la sesión de Supabase).
 * Todo método puede lanzar `ProblemaLuca`.
 */
export interface FuenteDeDatos {
  /** Fecha de hoy para las cuentas, "AAAA-MM-DD". */
  hoy(): string;
  perfil(): Promise<PerfilFinanciero>;
  guardarPerfil(perfil: PerfilFinanciero): Promise<void>;
  /** Los documentos ya leídos, del más nuevo al más viejo. */
  documentos(): Promise<DocumentoLeido[]>;
  /** Sube y lee un documento. */
  leerDocumento(archivo: Archivo): Promise<DocumentoLeido>;
  /** Llena `explicacion` en cada renglón. */
  explicarDocumento(doc: DocumentoLeido): Promise<DocumentoLeido>;
  eventos(perfil: PerfilFinanciero): Promise<EventoDePlata[]>;
  /** Los 12 módulos del núcleo, de @makers/contenido. */
  modulos(perfil: PerfilFinanciero): Promise<Modulo[]>;
  progreso(): Promise<Progreso>;
  /** Suma lecciones y medallas; devuelve el progreso completo. */
  sumarProgreso(p: Progreso): Promise<Progreso>;
  crearDecision(pregunta: string): Promise<Decision>;
  /** Conversa con Luca sobre la decisión; avisa cada evento a medida que llega. */
  conversar(decisionId: string, mensaje: string, historial: Turno[], documentos: string[], alEvento: (e: EventoIA) => void): Promise<void>;
  cerrarDecision(decisionId: string, cierre: Cierre): Promise<Decision>;
  /** Borra todo lo que Luca sabe. */
  borrarTodo(): Promise<void>;
}
