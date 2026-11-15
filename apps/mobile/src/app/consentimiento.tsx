import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/components/boton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSesion } from '@/lib/sesion';
import { supabase } from '@/lib/supabase';

// PENDIENTE: este texto es un borrador de trabajo, no un texto legal. Antes de probar con
// personas reales debe revisarlo alguien que conozca la Ley 1581 de 2012. Al cambiarlo,
// cambia VERSION_CONSENTIMIENTO en lib/sesion.tsx para que todos vuelvan a aceptarlo.
const PUNTOS = [
  'Guardamos tu correo, lo que escribes en la app y los documentos que decidas subir.',
  'Lo usamos para responderte y para mejorar el producto. No lo vendemos ni lo compartimos con bancos.',
  'Lo que escribes se envía a un modelo de inteligencia artificial para generar la respuesta.',
  'Puedes pedir que borremos tus datos cuando quieras.',
];

export default function Consentimiento() {
  const { aceptarConsentimiento } = useSesion();
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
    <ThemedView style={estilos.fondo}>
      <SafeAreaView style={estilos.fondo}>
        <ScrollView contentContainerStyle={estilos.contenido}>
          <ThemedText type="subtitle">Antes de empezar</ThemedText>
          <ThemedText themeColor="textSecondary">Esto es lo que hacemos con tus datos.</ThemedText>
          {PUNTOS.map((punto) => (
            <ThemedText key={punto}>• {punto}</ThemedText>
          ))}
          {error ? (
            <ThemedText accessibilityRole="alert" type="small">
              {error}
            </ThemedText>
          ) : null}
          <Boton titulo="Autorizo el uso de mis datos" cargando={cargando} onPress={aceptar} />
          <Boton titulo="No autorizo, salir" secundario onPress={() => supabase.auth.signOut()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1 },
  contenido: { flexGrow: 1, justifyContent: 'center', gap: Spacing.three, padding: Spacing.four, maxWidth: 480, width: '100%', alignSelf: 'center' },
});
