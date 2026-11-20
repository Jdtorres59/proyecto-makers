import type { TipoDocumento } from '@makers/core';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { HojaSubir } from '@/components/hoja-subir';
import { Icono } from '@/components/icono';
import { BurbujaLuca, Luca } from '@/components/luca';
import { Cabecera, Grano, ocultaEnWeb } from '@/components/pantalla';
import { useIsFocused } from 'expo-router/react-navigation';
import { Pdf } from '@/components/pdf';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Movimiento, Tipo, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { comoProblema, type ProblemaLuca } from '@/lib/datos/errores';
import type { Archivo } from '@/lib/datos/fuente';
import { haptica } from '@/lib/haptica';

const PAPELES: { cual: 'extracto' | 'oferta'; pista: TipoDocumento; titulo: string }[] = [
  { cual: 'extracto', pista: 'extracto', titulo: 'Extracto de la tarjeta' },
  { cual: 'oferta', pista: 'oferta_credito', titulo: 'Oferta del préstamo' },
];
const RESPUESTA_SIN_MODELO = 'Entiendo. Miremos los caminos con tus números antes de decidir.';

/** "Tengo una decisión": la persona cuenta con sus palabras y Luca le pide los papeles para verlo con sus números. */
export default function Decidir() {
  const tema = useTema();
  const reducido = useReducedMotion();
  const enfocada = useIsFocused();
  const { leerDocumento, iniciarDecision, conversar, guardarPapel, papeles, documentos, demo } = useLuca();
  const scroll = useRef<ScrollViewInstance>(null);
  const [texto, setTexto] = useState(demo ? 'Debo $2.400.000 en la tarjeta y no sé si pagar el mínimo, diferir a cuotas o pedir un préstamo.' : '');
  const [enviado, setEnviado] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [respondio, setRespondio] = useState(false);
  const [problema, setProblema] = useState<ProblemaLuca | null>(null);
  const [hojaPara, setHojaPara] = useState<(typeof PAPELES)[number] | null>(null);
  const [subiendo, setSubiendo] = useState<'extracto' | 'oferta' | null>(null);
  const [problemaPapel, setProblemaPapel] = useState<ProblemaLuca | null>(null);

  useEffect(() => {
    const id = setTimeout(() => scroll.current?.scrollToEnd({ animated: !reducido }), 120);
    return () => clearTimeout(id);
  }, [enviado, respondio, respuesta, papeles, reducido]);

  const enviar = async () => {
    const mensaje = texto.trim();
    if (!mensaje) return;
    haptica.firme();
    setProblema(null);
    setEnviado(mensaje);
    let decisionId: string;
    try {
      decisionId = (await iniciarDecision(mensaje)).id;
    } catch (e) {
      setProblema(comoProblema(e));
      setEnviado(null);
      return;
    }
    // La conversación es un acompañamiento: si el modelo no responde (tope, red), los caminos igual se pueden ver.
    try {
      let dicho = '';
      await conversar(decisionId, mensaje, [], (ev) => {
        if (ev.tipo === 'texto') setRespuesta((dicho += ev.delta));
        if (ev.tipo === 'fin' && ev.estado !== 'ok' && !dicho.trim()) setRespuesta(RESPUESTA_SIN_MODELO);
      });
      if (!dicho.trim()) setRespuesta(RESPUESTA_SIN_MODELO);
    } catch (e) {
      const p = comoProblema(e);
      setProblema(p.tipo === 'tope' ? p : null);
      setRespuesta(RESPUESTA_SIN_MODELO);
    }
    setRespondio(true);
  };

  const subir = async (papel: (typeof PAPELES)[number], archivo: Archivo) => {
    setProblemaPapel(null);
    setSubiendo(papel.cual);
    try {
      const doc = await leerDocumento({ ...archivo, pista: papel.pista });
      guardarPapel(papel.cual, doc.id);
    } catch (e) {
      setProblemaPapel(comoProblema(e));
    } finally {
      setSubiendo(null);
    }
  };
  const nombreDe = (id: string | null) => documentos.find((d) => d.id === id)?.titulo ?? 'Listo';
  const listos = !!papeles.extracto && !!papeles.oferta;

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: tema.fondo }, ocultaEnWeb(enfocada)]}>
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
          {enviado && !respuesta ? <Escribiendo /> : null}
          {respuesta ? <BurbujaLuca pose="explica" texto={respuesta} sinVoz /> : null}
          {problema ? <Aviso texto={problema.mensaje} /> : null}
          {respondio ? (
            <Animated.View entering={FadeIn} style={{ gap: Espacio.m }}>
              <BurbujaLuca
                pose="explica"
                texto={['Para mostrarte qué implica cada camino con tus números necesito dos papeles: ', { fuerte: 'el extracto de la tarjeta' }, ' y ', { fuerte: 'la oferta del préstamo' }, '.']}
              />
              {PAPELES.map((p) => {
                const id = papeles[p.cual];
                const listo = !!id;
                return (
                  <Pressable
                    key={p.cual}
                    onPress={() => (haptica.toque(), setHojaPara(p))}
                    disabled={listo || !!subiendo}
                    accessibilityRole="button"
                    accessibilityLabel={`${p.titulo}. ${listo ? 'Subido' : 'Toca para subirlo'}`}
                    style={({ pressed }) => [estilos.papel, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
                    <Pdf />
                    <View style={{ flex: 1 }}>
                      <Texto tipo="cuerpoFuerte">{p.titulo}</Texto>
                      <Texto tipo="pequeno" suave numberOfLines={2}>
                        {listo ? nombreDe(id) : subiendo === p.cual ? 'Leyendo…' : 'Toca para subirlo'}
                      </Texto>
                    </View>
                    <View style={[estilos.estado, { borderColor: tema.linea, backgroundColor: listo ? tema.verde : 'transparent' }]}>
                      {listo ? <Icono nombre="check" tamano={18} color={tema.sobreVerde} /> : <Icono nombre="subir" tamano={18} />}
                    </View>
                  </Pressable>
                );
              })}
              {problemaPapel ? <Aviso texto={problemaPapel.mensaje} /> : null}
              <Boton titulo="Leer mis papeles" disabled={!listos} onPress={() => router.replace('/decision/leyendo')} />
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
              onPress={() => void enviar()}
              accessibilityRole="button"
              accessibilityLabel="Enviar"
              disabled={!texto.trim()}
              style={({ pressed }) => [estilos.enviar, { backgroundColor: tema.maiz, borderColor: tema.linea, opacity: texto.trim() ? 1 : 0.45, transform: [{ translateY: pressed ? 2 : 0 }] }]}>
              <Icono nombre="enviar" tamano={22} color={tema.sobreMaiz} />
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
      <HojaSubir
        visible={!!hojaPara}
        alCerrar={() => setHojaPara(null)}
        titulo={hojaPara?.titulo ?? ''}
        texto={hojaPara?.cual === 'extracto' ? 'El extracto más reciente de tu tarjeta.' : 'La oferta del préstamo que te hicieron.'}
        demo={demo}
        pistas={hojaPara ? [hojaPara.pista] : []}
        alElegir={(a) => hojaPara && subir(hojaPara, a)}
      />
      <Grano />
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
