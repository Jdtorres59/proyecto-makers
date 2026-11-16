import type { TipoDocumento } from '@makers/core';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/components/boton';
import { Icono } from '@/components/icono';
import { BurbujaLuca, Luca } from '@/components/luca';
import { Cabecera } from '@/components/pantalla';
import { Pdf } from '@/components/pdf';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Movimiento, Tipo, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { haptica } from '@/lib/haptica';

const PAPELES: { tipo: TipoDocumento; titulo: string; archivo: string }[] = [
  { tipo: 'extracto', titulo: 'Extracto de la tarjeta', archivo: 'extracto-nov-2026.pdf' },
  { tipo: 'oferta_credito', titulo: 'Oferta del préstamo', archivo: 'oferta-prestamo.pdf' },
];

/** "Tengo una decisión": la persona cuenta con sus palabras y Luca le pide los papeles para verlo con sus números. */
export default function Decidir() {
  const tema = useTema();
  const reducido = useReducedMotion();
  const { leerDocumento } = useLuca();
  const scroll = useRef<ScrollViewInstance>(null);
  const [texto, setTexto] = useState('Debo $2.400.000 en la tarjeta y no sé si pagar el mínimo, diferir a cuotas o pedir un préstamo.');
  const [enviado, setEnviado] = useState<string | null>(null);
  const [respondio, setRespondio] = useState(false);
  const [subidos, setSubidos] = useState<TipoDocumento[]>([]);
  const [subiendo, setSubiendo] = useState<TipoDocumento | null>(null);

  useEffect(() => {
    if (!enviado) return;
    const id = setTimeout(() => setRespondio(true), reducido ? 200 : 1300);
    return () => clearTimeout(id);
  }, [enviado, reducido]);

  useEffect(() => {
    const id = setTimeout(() => scroll.current?.scrollToEnd({ animated: !reducido }), 120);
    return () => clearTimeout(id);
  }, [enviado, respondio, subidos.length, reducido]);

  const enviar = () => {
    if (!texto.trim()) return;
    haptica.firme();
    setEnviado(texto.trim());
  };
  const subir = async (tipo: TipoDocumento) => {
    if (subidos.includes(tipo) || subiendo) return;
    haptica.toque();
    setSubiendo(tipo);
    await leerDocumento(tipo);
    setSubiendo(null);
    setSubidos((s) => [...s, tipo]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fondo }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={estilos.cabecera}>
          <Cabecera />
        </View>
        <ScrollView ref={scroll} contentContainerStyle={estilos.chat} keyboardShouldPersistTaps="handled">
          <Texto tipo="titulo2">Tengo una decisión</Texto>
          <BurbujaLuca pose="saluda" texto="Cuéntame qué está pasando, con tus palabras. Lo convierto en algo que puedas ver con tus números antes de decidir." />
          {enviado ? (
            <Animated.View entering={FadeInDown.springify().damping(Movimiento.resorte.damping)} style={[estilos.yo, { backgroundColor: tema.verde }]}>
              <Texto color={tema.sobreVerde}>{enviado}</Texto>
            </Animated.View>
          ) : null}
          {enviado && !respondio ? <Escribiendo /> : null}
          {respondio ? (
            <Animated.View entering={FadeIn} style={{ gap: Espacio.m }}>
              <BurbujaLuca
                pose="explica"
                texto={['Entiendo. Para mostrarte qué implica cada camino con tus números necesito dos papeles: ', { fuerte: 'el extracto de la tarjeta' }, ' y ', { fuerte: 'la oferta del préstamo' }, '.']}
              />
              {PAPELES.map((p) => {
                const listo = subidos.includes(p.tipo);
                return (
                  <Pressable
                    key={p.tipo}
                    onPress={() => subir(p.tipo)}
                    disabled={listo}
                    accessibilityRole="button"
                    accessibilityLabel={`${p.titulo}. ${listo ? 'Subido' : 'Toca para subirlo'}`}
                    style={({ pressed }) => [estilos.papel, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
                    <Pdf />
                    <View style={{ flex: 1 }}>
                      <Texto tipo="cuerpoFuerte">{p.titulo}</Texto>
                      <Texto tipo="pequeno" suave>
                        {listo ? p.archivo : subiendo === p.tipo ? 'Subiendo…' : 'Toca para subirlo'}
                      </Texto>
                    </View>
                    <View style={[estilos.estado, { borderColor: tema.linea, backgroundColor: listo ? tema.verde : 'transparent' }]}>
                      {listo ? <Icono nombre="check" tamano={18} color={tema.sobreVerde} /> : <Icono nombre="subir" tamano={18} />}
                    </View>
                  </Pressable>
                );
              })}
              <Boton titulo="Leer mis papeles" disabled={subidos.length < 2} onPress={() => router.replace('/decision/leyendo')} />
            </Animated.View>
          ) : null}
        </ScrollView>
        {!enviado ? (
          <View style={[estilos.redactor, { borderTopColor: tema.lineaSuave, backgroundColor: tema.fondo }]}>
            <TextInput
              value={texto}
              onChangeText={setTexto}
              multiline
              accessibilityLabel="Tu situación"
              placeholder="Cuéntame qué pasa"
              placeholderTextColor={tema.textoSuave}
              selectionColor={tema.maiz}
              maxFontSizeMultiplier={2}
              style={[Tipo.cuerpo, estilos.campo, { color: tema.texto, backgroundColor: tema.papel, borderColor: tema.linea }]}
            />
            <Pressable
              onPress={enviar}
              accessibilityRole="button"
              accessibilityLabel="Enviar"
              disabled={!texto.trim()}
              style={({ pressed }) => [estilos.enviar, { backgroundColor: tema.maiz, borderColor: tema.linea, opacity: texto.trim() ? 1 : 0.45, transform: [{ translateY: pressed ? 2 : 0 }] }]}>
              <Icono nombre="enviar" tamano={22} color={tema.sobreMaiz} />
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Luca pensando: tres puntos que suben uno tras otro. */
function Escribiendo() {
  const tema = useTema();
  return (
    <View style={estilos.escribiendo} accessible accessibilityLabel="Luca está escribiendo">
      <Luca pose="piensa" tamano={56} gesto="quieto" />
      <View style={[estilos.puntos, { backgroundColor: tema.papel, borderColor: tema.linea }]}>
        {[0, 1, 2].map((i) => (
          <Punto key={i} i={i} />
        ))}
      </View>
    </View>
  );
}

function Punto({ i }: { i: number }) {
  const tema = useTema();
  const reducido = useReducedMotion();
  const y = useSharedValue(0);
  useEffect(() => {
    if (!reducido) y.set(withDelay(i * 140, withRepeat(withSequence(withTiming(-5, { duration: 260 }), withTiming(0, { duration: 260 })), -1)));
  }, [i, y, reducido]);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[estilos.punto, { backgroundColor: tema.textoSuave }, animado]} />;
}

const estilos = StyleSheet.create({
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: Espacio.l, paddingHorizontal: Espacio.xl, paddingTop: Espacio.s, width: '100%', maxWidth: 560, alignSelf: 'center' },
  chat: { padding: Espacio.xl, gap: Espacio.l, width: '100%', maxWidth: 560, alignSelf: 'center', flexGrow: 1 },
  yo: { alignSelf: 'flex-end', maxWidth: '85%', borderRadius: Forma.radio, borderBottomRightRadius: 2, paddingHorizontal: Espacio.l, paddingVertical: Espacio.m },
  escribiendo: { flexDirection: 'row', alignItems: 'flex-end', gap: Espacio.s },
  puntos: { flexDirection: 'row', gap: 6, borderWidth: Forma.contorno, borderRadius: Forma.radio, borderBottomLeftRadius: 2, paddingHorizontal: Espacio.l, paddingVertical: Espacio.l },
  punto: { width: 8, height: 8, borderRadius: 4 },
  papel: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 72 },
  estado: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  redactor: { flexDirection: 'row', alignItems: 'flex-end', gap: Espacio.s, paddingHorizontal: Espacio.xl, paddingVertical: Espacio.m, borderTopWidth: 1 },
  campo: { flex: 1, minHeight: 52, maxHeight: 140, borderWidth: Forma.contorno, borderRadius: Forma.radio, paddingHorizontal: Espacio.l, paddingTop: Espacio.m, paddingBottom: Espacio.m },
  enviar: { width: 52, height: 52, borderRadius: 26, borderWidth: Forma.contorno, alignItems: 'center', justifyContent: 'center' },
});
