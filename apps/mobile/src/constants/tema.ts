import { useColorScheme } from 'react-native';

/** Tokens de DESIGN.md (Semilla · Grabado). Una sola fuente de verdad para color, tipo, forma y movimiento. */

export const Colores = {
  claro: {
    fondo: '#F6EEDC',
    papel: '#FFFBF0',
    superficie: '#EEDFC0',
    texto: '#2A2219',
    textoSuave: '#5E4E3A',
    linea: '#2A2219',
    lineaSuave: '#D9C8A6',
    maiz: '#D99A2B',
    sobreMaiz: '#2A2219',
    verde: '#3F6E40',
    sobreVerde: '#F6EEDC',
    salvia: '#9DBB8F',
    /** Tajada del wordmark sobre fondo claro (3,5:1, elemento gráfico grande). */
    tajada: '#A8740A',
    /** Velo detrás de la hoja inferior. */
    velo: 'rgba(42, 34, 25, 0.42)',
  },
  oscuro: {
    fondo: '#1D1812',
    papel: '#2A2219',
    superficie: '#33291E',
    texto: '#F6EEDC',
    textoSuave: '#C8B99C',
    linea: '#F6EEDC',
    lineaSuave: '#45392A',
    maiz: '#D99A2B',
    sobreMaiz: '#2A2219',
    verde: '#8CC08C',
    sobreVerde: '#1D1812',
    salvia: '#9DBB8F',
    tajada: '#F2BE22',
    velo: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

export type Paleta = { [K in keyof typeof Colores.claro]: string };

export function useTema(): Paleta & { oscuro: boolean } {
  const oscuro = useColorScheme() === 'dark';
  return { ...(oscuro ? Colores.oscuro : Colores.claro), oscuro };
}

/** Bricolage Grotesque, cargada en _layout con expo-font. Un nombre por peso: RN no sintetiza pesos de fuentes propias. */
export const Fuente = {
  regular: 'BricolageGrotesque_400Regular',
  media: 'BricolageGrotesque_500Medium',
  semi: 'BricolageGrotesque_600SemiBold',
  negrita: 'BricolageGrotesque_700Bold',
  titular: 'BricolageGrotesque_800ExtraBold',
} as const;

/** Escala tipográfica. Titulares con tracking −0,04 em; cuerpo 16 con interlineado 1,4. */
export const Tipo = {
  gigante: { fontFamily: Fuente.titular, fontSize: 44, lineHeight: 48, letterSpacing: -44 * 0.04 },
  titulo: { fontFamily: Fuente.titular, fontSize: 32, lineHeight: 36, letterSpacing: -32 * 0.04 },
  titulo2: { fontFamily: Fuente.titular, fontSize: 24, lineHeight: 28, letterSpacing: -24 * 0.04 },
  titulo3: { fontFamily: Fuente.negrita, fontSize: 18, lineHeight: 23, letterSpacing: -18 * 0.02 },
  cuerpo: { fontFamily: Fuente.regular, fontSize: 16, lineHeight: 22.4 },
  cuerpoFuerte: { fontFamily: Fuente.semi, fontSize: 16, lineHeight: 22.4 },
  pequeno: { fontFamily: Fuente.media, fontSize: 14, lineHeight: 19 },
  boton: { fontFamily: Fuente.negrita, fontSize: 17, lineHeight: 22 },
} as const;

/** Cifras de plata: 800 con números tabulares para que no bailen al rodar. */
export const cifra = { fontFamily: Fuente.titular, fontVariant: ['tabular-nums' as const] };

export const Espacio = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

/** Se ve impreso a mano: contorno de 2,5, radios cortos, sombra sólida de 3 hacia abajo. */
export const Forma = {
  contorno: 2.5,
  radio: 10,
  radioChico: 8,
  sombra: 3,
  /** Objetivo táctil mínimo. */
  tactil: 48,
} as const;

/** Movimiento. Resortes con poco rebote: Luca es tranquilo. */
export const Movimiento = {
  resorte: { damping: 18, stiffness: 220, mass: 1 },
  resorteSuave: { damping: 20, stiffness: 140, mass: 1 },
  resorteVivo: { damping: 12, stiffness: 260, mass: 0.9 },
  /** Entre un elemento y el siguiente en una entrada escalonada. */
  escalon: 60,
  /** Entre palabra y palabra cuando Luca habla. */
  palabra: 38,
  rapido: 160,
  medio: 260,
} as const;
