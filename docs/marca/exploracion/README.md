# Exploración de identidad visual

Tres direcciones de marca para la app, para que el equipo escoja una. **Es exploración, no decisión:** ninguna está aprobada, el producto no tiene nombre confirmado y los nombres de abajo son nombres de trabajo propuestos, uno por dirección. El contenido de las maquetas sale de `docs/ideas/05` y `docs/investigacion/08` con datos ficticios (Valentina, $3.600.000, prima de $900.000); son ejemplos para vestir la pantalla, no decisiones de producto.

Lo que las tres respetan (de `docs/investigacion/08` y `01`): tono de par, sin regaños; el número de la persona es lo más grande de la pantalla; pesos con formato $1.234.567; una idea por pantalla; el gesto principal abajo, al alcance del pulgar; un color de alarma reservado para lo que cuesta plata; descuentos de ley en color neutro, no en rojo.

## Comparación

| Dirección (nombre de trabajo) | Eje | A quién le habla mejor | Riesgo |
|---|---|---|---|
| **1. Cuadre** | Calma editorial, base morada. Ciruela `#4B2766` sobre papel cálido; cifras en serif de libro (Newsreader) | Valentina: recién empleada, sin deuda, quiere sentirse adulta y con criterio sin que parezca un banco | Puede leerse sobria de más para alguien de 19 años. El morado está cerca de Nu en Colombia: la distancia depende de no usar morado eléctrico ni degradados |
| **2. Platica** | Temperatura: cálida y con juego. Maíz `#F2BE22`, crema y tinta verde; Bricolage Grotesque 800; bordes y sombra dura | Andrés y la Valentina de primer mes (18 a 23 años), que llegan por curiosidad y se van si algo suena a banco | Puede sentirse infantil o poco confiable justo cuando la persona sube un documento sensible, y le puede caer mal a Santiago, que ya debe plata. Exige una regla para apagar el juego en deuda |
| **3. Renglón** | Densidad y precisión: instrumento. Cobalto `#2443D0`, grafito y hueso; cifras en JetBrains Mono, renglones numerados, fórmula a la vista | Quien quiere ver la cuenta completa: la Valentina analítica, estudiantes de ingeniería o administración | Puede sentirse fría o intimidante para Santiago y acercarse a una app de trading. La densidad choca con "una idea por pantalla" si no se cuida |

Cómo se diferencian de verdad, no solo en color:

| | Cuadre | Platica | Renglón |
|---|---|---|---|
| Tipografía de la cifra | Serif con tamaño óptico | Grotesca negra, ancha | Monoespaciada |
| Densidad | Mucho aire, navegación de texto | Media, bloques grandes | Alta, tablas y reglas finas |
| Forma | Radios suaves, sin bordes | Pastillas, borde de 2 px, sombra dura | Radios de 6 px, reglas de 1 px |
| Cómo explica una línea | Nota al margen en itálica | Burbuja, como un mensaje | Renglón numerado con la cuenta |
| Revelación de la prima | Frase explicativa | Frase cercana ("Normal: ...") | La fórmula: 3.600.000 × 90 ÷ 360 |
| Costo de llevarla a la app | Bajo | Medio (componentes propios) | Bajo en estilo, medio en tablas |

## Piezas

| Dirección | Brand book (Markdown) | Brand book (HTML navegable) | Maquetas (claro y oscuro) |
|---|---|---|---|
| 1. Cuadre | [cuadre/brandbook.md](cuadre/brandbook.md) | [cuadre/brandbook.html](cuadre/brandbook.html) | [cuadre/maquetas.html](cuadre/maquetas.html) |
| 2. Platica | [platica/brandbook.md](platica/brandbook.md) | [platica/brandbook.html](platica/brandbook.html) | [platica/maquetas.html](platica/maquetas.html) |
| 3. Renglón | [renglon/brandbook.md](renglon/brandbook.md) | [renglon/brandbook.html](renglon/brandbook.html) | [renglon/maquetas.html](renglon/maquetas.html) |

