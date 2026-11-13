# 06 - Cómo personalizan Duolingo, TikTok y Rappi

Qué hacen de verdad, con qué datos, y qué nos sirve a un equipo que arranca con cero usuarios. Al final de cada sección se indica qué tan sólida es la fuente.

## 1. Duolingo

Duolingo tiene cuatro sistemas distintos. Conviene separarlos porque resuelven problemas diferentes y solo uno es "la IA que personaliza la lección".

### 1.1 Birdbrain: qué tan difícil debe ser el siguiente ejercicio

- **Qué predice:** para cada persona y cada ejercicio, la probabilidad de que lo responda bien.
- **Versión 1 (2020):** una regresión logística inspirada en la teoría de respuesta al ítem. Dos números: habilidad de la persona y dificultad del ejercicio. Después de cada respuesta ajusta ambos, como el sistema Elo del ajedrez: un error baja la habilidad estimada y sube la dificultad estimada, y los resultados sorpresivos mueven más los números.
- **Versión 2 (mayo de 2022):** una red neuronal recurrente que resume el historial de cada persona en un vector de 40 dimensiones, lo que permite distinguir, por ejemplo, a alguien fuerte en pasado y débil en futuro. Se actualiza en minutos, no una vez al día.
- **Escala:** más de 50 millones de estudiantes activos y cerca de mil millones de ejercicios al día.
- **Cómo se usa:** un generador de sesiones arma la lección escogiendo ejercicios en el borde de la habilidad de la persona. Muy fácil aburre, muy difícil frustra.
- **Resultado:** en pruebas A/B subieron tanto el tiempo de uso como la velocidad de avance. Duolingo no publica cifras.
- **Dato útil:** cerca del 20 % de las lecciones que se empiezan no se terminan.

