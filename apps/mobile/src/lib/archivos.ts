import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import type { Archivo } from './datos/fuente';

/** Deduce el tipo por la extensión cuando el sistema no lo dice (pasa en algunos navegadores). */
function mimeDe(nombre: string, mime?: string | null) {
  if (mime) return mime;
  const ext = nombre.split('.').pop()?.toLowerCase();
  return ext === 'pdf' ? 'application/pdf' : ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
}

/** Abre el selector de archivos (PDF o imagen). null si la persona cancela. */
export async function elegirArchivo(): Promise<Archivo | null> {
  const r = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'], copyToCacheDirectory: true, multiple: false });
  if (r.canceled || !r.assets[0]) return null;
  const a = r.assets[0];
  return { uri: a.uri, nombre: a.name, mime: mimeDe(a.name, a.mimeType) };
}

/** Abre la cámara (en web, el selector de fotos con cámara del navegador). null si cancela o niega el permiso. */
export async function tomarFoto(): Promise<Archivo | null> {
  const permiso = await ImagePicker.requestCameraPermissionsAsync();
  if (!permiso.granted) return null;
  const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
  if (r.canceled || !r.assets[0]) return null;
  const a = r.assets[0];
  const nombre = a.fileName ?? 'foto.jpg';
  return { uri: a.uri, nombre, mime: mimeDe(nombre, a.mimeType) };
}
