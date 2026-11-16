import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTema } from '@/constants/tema';
import { haptica } from '@/lib/haptica';

import { Luca } from './luca';
import { tajada } from './moneda';

/** Luca celebra y suelta tajadas de moneda en las tres tintas. Con "Reducir movimiento", solo Luca, sin lluvia. */
export function Celebracion({ tamano = 160 }: { tamano?: number }) {
  const reducido = useReducedMotion();
  useEffect(() => {
    const id = setTimeout(haptica.logro, 350);
    return () => clearTimeout(id);
  }, []);
  return (
    <View style={{ width: tamano, height: tamano, alignSelf: 'center' }}>
      {!reducido
        ? Array.from({ length: 14 }, (_, i) => <Chispa key={i} i={i} centro={tamano / 2} />)
        : null}
      <Luca pose="celebra" tamano={tamano} gesto="celebra" />
    </View>
  );
}

function Chispa({ i, centro }: { i: number; centro: number }) {
  const tema = useTema();
  const t = useSharedValue(0);
  // Trayectorias fijas por índice (sin azar): se ven distintas y son iguales en cada render.
  const angulo = (i / 14) * Math.PI * 2 + (i % 3) * 0.3;
  const distancia = centro * (0.9 + (i % 4) * 0.18);
  const color = [tema.maiz, tema.verde, tema.linea, tema.salvia][i % 4];
  useEffect(() => {
    t.set(withDelay(320 + (i % 5) * 30, withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) })));
  }, [t, i]);
  const estilo = useAnimatedStyle(() => ({
    opacity: t.value < 0.75 ? 1 : 1 - (t.value - 0.75) / 0.25,
    transform: [
      { translateX: Math.cos(angulo) * distancia * t.value },
      { translateY: Math.sin(angulo) * distancia * t.value - 40 * Math.sin(Math.PI * t.value) + 60 * t.value * t.value },
      { rotate: `${t.value * (i % 2 ? 300 : -260)}deg` },
      { scale: 0.4 + t.value * 0.6 },
    ],
  }));
  return (
    <Animated.View style={[estilos.chispa, { left: centro - 9, top: centro - 9 }, estilo]} pointerEvents="none">
      <Svg width={18} height={18} viewBox="0 0 100 100">
        <Path d={tajada(50, 50, 48, -120, -40 + (i % 3) * 20)} fill={color} />
      </Svg>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({ chispa: { position: 'absolute' } });
