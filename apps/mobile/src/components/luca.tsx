import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Espacio, Forma, Movimiento, Tipo, useTema } from '@/constants/tema';
import { asset, familiaDe, type NombreAsset, type Pose } from '@/lib/assets';

import { MarcoGrabado } from './marco-grabado';
import { Texto } from './texto';

type Gesto = 'entra' | 'saluda' | 'celebra' | 'quieto';

type IlustracionProps = { nombre: NombreAsset; ancho: number; alto?: number };

/** Una ilustración de la biblioteca por nombre; si todavía no existe, el marco de grabado. */
export function Ilustracion({ nombre, ancho, alto = ancho }: IlustracionProps) {
  const fuente = asset(nombre);
  const familia = familiaDe(nombre);
  const base = asset('luca/luca-saluda');
  // Una pose o etapa que falta se ve como Luca de siempre sobre la mancha salvia: nunca un hueco.
  if (!fuente && base && (familia === 'luca' || familia === 'crecimiento')) {
    return (
      <View style={{ width: ancho, height: alto, alignItems: 'center', justifyContent: 'center' }}>
        <View style={StyleSheet.absoluteFill}>
          <MarcoGrabado familia={familia} ancho={ancho} alto={alto} />
        </View>
        <Image source={base} style={{ width: ancho * 0.8, height: alto * 0.8 }} contentFit="contain" alt="" />
      </View>
    );
  }
  if (!fuente) return <MarcoGrabado familia={familia} ancho={ancho} alto={alto} />;
  return <Image source={fuente} style={{ width: ancho, height: alto }} contentFit="contain" alt="" />;
}

type Props = {
  pose?: Pose;
  tamano: number;
  gesto?: Gesto;
  /** Cambia este número para que Luca dé un saltico (cuando habla o algo sale bien). */
  latido?: number;
  /** Para crecimiento u otra ilustración que reemplaza la pose. */
  nombre?: NombreAsset;
};

/**
 * Luca, el personaje. Entra con un resorte, saluda meciéndose, celebra saltando y da un saltico cuando habla.
 * Sobre fondo oscuro, si es pequeño, se apoya en un sello redondo de papel claro: el halo de DESIGN.md no alcanzaba
 * para que brazos y piernas en tinta café se distingan del fondo.
 * Es decorativo: lo que dice siempre está en texto.
 */
export function Luca({ pose = 'saluda', tamano, gesto = 'entra', latido = 0, nombre }: Props) {
  const tema = useTema();
  const reducido = useReducedMotion();
  const escala = useSharedValue(reducido ? 1 : 0.7);
  const y = useSharedValue(0);
  const giro = useSharedValue(0);

  useEffect(() => {
    if (reducido) return;
    escala.set(withSpring(1, Movimiento.resorteVivo));
    if (gesto === 'saluda') {
      giro.set(
        withDelay(250, withSequence(withRepeat(withSequence(withTiming(-5, { duration: 260 }), withTiming(4, { duration: 260 })), 3, true), withSpring(0, Movimiento.resorte))),
      );
    }
    if (gesto === 'celebra') {
      y.set(withDelay(200, withRepeat(withSequence(withSpring(-tamano * 0.12, Movimiento.resorteVivo), withSpring(0, Movimiento.resorteVivo)), 2)));
    }
  }, [gesto, reducido, escala, giro, y, tamano]);

  useEffect(() => {
    if (reducido || latido === 0) return;
    y.set(withSequence(withSpring(-tamano * 0.06, Movimiento.resorteVivo), withSpring(0, Movimiento.resorte)));
  }, [latido, reducido, y, tamano]);

  const animado = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { scale: escala.value }, { rotate: `${giro.value}deg` }],
  }));

  const sello = tema.oscuro && tamano <= 160;
  return (
    <View style={{ width: tamano, height: tamano }} accessible={false} importantForAccessibility="no-hide-descendants">
      {sello ? <View style={[estilos.sello, { borderRadius: tamano / 2 }]} /> : null}
      <Animated.View style={[StyleSheet.absoluteFill, animado]}>
        <Ilustracion nombre={nombre ?? `luca/luca-${pose}`} ancho={tamano} />
      </Animated.View>
    </View>
  );
}

