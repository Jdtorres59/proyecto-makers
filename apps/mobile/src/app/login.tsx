import type { Provider } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { Boton } from '@/components/boton';
import { Campo } from '@/components/campo';
import { Entrada } from '@/components/entrada';
import { Hoja } from '@/components/hoja';
import { Luca } from '@/components/luca';
import { moneda } from '@/components/moneda';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Wordmark } from '@/components/wordmark';
import { Espacio, Forma, useTema } from '@/constants/tema';
import { useSesion } from '@/lib/sesion';
import { supabase } from '@/lib/supabase';

// Para sumar otro proveedor: actívalo en Supabase (Authentication > Sign In / Providers) y agrégalo aquí.
const PROVEEDORES: { id: Provider; titulo: string; variante: 'principal' | 'secundario' }[] = [
  { id: 'google', titulo: 'Seguir con Google', variante: 'principal' },
  { id: 'apple', titulo: 'Seguir con Apple', variante: 'secundario' },
];

// A dónde vuelve la persona después de autenticarse con Google o Apple. Debe estar en la lista
// de Redirect URLs del proyecto de Supabase (makers://** y la de Expo Go en desarrollo).
const REGRESO = Linking.createURL('/');

/** Tres formas de entrar: Google, Apple o un código que llega al correo. Ninguna usa contraseña. */
export default function Login() {
  const { entrarDeMuestra } = useSesion();
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [hojaCorreo, setHojaCorreo] = useState(false);
  const [cargando, setCargando] = useState<Provider | 'correo' | null>(null);
  const [error, setError] = useState('');

  /** Corre un paso de ingreso mostrando carga y error. Devuelve true si salió bien. */
  async function intentar(quien: Provider | 'correo', paso: () => Promise<void>) {
    setCargando(quien);
    setError('');
    try {
      await paso();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.');
      return false;
    } finally {
      setCargando(null);
    }
  }

  const conProveedor = (provider: Provider) =>
    intentar(provider, async () => {
      // En web el navegador se va a la página del proveedor y vuelve con la sesión.
      // En el celular se abre un navegador seguro del sistema y la app canjea el código que regresa.
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: REGRESO, skipBrowserRedirect: Platform.OS !== 'web' },
      });
      if (error) throw error;
      if (Platform.OS === 'web') return;

      const resultado = await WebBrowser.openAuthSessionAsync(data.url, REGRESO);
      if (resultado.type !== 'success') return; // la persona cerró el navegador
      const codigoDeAcceso = new URL(resultado.url).searchParams.get('code');
      if (!codigoDeAcceso) throw new Error('El proveedor no devolvió un código de acceso.');
      const canje = await supabase.auth.exchangeCodeForSession(codigoDeAcceso);
      if (canje.error) throw canje.error;
    });

  const pedirCodigo = async () => {
    const salioBien = await intentar('correo', async () => {
      const { error } = await supabase.auth.signInWithOtp({ email: correo.trim() });
      if (error) throw error;
    });
    if (salioBien) setEnviado(true);
  };

  // Al verificar, la sesión cambia y el layout muestra la siguiente pantalla.
  const verificarCodigo = () =>
    intentar('correo', async () => {
      const { error } = await supabase.auth.verifyOtp({ email: correo.trim(), token: codigo.trim(), type: 'email' });
      if (error) throw error;
    });

  const ocupado = cargando !== null;
  const mensajeError = error ? (
    <Texto tipo="pequeno" accessibilityRole="alert" style={estilos.error}>
      {error}
    </Texto>
  ) : null;

  return (
    <Pantalla>
      <Entrada indice={0}>
        <Heroe />
      </Entrada>

      <Entrada indice={1} style={estilos.marca}>
        {/* En desarrollo, mantener presionado el nombre entra con los datos de muestra (sin cuenta). */}
        <Pressable onLongPress={entrarDeMuestra} disabled={!entrarDeMuestra} accessible={false}>
          <Wordmark tamano={56} />
        </Pressable>
      </Entrada>

      <Entrada indice={2} style={estilos.textos}>
        <Texto tipo="titulo">Tu plata, explicada con tus números.</Texto>
        <Texto suave>Luca lee tu desprendible, sabe qué viene en tu plata y te ayuda a entender qué hacer con ella.</Texto>
      </Entrada>

      <Entrada indice={3} style={estilos.acciones}>
        {PROVEEDORES.map(({ id, titulo, variante }) => (
          <Boton key={id} titulo={titulo} variante={variante} cargando={cargando === id} disabled={ocupado} onPress={() => conProveedor(id)} />
        ))}
        <Boton titulo="Seguir con correo" variante="texto" disabled={ocupado} onPress={() => (setError(''), setHojaCorreo(true))} />
        {!hojaCorreo ? mensajeError : null}
      </Entrada>

      <Hoja visible={hojaCorreo} alCerrar={() => setHojaCorreo(false)} titulo="Seguir con correo">
        {enviado ? (
          <>
            <Texto suave>Escribe el código que llegó a {correo.trim()}.</Texto>
            <Campo
              etiqueta="Código de verificación"
              autoFocus
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              placeholder="123456"
              value={codigo}
              onChangeText={setCodigo}
              onSubmitEditing={verificarCodigo}
              esCifra
            />
            {mensajeError}
            <Boton titulo="Entrar" cargando={cargando === 'correo'} disabled={!codigo.trim()} onPress={verificarCodigo} />
            <Boton titulo="Usar otro correo" variante="texto" disabled={ocupado} onPress={() => (setEnviado(false), setCodigo(''), setError(''))} />
          </>
        ) : (
          <>
            <Texto suave>Te mandamos un código para entrar, sin contraseña.</Texto>
            <Campo
              etiqueta="Tu correo"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={correo}
              onChangeText={setCorreo}
              onSubmitEditing={pedirCodigo}
            />
            {mensajeError}
            <Boton titulo="Mandarme el código" cargando={cargando === 'correo'} disabled={ocupado || !correo.includes('@')} onPress={pedirCodigo} />
          </>
        )}
      </Hoja>
    </Pantalla>
  );
}

