import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Espacio, Forma, useTema } from '@/constants/tema';
import { grabado } from '@/lib/assets';

import { Icono } from './icono';
import { Tajadas } from './tajadas';

type Props = {
  children: ReactNode;
  /** Acción fija abajo (el botón de seguir). */
  pie?: ReactNode;
  /** Cabecera con atrás y progreso. */
  cabecera?: ReactNode;
  /** En pestañas la barra ya cuida el borde inferior. */
  conPestanas?: boolean;
};

/** Andamio de toda pantalla: fondo, área segura, scroll para pantallas chicas y letra grande, ancho máximo. */
export function Pantalla({ children, pie, cabecera, conPestanas }: Props) {
  const tema = useTema();
  return (
    <SafeAreaView style={[estilos.fondo, { backgroundColor: tema.fondo }]} edges={conPestanas ? ['top'] : ['top', 'bottom']}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {cabecera ? <View style={estilos.cabecera}>{cabecera}</View> : null}
        <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {pie ? <View style={[estilos.pie, { backgroundColor: tema.fondo, borderTopColor: tema.lineaSuave }]}>{pie}</View> : null}
      </KeyboardAvoidingView>
      <Grano />
    </SafeAreaView>
  );
}

const LADO_GRANO = 256;

/**
 * Grano de papel sobre toda la pantalla (DESIGN.md). La textura ya trae su opacidad. Se arma con cuadros
 * de 256 porque resizeMode="repeat" de RN no repite en la nueva arquitectura de iOS.
 */
function Grano() {
  const { oscuro } = useTema();
  const { width, height } = useWindowDimensions();
  const columnas = Math.ceil(width / LADO_GRANO);
  const filas = Math.ceil(height / LADO_GRANO);
  return (
    <View style={[estilos.grano, { width: columnas * LADO_GRANO, height: filas * LADO_GRANO }]} pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants">
      {Array.from({ length: columnas * filas }, (_, i) => (
        <Image key={i} source={grabado('grano', oscuro)} style={{ width: LADO_GRANO, height: LADO_GRANO }} cachePolicy="memory" />
      ))}
    </View>
  );
}

/** Atrás + tajadas de progreso, como en el prototipo. */
export function Cabecera({ alVolver, progreso }: { alVolver?: () => void; progreso?: { total: number; actual: number; etiqueta: string } }) {
  const tema = useTema();
  return (
    <>
      {alVolver !== undefined || router.canGoBack() ? (
        <Pressable
          onPress={alVolver ?? (() => router.back())}
          accessibilityRole="button"
          accessibilityLabel="Atrás"
          hitSlop={4}
          style={({ pressed }) => [estilos.atras, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
          <Icono nombre="atras" tamano={22} />
        </Pressable>
      ) : (
        <View style={estilos.atrasVacio} />
      )}
      {progreso ? <Tajadas {...progreso} /> : <View style={{ flex: 1 }} />}
      <View style={estilos.atrasVacio} />
    </>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1 },
  grano: { position: 'absolute', top: 0, left: 0, flexDirection: 'row', flexWrap: 'wrap' },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: Espacio.l, paddingHorizontal: Espacio.xl, paddingTop: Espacio.s, paddingBottom: Espacio.s, width: '100%', maxWidth: 560, alignSelf: 'center' },
  contenido: { flexGrow: 1, paddingHorizontal: Espacio.xl, paddingTop: Espacio.l, paddingBottom: Espacio.xxl, gap: Espacio.xl, width: '100%', maxWidth: 560, alignSelf: 'center' },
  pie: { paddingHorizontal: Espacio.xl, paddingTop: Espacio.m, paddingBottom: Espacio.s, gap: Espacio.xs, borderTopWidth: 1, width: '100%', alignItems: 'stretch' },
  atras: { width: 44, height: 44, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  atrasVacio: { width: 44 },
});
