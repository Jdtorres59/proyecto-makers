import type { Session } from '@supabase/supabase-js';
import { createContext, type ReactNode, use, useEffect, useState } from 'react';

import { supabase } from './supabase';

/** Versión del texto de autorización que se muestra. Al cambiar el texto, cambia la versión. */
export const VERSION_CONSENTIMIENTO = 'borrador-1';

type Estado = {
  /** undefined mientras carga. */
  sesion: Session | null | undefined;
  consentido: boolean | undefined;
  aceptarConsentimiento(): Promise<void>;
  salir(): Promise<void>;
  /** true en el modo demostración: sesión local, sin cuenta, con los datos ficticios de Valentina. */
  deMuestra: boolean;
  /** Entra al modo demostración. Solo existe si DEMO_DISPONIBLE. */
  entrarDeMuestra?: () => void;
};

/** El modo demostración se habilita con EXPO_PUBLIC_MODO_DEMO=si (siempre en desarrollo). */
export const DEMO_DISPONIBLE = __DEV__ || process.env.EXPO_PUBLIC_MODO_DEMO === 'si';

const Contexto = createContext<Estado | null>(null);

export function useSesion() {
  const estado = use(Contexto);
  if (!estado) throw new Error('useSesion se usa dentro de ProveedorSesion');
  return estado;
}

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Session | null | undefined>(undefined);
  // Respuesta de la base por usuario: así un cambio de cuenta no hereda la del anterior.
  const [consentimiento, setConsentimiento] = useState<{ usuario: string; valor: boolean }>();
  const [consentidoDeMuestra, setConsentidoDeMuestra] = useState(false);
  const [deMuestra, setDeMuestra] = useState(false);
  const usuarioId = deMuestra ? undefined : sesion?.user.id;

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_evento, nueva) => setSesion(nueva));
    return () => data.subscription.unsubscribe();
  }, []);

  const consentido = deMuestra ? consentidoDeMuestra : consentimiento && consentimiento.usuario === usuarioId ? consentimiento.valor : undefined;

  useEffect(() => {
    if (!usuarioId) return;
    supabase
      .from('consents')
      .select('id', { count: 'exact', head: true })
      .eq('text_version', VERSION_CONSENTIMIENTO)
      .then(({ count }) => setConsentimiento({ usuario: usuarioId, valor: (count ?? 0) > 0 }));
  }, [usuarioId]);

  async function aceptarConsentimiento() {
    if (deMuestra) return setConsentidoDeMuestra(true);
    const { error } = await supabase
      .from('consents')
      .insert({ kind: 'tratamiento_datos', text_version: VERSION_CONSENTIMIENTO });
    if (error) throw error;
    if (usuarioId) setConsentimiento({ usuario: usuarioId, valor: true });
  }

  async function salir() {
    if (deMuestra) {
      setDeMuestra(false);
      setSesion(null);
      return;
    }
    await supabase.auth.signOut();
  }

  // Sesión falsa y local: nunca toca Supabase. No existe si el modo demostración no está habilitado.
  const entrarDeMuestra = DEMO_DISPONIBLE
    ? () => {
        setDeMuestra(true);
        setConsentidoDeMuestra(false);
        setSesion({ user: { id: 'muestra' } } as Session);
      }
    : undefined;

  return <Contexto value={{ sesion, consentido, aceptarConsentimiento, salir, deMuestra, entrarDeMuestra }}>{children}</Contexto>;
}
