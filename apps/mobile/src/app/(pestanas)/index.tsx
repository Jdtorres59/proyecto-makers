import { diasTrabajados, type EventoDePlata } from '@makers/core';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Cifra } from '@/components/cifra';
import { Entrada } from '@/components/entrada';
import { Icono } from '@/components/icono';
import { LoQueViene } from '@/components/lo-que-viene';
import { BurbujaLuca, Ilustracion, Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Wordmark } from '@/components/wordmark';
import { Espacio, Forma, Fuente, Movimiento, useTema } from '@/constants/tema';
import { moduloAbierto, moduloTerminado, useLuca } from '@/lib/datos/contexto';
import type { NombreAsset } from '@/lib/assets';
import { diasHasta, fechaCorta, fechaLarga } from '@/lib/fechas';
import { haptica } from '@/lib/haptica';

/** Lo que dice cada fecha debajo del título en "Lo que viene". */
function detalle(e: EventoDePlata, empresa: string | null, cuotas: Map<string, number | null>, conPlan: boolean) {
  switch (e.tipo) {
    case 'sueldo':
      return empresa?.replace(/ S\.A\.S\.?$/, '') ?? 'Tu empresa';
    case 'prima':
      return conPlan ? 'Ya tiene plan' : 'Todavía sin plan';
    case 'intereses_cesantias':
      return 'Llegan a tu cuenta';
    case 'cesantias':
      return 'Van a tu fondo, no a tu cuenta';
    case 'cuota': {
      const quedan = cuotas.get(e.titulo);
      return quedan ? `Te quedan ${quedan}` : 'Cuota del mes';
    }
    case 'decision':
      return 'Lo decidiste tú';
    default:
      return '';
  }
}

export default function Inicio() {
  const tema = useTema();
  const { perfil, eventos, hoy, planPrima, modulos, progreso, decision, verBorradores } = useLuca();
  if (!perfil) return null;

  const prima = eventos.find((e) => e.tipo === 'prima');
  const dias = prima ? diasHasta(prima.fecha, hoy) : 0;
  const diasSemestre = prima && perfil.fechaIngreso ? diasTrabajados(perfil.fechaIngreso, `${prima.fecha.slice(0, 4)}-07-01`, `${prima.fecha.slice(0, 4)}-12-31`) : 0;
  const cuotas = new Map(perfil.deudas.map((d) => [`Cuota: ${d.nombre}`, d.cuotasRestantes]));
  const items = eventos.map((e) => ({
    ...e,
    titulo: e.tipo === 'cuota' ? e.titulo.replace('Cuota: ', 'Cuota del ').replace('del Celular', 'del celular') : e.titulo,
    detalle: detalle(e, perfil.empresa, cuotas, !!planPrima),
    destacado: e.tipo === 'prima',
  }));
  const { dia: diaHoy, mes: mesHoy } = fechaCorta(hoy);
  // El primer módulo que se puede abrir y no está terminado.
  const siguiente = modulos.find((m) => moduloAbierto(m, verBorradores) && !moduloTerminado(m, progreso));
  const inicial = perfil.nombre?.trim()[0]?.toUpperCase() ?? '?';

  return (
    <Pantalla conPestanas>
      <Entrada indice={0} style={estilos.saludo}>
        <Wordmark alto={34} />
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
              ? planPrima
                ? ['Tu prima ya tiene plan. Lo que sigue: ', { fuerte: 'tus cesantías llegan a tu fondo en febrero' }, '.']
                : [`En ${dias} días te llega tu primera prima. Vale la pena decidir qué hacer con ella `, { fuerte: 'antes de que llegue' }, '.']
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
                {planPrima ? 'Plan listo' : `${fechaCorta(prima.fecha).dia} ${fechaCorta(prima.fecha).mes} · Tu prima`}
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
              {planPrima
                ? `Llega el ${fechaLarga(prima.fecha)} y ya sabes a dónde va cada peso.`
                : `Llega en ${dias} días. Es lo proporcional a los ${diasSemestre} días que llevas este semestre.`}
            </Texto>
            <Boton titulo={planPrima ? 'Ver mi plan' : 'Armemos el plan'} variante="tinta" onPress={() => router.push('/prima')} />
          </Tarjeta>
        </Entrada>
      ) : null}

      <Entrada indice={3}>
        <TarjetaDecision decidido={decision?.caminoElegido ?? null} onPress={() => router.push(decision ? { pathname: '/decision/caminos', params: { revisar: '1' } } : '/decision')} />
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
        {siguiente ? (
          <FilaModulo
            titulo={siguiente.titulo}
            portada={siguiente.portada}
            detalle={`${siguiente.lecciones.filter((l) => progreso.leccionesTerminadas.includes(l.id)).length} de ${siguiente.lecciones.length} lecciones`}
            onPress={() => router.push({ pathname: '/modulo/[id]', params: { id: siguiente.id } })}
          />
        ) : (
          <FilaModulo titulo="Aprender" detalle="Doce módulos cortos para entender tu plata." onPress={() => router.navigate('/aprender')} />
        )}
      </Entrada>

    </Pantalla>
  );
}

