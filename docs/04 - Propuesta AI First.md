# 04 - Propuesta AI First

Una propuesta para discutir en el grupo, no una decisión. Parte de los dolores del documento 02 y de la metodología del 03.

## 1. La prueba que usamos

Para cada idea: **si quitas la IA, ¿el producto sigue existiendo?** Si la respuesta es sí, la IA es un feature.

EZ no pasaba esta prueba. Sin el chat de OpenAI seguía siendo la misma app: encuesta, niveles, lecciones y tracker. La personalización real era una encuesta que escogía un personaje.

## 2. Cómo personalizan los que lo hacen bien

El análisis completo de Duolingo, TikTok y Rappi está en el documento 06. Aquí va el resumen.

- **Duolingo.** Su modelo Birdbrain estima, para cada persona y cada ejercicio, la probabilidad de que lo conteste bien, a partir de dos variables: la habilidad del estudiante y la dificultad del ejercicio. Las actualiza después de cada respuesta, con una lógica parecida al sistema Elo del ajedrez, y escoge ejercicios ni muy fáciles ni muy difíciles. Para decidir cuándo repasar usa un modelo que estima cuánto tarda cada persona en olvidar cada palabra ([blog de Duolingo sobre Birdbrain](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain), [IEEE Spectrum](https://spectrum.ieee.org/duolingo), [blog de Duolingo sobre repetición espaciada](https://blog.duolingo.com/how-we-learn-how-you-learn)). 
- **Lo que se aprende de ahí.** La primera versión no era IA generativa sino un modelo estadístico sencillo. Funciona porque Duolingo tiene cerca de mil millones de ejercicios al día. Un equipo que arranca con cero usuarios no puede copiarlo el primer día.
- **TikTok.** Aprende sobre todo de señales implícitas (si la persona termina el video) y resuelve el usuario nuevo con una elección rápida y aprendizaje inmediato. Optimiza tiempo en la app, que no es lo que nos conviene.
- **Rappi.** Publica poco. Lo verificable: segmenta por estado del usuario y obtuvo 71 % de lectura por WhatsApp.

Conclusión para nosotros: la personalización por comportamiento es una meta de mediano plazo. Para empezar se necesita una fuente de personalización que funcione desde el primer usuario. Los tres escogen entre contenido que ya existe; un modelo de lenguaje permite fabricar el contenido para cada persona a partir de sus datos. La escalera completa, de cero a decenas de miles de usuarios, está en el documento 06.

### La tesis detrás de la propuesta

La evidencia (documento 07) muestra que lo que mejor convierte conocimiento en conducta es que alguien acompañe la decisión en el momento: asesoría, metas, recordatorios con la meta propia. Eso siempre ha sido caro. La IA permite ofrecerlo al costo de un contenido de redes. Por eso aquí la IA no es un adorno: es lo que hace viable la forma de enseñar que funciona.

## 3. Opciones evaluadas

| Opción | Qué hace | ¿Pasa la prueba? | Qué resuelve | Problema |
|---|---|---|---|---|
| A. Chat tutor | La persona pregunta y la IA responde | No | C1 | Es lo que tenía EZ; lo ofrece cualquier asistente general |
| B. Secuencia adaptativa tipo Birdbrain | Modelo que escoge la siguiente lección según aciertos | A medias | Orden del contenido | Necesita miles de respuestas para servir; al inicio sería una regla fija disfrazada |
| C. Lecciones generadas con los números de la persona | La IA escribe el ejemplo y el ejercicio con su caso | Sí | C2, C3 | Necesita conocer sus números sin pedirle que los digite todos |
| D. Lectura de sus documentos | Sube una foto del desprendible o del extracto y la IA lo convierte en datos | Sí | D1, C4, C5 | Datos personales sensibles; la lectura puede fallar |
| E. Recomendador por momento | Cruza el calendario (prima, cesantías, corte de la tarjeta) con lo que la persona aún no sabe y propone el siguiente paso | Sí | D2, C7 | Solo, se reduce a recordatorios |

Ninguna opción sola alcanza. C necesita a D para tener los números, y D sin C es un lector de documentos que no enseña.

## 4. Recomendación: el currículo se arma a partir de la plata real de cada persona

**En una frase:** la persona sube un documento de su plata y el producto le arma, con sus propios números y sus propias fechas, las lecciones que necesita para la decisión que tiene enfrente.

Tres piezas que trabajan juntas:

1. **Lector de documentos (opción D).** Un modelo con visión lee el desprendible o el extracto y extrae salario, descuentos, fecha de ingreso, saldo, tasa y pago mínimo. Con eso el producto conoce a la persona en un minuto, sin registro manual (C4) y sin pedir claves del banco (C5).
2. **Motor del siguiente paso (opción E).** Con esos datos y el calendario legal colombiano calcula qué decisión le llega pronto ("tu prima llega en cinco semanas y sería de cerca de $900.000") y qué le falta saber para tomarla. Es un sistema de reglas al inicio, y más adelante un modelo que aprende de las respuestas, como Birdbrain.
3. **Generador de lecciones (opción C).** La IA escribe la explicación y el ejercicio con los números de la persona, sobre una base de contenido colombiano verificada por el equipo.

Si se quita la IA, no se pueden leer documentos ni generar lecciones por persona, y lo que queda es un curso genérico con temario fijo: lo mismo que EZ o Ceti. Por eso pasa la prueba.

### Qué hace la IA y qué no

| Tarea | Quién la hace | Por qué |
|---|---|---|
| Leer el documento y extraer datos | Modelo con visión | Cada empresa y cada banco usan un formato distinto |
| Calcular prima, descuentos, intereses | Código determinista | Un modelo de lenguaje puede equivocarse en cuentas; aquí un error destruye la confianza. EZ ya separaba así el cálculo del presupuesto |
| Reglas y fechas legales | Base de contenido curada por el equipo | Cambian con la ley y deben tener fuente y fecha |
| Explicar en el idioma de la persona, con su caso | Modelo de lenguaje | Es donde aporta lo que un contenido fijo no puede |
| Responder dudas | Modelo de lenguaje, limitado a la base de contenido | Resuelve C1 sin inventar normas |
| Decidir qué producto financiero comprar | Nadie | El producto enseña, no asesora |
| Tomar la decisión por la persona | Nadie | En un experimento, un chat que daba las respuestas dejó a los estudiantes 17 % peor que a quienes no lo usaron; uno que daba pistas no hizo daño (documento 08) |

### Por qué esto es difícil de copiar

- La base de reglas colombianas hay que mantenerla al día (salario mínimo cada enero, tasa de usura cada mes, reforma pensional en abril de 2027).
- Cada documento leído y cada respuesta alimentan el modelo de qué necesita cada tipo de persona. Con uso, el motor del siguiente paso deja de ser reglas y se vuelve un recomendador entrenado con datos que nadie más tiene.

## 5. Riesgos

| Riesgo | Qué tan serio | Cómo se maneja |
|---|---|---|
| Datos personales: el desprendible trae cédula, empleador y salario | Alto | Guardar solo los valores extraídos, no la imagen; pedir autorización explícita; revisar la ley de protección de datos (Ley 1581 de 2012) antes de probar con usuarios reales. Para el prototipo se usa un desprendible de ejemplo |
| La IA lee mal una cifra | Medio | Mostrar lo extraído y pedir confirmación antes de usarlo |
| La IA inventa una norma | Alto | Las normas salen de la base curada, no del modelo |
| Que parezca asesoría financiera | Medio | Opciones y reglas, nunca productos específicos |
| La persona no quiere subir un documento | Desconocido, es el supuesto más importante | Permitir digitar tres datos (salario, fecha de ingreso, si tiene tarjeta) como alternativa, y medir cuántos escogen cada camino |
| Costo por uso del modelo | Bajo al inicio | Se mide en el prototipo |

## 6. Cómo probarlo barato antes de construir

EZ se construyó completo y no llegó a usuarios. Para no repetirlo:

1. **Prueba manual con cinco personas del ICP.** Se les pide una foto de su desprendible con los datos personales tapados. Alguien del equipo, con ayuda de un asistente de IA, les devuelve por WhatsApp la explicación línea por línea y el cálculo de su prima. Se mide si lo entregan, si entienden y si preguntan algo más.
2. **Prototipo de un solo flujo.** El del documento 05, que además es lo que pide el entregable del programa.

## 7. Qué queda abierto para el grupo

- Si el punto de entrada es el desprendible (variante A) o el extracto de la tarjeta (variante B). Recomiendo el desprendible: tiene menos carga emocional y la prima de diciembre le da urgencia ahora.
- Si es app móvil o web. Para el prototipo recomiendo web: se construye más rápido y se prueba con un enlace. Para el producto, el documento 09 propone WhatsApp como puerta y web como cuerpo.
- Quién paga. No cambia el primer flujo, pero sí a quién se entrevista después (personas o áreas de bienestar de empresas).
- Cómo se suma la investigación de Luca sobre personalización cuando esté.