/**
 * Lo que Luca dice: el texto aparece palabra por palabra, como si lo estuviera diciendo. Las palabras
 * que faltan ya ocupan su lugar (transparentes), así el bloque no salta. Con "Reducir movimiento" sale completo.
 * Los fragmentos en `fuerte` van en negrita.
 */
export function BurbujaLuca({
  texto,
  pose = 'explica',
  grande,
  tamanoLuca = 56,
  sinVoz,
}: {
  texto: string | (string | { fuerte: string })[];
  pose?: Pose;
  grande?: boolean;
  tamanoLuca?: number;
  /** Texto que ya llega por partes (streaming): se muestra tal cual, sin la voz palabra por palabra. */
  sinVoz?: boolean;
}) {
  const tema = useTema();
  const trozos = (typeof texto === 'string' ? [texto] : texto).map((t) => (typeof t === 'string' ? { t, fuerte: false } : { t: t.fuerte, fuerte: true }));
  const completo = trozos.map((x) => x.t).join('');
  return (
    <View style={estilos.burbujaFila}>
      <Luca pose={pose} tamano={tamanoLuca} latido={sinVoz ? 0 : completo.length} />
      <View style={estilos.burbujaCuerpo}>
        <Texto tipo="pequeno" suave>
          Luca
        </Texto>
        <View style={[estilos.burbuja, { backgroundColor: tema.papel, borderColor: tema.linea }]}>
          {/* La clave reinicia la voz cuando cambia lo que dice. */}
          {sinVoz ? (
            <Texto tipo={grande ? 'titulo3' : 'cuerpo'} accessibilityLiveRegion="polite">
              {completo}
            </Texto>
          ) : (
            <TextoHablado key={completo} trozos={trozos} completo={completo} grande={grande} />
          )}
        </View>
      </View>
    </View>
  );
}

function TextoHablado({ trozos, completo, grande }: { trozos: { t: string; fuerte: boolean }[]; completo: string; grande?: boolean }) {
  const reducido = useReducedMotion();
  const palabras = trozos.flatMap(({ t, fuerte }) => t.split(/(\s+)/).filter(Boolean).map((p) => ({ p, fuerte })));
  const total = palabras.filter((x) => x.p.trim()).length;
  const [dichas, setDichas] = useState(0);

  useEffect(() => {
    if (reducido) return;
    // Textos largos hablan más rápido: nunca más de 1,2 s en total.
    const intervalo = Math.min(Movimiento.palabra, 1200 / Math.max(1, total));
    const id = setInterval(() => setDichas((n) => (n >= total ? n : n + 1)), intervalo);
    return () => clearInterval(id);
  }, [total, reducido]);

  const visibles = reducido ? total : dichas;
  let k = 0;
  return (
    <Texto tipo={grande ? 'titulo3' : 'cuerpo'} accessibilityLabel={completo} accessibilityLiveRegion="polite">
      {palabras.map(({ p, fuerte }, i) => {
        const visible = !p.trim() || k++ < visibles;
        return (
          <Text
            key={i}
            style={[fuerte && { fontFamily: grande ? Tipo.titulo3.fontFamily : Tipo.cuerpoFuerte.fontFamily }, !visible && { color: 'transparent' }]}>
            {p}
          </Text>
        );
      })}
    </Texto>
  );
}

const estilos = StyleSheet.create({
  // Papel claro de DESIGN.md con contorno maíz: un sello que lee bien sobre #1D1812.
  sello: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F6EEDC', borderWidth: 2, borderColor: '#D99A2B', transform: [{ scale: 1.04 }] },
  burbujaFila: { flexDirection: 'row', alignItems: 'flex-end', gap: Espacio.s },
  burbujaCuerpo: { flex: 1, gap: Espacio.xs },
  burbuja: {
    borderWidth: Forma.contorno,
    borderRadius: Forma.radio,
    borderBottomLeftRadius: 2,
    paddingHorizontal: Espacio.l,
    paddingVertical: Espacio.m,
  },
});
