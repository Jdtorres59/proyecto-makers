import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Espacio, Forma, Movimiento, useTema } from '@/constants/tema';
import { haptica } from '@/lib/haptica';

import { Texto } from './texto';

type Variante = 'principal' | 'secundario' | 'tinta' | 'texto' | 'apple' | 'google';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  titulo: string;
  variante?: Variante;
  cargando?: boolean;
  icono?: ReactNode;
  style?: ViewStyle;
};

/** Tinta fija para el botón que va sobre la tarjeta maíz, igual en claro y oscuro (13,6:1). */
const TINTA = { fondo: '#2A2219', texto: '#F6EEDC' };

/**
 * Botón impreso: contorno de tinta y sombra sólida de 3 hacia abajo. Al presionarlo baja 3 y la sombra
 * desaparece, como un sello. El de texto no tiene caja, pero conserva 48 de alto para el dedo.
 */
export function Boton({ titulo, variante = 'principal', cargando, icono, disabled, style, onPressIn, onPressOut, onPress, ...resto }: Props) {
  const tema = useTema();
  const inactivo = !!disabled || !!cargando;
  const bajada = useSharedValue(0);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateY: bajada.value }] }));

  const colores = {
    principal: { fondo: tema.maiz, texto: tema.sobreMaiz, borde: tema.linea, sombra: tema.linea },
    secundario: { fondo: tema.verde, texto: tema.sobreVerde, borde: tema.linea, sombra: tema.linea },
    tinta: { fondo: TINTA.fondo, texto: TINTA.texto, borde: TINTA.fondo, sombra: 'rgba(42, 34, 25, 0.35)' },
    texto: { fondo: 'transparent', texto: tema.texto, borde: 'transparent', sombra: 'transparent' },
    // Pautas de Apple: botón negro sobre fondo claro y blanco sobre oscuro, con el logo del mismo color que el texto.
    apple: tema.oscuro
      ? { fondo: '#FFFFFF', texto: '#000000', borde: '#FFFFFF', sombra: 'rgba(255, 255, 255, 0.35)' }
      : { fondo: '#000000', texto: '#FFFFFF', borde: '#000000', sombra: tema.linea },
    // Pautas de Google: claro con fondo blanco y texto #1F1F1F; oscuro con #131314, borde #8E918F y texto #E3E3E3. Logo a color.
    google: tema.oscuro
      ? { fondo: '#131314', texto: '#E3E3E3', borde: '#8E918F', sombra: '#8E918F' }
      : { fondo: '#FFFFFF', texto: '#1F1F1F', borde: tema.linea, sombra: tema.linea },
  }[variante];
  const conCaja = variante !== 'texto';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      aria-disabled={inactivo} aria-busy={!!cargando}
      disabled={inactivo}
      hitSlop={conCaja ? undefined : 4}
      onPressIn={(e) => {
        if (conCaja) bajada.set(withSpring(Forma.sombra, Movimiento.resorteVivo));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        bajada.set(withSpring(0, Movimiento.resorteVivo));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        haptica.toque();
        onPress?.(e);
      }}
      style={[estilos.base, { opacity: inactivo && !cargando ? 0.45 : 1 }, style]}
      {...resto}>
      {conCaja ? <View style={[estilos.sombra, { backgroundColor: colores.sombra, borderRadius: Forma.radio }]} /> : null}
      <Animated.View
        style={[
          estilos.cara,
          conCaja && { backgroundColor: colores.fondo, borderColor: colores.borde, borderWidth: Forma.contorno },
          animado,
        ]}>
        {cargando ? (
          <ActivityIndicator color={colores.texto} />
        ) : (
          <>
            {icono}
            <Texto
              tipo="boton"
              color={colores.texto}
              style={[estilos.titulo, !conCaja && { textDecorationLine: 'underline', textDecorationColor: tema.textoSuave }]}>
              {titulo}
            </Texto>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: { minHeight: Forma.tactil + Forma.sombra, justifyContent: 'flex-start' },
  sombra: { position: 'absolute', left: 0, right: 0, top: Forma.sombra, bottom: 0 },
  cara: {
    minHeight: Forma.tactil + 4,
    borderRadius: Forma.radio,
    paddingHorizontal: Espacio.xl,
    paddingVertical: Espacio.m,
    marginBottom: Forma.sombra,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espacio.s,
  },
  titulo: { textAlign: 'center', flexShrink: 1 },
});
