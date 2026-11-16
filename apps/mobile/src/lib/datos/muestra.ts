import {
  aportesDelEmpleado,
  type DocumentoLeido,
  eventosDePlata,
  formatearCOP,
  netoDelMes,
  type PerfilFinanciero,
  type Renglon,
  type TipoDocumento,
} from '@makers/core';

import type { FuenteDeDatos } from './fuente';
import { modulosPara } from '@makers/contenido';

/*
 * Datos de muestra: el caso ficticio de Valentina del prototipo. Solo se escriben a mano los datos de
 * entrada (lo que diría cada papel); toda cifra derivada sale de packages/core/src/cuentas.ts.
 */

const HOY = '2026-11-15';

/** Lo que trae el desprendible ficticio de noviembre. */
const PAPEL = {
  empresa: 'Logística Andina S.A.S.',
  cargo: 'Analista de compras',
  fechaIngreso: '2026-10-01',
  salario: 3_600_000,
  diaDePago: 30,
} as const;

/** Lo que traen el extracto de la tarjeta y la oferta del préstamo de la decisión. */
export const PAPELES_DECISION = {
  saldo: 2_400_000,
  tasaTarjeta: 26.5,
  tasaPrestamo: 18.9,
  seguroMensual: 4_800,
} as const;

const tasa = (n: number) => `${n.toFixed(2).replace('.', ',')} % E.A.`;
const r = (clave: string, etiqueta: string, texto: string, monto: number | null): Renglon => ({ clave, etiqueta, texto, monto, confianza: 'alta', explicacion: null });

function desprendible(salario: number): DocumentoLeido {
  const { salud, pension, solidaridad } = aportesDelEmpleado(salario, HOY);
  return {
    id: 'muestra-desprendible-nov-2026',
    tipo: 'desprendible',
    titulo: PAPEL.empresa,
    periodo: '1 al 30 de noviembre de 2026',
    subidoEn: `${HOY}T14:20:00.000Z`,
    renglones: [
      r('salario', 'Salario básico', 'Salario básico', salario),
      r('salud', 'Salud', 'Aporte salud 4 %', salud),
      r('pension', 'Pensión', 'Aporte pensión 4 %', pension),
      ...(solidaridad > 0 ? [r('solidaridad', 'Fondo de Solidaridad', 'FSP 1 %', solidaridad)] : []),
      r('neto', 'Neto a pagar', 'Neto a pagar', netoDelMes(salario, HOY)),
    ],
  };
}

const extracto = (): DocumentoLeido => ({
  id: 'muestra-extracto-nov-2026',
  tipo: 'extracto',
  titulo: 'Tarjeta de crédito',
  periodo: 'Extracto de noviembre de 2026',
  subidoEn: `${HOY}T15:02:00.000Z`,
  renglones: [
    r('saldo', 'Saldo total', 'Saldo total', PAPELES_DECISION.saldo),
    r('tasa_ea', 'Tasa de interés', tasa(PAPELES_DECISION.tasaTarjeta), null),
    r('fecha_limite', 'Fecha límite de pago', '12 dic 2026', null),
  ],
});

const oferta = (): DocumentoLeido => ({
  id: 'muestra-oferta-prestamo',
  tipo: 'oferta_credito',
  titulo: 'Préstamo de libre inversión',
  periodo: 'Oferta preaprobada',
  subidoEn: `${HOY}T15:03:00.000Z`,
  renglones: [
    r('monto', 'Monto', 'Monto', PAPELES_DECISION.saldo),
    r('tasa_ea', 'Tasa de interés', tasa(PAPELES_DECISION.tasaPrestamo), null),
    r('plazo', 'Plazo', '6 a 36 meses', null),
    r('seguro', 'Seguro de vida', 'Seguro de vida al mes', PAPELES_DECISION.seguroMensual),
  ],
});

