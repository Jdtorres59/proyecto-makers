import { hoyEnColombia } from "@makers/conocimiento";
import type { Modulo, PerfilFinanciero } from "@makers/core";
import { desprendible } from "./modulos/01-desprendible";
import { primaYCesantias } from "./modulos/02-prima-cesantias";
import { planDelMes } from "./modulos/03-plan-del-mes";
import { colchon } from "./modulos/04-colchon";
import { costoDeuda } from "./modulos/05-costo-deuda";
import { tarjeta } from "./modulos/06-tarjeta";
import { historial } from "./modulos/07-historial";
import { siNoPuedoPagar } from "./modulos/08-si-no-puedo-pagar";
import { fraudes } from "./modulos/09-fraudes";
import { invertirSimple } from "./modulos/10-invertir-simple";
import { primeraInversion } from "./modulos/11-primera-inversion";
import { cripto } from "./modulos/12-cripto";

export { primaYCesantias, SALARIO_EJEMPLO } from "./modulos/02-prima-cesantias";

/**
 * Los 12 módulos del núcleo, en orden, con las cifras de la fecha `hoy`. Con perfil, los pasos "idea"
 * llevan en `tuyo` los montos de la persona; sin perfil van con el ejemplo.
 * Lanza si falta una norma vigente en esa fecha, como las cuentas de core.
 */
export function modulosPara(perfil: PerfilFinanciero | null, hoy: string = hoyEnColombia()): Modulo[] {
  return [
    desprendible,
    primaYCesantias(perfil, hoy),
    planDelMes,
    colchon,
    costoDeuda,
    tarjeta,
    historial,
    siNoPuedoPagar,
    fraudes,
    invertirSimple,
    primeraInversion,
    cripto,
  ];
}

/** El núcleo sin perfil, con las cifras de hoy. */
export const MODULOS: Modulo[] = modulosPara(null);
