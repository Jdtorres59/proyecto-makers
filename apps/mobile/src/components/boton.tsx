import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

type Props = Omit<PressableProps, 'style'> & { titulo: string; cargando?: boolean; secundario?: boolean; style?: ViewStyle };

export function Boton({ titulo, cargando, secundario, disabled, style, ...resto }: Props) {
  const tema = useTheme();
  const inactivo = disabled || cargando;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactivo, busy: !!cargando }}
      disabled={inactivo}
      style={({ pressed }) => [
        estilos.boton,
        { backgroundColor: secundario ? tema.backgroundElement : tema.text, opacity: inactivo ? 0.5 : pressed ? 0.8 : 1 },
        style,
      ]}
      {...resto}>
      {cargando ? (
        <ActivityIndicator color={secundario ? tema.text : tema.background} />
      ) : (
        <ThemedText style={{ color: secundario ? tema.text : tema.background, fontWeight: 600 }}>{titulo}</ThemedText>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  // 48 de alto mínimo: área táctil cómoda en iOS y Android.
  boton: { minHeight: 48, borderRadius: 12, paddingHorizontal: Spacing.three, alignItems: 'center', justifyContent: 'center' },
});
