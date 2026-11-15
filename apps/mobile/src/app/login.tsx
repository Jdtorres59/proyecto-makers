import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/components/boton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const tema = useTheme();
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function intentar(accion: () => Promise<{ error: { message: string } | null }>) {
    setCargando(true);
    setError('');
    const { error } = await accion();
    setCargando(false);
    if (error) setError(error.message);
    return !error;
  }

  const pedirCodigo = async () => {
    if (await intentar(() => supabase.auth.signInWithOtp({ email: correo.trim() }))) setEnviado(true);
  };
  // Al verificar, la sesión cambia y el layout muestra la siguiente pantalla.
  const entrar = () =>
    intentar(() => supabase.auth.verifyOtp({ email: correo.trim(), token: codigo.trim(), type: 'email' }));

  const campo = [estilos.campo, { color: tema.text, backgroundColor: tema.backgroundElement }];
  return (
    <ThemedView style={estilos.fondo}>
      <SafeAreaView style={estilos.fondo}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.contenido}>
          <ThemedText type="subtitle">Entra con tu correo</ThemedText>
          <ThemedText themeColor="textSecondary">
            {enviado ? `Escribe el código que llegó a ${correo.trim()}.` : 'Te mandamos un código. Sin contraseñas.'}
          </ThemedText>

          {enviado ? (
            <TextInput
              accessibilityLabel="Código de verificación"
              autoFocus
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              placeholder="Código"
              placeholderTextColor={tema.textSecondary}
              value={codigo}
              onChangeText={setCodigo}
              onSubmitEditing={entrar}
              style={campo}
            />
          ) : (
            <TextInput
              accessibilityLabel="Correo"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              placeholder="tu@correo.com"
              placeholderTextColor={tema.textSecondary}
              value={correo}
              onChangeText={setCorreo}
              onSubmitEditing={pedirCodigo}
              style={campo}
            />
          )}

          {error ? (
            <ThemedText accessibilityRole="alert" type="small">
              {error}
            </ThemedText>
          ) : null}

          {enviado ? (
            <>
              <Boton titulo="Entrar" cargando={cargando} disabled={!codigo.trim()} onPress={entrar} />
              <Boton titulo="Usar otro correo" secundario onPress={() => (setEnviado(false), setCodigo(''), setError(''))} />
            </>
          ) : (
            <Boton titulo="Enviar código" cargando={cargando} disabled={!correo.includes('@')} onPress={pedirCodigo} />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1 },
  contenido: { flex: 1, justifyContent: 'center', gap: Spacing.three, padding: Spacing.four, maxWidth: 480, width: '100%', alignSelf: 'center' },
  campo: { minHeight: 48, borderRadius: 12, paddingHorizontal: Spacing.three, fontSize: 16 },
});
