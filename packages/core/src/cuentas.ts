import { consultarNorma } from "@makers/conocimiento";
import { aplicarPorcentaje, type Pesos, pesos } from "./dinero";
import type { EventoDePlata, PerfilFinanciero } from "./esquemas";

/*
 * Cuentas de plata de Luca. Funciones puras: mismas entradas, mismo resultado.
 * Las cifras legales salen de @makers/conocimiento en la fecha de la cuenta; si no hay norma vigente, lanzan.
 * Fechas "AAAA-MM-DD". Plata entera en pesos.
 */

function norma(clave: string, fecha: string): number {
  const n = consultarNorma(clave, fecha);
  if (!n) throw new Error(`No hay una norma vigente "${clave}" al ${fecha}`);
  return n.valor;
}

// ---------- Fechas ----------

const partes = (fecha: string) => fecha.split("-").map(Number) as [number, number, number];
const ultimoDia = (año: number, mes: number) => new Date(Date.UTC(año, mes, 0)).getUTCDate();
const dd = (n: number) => String(n).padStart(2, "0");
/** Fecha con el día recortado al último del mes (un 31 en noviembre queda en 30). */
const fecha = (año: number, mes: number, dia: number) => `${año}-${dd(mes)}-${dd(Math.min(dia, ultimoDia(año, mes)))}`;

/**
 * Días entre dos fechas, ambas incluidas, en año comercial de 360 días (meses de 30), como se
 * liquidan prima y cesantías. El 31 cuenta como 30 y el último día de febrero también.
 */
export function dias360(desde: string, hasta: string): number {
  const [a1, m1, d1] = partes(desde);
  const [a2, m2, d2] = partes(hasta);
  const ajustar = (a: number, m: number, d: number) => (d === ultimoDia(a, m) ? 30 : Math.min(d, 30));
  return (a2 - a1) * 360 + (m2 - m1) * 30 + ajustar(a2, m2, d2) - ajustar(a1, m1, d1) + 1;
}

/** Días trabajados dentro de un periodo, contando desde la fecha de ingreso si fue después de que empezó. */
export function diasTrabajados(fechaIngreso: string, desde: string, hasta: string): number {
  const inicio = fechaIngreso > desde ? fechaIngreso : desde;
  return inicio > hasta ? 0 : dias360(inicio, hasta);
}

// ---------- Sueldo ----------

export type Aportes = { salud: Pesos; pension: Pesos; solidaridad: Pesos };

/** Lo que se le descuenta al empleado por salud, pensión y Fondo de Solidaridad Pensional. */
export function aportesDelEmpleado(salario: Pesos, fecha: string): Aportes {
  const smmlv = norma("smmlv", fecha);
  // shortcut: desde 16 SMMLV hay un aporte escalonado que no está en conocimiento; cargarlo si llega alguien con ese salario.
  if (salario >= 16 * smmlv) throw new RangeError("El neto por encima de 16 salarios mínimos no está implementado");
  return {
    salud: aplicarPorcentaje(salario, norma("aporte_salud_empleado", fecha)),
    pension: aplicarPorcentaje(salario, norma("aporte_pension_empleado", fecha)),
    solidaridad: salario >= 4 * smmlv ? aplicarPorcentaje(salario, norma("fondo_solidaridad_pensional", fecha)) : 0,
  };
}

/**
 * Neto del mes: salario menos los aportes del empleado. No incluye auxilio de transporte,
 * retención en la fuente ni otros descuentos (libranzas, embargos): el desprendible real manda.
 */
export function netoDelMes(salario: Pesos, fecha: string): Pesos {
  const { salud, pension, solidaridad } = aportesDelEmpleado(salario, fecha);
  return pesos(salario) - salud - pension - solidaridad;
}

/** true si el salario da derecho a auxilio de transporte (hasta 2 SMMLV): el auxilio cambia neto, prima y cesantías. */
export function tieneAuxilioDeTransporte(salario: Pesos, fecha: string): boolean {
  return salario <= 2 * norma("smmlv", fecha);
}

// ---------- Prestaciones ----------

/** Salario × días ÷ 360. Así se liquidan la prima (por semestre) y las cesantías (por año). */
const proporcional = (salario: Pesos, dias: number) => Math.round((pesos(salario) * dias) / 360);

