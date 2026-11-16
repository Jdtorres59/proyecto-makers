import { Text, type TextProps } from 'react-native';

import { cifra, Tipo, useTema } from '@/constants/tema';

type Props = TextProps & {
  tipo?: keyof typeof Tipo;
  suave?: boolean;
  /** Números tabulares de plata. */
  esCifra?: boolean;
  color?: string;
};

/** Todo texto de la app. Escala con el tamaño de letra del sistema; los titulares tienen un tope para no romper la pantalla. */
export function Texto({ tipo = 'cuerpo', suave, esCifra, color, style, ...resto }: Props) {
  const tema = useTema();
  const esTitular = tipo === 'gigante' || tipo === 'titulo' || tipo === 'titulo2';
  return (
    <Text
      maxFontSizeMultiplier={esTitular ? 1.5 : 2}
      role={esTitular ? 'heading' : undefined}
      style={[Tipo[tipo], esCifra && cifra, { color: color ?? (suave ? tema.textoSuave : tema.texto) }, style]}
      {...resto}
    />
  );
}
