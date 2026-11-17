import { formatearCOP, type Paso } from '@makers/core';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Espacio, Forma, Fuente, Movimiento, useTema } from '@/constants/tema';
import { haptica } from '@/lib/haptica';

import { Boton } from './boton';
import { Cifra } from './cifra';
import { Deslizador } from './deslizador';
import { Entrada } from './entrada';
import { Icono } from './icono';
import { BurbujaLuca, Luca } from './luca';
import { Tarjeta } from './tarjeta';
import { Texto } from './texto';

type Props = {
  paso: Paso;
  /** El paso ya permite seguir. */
  alListo(): void;
  /** Para "accion": la persona dice que ya la cumplió. */
  alCumplirAccion?(): void;
};

/** Pinta cualquier paso del contrato `Paso` de packages/core. Un tipo nuevo exige un caso nuevo aquí. */
export function PasoVista({ paso, alListo, alCumplirAccion }: Props) {
  switch (paso.tipo) {
    case 'idea':
      return <Idea paso={paso} alListo={alListo} />;
    case 'opcion_multiple':
      return <OpcionMultiple paso={paso} alListo={alListo} />;
    case 'estimar':
      return <Estimar paso={paso} alListo={alListo} />;
    case 'ordenar':
      return <Ordenar paso={paso} alListo={alListo} />;
    case 'repartir':
      return <Repartir paso={paso} alListo={alListo} />;
    case 'comparar':
      return <Comparar paso={paso} alListo={alListo} />;
    case 'regla':
      return <Regla paso={paso} alListo={alListo} />;
    case 'accion':
      return <Accion paso={paso} alListo={alListo} alCumplir={alCumplirAccion} />;
  }
}

type De<T extends Paso['tipo']> = { paso: Extract<Paso, { tipo: T }>; alListo(): void };

/** Llama alListo una vez al montar: pasos que no piden nada para seguir. */
function useListoAlMontar(alListo: () => void) {
  useEffect(() => {
    alListo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Idea({ paso, alListo }: De<'idea'>) {
  const tema = useTema();
  useListoAlMontar(alListo);
  return (
    <View style={estilos.columna}>
      <Entrada indice={0}>
        <Texto tipo="titulo2">{paso.titulo}</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca texto={paso.texto} pose="explica" />
      </Entrada>
      {paso.tuyo ? (
        <Entrada indice={2}>
          <Tarjeta variante="superficie" style={{ gap: Espacio.xs }}>
            <View style={estilos.fila}>
              <Icono nombre="chispa" tamano={18} color={tema.texto} />
              <Texto tipo="pequeno" style={{ fontFamily: Fuente.negrita }}>
                Con tus números
              </Texto>
            </View>
            <Texto>{paso.tuyo}</Texto>
          </Tarjeta>
        </Entrada>
      ) : null}
    </View>
  );
}

/** Opción grande con su estado: neutra, elegida bien (verde con visto) o mal (tiembla y se apaga). */
function Opcion({ texto, estado, alTocar, deshabilitada }: { texto: string; estado: 'neutra' | 'bien' | 'mal'; alTocar(): void; deshabilitada?: boolean }) {
  const tema = useTema();
  const x = useSharedValue(0);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  useEffect(() => {
    if (estado === 'mal') x.set(withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 70 }), withTiming(-5, { duration: 60 }), withSpring(0, Movimiento.resorte)));
  }, [estado, x]);
  const bien = estado === 'bien';
  return (
    <Pressable onPress={alTocar} disabled={deshabilitada} accessibilityRole="button" accessibilityLabel={texto} accessibilityState={{ selected: bien, disabled: !!deshabilitada }}>
      <Animated.View
        style={[
          estilos.opcion,
          { borderColor: tema.linea, backgroundColor: bien ? tema.verde : tema.papel, opacity: estado === 'mal' ? 0.55 : 1 },
          animado,
        ]}>
        <Texto tipo="cuerpoFuerte" color={bien ? tema.sobreVerde : tema.texto} style={{ flex: 1 }}>
          {texto}
        </Texto>
        {bien ? <Icono nombre="check" tamano={20} color={tema.sobreVerde} /> : estado === 'mal' ? <Icono nombre="cerrar" tamano={18} color={tema.textoSuave} /> : null}
      </Animated.View>
    </Pressable>
  );
}

