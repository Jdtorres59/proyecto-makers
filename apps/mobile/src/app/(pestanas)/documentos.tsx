import type { DocumentoLeido, TipoDocumento } from '@makers/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Entrada } from '@/components/entrada';
import { Hoja } from '@/components/hoja';
import { Icono } from '@/components/icono';
import { BurbujaLuca, Ilustracion } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Pdf } from '@/components/pdf';
import { Texto } from '@/components/texto';
import { Espacio, Forma, Fuente, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { ARCHIVOS_DE_MUESTRA } from '@/lib/datos/muestra';
import { haptica } from '@/lib/haptica';

const NOMBRE_TIPO: Record<TipoDocumento, string> = {
  desprendible: 'Desprendible',
  extracto: 'Extracto',
  oferta_credito: 'Oferta de crédito',
  certificado_cesantias: 'Certificado de cesantías',
  contrato: 'Contrato',
  otro: 'Documento',
};
const TAMBIEN = ['Extractos de tarjeta', 'Cuentas de cobro', 'Certificado de cesantías', 'Recibos de crédito', 'Contratos'];

export default function Documentos() {
  const tema = useTema();
  const { documentos, leerDocumento } = useLuca();
  const [hoja, setHoja] = useState(false);
  const [leyendo, setLeyendo] = useState<TipoDocumento | null>(null);

  const subir = async (tipo: TipoDocumento) => {
    setLeyendo(tipo);
    const doc = await leerDocumento(tipo);
    setLeyendo(null);
    setHoja(false);
    // iOS pierde un push que llega mientras se desmonta el Modal de la hoja.
    setTimeout(() => router.push({ pathname: '/documento/[id]', params: { id: doc.id } }), 120);
  };

  return (
    <Pantalla conPestanas>
      <Entrada indice={0}>
        <Texto tipo="titulo">Mis documentos</Texto>
      </Entrada>

      {documentos.length ? (
        <Entrada indice={1} style={{ gap: Espacio.s }}>
          {documentos.map((d, i) => (
            <FilaDocumento key={d.id} doc={d} nuevo={i === 0} />
          ))}
        </Entrada>
      ) : (
        <Entrada indice={1} style={{ alignItems: 'center', gap: Espacio.m }}>
          <Ilustracion nombre="escenas/vacio" ancho={180} />
          <BurbujaLuca pose="espera" texto="Todavía no me has mostrado ningún documento. Cuando subas uno, te lo explico línea por línea." />
        </Entrada>
      )}

      <Entrada indice={2}>
        <Pressable
          onPress={() => (haptica.toque(), setHoja(true))}
          accessibilityRole="button"
          accessibilityLabel="Subir otro documento"
          style={({ pressed }) => [estilos.subir, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : 'transparent' }]}>
          <Icono nombre="mas" tamano={22} />
          <Texto tipo="boton">Subir otro documento</Texto>
        </Pressable>
      </Entrada>

      <Entrada indice={3} style={{ gap: Espacio.s }}>
        <Texto tipo="titulo3" role="heading">
          También entiendo
        </Texto>
        <View style={estilos.pildoras}>
          {TAMBIEN.map((t) => (
            <View key={t} style={[estilos.pildora, { borderColor: tema.lineaSuave, backgroundColor: tema.superficie }]}>
              <Texto tipo="pequeno">{t}</Texto>
            </View>
          ))}
        </View>
      </Entrada>

      <Hoja visible={hoja} alCerrar={() => setHoja(false)} titulo="Sube un documento">
        <Texto suave>Un extracto, una oferta de crédito o un desprendible nuevo.</Texto>
        {/* Datos de muestra: el selector de archivos real llega con la API (paso 5). */}
        {ARCHIVOS_DE_MUESTRA.map((a) => (
          <Pressable
            key={a.nombre}
            onPress={() => subir(a.tipo)}
            disabled={leyendo !== null}
            accessibilityRole="button"
            accessibilityLabel={`${a.nombre}, ${a.donde}`}
            style={({ pressed }) => [estilos.archivo, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
            <Pdf />
            <View style={{ flex: 1 }}>
              <Texto tipo="cuerpoFuerte">{a.nombre}</Texto>
              <Texto tipo="pequeno" suave>
                {leyendo === a.tipo ? 'Leyendo…' : a.donde}
              </Texto>
            </View>
          </Pressable>
        ))}
        <Boton titulo="Tomar una foto" variante="secundario" icono={<Icono nombre="camara" tamano={20} color={tema.sobreVerde} />} disabled={leyendo !== null} onPress={() => subir('desprendible')} />
      </Hoja>
    </Pantalla>
  );
}

function FilaDocumento({ doc, nuevo }: { doc: DocumentoLeido; nuevo: boolean }) {
  const tema = useTema();
  const explicado = doc.renglones.every((x) => x.explicacion);
  return (
    <Pressable
      onPress={() => (haptica.toque(), router.push({ pathname: '/documento/[id]', params: { id: doc.id } }))}
      accessibilityRole="button"
      accessibilityLabel={`${NOMBRE_TIPO[doc.tipo]}: ${doc.titulo}, ${doc.periodo ?? ''}${explicado ? ', explicado' : ''}`}
      style={({ pressed }) => [estilos.archivo, { borderColor: tema.linea, backgroundColor: pressed ? tema.superficie : tema.papel }]}>
      <Pdf />
      <View style={{ flex: 1 }}>
        <Texto tipo="cuerpoFuerte">{NOMBRE_TIPO[doc.tipo]}</Texto>
        <Texto tipo="pequeno" suave>
          {doc.titulo}
          {explicado ? ' · explicado' : ''}
        </Texto>
      </View>
      {nuevo ? (
        <View style={[estilos.nuevo, { backgroundColor: tema.verde }]}>
          <Texto tipo="pequeno" color={tema.sobreVerde} style={{ fontFamily: Fuente.negrita }}>
            Nuevo
          </Texto>
        </View>
      ) : (
        <Icono nombre="flecha" tamano={20} color={tema.textoSuave} />
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  archivo: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m, minHeight: 72 },
  subir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Espacio.s, borderWidth: Forma.contorno, borderStyle: 'dashed', borderRadius: Forma.radio, minHeight: 56 },
  pildoras: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.s },
  pildora: { borderWidth: 1.5, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  nuevo: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
});
