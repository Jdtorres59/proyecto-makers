import { type Deuda, formatearCOP, type PerfilFinanciero } from '@makers/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Campo } from '@/components/campo';
import { Chip } from '@/components/chip';
import { Entrada } from '@/components/entrada';
import { BurbujaLuca } from '@/components/luca';
import { Cabecera, Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { CELULAR_DE_MUESTRA } from '@/lib/datos/muestra';

type IdDeuda = 'tarjeta' | 'celular' | 'icetex' | 'familia' | 'no';

const DEUDAS: { id: IdDeuda; texto: string; tipo?: Deuda['tipo'] }[] = [
  { id: 'tarjeta', texto: 'Tarjeta de crédito', tipo: 'tarjeta' },
  { id: 'celular', texto: 'Celular a cuotas', tipo: 'celular' },
  { id: 'icetex', texto: 'Crédito ICETEX', tipo: 'educativo' },
  { id: 'familia', texto: 'A alguien de mi familia', tipo: 'otra' },
  { id: 'no', texto: 'No debo nada' },
];
const METAS = ['Irme a vivir sola', 'Un viaje', 'Estudiar algo', 'Tener un colchón', 'Todavía no sé'];
const VIVIENDAS: { texto: string; valor: NonNullable<PerfilFinanciero['vivienda']> }[] = [
  { texto: 'Con mi familia', valor: 'familia' },
  { texto: 'Pago arriendo', valor: 'arriendo' },
  { texto: 'Comparto arriendo', valor: 'arriendo' },
];
const PREGUNTAS = ['¿Le debes plata a alguien hoy?', 'Si te sobrara plata, ¿para qué sería?', '¿Dónde vives hoy?'];

const numero = (t: string) => Number(t.replace(/\D/g, '')) || 0;

/** Tres preguntas con chips. La de deudas pide los datos del celular si lo eligen. */
export default function Preguntas() {
  const { actualizarPerfil } = useLuca();
  const [paso, setPaso] = useState(0);
  const [deudas, setDeudas] = useState<Set<IdDeuda>>(new Set());
  const [meta, setMeta] = useState<string | null>(null);
  const [vivienda, setVivienda] = useState<string | null>(null);
  const [celular, setCelular] = useState({
    cuota: String(CELULAR_DE_MUESTRA.cuotaMensual),
    quedan: String(CELULAR_DE_MUESTRA.cuotasRestantes),
    dia: String(CELULAR_DE_MUESTRA.diaDePago),
  });

  const alternarDeuda = (id: IdDeuda) =>
    setDeudas((d) => {
      if (id === 'no') return new Set(d.has('no') ? [] : ['no']);
      const nuevo = new Set(d);
      nuevo.delete('no');
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });

  const puedeSeguir = [deudas.size > 0, meta !== null, vivienda !== null][paso];
  const ultimo = paso === PREGUNTAS.length - 1;

  const seguir = () => {
    if (!ultimo) return setPaso(paso + 1);
    const lista: Deuda[] = DEUDAS.filter((d) => d.tipo && deudas.has(d.id)).map((d) => {
      const esCelular = d.id === 'celular';
      const dia = numero(celular.dia);
      return {
        id: d.id,
        tipo: d.tipo!,
        nombre: esCelular ? 'Celular' : d.texto,
        cuotaMensual: esCelular ? numero(celular.cuota) : null,
        cuotasRestantes: esCelular ? numero(celular.quedan) : null,
        saldo: null,
        tasaEA: null,
        diaDePago: esCelular && dia >= 1 && dia <= 31 ? dia : null,
      };
    });
    actualizarPerfil({ deudas: lista, meta, vivienda: VIVIENDAS.find((v) => v.texto === vivienda)?.valor ?? null });
    router.replace('/listo');
  };

  return (
    <Pantalla
      cabecera={
        <Cabecera
          alVolver={() => (paso > 0 ? setPaso(paso - 1) : router.back())}
          progreso={{ total: PREGUNTAS.length, actual: paso + 1, etiqueta: `Pregunta ${paso + 1} de ${PREGUNTAS.length}` }}
        />
      }
      pie={<Boton titulo={ultimo ? 'Terminar' : 'Seguir'} disabled={!puedeSeguir} onPress={seguir} />}>
      {/* La clave reinicia la entrada escalonada y la voz de Luca en cada pregunta. */}
      <View key={paso} style={estilos.cuerpo}>
        <Entrada indice={0}>
          <BurbujaLuca texto={PREGUNTAS[paso]} pose="piensa" grande tamanoLuca={64} />
        </Entrada>
        <Entrada indice={1} style={estilos.chips}>
          {paso === 0
            ? DEUDAS.map((d) => <Chip key={d.id} texto={d.texto} multiple elegido={deudas.has(d.id)} onPress={() => alternarDeuda(d.id)} />)
            : paso === 1
              ? METAS.map((m) => <Chip key={m} texto={m} elegido={meta === m} onPress={() => setMeta(m)} />)
              : VIVIENDAS.map((v) => <Chip key={v.texto} texto={v.texto} elegido={vivienda === v.texto} onPress={() => setVivienda(v.texto)} />)}
        </Entrada>

        {paso === 0 && deudas.has('celular') ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Tarjeta variante="superficie" style={{ gap: Espacio.m }}>
              <Texto tipo="titulo3">Sobre el celular</Texto>
              <Campo
                etiqueta="Cuota al mes"
                keyboardType="number-pad"
                esCifra
                value={celular.cuota ? formatearCOP(numero(celular.cuota)) : ''}
                onChangeText={(t) => setCelular((c) => ({ ...c, cuota: String(numero(t)) }))}
              />
              <View style={estilos.dosCampos}>
                <View style={{ flex: 1, minWidth: 130 }}>
                  <Campo etiqueta="Cuotas que faltan" keyboardType="number-pad" esCifra value={celular.quedan} onChangeText={(t) => setCelular((c) => ({ ...c, quedan: t.replace(/\D/g, '') }))} />
                </View>
                <View style={{ flex: 1, minWidth: 130 }}>
                  <Campo etiqueta="Día en que la pagas" keyboardType="number-pad" esCifra value={celular.dia} onChangeText={(t) => setCelular((c) => ({ ...c, dia: t.replace(/\D/g, '').slice(0, 2) }))} />
                </View>
              </View>
            </Tarjeta>
          </Animated.View>
        ) : null}
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  cuerpo: { gap: Espacio.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.s },
  dosCampos: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.m },
});