function OpcionMultiple({ paso, alListo }: De<'opcion_multiple'>) {
  const [malas, setMalas] = useState<string[]>([]);
  const [acerto, setAcerto] = useState(false);
  const elegir = (id: string) => {
    if (id === paso.correcta) {
      haptica.logro();
      setAcerto(true);
      alListo();
    } else {
      haptica.firme();
      setMalas((m) => [...m, id]);
    }
  };
  const nota = acerto ? paso.siAcierta : malas.length ? paso.siFalla : null;
  return (
    <View style={estilos.columna}>
      <Entrada indice={0}>
        <BurbujaLuca texto={paso.pregunta} pose="piensa" grande tamanoLuca={64} />
      </Entrada>
      <Entrada indice={1} style={{ gap: Espacio.s }}>
        {paso.opciones.map((o) => (
          <Opcion
            key={o.id}
            texto={o.texto}
            estado={acerto && o.id === paso.correcta ? 'bien' : malas.includes(o.id) ? 'mal' : 'neutra'}
            deshabilitada={acerto || malas.includes(o.id)}
            alTocar={() => elegir(o.id)}
          />
        ))}
      </Entrada>
      {nota ? (
        <Animated.View key={nota} entering={FadeInDown.springify().damping(Movimiento.resorte.damping)}>
          <Nota texto={nota} bien={acerto} />
        </Animated.View>
      ) : null}
    </View>
  );
}

/** Lo que Luca responde a una respuesta: celebra si acierta, se ve atento si no. */
function Nota({ texto, bien }: { texto: string; bien: boolean }) {
  const tema = useTema();
  return (
    <View style={[estilos.nota, { backgroundColor: tema.superficie, borderColor: tema.linea }]} accessibilityLiveRegion="polite">
      <Luca pose={bien ? 'pulgar' : 'atento'} tamano={52} gesto={bien ? 'celebra' : 'quieto'} />
      <Texto style={{ flex: 1 }}>{texto}</Texto>
    </View>
  );
}

function Estimar({ paso, alListo }: De<'estimar'>) {
  const tema = useTema();
  const inicial = paso.min + Math.round((paso.max - paso.min) * 0.35 / paso.paso) * paso.paso;
  const [apuesta, setApuesta] = useState(inicial);
  const [revelado, setRevelado] = useState(false);
  const diferencia = paso.respuesta - apuesta;
  return (
    <View style={estilos.columna}>
      <Entrada indice={0}>
        <BurbujaLuca texto={paso.pregunta} pose="piensa" grande tamanoLuca={64} />
      </Entrada>
      {!revelado ? (
        <Entrada indice={1} style={{ gap: Espacio.m }}>
          <Texto tipo="gigante" esCifra style={{ textAlign: 'center' }} accessibilityElementsHidden aria-hidden>
            {formatearCOP(apuesta)}
          </Texto>
          <Deslizador
            min={paso.min}
            max={paso.max}
            paso={paso.paso}
            valor={apuesta}
            alCambiar={setApuesta}
            etiqueta="Lo que crees"
            textoValor={formatearCOP(apuesta)}
          />
          <View style={estilos.extremos}>
            <Texto tipo="pequeno" suave esCifra>
              {formatearCOP(paso.min)}
            </Texto>
            <Texto tipo="pequeno" suave esCifra>
              {formatearCOP(paso.max)}
            </Texto>
          </View>
          <Boton
            titulo="Ver la respuesta"
            variante="secundario"
            onPress={() => {
              haptica.firme();
              setRevelado(true);
              alListo();
            }}
          />
        </Entrada>
      ) : (
        <Animated.View entering={FadeIn.duration(Movimiento.medio)} style={{ gap: Espacio.m }}>
          <Tarjeta variante="maiz" style={{ gap: Espacio.s }}>
            <Texto tipo="pequeno" color={tema.sobreMaiz} style={{ fontFamily: Fuente.negrita }}>
              La respuesta
            </Texto>
            <Cifra valor={paso.respuesta} tamano={44} color={tema.sobreMaiz} />
            <Texto color={tema.sobreMaiz}>{paso.cuenta}</Texto>
          </Tarjeta>
          <Nota
            bien={diferencia === 0}
            texto={
              diferencia === 0
                ? 'Le pegaste exacto.'
                : `Dijiste ${formatearCOP(apuesta)}: ${diferencia > 0 ? `es ${formatearCOP(diferencia)} más` : `es ${formatearCOP(-diferencia)} menos`} de lo que pensabas.`
            }
          />
        </Animated.View>
      )}
    </View>
  );
}

