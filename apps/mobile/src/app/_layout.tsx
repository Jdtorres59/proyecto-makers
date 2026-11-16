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
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Problema } from '@/components/problema';
import { Forma, useTema } from '@/constants/tema';
import { grabado } from '@/lib/assets';
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
          <Marco>
            <ConDatos />
          </Marco>
        </ProveedorSesion>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/** Los datos de Luca dependen de quién entró: cambiar de persona o de modo los monta de cero. */
function ConDatos() {
  const { sesion, consentido, deMuestra } = useSesion();
  const llave = deMuestra ? 'demo' : (sesion?.user.id ?? 'nadie');
  return (
    <ProveedorLuca key={llave} demo={deMuestra} activo={!!sesion && !!consentido}>
      <Pantallas />
    </ProveedorLuca>
  );
}

/**
 * En pantallas anchas (web en computador) la app se presenta como una columna de teléfono centrada
 * sobre el papel de la marca, no estirada.
 */
function Marco({ children }: { children: React.ReactNode }) {
  const tema = useTema();
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web' || width < 640) return <>{children}</>;
  return (
    <View style={[estilos.mesa, { backgroundColor: tema.superficie }]}>
      <Image source={grabado('forma-mancha', tema.oscuro)} style={[estilos.mancha, { left: -120, top: -80 }]} contentFit="contain" accessible={false} />
      <Image source={grabado('forma-sol', tema.oscuro)} style={[estilos.sol, { right: -60, bottom: -40 }]} contentFit="contain" accessible={false} />
      <View style={[estilos.columna, { backgroundColor: tema.fondo, borderColor: tema.linea }]}>{children}</View>
    </View>
  );
}

/** La app tiene cuatro estados; `destino` es la primera pantalla de cada uno. */
function Pantallas() {
  const tema = useTema();
  const { sesion, consentido, salir } = useSesion();
  const { bienvenidaLista, carga, recargar } = useLuca();
  const adentro = !!sesion && !!consentido;
  const cargando = sesion === undefined || (sesion && consentido === undefined) || (adentro && carga === 'cargando');

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
  if (adentro && typeof carga === 'object') {
    return (
      <View style={{ flex: 1, backgroundColor: tema.fondo, padding: 24, justifyContent: 'center' }}>
        <Problema problema={carga} alReintentar={recargar} alVolver={carga.tipo === 'sesion' ? salir : undefined} textoVolver="Entrar de nuevo" />
      </View>
    );
  }
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

const estilos = StyleSheet.create({
  mesa: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mancha: { position: 'absolute', width: 520, height: 360, opacity: 0.6 },
  sol: { position: 'absolute', width: 320, height: 320, opacity: 0.7 },
  columna: { width: 430, height: '100%', maxHeight: 932, borderWidth: Forma.contorno, borderRadius: 24, overflow: 'hidden' },
});
