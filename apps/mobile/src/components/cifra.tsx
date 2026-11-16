import { formatearCOP } from '@makers/core';
import { useEffect, useState } from 'react';
import { PixelRatio, StyleSheet, Text, type TextStyle, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { cifra, Movimiento, useTema } from '@/constants/tema';

type Props = { valor: number; tamano?: number; color?: string; signo?: '+' | '−'; demora?: number };

/**
 * Cifra de plata que rueda como un contador mecánico: cada dígito sube desde 0 hasta su valor, el de las
 * unidades primero. Con números tabulares los dígitos no bailan. Lectores de pantalla oyen la cifra completa.
 */
export function Cifra({ valor, tamano = 32, color, signo, demora = 0 }: Props) {
  const tema = useTema();
  const reducido = useReducedMotion();
  const texto = `${signo ?? ''}${formatearCOP(valor)}`;
  const { width } = useWindowDimensions();
  // Con letra grande el tamaño efectivo crece; se limita para que la cifra quepa en el ancho disponible
  // (≈0,62 em por carácter en Bricolage 800 tabular, con 112 de márgenes y relleno).
  const escalaSistema = Math.min(PixelRatio.getFontScale(), 1.6);
  const maximo = (Math.min(width, 560) - 112) / (texto.length * 0.62 * escalaSistema);
  tamano = Math.min(tamano, maximo);
  const estilo: TextStyle = { ...cifra, fontSize: tamano, lineHeight: tamano * 1.15, letterSpacing: -tamano * 0.03, color: color ?? tema.texto };

  if (reducido) {
    return (
      <Text style={estilo} maxFontSizeMultiplier={1.6}>
        {texto}
      </Text>
    );
  }
  const caracteres = texto.split('');
  return (
    <View style={estilos.fila} accessible accessibilityRole="text" accessibilityLabel={texto}>
      {caracteres.map((c, i) => {
        const desdeLaDerecha = caracteres.length - 1 - i;
        return /\d/.test(c) ? (
          <Digito key={desdeLaDerecha} digito={Number(c)} estilo={estilo} demora={demora + desdeLaDerecha * 45} />
        ) : (
          <Text key={`${desdeLaDerecha}${c}`} style={estilo} maxFontSizeMultiplier={1.6} importantForAccessibility="no">
            {c}
          </Text>
        );
      })}
    </View>
  );
}

function Digito({ digito, estilo, demora }: { digito: number; estilo: TextStyle; demora: number }) {
  const [alto, setAlto] = useState(0);
  const y = useSharedValue(0);
  useEffect(() => {
    if (alto) y.set(withDelay(demora, withSpring(-digito * alto, Movimiento.resorteSuave)));
  }, [digito, alto, demora, y]);
  const columna = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return (
    <View style={{ overflow: 'hidden' }} importantForAccessibility="no-hide-descendants">
      {/* Mide el alto real de un dígito con el tamaño de letra del sistema. */}
      <Text style={[estilo, { opacity: 0 }]} maxFontSizeMultiplier={1.6} onLayout={(e) => setAlto(e.nativeEvent.layout.height)}>
        0
      </Text>
      <Animated.View style={[estilos.columna, columna]}>
        {Array.from({ length: 10 }, (_, n) => (
          <Text key={n} style={[estilo, { height: alto || undefined }]} maxFontSizeMultiplier={1.6}>
            {n}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', flexWrap: 'nowrap' },
  columna: { position: 'absolute', top: 0, left: 0 },
});
