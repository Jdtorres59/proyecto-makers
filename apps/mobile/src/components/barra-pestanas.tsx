import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Espacio, Forma, Movimiento, useTema } from '@/constants/tema';
import type { NombreIcono } from '@/lib/assets';
import { haptica } from '@/lib/haptica';

import { Icono } from './icono';
import { Texto } from './texto';

const PESTANAS: Record<string, { titulo: string; icono: NombreIcono }> = {
  index: { titulo: 'Inicio', icono: 'inicio' },
  aprender: { titulo: 'Aprender', icono: 'aprender' },
  documentos: { titulo: 'Documentos', icono: 'documentos' },
  yo: { titulo: 'Sobre mí', icono: 'yo' },
};

/** Barra de pestañas impresa: la ficha maíz se desliza con un resorte hasta la pestaña elegida. */
export function BarraPestanas({ state, navigateToTab }: BottomTabBarProps) {
  const tema = useTema();
  const { bottom } = useSafeAreaInsets();
  const [ancho, setAncho] = useState(0);
  const x = useSharedValue(0);
  const porPestana = ancho / state.routes.length;

  useEffect(() => {
    x.set(withSpring(state.index * porPestana, Movimiento.resorte));
  }, [state.index, porPestana, x]);
  const ficha = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={[estilos.barra, { backgroundColor: tema.papel, borderTopColor: tema.linea, paddingBottom: Math.max(bottom, Espacio.s) }]} accessibilityRole="tablist">
      <View style={estilos.fila} onLayout={(e) => setAncho(e.nativeEvent.layout.width)}>
        {ancho ? (
          <Animated.View style={[estilos.fichaCaja, { width: porPestana }, ficha]} pointerEvents="none">
            <View style={[estilos.ficha, { backgroundColor: tema.maiz, borderColor: tema.linea }]} />
          </Animated.View>
        ) : null}
        {state.routes.map((ruta, i) => {
          const p = PESTANAS[ruta.name];
          const activa = state.index === i;
          return (
            <Pressable
              key={ruta.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}
              accessibilityLabel={p.titulo}
              style={estilos.pestana}
              onPress={() => {
                if (activa) return;
                haptica.eleccion();
                navigateToTab(ruta.key);
              }}>
              <View style={estilos.iconoCaja}>
                <Icono nombre={p.icono} tamano={24} color={activa ? tema.sobreMaiz : tema.textoSuave} />
              </View>
              <Texto tipo="pequeno" numberOfLines={1} maxFontSizeMultiplier={1.3} color={activa ? tema.texto : tema.textoSuave} style={activa && { fontFamily: 'BricolageGrotesque_700Bold' }}>
                {p.titulo}
              </Texto>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: { borderTopWidth: Forma.contorno, paddingTop: Espacio.s },
  fila: { flexDirection: 'row', maxWidth: 560, width: '100%', alignSelf: 'center' },
  pestana: { flex: 1, alignItems: 'center', gap: 2, minHeight: 56, paddingTop: 4 },
  iconoCaja: { width: 56, height: 32, alignItems: 'center', justifyContent: 'center' },
  fichaCaja: { position: 'absolute', top: 4, alignItems: 'center' },
  ficha: { width: 56, height: 32, borderRadius: Forma.radioChico, borderWidth: 2 },
});
