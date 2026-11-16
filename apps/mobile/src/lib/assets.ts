import type { ImageSource } from 'expo-image';

/**
 * Índice tipado de la biblioteca de Luca (apps/mobile/assets). Las pantallas piden un asset por nombre;
 * si el archivo todavía no existe, `asset()` devuelve null y el componente pinta un marco de grabado
 * vectorial (MarcoGrabado). Los nombres salen del plan de la biblioteca en
 * docs/marca/direccion-1.0/fuente/biblioteca.py.
 *
 * Los archivos se descubren con require.context: cuando diseño suba un .webp con su nombre, entra solo,
 * sin tocar este archivo ni las pantallas.
 */

export const POSES = ['saluda', 'explica', 'celebra', 'piensa', 'lee', 'atento', 'sorprendido', 'muestra', 'pulgar', 'guarda', 'espera', 'despide'] as const;
export const MODULOS = [
  '01-desprendible',
  '02-prima-cesantias',
  '03-plan-del-mes',
  '04-colchon',
  '05-costo-deuda',
  '06-tarjeta',
  '07-historial',
  '08-si-no-puedo-pagar',
  '09-fraudes',
  '10-invertir-simple',
  '11-primera-inversion',
  '12-cripto',
] as const;
export const ETAPAS = ['0-semilla', '1-brote', '2-plantula', '3-arbolito', '4-arbol'] as const;
export const OBJETOS = ['desprendible', 'extracto', 'sobre-prima', 'tarjeta', 'calendario', 'tarro', 'lupa'] as const;
export const ESCENAS = ['subir-documento', 'leyendo', 'vacio', 'sin-conexion'] as const;

export type Pose = (typeof POSES)[number];
export type NombreAsset =
  | `luca/luca-${Pose}`
  | `portadas/${(typeof MODULOS)[number]}`
  | `medallas/${(typeof MODULOS)[number]}`
  | `crecimiento/${(typeof ETAPAS)[number]}`
  | `objetos/${(typeof OBJETOS)[number]}`
  | `escenas/${(typeof ESCENAS)[number]}`;

/** Qué forma toma el respaldo vectorial mientras falta la imagen. */
export type Familia = 'luca' | 'portada' | 'medalla' | 'crecimiento' | 'objeto' | 'escena';

export function familiaDe(nombre: NombreAsset): Familia {
  const carpeta = nombre.split('/')[0];
  return (
    { luca: 'luca', portadas: 'portada', medallas: 'medalla', crecimiento: 'crecimiento', objetos: 'objeto', escenas: 'escena' } as const
  )[carpeta as 'luca']!;
}

const contexto = require.context('../../assets', true, /^\.\/(luca|portadas|medallas|crecimiento|objetos|escenas)\/[^/]+\.webp$/);
const disponibles = new Map<string, ImageSource>(contexto.keys().map((ruta) => [ruta.slice(2, -'.webp'.length), contexto(ruta)]));

export function asset(nombre: NombreAsset): ImageSource | null {
  return disponibles.get(nombre) ?? null;
}

/** Íconos de interfaz (SVG de trazo). Se tiñen con el color del tema. */
export const ICONOS = {
  aprender: require('../../assets/iconos/aprender.svg'),
  atras: require('../../assets/iconos/atras.svg'),
  calendario: require('../../assets/iconos/calendario.svg'),
  camara: require('../../assets/iconos/camara.svg'),
  campana: require('../../assets/iconos/campana.svg'),
  candado: require('../../assets/iconos/candado.svg'),
  cerrar: require('../../assets/iconos/cerrar.svg'),
  check: require('../../assets/iconos/check.svg'),
  chispa: require('../../assets/iconos/chispa.svg'),
  documentos: require('../../assets/iconos/documentos.svg'),
  editar: require('../../assets/iconos/editar.svg'),
  eliminar: require('../../assets/iconos/eliminar.svg'),
  enviar: require('../../assets/iconos/enviar.svg'),
  flecha: require('../../assets/iconos/flecha.svg'),
  info: require('../../assets/iconos/info.svg'),
  inicio: require('../../assets/iconos/inicio.svg'),
  lupa: require('../../assets/iconos/lupa.svg'),
  mas: require('../../assets/iconos/mas.svg'),
  subir: require('../../assets/iconos/subir.svg'),
  yo: require('../../assets/iconos/yo.svg'),
} as const;
export type NombreIcono = keyof typeof ICONOS;

/** Piezas vectoriales del sistema de grabado y de la marca (DESIGN.md, Assets). Las de tinta traen variante oscura. */
const GRABADO = {
  'forma-panel': [require('../../assets/grabado/forma-panel.svg'), require('../../assets/grabado/forma-panel-oscuro.svg')],
  'forma-sol': [require('../../assets/grabado/forma-sol.svg'), require('../../assets/grabado/forma-sol-oscuro.svg')],
  'forma-mancha': [require('../../assets/grabado/forma-mancha.svg'), require('../../assets/grabado/forma-mancha-oscuro.svg')],
  'marco-portada': [require('../../assets/grabado/marco-portada.svg'), require('../../assets/grabado/marco-portada-oscuro.svg')],
  'marco-medalla': [require('../../assets/grabado/marco-medalla.svg'), require('../../assets/grabado/marco-medalla-oscuro.svg')],
  'medalla-bloqueada': [require('../../assets/grabado/medalla-bloqueada.svg'), require('../../assets/grabado/medalla-bloqueada-oscuro.svg')],
  'confeti-hoja': [require('../../assets/grabado/confeti-hoja.svg'), require('../../assets/grabado/confeti-hoja-oscuro.svg')],
  'confeti-grano': [require('../../assets/grabado/confeti-grano.svg'), require('../../assets/grabado/confeti-grano-oscuro.svg')],
  'confeti-tira': [require('../../assets/grabado/confeti-tira.svg'), require('../../assets/grabado/confeti-tira-oscuro.svg')],
  'confeti-punto': [require('../../assets/grabado/confeti-punto.svg'), require('../../assets/grabado/confeti-punto-oscuro.svg')],
  grano: [require('../../assets/grabado/grano.png'), require('../../assets/grabado/grano-oscuro.png')],
  halo: [require('../../assets/grabado/halo.svg'), require('../../assets/grabado/halo.svg')],
  'wordmark-claro': [require('../../assets/marca/wordmark-claro.svg'), require('../../assets/marca/wordmark-claro.svg')],
  'wordmark-oscuro': [require('../../assets/marca/wordmark-oscuro.svg'), require('../../assets/marca/wordmark-oscuro.svg')],
  'wordmark-maiz': [require('../../assets/marca/wordmark-maiz.svg'), require('../../assets/marca/wordmark-maiz.svg')],
} as const;
export type PiezaGrabado = keyof typeof GRABADO;

export function grabado(nombre: PiezaGrabado, oscuro: boolean): ImageSource {
  return GRABADO[nombre][oscuro ? 1 : 0];
}
