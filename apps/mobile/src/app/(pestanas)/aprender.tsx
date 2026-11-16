import { StyleSheet, View } from 'react-native';

import { Entrada } from '@/components/entrada';
import { Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio } from '@/constants/tema';

/** Segunda tanda. Por ahora dice la verdad: los módulos se están escribiendo. */
export default function Aprender() {
  return (
    <Pantalla conPestanas>
      <Entrada indice={0}>
        <Texto tipo="titulo">Aprender</Texto>
      </Entrada>
      <Entrada indice={1}>
        <Tarjeta style={estilos.tarjeta}>
          <Luca nombre="crecimiento/0-semilla" tamano={120} />
          <View style={{ gap: Espacio.s }}>
            <Texto tipo="titulo3" style={estilos.centro}>
              Aquí van a vivir doce módulos cortos sobre tu plata
            </Texto>
            <Texto suave style={estilos.centro}>
              Los estamos escribiendo. Cada módulo que termines le va a sumar una hoja a Luca, hasta volverlo árbol.
            </Texto>
          </View>
        </Tarjeta>
      </Entrada>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { alignItems: 'center', gap: Espacio.l, paddingVertical: Espacio.xl },
  centro: { textAlign: 'center' },
});