function Ordenar({ paso, alListo }: De<'ordenar'>) {
  const tema = useTema();
  const [orden, setOrden] = useState<string[]>([]);
  const [resultado, setResultado] = useState<'bien' | 'mal' | null>(null);
  const tocar = (id: string) => {
    if (resultado === 'bien') return;
    haptica.eleccion();
    const i = orden.indexOf(id);
    const nuevo = i >= 0 ? orden.slice(0, i) : [...orden, id];
    setOrden(nuevo);
    setResultado(null);
    if (nuevo.length === paso.tarjetas.length) {
      const bien = nuevo.join() === paso.ordenCorrecto.join();
      setResultado(bien ? 'bien' : 'mal');
      if (bien) {
        haptica.logro();
        alListo();
      } else {
        haptica.firme();
        setTimeout(() => setOrden([]), 1400);
      }
    }
  };
  return (
    <View style={estilos.columna}>
      <Entrada indice={0}>
        <BurbujaLuca texto={paso.pregunta} pose="piensa" />
      </Entrada>
      <Entrada indice={1} style={{ gap: Espacio.s }}>
        {paso.tarjetas.map((t) => {
          const n = orden.indexOf(t.id) + 1;
          const colocada = n > 0;
          const bien = resultado === 'bien';
          return (
            <Pressable
              key={t.id}
              onPress={() => tocar(t.id)}
              accessibilityRole="button"
              accessibilityLabel={`${t.texto}${colocada ? `, puesto ${n}` : ''}`}
              style={[estilos.opcion, { borderColor: tema.linea, backgroundColor: bien ? tema.verde : colocada ? tema.superficie : tema.papel }]}>
              <View style={[estilos.numero, { borderColor: bien ? tema.sobreVerde : tema.linea, backgroundColor: colocada ? (bien ? tema.verde : tema.maiz) : 'transparent' }]}>
                <Texto tipo="cuerpoFuerte" esCifra color={bien ? tema.sobreVerde : tema.sobreMaiz}>
                  {colocada ? n : ''}
                </Texto>
              </View>
              <Texto tipo="cuerpoFuerte" color={bien ? tema.sobreVerde : tema.texto} style={{ flex: 1 }}>
                {t.texto}
              </Texto>
            </Pressable>
          );
        })}
      </Entrada>
      {resultado ? (
        <Animated.View key={resultado} entering={FadeInDown.springify().damping(Movimiento.resorte.damping)}>
          <Nota bien={resultado === 'bien'} texto={resultado === 'bien' ? 'Eso es. Ese es el orden.' : 'Casi. Piensa qué te cobra cada mes que sigue ahí, e inténtalo de nuevo.'} />
        </Animated.View>
      ) : null}
    </View>
  );
}

/** Colores del reparto: tintas del sistema que se distinguen entre sí en claro y oscuro. */
function useColoresReparto() {
  const tema = useTema();
  // Tinta, verde, maíz y tajada: se distinguen entre sí en claro y oscuro (salvia y verde no).
  return [tema.linea, tema.verde, tema.maiz, tema.tajada];
}

/** Barra del reparto: una tajada por destino, del ancho de lo que le tocó. */
export function BarraReparto({ montos, total }: { montos: number[]; total: number }) {
  const tema = useTema();
  const colores = useColoresReparto();
  return (
    <View style={[estilos.barra, { borderColor: tema.linea, backgroundColor: tema.papel }]} accessible={false}>
      {montos.map((m, i) => (m > 0 ? <View key={i} style={{ flex: m / total, backgroundColor: colores[i % colores.length] }} /> : null))}
      {total - montos.reduce((a, b) => a + b, 0) > 0 ? <View style={{ flex: (total - montos.reduce((a, b) => a + b, 0)) / total }} /> : null}
    </View>
  );
}

