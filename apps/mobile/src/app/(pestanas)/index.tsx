import { diasTrabajados, type EventoDePlata, formatearCOP } from '@makers/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Cifra } from '@/components/cifra';
import { Entrada } from '@/components/entrada';
import { Hoja } from '@/components/hoja';
import { Icono } from '@/components/icono';
import { LoQueViene } from '@/components/lo-que-viene';
import { BurbujaLuca, Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Wordmark } from '@/components/wordmark';
import { Espacio, Forma, Fuente, Movimiento, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { diasHasta, fechaCorta, fechaLarga } from '@/lib/fechas';
import { haptica } from '@/lib/haptica';

/** Lo que dice cada fecha debajo del título en "Lo que viene". */
function detalle(e: EventoDePlata, empresa: string | null, cuotas: Map<string, number | null>) {
  switch (e.tipo) {
    case 'sueldo':
      return empresa?.replace(/ S\.A\.S\.?$/, '') ?? 'Tu empresa';
    case 'prima':
      return 'Todavía sin plan';
    case 'intereses_cesantias':
      return 'Llegan a tu cuenta';
    case 'cesantias':
      return 'Van a tu fondo, no a tu cuenta';
    case 'cuota': {
      const quedan = cuotas.get(e.titulo);
      return quedan ? `Te quedan ${quedan}` : 'Cuota del mes';
    }
    default:
      return '';
  }
}

export default function Inicio() {
  const tema = useTema();
  const { perfil, eventos, hoy } = useLuca();
  const [hoja, setHoja] = useState<'prima' | 'decision' | null>(null);
  if (!perfil) return null;

  const prima = eventos.find((e) => e.tipo === 'prima');
  const dias = prima ? diasHasta(prima.fecha, hoy) : 0;
  const diasSemestre = prima && perfil.fechaIngreso ? diasTrabajados(perfil.fechaIngreso, `${prima.fecha.slice(0, 4)}-07-01`, `${prima.fecha.slice(0, 4)}-12-31`) : 0;
  const cuotas = new Map(perfil.deudas.map((d) => [`Cuota: ${d.nombre}`, d.cuotasRestantes]));
  const items = eventos.map((e) => ({
    ...e,
    titulo: e.tipo === 'cuota' ? e.titulo.replace('Cuota: ', 'Cuota del ').replace('del Celular', 'del celular') : e.titulo,
    detalle: detalle(e, perfil.empresa, cuotas),
    destacado: e.tipo === 'prima',
  }));
  const { dia: diaHoy, mes: mesHoy } = fechaCorta(hoy);
  const inicial = perfil.nombre?.trim()[0]?.toUpperCase() ?? '?';

  return (
    <Pantalla conPestanas>
      <Entrada indice={0} style={estilos.saludo}>
        <Wordmark tamano={34} />
        <Pressable
          onPress={() => router.navigate('/yo')}
          accessibilityRole="button"
          accessibilityLabel="Lo que Luca sabe de ti"
          style={({ pressed }) => [estilos.avatar, { backgroundColor: pressed ? tema.superficie : tema.papel, borderColor: tema.linea }]}>
          <Texto tipo="titulo3">{inicial}</Texto>
        </Pressable>
      </Entrada>

      <Entrada indice={1}>
        <BurbujaLuca
          texto={
            prima
              ? [`En ${dias} días te llega tu primera prima. Vale la pena decidir qué hacer con ella `, { fuerte: 'antes de que llegue' }, '.']
              : 'Cuando me muestres tu desprendible te digo qué viene en tu plata.'
          }
        />
      </Entrada>

      {prima ? (
        <Entrada indice={2}>
          <Tarjeta variante="maiz" style={estilos.prima}>
            <View style={[estilos.pildora, { borderColor: tema.sobreMaiz }]}>
              <Icono nombre="calendario" tamano={16} color={tema.sobreMaiz} />
              <Texto tipo="pequeno" color={tema.sobreMaiz} style={{ fontFamily: Fuente.negrita }}>
                {fechaCorta(prima.fecha).dia} {fechaCorta(prima.fecha).mes} · Tu prima
              </Texto>
            </View>
            {prima.monto !== null ? (
              <Cifra valor={prima.monto} tamano={48} color={tema.sobreMaiz} demora={350} />
            ) : (
              <Texto tipo="titulo" color={tema.sobreMaiz}>
                No lo sé todavía
              </Texto>
            )}
            <Texto color={tema.sobreMaiz}>
              Llega en {dias} días. Es lo proporcional a los {diasSemestre} días que llevas este semestre.
            </Texto>
            <Boton titulo="Cómo se calcula" variante="tinta" onPress={() => setHoja('prima')} />
          </Tarjeta>
        </Entrada>
      ) : null}

      <Entrada indice={3}>
        <TarjetaDecision onPress={() => setHoja('decision')} />
      </Entrada>

      <Entrada indice={4} style={estilos.seccion}>
        <Texto tipo="titulo3" role="heading">
          Lo que viene
        </Texto>
        <Texto tipo="pequeno" suave>
          Hoy, {diaHoy} {mesHoy}
        </Texto>
      </Entrada>
      {items.length ? (
        <LoQueViene items={items} desde={5} />
      ) : (
        <Texto suave>Aquí van a salir tu sueldo, tu prima y tus cuotas cuando sepa de ellos.</Texto>
      )}

      <Entrada indice={6 + items.length} style={{ gap: Espacio.m }}>
        <Texto tipo="titulo3" role="heading">
          Sigue aprendiendo
        </Texto>
        <FilaEnlace titulo="Aprender" detalle="Doce módulos cortos para entender tu plata. Los estamos escribiendo." onPress={() => router.navigate('/aprender')} />
      </Entrada>

      <Hoja visible={hoja === 'prima'} alCerrar={() => setHoja(null)} titulo="Cómo se calcula tu prima">
        {prima && perfil.salario !== null ? (
          <>
            <Texto suave>La prima es un salario por cada 360 días trabajados. Se paga en dos partes al año; la de diciembre cubre de julio a diciembre.</Texto>
            <Tarjeta style={{ gap: Espacio.s }}>
              <Linea etiqueta="Tu salario" valor={formatearCOP(perfil.salario)} />
              <Linea etiqueta="Días de este semestre" valor={`× ${diasSemestre}`} />
              <Linea etiqueta="Año de la prima" valor="÷ 360" />
              <View style={{ height: 2, backgroundColor: tema.linea, marginVertical: 2 }} />
              <Linea etiqueta="Tu prima" valor={prima.monto !== null ? formatearCOP(prima.monto) : 'No lo sé todavía'} fuerte />
            </Tarjeta>
            <Texto tipo="pequeno" suave>
              Te la deben pagar a más tardar el {fechaLarga(prima.fecha)}.
            </Texto>
          </>
        ) : null}
      </Hoja>
      <Hoja visible={hoja === 'decision'} alCerrar={() => setHoja(null)} titulo="Tu decisión de plata">
        <View style={{ flexDirection: 'row', gap: Espacio.m, alignItems: 'center' }}>
          <Luca pose="explica" tamano={72} gesto="quieto" />
          <Texto style={{ flex: 1 }}>
            Aquí me vas a contar lo que estás pensando y lo miramos juntos con tus números. Decides tú. Llega en la próxima versión.
          </Texto>
        </View>
        <Boton titulo="Entendido" onPress={() => setHoja(null)} />
      </Hoja>
    </Pantalla>
  );
}

function TarjetaDecision({ onPress }: { onPress(): void }) {
  const tema = useTema();
  const bajada = useSharedValue(0);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateY: bajada.value }] }));
  return (
    <Pressable
      onPress={() => (haptica.toque(), onPress())}
      onPressIn={() => (bajada.set(withSpring(Forma.sombra, Movimiento.resorteVivo)))}
      onPressOut={() => (bajada.set(withSpring(0, Movimiento.resorteVivo)))}
      accessibilityRole="button"
      accessibilityLabel="¿Tienes una decisión de plata? Debo y no sé cómo pagar, me ofrecieron un crédito, no sé si diferir"
      style={{ paddingBottom: Forma.sombra }}>
      <View style={[estilos.sombra, { backgroundColor: tema.linea }]} />
      <Animated.View style={[estilos.decision, { backgroundColor: tema.papel, borderColor: tema.linea }, animado]}>
        <Luca pose="explica" tamano={56} gesto="quieto" />
        <View style={{ flex: 1, gap: 2 }}>
          <Texto tipo="titulo3">¿Tienes una decisión de plata?</Texto>
          <Texto tipo="pequeno" suave>
            Debo y no sé cómo pagar, me ofrecieron un crédito, no sé si diferir...
          </Texto>
        </View>
        <Icono nombre="flecha" tamano={22} />
      </Animated.View>
    </Pressable>
  );
}

