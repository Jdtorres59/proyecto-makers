import { cesantias, formatearCOP, prima } from '@makers/core';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { Entrada } from '@/components/entrada';
import { Expandible } from '@/components/expandible';
import { BurbujaLuca, Luca } from '@/components/luca';
import { Cabecera, Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Apilado, Espacio, useLetraGrande, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { comoProblema, type ProblemaLuca } from '@/lib/datos/errores';

const DESCUENTOS = ['salud', 'pension', 'solidaridad'];

/** Un documento explicado: cada renglón se abre y dice qué es, con la cuenta hecha. */
export default function DocumentoPantalla() {
  const tema = useTema();
  const letraGrande = useLetraGrande();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { documentos, explicarDocumento, perfil } = useLuca();
  const doc = documentos.find((d) => d.id === id);
  const explicado = !!doc && doc.renglones.every((x) => x.explicacion);

  const [problema, setProblema] = useState<ProblemaLuca | null>(null);
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    if (id) explicarDocumento(id).catch((e) => setProblema(comoProblema(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, intento]);

  if (!doc) return null;
  const salario = doc.tipo === 'desprendible' ? (doc.renglones.find((x) => x.clave === 'salario_basico' || x.clave === 'salario')?.monto ?? perfil?.salario ?? null) : null;

  return (
    <Pantalla cabecera={<Cabecera />}>
      <Entrada indice={0} style={{ gap: 4 }}>
        <Texto tipo="pequeno" suave>
          {doc.periodo}
        </Texto>
        <Texto tipo="titulo2">{doc.tipo === 'desprendible' ? 'Tu desprendible, línea por línea' : `${doc.titulo}, línea por línea`}</Texto>
      </Entrada>
      <Entrada indice={1}>
        {explicado ? (
          <BurbujaLuca pose="muestra" texto="Toca cualquier línea y te cuento qué es." />
        ) : problema ? (
          <View style={{ gap: Espacio.s }}>
            <Aviso texto={`${problema.mensaje} Mientras tanto, aquí está lo que leí.`} />
            {problema.tipo !== 'tope' ? <Boton titulo="Intentar de nuevo" variante="texto" onPress={() => (setProblema(null), setIntento((n) => n + 1))} /> : null}
          </View>
        ) : (
          <View style={estilos.leyendo} accessibilityLiveRegion="polite">
            <Luca pose="lee" tamano={64} />
            <Texto tipo="cuerpoFuerte">Preparando la explicación</Texto>
          </View>
        )}
      </Entrada>
      <Entrada indice={2}>
        <Tarjeta style={{ paddingVertical: Espacio.s }}>
          <Texto tipo="titulo3" style={{ paddingTop: Espacio.s }}>
            {doc.titulo}
          </Texto>
          {doc.renglones.map((r, i) => {
            const monto = r.monto === null ? r.texto : `${DESCUENTOS.includes(r.clave) ? '−' : ''}${formatearCOP(r.monto)}`;
            const cabeza = (
              <View style={[estilos.renglon, letraGrande && [Apilado.fila, { gap: 2 }]]}>
                <Texto tipo={r.clave === 'neto' ? 'cuerpoFuerte' : 'cuerpo'} style={{ flexShrink: 1 }}>
                  {r.etiqueta}
                </Texto>
                <Texto tipo="cuerpoFuerte" esCifra style={{ textAlign: 'right' }}>
                  {monto}
                </Texto>
              </View>
            );
            return explicado && r.explicacion ? (
              <Expandible key={r.clave} cabeza={cabeza} etiqueta={`${r.etiqueta}: ${monto}. Ver qué es`} abierto={i === 1} ultimo={i === doc.renglones.length - 1}>
                {r.explicacion}
              </Expandible>
            ) : (
              <View key={r.clave} style={[estilos.fila, { borderBottomColor: tema.lineaSuave }]}>
                {cabeza}
              </View>
            );
          })}
        </Tarjeta>
      </Entrada>
      {salario ? (
        <Entrada indice={3}>
          <Tarjeta variante="superficie" style={{ gap: Espacio.s }}>
            <Texto tipo="titulo3">Lo que no aparece aquí</Texto>
            <Texto tipo="pequeno" suave>
              Este mes tu empresa también te va guardando:
            </Texto>
            <View style={[estilos.noVes, letraGrande && { flexDirection: 'column', gap: Espacio.s }]}>
              {[
                [prima(salario, 30), 'de prima'],
                [cesantias(salario, 30), 'de cesantías'],
              ].map(([v, t]) => (
                <View key={t} style={{ flex: 1 }}>
                  <Texto tipo="titulo3" esCifra>
                    {formatearCOP(v as number)}
                  </Texto>
                  <Texto tipo="pequeno" suave>
                    {t}
                  </Texto>
                </View>
              ))}
            </View>
          </Tarjeta>
        </Entrada>
      ) : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  renglon: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Espacio.m, flexWrap: 'wrap' },
  fila: { minHeight: 52, justifyContent: 'center', borderBottomWidth: 1 },
  leyendo: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m },
  noVes: { flexDirection: 'row', gap: Espacio.l },
});
