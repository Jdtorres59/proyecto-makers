# 09 - Cómo se ve y se usa el producto

> **Idea en exploración, no una decisión.** Este documento es una posibilidad que salió de la investigación. El equipo no ha definido el producto. Las dudas de fondo están en `00 - Preguntas abiertas.md`.

Responde las preguntas de forma: cada cuánto se usa, qué lo dispara, por dónde llega, qué ve la persona al abrirlo y cómo se mide si funciona. Es una propuesta razonada sobre los documentos 06 a 08; lo que no está validado se dice.

## 1. La respuesta corta

No es una app diaria. El uso natural es de **dos a cuatro veces al mes, de dos a cinco minutos cada vez, más las veces que la persona llegue con una duda o un documento**. Sí: cuando llega el extracto, cuando pagan, cuando viene la prima. Intentar que sea diaria pelea contra la evidencia del documento 07 y contra lo que dicen los ICP.

## 2. Por qué no diaria

- **Los ICP lo dicen.** Andrés piensa en plata dos veces al mes. Valentina tiene momentos de calendario. Santiago tiene quincena, día 20 y SMS del pago mínimo.
- **La razón de la racha diaria no existe aquí.** Un idioma necesita práctica diaria; la plata se decide por episodios (documento 07, sección 5).
- **Las apps de estas categorías casi no retienen a diario.** Los reportes de la industria ubican la retención al día 30 de apps de finanzas entre 2 % y 6 %, y de educación entre 2 % y 8 %, según la fuente ([recopilación de GetStream](https://getstream.io/blog/app-retention-guide)). Las fuentes no coinciden entre sí y son secundarias; sirven como orden de magnitud. Duolingo es la excepción y le costó años de optimización (documento 06).
- **La gente sí mira su plata cada semana.** Entre 70 % y 83 % de quienes usan la app de su banco la abren al menos una vez por semana, según encuestas de [Consumer Reports](https://advocacy.consumerreports.org/wp-content/uploads/2023/11/2023-Consumer-Reports-Banking-Apps-Survey-Report.pdf), [HSBC](https://www.about.hsbc.co.uk/news-and-media/hours-of-screentime-connectivity-financial-oversight-and-anxiety) y [YouGov](https://yougov.com/articles/46934-a-global-look-into-smartphone-banking). Son de Estados Unidos, Reino Unido y global; no encontré el dato para jóvenes colombianos.

Lectura: la gente ya tiene un ritmo semanal o quincenal con su plata, que hoy consiste en mirar el saldo. El producto se monta sobre ese ritmo.

## 3. El ritmo en tres capas

### Capa 1: eventos (el núcleo)

El producto aparece cuando hay un evento de plata. Cada evento activa un módulo del currículo.

| Evento | Frecuencia | Qué hace el producto | Módulo |
|---|---|---|---|
| Entra al producto | Una vez | Lee su desprendible o extracto y arma su línea de tiempo | 1 |
| Pago de nómina | Quincenal o mensual | Pulso de quincena (capa 2) | 2 |
| Llega el extracto de la tarjeta | Mensual | Se lo explica: cuánto es deuda, cuánto intereses, qué pasa si paga el mínimo | 6 |
| Tres días antes de la fecha de pago | Mensual | Recordatorio con su meta y repaso de un minuto | 6 |
| Cinco semanas antes de la prima | Dos veces al año | Calcula su prima y arma el plan | 3 |
| Llega la prima | Dos veces al año | Le recuerda su plan el mismo día | 3 |
| Intereses de cesantías (antes del 31 de enero) y consignación (antes del 15 de febrero) | Una vez al año | Le explica qué entró y qué puede hacer | 4 |
| Le ofrecen un crédito o una tarjeta | Cuando pase; lo inicia la persona | "Me ofrecieron esto": lo analiza con ella | 6 |
| Aumento de sueldo o cambio de trabajo | Cuando pase | Recalcula todo y revisa retención y auxilio de transporte | 1 |
| Cambia una norma que la afecta | Cuando pase | Le dice qué cambia para ella en concreto | 5 |

El repaso mensual junto al extracto responde al dato de que lo aprendido sobre tarjetas se deprecia cerca de 10 % al mes (documento 07).

### Capa 2: el pulso de quincena (el hábito)

Un ritual de dos minutos el día de pago:

1. Cuánto entró.
2. Qué ya está comprometido (lo fijo y lo que decidió antes).
3. Cuánto le queda libre por día hasta el próximo pago.
4. Una sola cosa nueva: la lección o el paso que toca.

Es el equivalente a la racha de Duolingo, con la unidad correcta: quincenas al día, no días seguidos. Un año son 24 pulsos.

Supuesto por validar: que la gente quiera este ritual. Si no, el producto queda solo con las capas 1 y 3, que es viable pero se usa menos.

### Capa 3: a demanda

Dos entradas siempre abiertas:

- **"Me llegó esto":** sube cualquier documento (extracto, carta del fondo, oferta de crédito, contrato) y el producto se lo explica.
- **Preguntar:** cualquier duda, en privado.

Es el uso de mayor intención: la persona llega sola porque tiene una decisión enfrente. También resuelve la condición C1 del documento 02 (no tener a quién preguntar).

## 4. Un año de Valentina

Suponiendo que entra el 15 de noviembre de 2026, con salario mensual y sin tarjeta todavía.

| Fecha | Qué pasa | Minutos |
|---|---|---|
| 15 nov | Sube su desprendible. Lo entiende y ve su línea de tiempo | 5 |
| 30 nov | Primer pulso de pago. Arma su plan del mes | 3 |
| Fin de nov | Plan de la prima | 5 |
| 19 dic | Recordatorio: "mañana llega tu prima, este es tu plan" | 1 |
| 30 dic | Pulso de pago | 2 |
| Mediados de ene | "Te van a llegar intereses de cesantías": qué son | 3 |
| Feb | Cesantías consignadas: en qué fondo están y para qué sirven | 4 |
| Cuando pase | "El banco me ofreció una tarjeta": la analiza antes de aceptar | 6 |
| Cada fin de mes | Pulso de pago | 2 |
| Mayo | Plan de la prima de junio, ya con historial | 3 |

Son unas 20 a 25 sesiones en el año y cerca de una hora en total. Si con una hora al año la persona decidió dos primas, entendió sus cesantías y evaluó una tarjeta antes de aceptarla, el producto cumplió.

## 5. Por dónde llega: WhatsApp como puerta, web como cuerpo

Es la decisión de forma más importante y la dejo como recomendación a probar.

**Propuesta:** los avisos y la entrada de documentos ocurren en WhatsApp; cada aviso abre una lección web interactiva. Sin instalar nada.

**A favor:**

- En un producto que se usa dos a cuatro veces al mes, una app instalada se olvida. WhatsApp ya está abierto todos los días.
- Rappi obtuvo 71 % de lectura por WhatsApp (documento 06). Las notificaciones de una app no se acercan a eso.
- Mandar una foto de un documento por WhatsApp es un gesto que todo el mundo ya sabe hacer.
- Los tres ICP usan WhatsApp.
- Para el entregable del programa ya se iba a construir en web.

**En contra:**

- Enviar mensajes iniciados por la empresa en WhatsApp tiene costo por mensaje y reglas de la plataforma. Para Colombia en 2026, las guías de proveedores ubican el mensaje de utilidad (avisos ligados a algo que la persona pidió) cerca de 0,0008 dólares y el de marketing entre 0,0125 y 0,03 dólares ([Engagelab](https://www.engagelab.com/es_ES/blog/whatsapp-business-api-pricing), [Chattigo](https://blog.chattigo.com/whatsapp-business/cuanto-cobra-whatsapp-business-por-mensaje)). Las fuentes no coinciden entre sí ni en si las respuestas dentro de las 24 horas siguen gratis, y ninguna es la página oficial de Meta. Como orden de magnitud: 30 avisos de utilidad al año por persona costarían unos centavos de dólar; el costo no es el obstáculo.
- Mandar un desprendible por WhatsApp puede generar más desconfianza que subirlo a una app. Hay que probarlo.
- Las diez interacciones del documento 08 no caben dentro del chat; por eso la lección vive en la web.
- Una app instalada da presencia de marca y notificaciones propias.

**Regla tomada de Duolingo:** proteger el canal. Pocos mensajes, cada uno ligado a un evento real de la persona. Un mensaje genérico de "vuelve a aprender" quema el canal, y los recordatorios genéricos tampoco funcionan (documento 07).

## 6. Qué ve la persona

Cuatro lugares. Ninguno es un mapa de lecciones.

1. **Mi línea de tiempo.** La pantalla principal: lo que viene en su plata, con fecha y monto. "En 12 días: tu prima, cerca de $900.000. Plan listo." Hacia atrás, lo que ya decidió.
2. **El momento.** La lección de cinco minutos del documento 08, abierta desde un evento.
3. **Mis documentos.** Lo que ha subido, ya explicado: su desprendible desglosado, su extracto, su fondo.
4. **Preguntar y "me llegó esto".**

**El progreso** no son puntos de experiencia. Son dos cosas que la persona puede contar: decisiones tomadas ("ya decidí mi prima", "ya sé cuánto debo") y documentos que ya entiende. Las mecánicas de juego de Duolingo (ligas, gemas) no las propongo al inicio: sus dos fracasos vinieron de copiar mecánicas sin la razón que las hacía funcionar, y aquí no hay práctica diaria que premiar.

## 7. Cómo se mide

Tomando el método de Duolingo de escoger la métrica con cabeza y no por costumbre:

- **Métrica principal: decisiones tomadas con plan, por persona y por mes.** Coincide con lo que la evidencia dice que importa (conducta, no conocimiento).
- **Retención por evento:** de quienes hicieron el pulso de una quincena, cuántos hacen el siguiente; de quienes vieron un extracto, cuántos vuelven con el próximo.
- **Activación:** cuántos suben un documento en la primera sesión y llegan a ver algo de su plata que no sabían.
- **Lo que no se mide como éxito:** usuarios activos diarios, tiempo en la app, lecciones completadas. Son las métricas de vanidad que el grupo acordó evitar.

Queda por resolver cómo comprobar la conducta fuera de la app (si de verdad pagó el total). Al inicio será lo que la persona reporte; más adelante, el siguiente extracto que suba lo muestra.

## 8. Los datos a futuro: finanzas abiertas

El Decreto 368 del 7 de abril de 2026 volvió obligatorio el sistema de finanzas abiertas para las entidades vigiladas por la Superintendencia Financiera: con autorización previa, expresa e informada de la persona, sus datos financieros pueden compartirse con terceros. Confirmé el decreto en el Diario Oficial que ya estaba en la carpeta de fuentes del entregable 02.

Según resúmenes jurídicos, la Superintendencia debía publicar un cronograma de estándares dentro de los seis meses siguientes y tiene hasta 12 meses por categoría de datos ([Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/04/nuevo-decreto-incorpora-el-sistema-de-finanzas-abiertas-en-colombia), [Centro de Estudios Regulatorios](https://www.cerlatam.com/normatividad/minhacienda-decreto-368-de-2026-07-abr-26/)). Ese plazo vencía el 7 u 8 de octubre de 2026. Hay un proyecto de decreto, pedido por la propia Superintendencia, para ampliarlo a doce meses, hasta abril de 2027 ([AFIC](https://afic.com.co/finanzas-abiertas-proyecto-propone-ampliar-los-plazos-de-implementacion/)). No pude confirmar si la prórroga se expidió ni si el cronograma salió. Los requisitos para ser tercero receptor de datos están en un proyecto de circular de la Superintendencia que no leí; las entidades no vigiladas podrían participar de forma voluntaria.

Qué significa: leer documentos es el puente de hoy. En uno o dos años podría existir una vía para recibir los movimientos de la persona con su permiso y sin claves, lo que resolvería el dolor D3 (en qué se me va la plata) sin registro manual. Vale la pena que alguien del grupo lo siga.

## 9. Qué hay que probar primero

En orden de riesgo:

1. Si la gente entrega su desprendible o su extracto, y por cuál canal con más confianza.
2. Si vuelve en el siguiente evento sin que se le insista.
3. Si el pulso de quincena le sirve o le estorba.
4. Si la lección interactiva cambia una decisión real (qué hizo con la prima de diciembre).

Las pruebas 1 y 4 se pueden hacer este mismo diciembre con el flujo del documento 05.
