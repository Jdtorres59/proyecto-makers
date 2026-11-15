import type { Provider } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/components/boton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

// Para sumar otro proveedor: actívalo en Supabase (Authentication > Sign In / Providers) y agrégalo aquí.
const PROVEEDORES: { id: Provider; titulo: string }[] = [
  { id: 'google', titulo: 'Continuar con Google' },
  { id: 'apple', titulo: 'Continuar con Apple' },
];

// A dónde vuelve la persona después de autenticarse. Debe estar en la lista de
// Redirect URLs del proyecto de Supabase (makers://** y la de Expo Go en desarrollo).
const REGRESO = Linking.createURL('/');

export default function Login() {
  const [cargando, setCargando] = useState<Provider | null>(null);
  const [error, setError] = useState('');

  async function entrar(provider: Provider) {
    setCargando(provider);
    setError('');
    try {
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
      const codigo = new URL(resultado.url).searchParams.get('code');
      if (!codigo) throw new Error('El proveedor no devolvió un código de acceso.');
      const canje = await supabase.auth.exchangeCodeForSession(codigo);
      if (canje.error) throw canje.error;
      // Con la sesión lista, el layout muestra la siguiente pantalla.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.');
    } finally {
      setCargando(null);
    }
  }

  return (
    <ThemedView style={estilos.fondo}>
      <SafeAreaView style={estilos.fondo}>
        <View style={estilos.contenido}>
          <ThemedText type="subtitle">Entra a Makers</ThemedText>
          <ThemedText themeColor="textSecondary">Usa una cuenta que ya tienes. Sin contraseñas nuevas.</ThemedText>
          {PROVEEDORES.map(({ id, titulo }, i) => (
            <Boton
              key={id}
              titulo={titulo}
              secundario={i > 0}
              cargando={cargando === id}
              disabled={cargando !== null}
              onPress={() => entrar(id)}
            />
          ))}
          {error ? (
            <ThemedText accessibilityRole="alert" type="small">
              {error}
            </ThemedText>
          ) : null}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1 },
  contenido: { flex: 1, justifyContent: 'center', gap: Spacing.three, padding: Spacing.four, maxWidth: 480, width: '100%', alignSelf: 'center' },
});
