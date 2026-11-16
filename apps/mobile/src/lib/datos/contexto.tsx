import type { Decision, DocumentoLeido, EventoDePlata, EventoIA, Modulo, PerfilFinanciero, Progreso } from '@makers/core';
import { createContext, type ReactNode, use, useCallback, useEffect, useState } from 'react';

import { fuenteDeApi } from './api';
import { comoProblema, type ProblemaLuca } from './errores';
import type { Archivo, Cierre, FuenteDeDatos, Turno } from './fuente';
import { fuenteDeMuestra, perfilDesdeDesprendible, reiniciarMuestra } from './muestra';

/** Un destino del plan de la prima. */
export type Destino = { id: string; nombre: string; monto: number };

/** Lo que la pantalla de cierre y "Lo que viene" necesitan de la decisión además del contrato `Decision`. */
export type ResumenDecision = { total: number; primeraCuota: number; cuotas: number; abono: number };

type Estado = {
  /** true en el modo demostración (datos ficticios, sin cuenta). */
  demo: boolean;
  hoy: string;
  /** Carga inicial: 'cargando', 'listo' o el problema que la impidió. */
  carga: 'cargando' | 'listo' | ProblemaLuca;
  recargar(): void;
  perfil: PerfilFinanciero | undefined;
  /** Si el último guardado del perfil falló, el problema; se limpia al guardar bien. */
  problemaGuardado: ProblemaLuca | null;
  documentos: DocumentoLeido[];
  /** El desprendible más reciente, si lo hay. */
  documento: DocumentoLeido | null;
  eventos: EventoDePlata[];
  modulos: Modulo[];
  progreso: Progreso;
  planPrima: Destino[] | null;
  decision: (Decision & { resumen: ResumenDecision }) | null;
  /** La decisión abierta (creada y sin cerrar) y los dos papeles que la persona subió para ella. */
  decisionEnCurso: Decision | null;
  papeles: { extracto: string | null; oferta: string | null };
  /** Archivo elegido en "conocerte" que la pantalla de lectura va a leer. */
  archivoPendiente: Archivo | null;
  bienvenidaLista: boolean;
  elegirArchivo(a: Archivo | null): void;
  /** Lee el desprendible pendiente y aprende de él lo que pueda (en la demo, el papel ficticio trae todo). */
  leerDesprendible(): Promise<DocumentoLeido>;
  leerDocumento(archivo: Archivo): Promise<DocumentoLeido>;
  explicarDocumento(id: string): Promise<void>;
  /** La persona corrige un monto que Luca leyó. Si es el salario, también cambia el perfil. */
  corregirRenglon(docId: string, clave: string, monto: number): void;
  actualizarPerfil(cambios: Partial<PerfilFinanciero>): Promise<void>;
  terminarBienvenida(): void;
  terminarLeccion(id: string): void;
  ganarMedalla(modulo: string): void;
  guardarPlanPrima(plan: Destino[]): void;
  iniciarDecision(pregunta: string): Promise<Decision>;
  /** `decisionId` explícito: justo después de crearla, el estado todavía no se actualizó. */
  conversar(decisionId: string, mensaje: string, historial: Turno[], alEvento: (e: EventoIA) => void): Promise<void>;
  guardarPapel(cual: 'extracto' | 'oferta', docId: string): void;
  cerrarDecision(cierre: Cierre, resumen: ResumenDecision): Promise<void>;
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
const CLAVES_SALARIO = ['salario_basico', 'salario'];

/** Día 15 del mes siguiente: primera cuota de una decisión de deuda. */
function primeraCuotaDesde(hoy: string) {
  const [a, m] = hoy.split('-').map(Number);
  return m === 12 ? `${a + 1}-01-15` : `${a}-${String(m + 1).padStart(2, '0')}-15`;
}

/**
 * Estado de Luca para una sesión. `activo` en false (sin sesión o sin autorización) no carga nada.
 * Se monta de nuevo al cambiar de persona o de modo (el layout le pone `key`), así nada se cruza.
 */
export function ProveedorLuca({ children, demo, activo }: { children: ReactNode; demo: boolean; activo: boolean }) {
  const fuente: FuenteDeDatos = demo ? fuenteDeMuestra : fuenteDeApi;
  const hoy = fuente.hoy();
  const [carga, setCarga] = useState<Estado['carga']>('cargando');
  const [intento, setIntento] = useState(0);
  const [perfil, setPerfil] = useState<PerfilFinanciero>();
  const [problemaGuardado, setProblemaGuardado] = useState<ProblemaLuca | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoLeido[]>([]);
  const [eventosBase, setEventos] = useState<EventoDePlata[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [progreso, setProgreso] = useState<Progreso>(PROGRESO_VACIO);
  const [planPrima, setPlanPrima] = useState<Destino[] | null>(null);
  const [decision, setDecision] = useState<Estado['decision']>(null);
  const [decisionEnCurso, setDecisionEnCurso] = useState<Decision | null>(null);
  const [papeles, setPapeles] = useState<Estado['papeles']>({ extracto: null, oferta: null });
  const [archivoPendiente, setArchivoPendiente] = useState<Archivo | null>(null);
  const [bienvenidaLista, setBienvenidaLista] = useState(false);
  const [verBorradores, setVerBorradores] = useState(__DEV__);

  const refrescarDerivados = useCallback(
    async (p: PerfilFinanciero) => {
      const [ev, mods] = await Promise.all([fuente.eventos(p), fuente.modulos(p)]);
      setEventos(ev);
      setModulos(mods);
    },
    [fuente],
  );

  useEffect(() => {
    if (!activo) return;
    let vigente = true;
    if (demo) reiniciarMuestra();
    (async () => {
      try {
        const [p, docs, prog] = await Promise.all([fuente.perfil(), fuente.documentos(), fuente.progreso()]);
        const [ev, mods] = await Promise.all([fuente.eventos(p), fuente.modulos(p)]);
        if (!vigente) return;
        setPerfil(p);
        setDocumentos(docs);
        setProgreso(prog);
        setEventos(ev);
        setModulos(mods);
        // Quien ya le contó su salario a Luca no repite la bienvenida.
        setBienvenidaLista(!demo && p.salario !== null);
        setCarga('listo');
      } catch (e) {
        if (vigente) setCarga(comoProblema(e));
      }
    })();
    return () => {
      vigente = false;
    };
  }, [activo, demo, fuente, intento]);

  const agregarDocumento = (doc: DocumentoLeido) => setDocumentos((ds) => [doc, ...ds.filter((d) => d.id !== doc.id)]);

  const guardarPerfil = async (nuevo: PerfilFinanciero) => {
    setPerfil(nuevo);
    try {
      await fuente.guardarPerfil(nuevo);
      setProblemaGuardado(null);
      await refrescarDerivados(nuevo);
    } catch (e) {
      setProblemaGuardado(comoProblema(e));
    }
  };

  const eventos: EventoDePlata[] = decision
    ? [...eventosBase, { fecha: primeraCuotaDesde(hoy), tipo: 'decision' as const, titulo: decision.caminoElegido ?? 'Tu decisión', monto: decision.resumen.primeraCuota, sentido: 'sale' as const }].sort((x, y) =>
        x.fecha < y.fecha ? -1 : x.fecha > y.fecha ? 1 : 0,
      )
    : eventosBase;

  const valor: Estado = {
    demo,
    hoy,
    carga: activo ? carga : 'listo',
    recargar: () => (setCarga('cargando'), setIntento((n) => n + 1)),
    perfil,
    problemaGuardado,
    documentos,
    documento: documentos.find((d) => d.tipo === 'desprendible') ?? null,
    eventos,
    modulos,
    progreso,
    planPrima,
    decision,
    decisionEnCurso,
    papeles,
    archivoPendiente,
    bienvenidaLista,
    elegirArchivo: setArchivoPendiente,
    async leerDesprendible() {
      const archivo = archivoPendiente ?? { uri: '', nombre: 'desprendible', mime: 'application/pdf', pista: 'desprendible' as const };
      const doc = await fuente.leerDocumento(archivo);
      agregarDocumento(doc);
      if (perfil) {
        // Con datos reales solo se toma el salario; empresa, día de pago e ingreso los confirma la persona.
        const salario = doc.renglones.find((x) => CLAVES_SALARIO.includes(x.clave))?.monto ?? perfil.salario;
        await guardarPerfil(demo ? perfilDesdeDesprendible(perfil, doc) : { ...perfil, salario });
      }
      return doc;
    },
    async leerDocumento(archivo) {
      const doc = await fuente.leerDocumento(archivo);
      agregarDocumento(doc);
      return doc;
    },
    async explicarDocumento(id) {
      const doc = documentos.find((d) => d.id === id);
      if (!doc || doc.renglones.every((x) => x.explicacion)) return;
      agregarDocumento(await fuente.explicarDocumento(doc));
    },
    corregirRenglon(docId, clave, monto) {
      setDocumentos((ds) =>
        ds.map((d) => (d.id === docId ? { ...d, renglones: d.renglones.map((r) => (r.clave === clave ? { ...r, monto, texto: r.texto, confianza: 'alta' as const } : r)) } : d)),
      );
      if (CLAVES_SALARIO.includes(clave) && perfil) guardarPerfil({ ...perfil, salario: monto });
    },
    actualizarPerfil: async (cambios) => {
      if (perfil) await guardarPerfil({ ...perfil, ...cambios });
    },
    terminarBienvenida: () => setBienvenidaLista(true),
    terminarLeccion(id) {
      setProgreso((p) => ({ ...p, leccionesTerminadas: sinRepetir(p.leccionesTerminadas, id) }));
      fuente.sumarProgreso({ leccionesTerminadas: [id], medallas: [] }).then(setProgreso, () => {});
    },
    ganarMedalla(modulo) {
      setProgreso((p) => ({ ...p, medallas: sinRepetir(p.medallas, modulo) }));
      fuente.sumarProgreso({ leccionesTerminadas: [], medallas: [modulo] }).then(setProgreso, () => {});
    },
    // shortcut: el plan de la prima vive solo en el teléfono; la API no tiene dónde guardarlo todavía.
    guardarPlanPrima: setPlanPrima,
    async iniciarDecision(pregunta) {
      const d = await fuente.crearDecision(pregunta);
      setDecisionEnCurso(d);
      setPapeles({ extracto: null, oferta: null });
      return d;
    },
    async conversar(decisionId, mensaje, historial, alEvento) {
      await fuente.conversar(decisionId, mensaje, historial, [papeles.extracto, papeles.oferta].filter((x) => x !== null), alEvento);
    },
    guardarPapel: (cual, docId) => setPapeles((p) => ({ ...p, [cual]: docId })),
    async cerrarDecision(cierre, resumen) {
      if (!decisionEnCurso) return;
      const cerrada = await fuente.cerrarDecision(decisionEnCurso.id, cierre);
      setDecision({ ...cerrada, resumen });
      setDecisionEnCurso(null);
    },
    async borrarTodo() {
      await fuente.borrarTodo();
      setDocumentos([]);
      setProgreso(PROGRESO_VACIO);
      setPlanPrima(null);
      setDecision(null);
      setDecisionEnCurso(null);
      const p = await fuente.perfil();
      setPerfil(p);
      await refrescarDerivados(p);
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
