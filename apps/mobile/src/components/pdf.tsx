import { StyleSheet, View } from 'react-native';

import { Fuente, useTema } from '@/constants/tema';

import { Texto } from './texto';

/** Ficha de archivo PDF en maíz. Decorativa: el nombre del archivo va en el control. */
export function Pdf() {
  const tema = useTema();
  return (
    <View style={[estilos.pdf, { backgroundColor: tema.maiz, borderColor: tema.linea }]} accessible={false}>
      <Texto tipo="pequeno" color={tema.sobreMaiz} maxFontSizeMultiplier={1} style={{ fontFamily: Fuente.titular }}>
        PDF
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  pdf: { width: 44, height: 52, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
