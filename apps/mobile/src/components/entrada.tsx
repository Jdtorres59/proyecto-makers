import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Movimiento } from '@/constants/tema';

/**
 * Entrada escalonada: cada bloque sube y aparece un poco después del anterior.
 * Reanimated respeta "Reducir movimiento" del sistema en las animaciones de entrada.
 */
export function Entrada({ indice = 0, children, style }: { indice?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(80 + indice * Movimiento.escalon)
        .springify()
        .damping(Movimiento.resorte.damping)
        .stiffness(Movimiento.resorte.stiffness)}
      style={style}>
      {children}
    </Animated.View>
  );
}
