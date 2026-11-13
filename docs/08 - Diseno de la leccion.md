# 08 - Diseño de la lección

Cómo lograr una lección dinámica, visual, interactiva y personalizada, apoyada en lo que se sabe de aprendizaje y en lo que hacen los mejores productos. La anatomía y el catálogo de interacciones son propuesta mía; la evidencia está citada.

## 1. Qué dice la evidencia sobre cada adjetivo

### Interactiva

- **Hacer le gana a escuchar.** Un metaestudio de 225 estudios en cursos universitarios de ciencias encontró que el aprendizaje activo sube las notas 0,47 desviaciones estándar y baja la reprobación de 33,8 % a 21,8 % frente a la clase magistral ([Freeman y otros, 2014](https://pmc.ncbi.nlm.nih.gov/articles/4060654)). Leí resúmenes. Es evidencia de universidad, no de apps.
- **Cómo lo hace Brilliant,** la app de matemáticas y ciencias: sin videos; cada lección abre con dos a cuatro frases y una ilustración, y sigue con una secuencia de problemas donde la persona mueve algo, estima o escoge antes de que le expliquen ([Brilliant](https://brilliant.org/resources/choosing-brilliant/how-brilliant-teaches-math/)). Son sus propias páginas, no un estudio independiente.
- **Pero interactivo no es mejor por sí solo.** En el experimento de Lusardi (documento 07), la herramienta visual interactiva subió la confianza y no el conocimiento; el relato en video sí lo subió. La interacción tiene que obligar a pensar, no a tocar.

### Personalizada

- **Hablar de tú a tú.** El "principio de personalización" de Richard Mayer: el mismo contenido en estilo conversacional se aprende mejor que en estilo formal. En sus experimentos el efecto es grande; un metaestudio independiente lo encuentra mediano. Funciona mejor con principiantes y si no se exagera, y puede invertirse con temas emocionalmente desagradables ([capítulo de Mayer](https://www.cambridge.org/core/books/multimedia-learning/personalization-voice-and-image-principles/97F9B31362E6491806A4718FECCADE3D), [estudio de 2024](https://madoc.bib.uni-mannheim.de/67483/1/Computer%20Assisted%20Learning%20-%202024%20-%20Almeida%20-%20More%20personal%20but%20not%20better%20The%20personalization%20effect%20in%20learning%20neutral.pdf)). Leí resúmenes.
- **Lo que tiene que ver conmigo se recuerda mejor.** Un metaestudio de 129 estudios confirma que la información relacionada con uno mismo se recuerda más ([Symons y Johnson, 1997](https://typeset.io/pdf/the-self-reference-effect-in-memory-a-meta-analysis-420gaemnqu.pdf)). Casi todos usaron listas de palabras, así que es un apoyo indirecto.
- **Problemas con el contexto del estudiante.** En un experimento con 145 estudiantes de álgebra, quienes recibieron problemas adaptados a sus intereses rindieron mejor, y la ventaja se mantuvo después de quitar la adaptación ([reportaje de Education Week sobre Walkington](https://www.edweek.org/teaching-learning/studies-find-payoff-in-personalizing-algebra/2012/09)). Un solo experimento.

Nuestro caso es más fuerte que cualquiera de estos: no adaptamos el problema a los gustos de la persona, usamos su desprendible y su deuda.

### Con IA como tutor

Dos experimentos recientes marcan el límite:

- **Bien diseñado, enseña más en menos tiempo.** En Harvard, 194 estudiantes de física aprendieron más con un tutor de IA en casa que en una clase activa presencial (mediana de 4,5 contra 3,5 en la prueba posterior), y en menos tiempo. El tutor se construyó con las mismas prácticas pedagógicas de la clase ([Kestin y otros, 2025](https://www.nature.com/articles/s41598-025-97652-6)). Leí resúmenes; no pude confirmar la lista de principios de diseño.
- **Mal diseñado, daña.** En un colegio de Turquía, los estudiantes con un chat sin restricciones sacaron 48 % más en los ejercicios de práctica, pero rindieron 17 % menos después, sin la herramienta, que quienes nunca la tuvieron. Con un tutor que daba pistas en vez de respuestas, el daño desapareció ([Bastani y otros, 2025](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)).

Regla que sale de ahí: la IA hace pensar a la persona; no piensa por ella. En nuestro producto, eso significa que la IA explica y pregunta, y la decisión del reparto de la prima la toma la persona.

### Visual y dinámica

No encontré un experimento que aísle "lo visual" en educación financiera más allá del de Lusardi. Lo que sigue en esta sección de diseño visual es criterio de producto, no evidencia.

## 2. Anatomía de una lección de cinco minutos

Seis momentos. Cada uno tiene una razón.

| # | Momento | Qué pasa | Ejemplo en "Mi prima" | Por qué |
|---|---|---|---|---|
| 1 | Gancho con su número | Una pantalla con un dato suyo y una pregunta | "El 20 de diciembre te llega plata extra. ¿Sabes cuánto?" | Lo propio se recuerda; momento enseñable |
| 2 | Predicción | La persona apuesta antes de saber | Mueve un deslizador hasta lo que cree que le llega | Obliga a pensar antes de recibir la respuesta |
| 3 | Revelación manipulable | Ve el resultado real y puede mover las piezas | Su prima calculada; cambia la fecha de ingreso y ve cómo cambia | Aprendizaje activo; vuelve visible la fórmula |
| 4 | Regla | Una frase para llevarse | "Decido el reparto antes de que llegue la plata" | Las reglas simples funcionan mejor que la teoría |
| 5 | Decisión | Hace algo con su plata | Reparte la prima entre cuatro destinos | Las metas convierten conocimiento en conducta |
| 6 | Compromiso | Fecha y recordatorio con su meta | "Te escribo el 19: $400.000 al colchón para irte a vivir sola" | Los recordatorios con la meta propia funcionan; los genéricos no |

Lo que no tiene: video largo, definiciones para memorizar, quiz de selección múltiple al final.

## 3. Catálogo de interacciones

Diez piezas reutilizables. Con estas se arman todos los módulos del currículo.

| Interacción | Qué hace la persona | Dónde se usa |
|---|---|---|
| Desglosar | Toca una cifra y se abre en sus partes | Desprendible: del bruto al neto. Extracto: de la cuota a capital, intereses y seguros |
| Predecir y revelar | Apuesta un número y luego ve el real | Prima, intereses de la tarjeta, cuánto suma el tinto diario |
| Deslizar para simular | Mueve una variable y ve el efecto en el tiempo | Pago mínimo contra pago total; ahorrar $100.000 o $300.000 al mes |
| Repartir | Distribuye un monto entre destinos | Prima, quincena |
| Ordenar | Arrastra para priorizar | Qué deuda pagar primero |
| Comparar dos caminos | Escoge entre A y B y ve ambos desenlaces | Aceptar la tarjeta o no; 12 cuotas "sin interés" o de contado |
| Encontrar el cobro | Busca en un documento lo que no debería estar | Seguro no pedido o cuota de manejo en un extracto |
| Línea de tiempo | Ubica sus fechas en el año | Prima, intereses, cesantías, corte y pago de la tarjeta |
| Explicar con sus palabras | Escribe o dicta una explicación corta y la IA le responde | Cierre de cualquier lección; reemplaza al quiz |
| Preguntar | Pregunta libre, limitada al tema | En cualquier pantalla |

"Deslizar para simular" es la pieza más importante: es la que vuelve amable el entorno perverso descrito en el documento 07.

## 4. Cuatro niveles de personalización

| Nivel | Qué cambia | De dónde sale | Disponible desde |
|---|---|---|---|
| Números | Todas las cifras son las de la persona | Su documento | El primer usuario |
| Contexto | Los ejemplos usan su ciudad, su tipo de gasto, su meta | Dos o tres preguntas y lo que va contando | El primer usuario |
| Ruta | Qué lección le toca y cuándo | Calendario legal y sus fechas | El primer usuario, con reglas |
| Profundidad | Cuánto se explica y con qué dificultad | Sus respuestas y dónde se detiene | Cuando haya datos (documento 06, etapa 3) |

## 5. Qué se hace a mano, qué hace el código y qué hace la IA

Es el mismo reparto que usa Duolingo para producir contenido (documento 06, sección 1.5), aplicado a lecciones.

| Pieza | Quién | Razón |
|---|---|---|
| Las diez interacciones y la estructura de cada lección | El equipo, una vez | La calidad de la interacción no se improvisa; un componente bien hecho se reutiliza en todos los módulos |
| Reglas, fórmulas y fechas legales | El equipo, con fuente y fecha | No pueden tener errores |
| Todos los cálculos | Código | Un modelo de lenguaje puede equivocarse en cuentas |
| Leer el documento | IA con visión, con confirmación de la persona | Cada empresa usa un formato distinto |
| Texto de cada pantalla con el caso de la persona | IA, dentro de una plantilla con reglas fijas | Es donde la IA aporta lo que una lección fija no puede |
| Respuesta a "explica con tus palabras" y a preguntas | IA, limitada a la base de contenido, con instrucción de dar pistas y no decidir | Para no repetir el daño del chat sin restricciones |

Sobre generar la interfaz completa con IA en vivo: es posible técnicamente, pero recomiendo no hacerlo al inicio. Con plantillas fijas se puede revisar cada lección una vez y confiar en ella; con interfaz generada cada usuario vería algo que nadie revisó.

## 6. Criterios visuales

Criterio de producto, sin evidencia experimental directa.

- Una idea por pantalla.
- El número de la persona es lo más grande de la pantalla.
- Siempre pesos colombianos, con el formato que ve en su banco.
- El gesto principal está en la mitad inferior, al alcance del pulgar.
- Movimiento solo cuando explica algo: la barra del sueldo que se parte, la deuda que crece.
- Los colores de alarma se reservan para lo que de verdad cuesta plata.

## 7. Tono

- De par, no de profesor ni de banco. Lo piden los tres ICP y lo respalda el principio de personalización.
- Con cuidado en deuda: el efecto del tono cercano puede invertirse en temas desagradables. Con alguien que debe plata, cercano no significa chistoso.
- Sin regaños. En 2026 un cliente del banco británico Monzo se quejó ante el defensor financiero por el "lenguaje de vergüenza" de su resumen anual de gastos ([City AM](https://www.cityam.com/?p=2405674)). Solo vi el titular y un resumen.

## 8. Qué evitar

- Quizzes de definiciones: miden conocimiento, que es lo fácil de mover y lo que menos importa.
- Interacciones decorativas: tocar por tocar sube la confianza sin subir la comprensión.
- IA que entrega la respuesta o la decisión.
- Copiar mecánicas de juego sin preguntar por qué funcionan (documento 06, sección 1.4).