Fuente: [artículo de los autores en IEEE Spectrum](https://spectrum.ieee.org/duolingo) y [blog de Duolingo](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain). De ambos vi un resumen automático de la página completa, no el texto palabra por palabra.

**Lo importante:** Birdbrain personaliza la dificultad, no el contenido. Todos los estudiantes de un curso ven el mismo banco de ejercicios; cambia cuál les toca. Y la versión 1 era un modelo muy simple.

### 1.2 Repaso espaciado

Un modelo estima cuánto tarda cada persona en olvidar cada palabra y programa el repaso justo antes. Según su blog, el error de predicción fue casi la mitad que el del sistema de tarjetas tradicional ([blog de Duolingo](https://blog.duolingo.com/how-we-learn-how-you-learn)). Solo leí el resumen.

### 1.3 Notificaciones: un algoritmo que escoge el mensaje

- Las notificaciones salen de plantillas escritas a mano. Un algoritmo de tipo bandido escoge cuál mandar a cada persona.
- Dos problemas que resolvieron: una plantilla "fresca" funciona mejor que una repetida, así que el algoritmo debe variar aunque una sea la mejor en promedio; y no todas las plantillas aplican a todos (la de racha solo sirve si hay racha).
- Midieron éxito como "completó una lección dentro de las dos horas siguientes".
- **Resultado:** 0,5 % más usuarios activos diarios y 2 % más retención de usuarios nuevos sobre una base ya optimizada.

Fuente: [Yancey y Settles, KDD 2020](https://research.duolingo.com/papers/yancey.kdd20.pdf). Leí las tres primeras páginas.

### 1.4 Crecimiento: rachas, ligas y la regla de proteger el canal

Esto viene del relato de Jorge Mazal, quien dirigió producto en Duolingo ([Lenny's Newsletter](https://lennysnewsletter.com/p/how-duolingo-reignited-user-growth)). Vi un resumen automático de la página completa.

- **Dos fracasos primero.** Copiaron de un juego un contador de movimientos: resultado neutro. Copiaron el programa de referidos de Uber: 3 % más usuarios nuevos. La conclusión de Mazal: copiaron mecánicas sin preguntarse por qué funcionaban en el producto original y si esa razón existía en el suyo.
- **Escoger la métrica con un modelo.** Simularon qué pasaba al mover cada tasa 2 % por trimestre. La retención de usuarios actuales tenía cinco veces más efecto sobre los usuarios diarios que la segunda mejor. Dejaron de priorizar la retención de usuarios nuevos.
- **Ligas:** 17 % más tiempo de aprendizaje y se triplicaron los usuarios muy activos.
- **Rachas:** la proporción de usuarios diarios con racha de siete días o más casi se triplicó, hasta más de la mitad. La primera victoria fue una notificación de "vas a perder tu racha".
- **Proteger el canal:** aprendieron de Groupon que aumentar el número de mensajes sube las métricas al inicio y después la gente los desactiva para siempre. Regla: se puede probar el texto, la hora y la imagen, pero no aumentar el volumen sin aprobación del director.
- **Total en cuatro años:** la retención de usuarios actuales subió 21 % y los usuarios diarios se multiplicaron por 4,5.

### 1.5 IA generativa: para producir contenido, con humanos al final

- Un diseñador de aprendizaje define tema, gramática y tipo de ejercicio.
- El prompt funciona como una plantilla con reglas fijas (formato, longitud máxima) y variables (nivel, idioma, tema).
- El modelo genera diez opciones en segundos. El diseñador escoge unas tres y las edita. Expertos tienen la última palabra.

Fuente: [blog de Duolingo](https://blog.duolingo.com/large-language-model-duolingo-lessons). Vi un resumen automático de la página completa.

### 1.6 Qué nos deja Duolingo

1. El crecimiento vino de mecánicas de juego y notificaciones bien probadas, más que del modelo de dificultad.
2. Su personalización necesita millones de respuestas. No se puede copiar con cero usuarios.
3. Usan la IA generativa para producir contenido que un humano revisa, no para improvisar frente al usuario.
4. La advertencia de Mazal aplica exactamente a nuestro "Duolingo morado": la racha diaria funciona porque un idioma se aprende con práctica diaria. Antes de copiarla hay que preguntar si esa razón existe en finanzas. El documento 07 muestra que no.

## 2. TikTok

### 2.1 Lo que TikTok dice oficialmente

- **Señales:** interacciones (me gusta, compartir, seguir, comentar, y sobre todo si la persona termina el video), información del video (texto, sonido, etiquetas) y configuración del dispositivo (idioma, país), esta última con poco peso.
- **Pesos:** ver un video largo hasta el final pesa mucho; compartir país con el creador pesa poco. El número de seguidores no es un factor directo.
- **Usuario nuevo:** puede escoger categorías de interés; si no, recibe videos populares y el sistema aprende de sus primeras reacciones.
- **Variedad:** evita dos videos seguidos del mismo creador y mete a propósito videos fuera de los intereses conocidos para descubrir nuevos.

Fuente: [sala de prensa de TikTok](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you). Vi un resumen automático de la página completa.

### 2.2 Lo que se filtró

En diciembre de 2021 el New York Times reportó un documento interno. Según los resúmenes, cada video recibe un puntaje que suma las predicciones de que la persona le dé me gusta, comente y lo vea, cada una multiplicada por un valor, y el sistema persigue dos metas: que la persona vuelva y que pase más tiempo. Solo leí reportes secundarios ([TechTimes](https://www.techtimes.com/articles/269024/20211206/tiktok-algo-101-leaked-document-tiktok-secret-algorithm-tiktok.htm)); el documento es de 2021 y dice que la fórmula real es más compleja.

ByteDance también publicó un artículo técnico sobre un sistema que reentrena el modelo en tiempo real con las reacciones recientes ([Monolith, 2022](https://arxiv.org/abs/2209.07663)). Solo leí el resumen.

### 2.3 Qué nos deja TikTok

1. **Las señales implícitas valen más que las declaradas.** Lo que la persona hace (se queda, repite, abandona) dice más que lo que responde en una encuesta. La encuesta inicial de EZ era lo contrario.
2. **Unidades cortas dan más señales.** Cada video de segundos es una observación. Lecciones de pantallas cortas permiten aprender rápido qué funciona con cada persona.
3. **El arranque en frío se resuelve con una elección rápida y aprendizaje inmediato.**
4. **Hay que explorar a propósito.** Mostrar solo lo que ya funciona encierra a la persona.
5. **Lo que no hay que copiar: el objetivo.** TikTok optimiza tiempo en la app. Nosotros deberíamos optimizar decisiones tomadas. Un producto de finanzas que maximiza tiempo de pantalla trabaja contra su usuario.

## 3. Rappi

Rappi publica muy poco sobre su ingeniería. No encontré un blog técnico que explique su sistema de recomendación. Lo que sí pude verificar:

- **Mensajes por WhatsApp según el estado del usuario.** Con la plataforma Braze separaron a los usuarios en activos e inactivos, con campañas distintas, y enviaron por WhatsApp las mejores ofertas para cada uno. Tasas de lectura de 71 % y 67 %. En los inactivos, 80 % más compradores que el grupo de control, que solo recibía notificaciones y correo ([caso publicado por Braze](https://www.braze.com/customers/rappi-case-study)). Es un caso comercial del proveedor.
- **Modelos que predicen la siguiente compra.** Una consultora que trabajó con ellos describe modelos de lenguaje y modelos secuenciales para sugerir filtros, leer la intención del carrito y anticipar qué va a comprar la persona. No da cifras ([Marvik](https://www.marvik.ai/cases/rappi-case-study-how-ai-improved-search-delivery-and-merchant-growth)).
- **Recomendaciones distintas según la etapa del embudo.** Una charla de su equipo explica que el objetivo de la recomendación y la métrica para evaluarla cambian según en qué paso esté el usuario ([SciPy Latinoamérica](https://conf.scipyla.org/charlas/recomendaciones-en-rappi/)). Solo leí el resumen de la charla.

### Qué nos deja Rappi

1. **En Colombia el canal es WhatsApp.** Una tasa de lectura de 71 % no existe en notificaciones ni en correo. Esto pesa en la forma del producto (documento 09).
2. **Segmentar por estado, no por demografía.** Activo, en riesgo, inactivo: a cada uno se le habla distinto.
3. **La meta de la recomendación cambia según el momento.** Para alguien nuevo, la meta es que vea valor una vez; para alguien que ya volvió, que tome la siguiente decisión.

## 4. Comparación

| | Duolingo | TikTok | Rappi | Nosotros hoy |
|---|---|---|---|---|
| Qué se personaliza | Dificultad y mensaje | Qué contenido sigue | Oferta y canal | Contenido de la lección |
| Con qué señal | Aciertos y errores | Tiempo de vista y reacciones | Historial de compras | Los documentos y fechas de la persona |
| Datos necesarios | Millones de respuestas | Miles de millones de vistas | Millones de pedidos | Un documento por persona |
| El contenido es | Banco fijo, escrito por humanos | Hecho por usuarios | Catálogo de comercios | Generado por persona sobre plantillas |
| Qué optimiza | Que vuelva mañana y aprenda | Tiempo y regreso | Compras | Decisiones tomadas |

La diferencia de fondo: los tres escogen entre contenido que ya existe, y para escoger bien necesitan mucho comportamiento acumulado. Un modelo de lenguaje permite algo que ninguno hacía cuando construyó su sistema: fabricar el contenido para una persona a partir de sus datos. Eso funciona con el primer usuario.

## 5. Escalera de personalización para nosotros

Es inferencia mía a partir de lo anterior.

| Etapa | Usuarios | Qué se puede hacer | De quién se aprende |
|---|---|---|---|
| 1 | 0 a 100 | Personalizar con los datos del documento y un calendario de reglas. Registrar todo: qué toca, dónde abandona, qué pregunta | Nadie lo hacía así |
| 2 | Cientos | Probar plantillas y horas de mensajes con un algoritmo de bandido. Segmentar por estado | Duolingo, Rappi |
| 3 | Miles | Modelo tipo Elo por concepto: qué entiende ya cada persona y qué tan difícil es cada lección | Birdbrain versión 1 |
| 4 | Decenas de miles | Recomendador del siguiente paso entrenado con el comportamiento de personas parecidas | TikTok, Birdbrain versión 2 |

Lo que hay que hacer desde el día uno, aunque no se use todavía, es guardar las señales implícitas. Es el dato que después nadie más va a tener.
