import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { Fuente, useTema } from '@/constants/tema';

import { moneda } from './moneda';
import { Texto } from './texto';

type Fondo = 'claro' | 'oscuro' | 'maiz';

/** Colores de DESIGN.md por fondo. El nombre va siempre sobre fondo liso. */
const COLORES: Record<Fondo, { letras: string; tajada: string }> = {
  claro: { letras: '#2A2219', tajada: '#A8740A' },
  oscuro: { letras: '#F6EEDC', tajada: '#F2BE22' },
  maiz: { letras: '#1F1A14', tajada: '#1F1A14' },
};

const M = moneda();

/** `luca` con la moneda de la tajada en la c. Sin `fondo`, sigue el tema. */
export function Wordmark({ tamano = 40, fondo }: { tamano?: number; fondo?: Fondo }) {
  const tema = useTema();
  const { letras, tajada } = COLORES[fondo ?? (tema.oscuro ? 'oscuro' : 'claro')];
  const letra = { fontFamily: Fuente.titular, fontSize: tamano, lineHeight: tamano * 1.1, letterSpacing: -tamano * 0.04, color: letras };
  // La moneda mide lo que una minúscula de Bricolage (altura x ≈ 0,54 em) y se apoya en la línea base.
  const diametro = tamano * 0.56;
  return (
    <View style={estilos.fila} accessible accessibilityRole="image" accessibilityLabel="luca">
      <Texto allowFontScaling={false} style={letra}>
        lu
      </Texto>
      <Svg width={diametro} height={diametro} viewBox="0 0 100 100" style={{ marginHorizontal: tamano * 0.02, marginBottom: tamano * 0.21 }}>
        <Path d={M.cuerpo} fill={letras} />
        <G transform={`translate(${M.dx} ${M.dy})`}>
          <Path d={M.tajada} fill={tajada} />
        </G>
      </Svg>
      <Texto allowFontScaling={false} style={letra}>
        a
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({ fila: { flexDirection: 'row', alignItems: 'flex-end' } });
