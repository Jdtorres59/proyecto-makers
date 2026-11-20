import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { Espacio, Movimiento, useTema } from '@/constants/tema';
import { haptica } from '@/lib/haptica';

import { Icono } from './icono';
import { Texto } from './texto';

type Props = { cabeza: ReactNode; etiqueta: string; children: ReactNode; abierto?: boolean; ultimo?: boolean };

/** Fila que se abre para mostrar una explicación. El signo gira y el contenido entra suave. */
export function Expandible({ cabeza, etiqueta, children, abierto: inicial = false, ultimo }: Props) {
  const tema = useTema();
  const [abierto, setAbierto] = useState(inicial);
  return (
    <Animated.View layout={LinearTransition.springify().damping(Movimiento.resorte.damping)} style={!ultimo && { borderBottomWidth: 1, borderBottomColor: tema.lineaSuave }}>
      <Pressable
        onPress={() => (haptica.toque(), setAbierto(!abierto))}
        accessibilityRole="button"
        accessibilityLabel={etiqueta}
        aria-expanded={abierto}
        style={estilos.cabeza}>
        <View style={{ flex: 1 }}>{cabeza}</View>
        <View style={{ transform: [{ rotate: abierto ? '45deg' : '0deg' }] }}>
          <Icono nombre="mas" tamano={20} color={tema.textoSuave} />
        </View>
      </Pressable>
      {abierto ? (
        <Animated.View entering={FadeIn.duration(Movimiento.medio)} style={estilos.cuerpo}>
          {typeof children === 'string' ? <Texto suave>{children}</Texto> : children}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  cabeza: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, minHeight: 52, paddingVertical: Espacio.s },
  cuerpo: { paddingBottom: Espacio.m, paddingRight: Espacio.xl },
});
