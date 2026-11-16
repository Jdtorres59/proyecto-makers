import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { RenglonDocumento } from '@/components/documento';
import { Entrada } from '@/components/entrada';
import { Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { fechaLarga } from '@/lib/fechas';
import { haptica } from '@/lib/haptica';

const ESTADOS = ['Buscando tu salario', 'Revisando tus descuentos', 'Calculando tus fechas', 'Listo'];

/** Luca lee el desprendible: un haz recorre el papel y cada renglón se marca cuando lo entiende. */
export default function Leyendo() {
  const tema = useTema();
  const reducido = useReducedMotion();
  const { documento, perfil, leerDesprendible } = useLuca();
  const [leidos, setLeidos] = useState(0);
  const haz = useSharedValue(0);
  const [altoPapel, setAltoPapel] = useState(0);

  useEffect(() => {
    leerDesprendible();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!reducido) haz.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }), -1, true));
  }, [reducido, haz]);

  const total = documento?.renglones.length ?? 0;
  useEffect(() => {
    if (!documento) return;
    const paso = reducido ? 250 : 650;
    const ids = documento.renglones.map((_, i) => setTimeout(() => (setLeidos(i + 1), haptica.eleccion()), 300 + i * paso));
    ids.push(setTimeout(() => router.replace('/confirmar'), 300 + total * paso + 700));
    return () => ids.forEach(clearTimeout);
  }, [documento, reducido, total]);

  const hazAnimado = useAnimatedStyle(() => ({ transform: [{ translateY: haz.value * Math.max(0, altoPapel - 28) }] }));
  const estado = ESTADOS[Math.min(ESTADOS.length - 1, Math.floor((leidos / Math.max(1, total)) * (ESTADOS.length - 1)))];

  return (
    <Pantalla>
      <Entrada indice={0} style={{ gap: 4 }}>
        <Texto tipo="pequeno" suave>
          desprendible-nov-2026.pdf
        </Texto>
        <Texto tipo="titulo2">Leyendo tu desprendible</Texto>
      </Entrada>

      <Entrada indice={1}>
        <View onLayout={(e) => setAltoPapel(e.nativeEvent.layout.height)}>
          <Tarjeta style={{ gap: Espacio.m }}>
            <View style={{ gap: 2 }}>
              <Texto tipo="titulo3">{documento?.titulo ?? ' '}</Texto>
              <Texto tipo="pequeno" suave>
                Comprobante de nómina · {documento?.periodo ?? ''}
              </Texto>
            </View>
            <View style={estilos.meta}>
              <Meta etiqueta="Cargo" valor={perfil?.cargo ?? ' '} />
              <Meta etiqueta="Fecha de ingreso" valor={perfil?.fechaIngreso ? fechaLarga(perfil.fechaIngreso) : ' '} />
            </View>
            <View>
              {documento?.renglones.map((r, i) => (
                <RenglonDocumento key={r.clave} renglon={r} leido={i < leidos} total={r.clave === 'neto'} />
              ))}
            </View>
          </Tarjeta>
          {!reducido && leidos < total ? (
            <Animated.View pointerEvents="none" style={[estilos.haz, { backgroundColor: tema.maiz, borderColor: tema.linea }, hazAnimado]} />
          ) : null}
        </View>
      </Entrada>

      <View style={estilos.estado} accessibilityRole="text" accessibilityLiveRegion="polite" accessibilityLabel={estado}>
        <Luca pose="lee" tamano={64} latido={leidos} />
        <Texto tipo="cuerpoFuerte">{estado}</Texto>
      </View>
    </Pantalla>
  );
}

function Meta({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={{ flexGrow: 1, flexBasis: 130 }}>
      <Texto tipo="pequeno" suave>
        {etiqueta}
      </Texto>
      <Texto tipo="cuerpoFuerte">{valor}</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.m },
  haz: { position: 'absolute', left: -6, right: -6, top: 0, height: 28, opacity: 0.28, borderRadius: 4, borderWidth: 1 },
  estado: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, marginTop: 'auto' },
});
