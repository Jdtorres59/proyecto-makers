import { Tabs } from 'expo-router/js-tabs';

import { BarraPestanas } from '@/components/barra-pestanas';

export default function Pestanas() {
  return (
    <Tabs tabBar={(props) => <BarraPestanas {...props} />} screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="aprender" options={{ title: 'Aprender' }} />
      <Tabs.Screen name="documentos" options={{ title: 'Documentos' }} />
      <Tabs.Screen name="yo" options={{ title: 'Sobre mí' }} />
    </Tabs>
  );
}
