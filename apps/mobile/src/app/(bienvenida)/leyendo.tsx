import type { DocumentoLeido } from '@makers/core';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { RenglonDocumento } from '@/components/documento';
import { Entrada } from '@/components/entrada';
import { Ilustracion, Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Problema } from '@/components/problema';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { comoProblema, ProblemaLuca } from '@/lib/datos/errores';
import { haptica } from '@/lib/haptica';

const ESTADOS = ['Buscando tu salario', 'Revisando tus descuentos', 'Calculando tus fechas', 'Listo'];

/**
 * Luca lee el desprendible. Mientras la API responde se ve Luca con la lupa; cuando llega la lectura, un haz
 * recorre el papel y cada renglón se marca. Si falla, lo dice claro y deja intentar de nuevo o elegir otro archivo.
 */
export default function Leyendo() {
  const tema = useTema();
  const reducido = useReducedMotion();
  const { leerDesprendible, archivoPendiente } = useLuca();
  const [doc, setDoc] = useState<DocumentoLeido | null>(null);
  const [problema, setProblema] = useState<ProblemaLuca | null>(null);
  const [intento, setIntento] = useState(0);
  const [leidos, setLeidos] = useState(0);
  const haz = useSharedValue(0);
  const [altoPapel, setAltoPapel] = useState(0);

  useEffect(() => {
    let vigente = true;
    leerDesprendible().then(
      (d) => {
        if (!vigente) return;
        // Un papel sin renglones no es un desprendible que Luca entienda.
        if (!d.renglones.length) setProblema(new ProblemaLuca('archivo', 'No encontré un desprendible en ese archivo. Prueba con otro o con una foto más nítida.'));
        else setDoc(d);
      },
      (e) => vigente && setProblema(comoProblema(e)),
    );
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intento]);

  useEffect(() => {
    if (!reducido) haz.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }), -1, true));
  }, [reducido, haz]);

  const total = doc?.renglones.length ?? 0;
  useEffect(() => {
    if (!doc) return;
    const paso = reducido ? 250 : 650;
    const ids = doc.renglones.map((_, i) => setTimeout(() => (setLeidos(i + 1), haptica.eleccion()), 300 + i * paso));
    ids.push(setTimeout(() => router.replace('/confirmar'), 300 + total * paso + 700));
    return () => ids.forEach(clearTimeout);
  }, [doc, reducido, total]);

  const hazAnimado = useAnimatedStyle(() => ({ transform: [{ translateY: haz.value * Math.max(0, altoPapel - 28) }] }));
  const estado = !doc ? 'Leyendo tu documento' : ESTADOS[Math.min(ESTADOS.length - 1, Math.floor((leidos / Math.max(1, total)) * (ESTADOS.length - 1)))];

  if (problema) {
    return (
      <Pantalla>
        <Problema
          problema={problema}
          alReintentar={problema.tipo === 'archivo' ? undefined : () => (setProblema(null), setIntento((n) => n + 1))}
          alVolver={() => router.back()}
          textoVolver="Elegir otro archivo"
        />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Entrada indice={0} style={{ gap: 4 }}>
        <Texto tipo="pequeno" suave numberOfLines={1}>
          {archivoPendiente?.nombre ?? 'desprendible'}
        </Texto>
        <Texto tipo="titulo2">Leyendo tu desprendible</Texto>
      </Entrada>

      {doc ? (
        <Entrada indice={1}>
          <View onLayout={(e) => setAltoPapel(e.nativeEvent.layout.height)}>
            <Tarjeta style={{ gap: Espacio.m }}>
              <View style={{ gap: 2 }}>
                <Texto tipo="titulo3">{doc.titulo}</Texto>
                {doc.periodo ? (
                  <Texto tipo="pequeno" suave>
                    {doc.periodo}
                  </Texto>
                ) : null}
              </View>
              <View>
                {doc.renglones.map((r, i) => (
                  <RenglonDocumento key={r.clave} renglon={r} leido={i < leidos} total={r.clave === 'neto'} />
                ))}
              </View>
            </Tarjeta>
            {!reducido && leidos < total ? (
              <Animated.View pointerEvents="none" style={[estilos.haz, { backgroundColor: tema.maiz, borderColor: tema.linea }, hazAnimado]} />
            ) : null}
          </View>
        </Entrada>
      ) : (
        <Entrada indice={1} style={{ alignItems: 'center' }}>
          <Ilustracion nombre="escenas/leyendo" ancho={240} />
        </Entrada>
      )}

      <View style={estilos.estado} accessibilityRole="text" accessibilityLiveRegion="polite" accessibilityLabel={estado}>
        <Luca pose="lee" tamano={64} latido={leidos} />
        <Texto tipo="cuerpoFuerte" style={{ flex: 1 }}>
          {estado}
        </Texto>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  haz: { position: 'absolute', left: -6, right: -6, top: 0, height: 28, opacity: 0.28, borderRadius: 4, borderWidth: 1 },
  estado: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, marginTop: 'auto' },
});
