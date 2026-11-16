import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Entrada } from '@/components/entrada';
import { Hoja } from '@/components/hoja';
import { Icono } from '@/components/icono';
import { BurbujaLuca, Ilustracion } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Movimiento, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { haptica } from '@/lib/haptica';

export default function Conocerte() {
  const tema = useTema();
  const { perfil } = useLuca();
  const [hojaSubir, setHojaSubir] = useState(false);
  const nombre = perfil?.nombre?.split(' ')[0];

  const leer = () => {
    setHojaSubir(false);
    // iOS pierde un push que llega mientras se desmonta el Modal de la hoja: se navega cuando ya se fue.
    setTimeout(() => router.push('/leyendo'), 120);
  };

  return (
    <Pantalla>
      <Entrada indice={0}>
        <Texto tipo="titulo">{nombre ? `Hola, ${nombre}.` : 'Hola.'}</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca
          pose="saluda"
          tamanoLuca={64}
          texto="Para ayudarte con tu plata necesito conocerla. Lo más rápido es tu desprendible de nómina: ahí está cuánto ganas, cuándo te pagan y qué te descuentan."
        />
      </Entrada>

      <View style={estilos.opciones}>
        <Entrada indice={2}>
          <Opcion
            titulo="Subir mi desprendible"
            detalle="Una foto o el PDF. Lo leo en segundos."
            principal
            onPress={() => setHojaSubir(true)}
            ilustracion={<Ilustracion nombre="objetos/desprendible" ancho={72} />}
          />
        </Entrada>
        <Entrada indice={3}>
          <Opcion titulo="Conectar mi banco" detalle="Para que no tengas que subir nada." proximamente />
        </Entrada>
        <Entrada indice={4}>
          <Boton titulo="Prefiero contarte yo" variante="texto" onPress={() => router.push('/preguntas')} />
        </Entrada>
      </View>

      <Entrada indice={5} style={estilos.candado}>
        <Icono nombre="candado" tamano={18} color={tema.textoSuave} />
        <Texto tipo="pequeno" suave style={{ flex: 1 }}>
          Solo lo uso para explicarte. No muevo tu plata ni se la paso a nadie.
        </Texto>
      </Entrada>

      <Hoja visible={hojaSubir} alCerrar={() => setHojaSubir(false)} titulo="Sube tu desprendible">
        <Texto suave>El de este mes o el último que tengas.</Texto>
        {/* Datos de muestra: el selector de archivos real llega con la API (paso 5). */}
        <Pressable
          onPress={leer}
          accessibilityRole="button"
          accessibilityLabel="desprendible-nov-2026.pdf, en Descargas, de hace 2 días"
          style={({ pressed }) => [estilos.archivo, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
          <View style={[estilos.pdf, { backgroundColor: tema.maiz, borderColor: tema.linea }]}>
            <Texto tipo="pequeno" color={tema.sobreMaiz} style={{ fontFamily: 'BricolageGrotesque_800ExtraBold' }}>
              PDF
            </Texto>
          </View>
          <View style={{ flex: 1 }}>
            <Texto tipo="cuerpoFuerte">desprendible-nov-2026.pdf</Texto>
            <Texto tipo="pequeno" suave>
              Descargas · hace 2 días
            </Texto>
          </View>
        </Pressable>
        <Boton titulo="Tomar una foto" variante="secundario" icono={<Icono nombre="camara" tamano={20} color={tema.sobreVerde} />} onPress={leer} />
      </Hoja>
    </Pantalla>
  );
}

type OpcionProps = {
  titulo: string;
  detalle: string;
  principal?: boolean;
  proximamente?: boolean;
  ilustracion?: React.ReactNode;
  onPress?: () => void;
};

/** Opción grande de la bienvenida. La principal lleva la sombra sólida y se hunde al tocarla. */
function Opcion({ titulo, detalle, principal, proximamente, ilustracion, onPress }: OpcionProps) {
  const tema = useTema();
  const bajada = useSharedValue(0);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateY: bajada.value }] }));
  return (
    <Pressable
      disabled={proximamente}
      onPress={() => (haptica.toque(), onPress?.())}
      onPressIn={() => (bajada.set(withSpring(Forma.sombra, Movimiento.resorteVivo)))}
      onPressOut={() => (bajada.set(withSpring(0, Movimiento.resorteVivo)))}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!proximamente }}
      accessibilityLabel={`${titulo}. ${detalle}${proximamente ? ' Próximamente.' : ''}`}
      style={{ paddingBottom: Forma.sombra }}>
      {principal ? <View style={[estilos.sombra, { backgroundColor: tema.linea }]} /> : null}
      <Animated.View
        style={[
          estilos.opcion,
          {
            backgroundColor: principal ? tema.papel : tema.superficie,
            borderColor: proximamente ? tema.lineaSuave : tema.linea,
            borderStyle: proximamente ? 'dashed' : 'solid',
          },
          principal && animado,
        ]}>
        <View style={{ flex: 1, gap: 4 }}>
          {proximamente ? (
            <View style={[estilos.pildora, { borderColor: tema.textoSuave }]}>
              <Texto tipo="pequeno" suave>
                Próximamente
              </Texto>
            </View>
          ) : null}
          <Texto tipo="titulo3">{titulo}</Texto>
          <Texto tipo="pequeno" suave>
            {detalle}
          </Texto>
        </View>
        {ilustracion}
        {principal ? <Icono nombre="flecha" tamano={22} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  opciones: { gap: Espacio.m },
  opcion: { borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.l, flexDirection: 'row', alignItems: 'center', gap: Espacio.m, minHeight: 88 },
  sombra: { position: 'absolute', left: 0, right: 0, top: Forma.sombra, bottom: 0, borderRadius: Forma.radio },
  pildora: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 1, marginBottom: 2 },
  candado: { flexDirection: 'row', gap: Espacio.s, alignItems: 'flex-start', marginTop: 'auto' },
  archivo: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 64 },
  pdf: { width: 44, height: 52, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