/** Explicación en lenguaje llano de cada renglón, con la cuenta hecha con las cifras del papel. */
function explicar(doc: DocumentoLeido): DocumentoLeido {
  const monto = (clave: string) => doc.renglones.find((x) => x.clave === clave)?.monto ?? 0;
  const c = (n: number) => formatearCOP(n).slice(1);
  const textos: Record<string, string> = {
    salario: 'Lo que pactaste en el contrato por un mes completo. De aquí salen casi todas las demás cuentas: salud, pensión, prima y cesantías.',
    salud: `Va a tu EPS y es lo que te da derecho a citas, exámenes y urgencias. Es el 4 % de tu salario: ${c(monto('salario'))} × 4 % = ${c(monto('salud'))}.`,
    pension: 'Va a tu ahorro para la vejez, a tu nombre. También es el 4 % de tu salario. Tu empresa pone otra parte que no ves en este papel.',
    solidaridad: 'Un aporte extra a pensión que pagan quienes ganan desde cuatro salarios mínimos.',
    neto: `Lo que te consignan: el salario menos los descuentos. ${c(monto('salario'))} − ${c(monto('salud'))} − ${c(monto('pension'))}.`,
    saldo: 'Todo lo que le debes hoy a la tarjeta, incluidas las compras a cuotas que aún no has pagado.',
    tasa_ea: 'Lo que te cobran de interés en un año. Para comparar dos créditos, compara esta tasa y el costo total, no la cuota.',
    fecha_limite: 'Hasta ese día puedes pagar sin que te cobren intereses de mora ni te reporten.',
    monto: 'La plata que te prestan. Con ella pagarías la tarjeta completa.',
    plazo: 'Los meses en que lo pagarías. A más meses la cuota baja, pero el total sube.',
    seguro: 'Un seguro de vida que se suma a cada cuota. Hace que el préstamo cueste más de lo que dice su tasa.',
  };
  return { ...doc, renglones: doc.renglones.map((x) => ({ ...x, explicacion: textos[x.clave] ?? null })) };
}

const esperar = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const PERFIL_VACIO: PerfilFinanciero = {
  nombre: 'Valentina',
  empresa: null,
  cargo: null,
  salario: null,
  diaDePago: null,
  fechaIngreso: null,
  deudas: [],
  meta: null,
  vivienda: null,
};

let guardado: PerfilFinanciero = PERFIL_VACIO;

export const fuenteDeMuestra: FuenteDeDatos = {
  hoy: () => HOY,
  perfil: async () => guardado,
  guardarPerfil: async (perfil) => {
    guardado = perfil;
  },
  leerDocumento: async (tipo, perfil) => {
    await esperar(300);
    if (tipo === 'extracto') return extracto();
    if (tipo === 'oferta_credito') return oferta();
    return desprendible(perfil.salario ?? PAPEL.salario);
  },
  explicarDocumento: async (doc) => {
    await esperar(300);
    return explicar(doc);
  },
  eventos: async (perfil) => eventosDePlata(perfil, HOY),
  modulos: async (perfil) => modulosPara(perfil, HOY),
  borrarTodo: async () => {
    guardado = PERFIL_VACIO;
  },
};

/** Lo que el desprendible le enseña a Luca del perfil. */
export function perfilDesdeDesprendible(perfil: PerfilFinanciero, doc: DocumentoLeido): PerfilFinanciero {
  const salario = doc.renglones.find((x) => x.clave === 'salario')?.monto ?? perfil.salario;
  return { ...perfil, empresa: doc.titulo, cargo: PAPEL.cargo, fechaIngreso: PAPEL.fechaIngreso, diaDePago: PAPEL.diaDePago, salario };
}

/** Datos de entrada para las preguntas del celular a cuotas (lo que la persona contaría). */
export const CELULAR_DE_MUESTRA = { cuotaMensual: 186_000, cuotasRestantes: 3, diaDePago: 5 } as const;

/** Archivos que ofrece la hoja de subir mientras no hay selector real. */
export const ARCHIVOS_DE_MUESTRA: { tipo: TipoDocumento; nombre: string; donde: string }[] = [
  { tipo: 'extracto', nombre: 'extracto-nov-2026.pdf', donde: 'Descargas · hoy' },
  { tipo: 'oferta_credito', nombre: 'oferta-prestamo.pdf', donde: 'Correo · ayer' },
];
