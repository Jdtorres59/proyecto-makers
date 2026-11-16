import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RenglonDocumento } from '@/components/documento';
import { Entrada } from '@/components/entrada';
import { Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { haptica } from '@/lib/haptica';
import { useReducedMotion } from 'react-native-reanimated';

const ESTADOS = ['Leyendo tu extracto', 'Revisando la tasa', 'Leyendo la oferta', 'Sumando seguros y plazos'];

/** Luca lee los dos papeles de la decisión, renglón por renglón. */
export default function LeyendoPapeles() {
  const reducido = useReducedMotion();
  const { documentos } = useLuca();
  const papeles = [documentos.find((d) => d.tipo === 'extracto'), documentos.find((d) => d.tipo === 'oferta_credito')].filter((d) => !!d);
  const renglones = papeles.flatMap((d) => d.renglones.map((r) => `${d.id}:${r.clave}`));
  const total = renglones.length;
  const [leidos, setLeidos] = useState(0);

  useEffect(() => {
    const paso = reducido ? 150 : 420;
    const ids = renglones.map((_, i) => setTimeout(() => (setLeidos(i + 1), haptica.eleccion()), 400 + i * paso));
    ids.push(setTimeout(() => router.replace('/decision/caminos'), 900 + total * paso));
    return () => ids.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, reducido]);

  let k = 0;
  const estado = ESTADOS[Math.min(ESTADOS.length - 1, Math.floor((leidos / Math.max(1, total)) * ESTADOS.length))];
  return (
    <Pantalla>
      <Entrada indice={0} style={{ gap: 4 }}>
        <Texto tipo="pequeno" suave>
          2 documentos
        </Texto>
        <Texto tipo="titulo2">Leyendo tus papeles</Texto>
      </Entrada>
      {papeles.map((d, j) => (
        <Entrada key={d.id} indice={1 + j}>
          <Tarjeta style={{ gap: Espacio.s }}>
            <View>
              <Texto tipo="titulo3">{d.titulo}</Texto>
              <Texto tipo="pequeno" suave>
                {d.periodo}
              </Texto>
            </View>
            <View>
              {d.renglones.map((r) => (
                <RenglonDocumento key={r.clave} renglon={r} leido={k++ < leidos} />
              ))}
            </View>
          </Tarjeta>
        </Entrada>
      ))}
      <View style={estilos.estado} accessibilityLiveRegion="polite" accessible accessibilityLabel={estado}>
        <Luca pose="lee" tamano={64} latido={leidos} />
        <Texto tipo="cuerpoFuerte">{estado}</Texto>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({ estado: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, marginTop: 'auto' } });
