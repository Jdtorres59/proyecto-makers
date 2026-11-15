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
};

const Contexto = createContext<Estado | null>(null);

export function useSesion() {
  const estado = use(Contexto);
  if (!estado) throw new Error('useSesion se usa dentro de ProveedorSesion');
  return estado;
}

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Session | null | undefined>(undefined);
  const [consentido, setConsentido] = useState<boolean | undefined>(undefined);
  const usuarioId = sesion?.user.id;

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_evento, nueva) => setSesion(nueva));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setConsentido(undefined);
    if (!usuarioId) return;
    supabase
      .from('consents')
      .select('id', { count: 'exact', head: true })
      .eq('text_version', VERSION_CONSENTIMIENTO)
      .then(({ count }) => setConsentido((count ?? 0) > 0));
  }, [usuarioId]);

  async function aceptarConsentimiento() {
    const { error } = await supabase
      .from('consents')
      .insert({ kind: 'tratamiento_datos', text_version: VERSION_CONSENTIMIENTO });
    if (error) throw error;
    setConsentido(true);
  }

  return <Contexto value={{ sesion, consentido, aceptarConsentimiento }}>{children}</Contexto>;
}
