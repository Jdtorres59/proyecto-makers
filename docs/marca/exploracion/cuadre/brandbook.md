# Brand book · Cuadre (nombre de trabajo)

*Dirección 1 de tres. Exploración, no decisión: el nombre "Cuadre" es una propuesta de trabajo y nada de esto está aprobado por el equipo. Eje: **calma editorial (base morada)**. Maquetas: [maquetas.html](maquetas.html). Versión navegable: [brandbook.html](brandbook.html).*

## 1. Esencia

| | |
|---|---|
| **Qué es** | Una app que te explica tu plata con tus propios documentos y te ayuda a decidir antes de que lleguen las fechas |
| **A quién** | Jóvenes de 21 a 26 años en sus primeros 18 meses de empleo formal en Colombia |
| **Promesa** | Entender tu plata con tus números y decidir con calma, sin que nadie te venda nada |
| **Por qué el nombre** | "Cuadrar" es lo que uno hace con las cuentas para que den. El cuadre es el momento en que todo tiene sentido |
| **Personalidad** | Serena, clara, cuidadosa, con criterio, cercana sin confianzudería |
| **Lo que no somos** | Banco, fintech de neón, gurú de inversiones, profesor que regaña |

**La idea en una frase.** Tu plata se lee como una buena página: con aire, con jerarquía y con tus cifras en tipografía de libro. Morado ciruela de tinta, no de tarjeta.

## 2. Logo

- **Marca denominativa:** `cuadre` en minúscula, Newsreader 500, tracking cerrado, seguida de un signo igual en ciruela. El igual es el cuadre: dos lados que dan lo mismo.
- **Símbolo:** el signo igual dentro de un cuadrado redondeado ciruela. Para el ícono de la app y el avatar.
- **Área de respeto:** la altura de la "c" alrededor. **Tamaño mínimo:** 96 px de ancho; símbolo de 24 px.

| Versión | Texto | Detalle | Fondo |
|---|---|---|---|
| Positivo | Tinta `#221A2A` | Igual en ciruela `#4B2766` | Papel y claros |
| Negativo | Bruma `#F2ECF3` | Igual en lavanda `#CDB4EA` | Noche y oscuros |
| Símbolo | n/a | Igual en papel sobre ciruela | Ícono de app, avatar |

- **Usos incorrectos:** separar el igual del nombre, ponerlo en otro color que no sea el acento, escribir en mayúsculas, usar degradados.
- **Archivos:** el SVG vive dentro de `brandbook.html`. Si se elige esta dirección, se convierte a trazos y se exporta en SVG y PNG.

## 3. Color

| Hex | Nombre | Uso |
|---|---|---|
| `#4B2766` | Ciruela | Acento de marca: botón principal, enlaces, el igual del logo. En claro es el único color fuerte |
| `#F6F2EF` | Papel | Fondo claro. Cálido, para que el morado no se vuelva frío |
| `#ECE4EA` | Lila papel | Superficies: tarjetas, línea abierta del desprendible |
| `#221A2A` | Tinta | Texto sobre claro. Un negro teñido de ciruela, no un negro puro |
| `#1A1320` | Noche | Fondo oscuro |
| `#CDB4EA` | Lavanda | Acento en oscuro: botón principal y enlaces |
| `#A23820` | Arcilla | Alarma, solo para lo que cuesta plata: intereses, mora, cobros que no deberían estar. En oscuro: `#F29A84` |

- Un solo acento por tema: ciruela en claro, lavanda en oscuro. Nada de degradados morado a azul.
- Los descuentos de ley (salud, pensión) van en tinta, no en arcilla: no son un costo malo, son tu aporte.
- La arcilla nunca decora. Si aparece, es porque algo te está costando plata.

**Contraste medido** (WCAG 2.2; texto exige 4,5:1, elementos de interfaz 3:1):

| Tema | Par | Frente | Fondo | Contraste | Mínimo | Resultado |
|---|---|---|---|---|---|---|
| claro | Texto sobre fondo | `#221A2A` | `#F6F2EF` | 15,10:1 | 4,50:1 | Pasa |
| claro | Texto suave sobre fondo | `#62586A` | `#F6F2EF` | 6,04:1 | 4,50:1 | Pasa |
| claro | Texto sobre superficie | `#221A2A` | `#ECE4EA` | 13,49:1 | 4,50:1 | Pasa |
| claro | Texto suave sobre superficie | `#62586A` | `#ECE4EA` | 5,40:1 | 4,50:1 | Pasa |
| claro | Texto del botón sobre acento | `#F6F2EF` | `#4B2766` | 10,59:1 | 4,50:1 | Pasa |
| claro | Acento como texto sobre fondo | `#4B2766` | `#F6F2EF` | 10,59:1 | 4,50:1 | Pasa |
| claro | Alarma sobre fondo | `#A23820` | `#F6F2EF` | 6,04:1 | 4,50:1 | Pasa |
| claro | Alarma sobre superficie | `#A23820` | `#ECE4EA` | 5,40:1 | 4,50:1 | Pasa |
| claro | Anillo de foco sobre fondo | `#4B2766` | `#F6F2EF` | 10,59:1 | 3,00:1 | Pasa |
| claro | Borde de control sobre fondo | `#877B8E` | `#F6F2EF` | 3,59:1 | 3,00:1 | Pasa |
| oscuro | Texto sobre fondo | `#F2ECF3` | `#1A1320` | 15,60:1 | 4,50:1 | Pasa |
| oscuro | Texto suave sobre fondo | `#B5A8BD` | `#1A1320` | 8,03:1 | 4,50:1 | Pasa |
| oscuro | Texto sobre superficie | `#F2ECF3` | `#271D2F` | 13,87:1 | 4,50:1 | Pasa |
| oscuro | Texto suave sobre superficie | `#B5A8BD` | `#271D2F` | 7,14:1 | 4,50:1 | Pasa |
| oscuro | Texto del botón sobre acento | `#1A1320` | `#CDB4EA` | 9,77:1 | 4,50:1 | Pasa |
| oscuro | Acento como texto sobre fondo | `#CDB4EA` | `#1A1320` | 9,77:1 | 4,50:1 | Pasa |
| oscuro | Alarma sobre fondo | `#F29A84` | `#1A1320` | 8,40:1 | 4,50:1 | Pasa |
| oscuro | Alarma sobre superficie | `#F29A84` | `#271D2F` | 7,47:1 | 4,50:1 | Pasa |
| oscuro | Anillo de foco sobre fondo | `#CDB4EA` | `#1A1320` | 9,77:1 | 3,00:1 | Pasa |
| oscuro | Borde de control sobre fondo | `#85778F` | `#1A1320` | 4,35:1 | 3,00:1 | Pasa |

