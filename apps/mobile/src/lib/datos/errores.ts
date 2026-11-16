/** Qué tipo de problema hubo, para mostrar el mensaje y la escena que le corresponde. */
export type TipoProblema = 'sin-conexion' | 'tope' | 'sesion' | 'archivo' | 'servidor';

/** Error que la app sabe mostrar. `mensaje` ya viene en lenguaje llano, sin tecnicismos. */
export class ProblemaLuca extends Error {
  constructor(
    public tipo: TipoProblema,
    public mensaje: string,
  ) {
    super(mensaje);
  }
}

const MENSAJES: Record<TipoProblema, string> = {
  'sin-conexion': 'No me pude conectar. Revisa tu internet e intenta de nuevo.',
  tope: 'Por hoy ya conversamos mucho. Vuelve mañana y seguimos.',
  sesion: 'Tu sesión se cerró. Vuelve a entrar.',
  archivo: 'No pude usar ese archivo. Prueba con un PDF o una foto más liviana.',
  servidor: 'Algo me falló. Intenta de nuevo en un momento.',
};

/** Convierte una respuesta HTTP fallida en un problema con mensaje claro. Usa el texto de la API si lo trae. */
export async function problemaDeRespuesta(r: { status: number; json(): Promise<unknown> }): Promise<ProblemaLuca> {
  const cuerpo = (await r.json().catch(() => null)) as { error?: string } | null;
  const tipo: TipoProblema = r.status === 429 ? 'tope' : r.status === 401 ? 'sesion' : r.status === 413 || r.status === 400 ? 'archivo' : 'servidor';
  // Los textos de la API ya están en español llano; los 5xx genéricos se cambian por el nuestro.
  const mensaje = tipo === 'tope' ? MENSAJES.tope : cuerpo?.error && r.status < 500 ? cuerpo.error : r.status === 502 && cuerpo?.error ? cuerpo.error : MENSAJES[tipo];
  return new ProblemaLuca(tipo, mensaje);
}

/** Cualquier error a un problema mostrable. fetch lanza TypeError cuando no hay red. */
export function comoProblema(e: unknown): ProblemaLuca {
  if (e instanceof ProblemaLuca) return e;
  if (e instanceof TypeError) return new ProblemaLuca('sin-conexion', MENSAJES['sin-conexion']);
  return new ProblemaLuca('servidor', MENSAJES.servidor);
}

export const mensajeDe = (tipo: TipoProblema) => MENSAJES[tipo];
