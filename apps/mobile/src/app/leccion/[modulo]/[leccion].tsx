import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Celebracion } from '@/components/celebracion';
import { Entrada } from '@/components/entrada';
import { Icono } from '@/components/icono';
import { Ilustracion } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { PasoVista, TarjetaRegla } from '@/components/pasos';
import { Tajadas } from '@/components/tajadas';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Movimiento, useTema } from '@/constants/tema';
import type { NombreAsset } from '@/lib/assets';
import { useLuca } from '@/lib/datos/contexto';
import { leccionDePrueba } from '@/lib/datos/pasos-de-prueba';
import { haptica } from '@/lib/haptica';

/** Reproductor de cualquier lección: un paso por pantalla, tajadas de progreso y cierre con celebración. */
export default function LeccionPantalla() {
  const tema = useTema();
  const { modulo: idModulo, leccion: idLeccion } = useLocalSearchParams<{ modulo: string; leccion: string }>();
  const { modulos, terminarLeccion, ganarMedalla, progreso } = useLuca();
  const modulo = modulos.find((m) => m.id === idModulo);
  const leccion = idModulo === 'prueba' && __DEV__ ? leccionDePrueba() : modulo?.lecciones.find((l) => l.id === idLeccion);
  const [indice, setIndice] = useState(0);
  const [listo, setListo] = useState(false);
  const [accionCumplida, setAccionCumplida] = useState(false);
  const [terminada, setTerminada] = useState(false);
  const alListo = () => setListo(true);
  const yaTeniaMedalla = !!modulo && progreso.medallas.includes(modulo.id);

  useEffect(() => {
    if (!terminada || !leccion) return;
    if (modulo) {
      terminarLeccion(leccion.id);
      if (accionCumplida) ganarMedalla(modulo.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminada]);

  if (!leccion) return null;
  const total = leccion.pasos.length;
  const ultimo = indice === total - 1;
  const regla = leccion.pasos.find((p) => p.tipo === 'regla');
  const medallaNueva = accionCumplida && !yaTeniaMedalla && !!modulo;

  const seguir = () => {
    haptica.firme();
    if (ultimo) return setTerminada(true);
    setIndice(indice + 1);
    setListo(false);
  };

  const cerrar = (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Cerrar la lección"
      hitSlop={4}
      style={({ pressed }) => [estilos.cerrar, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
      <Icono nombre="cerrar" tamano={20} />
    </Pressable>
  );

  if (terminada) {
    return (
      <Pantalla pie={<Boton titulo={modulo ? 'Volver al módulo' : 'Volver'} onPress={() => router.back()} />}>
        <Entrada indice={0} style={{ marginTop: Espacio.l }}>
          <Celebracion tamano={140} />
        </Entrada>
        <Entrada indice={1} style={{ gap: Espacio.s }}>
          <Texto tipo="titulo" style={{ textAlign: 'center' }}>
            Lección terminada
          </Texto>
          <Texto suave style={{ textAlign: 'center' }}>
            {leccion.titulo}
          </Texto>
        </Entrada>
        {medallaNueva ? (
          <Entrada indice={2} style={{ alignItems: 'center', gap: Espacio.s }}>
            <Animated.View entering={ZoomIn.delay(600).springify().damping(Movimiento.resorteVivo.damping)}>
              <Ilustracion nombre={`medallas/${modulo!.medalla}` as NombreAsset} ancho={128} />
            </Animated.View>
            <Texto tipo="titulo3" style={{ textAlign: 'center' }}>
              Ganaste la medalla de {modulo!.titulo.toLowerCase()}
            </Texto>
          </Entrada>
        ) : regla && regla.tipo === 'regla' ? (
          <Entrada indice={2}>
            <TarjetaRegla texto={regla.texto} />
          </Entrada>
        ) : null}
      </Pantalla>
    );
  }

  return (
    <Pantalla
      cabecera={
        <>
          {cerrar}
          <Tajadas total={total} actual={indice + 1} etiqueta={`Paso ${indice + 1} de ${total}`} />
          <View style={{ width: 44 }} />
        </>
      }
      pie={<Boton titulo={ultimo ? 'Terminar' : 'Seguir'} disabled={!listo} onPress={seguir} />}>
      <Texto tipo="pequeno" suave>
        {modulo ? `${modulo.titulo} · ` : ''}
        {leccion.titulo}
      </Texto>
      {/* La clave reinicia el paso: entradas, voz de Luca y estado. */}
      <PasoVista key={indice} paso={leccion.pasos[indice]} alListo={alListo} alCumplirAccion={() => setAccionCumplida(true)} />
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  cerrar: { width: 44, height: 44, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