/** Prima de servicios: 30 días de salario por año, pagada por semestre (CST art. 306). */
export const prima = (salario: Pesos, diasDelSemestre: number): Pesos => proporcional(salario, diasDelSemestre);

/** Cesantías: un mes de salario por año (CST art. 249). */
export const cesantias = (salario: Pesos, diasDelAño: number): Pesos => proporcional(salario, diasDelAño);

/** Intereses de cesantías: tasa anual proporcional a los días del año liquidado. */
export function interesesDeCesantias(cesantiasDelAño: Pesos, diasDelAño: number, fecha: string): Pesos {
  return Math.round((pesos(cesantiasDelAño) * norma("intereses_cesantias_tasa", fecha) * diasDelAño) / 36_000);
}

// ---------- Deudas ----------

export type CostoDeuda = { cuotas: number; primeraCuota: Pesos; intereses: Pesos; seguro: Pesos; total: Pesos };

/** Tasa mensual equivalente a una efectiva anual en porcentaje. 26.5 -> 0,01978... */
export const tasaMensual = (tasaEA: number) => (1 + tasaEA / 100) ** (1 / 12) - 1;

/**
 * Tarjeta de crédito diferida a n cuotas: abono fijo a capital más intereses sobre el saldo que queda.
 * A una cuota no cobra intereses. La primera cuota es la más alta.
 */
export function costoTarjeta(saldo: Pesos, tasaEA: number, cuotas: number): CostoDeuda {
  if (!Number.isInteger(cuotas) || cuotas < 1) throw new RangeError(`Cuotas inválidas: ${cuotas}`);
  pesos(saldo);
  if (cuotas === 1) return { cuotas, primeraCuota: saldo, intereses: 0, seguro: 0, total: saldo };
  const i = tasaMensual(tasaEA);
  const intereses = Math.round((i * saldo * (cuotas + 1)) / 2);
  return { cuotas, primeraCuota: Math.round(saldo / cuotas + i * saldo), intereses, seguro: 0, total: saldo + intereses };
}

/**
 * Plazo con el que se modela "pagar solo el mínimo". Es el supuesto del prototipo: el mínimo real
 * lo fija cada banco y sale del extracto.
 */
export const CUOTAS_PAGO_MINIMO = 36;

export const costoPagoMinimo = (saldo: Pesos, tasaEA: number) => costoTarjeta(saldo, tasaEA, CUOTAS_PAGO_MINIMO);

/** Préstamo de cuota fija (sistema francés) con un seguro fijo cada mes. La cuota incluye el seguro. */
export function costoPrestamo(monto: Pesos, tasaEA: number, meses: number, seguroMensual: Pesos = 0): CostoDeuda {
  if (!Number.isInteger(meses) || meses < 1) throw new RangeError(`Meses inválidos: ${meses}`);
  const i = tasaMensual(tasaEA);
  const capitalEIntereses = i === 0 ? pesos(monto) / meses : (pesos(monto) * i) / (1 - (1 + i) ** -meses);
  const cuota = Math.round(capitalEIntereses) + pesos(seguroMensual);
  const total = cuota * meses;
  const seguro = seguroMensual * meses;
  return { cuotas: meses, primeraCuota: cuota, intereses: total - monto - seguro, seguro, total };
}

/** Qué porcentaje del sueldo neto se va en cuotas, redondeado a entero. */
export function porcentajeDelSueldo(cuotas: Pesos, neto: Pesos): number {
  if (neto <= 0) throw new RangeError("El neto debe ser mayor que cero");
  return Math.round((pesos(cuotas) / pesos(neto)) * 100);
}

// ---------- Lo que viene ----------

/**
 * Lo próximo que le pasa a la plata de la persona desde hoy (incluido): el siguiente sueldo, prima,
 * intereses de cesantías, cesantías y la siguiente cuota de cada deuda con día de pago. Ordenado por fecha.
 * Prima y cesantías se proyectan al final del periodo, suponiendo que sigue en el mismo trabajo.
 * Si el salario da derecho a auxilio de transporte, los montos van en null: sin la norma del auxilio no se pueden calcular bien.
 */
