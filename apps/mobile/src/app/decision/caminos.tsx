import { consultarNorma } from '@makers/conocimiento';
import { formatearCOP, netoDelMes, porcentajeDelSueldo, tasaMensual } from '@makers/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Celebracion } from '@/components/celebracion';
import { Chip } from '@/components/chip';
import { Cifra } from '@/components/cifra';
import { Deslizador } from '@/components/deslizador';
import { Entrada } from '@/components/entrada';
import { Expandible } from '@/components/expandible';
import { Icono } from '@/components/icono';
import { BurbujaLuca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { TarjetaRegla } from '@/components/pasos';
import { Tajadas } from '@/components/tajadas';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Fuente, Movimiento, Tipo, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { type Camino, caminos, type IdCamino, papelesDesde, terminaEn } from '@/lib/decision';
import { fechaLarga } from '@/lib/fechas';
import { haptica } from '@/lib/haptica';

const MOTIVOS = ['Me sale más barato', 'La cuota me cabe en el mes', 'No quiero tocar mi prima', 'Quiero salir rápido de la deuda', 'Prefiero una sola deuda'];
const porcentaje = (n: number) => `${n.toFixed(2).replace('.', ',')} %`;

/** La decisión como lección: lo que leí, adivinar, comparar con plazos, elegir y justificar, cierre. Decide la persona. */
export default function Caminos() {
  const tema = useTema();
  const { revisar } = useLocalSearchParams<{ revisar?: string }>();
  const { perfil, documentos, eventos, hoy, decision, planPrima, guardarDecision } = useLuca();
  const extracto = documentos.find((d) => d.tipo === 'extracto');
  const oferta = documentos.find((d) => d.tipo === 'oferta_credito');
  const [paso, setPaso] = useState(revisar ? 3 : 1);
  const [plazos, setPlazos] = useState({ diferir: 12, prestamo: 12 });
  const [adivina, setAdivina] = useState<IdCamino | null>(null);
  const [abierto, setAbierto] = useState<IdCamino | null>(null);
  const [elegido, setElegido] = useState<IdCamino | null>(null);
  const [motivos, setMotivos] = useState<string[]>([]);
  const [nota, setNota] = useState('');

  if (!perfil || !extracto || !oferta || perfil.salario === null) {
    return (
      <Pantalla pie={<Boton titulo="Volver" onPress={() => router.back()} />}>
        <BurbujaLuca pose="atento" texto="Me faltan papeles para mostrarte los caminos. Súbelos desde la conversación." />
      </Pantalla>
    );
  }

  const papeles = papelesDesde(extracto, oferta);
  const prima = eventos.find((e) => e.tipo === 'prima');
  const neto = netoDelMes(perfil.salario, hoy);
  const celular = perfil.deudas.find((d) => d.tipo === 'celular' && d.cuotaMensual);
  const lista = caminos(papeles, plazos, prima?.monto ?? 0);
  const deDoce = caminos(papeles, { diferir: 12, prestamo: 12 }, prima?.monto ?? 0);
  const ordenados = [...deDoce].sort((a, b) => a.total - b.total);
  const usura = consultarNorma('tasa_usura_consumo', hoy)?.valor ?? null;
  const pesoEnSueldo = (c: Camino) => porcentajeDelSueldo(c.costo.primeraCuota + (celular?.cuotaMensual ?? 0), neto);
  const camino = (id: IdCamino | null) => lista.find((c) => c.id === id);

  const ir = (n: number) => {
    haptica.firme();
    setPaso(n);
  };

  const cabecera = paso < 5 ? (
    <>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
        hitSlop={4}
        style={({ pressed }) => [estilos.cerrar, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
        <Icono nombre="cerrar" tamano={20} />
      </Pressable>
      <Tajadas total={5} actual={paso} etiqueta={`Paso ${paso} de 5`} />
      <View style={{ width: 44 }} />
    </>
  ) : undefined;

  if (paso === 1) {
    const filas: [string, string][] = [
      ['Debes en la tarjeta', `${formatearCOP(papeles.saldo)} a ${porcentaje(papeles.tasaTarjeta)} E.A.`],
      ['Te ofrecen un préstamo', `${porcentaje(papeles.tasaPrestamo)} E.A. más seguro de ${formatearCOP(papeles.seguroMensual)}`],
      ['Tu sueldo', `${formatearCOP(neto)}${perfil.diaDePago ? ` el ${perfil.diaDePago} de cada mes` : ''}`],
      ['Ya pagas', celular ? `${celular.nombre}: ${formatearCOP(celular.cuotaMensual!)} al mes, quedan ${celular.cuotasRestantes}` : 'Ninguna otra cuota'],
      ['Te llega pronto', prima?.monto ? `Tu prima, ${formatearCOP(prima.monto)}, el ${fechaLarga(prima.fecha)}` : 'Nada en las próximas semanas'],
    ];
    return (
      <Pantalla cabecera={cabecera} pie={<Boton titulo="Ver los caminos" onPress={() => ir(2)} />}>
        <Entrada indice={0} style={{ gap: 4 }}>
          <Texto tipo="pequeno" suave>
            Lo que leí
          </Texto>
          <Texto tipo="titulo2">Esto es lo que tienes sobre la mesa</Texto>
        </Entrada>
        <Entrada indice={1}>
          {filas.map(([e, v]) => (
            <View key={e} style={[estilos.fila, { borderBottomColor: tema.lineaSuave }]}>
              <Texto tipo="pequeno" suave>
                {e}
              </Texto>
              <Texto tipo="cuerpoFuerte" esCifra>
                {v}
              </Texto>
            </View>
          ))}
        </Entrada>
        <Entrada indice={2}>
          <BurbujaLuca texto="Con esto veo cuatro caminos. Te los muestro con tus números y tú decides." />
        </Entrada>
      </Pantalla>
    );
  }

  if (paso === 2) {
    const mejor = ordenados[0];
    const peor = ordenados[ordenados.length - 1];
    return (
      <Pantalla cabecera={cabecera} pie={<Boton titulo="Comparar con mis números" disabled={!adivina} onPress={() => ir(3)} />}>
        <Texto tipo="pequeno" suave>
          Antes de ver las cuentas
        </Texto>
        <Entrada indice={0}>
          <BurbujaLuca pose="piensa" grande tamanoLuca={64} texto="¿Con cuál crees que pagas menos en total?" />
        </Entrada>
        <Entrada indice={1} style={{ gap: Espacio.s }}>
          {deDoce.map((c) => {
            const elegida = adivina === c.id;
            return (
              <Pressable
                key={c.id}
                disabled={!!adivina}
                onPress={() => {
                  setAdivina(c.id);
                  if (c.id === mejor.id) haptica.logro();
                  else haptica.firme();
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: elegida, disabled: !!adivina && !elegida }}
                accessibilityLabel={c.nombre}
                style={[estilos.opcion, { borderColor: tema.linea, backgroundColor: elegida ? tema.superficie : tema.papel }]}>
                <View style={{ flex: 1 }}>
                  <Texto tipo="cuerpoFuerte">{c.nombre}</Texto>
                  <Texto tipo="pequeno" suave>
                    {c.id === 'prima' ? 'Y el resto a cuotas' : `${c.costo.cuotas} meses`}
                  </Texto>
                </View>
                {elegida ? <Icono nombre="check" tamano={20} /> : null}
              </Pressable>
            );
          })}
        </Entrada>
        {adivina ? (
          <Animated.View entering={FadeInDown.springify().damping(Movimiento.resorte.damping)}>
            <Tarjeta variante="superficie" style={{ gap: Espacio.xs }}>
              <Texto tipo="pequeno" style={{ fontFamily: Fuente.negrita }}>
                {adivina === mejor.id ? 'Le pegaste' : 'No era esa'}
              </Texto>
              <Texto>
                La que menos cuesta en total es <Texto style={{ fontFamily: Fuente.negrita }}>{mejor.nombre.toLowerCase()}</Texto>. La más cara, {peor.nombre.toLowerCase()}:{' '}
                <Texto esCifra style={{ fontFamily: Fuente.negrita }}>
                  {formatearCOP(peor.total - mejor.total)} más
                </Texto>
                . Pero que algo cueste menos no lo hace mejor para ti. Míralo con tu mes.
              </Texto>
            </Tarjeta>
          </Animated.View>
        ) : null}
      </Pantalla>
    );
  }

  if (paso === 3) {
    const c = camino(abierto);
    let dice = 'Este es el costo de cada camino, en total. Toca uno para ver cómo queda tu mes.';
    if (c?.id === 'minimo') dice = `Con el mínimo terminas en ${terminaEn(c.costo.cuotas, hoy)} y pagas ${formatearCOP(c.costo.intereses)} de intereses.`;
    if (c?.id === 'diferir')
      dice =
        c.costo.cuotas === 1
          ? `A una cuota no pagas intereses, pero el primer mes se te irían ${formatearCOP(c.costo.primeraCuota)}: ${pesoEnSueldo(c)} % de tu sueldo.`
          : `A ${c.costo.cuotas} cuotas pagas ${formatearCOP(c.costo.intereses)} de intereses.${c.costo.cuotas > 12 ? ' La cuota baja, pero el total sube.' : c.costo.cuotas < 12 ? ' Cuota más alta, menos intereses.' : ''}`;
    if (c?.id === 'prestamo') dice = `A ${c.costo.cuotas} meses la cuota es de ${formatearCOP(c.costo.primeraCuota)} y pagas ${formatearCOP(c.costo.intereses + c.costo.seguro)} entre intereses y seguro.`;
    if (c?.id === 'prima') dice = `Es el camino que menos intereses paga, pero usa tu prima.${planPrima ? ' Tu plan de la prima tendría que cambiar.' : ' Esa plata ya no iría a tu colchón ni a tu meta.'}`;
    const maximo = Math.max(...lista.map((x) => x.total));
    const i1 = tasaMensual(papeles.tasaTarjeta) * papeles.saldo;

    return (
      <Pantalla cabecera={cabecera} pie={<Boton titulo="Ya entendí, quiero decidir" onPress={() => ir(4)} />}>
        <BurbujaLuca pose="muestra" texto={dice} />
        <View style={estilos.leyenda} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={estilos.leyendaItem}>
            <View style={[estilos.cuadro, { backgroundColor: tema.linea }]} />
            <Texto tipo="pequeno" suave>
              Lo que debes
            </Texto>
          </View>
          <View style={estilos.leyendaItem}>
            <View style={[estilos.cuadro, { backgroundColor: tema.maiz, borderColor: tema.linea, borderWidth: 1 }]} />
            <Texto tipo="pequeno" suave>
              Intereses y seguro
            </Texto>
          </View>
        </View>
        <View style={{ gap: Espacio.s }}>
          {lista.map((x, i) => {
            const abiertoAqui = abierto === x.id;
            const peso = pesoEnSueldo(x);
            const costoExtra = x.total - papeles.saldo;
            return (
              <Entrada key={x.id} indice={i}>
                <Animated.View layout={LinearTransition.springify().damping(Movimiento.resorte.damping)} style={[estilos.camino, { borderColor: tema.linea, backgroundColor: abiertoAqui ? tema.papel : tema.fondo }]}>
                  <Pressable
                    onPress={() => (haptica.eleccion(), setAbierto(abiertoAqui ? null : x.id))}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: abiertoAqui }}
                    accessibilityLabel={`${x.nombre}. ${formatearCOP(x.total)} en total. ${x.detalle}`}
                    style={{ gap: Espacio.s }}>
                    <View style={estilos.filaEntre}>
                      <View style={{ flex: 1 }}>
                        <Texto tipo="cuerpoFuerte">{x.nombre}</Texto>
                        <Texto tipo="pequeno" suave>
                          {x.detalle}
                        </Texto>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Cifra valor={x.total} tamano={20} />
                        <Texto tipo="pequeno" suave>
                          en total
                        </Texto>
                      </View>
                    </View>
                    <View style={[estilos.costo, { backgroundColor: tema.lineaSuave }]}>
                      <View style={{ width: `${(papeles.saldo / maximo) * 100}%`, backgroundColor: tema.linea }} />
                      <View style={{ width: `${(costoExtra / maximo) * 100}%`, backgroundColor: tema.maiz }} />
                    </View>
                  </Pressable>
                  {abiertoAqui ? (
                    <Animated.View entering={FadeIn.duration(Movimiento.medio)} style={{ gap: Espacio.m, marginTop: Espacio.s }}>
                      <View style={estilos.datos}>
                        {[
                          [x.id === 'prestamo' ? 'Cuota fija' : 'Primera cuota', formatearCOP(x.costo.primeraCuota)],
                          ['Meses', String(x.costo.cuotas)],
                          ['Terminas', terminaEn(x.costo.cuotas, hoy, true)],
                        ].map(([e, v]) => (
                          <View key={e} style={{ flex: 1 }}>
                            <Texto tipo="pequeno" suave>
                              {e}
                            </Texto>
                            <Texto tipo="cuerpoFuerte" esCifra>
                              {v}
                            </Texto>
                          </View>
                        ))}
                      </View>
                      {x.plazo ? (
                        <View>
                          <Texto tipo="pequeno">
                            Plazo:{' '}
                            <Texto tipo="pequeno" esCifra style={{ fontFamily: Fuente.negrita }}>
                              {x.costo.cuotas} {x.costo.cuotas === 1 ? x.plazo.unidad[0] : x.plazo.unidad[1]}
                            </Texto>
                          </Texto>
                          <Deslizador
                            min={x.plazo.min}
                            max={x.plazo.max}
                            paso={1}
                            valor={x.costo.cuotas}
                            alCambiar={(v) => setPlazos((p) => ({ ...p, [x.id]: v }))}
                            etiqueta={`Plazo de ${x.nombre.toLowerCase()}`}
                            textoValor={`${x.costo.cuotas} ${x.costo.cuotas === 1 ? x.plazo.unidad[0] : x.plazo.unidad[1]}`}
                          />
                        </View>
                      ) : null}
                      <View style={{ gap: 6 }}>
                        <View style={[estilos.medidor, { backgroundColor: tema.lineaSuave }]}>
                          <View style={{ width: `${Math.min(100, peso)}%`, height: '100%', backgroundColor: peso < 20 ? tema.verde : peso < 34 ? tema.maiz : tema.linea }} />
                        </View>
                        <Texto tipo="pequeno">
                          El primer mes,{' '}
                          <Texto tipo="pequeno" style={{ fontFamily: Fuente.negrita }}>
                            {peso} % de tu sueldo
                          </Texto>{' '}
                          se iría en cuotas{celular ? ', contando el celular' : ''}.{peso >= 34 ? ' Más de un tercio.' : ''}
                        </Texto>
                      </View>
                    </Animated.View>
                  ) : null}
                </Animated.View>
              </Entrada>
            );
          })}
        </View>
        <View>
          <Expandible cabeza={<Texto tipo="cuerpoFuerte">¿Por qué el mínimo sale tan caro?</Texto>} etiqueta="¿Por qué el mínimo sale tan caro?">
            {`Al principio casi todo lo que pagas son intereses. Con el mínimo, el primer mes pagarías ${formatearCOP(Math.round(i1))} de intereses y tu deuda bajaría solo ${formatearCOP(Math.round(papeles.saldo / 36))}.`}
          </Expandible>
          <Expandible cabeza={<Texto tipo="cuerpoFuerte">{`${porcentaje(papeles.tasaTarjeta)} E.A., ¿es mucho?`}</Texto>} etiqueta="¿La tasa de la tarjeta es mucho?">
            {`Es lo que te cobra la tarjeta en un año. Al mes es ${porcentaje(tasaMensual(papeles.tasaTarjeta) * 100)}.${usura ? ` La usura de este mes, el máximo que permite la ley, es ${porcentaje(usura)}: ${papeles.tasaTarjeta >= usura - 3 ? 'tu tarjeta está cerca del tope' : 'tu tarjeta está por debajo'}.` : ''}`}
          </Expandible>
          <Expandible cabeza={<Texto tipo="cuerpoFuerte">La tasa del préstamo es más baja, ¿por qué no cuesta mucho menos?</Texto>} etiqueta="¿Por qué el préstamo no cuesta mucho menos?" ultimo>
            {`Porque al préstamo se le suma un seguro de ${formatearCOP(papeles.seguroMensual)} cada mes. A ${plazos.prestamo} meses son ${formatearCOP(papeles.seguroMensual * plazos.prestamo)}. Por eso se compara el total, no solo la tasa.`}
          </Expandible>
        </View>
      </Pantalla>
    );
  }

  if (paso === 4) {
    const decidir = () => {
      const c = camino(elegido)!;
      haptica.logro();
      guardarDecision({
        id: `muestra-decision-${Date.now()}`,
        pregunta: '¿Mínimo, diferir o préstamo?',
        documentos: [extracto.id, oferta.id],
        caminoElegido: c.nombre,
        motivos,
        nota: nota.trim() || null,
        creadaEn: new Date().toISOString(),
        resumen: { total: c.total, primeraCuota: c.costo.primeraCuota, cuotas: c.costo.cuotas, abono: c.abono },
      });
      setPaso(5);
    };
    return (
      <Pantalla cabecera={cabecera} pie={<Boton titulo="Esta es mi decisión" disabled={!elegido} onPress={decidir} />}>
        <Entrada indice={0} style={{ gap: 4 }}>
          <Texto tipo="pequeno" suave>
            Tu decisión
          </Texto>
          <Texto tipo="titulo2">¿Qué camino tomas?</Texto>
        </Entrada>
        <Entrada indice={1} style={{ gap: Espacio.s }} >
          {lista.map((c) => {
            const sel = elegido === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => (haptica.eleccion(), setElegido(c.id))}
                accessibilityRole="radio"
                accessibilityState={{ checked: sel }}
                accessibilityLabel={`${c.nombre}. ${c.detalle}. ${formatearCOP(c.total)} en total`}
                style={[estilos.opcion, { borderColor: tema.linea, backgroundColor: sel ? tema.verde : tema.papel }]}>
                <View style={{ flex: 1 }}>
                  <Texto tipo="cuerpoFuerte" color={sel ? tema.sobreVerde : tema.texto}>
                    {c.nombre}
                  </Texto>
                  <Texto tipo="pequeno" color={sel ? tema.sobreVerde : tema.textoSuave}>
                    {c.detalle}
                  </Texto>
                </View>
                <Texto tipo="cuerpoFuerte" esCifra color={sel ? tema.sobreVerde : tema.texto}>
                  {formatearCOP(c.total)}
                </Texto>
              </Pressable>
            );
          })}
        </Entrada>
        <Entrada indice={2} style={{ gap: Espacio.s }}>
          <Texto tipo="titulo3">¿Por qué lo escoges?</Texto>
          <View style={estilos.chips}>
            {MOTIVOS.map((m) => (
              <Chip key={m} texto={m} multiple elegido={motivos.includes(m)} onPress={() => setMotivos((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]))} />
            ))}
          </View>
          <TextInput
            value={nota}
            onChangeText={setNota}
            multiline
            placeholder="Si quieres, dilo con tus palabras"
            placeholderTextColor={tema.textoSuave}
            accessibilityLabel="Tu porqué, con tus palabras"
            selectionColor={tema.maiz}
            maxFontSizeMultiplier={2}
            style={[Tipo.cuerpo, estilos.nota, { color: tema.texto, backgroundColor: tema.papel, borderColor: tema.linea }]}
          />
        </Entrada>
      </Pantalla>
    );
  }

  const d = decision;
  const porque = d ? (d.nota ?? d.motivos.join(', ')) : '';
  return (
    <Pantalla
      pie={
        <>
          <Boton titulo="Volver al inicio" onPress={() => (router.dismissAll(), router.navigate('/'))} />
          <Boton titulo="Verla en Aprender" variante="texto" onPress={() => (router.dismissAll(), router.navigate('/aprender'))} />
        </>
      }>
      <Entrada indice={0} style={{ marginTop: Espacio.s }}>
        <Celebracion tamano={120} />
      </Entrada>
      <Entrada indice={1}>
        <Texto tipo="titulo" style={{ textAlign: 'center' }}>
          Decidiste tú.
        </Texto>
      </Entrada>
      {d ? (
        <Entrada indice={2}>
          <Tarjeta style={{ gap: Espacio.s }}>
            <Texto tipo="pequeno" suave>
              Tu camino
            </Texto>
            <Texto tipo="titulo2">{d.caminoElegido}</Texto>
            <Texto>
              Pagas{' '}
              <Texto esCifra style={{ fontFamily: Fuente.negrita }}>
                {formatearCOP(d.resumen.total)}
              </Texto>{' '}
              en total y terminas en {terminaEn(d.resumen.cuotas, hoy)}.
            </Texto>
            {porque ? <Texto suave>Porque: {porque.charAt(0).toLowerCase() + porque.slice(1)}.</Texto> : null}
          </Tarjeta>
        </Entrada>
      ) : null}
      <Entrada indice={3}>
        <TarjetaRegla texto="Comparo el total, no la cuota." />
      </Entrada>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  cerrar: { width: 44, height: 44, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  fila: { paddingVertical: Espacio.m, borderBottomWidth: 1, gap: 2 },
  opcion: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 64 },
  filaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Espacio.m },
  leyenda: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.l },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cuadro: { width: 12, height: 12, borderRadius: 3 },
  camino: { borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m },
  costo: { flexDirection: 'row', height: 12, borderRadius: 4, overflow: 'hidden' },
  datos: { flexDirection: 'row', gap: Espacio.m },
  medidor: { height: 10, borderRadius: 4, overflow: 'hidden' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.s },
  nota: { minHeight: 88, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, textAlignVertical: 'top' },
});