/** Panel maíz con Luca saludando y monedas estampadas en las esquinas. El nombre va afuera, sobre fondo liso. */
function Heroe() {
  const tema = useTema();
  const { height } = useWindowDimensions();
  const alto = Math.max(190, Math.min(300, height * 0.3));
  const M = moneda({ r: 40, abertura: 70, separacion: 8 });
  const monedas = [
    { x: '6%', y: 14, s: 34, r: 0 },
    { x: '78%', y: 22, s: 26, r: 50 },
    { x: '84%', y: alto - 64, s: 40, r: -30 },
    { x: '10%', y: alto - 54, s: 22, r: 90 },
  ] as const;
  return (
    <View style={{ paddingBottom: Forma.sombra }}>
      <View style={[estilos.sombra, { backgroundColor: tema.linea }]} />
      <View style={[estilos.heroe, { height: alto, backgroundColor: tema.maiz, borderColor: tema.linea }]}>
        {monedas.map((m, i) => (
          <Svg key={i} width={m.s} height={m.s} viewBox="0 0 100 100" style={{ position: 'absolute', left: m.x, top: m.y, transform: [{ rotate: `${m.r}deg` }] }}>
            <Path d={M.cuerpo} fill="#FFFBF0" />
            <G transform={`translate(${M.dx} ${M.dy})`}>
              <Path d={M.tajada} fill="#2A2219" />
            </G>
          </Svg>
        ))}
        <Luca pose="saluda" tamano={alto * 0.86} gesto="saluda" />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  heroe: { borderWidth: Forma.contorno, borderRadius: Forma.radio, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  sombra: { position: 'absolute', left: 0, right: 0, top: Forma.sombra, bottom: 0, borderRadius: Forma.radio },
  marca: { alignItems: 'flex-start', marginTop: -Espacio.s },
  textos: { gap: Espacio.s, marginTop: -Espacio.m },
  acciones: { gap: Espacio.s },
  error: { textAlign: 'center' },
});
