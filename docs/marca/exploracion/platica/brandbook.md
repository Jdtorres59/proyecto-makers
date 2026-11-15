# Brand book · Platica (nombre de trabajo)

*Dirección 2 de tres. Exploración, no decisión: el nombre "Platica" es una propuesta de trabajo y nada de esto está aprobado por el equipo. Eje: **temperatura (cálida y con juego)**. Maquetas: [maquetas.html](maquetas.html). Versión navegable: [brandbook.html](brandbook.html).*

## 1. Esencia

| | |
|---|---|
| **Qué es** | Una app que te explica tu plata con tus documentos, como te la explicaría una amiga que sabe |
| **A quién** | Jóvenes de 18 a 26 años: desde la mesada hasta el primer sueldo |
| **Promesa** | Entender tu plata sin sentirte bruto por no saber |
| **Por qué el nombre** | "La platica" es como se dice en la casa, en el bus y en el trabajo. Es cariñoso y sin pretensión |
| **Personalidad** | Cálida, directa, de buen humor, paciente, muy de aquí |
| **Lo que no somos** | Juego de niños, banco, influenciador de trading, mamá que regaña |

**La idea en una frase.** Suena como hablamos de plata en Colombia: "la platica". Cálida, redonda, con un amarillo maíz que se siente de aquí y una tinta verde oscura en vez de negro.

## 2. Logo

- **Marca denominativa:** `platica` en Bricolage Grotesque 800, minúscula y apretada, con una moneda maíz al final con borde de tinta.
- **Símbolo:** la moneda con la "p". Ícono de app, avatar, sello en los planes guardados.
- **Área de respeto:** el diámetro de la moneda. **Tamaño mínimo:** 88 px de ancho; símbolo de 24 px.

| Versión | Texto | Detalle | Fondo |
|---|---|---|---|
| Positivo | Tinta `#1E291F` | Moneda maíz con borde tinta | Crema y claros |
| Negativo | Crema `#F7EEDB` | Moneda maíz con borde crema | Tierra y oscuros |
| Sobre maíz | Tinta | Moneda crema con borde tinta | Bloques maíz |

- **Usos incorrectos:** quitar el borde de la moneda, cambiar el maíz por dorado metálico, usar mayúsculas, inclinar el logo.
- **Archivos:** el SVG vive dentro de `brandbook.html`. Si se elige esta dirección, se convierte a trazos y se exporta en SVG y PNG.

## 3. Color

| Hex | Nombre | Uso |
|---|---|---|
| `#F2BE22` | Maíz | Acento: botón principal, bloque del número que importa, moneda del logo. Nunca como texto sobre crema |
| `#FBF4E6` | Crema | Fondo claro |
| `#F3E3C4` | Arepa | Superficies y tarjetas |
| `#1E291F` | Tinta monte | Texto y bordes en claro. Verde casi negro, para que el amarillo no se vuelva infantil |
| `#1B1812` | Tierra | Fondo oscuro, café muy oscuro |
| `#6B4C00` | Miel | El maíz cuando tiene que ser texto en claro (enlaces, cifras de apoyo) |
| `#B02A1C` | Ají | Alarma, solo para lo que cuesta plata. En oscuro: `#FF8B7B` |

- El maíz es superficie, no texto, en el tema claro. Como texto se usa miel.
- Bordes de 2 px en tinta y sombra dura de 3 px hacia abajo: es la marca, pero solo en lo que se toca (botones y la tarjeta principal).
- El ají no aparece en celebraciones ni decoración. Con temas de deuda, la calidez se baja: sin moneda, sin bromas.

**Contraste medido** (WCAG 2.2; texto exige 4,5:1, elementos de interfaz 3:1):

| Tema | Par | Frente | Fondo | Contraste | Mínimo | Resultado |
|---|---|---|---|---|---|---|
| claro | Texto sobre fondo | `#1E291F` | `#FBF4E6` | 13,78:1 | 4,50:1 | Pasa |
| claro | Texto suave sobre fondo | `#5A5242` | `#FBF4E6` | 7,05:1 | 4,50:1 | Pasa |
| claro | Texto sobre superficie | `#1E291F` | `#F3E3C4` | 11,92:1 | 4,50:1 | Pasa |
| claro | Texto suave sobre superficie | `#5A5242` | `#F3E3C4` | 6,10:1 | 4,50:1 | Pasa |
| claro | Texto del botón sobre acento | `#1E291F` | `#F2BE22` | 8,74:1 | 4,50:1 | Pasa |
| claro | Acento como texto sobre fondo | `#6B4C00` | `#FBF4E6` | 7,22:1 | 4,50:1 | Pasa |
| claro | Alarma sobre fondo | `#B02A1C` | `#FBF4E6` | 6,01:1 | 4,50:1 | Pasa |
| claro | Alarma sobre superficie | `#B02A1C` | `#F3E3C4` | 5,20:1 | 4,50:1 | Pasa |
| claro | Anillo de foco sobre fondo | `#1E291F` | `#FBF4E6` | 13,78:1 | 3,00:1 | Pasa |
| claro | Borde de control sobre fondo | `#8A7C62` | `#FBF4E6` | 3,73:1 | 3,00:1 | Pasa |
| oscuro | Texto sobre fondo | `#F7EEDB` | `#1B1812` | 15,35:1 | 4,50:1 | Pasa |
| oscuro | Texto suave sobre fondo | `#BFB399` | `#1B1812` | 8,54:1 | 4,50:1 | Pasa |
| oscuro | Texto sobre superficie | `#F7EEDB` | `#2B261C` | 13,04:1 | 4,50:1 | Pasa |
| oscuro | Texto suave sobre superficie | `#BFB399` | `#2B261C` | 7,25:1 | 4,50:1 | Pasa |
| oscuro | Texto del botón sobre acento | `#1B1812` | `#F2BE22` | 10,26:1 | 4,50:1 | Pasa |
| oscuro | Acento como texto sobre fondo | `#F2BE22` | `#1B1812` | 10,26:1 | 4,50:1 | Pasa |
| oscuro | Alarma sobre fondo | `#FF8B7B` | `#1B1812` | 7,78:1 | 4,50:1 | Pasa |
| oscuro | Alarma sobre superficie | `#FF8B7B` | `#2B261C` | 6,61:1 | 4,50:1 | Pasa |
| oscuro | Anillo de foco sobre fondo | `#F2BE22` | `#1B1812` | 10,26:1 | 3,00:1 | Pasa |
| oscuro | Borde de control sobre fondo | `#82765E` | `#1B1812` | 3,96:1 | 3,00:1 | Pasa |

