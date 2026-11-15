import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// La sesión se guarda cifrada (Keychain / Keystore). SecureStore recomienda valores de máximo
// 2048 bytes y la sesión de Supabase pesa más, así que se parte en trozos.
const TROZO = 1800;
const almacenSeguro = {
  async getItem(clave: string) {
    const n = Number(await SecureStore.getItemAsync(`${clave}.n`));
    if (!n) return null;
    const partes = await Promise.all(Array.from({ length: n }, (_, i) => SecureStore.getItemAsync(`${clave}.${i}`)));
    return partes.join('');
  },
  async setItem(clave: string, valor: string) {
    const n = Math.ceil(valor.length / TROZO);
    for (let i = 0; i < n; i++) await SecureStore.setItemAsync(`${clave}.${i}`, valor.slice(i * TROZO, (i + 1) * TROZO));
    await SecureStore.setItemAsync(`${clave}.n`, String(n));
  },
  async removeItem(clave: string) {
    const n = Number(await SecureStore.getItemAsync(`${clave}.n`));
    for (let i = 0; i < n; i++) await SecureStore.deleteItemAsync(`${clave}.${i}`);
    await SecureStore.deleteItemAsync(`${clave}.n`);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      // En web SecureStore no existe; Supabase usa localStorage.
      storage: Platform.OS === 'web' ? undefined : almacenSeguro,
      detectSessionInUrl: false,
    },
  },
);

/** Evento de uso. Es la materia prima de la personalización futura: registrar de más es barato. */
export async function registrarEvento(name: string, properties: Record<string, unknown> = {}) {
  const { error } = await supabase.from('events').insert({ name, properties });
  if (error) console.warn('No se registró el evento', name, error.message);
}