/** Fila de reparto con menos y más de 44 pt. Se usa en el paso "repartir" y en la lección de la prima. */
export function FilaReparto({
  nombre,
  detalle,
  monto,
  color,
  alSumar,
  alQuitar,
  alLlenar,
  puedeSumar,
}: {
  nombre: string;
  detalle?: string;
  monto: number;
  color: string;
  alSumar(): void;
  alQuitar(): void;
  /** Mantener presionado +: le da todo lo que queda sin destino (o lo que le falta para su tope). */
  alLlenar?(): void;
  puedeSumar: boolean;
}) {
  const tema = useTema();
  const boton = (signo: '−' | '+', accion: () => void, activo: boolean, etiqueta: string, largo?: () => void) => (
    <Pressable
      onPress={() => (haptica.eleccion(), accion())}
      onLongPress={largo ? () => (haptica.firme(), largo()) : undefined}
      accessibilityHint={largo ? 'Mantén presionado para darle todo lo que queda' : undefined}
      disabled={!activo}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      accessibilityState={{ disabled: !activo }}
      style={({ pressed }) => [estilos.botonReparto, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel, opacity: activo ? 1 : 0.4 }]}>
      <Texto tipo="titulo3">{signo}</Texto>
    </Pressable>
  );
  return (
    <View style={[estilos.filaReparto, { borderBottomColor: tema.lineaSuave }]}>
      <View style={[estilos.punto, { backgroundColor: color, borderColor: tema.linea }]} />
      <View style={{ flex: 1 }}>
        <Texto tipo="cuerpoFuerte">{nombre}</Texto>
        {detalle ? (
          <Texto tipo="pequeno" suave>
            {detalle}
          </Texto>
        ) : null}
        <Texto tipo="cuerpoFuerte" esCifra>
          {formatearCOP(monto)}
        </Texto>
      </View>
      {boton('−', alQuitar, monto > 0, `Quitar a ${nombre}. Tiene ${formatearCOP(monto)}`)}
      {boton('+', alSumar, puedeSumar, `Sumar a ${nombre}. Tiene ${formatearCOP(monto)}`, alLlenar)}
    </View>
  );
}

function Repartir({ paso, alListo }: De<'repartir'>) {
  const colores = useColoresReparto();
  const [montos, setMontos] = useState(() => paso.destinos.map(() => 0));
  const libre = paso.total - montos.reduce((a, b) => a + b, 0);
  useEffect(() => {
    if (libre === 0) alListo();
  }, [libre, alListo]);
  const cambiar = (i: number, delta: number) => setMontos((ms) => ms.map((m, j) => (j === i ? Math.max(0, m + delta) : m)));
  return (
    <View style={estilos.columna}>
      <Entrada indice={0}>
        <BurbujaLuca texto={libre === 0 ? 'Cada peso tiene destino. Si te gusta así, sigue.' : paso.pregunta} pose={libre === 0 ? 'pulgar' : 'explica'} />
      </Entrada>
      <Entrada indice={1} style={{ gap: Espacio.s }}>
        <BarraReparto montos={montos} total={paso.total} />
        <Texto tipo="pequeno" suave esCifra accessibilityLiveRegion="polite">
          {libre === 0 ? 'Todo tiene destino' : `${formatearCOP(libre)} sin destino`}
        </Texto>
      </Entrada>
      <Entrada indice={2}>
        {paso.destinos.map((d, i) => (
          <FilaReparto
            key={d.id}
            nombre={d.texto}
            monto={montos[i]}
            color={colores[i % colores.length]}
            puedeSumar={libre > 0}
            alSumar={() => cambiar(i, Math.min(paso.paso, libre))}
            alQuitar={() => cambiar(i, -Math.min(paso.paso, montos[i]))}
            alLlenar={() => cambiar(i, libre)}
          />
        ))}
      </Entrada>
    </View>
  );
}

function Comparar({ paso, alListo }: De<'comparar'>) {
  const tema = useTema();
  const [elegido, setElegido] = useState<string | null>(null);
  const maximo = Math.max(...paso.caminos.map((c) => c.total));
  return (
    <View style={estilos.columna}>
      <Entrada indice={0}>
        <BurbujaLuca texto={paso.pregunta} pose="muestra" />
      </Entrada>
      <Entrada indice={1} style={{ gap: Espacio.s }}>
        {paso.caminos.map((c) => {
          const abierto = elegido === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => {
                haptica.eleccion();
                setElegido(c.id);
                alListo();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: abierto }}
              accessibilityLabel={`${c.titulo}. ${formatearCOP(c.total)} en total, cuota de ${formatearCOP(c.cuotaMensual)}, ${c.meses} meses`}
              style={[estilos.camino, { borderColor: tema.linea, backgroundColor: abierto ? tema.superficie : tema.papel }]}>
              <View style={estilos.filaEntre}>
                <Texto tipo="cuerpoFuerte" style={{ flex: 1 }}>
                  {c.titulo}
                </Texto>
                <Texto tipo="titulo3" esCifra>
                  {formatearCOP(c.total)}
                </Texto>
              </View>
              <View style={[estilos.medidor, { backgroundColor: tema.lineaSuave }]}>
                <View style={{ width: `${(c.total / maximo) * 100}%`, height: '100%', backgroundColor: tema.maiz, borderRadius: 4 }} />
              </View>
              {abierto ? (
                <Animated.View entering={FadeIn} style={estilos.filaEntre}>
                  <Texto tipo="pequeno" suave esCifra>
                    Cuota de {formatearCOP(c.cuotaMensual)}
                  </Texto>
                  <Texto tipo="pequeno" suave esCifra>
                    {c.meses} {c.meses === 1 ? 'mes' : 'meses'}
                  </Texto>
                </Animated.View>
              ) : null}
            </Pressable>
          );
        })}
      </Entrada>
    </View>
  );
}

