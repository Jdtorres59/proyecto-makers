import { Image } from 'expo-image';

import { useTema } from '@/constants/tema';
import { ICONOS, type NombreIcono } from '@/lib/assets';

/** Ícono de trazo de la biblioteca, teñido con el color del tema. Decorativo: la etiqueta va en el control. */
export function Icono({ nombre, tamano = 24, color }: { nombre: NombreIcono; tamano?: number; color?: string }) {
  const tema = useTema();
  return (
    <Image
      source={ICONOS[nombre]}
      tintColor={color ?? tema.texto}
      style={{ width: tamano, height: tamano }}
      alt=""
      aria-hidden
      importantForAccessibility="no"
    />
  );
}
