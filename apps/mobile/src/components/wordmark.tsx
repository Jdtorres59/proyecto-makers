import { Image } from 'expo-image';

import { useTema } from '@/constants/tema';
import { grabado } from '@/lib/assets';

type Fondo = 'claro' | 'oscuro' | 'maiz';

// Proporción del viewBox de marca/wordmark-*.svg.
const PROPORCION = 2025 / 753;

/** `luca` con la moneda de la tajada en la c, desde los SVG de diseño. Sin `fondo`, sigue el tema. Va siempre sobre fondo liso. */
export function Wordmark({ alto = 40, fondo }: { alto?: number; fondo?: Fondo }) {
  const tema = useTema();
  const variante = fondo ?? (tema.oscuro ? 'oscuro' : 'claro');
  return (
    <Image
      source={grabado(`wordmark-${variante}`, false)}
      style={{ height: alto, width: alto * PROPORCION }}
      contentFit="contain"
      accessible
      accessibilityRole="image"
      accessibilityLabel="luca"
    />
  );
}
