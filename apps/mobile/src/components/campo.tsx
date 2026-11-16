import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { Espacio, Forma, Tipo, useTema } from '@/constants/tema';

import { Texto } from './texto';

type Props = TextInputProps & { etiqueta: string; esCifra?: boolean };

/** Campo de texto con etiqueta visible. Al enfocarlo gana la sombra sólida de tinta (foco visible sin depender del color). */
export function Campo({ etiqueta, esCifra, style, onFocus, onBlur, ...resto }: Props) {
  const tema = useTema();
  const [enfocado, setEnfocado] = useState(false);
  return (
    <View style={estilos.envoltura}>
      <Texto tipo="pequeno" suave>
        {etiqueta}
      </Texto>
      <View style={{ paddingBottom: Forma.sombra }}>
        {enfocado ? <View style={[estilos.sombra, { backgroundColor: tema.linea }]} /> : null}
        <TextInput
          accessibilityLabel={etiqueta}
          placeholderTextColor={tema.textoSuave}
          selectionColor={tema.maiz}
          maxFontSizeMultiplier={2}
          onFocus={(e) => (setEnfocado(true), onFocus?.(e))}
          onBlur={(e) => (setEnfocado(false), onBlur?.(e))}
          style={[
            Tipo.cuerpoFuerte,
            esCifra && { fontVariant: ['tabular-nums'] },
            estilos.campo,
            { color: tema.texto, backgroundColor: tema.papel, borderColor: enfocado ? tema.maiz : tema.linea, borderWidth: Forma.contorno },
            style,
          ]}
          {...resto}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  envoltura: { gap: Espacio.xs + 2 },
  campo: { minHeight: 52, borderRadius: Forma.radioChico, paddingHorizontal: Espacio.l, paddingVertical: Espacio.m },
  sombra: { position: 'absolute', left: 0, right: 0, top: Forma.sombra, bottom: 0, borderRadius: Forma.radioChico },
});
