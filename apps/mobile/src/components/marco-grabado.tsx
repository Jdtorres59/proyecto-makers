import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { useTema } from '@/constants/tema';
import type { Familia } from '@/lib/assets';

/**
 * Respaldo vectorial mientras llega la ilustración: un marco de grabado con marcas de gubia y la silueta
 * de lo que irá ahí. Usa solo las tintas del sistema; nunca pretende ser la ilustración final.
 */
export function MarcoGrabado({ familia, ancho, alto }: { familia: Familia; ancho: number; alto: number }) {
  const tema = useTema();
  const tinta = tema.linea;
  const gubia = tema.lineaSuave;
  const cuadrado = familia === 'luca' || familia === 'crecimiento' || familia === 'medalla' || familia === 'objeto';
  const vb = cuadrado ? '0 0 100 100' : '0 0 160 100';
  const w = cuadrado ? 100 : 160;

  return (
    <Svg width={ancho} height={alto} viewBox={vb} accessible={false}>
      {familia === 'medalla' ? (
        <G>
          <Circle cx={50} cy={50} r={44} fill={tema.maiz} stroke={tinta} strokeWidth={2.5} strokeDasharray="5 3" />
          <Circle cx={50} cy={50} r={30} fill={tema.papel} stroke={tinta} strokeWidth={2.5} />
          <Path d="M40 54c6-12 14-12 20 0" stroke={tinta} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </G>
      ) : (
        <G>
          <Rect x={2} y={2} width={w - 4} height={96} rx={8} fill={tema.superficie} stroke={tinta} strokeWidth={2.5} />
          {Array.from({ length: 9 }, (_, i) => (
            <Line key={i} x1={8 + i * (w / 9)} y1={90} x2={20 + i * (w / 9)} y2={78} stroke={gubia} strokeWidth={2} strokeLinecap="round" />
          ))}
          {familia === 'portada' || familia === 'escena' ? (
            <G>
              <Circle cx={30} cy={30} r={16} fill={tema.maiz} />
              <Rect x={70} y={44} width={78} height={44} rx={6} fill={tema.salvia} />
            </G>
          ) : familia === 'objeto' ? (
            <G>
              <Rect x={30} y={18} width={40} height={56} rx={3} fill={tema.papel} stroke={tinta} strokeWidth={2.5} />
              {[30, 40, 50, 60].map((y) => (
                <Line key={y} x1={37} y1={y} x2={63} y2={y} stroke={tinta} strokeWidth={2} strokeLinecap="round" />
              ))}
            </G>
          ) : (
            <G>
              {/* Semilla con su grieta; en "crecimiento" la etapa 0 todavía no tiene brote. */}
              <Path d="M50 30c14 0 20 12 20 26s-8 26-20 26-20-12-20-26 6-26 20-26Z" fill={tema.maiz} stroke={tinta} strokeWidth={2.5} />
              <Path d="M50 30l-3 7 4 3-2 5" stroke={tinta} strokeWidth={2} fill="none" strokeLinecap="round" />
              {familia === 'luca' ? (
                <G>
                  <Path d="M50 30V20" stroke={tema.verde} strokeWidth={2.5} strokeLinecap="round" />
                  <Path d="M50 21c-4-7-12-7-14-3 4 4 10 5 14 3ZM50 21c4-7 12-7 14-3-4 4-10 5-14 3Z" fill={tema.verde} />
                </G>
              ) : null}
            </G>
          )}
        </G>
      )}
    </Svg>
  );
}