export function eventosDePlata(perfil: PerfilFinanciero, hoy: string): EventoDePlata[] {
  const eventos: EventoDePlata[] = [];
  const [año] = partes(hoy);
  const { salario, fechaIngreso, diaDePago } = perfil;
  // shortcut: sin la norma del auxilio de transporte no hay montos para salarios hasta 2 SMMLV; cargarla y sumarla.
  const conMonto = salario !== null && !tieneAuxilioDeTransporte(salario, hoy);
  const monto = (calcular: (s: Pesos) => Pesos) => (conMonto ? calcular(salario!) : null);

  /** La primera fecha con ese día del mes que cae en `desde` o después (este mes o el siguiente). */
  const proximoDiaDelMes = (dia: number, desde = hoy) => {
    const [a, m] = partes(desde);
    return [fecha(a, m, dia), m === 12 ? fecha(a + 1, 1, dia) : fecha(a, m + 1, dia)].find((f) => f >= desde)!;
  };

  if (salario !== null && diaDePago !== null) {
    const f = proximoDiaDelMes(diaDePago, fechaIngreso && fechaIngreso > hoy ? fechaIngreso : hoy);
    let neto: Pesos | null = null;
    try {
      neto = monto((s) => netoDelMes(s, f));
    } catch (e) {
      if (!(e instanceof RangeError)) throw e;
    }
    eventos.push({ fecha: f, tipo: "sueldo", titulo: "Tu sueldo", monto: neto, sentido: "entra" });
  }

  if (salario !== null && fechaIngreso) {
    // Prima: el próximo pago con días trabajados en su semestre.
    const semestres = [año, año + 1].flatMap((a) => [
      { desde: `${a}-01-01`, hasta: `${a}-06-30`, pago: fecha(a, 6, norma("prima_pago_junio", hoy)) },
      { desde: `${a}-07-01`, hasta: `${a}-12-31`, pago: fecha(a, 12, norma("prima_pago_diciembre", hoy)) },
    ]);
    const semestre = semestres.find((s) => s.pago >= hoy && diasTrabajados(fechaIngreso, s.desde, s.hasta) > 0);
    if (semestre) {
      const dias = diasTrabajados(fechaIngreso, semestre.desde, semestre.hasta);
      eventos.push({ fecha: semestre.pago, tipo: "prima", titulo: "Tu prima", monto: monto((s) => prima(s, dias)), sentido: "entra" });
    }

    // Intereses y cesantías se pagan a comienzos del año siguiente al que se liquidan.
    const años = [año - 1, año].map((a) => ({
      a,
      dias: diasTrabajados(fechaIngreso, `${a}-01-01`, `${a}-12-31`),
      intereses: fecha(a + 1, 1, norma("intereses_cesantias_pago_enero", hoy)),
      consignacion: fecha(a + 1, 2, norma("cesantias_consignacion_febrero", hoy)),
    }));
    const paraIntereses = años.find((x) => x.intereses >= hoy && x.dias > 0);
    if (paraIntereses) {
      const { dias, intereses } = paraIntereses;
      eventos.push({
        fecha: intereses,
        tipo: "intereses_cesantias",
        titulo: "Intereses de tus cesantías",
        monto: monto((s) => interesesDeCesantias(cesantias(s, dias), dias, intereses)),
        sentido: "entra",
      });
    }
    const paraCesantias = años.find((x) => x.consignacion >= hoy && x.dias > 0);
    if (paraCesantias) {
      const { dias, consignacion } = paraCesantias;
      eventos.push({
        fecha: consignacion,
        tipo: "cesantias",
        titulo: "Tus cesantías llegan a tu fondo",
        monto: monto((s) => cesantias(s, dias)),
        sentido: "entra",
      });
    }
  }

  for (const deuda of perfil.deudas) {
    if (deuda.cuotaMensual === null || !deuda.diaDePago || deuda.cuotasRestantes === 0) continue;
    eventos.push({
      fecha: proximoDiaDelMes(deuda.diaDePago),
      tipo: "cuota",
      titulo: `Cuota: ${deuda.nombre}`,
      monto: deuda.cuotaMensual,
      sentido: "sale",
    });
  }

  return eventos.sort((x, y) => (x.fecha < y.fecha ? -1 : x.fecha > y.fecha ? 1 : 0));
}
