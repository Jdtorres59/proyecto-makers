import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Entrada } from '@/components/entrada';
import { Icono } from '@/components/icono';
import { Ilustracion } from '@/components/luca';
import { Cabecera, Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, Forma, useTema } from '@/constants/tema';
import { grabado, type NombreAsset } from '@/lib/assets';
import { moduloTerminado, useLuca } from '@/lib/datos/contexto';
import { haptica } from '@/lib/haptica';
import { Image } from 'expo-image';

/** Un módulo: portada enmarcada, promesa, lecciones en orden y su medalla. */
export default function ModuloPantalla() {
  const tema = useTema();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { modulos, progreso } = useLuca();
  const m = modulos.find((x) => x.id === id);
  if (!m) return null;
  const ancho = Math.min(width, 560) - Espacio.xl * 2;
  const ganada = progreso.medallas.includes(m.id);
  const terminado = moduloTerminado(m, progreso);
  const siguiente = m.lecciones.find((l) => !progreso.leccionesTerminadas.includes(l.id));

  return (
    <Pantalla cabecera={<Cabecera />}>
      <Entrada indice={0}>
        <View style={{ width: ancho, height: (ancho * 2) / 3 }}>
          <Ilustracion nombre={`portadas/${m.portada}` as NombreAsset} ancho={ancho} alto={(ancho * 2) / 3} />
          <Image source={grabado('marco-portada', tema.oscuro)} style={StyleSheet.absoluteFill} contentFit="fill" alt="" aria-hidden />
        </View>
      </Entrada>
      <Entrada indice={1} style={{ gap: Espacio.s }}>
        <Texto tipo="pequeno" suave>
          Módulo {m.orden} de 12
        </Texto>
        <Texto tipo="titulo">{m.titulo}</Texto>
        <Texto suave>{m.promesa}</Texto>
        {!m.publicado ? (
          <Texto tipo="pequeno" suave>
            Borrador: sus cifras esperan la revisión de una persona antes de publicarse.
          </Texto>
        ) : null}
      </Entrada>

      <Entrada indice={2}>
        {m.lecciones.map((l, i) => {
          const hecha = progreso.leccionesTerminadas.includes(l.id);
          const esSiguiente = siguiente?.id === l.id;
          return (
            <Pressable
              key={l.id}
              onPress={() => (haptica.toque(), router.push({ pathname: '/leccion/[modulo]/[leccion]', params: { modulo: m.id, leccion: l.id } }))}
              accessibilityRole="button"
              accessibilityLabel={`Lección ${i + 1}: ${l.titulo}. ${l.minutos} minutos${hecha ? '. Terminada' : ''}`}
              style={({ pressed }) => [
                estilos.leccion,
                { borderColor: esSiguiente ? tema.linea : tema.lineaSuave, backgroundColor: pressed ? tema.superficie : esSiguiente ? tema.papel : 'transparent', borderWidth: esSiguiente ? Forma.contorno : 1.5 },
              ]}>
              <View style={[estilos.numero, { backgroundColor: hecha ? tema.verde : esSiguiente ? tema.maiz : tema.superficie, borderColor: tema.linea }]}>
                {hecha ? (
                  <Icono nombre="check" tamano={16} color={tema.sobreVerde} />
                ) : (
                  <Texto tipo="pequeno" esCifra color={esSiguiente ? tema.sobreMaiz : tema.texto} style={{ fontFamily: 'BricolageGrotesque_700Bold' }}>
                    {i + 1}
                  </Texto>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Texto tipo="cuerpoFuerte">{l.titulo}</Texto>
                <Texto tipo="pequeno" suave>
                  {hecha ? 'Terminada' : `${l.minutos} minutos`}
                </Texto>
              </View>
              <Icono nombre="flecha" tamano={20} color={tema.textoSuave} />
            </Pressable>
          );
        })}
      </Entrada>

      <Entrada indice={3}>
        <Tarjeta variante="superficie" style={estilos.medalla}>
          {ganada ? (
            <Ilustracion nombre={`medallas/${m.medalla}` as NombreAsset} ancho={72} />
          ) : (
            <Image source={grabado('medalla-bloqueada', tema.oscuro)} style={{ width: 72, height: 72 }} alt="" aria-hidden />
          )}
          <View style={{ flex: 1, gap: 2 }}>
            <Texto tipo="cuerpoFuerte">{ganada ? 'Tu medalla' : 'La medalla de este módulo'}</Texto>
            <Texto tipo="pequeno" suave>
              {terminado ? 'Terminaste el módulo y Luca creció.' : ganada ? 'Ya cumpliste la acción. Termina las lecciones para completarlo.' : 'Se gana cumpliendo la acción de la última lección.'}
            </Texto>
          </View>
        </Tarjeta>
      </Entrada>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  leccion: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderRadius: Forma.radio, padding: Espacio.m, marginBottom: Espacio.s, minHeight: 64 },
  numero: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  medalla: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m },
});