## 4. Tipografía

| Rol | Familia | Pesos | Carácter |
|---|---|---|---|
| Cifras y titulares | [Bricolage Grotesque 800, tamaño óptico grande](https://fonts.google.com/specimen/Bricolage+Grotesque) | 700, 800 | Grotesca con carácter: terminaciones con tinta, un poco irregular, cálida. A tamaño grande tiene personalidad sin ser caricatura. |
| Texto e interfaz | [Bricolage Grotesque, tamaño óptico pequeño](https://fonts.google.com/specimen/Bricolage+Grotesque) | 400, 500, 600 | La misma familia a tamaño óptico de texto se vuelve sobria y legible. Una sola fuente para todo: menos peso de descarga. |
| Etiquetas y pastillas | [Bricolage Grotesque condensada](https://fonts.google.com/specimen/Bricolage+Grotesque) | 600, ancho 80 | Para fechas en pastilla y estados. Solo en tamaño pequeño. |

- Una sola familia variable, gratuita (SIL Open Font), en Google Fonts.
- Cifras con `tabular-nums` y formato $1.234.567.
- En deuda y cobros se usa el peso 600, no el 800: menos grito.

## 5. Imagen

- **Fotografía:** real y colombiana, con color: buses, tiendas de barrio, la cocina de la casa, el celular en la mano. Gente de 18 a 27 años que se parezca a quien usa la app. Sin fotos de banco.
- **Ilustración:** no se usa. El juego lo ponen la moneda, el color y el movimiento, no muñecos.
- **Iconografía:** Phosphor Bold, redondeada, en tinta. Solo donde aclara.
- **Movimiento:** con resorte suave: la moneda que cae en el reparto, la tarjeta que se levanta al tocarla. Nunca en pantallas de deuda.

## 6. Voz y tono

Hablamos de **tú**, como hablan los parceros que saben de plata: directo, con palabras de aquí y buen humor. El humor se apaga cuando el tema es deuda o un cobro.

| Sí lo decimos | No lo decimos |
|---|---|
| Te cae la prima en 35 días | Recuerda tu pago de prima de servicios |
| Esto es lo que te descuentan y por qué | Conceptos de nómina |
| Tú decides; yo te muestro qué pasa con cada opción | Lo correcto es ahorrar |
| Casi. Pasa mucho | ¡Ups! Respuesta incorrecta |
| Esta tarjeta te cobra $86.400 al mes de intereses | Estás pagando una fortuna, ¡cuidado! |

**Frases reales de la app:**

| Dónde | Frase |
|---|---|
| Entrada | Tu plata, en tu idioma. |
| Inicio | Quiubo, Valentina. En 35 días te cae la prima. |
| Lección | ¿Cuánto crees que te cae de prima? |
| Revelación | Te quedaste $400.000 por debajo. Normal: llevas 90 días, no el semestre entero. |
| Desprendible | Esto va para tu EPS. Es lo que te da derecho a citas y urgencias. |
| Error de lectura | La foto salió borrosa en la fecha. ¿Me la escribes tú? |

**Palabras que evitamos:** billete, camello en exceso, ¡ups!, crack, hack, haz que tu dinero trabaje, libertad financiera.

## 7. Mensajes clave

- **Taglines (propuesta):** *Tu platica, clarita.* · *Entiende tu plata sin pena.*
- **Propuesta de valor:** Te explica tu desprendible, tu prima y tu tarjeta con tus números, en el idioma en que hablas de plata.
- **Mensajes de apoyo:**
  - Con tus números, no con ejemplos gringos.
  - Sin vender tarjetas ni créditos.
  - Te escribe cuando hay plata de por medio, no todos los días.
  - Preguntar no da pena aquí.
- **Llamado a la acción principal:** Muéstrame mi desprendible.
- **Promesas que no hacemos:** que vas a ahorrar X % sin esfuerzo, rentabilidades, "salir de deudas en 30 días".

## 8. A quién le habla mejor y riesgo

- **Le habla mejor a:** Andrés y la Valentina de primer mes: 18 a 23 años, que se acercan por curiosidad y se van si algo suena a banco.
- **Riesgo:** El juego puede leerse infantil o poco confiable cuando la persona sube un documento con datos sensibles, y le puede caer mal a alguien como Santiago que ya debe plata. Exige una regla clara para bajar la calidez en deuda.
- **Costo de llevarla a la app:** Medio. Una sola fuente, pero los bordes, sombras duras y movimientos con resorte piden componentes propios en React Native.
