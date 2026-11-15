import type { AppType } from '@makers/api';
import type { EventoIA } from '@makers/core';
import { fetch as fetchConStreaming } from 'expo/fetch';
import { hc } from 'hono/client';

import { supabase } from './supabase';

/** Cliente tipado de apps/api: las rutas y sus cuerpos se verifican al compilar. */
export const api = hc<AppType>(process.env.EXPO_PUBLIC_API_URL!, {
  // El fetch de React Native no entrega la respuesta por partes; el de Expo sí.
  fetch: fetchConStreaming as unknown as typeof fetch,
  headers: async () => {
    const { data } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${data.session?.access_token ?? ''}` };
  },
});

/** Corre un agente y avisa cada evento a medida que llega. */
export async function ejecutarIA(agente: string, mensaje: string, alEvento: (evento: EventoIA) => void) {
  const respuesta = await api.ai.run.$post({ json: { agente, mensaje } });
  if (!respuesta.ok || !respuesta.body) {
    const cuerpo = (await respuesta.json().catch(() => null)) as { error?: string } | null;
    throw new Error(cuerpo?.error ?? `La API respondió ${respuesta.status}`);
  }
  const lector = respuesta.body.getReader();
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
}
