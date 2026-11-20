import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

import { Espacio, Forma, Movimiento, useTema } from '@/constants/tema';
import { haptica } from '@/lib/haptica';

import { Icono } from './icono';
import { Texto } from './texto';

type Props = { texto: string; elegido: boolean; multiple?: boolean; onPress(): void };

/** Opción que se elige con un toque. Elegida: verde con visto; el cambio rebota un poco. */
export function Chip({ texto, elegido, multiple, onPress }: Props) {
  const tema = useTema();
  const escala = useSharedValue(1);
  const animado = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }] }));

  return (
    <Pressable
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      aria-checked={elegido}
      accessibilityLabel={texto}
      onPressIn={() => (escala.set(withSpring(0.95, Movimiento.resorteVivo)))}
      onPressOut={() => (escala.set(withSpring(1, Movimiento.resorteVivo)))}
      onPress={() => {
        haptica.eleccion();
        escala.set(withSequence(withSpring(1.04, Movimiento.resorteVivo), withSpring(1, Movimiento.resorte)));
        onPress();
      }}>
      <Animated.View
        style={[
          estilos.chip,
          { backgroundColor: elegido ? tema.verde : tema.papel, borderColor: tema.linea },
          animado,
        ]}>
        {elegido ? <Icono nombre="check" tamano={18} color={tema.sobreVerde} /> : null}
        <Texto tipo="cuerpoFuerte" color={elegido ? tema.sobreVerde : tema.texto} style={estilos.texto}>
          {texto}
        </Texto>
      </Animated.View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    minHeight: Forma.tactil,
    borderWidth: Forma.contorno,
    borderRadius: Forma.radio,
    paddingHorizontal: Espacio.l,
    paddingVertical: Espacio.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espacio.s - 2,
  },
  texto: { flexShrink: 1 },
});
