import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Espacio, Forma, useTema } from '@/constants/tema';

type Props = { children: ReactNode; variante?: 'papel' | 'superficie' | 'maiz'; conSombra?: boolean; style?: ViewStyle };

/** Bloque plano con contorno de tinta. La protagonista va en maíz con sombra sólida. */
export function Tarjeta({ children, variante = 'papel', conSombra = variante === 'maiz', style }: Props) {
  const tema = useTema();
  const fondo = { papel: tema.papel, superficie: tema.superficie, maiz: tema.maiz }[variante];
  return (
    <View style={conSombra && { paddingBottom: Forma.sombra }}>
      {conSombra ? <View style={[estilos.sombra, { backgroundColor: tema.linea }]} /> : null}
      <View style={[estilos.tarjeta, { backgroundColor: fondo, borderColor: tema.linea }, style]}>{children}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.l, overflow: 'hidden' },
  sombra: { position: 'absolute', left: 0, right: 0, top: Forma.sombra, bottom: 0, borderRadius: Forma.radio },
});
