import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { Entrada } from '@/components/entrada';
import { Icono } from '@/components/icono';
import { BurbujaLuca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, Forma, useTema } from '@/constants/tema';
import type { NombreIcono } from '@/lib/assets';
import { useSesion } from '@/lib/sesion';

// PENDIENTE: este texto es un borrador de trabajo, no un texto legal. Antes de probar con
// personas reales debe revisarlo alguien que conozca la Ley 1581 de 2012. Al cambiarlo,
// cambia VERSION_CONSENTIMIENTO en lib/sesion.tsx para que todos vuelvan a aceptarlo.
const PUNTOS: { icono: NombreIcono; texto: string }[] = [
  { icono: 'documentos', texto: 'Guardamos tu correo, lo que escribes en la app y los documentos que decidas subir.' },
  { icono: 'candado', texto: 'Lo usamos para responderte y para mejorar el producto. No lo vendemos ni lo compartimos con bancos.' },
  { icono: 'chispa', texto: 'Lo que escribes se envía a un modelo de inteligencia artificial para generar la respuesta.' },
  { icono: 'eliminar', texto: 'Puedes pedir que borremos tus datos cuando quieras.' },
];

export default function Consentimiento() {
  const tema = useTema();
  const { aceptarConsentimiento, salir } = useSesion();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function aceptar() {
    setCargando(true);
    setError('');
    try {
      await aceptarConsentimiento();
    } catch {
      setError('No pudimos guardar tu autorización. Intenta de nuevo.');
      setCargando(false);
    }
  }

  return (
    <Pantalla
      pie={
        <>
          {error ? <Aviso texto={error} /> : null}
          <Boton titulo="Autorizo el uso de mis datos" cargando={cargando} onPress={aceptar} />
          <Boton titulo="No autorizo, salir" variante="texto" disabled={cargando} onPress={salir} />
        </>
      }>
      <Entrada indice={0}>
        <Texto tipo="titulo">Antes de empezar</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca texto="Esto es lo que hago con tus datos. Léelo con calma: sin tu permiso no guardo nada." />
      </Entrada>
      <Entrada indice={2}>
        <Tarjeta style={{ padding: 0 }}>
          {PUNTOS.map(({ icono, texto }, i) => (
            <View key={texto} style={[estilos.punto, i > 0 && { borderTopWidth: 1, borderTopColor: tema.lineaSuave }]}>
              <View style={[estilos.icono, { backgroundColor: tema.superficie, borderColor: tema.linea }]}>
                <Icono nombre={icono} tamano={20} />
              </View>
              <Texto style={{ flex: 1 }}>{texto}</Texto>
            </View>
          ))}
        </Tarjeta>
      </Entrada>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  punto: { flexDirection: 'row', gap: Espacio.m, padding: Espacio.l, alignItems: 'flex-start' },
  icono: { width: 36, height: 36, borderRadius: Forma.radioChico, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
