import { hoyEnColombia } from '@makers/conocimiento';
import { modulosPara } from '@makers/contenido';
import type { Decision, DocumentoLeido, EventoDePlata, EventoIA, PerfilFinanciero, Progreso } from '@makers/core';

import { api } from '../api';
import { supabase } from '../supabase';
import { comoProblema, mensajeDe, ProblemaLuca, problemaDeRespuesta } from './errores';
import type { Archivo, FuenteDeDatos } from './fuente';

/** Formatos que la API sabe leer (los mismos que acepta `documents.mime_type` en el backend). */
const FORMATOS: Record<string, string> = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 10 * 1024 * 1024;

/** Lo mínimo que usamos de una respuesta (la del cliente de Hono y la de fetch la cumplen). */
type Respuesta = { ok: boolean; status: number; json(): Promise<unknown>; body: ReadableStream<Uint8Array> | null };

/** Corre una llamada a la API y convierte cualquier falla en ProblemaLuca. */
async function llamar<T>(peticion: () => Promise<Respuesta>, leer: (r: Respuesta) => Promise<T>): Promise<T> {
  let r: Respuesta;
  try {
    r = await peticion();
  } catch (e) {
    throw comoProblema(e);
  }
  if (!r.ok) throw await problemaDeRespuesta(r);
  return leer(r);
}
const comoJson = <T,>(r: Respuesta) => r.json() as Promise<T>;

async function usuarioId() {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new ProblemaLuca('sesion', mensajeDe('sesion'));
  return id;
}

/** Lee un cuerpo NDJSON por partes y avisa cada evento. */
async function leerEventos(r: Respuesta, alEvento: (e: EventoIA) => void) {
  if (!r.body) throw new ProblemaLuca('servidor', mensajeDe('servidor'));
  const lector = r.body.getReader();
  const decodificador = new TextDecoder();
  let pendiente = '';
  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;
    pendiente += decodificador.decode(value, { stream: true });
    const lineas = pendiente.split('\n');
    pendiente = lineas.pop()!;
    for (const linea of lineas) if (linea) alEvento(JSON.parse(linea));
  }
  if (pendiente.trim()) alEvento(JSON.parse(pendiente));
}

export const fuenteDeApi: FuenteDeDatos = {
  hoy: () => hoyEnColombia(),

  perfil: () => llamar(() => api.perfil.$get(), comoJson<PerfilFinanciero>),
  guardarPerfil: (perfil) => llamar(() => api.perfil.$put({ json: perfil }), async () => undefined),

  async documentos() {
    const { data, error } = await supabase.from('documents').select('id').order('created_at', { ascending: false });
    if (error) throw comoProblema(new TypeError(error.message));
    // Solo los que ya se leyeron: GET /documentos/:id da 404 para un archivo subido sin lectura.
    const lecturas = await Promise.all(
      (data ?? []).map(({ id }) =>
        api.documentos[':id'].$get({ param: { id } }).then((r) => (r.ok ? (r.json() as Promise<DocumentoLeido>) : null)),
      ),
    );
    return lecturas.filter((d) => d !== null);
  },

  async leerDocumento(archivo: Archivo) {
    const extension = FORMATOS[archivo.mime];
    if (!extension) throw new ProblemaLuca('archivo', 'Ese formato no lo sé leer. Sube un PDF o una foto (JPG o PNG).');
    const uid = await usuarioId();
    let bytes: ArrayBuffer;
    try {
      bytes = await (await fetch(archivo.uri)).arrayBuffer();
    } catch {
      throw new ProblemaLuca('archivo', mensajeDe('archivo'));
    }
    if (bytes.byteLength > MAX_BYTES) throw new ProblemaLuca('archivo', 'El archivo pesa demasiado. Prueba con una foto o un PDF más liviano.');

    // El bucket es privado y la política solo deja escribir en la carpeta con el id de la persona.
    const ruta = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const subida = await supabase.storage.from('documentos').upload(ruta, bytes, { contentType: archivo.mime });
    if (subida.error) throw comoProblema(new TypeError(subida.error.message));
    const fila = await supabase.from('documents').insert({ storage_path: ruta, mime_type: archivo.mime }).select('id').single();
    if (fila.error || !fila.data) throw new ProblemaLuca('servidor', mensajeDe('servidor'));

    return llamar(() => api.documentos[':id'].leer.$post({ param: { id: fila.data.id } }), comoJson<DocumentoLeido>);
  },

  explicarDocumento: (doc) => llamar(() => api.documentos[':id'].explicar.$post({ param: { id: doc.id } }), comoJson<DocumentoLeido>),
  eventos: () => llamar(() => api.eventos.$get(), comoJson<EventoDePlata[]>),
  // El contenido vive en el paquete; la API no lo sirve.
  modulos: async (perfil) => modulosPara(perfil, hoyEnColombia()),
  progreso: () => llamar(() => api.progreso.$get(), comoJson<Progreso>),
  sumarProgreso: (p) => llamar(() => api.progreso.$post({ json: p }), comoJson<Progreso>),

  crearDecision: (pregunta) => llamar(() => api.decisiones.$post({ json: { pregunta, documentos: [] } }), comoJson<Decision>),
  conversar: (decisionId, mensaje, historial, documentos, alEvento) =>
    llamar(
      () => api.decisiones[':id'].conversar.$post({ param: { id: decisionId }, json: { mensaje, historial, documentos } }),
      (r) => leerEventos(r, alEvento),
    ),
  cerrarDecision: (decisionId, cierre) => llamar(() => api.decisiones[':id'].cerrar.$post({ param: { id: decisionId }, json: cierre }), comoJson<Decision>),

  borrarTodo: () => llamar(() => api.yo.$delete(), async () => undefined),
};
