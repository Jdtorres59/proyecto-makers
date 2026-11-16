import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/bricolage-grotesque';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTema } from '@/constants/tema';
import { ProveedorLuca, useLuca } from '@/lib/datos/contexto';
import { ProveedorSesion, useSesion } from '@/lib/sesion';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const tema = useTema();
  const [fuentesListas, errorFuentes] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });
  const base = tema.oscuro ? DarkTheme : DefaultTheme;
  // Los colores de navegación siguen el papel de Luca: sin destellos blancos entre pantallas.
  const navegacion = { ...base, colors: { ...base.colors, background: tema.fondo, card: tema.papel, text: tema.texto, border: tema.linea, primary: tema.maiz } };

  if (!fuentesListas && !errorFuentes) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: tema.fondo }}>
      <ThemeProvider value={navegacion}>
        <StatusBar style={tema.oscuro ? 'light' : 'dark'} />
        <ProveedorSesion>
          <ProveedorLuca>
            <Pantallas />
          </ProveedorLuca>
        </ProveedorSesion>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/** Cada grupo de pantallas solo existe en el estado que le corresponde: sin sesión, sin autorización, conociéndote, o adentro. */
function Pantallas() {
  const { sesion, consentido } = useSesion();
  const { bienvenidaLista, perfil } = useLuca();
  const cargando = sesion === undefined || (sesion && consentido === undefined) || !perfil;

  useEffect(() => {
    if (!cargando) SplashScreen.hideAsync();
  }, [cargando]);

  if (cargando) return null;
  const adentro = !!sesion && !!consentido;
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Protected guard={!sesion}>
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={!!sesion && !consentido}>
        <Stack.Screen name="consentimiento" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={adentro && !bienvenidaLista}>
        <Stack.Screen name="(bienvenida)" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={adentro && bienvenidaLista}>
        <Stack.Screen name="(pestanas)" options={{ animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}
