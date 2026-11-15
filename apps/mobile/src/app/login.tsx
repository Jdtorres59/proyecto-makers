import type { Provider } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/components/boton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

// Para sumar otro proveedor: actívalo en Supabase (Authentication > Sign In / Providers) y agrégalo aquí.
const PROVEEDORES: { id: Provider; titulo: string }[] = [
  { id: 'google', titulo: 'Continuar con Google' },
  { id: 'apple', titulo: 'Continuar con Apple' },
];

// A dónde vuelve la persona después de autenticarse con Google o Apple. Debe estar en la lista
// de Redirect URLs del proyecto de Supabase (makers://** y la de Expo Go en desarrollo).
const REGRESO = Linking.createURL('/');

/** Tres formas de entrar: Google, Apple o un código que llega al correo. Ninguna usa contraseña. */
export default function Login() {
  const tema = useTheme();
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState<Provider | 'correo' | null>(null);
  const [error, setError] = useState('');

  /** Corre un paso de ingreso mostrando carga y error. Devuelve true si salió bien. */
  async function intentar(quien: Provider | 'correo', paso: () => Promise<void>) {
    setCargando(quien);
    setError('');
    try {
      await paso();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.');
      return false;
    } finally {
      setCargando(null);
    }
  }

  const conProveedor = (provider: Provider) =>
    intentar(provider, async () => {
      // En web el navegador se va a la página del proveedor y vuelve con la sesión.
      // En el celular se abre un navegador seguro del sistema y la app canjea el código que regresa.
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: REGRESO, skipBrowserRedirect: Platform.OS !== 'web' },
      });
      if (error) throw error;
      if (Platform.OS === 'web') return;

      const resultado = await WebBrowser.openAuthSessionAsync(data.url, REGRESO);
      if (resultado.type !== 'success') return; // la persona cerró el navegador
      const codigoDeAcceso = new URL(resultado.url).searchParams.get('code');
      if (!codigoDeAcceso) throw new Error('El proveedor no devolvió un código de acceso.');
      const canje = await supabase.auth.exchangeCodeForSession(codigoDeAcceso);
      if (canje.error) throw canje.error;
    });

  const pedirCodigo = async () => {
    const salioBien = await intentar('correo', async () => {
      const { error } = await supabase.auth.signInWithOtp({ email: correo.trim() });
      if (error) throw error;
    });
    if (salioBien) setEnviado(true);
  };

  // Al verificar, la sesión cambia y el layout muestra la siguiente pantalla.
  const verificarCodigo = () =>
    intentar('correo', async () => {
      const { error } = await supabase.auth.verifyOtp({ email: correo.trim(), token: codigo.trim(), type: 'email' });
      if (error) throw error;
    });

  const campo = [estilos.campo, { color: tema.text, backgroundColor: tema.backgroundElement }];
  const ocupado = cargando !== null;

  return (
    <ThemedView style={estilos.fondo}>
      <SafeAreaView style={estilos.fondo}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.contenido}>
          <ThemedText type="subtitle">Entra a Makers</ThemedText>

          {enviado ? (
            <>
              <ThemedText themeColor="textSecondary">Escribe el código que llegó a {correo.trim()}.</ThemedText>
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
                onSubmitEditing={verificarCodigo}
                style={campo}
              />
              <Boton titulo="Entrar" cargando={cargando === 'correo'} disabled={!codigo.trim()} onPress={verificarCodigo} />
              <Boton
                titulo="Volver"
                secundario
                disabled={ocupado}
                onPress={() => (setEnviado(false), setCodigo(''), setError(''))}
              />
            </>
          ) : (
            <>
              <ThemedText themeColor="textSecondary">Usa una cuenta que ya tienes. Sin contraseñas nuevas.</ThemedText>
              {PROVEEDORES.map(({ id, titulo }) => (
                <Boton key={id} titulo={titulo} cargando={cargando === id} disabled={ocupado} onPress={() => conProveedor(id)} />
              ))}

              <ThemedText type="small" themeColor="textSecondary" style={estilos.separador}>
                o con tu correo
              </ThemedText>
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
              <Boton
                titulo="Enviarme un código"
                secundario
                cargando={cargando === 'correo'}
                disabled={ocupado || !correo.includes('@')}
                onPress={pedirCodigo}
              />
            </>
          )}

          {error ? (
            <ThemedText accessibilityRole="alert" type="small">
              {error}
            </ThemedText>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1 },
  contenido: { flex: 1, justifyContent: 'center', gap: Spacing.three, padding: Spacing.four, maxWidth: 480, width: '100%', alignSelf: 'center' },
  campo: { minHeight: 48, borderRadius: 12, paddingHorizontal: Spacing.three, fontSize: 16 },
  separador: { textAlign: 'center', marginTop: Spacing.two },
});
