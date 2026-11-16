import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/bricolage-grotesque';
import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
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

/** La app tiene cuatro estados; `destino` es la primera pantalla de cada uno. */
function Pantallas() {
  const { sesion, consentido } = useSesion();
  const { bienvenidaLista, perfil } = useLuca();
  const cargando = sesion === undefined || (sesion && consentido === undefined) || !perfil;

  const destino = !sesion ? '/login' : !consentido ? '/consentimiento' : !bienvenidaLista ? '/conocerte' : '/';

  // Cada estado (sin sesión, sin autorización, conociéndote, adentro) tiene su primera pantalla. Al cambiar
  // de estado se vacía la pila y se reemplaza: no se puede volver atrás a un estado anterior.
  // shortcut: Stack.Protected de Expo Router 58 no lleva bien a un grupo sin índice ni a pantallas sueltas
  // (ROUTE_NAMES_CHANGED sin manejar); probar de nuevo con guardas al subir de versión.
  useEffect(() => {
    if (cargando) return;
    const id = requestAnimationFrame(() => {
      if (router.canDismiss()) router.dismissAll();
      router.replace(destino);
      // La pantalla de arranque se va cuando ya está la pantalla correcta, sin destello del inicio.
      setTimeout(() => SplashScreen.hideAsync(), 60);
    });
    return () => cancelAnimationFrame(id);
  }, [cargando, destino]);

  if (cargando) return null;
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="consentimiento" options={{ animation: 'fade' }} />
      <Stack.Screen name="(bienvenida)/conocerte" options={{ animation: 'fade' }} />
      <Stack.Screen name="(bienvenida)/leyendo" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="(bienvenida)/confirmar" />
      <Stack.Screen name="(bienvenida)/preguntas" />
      <Stack.Screen name="(bienvenida)/listo" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="(pestanas)" options={{ animation: 'fade' }} />
      <Stack.Screen name="modulo/[id]" />
      <Stack.Screen name="leccion/[modulo]/[leccion]" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
      <Stack.Screen name="prima" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
      <Stack.Screen name="documento/[id]" />
      <Stack.Screen name="decision/index" />
      <Stack.Screen name="decision/leyendo" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="decision/caminos" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
