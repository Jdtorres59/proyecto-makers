import { Image } from 'expo-image';

import { useTema } from '@/constants/tema';
import { type Familia, grabado } from '@/lib/assets';

/**
 * Respaldo mientras llega la ilustración: la pieza de grabado del sistema que le corresponde
 * (marco de portada, medalla bloqueada o una mancha salvia). Nunca pretende ser la ilustración final.
 */
export function MarcoGrabado({ familia, ancho, alto }: { familia: Familia; ancho: number; alto: number }) {
  const { oscuro } = useTema();
  const pieza = familia === 'portada' ? 'marco-portada' : familia === 'medalla' ? 'medalla-bloqueada' : 'forma-mancha';
  return <Image source={grabado(pieza, oscuro)} style={{ width: ancho, height: alto }} contentFit="contain" alt="" aria-hidden />;
}
