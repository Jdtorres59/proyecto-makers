import { Stack } from 'expo-router';

/** Conocerte: del desprendible al resumen. Se recorre hacia adelante; atrás solo donde tiene sentido. */
export default function Bienvenida() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="conocerte" />
      <Stack.Screen name="leyendo" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="confirmar" />
      <Stack.Screen name="preguntas" />
      <Stack.Screen name="listo" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
