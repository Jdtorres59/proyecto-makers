import { type EventoDePlata, formatearCOP } from '@makers/core';
import { StyleSheet, View } from 'react-native';

import { Espacio, Forma, useTema } from '@/constants/tema';
import { fechaCorta, fechaLarga } from '@/lib/fechas';

import { Entrada } from './entrada';
import { Texto } from './texto';

type Item = EventoDePlata & { detalle: string; destacado?: boolean };

/**
 * Línea de tiempo de "Lo que viene": la fecha en una ficha, qué pasa y cuánto. Lo que entra va en verde con +,
 * lo que sale con −. Lo que va al fondo (cesantías) no lleva +: no llega a tu cuenta.
 * Sin monto conocido dice "No lo sé todavía", nunca $0.
 */
export function LoQueViene({ items, desde = 0 }: { items: Item[]; desde?: number }) {
  const tema = useTema();
  return (
    <View>
      {items.map((x, i) => {
        const { dia, mes } = fechaCorta(x.fecha);
        const alFondo = x.tipo === 'cesantias';
        const monto =
          x.monto === null ? 'No lo sé todavía' : `${x.sentido === 'sale' ? '−' : alFondo ? '' : '+'}${formatearCOP(x.monto)}`;
        const ultimo = i === items.length - 1;
        return (
          <Entrada key={`${x.tipo}-${x.fecha}-${x.titulo}`} indice={desde + i}>
            <View
              style={estilos.fila}
              accessible
              accessibilityLabel={`${fechaLarga(x.fecha)}. ${x.titulo}. ${x.detalle}. ${monto}`}>
              <View style={estilos.columnaFecha}>
                <View
                  style={[
                    estilos.ficha,
                    { borderColor: tema.linea, backgroundColor: x.destacado ? tema.maiz : tema.papel },
                  ]}>
                  <Texto tipo="titulo3" esCifra color={x.destacado ? tema.sobreMaiz : tema.texto} style={estilos.dia}>
                    {dia}
                  </Texto>
                  <Texto tipo="pequeno" color={x.destacado ? tema.sobreMaiz : tema.textoSuave} style={estilos.mes}>
                    {mes}
                  </Texto>
                </View>
                {!ultimo ? <View style={[estilos.hilo, { backgroundColor: tema.lineaSuave }]} /> : null}
              </View>
              <View style={estilos.cuerpo}>
                <View style={estilos.textos}>
                  <Texto tipo="cuerpoFuerte">{x.titulo}</Texto>
                  <Texto tipo="pequeno" suave>
                    {x.detalle}
                  </Texto>
                </View>
                <Texto
                  tipo="cuerpoFuerte"
                  esCifra
                  color={x.monto !== null && x.sentido === 'entra' && !alFondo ? tema.verde : x.monto === null ? tema.textoSuave : tema.texto}
                  style={estilos.monto}>
                  {monto}
                </Texto>
              </View>
            </View>
          </Entrada>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', gap: Espacio.m },
  columnaFecha: { alignItems: 'center', width: 52 },
  ficha: { width: 52, minHeight: 54, borderWidth: Forma.contorno, borderRadius: Forma.radioChico, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  dia: { lineHeight: 22 },
  mes: { lineHeight: 16 },
  hilo: { width: 2.5, flex: 1, minHeight: 14, marginVertical: 4, borderRadius: 2 },
  cuerpo: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', columnGap: Espacio.s, paddingTop: 6, paddingBottom: Espacio.l },
  textos: { flexShrink: 1, flexGrow: 1, flexBasis: 140, gap: 2 },
  monto: { textAlign: 'right', flexGrow: 1 },
});
