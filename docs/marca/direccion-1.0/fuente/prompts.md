# Prompts de imagen (Codex, generación de imágenes)

Ronda 2. Cada propuesta parte de la pose Saluda; las demás piezas se generaron con esa imagen como referencia (`--image`). El fondo blanco se quita con `recortar.py`. Las portadas de esta ronda son provisionales (pose sobre composición): Codex llegó a su límite antes de generarlas.

Archivos: a = rana de cristal, b = semilla, c = una luca.

## Propuesta A

Personaje original llamado Luca, mascota de una app colombiana que te explica tu plata: una ranita de cristal pequeña y redonda, sentada erguida como un personaje, con la piel verde lima translúcida a través de la cual se ven por dentro formas simples y alegres (un pequeño corazón color maíz y una moneda redonda), ojos grandes color maíz dorado con pupila negra, dedos con puntas redondas, expresión lista y simpática. Estilo de ilustración: risografía con tintas translúcidas que se superponen y crean colores nuevos donde se cruzan (verde lima #8DC26F, maíz #F2B33D, ají #E0643A, tinta #1F1A14), sin contorno negro, leve desregistro de color, textura de grano de impresión, formas simples y geométricas.

## Propuesta B

Personaje original llamado Luca, mascota de una app colombiana que te explica tu plata: una criatura inventada que es una semilla con vida. Cuerpo en forma de semilla o frijol grande color maíz tostado #D99A2B, con una grieta arriba de la que sale un brote de dos hojas verdes #4F7D50 a modo de copete, brazos y piernas delgados color tinta café #2A2219, ojos pequeños y brillantes, sonrisa tranquila. Estilo de ilustración: grabado en relieve tipo linóleo o xilografía, estampado a tres tintas planas y sólidas (café tinta #2A2219, maíz tostado y verde), con marcas de gubia talladas en blanco dentro de las formas, contornos gruesos de tinta sólida con bordes de corte nítido, pequeñas imperfecciones de estampado y textura de papel, nada de crayón ni lápiz.

## Propuesta C

Personaje original llamado Luca, mascota de una app colombiana que te explica tu plata (en Colombia una luca son mil pesos): una criatura inventada hecha de papel doblado como origami, formada a partir de un billete genérico color maíz con una franja verde, sin números ni textos ni retratos, cuerpo facetado de pliegues geométricos, ojos redondos de papel negro pegados como recortes con un brillo blanco, brazos y piernas de tiras de papel doblado. Estilo de ilustración: collage de papel recortado y doblado fotografiado plano, sombras suaves y cortas entre capas de papel, textura de fibra de papel, colores maíz #F2B33D, verde #4F7D50, crema #FFF6E5 y tinta #1F1A14.

## Fondo de poses y objetos

Fondo blanco puro #FFFFFF liso y uniforme, sin sombra en el piso, sin elementos de fondo, personaje de cuerpo entero centrado ocupando el 75% del cuadro, formato cuadrado.

La ronda 1 (colibrí, grano de maíz, oso de anteojos) está en el historial de git, commit 10ffd4c.

## Biblioteca del paso 2 (lista cerrada)

49 piezas. Ruta final relativa a `apps/mobile/assets/`. Referencia: `saluda` = pose base, `objeto` = desprendible, `medallas/01-desprendible` = primera medalla. El estilo común (`ESTILO`, `TRAZO`, `FONDO`, `ESCENA`) se define en `biblioteca.py`; aquí va lo que cambia en cada pieza.

### Ícono de app

| Archivo | Ref. | Prompt (parte propia) |
|---|---|---|
| `images/icon.png (y android-icon-*.png, favicon.png, icono/icono.png)` | saluda | Ícono de app cuadrado: la cara y la parte de arriba de Luca, la semilla con su brote de dos hojas, grande y centrada, mirando de frente con una sonrisa tranquila, sobre un fondo plano color maíz tostado #D99A2B que llena todo el cuadro hasta los bordes, sin marco ni esquinas redondeadas, formato cuadrado. |

### Portadas de módulo (3:2, opacas)

| Archivo | Ref. | Prompt (parte propia) |
|---|---|---|
| `portadas/01-desprendible.webp` | saluda | Luca revisa con una lupa grande un desprendible de nómina de papel tan alto como él, con renglones abstractos. |
| `portadas/02-prima-cesantias.webp` | saluda | Luca sentado junto a un sobre crema grande y abierto del que asoman billetes estilizados, y un cofre pequeño al lado. |
| `portadas/03-plan-del-mes.webp` | saluda | Luca reparte monedas en tres tarros de vidrio marcados con dibujos simples de una casa, un plato y un bus. |
| `portadas/04-colchon.webp` | saluda | Luca descansa tranquilo sentado sobre un cojín grueso hecho de billetes apilados, bajo un paraguas abierto. |
| `portadas/05-costo-deuda.webp` | saluda | Luca observa una balanza: en un plato una moneda pequeña y en el otro un saco grande y pesado. |
| `portadas/06-tarjeta.webp` | saluda | Luca sostiene una tarjeta de crédito genérica grande, sin logos ni números, junto a una hoja de calendario. |
| `portadas/07-historial.webp` | saluda | Luca sube por una escalera de bloques mientras anota en una libreta, cada bloque con una marca de visto. |
| `portadas/08-si-no-puedo-pagar.webp` | saluda | Luca, sereno, ordena una pila de sobres de cuentas en filas sobre una mesa, con una lista a su lado. |
| `portadas/09-fraudes.webp` | saluda | Luca levanta un escudo frente a un anzuelo de pesca que cuelga de un hilo con una tarjeta enganchada. |
| `portadas/10-invertir-simple.webp` | saluda | Luca riega con una regadera una maceta de la que crece una planta con monedas redondas como hojas. |
| `portadas/11-primera-inversion.webp` | saluda | Luca, con una pala pequeña, planta una moneda en un surco de tierra. |
| `portadas/12-cripto.webp` | saluda | Luca mira con curiosidad y algo de cautela una moneda facetada que flota, con una montaña rusa estampada al fondo. |

### Medallas

| Archivo | Ref. | Prompt (parte propia) |
|---|---|---|
| `medallas/01-desprendible.webp` | objeto | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con una lupa sobre una hoja con renglones estampado en tinta café y verde, sin texto. |
| `medallas/02-prima-cesantias.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con un sobre abierto con una hoja que brota estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/03-plan-del-mes.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con tres tarros pequeños estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/04-colchon.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con un paraguas sobre una pila de monedas estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/05-costo-deuda.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con una balanza estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/06-tarjeta.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con una tarjeta con un visto estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/07-historial.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con una libreta con un visto estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/08-si-no-puedo-pagar.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con un nudo que se desata estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/09-fraudes.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con un escudo estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/10-invertir-simple.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con una maceta con monedas como hojas estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/11-primera-inversion.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con una moneda plantada que brota estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |
| `medallas/12-cripto.webp` | medallas/01-desprendible | Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, centro crema con una moneda vista de lado e inclinada, con el canto estriado, un rombo geométrico tallado en su cara y dos chispas a un lado; que no parezca un balón estampado en tinta café y verde, sin texto. Mismo formato de medalla que la referencia; solo cambia el dibujo del centro. |

### Poses de Luca

| Archivo | Ref. | Prompt (parte propia) |
|---|---|---|
| `luca/luca-piensa.webp` | saluda | Pose: piensa con una mano en el mentón, mirando hacia arriba. |
| `luca/luca-lee.webp` | saluda | Pose: lee con atención una hoja de papel que sostiene con las dos manos. |
| `luca/luca-atento.webp` | saluda | Pose: escucha serio pero cálido, con las manos juntas, para acompañar una mala noticia. |
| `luca/luca-sorprendido.webp` | saluda | Pose: se sorprende con los ojos muy abiertos y las manos a los lados. |
| `luca/luca-muestra.webp` | saluda | Pose: muestra algo que está arriba de él con las dos manos abiertas, como presentándolo. |
| `luca/luca-pulgar.webp` | saluda | Pose: levanta un pulgar, satisfecho. |
| `luca/luca-guarda.webp` | saluda | Pose: guarda una moneda en un tarro de vidrio pequeño. |
| `luca/luca-espera.webp` | saluda | Pose: espera sentado tranquilo, con las piernas cruzadas. |
| `luca/luca-despide.webp` | saluda | Pose: se despide agitando la mano, de lado, a punto de irse. |

### Etapas de crecimiento

| Archivo | Ref. | Prompt (parte propia) |
|---|---|---|
| `crecimiento/0-semilla.webp` | saluda | Luca de pie de frente, contento; todavía es solo la semilla, sin brote, con la grieta cerrada. El cuerpo de semilla y la cara no cambian. |
| `crecimiento/1-brote.webp` | saluda | Luca de pie de frente, contento; tiene su brote de dos hojas, igual que la referencia. El cuerpo de semilla y la cara no cambian. |
| `crecimiento/2-plantula.webp` | saluda | Luca de pie de frente, contento; el brote creció a un tallo corto con cuatro hojas. El cuerpo de semilla y la cara no cambian. |
| `crecimiento/3-arbolito.webp` | saluda | Luca de pie de frente, contento; del brote salió un arbolito pequeño con tronco delgado y una copa redonda de hojas. El cuerpo de semilla y la cara no cambian. |
| `crecimiento/4-arbol.webp` | saluda | Luca de pie de frente, contento; del brote creció un árbol con copa grande y algunos frutos dorados como mazorcas pequeñas. El cuerpo de semilla y la cara no cambian. |

### Objetos

| Archivo | Ref. | Prompt (parte propia) |
|---|---|---|
| `objetos/extracto.webp` | objeto | Objeto solo, sin personaje: un extracto de tarjeta: hoja con una tabla de renglones abstractos y una tarjeta genérica encima, sin texto ni números. |
| `objetos/sobre-prima.webp` | objeto | Objeto solo, sin personaje: un sobre crema abierto con billetes estilizados asomando, sin texto ni números. |
| `objetos/tarjeta.webp` | objeto | Objeto solo, sin personaje: una tarjeta de crédito genérica sin logos ni números, ligeramente inclinada, sin texto ni números. |
| `objetos/calendario.webp` | objeto | Objeto solo, sin personaje: una hoja de calendario de pared con un día marcado con un círculo, sin texto ni números. |
| `objetos/tarro.webp` | objeto | Objeto solo, sin personaje: un tarro de vidrio con algunas monedas adentro, sin texto ni números. |
| `objetos/lupa.webp` | objeto | Objeto solo, sin personaje: una lupa de mango de madera, sin texto ni números. |

### Escenas de estado

| Archivo | Ref. | Prompt (parte propia) |
|---|---|---|
| `escenas/subir-documento.webp` | saluda | Luca empuja una hoja de papel grande hacia una bandeja, con esfuerzo alegre. |
| `escenas/leyendo.webp` | saluda | Luca escanea una hoja con una lupa, concentrado. |
| `escenas/vacio.webp` | saluda | Luca riega una maceta de la que todavía no sale nada, paciente. |
| `escenas/sin-conexion.webp` | saluda | Luca sostiene un cable desconectado con cara de duda. |
