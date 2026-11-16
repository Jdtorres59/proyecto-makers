import { formatearCOP, type Renglon } from '@makers/core';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { Espacio, Forma, Movimiento, useTema } from '@/constants/tema';
import { haptica } from '@/lib/haptica';

import { Campo } from './campo';
import { Icono } from './icono';
import { Texto } from './texto';

/** Un renglón del documento tal como Luca lo leyó. `leido` lo marca con un visto cuando la lectura pasa por ahí. */
export function RenglonDocumento({ renglon, leido = true, total }: { renglon: Renglon; leido?: boolean; total?: boolean }) {
  const tema = useTema();
  const esDescuento = renglon.clave !== 'salario' && renglon.clave !== 'neto';
  const monto = renglon.monto === null ? 'Sin leer' : `${esDescuento ? '−' : ''}${formatearCOP(renglon.monto)}`;
  return (
    <View
      style={[estilos.renglon, { borderTopColor: total ? tema.linea : tema.lineaSuave, borderTopWidth: total ? Forma.contorno : 1 }]}
      accessible
      accessibilityLabel={`${renglon.etiqueta}: ${monto}${renglon.confianza === 'baja' ? '. Revisa este dato' : ''}`}>
      <View style={estilos.izquierda}>
        <View style={[estilos.visto, { borderColor: leido ? tema.verde : tema.lineaSuave, backgroundColor: leido ? tema.verde : 'transparent' }]}>
          {leido ? <Icono nombre="check" tamano={12} color={tema.sobreVerde} /> : null}
        </View>
        <Texto tipo={total ? 'cuerpoFuerte' : 'cuerpo'} style={{ flexShrink: 1 }}>
          {renglon.texto}
        </Texto>
      </View>
      <Texto tipo="cuerpoFuerte" esCifra>
        {monto}
      </Texto>
    </View>
  );
}

type FilaProps = {
  etiqueta: string;
  valor: string;
  /** Sin esta función la fila es solo de lectura. Devuelve false si el valor no sirve. */
  alGuardar?: (texto: string) => boolean;
  valorEditable?: string;
  numerico?: boolean;
};

/** Fila de "lo que leí": se corrige en el mismo lugar. Después de cambiarla queda marcada. */
export function FilaEditable({ etiqueta, valor, alGuardar, valorEditable = valor, numerico }: FilaProps) {
  const tema = useTema();
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(valorEditable);
  const [cambiada, setCambiada] = useState(false);
  const [error, setError] = useState(false);

  const guardar = () => {
    if (!alGuardar) return;
    if (!borrador.trim() || !alGuardar(borrador.trim())) return setError(true);
    haptica.toque();
    setError(false);
    setEditando(false);
    setCambiada(true);
  };

  return (
    <Animated.View layout={LinearTransition.springify().damping(Movimiento.resorte.damping)} style={[estilos.fila, { borderBottomColor: tema.lineaSuave }]}>
      {editando ? (
        <Animated.View entering={FadeIn.duration(Movimiento.rapido)} style={estilos.edicion}>
          <Campo
            etiqueta={etiqueta}
            autoFocus
            value={borrador}
            onChangeText={(t) => (setBorrador(t), setError(false))}
            onSubmitEditing={guardar}
            keyboardType={numerico ? 'number-pad' : 'default'}
            returnKeyType="done"
            esCifra={numerico}
          />
          {error ? (
            <Texto tipo="pequeno" accessibilityRole="alert">
              Revisa ese dato, no lo pude usar.
            </Texto>
          ) : null}
          <BotonFila titulo="Listo" onPress={guardar} />
        </Animated.View>
      ) : (
        <>
          <View style={estilos.texto}>
            <Texto tipo="pequeno" suave>
              {etiqueta}
            </Texto>
            <Texto tipo="cuerpoFuerte" esCifra={numerico}>
              {valor}
            </Texto>
            {cambiada ? (
              <Animated.View entering={FadeIn} style={estilos.cambiada}>
                <Icono nombre="check" tamano={14} color={tema.verde} />
                <Texto tipo="pequeno" color={tema.verde}>
                  Cambiado por ti
                </Texto>
              </Animated.View>
            ) : null}
          </View>
          {alGuardar ? <BotonFila titulo="Cambiar" etiquetaAccesible={`Cambiar ${etiqueta.toLowerCase()}`} onPress={() => (setBorrador(valorEditable), setEditando(true))} /> : null}
        </>
      )}
    </Animated.View>
  );
}

function BotonFila({ titulo, etiquetaAccesible, onPress }: { titulo: string; etiquetaAccesible?: string; onPress(): void }) {
  const tema = useTema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiquetaAccesible ?? titulo}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [estilos.botonFila, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
      <Icono nombre={titulo === 'Listo' ? 'check' : 'editar'} tamano={16} />
      <Texto tipo="pequeno" style={{ fontFamily: 'BricolageGrotesque_700Bold' }}>
        {titulo}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  renglon: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Espacio.m, paddingVertical: Espacio.s + 2 },
  izquierda: { flexDirection: 'row', alignItems: 'center', gap: Espacio.s, flexShrink: 1 },
  visto: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, paddingVertical: Espacio.m, borderBottomWidth: 1, minHeight: 64 },
  texto: { flex: 1, gap: 2 },
  edicion: { flex: 1, gap: Espacio.s },
  cambiada: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  botonFila: {
    minHeight: 44,
    minWidth: 44,
    borderWidth: 2,
    borderRadius: Forma.radioChico,
    paddingHorizontal: Espacio.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
});