function FilaEnlace({ titulo, detalle, onPress }: { titulo: string; detalle: string; onPress(): void }) {
  const tema = useTema();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${detalle}`}
      style={({ pressed }) => [estilos.enlace, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
      <Luca nombre="crecimiento/0-semilla" tamano={52} gesto="quieto" />
      <View style={{ flex: 1, gap: 2 }}>
        <Texto tipo="cuerpoFuerte">{titulo}</Texto>
        <Texto tipo="pequeno" suave>
          {detalle}
        </Texto>
      </View>
      <Icono nombre="flecha" tamano={22} />
    </Pressable>
  );
}

function Linea({ etiqueta, valor, fuerte }: { etiqueta: string; valor: string; fuerte?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: Espacio.m }}>
      <Texto tipo={fuerte ? 'cuerpoFuerte' : 'cuerpo'} style={{ flexShrink: 1 }}>
        {etiqueta}
      </Texto>
      <Texto tipo={fuerte ? 'titulo3' : 'cuerpoFuerte'} esCifra>
        {valor}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  saludo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: Forma.contorno, alignItems: 'center', justifyContent: 'center' },
  prima: { gap: Espacio.m, padding: Espacio.xl - 4 },
  pildora: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  decision: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m },
  sombra: { position: 'absolute', left: 0, right: 0, top: Forma.sombra, bottom: 0, borderRadius: Forma.radio },
  seccion: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: -Espacio.s },
  enlace: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 72 },
});