Cada brand book sigue la estructura del de Topdown: esencia, logo, color (con nombre, hex, uso y contraste WCAG medido), tipografía con roles, imagen, voz y tono con frases reales de la app, y mensajes clave. Se agrega una sección final con a quién le habla y el riesgo.

Cada archivo de maquetas trae cuatro pantallas a 390 px, primero en claro y luego en oscuro: entrada (Google, Apple, correo), inicio, un momento de lección (predecir y revelar la prima, se puede mover y revelar) y el desprendible explicado línea por línea (las líneas se abren).

## Cómo se generan

Las nueve piezas salen de [fuente/](fuente/): un archivo por dirección (`cuadre.mjs`, `platica.mjs`, `renglon.mjs`), el contenido compartido (`comun.mjs`) y el generador (`generar.mjs`). Para cambiar algo, se edita la fuente y se corre:

```bash
node docs/marca/exploracion/fuente/generar.mjs
```

El generador calcula el contraste WCAG 2.2 de cada par de color en los dos temas y falla si un texto queda bajo 4,5:1 o un elemento de interfaz bajo 3:1. Hoy los 60 pares pasan; el texto con menos contraste está en 5,0:1.

## Qué se verificó

- **Contraste:** medido por código, no a ojo (tablas en cada brand book).
- **Navegador:** las seis páginas abiertas con Chromium (Playwright) a 1720 px en claro y a 375 px en oscuro con `prefers-reduced-motion: reduce`. Consola sin errores ni recursos fallidos; sin scroll horizontal a 375 px.
- **Interacción:** en las seis lecciones, el deslizador se movió con el teclado, el botón se activó con Enter, apareció la cifra real con la diferencia correcta, el botón de revelar se ocultó y el foco pasó a la cifra. El foco visible es un anillo de 3 px en el color de foco de cada tema.
- **Lista anti "cara de IA"** (design-director), contada: 0 rayas largas; 0 etiquetas en mayúscula espaciada; 0 degradados decorativos (el único `gradient` es la regla de marcas del deslizador de Renglón); ninguna fuente por defecto (sin Inter ni del sistema como display); 0 negros puros; un solo acento por tema; cifras con `tabular-nums`; nombres y empresa locales y marcados como ficticios; los "¡" y palabras de relleno solo aparecen en las columnas de "No lo decimos"; ninguna persona ni objeto dibujado en SVG, con un espacio de foto rotulado como pendiente en Platica.
- **Áreas táctiles:** todo lo tocable mide 44 px o más, salvo un enlace dentro de una frase en Cuadre (excepción de WCAG 2.5.8 para enlaces en línea).

## Qué no se verificó

- No se probó en un celular ni en React Native: las fuentes variables (ancho de Bricolage e Instrument Sans) y el serif a 13 px pueden verse distinto en Android.
- Las maquetas cargan las fuentes desde Google Fonts y los logos de Google y Apple desde Simple Icons; sin internet caen a fuentes del sistema.
- Las marcas denominativas son texto dentro de SVG, no trazos. Si se elige una, se convierte a trazos y se exporta.
- Los nombres de trabajo no se revisaron en la SIC ni en tiendas de apps.
- Las explicaciones de salud y pensión son texto de ejemplo; si se usan en la app, salen de `packages/conocimiento` con fuente y vigencia.

## Lo que tiene que decidir el equipo

1. Cuál de las tres direcciones sigue, o qué mezcla (por ejemplo, la tipografía de una con el color de otra).
2. Si el morado es requisito: solo Cuadre lo usa como base.
3. Un nombre de producto, o si se trabaja un tiempo con el nombre de la dirección elegida.

Después de elegir sigue la fase de sistema: tokens en el repo, `DESIGN.md` y la primera pantalla real en `apps/mobile`.
