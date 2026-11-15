import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/components/boton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ejecutarIA } from '@/lib/api';
import { registrarEvento, supabase } from '@/lib/supabase';

const AVISOS = {
  rechazo: 'El modelo no respondió a esta solicitud.',
  truncado: 'La respuesta quedó incompleta.',
  error: 'Algo falló generando la respuesta.',
} as const;

/**
 * Pantalla interna para probar el ciclo completo: app -> API -> agente -> registro -> valoración.
 * No es una pantalla de producto: se reemplaza cuando el equipo defina qué construir.
 */
export default function PruebaIA() {
  const tema = useTheme();
  const [mensaje, setMensaje] = useState('¿Cuánto es el 4% de $3.600.000?');
  const [respuesta, setRespuesta] = useState('');
  const [herramientas, setHerramientas] = useState<string[]>([]);
  const [runId, setRunId] = useState<string | null>(null);
  const [valor, setValor] = useState<1 | -1 | null>(null);
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    setCargando(true);
    setRespuesta('');
    setHerramientas([]);
    setRunId(null);
    setValor(null);
    setAviso('');
    try {
      await ejecutarIA('base', mensaje, (evento) => {
        if (evento.tipo === 'texto') setRespuesta((previo) => previo + evento.delta);
        if (evento.tipo === 'herramienta') setHerramientas((previas) => [...previas, evento.nombre]);
        if (evento.tipo === 'fin') {
          setRunId(evento.runId);
          if (evento.estado !== 'ok') setAviso(AVISOS[evento.estado]);
        }
      });
      registrarEvento('ia_ejecutada', { agente: 'base' });
    } catch (e) {
      setAviso(e instanceof Error ? e.message : 'No se pudo conectar con la API.');
    }
    setCargando(false);
  }

  async function valorar(nuevo: 1 | -1) {
    if (!runId) return;
    setValor(nuevo);
    const { error } = await supabase.from('ai_feedback').upsert({ run_id: runId, value: nuevo });
    if (error) {
      setValor(null);
      setAviso('No se guardó tu valoración.');
    }
  }

  return (
    <ThemedView style={estilos.fondo}>
      <SafeAreaView style={estilos.fondo}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.fondo}>
          <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
            <ThemedText type="subtitle">Prueba de IA</ThemedText>
            <ThemedText themeColor="textSecondary">Pantalla interna de la base técnica.</ThemedText>

            <TextInput
              accessibilityLabel="Mensaje para el agente"
              multiline
              value={mensaje}
              onChangeText={setMensaje}
              placeholder="Escribe una pregunta"
              placeholderTextColor={tema.textSecondary}
              style={[estilos.campo, { color: tema.text, backgroundColor: tema.backgroundElement }]}
            />
            <Boton titulo="Enviar" cargando={cargando} disabled={!mensaje.trim()} onPress={enviar} />

            {herramientas.length > 0 && (
              <ThemedText type="small" themeColor="textSecondary">
                Herramientas usadas: {herramientas.join(', ')}
              </ThemedText>
            )}
            {respuesta ? (
              <ThemedText accessibilityLiveRegion="polite" selectable>
                {respuesta}
              </ThemedText>
            ) : null}
            {aviso ? (
              <ThemedText accessibilityRole="alert" type="small">
                {aviso}
              </ThemedText>
            ) : null}

            {runId && (
              <View style={estilos.fila}>
                <Boton
                  titulo={valor === 1 ? 'Sirvió ✓' : 'Sirvió'}
                  secundario={valor !== 1}
                  onPress={() => valorar(1)}
                  style={estilos.mitad}
                />
                <Boton
                  titulo={valor === -1 ? 'No sirvió ✓' : 'No sirvió'}
                  secundario={valor !== -1}
                  onPress={() => valorar(-1)}
                  style={estilos.mitad}
                />
              </View>
            )}

            <Boton titulo="Cerrar sesión" secundario onPress={() => supabase.auth.signOut()} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1 },
  contenido: { gap: Spacing.three, padding: Spacing.four, maxWidth: 480, width: '100%', alignSelf: 'center' },
  campo: { minHeight: 96, borderRadius: 12, padding: Spacing.three, fontSize: 16, textAlignVertical: 'top' },
  fila: { flexDirection: 'row', gap: Spacing.two },
  mitad: { flex: 1 },
});
