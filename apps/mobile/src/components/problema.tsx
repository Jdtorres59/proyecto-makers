import { StyleSheet, View } from 'react-native';

import { Espacio } from '@/constants/tema';
import type { ProblemaLuca } from '@/lib/datos/errores';

import { Boton } from './boton';
import { Ilustracion, Luca } from './luca';
import { Texto } from './texto';

const TITULOS: Record<ProblemaLuca['tipo'], string> = {
  'sin-conexion': 'Estás sin conexión',
  tope: 'Por hoy es suficiente',
  sesion: 'Hay que volver a entrar',
  archivo: 'No pude usar ese archivo',
  servidor: 'Algo me falló',
};

/**
 * Un problema con su escena: sin conexión usa la escena del cable desconectado; los demás, Luca atento
 * (nunca alarmado). El texto es el de la API o el nuestro, siempre en lenguaje llano.
 */
export function Problema({ problema, alReintentar, alVolver, textoVolver = 'Volver' }: { problema: ProblemaLuca; alReintentar?: () => void; alVolver?: () => void; textoVolver?: string }) {
  const sinRed = problema.tipo === 'sin-conexion';
  return (
    <View style={estilos.caja} accessibilityLiveRegion="polite">
      {sinRed ? <Ilustracion nombre="escenas/sin-conexion" ancho={200} /> : <Luca pose={problema.tipo === 'tope' ? 'espera' : 'atento'} tamano={140} />}
      <View style={{ gap: Espacio.s }}>
        <Texto tipo="titulo2" style={estilos.centro}>
          {TITULOS[problema.tipo]}
        </Texto>
        <Texto suave style={estilos.centro} accessibilityRole="alert">
          {problema.mensaje}
        </Texto>
      </View>
      <View style={estilos.botones}>
        {alReintentar && problema.tipo !== 'tope' ? <Boton titulo="Intentar de nuevo" onPress={alReintentar} /> : null}
        {alVolver ? <Boton titulo={textoVolver} variante={alReintentar && problema.tipo !== 'tope' ? 'texto' : 'principal'} onPress={alVolver} /> : null}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Espacio.xl, paddingVertical: Espacio.xxl },
  centro: { textAlign: 'center' },
  botones: { alignSelf: 'stretch', gap: Espacio.xs },
});
