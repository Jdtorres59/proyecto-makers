import type { Modulo } from '@makers/core';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Entrada } from '@/components/entrada';
import { Icono } from '@/components/icono';
import { Ilustracion, Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Fuente, Movimiento, useTema } from '@/constants/tema';
import type { NombreAsset } from '@/lib/assets';
import { etapaDeCrecimiento, moduloAbierto, moduloTerminado, useLuca } from '@/lib/datos/contexto';
import { haptica } from '@/lib/haptica';

/** Los 12 módulos del núcleo como camino. Luca crece con cada módulo terminado. */
export default function Aprender() {
  const tema = useTema();
  const { modulos, progreso, decision, verBorradores, alternarBorradores } = useLuca();
  const terminados = modulos.filter((m) => moduloTerminado(m, progreso)).length;
  const etapa = etapaDeCrecimiento(terminados);

  return (
    <Pantalla conPestanas>
      <Entrada indice={0}>
        <Texto tipo="titulo">Aprender</Texto>
      </Entrada>

      <Entrada indice={1}>
        <Tarjeta style={estilos.crecer}>
          <Luca nombre={`crecimiento/${etapa}`} tamano={104} />
          <View style={{ flex: 1, gap: Espacio.s }}>
            <Texto tipo="titulo3">
              {terminados === 0 ? 'Luca es una semilla' : terminados === modulos.length ? 'Luca ya es un árbol' : 'Luca está creciendo'}
            </Texto>
            <Texto tipo="pequeno" suave>
              {terminados} de {modulos.length} módulos. Cada módulo que termines le suma hojas.
            </Texto>
            <View
              style={[estilos.barra, { borderColor: tema.linea, backgroundColor: tema.fondo }]}
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel={`${terminados} de ${modulos.length} módulos terminados`}
              accessibilityValue={{ min: 0, max: modulos.length, now: terminados }}>
              <View style={{ width: `${(terminados / (modulos.length || 12)) * 100}%`, height: '100%', backgroundColor: tema.verde }} />
            </View>
          </View>
        </Tarjeta>
      </Entrada>

      <Entrada indice={2}>
        <TarjetaDecision decidido={decision?.caminoElegido ?? null} />
      </Entrada>

      {alternarBorradores ? (
        <Entrada indice={3}>
          <View style={[estilos.dev, { borderColor: tema.lineaSuave }]}>
            <Texto tipo="pequeno" suave style={{ flex: 1 }}>
              Desarrollo: abrir los módulos sin publicar
            </Texto>
            <Switch
              value={verBorradores}
              onValueChange={alternarBorradores}
              accessibilityLabel="Abrir los módulos sin publicar, solo en desarrollo"
              trackColor={{ true: tema.verde, false: tema.lineaSuave }}
            />
          </View>
          <Boton
            titulo="Desarrollo: ver los ocho tipos de paso"
            variante="texto"
            onPress={() => router.push({ pathname: '/leccion/[modulo]/[leccion]', params: { modulo: 'prueba', leccion: 'todos' } })}
          />
        </Entrada>
      ) : null}

      <Entrada indice={4}>
        <Texto tipo="titulo3" role="heading">
          Tu camino
        </Texto>
      </Entrada>
      <View>
        {modulos.map((m, i) => (
          <Entrada key={m.id} indice={5 + i}>
            <Nodo modulo={m} ultimo={i === modulos.length - 1} />
          </Entrada>
        ))}
      </View>
    </Pantalla>
  );
}

