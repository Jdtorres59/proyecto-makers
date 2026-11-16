import type { Decision, DocumentoLeido, EventoDePlata, Modulo, PerfilFinanciero, Progreso, TipoDocumento } from '@makers/core';
import { createContext, type ReactNode, use, useEffect, useState } from 'react';

import type { FuenteDeDatos } from './fuente';
import { fuenteDeMuestra, perfilDesdeDesprendible } from './muestra';

// Paso 5: cambiar por la fuente que llama a la API. Las pantallas no se enteran.
const fuente: FuenteDeDatos = fuenteDeMuestra;

/** Un destino del plan de la prima. */
export type Destino = { id: string; nombre: string; monto: number };

/** Lo que la pantalla de cierre y "Lo que viene" necesitan de la decisión además del contrato `Decision`. */
export type ResumenDecision = { total: number; primeraCuota: number; cuotas: number; abono: number };

type Estado = {
  hoy: string;
  /** undefined mientras carga. */
  perfil: PerfilFinanciero | undefined;
  documentos: DocumentoLeido[];
  /** El desprendible leído en la bienvenida, si lo hay. */
  documento: DocumentoLeido | null;
  eventos: EventoDePlata[];
  modulos: Modulo[];
  progreso: Progreso;
  planPrima: Destino[] | null;
  decision: (Decision & { resumen: ResumenDecision }) | null;
  /** true cuando la persona terminó la bienvenida y ve su inicio. */
  bienvenidaLista: boolean;
  leerDesprendible(): Promise<void>;
  leerDocumento(tipo: TipoDocumento): Promise<DocumentoLeido>;
  explicarDocumento(id: string): Promise<void>;
  actualizarPerfil(cambios: Partial<PerfilFinanciero>): void;
  terminarBienvenida(): void;
  terminarLeccion(id: string): void;
  ganarMedalla(modulo: string): void;
  guardarPlanPrima(plan: Destino[]): void;
  guardarDecision(decision: Decision & { resumen: ResumenDecision }): void;
  borrarTodo(): Promise<void>;
  /** Solo en desarrollo: muestra desbloqueados los módulos con `publicado: false` para poder recorrerlos. */
  verBorradores: boolean;
  alternarBorradores?: () => void;
};

const Contexto = createContext<Estado | null>(null);

export function useLuca() {
  const estado = use(Contexto);
  if (!estado) throw new Error('useLuca se usa dentro de ProveedorLuca');
  return estado;
}

const PROGRESO_VACIO: Progreso = { leccionesTerminadas: [], medallas: [] };
const sinRepetir = (lista: string[], id: string) => (lista.includes(id) ? lista : [...lista, id]);

/** Día 15 del mes siguiente: primera cuota de una decisión de deuda. */
function primeraCuotaDesde(hoy: string) {
  const [a, m] = hoy.split('-').map(Number);
  return m === 12 ? `${a + 1}-01-15` : `${a}-${String(m + 1).padStart(2, '0')}-15`;
}

export function ProveedorLuca({ children }: { children: ReactNode }) {
  const hoy = fuente.hoy();
  const [perfil, setPerfil] = useState<PerfilFinanciero>();
  const [documentos, setDocumentos] = useState<DocumentoLeido[]>([]);
  const [eventosBase, setEventos] = useState<EventoDePlata[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [progreso, setProgreso] = useState<Progreso>(PROGRESO_VACIO);
  const [planPrima, setPlanPrima] = useState<Destino[] | null>(null);
  const [decision, setDecision] = useState<Estado['decision']>(null);
  const [bienvenidaLista, setBienvenidaLista] = useState(false);
  const [verBorradores, setVerBorradores] = useState(__DEV__);

  useEffect(() => {
    fuente.perfil().then(setPerfil);
  }, []);

  useEffect(() => {
    if (!perfil) return;
    fuente.guardarPerfil(perfil);
    fuente.eventos(perfil).then(setEventos);
    fuente.modulos(perfil).then(setModulos);
  }, [perfil]);

  const agregarDocumento = (doc: DocumentoLeido) => setDocumentos((ds) => [doc, ...ds.filter((d) => d.id !== doc.id)]);

  const eventos: EventoDePlata[] = decision
    ? [...eventosBase, { fecha: primeraCuotaDesde(hoy), tipo: 'decision' as const, titulo: decision.caminoElegido ?? 'Tu decisión', monto: decision.resumen.primeraCuota, sentido: 'sale' as const }].sort((x, y) =>
        x.fecha < y.fecha ? -1 : x.fecha > y.fecha ? 1 : 0,
      )
    : eventosBase;

  const valor: Estado = {
    hoy,
    perfil,
    documentos,
    documento: documentos.find((d) => d.tipo === 'desprendible') ?? null,
    eventos,
    modulos,
    progreso,
    planPrima,
    decision,
    bienvenidaLista,
    async leerDesprendible() {
      if (!perfil) return;
      const doc = await fuente.leerDocumento('desprendible', perfil);
      agregarDocumento(doc);
      setPerfil((p) => p && perfilDesdeDesprendible(p, doc));
    },
    async leerDocumento(tipo) {
      const doc = await fuente.leerDocumento(tipo, perfil!);
      agregarDocumento(doc);
      return doc;
    },
    async explicarDocumento(id) {
      const doc = documentos.find((d) => d.id === id);
      if (!doc || doc.renglones.every((x) => x.explicacion)) return;
      agregarDocumento(await fuente.explicarDocumento(doc));
    },
    actualizarPerfil: (cambios) => setPerfil((p) => p && { ...p, ...cambios }),
    terminarBienvenida: () => setBienvenidaLista(true),
    terminarLeccion: (id) => setProgreso((p) => ({ ...p, leccionesTerminadas: sinRepetir(p.leccionesTerminadas, id) })),
    ganarMedalla: (modulo) => setProgreso((p) => ({ ...p, medallas: sinRepetir(p.medallas, modulo) })),
    guardarPlanPrima: setPlanPrima,
    guardarDecision: setDecision,
    async borrarTodo() {
      await fuente.borrarTodo();
      setDocumentos([]);
      setProgreso(PROGRESO_VACIO);
      setPlanPrima(null);
      setDecision(null);
      setPerfil(await fuente.perfil());
      setBienvenidaLista(false);
    },
    verBorradores: __DEV__ && verBorradores,
    alternarBorradores: __DEV__ ? () => setVerBorradores((v) => !v) : undefined,
  };
  return <Contexto value={valor}>{children}</Contexto>;
}

/** Etapa de crecimiento de Luca según módulos terminados (DESIGN.md): 0, 1 a 3, 4 a 7, 8 a 11, 12. */
export function etapaDeCrecimiento(terminados: number) {
  const etapas = ['0-semilla', '1-brote', '2-plantula', '3-arbolito', '4-arbol'] as const;
  return etapas[terminados === 0 ? 0 : terminados <= 3 ? 1 : terminados <= 7 ? 2 : terminados <= 11 ? 3 : 4];
}

/** Un módulo está terminado cuando ganó la medalla (cumplió su acción) y terminó todas sus lecciones. */
export function moduloTerminado(m: Modulo, p: Progreso) {
  return p.medallas.includes(m.id) && m.lecciones.every((l) => p.leccionesTerminadas.includes(l.id));
}

/** Se puede abrir si está publicado, o si en desarrollo se pidió ver borradores. */
export const moduloAbierto = (m: Modulo, verBorradores: boolean) => m.publicado || (verBorradores && m.lecciones.length > 0);