function TarjetaDecision({ decidido, onPress }: { decidido: string | null; onPress(): void }) {
  const tema = useTema();
  const bajada = useSharedValue(0);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateY: bajada.value }] }));
  return (
    <Pressable
      onPress={() => (haptica.toque(), onPress())}
      onPressIn={() => (bajada.set(withSpring(Forma.sombra, Movimiento.resorteVivo)))}
      onPressOut={() => (bajada.set(withSpring(0, Movimiento.resorteVivo)))}
      accessibilityRole="button"
      accessibilityLabel={decidido ? `Tu decisión: ${decidido}. Revisarla` : '¿Tienes una decisión de plata? Debo y no sé cómo pagar, me ofrecieron un crédito, no sé si diferir'}
      style={{ paddingBottom: Forma.sombra }}>
      <View style={[estilos.sombra, { backgroundColor: tema.linea }]} />
      <Animated.View style={[estilos.decision, { backgroundColor: tema.papel, borderColor: tema.linea }, animado]}>
        <Luca pose={decidido ? 'pulgar' : 'explica'} tamano={56} gesto="quieto" />
        <View style={{ flex: 1, gap: 2 }}>
          <Texto tipo="titulo3">{decidido ? 'Tu decisión de plata' : '¿Tienes una decisión de plata?'}</Texto>
          <Texto tipo="pequeno" suave>
            {decidido ? `Decidiste: ${decidido.toLowerCase()}. Puedes volver a mirar los caminos.` : 'Debo y no sé cómo pagar, me ofrecieron un crédito, no sé si diferir...'}
          </Texto>
        </View>
        <Icono nombre="flecha" tamano={22} />
      </Animated.View>
    </Pressable>
  );
}

function FilaModulo({ titulo, detalle, portada, onPress }: { titulo: string; detalle: string; portada?: string; onPress(): void }) {
  const tema = useTema();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${detalle}`}
      style={({ pressed }) => [estilos.enlace, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
      {portada ? (
        <Ilustracion nombre={`portadas/${portada}` as NombreAsset} ancho={84} alto={56} />
      ) : (
        <View style={[estilos.fichaIcono, { backgroundColor: tema.maiz, borderColor: tema.linea }]}>
          <Icono nombre="aprender" tamano={26} color={tema.sobreMaiz} />
        </View>
      )}
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

const estilos = StyleSheet.create({
  saludo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: Forma.contorno, alignItems: 'center', justifyContent: 'center' },
  prima: { gap: Espacio.m, padding: Espacio.xl - 4 },
  pildora: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  decision: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m },
  sombra: { position: 'absolute', left: 0, right: 0, top: Forma.sombra, bottom: 0, borderRadius: Forma.radio },
  seccion: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: -Espacio.s },
  fichaIcono: { width: 52, height: 52, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  enlace: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 72 },
});