function Nodo({ modulo: m, ultimo }: { modulo: Modulo; ultimo: boolean }) {
  const tema = useTema();
  const { progreso, verBorradores } = useLuca();
  const abierto = moduloAbierto(m, verBorradores);
  const terminado = moduloTerminado(m, progreso);
  const hechas = m.lecciones.filter((l) => progreso.leccionesTerminadas.includes(l.id)).length;
  const bajada = useSharedValue(0);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateY: bajada.value }] }));
  const estado = terminado
    ? 'Terminado'
    : !abierto
      ? 'Lo estamos escribiendo'
      : hechas
        ? `${hechas} de ${m.lecciones.length} lecciones`
        : `${m.lecciones.length} lecciones`;

  return (
    <View style={estilos.nodoFila}>
      <View style={estilos.columnaNodo}>
        <View style={[estilos.numero, { backgroundColor: terminado ? tema.verde : abierto ? tema.maiz : tema.superficie, borderColor: tema.linea }]}>
          {terminado ? (
            <Icono nombre="check" tamano={18} color={tema.sobreVerde} />
          ) : (
            <Texto tipo="cuerpoFuerte" esCifra color={abierto ? tema.sobreMaiz : tema.textoSuave}>
              {m.orden}
            </Texto>
          )}
        </View>
        {!ultimo ? <View style={[estilos.hilo, { backgroundColor: terminado ? tema.verde : tema.lineaSuave }]} /> : null}
      </View>
      <Pressable
        disabled={!abierto}
        onPress={() => (haptica.toque(), router.push({ pathname: '/modulo/[id]', params: { id: m.id } }))}
        onPressIn={() => bajada.set(withSpring(2, Movimiento.resorteVivo))}
        onPressOut={() => bajada.set(withSpring(0, Movimiento.resorteVivo))}
        accessibilityRole="button"
        aria-disabled={!abierto}
        accessibilityLabel={`Módulo ${m.orden}: ${m.titulo}. ${estado}`}
        style={{ flex: 1, paddingBottom: Espacio.l }}>
        <Animated.View style={[estilos.nodo, { backgroundColor: abierto ? tema.papel : tema.fondo, borderColor: abierto ? tema.linea : tema.lineaSuave }, animado]}>
          <View style={{ opacity: abierto ? 1 : 0.55 }}>
            <Ilustracion nombre={`portadas/${m.portada}` as NombreAsset} ancho={96} alto={64} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Texto tipo="cuerpoFuerte">{m.titulo}</Texto>
            <View style={estilos.estado}>
              {!abierto ? <Icono nombre="candado" tamano={14} color={tema.textoSuave} /> : null}
              <Texto tipo="pequeno" suave>
                {estado}
              </Texto>
            </View>
          </View>
          {terminado ? <Ilustracion nombre={`medallas/${m.medalla}` as NombreAsset} ancho={40} /> : null}
        </Animated.View>
      </Pressable>
    </View>
  );
}

/** "Convierte una decisión en lección": la decisión de plata vive también en Aprender. */
function TarjetaDecision({ decidido }: { decidido: string | null }) {
  const tema = useTema();
  return (
    <Pressable
      onPress={() => (haptica.toque(), router.push(decidido ? { pathname: '/decision/caminos', params: { revisar: '1' } } : '/decision'))}
      accessibilityRole="button"
      accessibilityLabel={decidido ? `Tu decisión: ${decidido}. Revisarla` : 'Convierte una decisión en lección. Cuéntame qué pasa y súbeme tus papeles'}
      style={({ pressed }) => [estilos.decision, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
      <Luca pose={decidido ? 'pulgar' : 'muestra'} tamano={56} gesto="quieto" />
      <View style={{ flex: 1, gap: 2 }}>
        <Texto tipo="cuerpoFuerte">{decidido ? '¿Mínimo, diferir o préstamo?' : 'Convierte una decisión en lección'}</Texto>
        <Texto tipo="pequeno" suave>
          {decidido ? `Decidiste: ${decidido.toLowerCase()}` : 'Cuéntame qué pasa y súbeme tus papeles'}
        </Texto>
      </View>
      {decidido ? (
        <View style={[estilos.pildora, { backgroundColor: tema.verde }]}>
          <Texto tipo="pequeno" color={tema.sobreVerde} style={{ fontFamily: Fuente.negrita }}>
            Tuya
          </Texto>
        </View>
      ) : (
        <Icono nombre="flecha" tamano={22} />
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  barra: { height: 12, borderRadius: 6, borderWidth: 2, overflow: 'hidden' },
  crecer: { flexDirection: 'row', alignItems: 'center', gap: Espacio.l },
  dev: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: Forma.radio, paddingHorizontal: Espacio.m, minHeight: 52 },
  nodoFila: { flexDirection: 'row', gap: Espacio.m },
  columnaNodo: { alignItems: 'center', width: 36 },
  numero: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: Espacio.l },
  hilo: { width: 3, flex: 1, borderRadius: 2, marginTop: 4 },
  nodo: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.s, minHeight: 80 },
  estado: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  decision: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 72 },
  pildora: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
});
