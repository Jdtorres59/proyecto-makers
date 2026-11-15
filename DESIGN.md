# DESIGN.md · Luca 1.0

Dirección elegida por Juan David el 15 de noviembre de 2026: **Semilla · Grabado**. Referencia visual: `docs/marca/direccion-1.0/index.html` (propuesta B). Este archivo manda sobre el prototipo cálido en todo lo visual; el prototipo sigue mandando en flujos.

## Idea

Luca es una semilla que brota. La plata que entiendes se siembra y crece despacio, como el interés compuesto. Cada módulo terminado le suma una hoja; el núcleo completo lo vuelve árbol. El progreso de la persona se ve en Luca, no en una racha.

## Personaje

- Semilla en forma de frijol, maíz tostado `#D99A2B`, con una grieta arriba de la que sale un brote de dos hojas verdes. Brazos y piernas delgados en tinta café. Ojos pequeños y brillantes, sonrisa tranquila, sin rubor.
- Explica y acompaña; nunca regaña ni presiona. Cuando la noticia es mala (mora, deuda cara) se ve atento, no triste ni alarmado.
- Poses base: `saluda`, `explica`, `celebra`. Las demás se generan con `saluda` como referencia para que el diseño no cambie.
- Crecimiento: semilla (0 módulos), brote (1 a 3), plántula (4 a 7), arbolito (8 a 11), árbol (12). Las etapas son parte de la biblioteca del paso 2.

## Estilo de ilustración

Grabado en relieve tipo linóleo, estampado a tres tintas planas (tinta café, maíz tostado, verde) sobre papel, con marcas de gubia talladas en blanco y bordes de corte nítido. Nada de crayón, degradados ni brillo 3D. Objetos y escenas usan el mismo trazo. El prompt completo está en `docs/marca/direccion-1.0/fuente/prompts.md` (propuesta B).

Assets con fondo transparente, en WebP, recortados con `docs/marca/direccion-1.0/fuente/recortar.py`. Sobre fondo oscuro, un personaje pequeño lleva un halo maíz suave detrás (radial, 38 % de opacidad) porque la tinta café se pierde.

## Color

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `fondo` | `#F6EEDC` | `#1D1812` | Fondo de pantalla |
| `papel` | `#FFFBF0` | `#2A2219` | Tarjetas, opciones, burbujas |
| `superficie` | `#EEDFC0` | `#33291E` | Bloques secundarios |
| `texto` | `#2A2219` | `#F6EEDC` | Texto principal, contornos |
| `textoSuave` | `#5E4E3A` | `#C8B99C` | Texto secundario |
| `linea` | `#2A2219` | `#F6EEDC` | Contorno de 2,5 px de tarjetas y botones |
| `lineaSuave` | `#D9C8A6` | `#45392A` | Divisores |
| `maiz` | `#D99A2B` | `#D99A2B` | Acción principal, cifra protagonista (texto encima siempre `#2A2219`) |
| `verde` | `#3F6E40` | `#8CC08C` | Selección correcta, ingresos, botón secundario |
| `sobreVerde` | `#F6EEDC` | `#1D1812` | Texto sobre `verde` |
| `salvia` | `#9DBB8F` | `#9DBB8F` | Fondos ilustrados, nunca bajo texto |

Contrastes medidos (WCAG): texto sobre fondo 13,6:1 claro y 15,3:1 oscuro; texto suave sobre papel 7,7:1 y 8,1:1; tinta sobre maíz 6,4:1; `sobreVerde` sobre verde 5,2:1 claro y 8,4:1 oscuro. Todo texto nuevo cumple 4,5:1 en los dos modos.

## Tipografía

Bricolage Grotesque. Titulares 800, tracking −0,04 em, eje óptico 96. Cifras de plata 800 con números tabulares. Cuerpo 400 a 16 px, interlineado 1,4. Sin etiquetas en mayúsculas.

## Forma

Se ve impreso a mano: contornos de tinta de 2,5 px, radios cortos (8 a 10 px), bloques planos. Los botones principales llevan una sombra sólida de 3 px hacia abajo en el color del contorno, y al presionarlos bajan 3 px. Los paneles ilustrados pueden tener el borde levemente irregular. Textura de grano sobre la pantalla al 14 %.

## Wordmark

`luca` con la moneda de la tajada en la `c`. El nombre va siempre sobre fondo liso.

| Fondo | Letras y moneda | Tajada |
|---|---|---|
| Claro | `#2A2219` | `#A8740A` (3,5:1) |
| Oscuro | `#F6EEDC` | `#F2BE22` (10:1) |
| Maíz | `#1F1A14` | `#1F1A14`, separada por el corte |

## Assets

Viven en `apps/mobile/assets/` y se usan por nombre:

- `luca/luca-saluda.webp`, `luca/luca-explica.webp`, `luca/luca-celebra.webp`
- `objetos/desprendible.webp`

El paso 2 suma poses, etapas de crecimiento, portadas de los 12 módulos, medallas, escenas, íconos e ícono de app con estos mismos nombres en español y en minúscula.