/** La regla que la persona se lleva, impresa en maíz. */
export function TarjetaRegla({ texto }: { texto: string }) {
  const tema = useTema();
  return (
    <Tarjeta variante="maiz" style={{ gap: Espacio.s }}>
      <Texto tipo="pequeno" color={tema.sobreMaiz} style={{ fontFamily: Fuente.negrita }}>
        Lo que te llevas
      </Texto>
      <Texto tipo="titulo2" color={tema.sobreMaiz}>
        {texto}
      </Texto>
    </Tarjeta>
  );
}

function Regla({ paso, alListo }: De<'regla'>) {
  useListoAlMontar(alListo);
  useEffect(() => haptica.logro(), []);
  return (
    <View style={estilos.columna}>
      <Entrada indice={0} style={{ alignItems: 'center' }}>
        <Luca pose="celebra" tamano={120} gesto="celebra" />
      </Entrada>
      <Entrada indice={1}>
        <TarjetaRegla texto={paso.texto} />
      </Entrada>
    </View>
  );
}

function Accion({ paso, alListo, alCumplir }: De<'accion'> & { alCumplir?: () => void }) {
  const tema = useTema();
  const [hecha, setHecha] = useState(false);
  useListoAlMontar(alListo);
  return (
    <View style={estilos.columna}>
      <Entrada indice={0}>
        <BurbujaLuca texto="Esto no se aprende leyendo: se hace. Cuando lo hagas, ganas la medalla del módulo." pose="muestra" />
      </Entrada>
      <Entrada indice={1}>
        <Tarjeta style={{ gap: Espacio.s }}>
          <Texto tipo="pequeno" suave>
            Tu acción
          </Texto>
          <Texto tipo="titulo3">{paso.texto}</Texto>
          <View style={[estilos.fila, { marginTop: Espacio.xs }]}>
            <Icono nombre="info" tamano={18} color={tema.textoSuave} />
            <Texto tipo="pequeno" suave style={{ flex: 1 }}>
              {paso.comoSeComprueba}
            </Texto>
          </View>
        </Tarjeta>
      </Entrada>
      <Entrada indice={2}>
        {hecha ? (
          <Nota bien texto="Listo. Al terminar la lección te entrego la medalla." />
        ) : (
          <Boton
            titulo="Ya lo hice"
            variante="secundario"
            icono={<Icono nombre="check" tamano={20} color={tema.sobreVerde} />}
            onPress={() => {
              haptica.logro();
              setHecha(true);
              alCumplir?.();
            }}
          />
        )}
      </Entrada>
    </View>
  );
}

const estilos = StyleSheet.create({
  columna: { gap: Espacio.xl },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Espacio.s },
  filaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Espacio.m },
  opcion: { minHeight: 56, borderWidth: Forma.contorno, borderRadius: Forma.radio, paddingHorizontal: Espacio.l, paddingVertical: Espacio.m, flexDirection: 'row', alignItems: 'center', gap: Espacio.m },
  nota: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m },
  extremos: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -Espacio.s },
  numero: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  barra: { flexDirection: 'row', height: 22, borderRadius: 6, borderWidth: Forma.contorno, overflow: 'hidden' },
  filaReparto: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, paddingVertical: Espacio.m, borderBottomWidth: 1 },
  punto: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  botonReparto: { width: 48, height: 48, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  camino: { borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.l, gap: Espacio.s },
  medidor: { height: 10, borderRadius: 4, overflow: 'hidden' },
});
