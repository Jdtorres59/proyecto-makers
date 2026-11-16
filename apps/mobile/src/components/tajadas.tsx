import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Forma, Movimiento, useTema } from '@/constants/tema';

/** Barra de progreso por tajadas: una por paso. La del paso actual se llena con un resorte. */
export function Tajadas({ total, actual, etiqueta }: { total: number; actual: number; etiqueta: string }) {
  return (
    <View
      style={estilos.fila}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={etiqueta}
      accessibilityValue={{ min: 0, max: total, now: actual }}>
      {Array.from({ length: total }, (_, i) => (
        <Tajada key={i} llena={i < actual} />
      ))}
    </View>
  );
}

function Tajada({ llena }: { llena: boolean }) {
  const tema = useTema();
  const progreso = useSharedValue(llena ? 1 : 0);
  useEffect(() => {
    progreso.set(withSpring(llena ? 1 : 0, Movimiento.resorte));
  }, [llena, progreso]);
  const relleno = useAnimatedStyle(() => ({ width: `${progreso.value * 100}%` }));
  return (
    <View style={[estilos.tajada, { borderColor: tema.linea, backgroundColor: tema.papel }]}>
      <Animated.View style={[estilos.relleno, { backgroundColor: tema.maiz }, relleno]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 6, flex: 1 },
  tajada: { flex: 1, height: 12, borderRadius: 4, borderWidth: Forma.contorno - 0.5, overflow: 'hidden' },
  relleno: { height: '100%' },
});
