import { StyleSheet, View } from 'react-native';

import { Espacio, Forma, useTema } from '@/constants/tema';

import { Luca } from './luca';
import { Texto } from './texto';

/** Aviso de algo que salió mal: Luca atento, nunca alarmado (DESIGN.md), y el texto como alerta. */
export function Aviso({ texto }: { texto: string }) {
  const tema = useTema();
  return (
    <View style={[estilos.aviso, { backgroundColor: tema.superficie, borderColor: tema.linea }]}>
      <Luca pose="atento" tamano={48} gesto="quieto" />
      <Texto tipo="pequeno" accessibilityRole="alert" style={{ flex: 1 }}>
        {texto}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m },
});
