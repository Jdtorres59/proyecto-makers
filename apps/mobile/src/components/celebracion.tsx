import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';

import { useTema } from '@/constants/tema';
import { grabado, type PiezaGrabado } from '@/lib/assets';
import { haptica } from '@/lib/haptica';

import { Luca } from './luca';

/** Luca celebra y suelta el confeti de grabado (hojas, granos, tiras y puntos). Con "Reducir movimiento", solo Luca, sin lluvia. */
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
  const pieza = PIEZAS[i % PIEZAS.length];
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
      <Image source={grabado(pieza, tema.oscuro)} style={{ width: 18, height: 18 }} alt="" />
    </Animated.View>
  );
}

const PIEZAS: PiezaGrabado[] = ['confeti-hoja', 'confeti-grano', 'confeti-tira', 'confeti-punto'];

const estilos = StyleSheet.create({ chispa: { position: 'absolute' } });
