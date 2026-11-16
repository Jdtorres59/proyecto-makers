import {
  aportesDelEmpleado,
  type DocumentoLeido,
  eventosDePlata,
  netoDelMes,
  type PerfilFinanciero,
  type Renglon,
} from '@makers/core';

import type { FuenteDeDatos } from './fuente';

/*
 * Datos de muestra: el caso ficticio de Valentina del prototipo. Solo se escriben a mano los datos de
 * entrada (lo que diría el papel); toda cifra derivada sale de packages/core/src/cuentas.ts.
 */

const HOY = '2026-11-15';

/** Lo que trae el desprendible ficticio de noviembre. */
const PAPEL = {
  nombre: 'Valentina Rojas Méndez',
  empresa: 'Logística Andina S.A.S.',
  cargo: 'Analista de compras',
  fechaIngreso: '2026-10-01',
  salario: 3_600_000,
  diaDePago: 30,
} as const;

function documentoDeMuestra(): DocumentoLeido {
  const { salud, pension, solidaridad } = aportesDelEmpleado(PAPEL.salario, HOY);
  const renglones: Renglon[] = [
    { clave: 'salario', etiqueta: 'Salario básico', texto: 'Salario básico', monto: PAPEL.salario, confianza: 'alta', explicacion: null },
    { clave: 'salud', etiqueta: 'Salud', texto: 'Aporte salud 4 %', monto: salud, confianza: 'alta', explicacion: null },
    { clave: 'pension', etiqueta: 'Pensión', texto: 'Aporte pensión 4 %', monto: pension, confianza: 'alta', explicacion: null },
    ...(solidaridad > 0
      ? [{ clave: 'solidaridad', etiqueta: 'Fondo de Solidaridad', texto: 'FSP 1 %', monto: solidaridad, confianza: 'alta', explicacion: null } as const]
      : []),
    { clave: 'neto', etiqueta: 'Neto a pagar', texto: 'Neto a pagar', monto: netoDelMes(PAPEL.salario, HOY), confianza: 'alta', explicacion: null },
  ];
  return {
    id: 'muestra-desprendible-nov-2026',
    tipo: 'desprendible',
    titulo: PAPEL.empresa,
    periodo: '1 al 30 de noviembre de 2026',
    subidoEn: `${HOY}T14:20:00.000Z`,
    renglones,
  };
}

let guardado: PerfilFinanciero = {
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

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const fuenteDeMuestra: FuenteDeDatos = {
  hoy: () => HOY,
  perfil: async () => guardado,
  guardarPerfil: async (perfil) => {
    guardado = perfil;
  },
  leerDesprendible: async () => {
    await esperar(400);
    return documentoDeMuestra();
  },
  eventos: async (perfil) => eventosDePlata(perfil, HOY),
};

/** Lo que el desprendible le enseña a Luca del perfil. */
export function perfilDesdeDesprendible(perfil: PerfilFinanciero, doc: DocumentoLeido): PerfilFinanciero {
  const salario = doc.renglones.find((r) => r.clave === 'salario')?.monto ?? perfil.salario;
  return {
    ...perfil,
    empresa: doc.titulo,
    cargo: PAPEL.cargo,
    fechaIngreso: PAPEL.fechaIngreso,
    diaDePago: PAPEL.diaDePago,
    salario,
  };
}

/** Datos de entrada para las preguntas del celular a cuotas (lo que la persona contaría). */
export const CELULAR_DE_MUESTRA = { cuotaMensual: 186_000, cuotasRestantes: 3, diaDePago: 5 } as const;
