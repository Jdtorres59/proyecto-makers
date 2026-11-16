import type { Provider } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { Campo } from '@/components/campo';
import { Entrada } from '@/components/entrada';
import { Hoja } from '@/components/hoja';
import { Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { LogoApple, LogoGoogle } from '@/components/marcas';
import { Wordmark } from '@/components/wordmark';
import { Espacio, useTema } from '@/constants/tema';
import { grabado } from '@/lib/assets';
import { useSesion } from '@/lib/sesion';
import { supabase } from '@/lib/supabase';

// Para sumar otro proveedor: actívalo en Supabase (Authentication > Sign In / Providers) y agrégalo aquí.
const PROVEEDORES: { id: Provider; titulo: string; variante: 'google' | 'apple' }[] = [
  { id: 'google', titulo: 'Seguir con Google', variante: 'google' },
  { id: 'apple', titulo: 'Seguir con Apple', variante: 'apple' },
];

// A dónde vuelve la persona después de autenticarse con Google o Apple. Debe estar en la lista
// de Redirect URLs del proyecto de Supabase (makers://** y la de Expo Go en desarrollo).
const REGRESO = Linking.createURL('/');

/** Tres formas de entrar: Google, Apple o un código que llega al correo. Ninguna usa contraseña. */
export default function Login() {
  const { oscuro } = useTema();
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
  const mensajeError = error ? <Aviso texto={error} /> : null;

  return (
    <Pantalla>
      <Entrada indice={0}>
        <Heroe />
      </Entrada>

      <Entrada indice={1} style={estilos.marca}>
        <Wordmark alto={64} />
      </Entrada>

      <Entrada indice={2} style={estilos.textos}>
        <Texto tipo="titulo">Tu plata, explicada con tus números.</Texto>
        <Texto suave>Luca lee tu desprendible, sabe qué viene en tu plata y te ayuda a entender qué hacer con ella.</Texto>
      </Entrada>

      {/* Empuja las acciones al pie en pantallas altas: la composición llena la pantalla sin hueco abajo. */}
      <View style={{ flexGrow: 1 }} />

      <Entrada indice={3} style={estilos.acciones}>
        {PROVEEDORES.map(({ id, titulo, variante }) => (
          <Boton
            key={id}
            titulo={titulo}
            variante={variante}
            icono={variante === 'google' ? <LogoGoogle /> : <LogoApple color={oscuro ? '#000000' : '#FFFFFF'} />}
            cargando={cargando === id}
            disabled={ocupado}
            onPress={() => conProveedor(id)}
          />
        ))}
        <Boton titulo="Seguir con correo" variante="texto" disabled={ocupado} onPress={() => (setError(''), setHojaCorreo(true))} />
        {!hojaCorreo ? mensajeError : null}
        {entrarDeMuestra ? (
          <Boton titulo="Probar sin cuenta" variante="texto" disabled={ocupado} onPress={entrarDeMuestra} />
        ) : null}
        <Texto tipo="pequeno" suave style={estilos.legal}>
          Al seguir aceptas los términos y la política de datos.
        </Texto>
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

/** Panel ilustrado de borde irregular con el sol de grabado y Luca saludando. El nombre va afuera, sobre fondo liso. */
function Heroe() {
  const { oscuro } = useTema();
  const { height, width } = useWindowDimensions();
  // Cabe todo en un iPhone de 874 pt sin scroll; en pantallas más altas el espacio va antes de los botones.
  const alto = Math.max(180, Math.min(320, height * 0.31));
  const ancho = Math.min(width, 560) - Espacio.xl * 2;
  return (
    <View style={{ height: alto }}>
      <Image source={grabado('forma-panel', oscuro)} style={[StyleSheet.absoluteFill, { top: alto * 0.18 }]} contentFit="fill" alt="" />
      <Image source={grabado('forma-sol', oscuro)} style={{ position: 'absolute', left: ancho * 0.06, top: 0, width: alto * 0.42, height: alto * 0.42 }} alt="" />
      <View style={{ position: 'absolute', right: ancho * 0.08, bottom: 0 }}>
        <Luca pose="saluda" tamano={alto * 0.95} gesto="saluda" />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  marca: { alignItems: 'flex-start' },
  textos: { gap: Espacio.s },
  acciones: { gap: Espacio.s },
  legal: { textAlign: 'center' },
});