## 4. Tipografía

| Rol | Familia | Pesos | Carácter |
|---|---|---|---|
| Cifras y titulares | [Newsreader](https://fonts.google.com/specimen/Newsreader) | 400, 500, itálica 400 | Serif de periódico con tamaño óptico: a 72 px se vuelve fina y elegante, a 16 px aguanta. Tus cifras se leen como algo importante, no como un dato de app. |
| Texto e interfaz | [Onest](https://fonts.google.com/specimen/Onest) | 400, 500, 600 | Grotesca humanista y tranquila, con buena legibilidad en pantallas pequeñas. Botones, etiquetas y párrafos. |
| Notas al margen | [Newsreader itálica](https://fonts.google.com/specimen/Newsreader) | 400 | La explicación de cada línea, como una nota escrita al lado del documento. |

- Las dos son gratuitas (licencia SIL Open Font) y están en Google Fonts, así que se cargan con `expo-font` sin costo.
- Cifras siempre con `tabular-nums` y formato $1.234.567.
- Titulares grandes con tracking de -0,02 em a -0,03 em; cuerpo a 0.

## 5. Imagen

- **Fotografía:** real, cálida y de cerca: manos con un desprendible, una mesa de comedor con el celular, luz de tarde. Nunca fotos de banco con gente sonriendo a una gráfica.
- **Ilustración:** no se usa. El protagonista es el número de la persona.
- **Iconografía:** casi ninguna. La navegación es de texto. Si hace falta un ícono, lineal de 1,5 px (Phosphor Light).
- **Movimiento:** lento y corto: la cifra que aparece, la línea que se abre. Nada que rebote.

## 6. Voz y tono

Hablamos de **tú**, como una amiga que ya pasó por lo mismo y sabe explicarlo sin afán. Frases cortas, sin tecnicismos y sin signos de admiración. Con deuda, cuidado: cercano no es chistoso.

| Sí lo decimos | No lo decimos |
|---|---|
| Te explico qué es cada descuento | Te enseñamos educación financiera |
| Esto es lo que te llega y cuándo | ¡Felicidades! Ganaste una medalla |
| Tú decides cómo repartirla | Lo ideal es que ahorres el 20 % |
| Pasa mucho, sigamos | Te equivocaste |
| Este cobro te está costando $86.400 al mes | Estás botando la plata |

**Frases reales de la app:**

| Dónde | Frase |
|---|---|
| Entrada | Tu plata, explicada con tus números. |
| Inicio | En 35 días te llega la prima. Todavía no decides qué hacer con ella. |
| Lección | ¿Cuánto crees que te llega de prima en diciembre? |
| Revelación | Te quedaste $400.000 por debajo. Pasa mucho: llevas 90 días, no el semestre completo. |
| Desprendible | Va a tu EPS y es lo que te da derecho a citas, exámenes y urgencias. |
| Error de lectura | No pude leer la fecha de ingreso. ¿Me la escribes? |

**Palabras que evitamos:** invierte ya, libertad financiera, hack, regaño, deberías, error, ¡ups!

## 7. Mensajes clave

- **Taglines (propuesta):** *Que tus cuentas cuadren.* · *Tu plata, con calma.*
- **Propuesta de valor:** Entiendes cada línea de tu plata con tus propios documentos y decides antes de que llegue la fecha.
- **Mensajes de apoyo:**
  - Tus números, no ejemplos de otro país.
  - Te explica; no te vende productos ni entidades.
  - Cinco minutos cuando llega la plata, no todos los días.
  - Lo que subes es tuyo y lo puedes borrar.
- **Llamado a la acción principal:** Sube tu desprendible.
- **Promesas que no hacemos:** que te vas a volver rico, rentabilidades, "el mejor" producto de algún banco.

## 8. A quién le habla mejor y riesgo

- **Le habla mejor a:** Valentina (recién empleada, sin deuda, decisiones por tomar). Se siente adulta y seria sin parecer un banco.
- **Riesgo:** Puede leerse sobria de más para alguien de 19 años, y el serif en cifras exige cuidar el tamaño mínimo en Android. El morado está cerca de Nu en Colombia; la diferencia depende de no usar morado eléctrico ni degradados.
- **Costo de llevarla a la app:** Bajo. Dos fuentes de Google, paleta corta, casi sin íconos ni ilustración.
