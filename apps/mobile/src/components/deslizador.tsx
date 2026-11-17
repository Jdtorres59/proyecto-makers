import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, useCompetingGestures, usePanGesture, useTapGesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

import { Forma, useTema } from '@/constants/tema';
import { haptica } from '@/lib/haptica';

type Props = {
  min: number;
  max: number;
  paso: number;
  valor: number;
  alCambiar(valor: number): void;
  etiqueta: string;
  /** Lo que oye el lector de pantalla, por ejemplo "$900.000" o "12 cuotas". */
  textoValor: string;
};

/**
 * Deslizador impreso: pista con contorno, relleno maíz y perilla con sombra sólida. Se arrastra o se toca
 * en cualquier punto; con VoiceOver o TalkBack sube y baja de a un paso (rol "adjustable").
 */
export function Deslizador({ min, max, paso, valor, alCambiar, etiqueta, textoValor }: Props) {
  const tema = useTema();
  const [ancho, setAncho] = useState(0);
  const pasos = Math.max(1, Math.round((max - min) / paso));
  const fraccion = (valor - min) / (max - min || 1);

  const mover = (delta: number) => {
    const nuevo = Math.min(max, Math.max(min, valor + delta));
    if (nuevo !== valor) {
      haptica.eleccion();
      alCambiar(nuevo);
    }
  };

  const desdeX = (x: number) => {
    const f = Math.min(1, Math.max(0, x / (ancho || 1)));
    const nuevo = min + Math.round(f * pasos) * paso;
    if (nuevo !== valor) {
      haptica.eleccion();
      alCambiar(nuevo);
    }
  };
  const arrastre = usePanGesture({
    minDistance: 0,
    onUpdate: (e) => {
      'worklet';
      scheduleOnRN(desdeX, e.x);
    },
  });
  const toque = useTapGesture({
    onActivate: (e) => {
      'worklet';
      scheduleOnRN(desdeX, e.x);
    },
  });

  const gesto = useCompetingGestures(arrastre, toque);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={etiqueta}
      accessibilityValue={{ text: textoValor }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => mover(e.nativeEvent.actionName === 'increment' ? paso : -paso)}
      // Web: foco con Tab, valor anunciado y flechas. En el celular lo cubren adjustable y sus acciones.
      focusable
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={valor}
      aria-valuetext={textoValor}
      {...({
        onKeyDown: (e: { key: string; preventDefault(): void }) => {
          const salto = { ArrowRight: paso, ArrowUp: paso, ArrowLeft: -paso, ArrowDown: -paso, PageUp: paso * 5, PageDown: -paso * 5, Home: min - valor, End: max - valor }[e.key];
          if (salto === undefined) return;
          e.preventDefault();
          mover(salto);
        },
      } as object)}
      style={estilos.zona}>
      <GestureDetector gesture={gesto}>
        <View style={estilos.zona} onLayout={(e) => setAncho(e.nativeEvent.layout.width)}>
            <View style={[estilos.pista, { borderColor: tema.linea, backgroundColor: tema.papel }]}>
              <View style={[estilos.relleno, { width: `${fraccion * 100}%`, backgroundColor: tema.maiz }]} />
            </View>
            <View style={[estilos.perilla, { left: fraccion * ancho - 16 }]} pointerEvents="none">
              <View style={[estilos.sombra, { backgroundColor: tema.linea }]} />
              <View style={[estilos.cara, { backgroundColor: tema.maiz, borderColor: tema.linea }]} />
            </View>
          </View>
      </GestureDetector>
    </View>
  );
}

const estilos = StyleSheet.create({
  zona: { height: 48, justifyContent: 'center' },
  pista: { height: 14, borderRadius: 7, borderWidth: Forma.contorno, overflow: 'hidden' },
  relleno: { height: '100%' },
  perilla: { position: 'absolute', top: 6, width: 32, height: 35 },
  sombra: { position: 'absolute', top: 3, left: 0, width: 32, height: 32, borderRadius: 16 },
  cara: { width: 32, height: 32, borderRadius: 16, borderWidth: Forma.contorno },
});
