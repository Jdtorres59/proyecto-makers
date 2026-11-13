# 05 - Primer flujo a prototipar

> **Idea en exploración, no una decisión.** Este documento es una posibilidad que salió de la investigación. El equipo no ha definido el producto. Las dudas de fondo están en `00 - Preguntas abiertas.md`.

Aterriza los documentos 01 a 04 en lo que pide el entregable "Avances del prototipo y primera validación" (fecha ideal 15 de noviembre, límite 22 de noviembre de 2026). Es una propuesta: el grupo decide si este es el flujo.

## 1. El flujo: "De mi desprendible a mi plan para la prima"

**Por qué este.** Ataca los dos dolores de mayor prioridad (D1 documentos que no entiendo, D2 decisiones con fecha), usa las tres piezas de la propuesta AI First, cabe en una sesión de cinco minutos y la prima de diciembre le da sentido hoy.

**Tarea que completa el usuario:** saber cuánto le va a llegar de prima en diciembre y dejar decidido qué va a hacer con ella.

| Paso | Pantalla | Qué hace la persona | Qué hace el producto |
|---|---|---|---|
| 1 | Entrada | Sube una foto de su desprendible, o escoge "no lo tengo" y digita salario y fecha de ingreso | Lee el documento y extrae los valores |
| 2 | Confirmación | Revisa lo que se leyó y corrige si algo está mal | Muestra salario, descuentos, neto y fecha de ingreso |
| 3 | Tu desprendible explicado | Toca cada línea para ver qué es | Explica cada descuento con sus cifras, en lenguaje simple |
| 4 | Lo que viene | Primero apuesta cuánto cree que le llega de prima; después ve el valor real | Calcula la prima según salario y días trabajados, y muestra la fecha límite de pago |
| 5 | Dos preguntas | Responde si tiene deudas y si tiene algún ahorro de emergencia | Ajusta el orden sugerido de las opciones |
| 6 | Reparto | Distribuye la prima entre colchón, deuda, una meta y un gusto | Muestra la regla ("primero lo que me cuesta, después lo que me protege, después lo que quiero") y el efecto de cada reparto |
| 7 | Plan | Ve su plan resumido, escoge que le recuerden el día anterior y puede hacer una pregunta | Guarda el plan y responde la duda dentro del tema |

El flujo sigue la anatomía de lección del documento 08: gancho con su número, predicción, revelación manipulable, regla, decisión y compromiso.

## 2. Qué es real y qué se simula en el prototipo

| Pieza | En el prototipo | Nota |
|---|---|---|
| Lectura del desprendible | Real, con un modelo con visión | Es el corazón de la propuesta; si se simula, no se prueba nada |
| Desprendible de ejemplo | Incluido, con datos ficticios | Para que la persona externa no tenga que usar el suyo |
| Explicación línea por línea | Real, generada con los números leídos | |
| Cálculo de la prima | Real, en código | Salario por días trabajados en el semestre, dividido en 360 |
| Reparto y plan | Real | Sin guardar en servidor; basta con mostrarlo |
| Pregunta final | Real, limitada al tema | |
| Cuentas de usuario, recordatorios, otros módulos | No se construyen | Se documentan como próximos pasos |

**Desprendible de ejemplo propuesto** (datos ficticios, pensados para que el cálculo sea limpio):

- Salario básico: $3.600.000. Ingreso a la empresa: 1 de octubre de 2026.
- Descuento de salud (4 %): $144.000. Descuento de pensión (4 %): $144.000.
- Neto: $3.312.000.
- Prima de diciembre esperada: $3.600.000 por 90 días, dividido en 360 = $900.000.

Se usa $3.600.000 y no los $3.500.000 de Valentina porque quien gana hasta dos salarios mínimos ($3.501.810 en 2026) recibe auxilio de transporte, y eso cambia la base de la prima. Con este valor el ejemplo no depende de ese detalle.

## 3. Criterio de éxito de la prueba

La persona, sin ayuda, logra las tres cosas:

1. Decir con sus palabras qué son los dos descuentos del desprendible.
2. Decir cuánto le llegaría de prima y cuándo.
3. Terminar con un reparto guardado.

## 4. Guion de la prueba con una persona externa

Sigue los cuatro pasos de la consigna. No tiene que ser del público objetivo.

1. **Explicar la tarea (un minuto).** "Imagina que empezaste a trabajar el 1 de octubre y este es tu desprendible. Usa la app para saber cuánto te va a llegar de prima en diciembre y deja un plan para esa plata. Piensa en voz alta."
2. **Dejarla interactuar sin explicar.** Si pregunta, responder "¿qué harías si yo no estuviera?". Solo intervenir si lleva más de dos minutos bloqueada, y anotarlo.
3. **Observar.** Anotar en qué paso duda, qué toca que no esperábamos, qué lee y qué se salta, y cuánto tarda.
4. **Pedir opinión.** Tres preguntas:
   - "¿Qué fue lo más confuso?"
   - "Explícame con tus palabras qué te descuentan y cuánto te llega de prima."
   - "Si esto fuera con tu desprendible real, ¿lo subirías? ¿Por qué?"

La última pregunta es la más valiosa: prueba el supuesto más riesgoso de la propuesta.

Evidencia a guardar, con permiso de la persona: grabación de pantalla o fotos de la sesión, y las notas.

## 5. Qué registrar para el PDF del entregable

La consigna pide estos seis puntos sobre la validación:

- **Flujo evaluado:** "De mi desprendible a mi plan para la prima".
- **Metodología:** prueba moderada con tarea única, pensando en voz alta, sin guía.
- **Resultado:** si completó la tarea sin ayuda, y cuáles de los tres criterios cumplió.
- **Dificultades:** pasos donde dudó o se bloqueó.
- **Feedback:** respuestas a las tres preguntas.
- **Aprendizajes:** qué se cambia antes de la siguiente prueba.

Y sobre los avances: pantallas y flujos desarrollados, capturas o enlace, qué funciona y qué está en construcción, dificultades y próximos pasos. El PDF debe pesar máximo 4 MB y cada integrante sube el mismo archivo.

## 6. Calendario propuesto

Apuntar al 22 de noviembre. El 15 no es realista si el grupo todavía debe aprobar el flujo.

| Fecha | Qué |
|---|---|
| 13 y 14 nov | El grupo lee los documentos 01 a 05 y decide si este es el flujo |
| 15 a 18 nov | Construir el prototipo web del flujo |
| 19 y 20 nov | Prueba con al menos una persona externa; ajustes menores |
| 21 nov | Armar el PDF del entregable |
| 22 nov | Cada integrante sube el PDF |

## 7. Decisiones que necesita el grupo antes de construir

1. Si este es el flujo, o si prefieren entrar por el extracto de la tarjeta.
2. Quién construye y con qué herramientas.
3. Quién consigue a la persona externa y quién modera la prueba.
