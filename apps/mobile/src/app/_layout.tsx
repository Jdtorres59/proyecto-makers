import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import '@/global.css';
import { ProveedorSesion, useSesion } from '@/lib/sesion';

export default function Layout() {
  const esquema = useColorScheme();
  return (
    <ThemeProvider value={esquema === 'dark' ? DarkTheme : DefaultTheme}>
      <ProveedorSesion>
        <Pantallas />
      </ProveedorSesion>
    </ThemeProvider>
  );
}

/** Cada pantalla solo existe en el estado que le corresponde: sin sesión, sin autorización, o adentro. */
function Pantallas() {
  const { sesion, consentido } = useSesion();
  if (sesion === undefined || (sesion && consentido === undefined)) return null;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!sesion}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={!!sesion && !consentido}>
        <Stack.Screen name="consentimiento" />
      </Stack.Protected>
      <Stack.Protected guard={!!sesion && !!consentido}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
