import type { DocumentoLeido, EventoDePlata, PerfilFinanciero } from '@makers/core';
import { createContext, type ReactNode, use, useEffect, useState } from 'react';

import type { FuenteDeDatos } from './fuente';
import { fuenteDeMuestra, perfilDesdeDesprendible } from './muestra';

// Paso 5: cambiar por la fuente que llama a la API. Las pantallas no se enteran.
const fuente: FuenteDeDatos = fuenteDeMuestra;

type Estado = {
  hoy: string;
  /** undefined mientras carga. */
  perfil: PerfilFinanciero | undefined;
  documento: DocumentoLeido | null;
  eventos: EventoDePlata[];
  /** true cuando la persona terminó la bienvenida y ve su inicio. */
  bienvenidaLista: boolean;
  leerDesprendible(): Promise<void>;
  actualizarPerfil(cambios: Partial<PerfilFinanciero>): void;
  terminarBienvenida(): void;
};

const Contexto = createContext<Estado | null>(null);

export function useLuca() {
  const estado = use(Contexto);
  if (!estado) throw new Error('useLuca se usa dentro de ProveedorLuca');
  return estado;
}

export function ProveedorLuca({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<PerfilFinanciero>();
  const [documento, setDocumento] = useState<DocumentoLeido | null>(null);
  const [eventos, setEventos] = useState<EventoDePlata[]>([]);
  const [bienvenidaLista, setBienvenidaLista] = useState(false);

  useEffect(() => {
    fuente.perfil().then(setPerfil);
  }, []);

  useEffect(() => {
    if (!perfil) return;
    fuente.guardarPerfil(perfil);
    fuente.eventos(perfil).then(setEventos);
  }, [perfil]);

  const valor: Estado = {
    hoy: fuente.hoy(),
    perfil,
    documento,
    eventos,
    bienvenidaLista,
    async leerDesprendible() {
      const doc = await fuente.leerDesprendible();
      setDocumento(doc);
      setPerfil((p) => p && perfilDesdeDesprendible(p, doc));
    },
    actualizarPerfil: (cambios) => setPerfil((p) => p && { ...p, ...cambios }),
    terminarBienvenida: () => setBienvenidaLista(true),
  };
  return <Contexto value={valor}>{children}</Contexto>;
}
