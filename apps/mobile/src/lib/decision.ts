import { type CostoDeuda, costoPagoMinimo, costoPrestamo, costoTarjeta, CUOTAS_PAGO_MINIMO, type DocumentoLeido, formatearCOP } from '@makers/core';

/*
 * Los caminos de "pagar la tarjeta". Todas las cuentas salen de packages/core; aquí solo se arman con lo que
 * se leyó de los papeles. Luca muestra los caminos y su costo; no elige ni recomienda entidades.
 */

export type Papeles = { saldo: number; tasaTarjeta: number; tasaPrestamo: number; seguroMensual: number };

/** "26,50 % E.A." o "26.5%" a 26.5; 0 si no hay número. */
export const tasaDe = (texto: string) => Number(texto.match(/\d+(?:[.,]\d+)?/)?.[0].replace(',', '.') ?? 0);

/** Lo que la decisión necesita, tal como quedó en los renglones del extracto y la oferta. Lo que falte queda en 0. */
export function papelesDesde(extracto: DocumentoLeido | undefined, oferta: DocumentoLeido | undefined): Papeles {
  const renglon = (doc: DocumentoLeido | undefined, ...claves: string[]) => doc?.renglones.find((x) => claves.includes(x.clave));
  return {
    saldo: renglon(extracto, 'saldo_total', 'saldo')?.monto ?? 0,
    tasaTarjeta: tasaDe(renglon(extracto, 'tasa_ea')?.texto ?? ''),
    tasaPrestamo: tasaDe(renglon(oferta, 'tasa_ea')?.texto ?? ''),
    seguroMensual: renglon(oferta, 'seguro')?.monto ?? 0,
  };
}

export type IdCamino = 'minimo' | 'diferir' | 'prestamo' | 'prima';

export type Camino = {
  id: IdCamino;
  nombre: string;
  detalle: string;
  costo: CostoDeuda;
  /** Plata que no es deuda nueva (la prima abonada). Se suma al total. */
  abono: number;
  total: number;
  plazo?: { min: number; max: number; unidad: [string, string] };
};

export function caminos(p: Papeles, plazos: { diferir: number; prestamo: number }, primaDisponible: number): Camino[] {
  const abono = Math.min(primaDisponible, p.saldo);
  const conPrima = costoTarjeta(p.saldo - abono, p.tasaTarjeta, 12);
  const minimo = costoPagoMinimo(p.saldo, p.tasaTarjeta);
  const diferir = costoTarjeta(p.saldo, p.tasaTarjeta, plazos.diferir);
  const prestamo = costoPrestamo(p.saldo, p.tasaPrestamo, plazos.prestamo, p.seguroMensual);
  return [
    { id: 'minimo', nombre: 'Pagar el mínimo', detalle: `La tarjeta lo reparte en ${CUOTAS_PAGO_MINIMO} meses`, costo: minimo, abono: 0, total: minimo.total },
    {
      id: 'diferir',
      nombre: 'Diferir a menos cuotas',
      detalle: `En la tarjeta, a ${plazos.diferir} ${plazos.diferir === 1 ? 'cuota' : 'cuotas'}`,
      costo: diferir,
      abono: 0,
      total: diferir.total,
      plazo: { min: 1, max: 24, unidad: ['cuota', 'cuotas'] },
    },
    {
      id: 'prestamo',
      nombre: 'Pedir el préstamo',
      detalle: `Pagas la tarjeta y le debes al banco, a ${plazos.prestamo} meses`,
      costo: prestamo,
      abono: 0,
      total: prestamo.total,
      plazo: { min: 6, max: 36, unidad: ['mes', 'meses'] },
    },
    {
      id: 'prima',
      nombre: 'Abonar tu prima',
      detalle: `${formatearCOP(abono)} el día de la prima y el resto a 12 cuotas`,
      costo: conPrima,
      abono,
      total: conPrima.total + abono,
    },
  ];
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Mes en que termina de pagar si empieza el mes siguiente a `hoy`. */
export function terminaEn(cuotas: number, hoy: string, corto = false) {
  const [a, m] = hoy.split('-').map(Number);
  const indice = m + cuotas - 1; // primer pago el mes siguiente
  const mes = MESES[indice % 12];
  const año = a + Math.floor(indice / 12);
  return corto ? `${mes.slice(0, 3)} ${año}` : `${mes} de ${año}`;
}
