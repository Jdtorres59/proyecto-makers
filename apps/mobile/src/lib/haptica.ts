import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// En web no hay motor háptico: se ignora sin avisar.
const conHaptica = (fn: () => Promise<void>) => () => {
  if (Platform.OS !== 'web') fn().catch(() => {});
};

/** Háptica solo en acciones clave: avanzar, elegir, celebrar. Nada en scroll ni en cada tecla. */
export const haptica = {
  toque: conHaptica(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  firme: conHaptica(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  eleccion: conHaptica(() => Haptics.selectionAsync()),
  logro: conHaptica(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
