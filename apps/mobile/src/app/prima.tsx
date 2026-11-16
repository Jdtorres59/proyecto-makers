import { diasTrabajados, formatearCOP } from '@makers/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Celebracion } from '@/components/celebracion';
import { Cifra } from '@/components/cifra';
import { Deslizador } from '@/components/deslizador';
import { Entrada } from '@/components/entrada';
import { Icono } from '@/components/icono';
import { BurbujaLuca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { BarraReparto, FilaReparto, TarjetaRegla } from '@/components/pasos';
import { Tajadas } from '@/components/tajadas';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Fuente, Movimiento, useTema } from '@/constants/tema';
import { type Destino, useLuca } from '@/lib/datos/contexto';
import { fechaLarga } from '@/lib/fechas';
import { haptica } from '@/lib/haptica';

const ORDEN = [
  { id: 'protege', titulo: 'Lo que me protege', detalle: 'Un colchón para imprevistos' },
  { id: 'quiero', titulo: 'Lo que quiero', detalle: 'Tus metas y un gusto' },
  { id: 'cuesta', titulo: 'Lo que me cuesta', detalle: 'Deudas que cobran interés' },
];
const ORDEN_CORRECTO = 'cuesta,protege,quiero';
const PASO = 50_000;

/** La prima como lección con los números de la persona: apuesta, cuenta, orden, reparto y plan. */
export default function Prima() {
  const tema = useTema();
  const { perfil, eventos, planPrima, guardarPlanPrima } = useLuca();
  const prima = eventos.find((e) => e.tipo === 'prima');
  const [paso, setPaso] = useState(planPrima ? 4 : 1);
  const salario = perfil?.salario ?? 0;
  const [apuesta, setApuesta] = useState(Math.round((salario / 2) * 0.35 / PASO) * PASO);
  const [revelado, setRevelado] = useState(false);
  const [orden, setOrden] = useState<string[]>([]);

  const celular = perfil?.deudas.find((d) => d.tipo === 'celular');
  const otrasDeudas = perfil?.deudas.filter((d) => d.tipo !== 'celular') ?? [];
  const meta = perfil?.meta && !['Todavía no sé', 'Tener un colchón'].includes(perfil.meta) ? perfil.meta : 'Una meta';
  const destinos = [
    celular?.cuotaMensual && celular.cuotasRestantes
      ? { id: 'deuda', nombre: 'Celular', detalle: `${celular.cuotasRestantes} cuotas de ${formatearCOP(celular.cuotaMensual)}`, max: celular.cuotaMensual * celular.cuotasRestantes }
      : otrasDeudas.length
        ? { id: 'deuda', nombre: 'Deudas', detalle: 'Lo que debes', max: Infinity }
        : { id: 'deuda', nombre: 'Deudas', detalle: 'No tienes', max: 0 },
    { id: 'colchon', nombre: 'Colchón', detalle: 'Para imprevistos', max: Infinity },
    { id: 'meta', nombre: meta, detalle: 'Tu meta', max: Infinity },
    { id: 'gusto', nombre: 'Un gusto', detalle: 'Algo para ti', max: Infinity },
  ];
  const [montos, setMontos] = useState(() => destinos.map(() => 0));

  if (!perfil || !prima || prima.monto === null || !perfil.fechaIngreso) {
    return (
      <Pantalla pie={<Boton titulo="Volver" onPress={() => router.back()} />}>
        <BurbujaLuca pose="atento" texto="Todavía no puedo calcular tu prima. Cuando lea tu desprendible, armamos el plan." />
      </Pantalla>
    );
  }
  const total = prima.monto;
  const año = prima.fecha.slice(0, 4);
  const semestre = prima.fecha.slice(5, 7) === '12' ? { desde: `${año}-07-01`, hasta: `${año}-12-31` } : { desde: `${año}-01-01`, hasta: `${año}-06-30` };
  const dias = diasTrabajados(perfil.fechaIngreso, semestre.desde, semestre.hasta);
  const libre = total - montos.reduce((a, b) => a + b, 0);
  const diferencia = total - apuesta;
  const deuda = destinos[0];

  const tocarOrden = (id: string) => {
    if (orden.join() === ORDEN_CORRECTO) return;
    haptica.eleccion();
    const i = orden.indexOf(id);
    const nuevo = i >= 0 ? orden.slice(0, i) : [...orden, id];
    setOrden(nuevo);
    if (nuevo.length === 3) {
      if (nuevo.join() === ORDEN_CORRECTO) haptica.logro();
      else {
        haptica.firme();
        setTimeout(() => setOrden([]), 1600);
      }
    }
  };
  const ordenBien = orden.join() === ORDEN_CORRECTO;
  const ordenMal = orden.length === 3 && !ordenBien;

  const cambiar = (i: number, delta: number) => setMontos((ms) => ms.map((m, j) => (j === i ? Math.max(0, m + delta) : m)));
  const guardar = () => {
    const plan: Destino[] = destinos.map((d, i) => ({ id: d.id, nombre: d.nombre, monto: montos[i] })).filter((d) => d.monto > 0);
    guardarPlanPrima(plan);
    setPaso(4);
  };

  const cerrar = (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Cerrar"
      hitSlop={4}
      style={({ pressed }) => [estilos.cerrar, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
      <Icono nombre="cerrar" tamano={20} />
    </Pressable>
  );
  const cabecera = (
    <>
      {cerrar}
      <Tajadas total={4} actual={paso} etiqueta={`Paso ${paso} de 4`} />
      <View style={{ width: 44 }} />
    </>
  );

  if (paso === 1) {
    return (
      <Pantalla
        cabecera={cabecera}
        pie={
          revelado ? (
            <Boton titulo="Seguir" onPress={() => (haptica.firme(), setPaso(2))} />
          ) : (
            <Boton titulo="Ver cuánto es" onPress={() => (haptica.firme(), setRevelado(true))} />
          )
        }>
        <Texto tipo="pequeno" suave>
          Tu prima · {fechaLarga(prima.fecha)}
        </Texto>
        <Entrada indice={0}>
          <BurbujaLuca texto="Antes de mostrarte: ¿cuánto crees que te llega de prima?" pose="piensa" grande tamanoLuca={64} />
        </Entrada>
        {!revelado ? (
          <Entrada indice={1} style={{ gap: Espacio.m }}>
            <Texto tipo="gigante" esCifra style={{ textAlign: 'center' }} accessibilityElementsHidden>
              {formatearCOP(apuesta)}
            </Texto>
            <Deslizador min={0} max={salario / 2} paso={PASO} valor={apuesta} alCambiar={setApuesta} etiqueta="Lo que crees que te llega" textoValor={formatearCOP(apuesta)} />
            <View style={estilos.extremos}>
              <Texto tipo="pequeno" suave esCifra>
                $0
              </Texto>
              <Texto tipo="pequeno" suave esCifra>
                {formatearCOP(salario / 2)}
              </Texto>
            </View>
          </Entrada>
        ) : (
          <Animated.View entering={FadeIn.duration(Movimiento.medio)} style={{ gap: Espacio.m }}>
            <Tarjeta variante="maiz" style={{ gap: Espacio.s }}>
              <Texto tipo="pequeno" color={tema.sobreMaiz} style={{ fontFamily: Fuente.negrita }}>
                Te llega
              </Texto>
              <Cifra valor={total} tamano={48} color={tema.sobreMaiz} />
              <View style={estilos.ecuacion} accessible accessibilityLabel={`${formatearCOP(salario)} por ${dias} días, dividido entre 360`}>
                {[formatearCOP(salario), '×', `${dias} días`, '÷', '360'].map((t, i) => (
                  <Texto key={i} tipo="cuerpoFuerte" esCifra color={tema.sobreMaiz} style={i % 2 ? undefined : [estilos.ficha, { borderColor: tema.sobreMaiz }]}>
                    {t}
                  </Texto>
                ))}
              </View>
            </Tarjeta>
            <BurbujaLuca
              pose="sorprendido"
              texto={`${diferencia === 0 ? 'Le pegaste exacto. ' : diferencia > 0 ? `Es ${formatearCOP(diferencia)} más de lo que pensabas. ` : `Es ${formatearCOP(-diferencia)} menos de lo que pensabas. `}Entraste el ${fechaLarga(perfil.fechaIngreso)}: este semestre cuentas ${dias} días, no 180.${dias < 180 ? ' Por eso no es medio salario completo.' : ''}`}
            />
          </Animated.View>
        )}
      </Pantalla>
    );
  }

  if (paso === 2) {
    return (
      <Pantalla cabecera={cabecera} pie={<Boton titulo="Seguir" disabled={!ordenBien} onPress={() => (haptica.firme(), setPaso(3))} />}>
        <Texto tipo="pequeno" suave>
          Antes de repartir
        </Texto>
        <Entrada indice={0}>
          <BurbujaLuca
            pose={ordenBien ? 'pulgar' : ordenMal ? 'atento' : 'piensa'}
            texto={
              ordenBien
                ? ['Eso es. ', { fuerte: 'Primero lo que te cuesta, después lo que te protege y al final lo que quieres.' }, ' Una deuda te cobra cada mes que la tienes.']
                : ordenMal
                  ? 'Casi. Piensa en esto: una deuda te cobra interés cada mes que sigue ahí. ¿Cuál iría primero?'
                  : 'Hay un orden que casi siempre funciona. Toca las tres en el orden en que crees que van.'
            }
          />
        </Entrada>
        <Entrada indice={1} style={{ gap: Espacio.s }}>
          {ORDEN.map((o) => {
            const n = orden.indexOf(o.id) + 1;
            return (
              <Pressable
                key={o.id}
                onPress={() => tocarOrden(o.id)}
                accessibilityRole="button"
                accessibilityLabel={`${o.titulo}. ${o.detalle}${n ? `, puesto ${n}` : ''}`}
                style={[estilos.orden, { borderColor: tema.linea, backgroundColor: ordenBien ? tema.verde : n ? tema.superficie : tema.papel }]}>
                <View style={[estilos.numero, { borderColor: ordenBien ? tema.sobreVerde : tema.linea, backgroundColor: n && !ordenBien ? tema.maiz : 'transparent' }]}>
                  <Texto tipo="cuerpoFuerte" esCifra color={ordenBien ? tema.sobreVerde : tema.sobreMaiz}>
                    {n || ''}
                  </Texto>
                </View>
                <View style={{ flex: 1 }}>
                  <Texto tipo="cuerpoFuerte" color={ordenBien ? tema.sobreVerde : tema.texto}>
                    {o.titulo}
                  </Texto>
                  <Texto tipo="pequeno" color={ordenBien ? tema.sobreVerde : tema.textoSuave}>
                    {o.detalle}
                  </Texto>
                </View>
              </Pressable>
            );
          })}
        </Entrada>
      </Pantalla>
    );
  }

  if (paso === 3) {
    const terminaDeuda = deuda.max > 0 && deuda.max !== Infinity && montos[0] >= deuda.max;
    return (
      <Pantalla cabecera={cabecera} pie={<Boton titulo="Guardar mi plan" disabled={libre !== 0} onPress={guardar} />}>
        <Entrada indice={0}>
          <BurbujaLuca
            pose={libre === 0 ? 'pulgar' : 'explica'}
            texto={
              libre === 0
                ? 'Cada peso tiene destino. Si te gusta así, guárdalo.'
                : terminaDeuda && celular?.cuotaMensual
                  ? ['Con eso terminas de pagar el celular: desde el mes siguiente te quedan ', { fuerte: `${formatearCOP(celular.cuotaMensual)} más cada mes` }, '.']
                  : ['Reparte tus ', { fuerte: formatearCOP(total) }, '. Tú decides; yo te muestro qué pasa con cada decisión.']
            }
          />
        </Entrada>
        <Entrada indice={1} style={{ gap: Espacio.s }}>
          <BarraReparto montos={montos} total={total} />
          <Texto tipo="cuerpoFuerte" esCifra accessibilityLiveRegion="polite">
            {libre === 0 ? 'Todo tiene destino' : `${formatearCOP(libre)} sin destino`}
          </Texto>
        </Entrada>
        <Entrada indice={2}>
          {destinos.map((d, i) =>
            d.max === 0 ? (
              <View key={d.id} style={[estilos.sinDeuda, { borderBottomColor: tema.lineaSuave }]}>
                <Texto tipo="cuerpoFuerte">{d.nombre}</Texto>
                <Texto tipo="pequeno" suave>
                  Nada que pagar
                </Texto>
              </View>
            ) : (
              <FilaReparto
                key={d.id}
                nombre={d.nombre}
                detalle={d.detalle}
                monto={montos[i]}
                color={[tema.maiz, tema.verde, tema.salvia, tema.tajada][i]}
                puedeSumar={libre > 0 && montos[i] < d.max}
                alSumar={() => cambiar(i, Math.min(PASO, libre, d.max - montos[i]))}
                alQuitar={() => cambiar(i, -(montos[i] % PASO || PASO))}
              />
            ),
          )}
        </Entrada>
      </Pantalla>
    );
  }

  const plan = planPrima ?? [];
  return (
    <Pantalla
      pie={
        <>
          <Boton titulo="Volver al inicio" onPress={() => router.back()} />
          <Boton titulo="Rehacer el plan" variante="texto" onPress={() => (setMontos(destinos.map(() => 0)), setPaso(3))} />
        </>
      }>
      <Entrada indice={0} style={{ marginTop: Espacio.s }}>
        <Celebracion tamano={130} />
      </Entrada>
      <Entrada indice={1} style={{ gap: Espacio.xs }}>
        <Texto tipo="pequeno" suave style={{ textAlign: 'center' }}>
          Plan listo
        </Texto>
        <Texto tipo="titulo" style={{ textAlign: 'center' }}>
          Tu prima ya tiene plan.
        </Texto>
      </Entrada>
      <Entrada indice={2}>
        <Tarjeta style={{ gap: Espacio.s }}>
          <BarraReparto montos={plan.map((p) => p.monto)} total={plan.reduce((a, p) => a + p.monto, 0) || 1} />
          {plan.map((p, i) => (
            <Animated.View key={p.id} entering={FadeInDown.delay(400 + i * 90)} style={estilos.destino}>
              <View style={[estilos.punto, { backgroundColor: [tema.maiz, tema.verde, tema.salvia, tema.tajada][destinos.findIndex((d) => d.id === p.id)], borderColor: tema.linea }]} />
              <Texto style={{ flex: 1 }}>{p.nombre}</Texto>
              <Texto tipo="cuerpoFuerte" esCifra>
                {formatearCOP(p.monto)}
              </Texto>
            </Animated.View>
          ))}
        </Tarjeta>
      </Entrada>
      <Entrada indice={3}>
        <TarjetaRegla texto={`El ${fechaLarga(prima.fecha)}, cuando llegue, ya sé a dónde va cada peso.`} />
      </Entrada>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  cerrar: { width: 44, height: 44, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  extremos: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -Espacio.s },
  ecuacion: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Espacio.s },
  ficha: { borderWidth: 2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  orden: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 64 },
  numero: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  sinDeuda: { paddingVertical: Espacio.m, borderBottomWidth: 1, minHeight: 64, justifyContent: 'center' },
  destino: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, minHeight: 32 },
  punto: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
});
