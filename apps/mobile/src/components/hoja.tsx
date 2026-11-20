import { type ReactNode, useEffect } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, GestureHandlerRootView, usePanGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Espacio, Forma, Movimiento, useTema } from '@/constants/tema';

import { Icono } from './icono';
import { Texto } from './texto';

type Props = { visible: boolean; alCerrar(): void; titulo: string; children: ReactNode };

/**
 * Hoja inferior. Sube con un resorte; se cierra arrastrándola hacia abajo (sigue al dedo y respeta la
 * velocidad del gesto), tocando el velo o con el botón Cerrar, que también sirve a lectores de pantalla.
 */
export function Hoja({ visible, alCerrar, titulo, children }: Props) {
  const tema = useTema();
  const reducido = useReducedMotion();
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const y = useSharedValue(height);
  const velo = useSharedValue(0);

  const cerrar = () => {
    velo.set(withTiming(0, { duration: Movimiento.rapido }));
    y.set(
      withTiming(height, { duration: reducido ? 0 : Movimiento.medio }, (fin) => {
        if (fin) scheduleOnRN(alCerrar);
      }),
    );
  };

  useEffect(() => {
    if (!visible) return;
    y.set(height);
    velo.set(withTiming(1, { duration: Movimiento.medio }));
    y.set(reducido ? 0 : withSpring(0, Movimiento.resorte));
  }, [visible, reducido, height, y, velo]);

  const arrastre = usePanGesture({
    activeOffsetY: 8,
    onUpdate: (e) => {
      'worklet';
      y.set(Math.max(0, e.translationY));
    },
    onDeactivate: (e) => {
      'worklet';
      if (e.translationY > 120 || e.velocityY > 900) {
        velo.set(withTiming(0, { duration: Movimiento.rapido }));
        y.set(withTiming(height, { duration: Movimiento.rapido }, () => scheduleOnRN(alCerrar)));
      } else {
        y.set(withSpring(0, Movimiento.resorte));
      }
    },
  });

  const hojaAnimada = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const veloAnimado = useAnimatedStyle(() => ({ opacity: velo.value }));

  // El padre la desmonta con alCerrar cuando termina de bajar.
  if (!visible) return null;
  return (
    <Modal visible transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={cerrar}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: tema.velo }, veloAnimado]}>
          {/* El velo cierra al tocarlo, pero el lector usa el botón Cerrar: así no hay dos "Cerrar". */}
          <Pressable style={{ flex: 1 }} onPress={cerrar} accessible={false} focusable={false} aria-hidden />
        </Animated.View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.abajo} pointerEvents="box-none">
          <GestureDetector gesture={arrastre}>
            <Animated.View
              accessibilityViewIsModal
              role="dialog"
              aria-label={titulo}
              style={[estilos.hoja, { backgroundColor: tema.fondo, borderColor: tema.linea, paddingBottom: bottom + Espacio.xl }, hojaAnimada]}>
              <View style={[estilos.agarre, { backgroundColor: tema.lineaSuave }]} />
              <View style={estilos.cabeza}>
                <Texto tipo="titulo2" style={{ flex: 1 }}>
                  {titulo}
                </Texto>
                <Pressable
                  onPress={cerrar}
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar"
                  hitSlop={6}
                  style={[estilos.cerrar, { borderColor: tema.linea, backgroundColor: tema.papel }]}>
                  <Icono nombre="cerrar" tamano={20} />
                </Pressable>
              </View>
              {children}
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  abajo: { flex: 1, justifyContent: 'flex-end' },
  hoja: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: Forma.contorno,
    borderBottomWidth: 0,
    paddingHorizontal: Espacio.xl,
    paddingTop: Espacio.s,
    gap: Espacio.l,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  agarre: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: Espacio.xs },
  cabeza: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m },
  cerrar: { width: 44, height: 44, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
