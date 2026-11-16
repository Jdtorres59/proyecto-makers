import type { TipoDocumento } from '@makers/core';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Espacio, Forma, useTema } from '@/constants/tema';
import { elegirArchivo, tomarFoto } from '@/lib/archivos';
import type { Archivo } from '@/lib/datos/fuente';
import { haptica } from '@/lib/haptica';

import { Boton } from './boton';
import { Hoja } from './hoja';
import { Icono } from './icono';
import { Pdf } from './pdf';
import { Texto } from './texto';

/** Archivos que ofrece el modo demostración, en lugar del selector real. */
const DEMO: { pista: TipoDocumento; nombre: string; donde: string }[] = [
  { pista: 'desprendible', nombre: 'desprendible-nov-2026.pdf', donde: 'Descargas · hace 2 días' },
  { pista: 'extracto', nombre: 'extracto-nov-2026.pdf', donde: 'Descargas · hoy' },
  { pista: 'oferta_credito', nombre: 'oferta-prestamo.pdf', donde: 'Correo · ayer' },
];

type Props = {
  visible: boolean;
  alCerrar(): void;
  titulo: string;
  texto: string;
  demo: boolean;
  /** En la demo, qué papeles ficticios se ofrecen. */
  pistas?: TipoDocumento[];
  alElegir(archivo: Archivo): void;
};

/**
 * Hoja para subir un documento. Con cuenta: selector de archivos y cámara reales. En la demo: los papeles
 * ficticios. La hoja se cierra antes de avisar, porque iOS pierde una navegación que llega mientras se desmonta.
 */
export function HojaSubir({ visible, alCerrar, titulo, texto, demo, pistas = ['desprendible'], alElegir }: Props) {
  const tema = useTema();
  const [ocupado, setOcupado] = useState(false);
  const entregar = (a: Archivo | null) => {
    setOcupado(false);
    if (!a) return;
    alCerrar();
    setTimeout(() => alElegir(a), 120);
  };
  const abrir = async (como: () => Promise<Archivo | null>) => {
    haptica.toque();
    setOcupado(true);
    try {
      entregar(await como());
    } catch {
      setOcupado(false);
    }
  };

  return (
    <Hoja visible={visible} alCerrar={alCerrar} titulo={titulo}>
      <Texto suave>{texto}</Texto>
      {demo ? (
        DEMO.filter((a) => pistas.includes(a.pista)).map((a) => (
          <Pressable
            key={a.nombre}
            onPress={() => entregar({ uri: '', nombre: a.nombre, mime: 'application/pdf', pista: a.pista })}
            accessibilityRole="button"
            accessibilityLabel={`${a.nombre}, ${a.donde}`}
            style={({ pressed }) => [estilos.archivo, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
            <Pdf />
            <View style={{ flex: 1 }}>
              <Texto tipo="cuerpoFuerte">{a.nombre}</Texto>
              <Texto tipo="pequeno" suave>
                {a.donde}
              </Texto>
            </View>
          </Pressable>
        ))
      ) : (
        <Boton titulo="Elegir un archivo" cargando={ocupado} icono={<Icono nombre="subir" tamano={20} color={tema.sobreMaiz} />} onPress={() => abrir(elegirArchivo)} />
      )}
      <Boton
        titulo="Tomar una foto"
        variante="secundario"
        disabled={ocupado}
        icono={<Icono nombre="camara" tamano={20} color={tema.sobreVerde} />}
        onPress={() => (demo ? entregar({ uri: '', nombre: 'foto.jpg', mime: 'image/jpeg', pista: pistas[0] }) : abrir(tomarFoto))}
      />
      {!demo ? (
        <Texto tipo="pequeno" suave>
          Sirve un PDF o una foto nítida (JPG o PNG). Se guarda en tu espacio privado.
        </Texto>
      ) : null}
    </Hoja>
  );
}

const estilos = StyleSheet.create({
  archivo: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 64 },
});
