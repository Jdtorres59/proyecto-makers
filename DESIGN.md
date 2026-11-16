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

`luca` con la moneda de la tajada en la `c`, en SVG con los contornos de Bricolage Grotesque Bold. El nombre va siempre sobre fondo liso, nunca sobre ilustración o textura.

| Archivo | Fondo | Letras y moneda | Tajada |
|---|---|---|---|
| `marca/wordmark-claro.svg` | `fondo` o `papel` claro | `#2A2219` (13,6:1) | `#A8740A` (3,5:1 sobre fondo, 3,9:1 sobre papel) |
| `marca/wordmark-oscuro.svg` | `fondo` o `papel` oscuro | `#F6EEDC` (15,3:1) | `#F2BE22` (10,2:1 sobre fondo, 9,1:1 sobre papel) |
| `marca/wordmark-maiz.svg` | `maiz` `#D99A2B` | `#1F1A14` (7,1:1) | `#1F1A14`, separada por el corte |

La tajada es símbolo, no texto: su mínimo es 3:1.

## Assets

Viven en `apps/mobile/assets/` y la app los usa por estos nombres. Las ilustraciones son WebP con fondo transparente, salvo portadas e ícono. Las piezas de tinta tienen variante `-oscuro` para el modo oscuro.

**Marca**
- `marca/wordmark-claro.svg`, `marca/wordmark-oscuro.svg`, `marca/wordmark-maiz.svg`
- `marca/splash-claro.png`, `marca/splash-oscuro.png`: wordmark de 600 px para la pantalla de arranque, sobre `fondo` (`#F6EEDC` claro, `#1D1812` oscuro)
- `images/icon.png`, `images/android-icon-foreground.png`, `images/android-icon-background.png`, `images/android-icon-monochrome.png`, `images/favicon.png`: ícono de app (pendiente de Codex; hoy siguen los de Expo)

**Luca** (`luca/`): `luca-saluda`, `luca-explica`, `luca-celebra` (listas), `luca-piensa`, `luca-lee`, `luca-atento`, `luca-sorprendido`, `luca-muestra`, `luca-pulgar`, `luca-guarda`, `luca-espera`, `luca-despide`

**Crecimiento** (`crecimiento/`): `0-semilla`, `1-brote`, `2-plantula`, `3-arbolito`, `4-arbol`. Etapa según módulos terminados: 0, 1 a 3, 4 a 7, 8 a 11, 12.

**Portadas** (`portadas/`, 3:2): `01-desprendible`, `02-prima-cesantias`, `03-plan-del-mes`, `04-colchon`, `05-costo-deuda`, `06-tarjeta`, `07-historial`, `08-si-no-puedo-pagar`, `09-fraudes`, `10-invertir-simple`, `11-primera-inversion`, `12-cripto`

**Medallas** (`medallas/`): los mismos doce nombres que las portadas. Mientras no existan, o si el módulo no está ganado, se usa `grabado/medalla-bloqueada.svg`.

**Objetos** (`objetos/`): `desprendible` (listo), `extracto`, `sobre-prima`, `tarjeta`, `calendario`, `tarro`, `lupa`

**Escenas** (`escenas/`): `subir-documento`, `leyendo`, `vacio`, `sin-conexion`

**Sistema de grabado** (`grabado/`, SVG salvo el grano)
- `grano.png`, `grano-oscuro.png`: textura de 256 px que se repite sobre la pantalla
- `forma-panel`, `forma-sol`, `forma-mancha`: fondos de borde irregular detrás de ilustraciones
- `marco-portada`: borde de tinta 3:2 para enmarcar una portada
- `marco-medalla`, `medalla-bloqueada`: sello de estampilla
- `confeti`, `confeti-hoja`, `confeti-grano`, `confeti-tira`, `confeti-punto`: composición y piezas sueltas para animar la celebración
- `halo.svg`: halo maíz detrás de un personaje pequeño sobre oscuro

**Íconos de interfaz** (`iconos/`, SVG 24 px de trazo 2,25 en tinta; se recolorean con `tintColor`): `inicio`, `aprender`, `documentos`, `yo`, `subir`, `camara`, `lupa`, `calendario`, `atras`, `cerrar`, `check`, `mas`, `info`, `candado`, `campana`, `editar`, `eliminar`, `enviar`, `flecha`, `chispa`

Los prompts de cada ilustración están en `docs/marca/direccion-1.0/fuente/prompts.md` y se generan con `biblioteca.py`. Las piezas vectoriales salen de `vectores.py`.
