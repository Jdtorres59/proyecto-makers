# Decisiones

Una entrada corta por decisión: qué, por qué y qué la haría cambiar. Las nuevas van arriba.

## 2026-11-16 · Despliegue y Bedrock

**La API va a Vercel empaquetada con esbuild.** Los paquetes del monorepo son TypeScript sin compilar, con imports sin extensión: Node no los corre tal cual y el compilador de Vercel tampoco los resuelve. Un solo `dist/server.js` evita depender de cómo Vercel trate el monorepo. Cambia si los paquetes pasan a compilarse por su cuenta.

**Bedrock por el endpoint `bedrock-mantle` con variables propias** (`BEDROCK_REGION`, `BEDROCK_AWS_ACCESS_KEY_ID`, `BEDROCK_AWS_SECRET_ACCESS_KEY`), no `AWS_REGION` ni `AWS_ACCESS_KEY_ID`. Vercel puede poner esas en la función con valores que no sirven como credenciales, y el SDK las tomaría sin avisar. Si falta algo, la API no arranca.

**Los IDs de modelo de Bedrock se pueden fijar por variable** (`BEDROCK_MODELO_PRINCIPAL`, `BEDROCK_MODELO_ECONOMICO`), porque dependen de lo que tenga habilitado la cuenta. Por defecto, `anthropic.` más el ID de `modelos.ts`.

**Opus 5.5 sigue de predeterminado; Haiku 5.5 queda como `economico` para pruebas** (`AI_MODELO=economico`). Pasar un agente o el predeterminado a Haiku se decide con `pnpm eval` contra el modelo real, comparando los dos. No se decide por precio: leer un desprendible mal cuesta más que la diferencia. Los casos de `evals/casos.json` corren con cualquier modelo (`AI_MODELO=economico AI_PROVIDER=bedrock pnpm eval`), así que no hizo falta un caso nuevo.

**CORS por lista de orígenes** (`ORIGENES_PERMITIDOS`; por defecto `http://localhost:8081`). Va antes de la sesión, porque la consulta previa del navegador no lleva token.

## 2026-11-15 · Backend de Luca 1.0

**Las cuentas leen sus cifras legales de `conocimiento` en la fecha de la cuenta y fallan si no hay norma vigente.** `core` depende de `conocimiento`. Mejor un error que una cifra vieja.

**`Deuda` gana `diaDePago` opcional.** Sin él no hay fecha para la cuota en "Lo que viene". Es opcional para no romper datos de muestra; una deuda sin día no genera evento.

**Prima y cesantías se proyectan al final del periodo** suponiendo que la persona sigue en el mismo trabajo, como en el prototipo. Las cesantías se muestran el 14 de febrero (la ley dice "antes del 15"), no el 15 como el prototipo.

**Sin auxilio de transporte por ahora.** Su valor de 2026 quedó enredado con la suspensión del decreto del salario mínimo y no se confirmó en fuente oficial. Con salario hasta 2 SMMLV los montos van en null en vez de salir mal. Cambia cuando una persona cargue la norma.

**Pagar el mínimo se modela como diferir a 36 cuotas**, el supuesto del prototipo. El mínimo real lo da el extracto.

**Salida estructurada para leer y explicar documentos** (`output_config.format`, disponible también en Bedrock), validada otra vez con zod. Si no cumple, la ejecución queda en error y la ruta responde 502.

**La conversación de una decisión no se guarda en el servidor.** La app manda el historial en cada turno; el servidor arma el contexto con el perfil y las lecturas. Cambia si hace falta retomar una conversación en otro dispositivo.

**"Borrar todo" borra también `ai_runs` y `events`**, porque guardan lo que la persona escribió. Conserva la cuenta y `consents` como prueba de la autorización. Efecto: borrar reinicia el tope diario de gasto.

## 2026-11-15 · Luca 1.0

**El producto es Luca y la 1.0 sale del prototipo cálido.** El equipo eligió el tono cálido (maíz y tinta, Bricolage Grotesque). El prototipo es la base de flujos, no el techo del diseño: la 1.0 debe verse bastante mejor. "Luca" es nombre de trabajo.

**Luca lleva un personaje propio y una biblioteca de ilustraciones.** La moneda con tajada no puede ser el único recurso gráfico. Se toma de EZ (app anterior de Juan David) la mascota con poses, la portada ilustrada por tema y las medallas; estas últimas se ganan con la acción de cada módulo, no con un quiz.

**Sin racha diaria ni registro de gastos.** Luca gira alrededor de las fechas de la plata de la persona ("Lo que viene"), no de entrar todos los días, y no es una central bancaria. Cambiaría si el equipo ve que hace falta un motivo de regreso diario.

**"Aprender" muestra el núcleo de 12 módulos**, no los 28 del prototipo. Un módulo con cifras sin verificar por una persona va con `publicado: false` y la app lo muestra bloqueado.

**Primero lo visual, después el contenido.** Los 12 módulos se escriben cuando el diseño de la app esté aprobado.

**Los contratos entre app y API viven en `packages/core/src/esquemas.ts`.** La app arma sus datos de muestra con esos tipos y la API responde con ellos, para que las dos se construyan en paralelo.

**La regla 8 (la IA no recomienda productos) sigue vigente.** La opción de nombrar productos de inversión como hechos espera al equipo y a un abogado.

**Proveedor de modelo sin confirmar.** Se construye contra el proveedor simulado; la propuesta es Amazon Bedrock con créditos.

## 2026-11-14 · Base técnica

**App móvil multiplataforma con Expo.** El equipo quiere una app de teléfono para iOS y Android y probarla en sus propios celulares. Expo da un solo código en TypeScript. Cambiaría si el producto termina siendo sobre todo WhatsApp o web.

**Servidor aparte (`apps/api`) en vez de rutas dentro de la app o funciones de Supabase.** La llave del modelo no puede ir en el celular y el ciclo de agente necesita Node y ejecuciones largas. Costo: una pieza más que desplegar. La opción más simple (todo dentro de Expo) se descartó a conciencia.

**SDK oficial de Anthropic, sin frameworks de agentes.** El ciclo de herramientas son unas 100 líneas propias en `ejecutar.ts`. Se usan solo funciones disponibles también en Amazon Bedrock (mensajes, streaming, herramientas), porque el proveedor de créditos no está definido. Se evita Files API, Batches, Managed Agents y búsqueda web, que Bedrock no ofrece.

**Modelo por defecto `claude-opus-5-5` con esfuerzo `medium`.** Vive en `modelos.ts`. Bajar a un modelo más barato o cambiar el esfuerzo se decide corriendo los evals contra el modelo real, no a ojo.

**Sin modo estricto en las herramientas.** No se pudo probar contra la API qué acepta el modo estricto del esquema. Cada entrada se valida con zod antes de ejecutar. Revisar cuando haya llave.

**Sin respaldo automático ante rechazos del modelo.** La API de Anthropic permite reintentar en otro modelo cuando un filtro de seguridad rechaza una solicitud, pero Bedrock no lo ofrece del lado del servidor. Por ahora un rechazo queda registrado con estado `rechazo` y la app muestra un aviso. Revisar cuando se escoja proveedor.

**Registro propio en `ai_runs` en vez de una plataforma de trazas.** Una tabla basta para costo, auditoría y evals, y los datos quedan en nuestra base. Cambiaría cuando se necesite ver trazas paso a paso o comparar prompts en una interfaz.

**`ai_runs` guarda el texto de entrada y de salida.** Hace falta para evals y para entender el uso. Es información sensible: la protege RLS y solo la escribe el servidor. Queda pendiente decidir cuánto tiempo se conserva.

**Tope de gasto por usuario y por día** (`TOPE_DIARIO_USD`, 0,50 por defecto). Evita que un error o un abuso consuma los créditos.

**Tres formas de entrar: Google, Apple o código al correo. Ninguna usa contraseña.** Lo pidió Juan David el 14 de noviembre como punto de partida. Google y Apple abren el navegador seguro del sistema y la app canjea un código de un solo uso (PKCE), así que funcionan en iOS, Android y web sin módulos nativos. Sumar otro proveedor de Supabase es una línea en `login.tsx`. Si se publica en la App Store con Google, Apple exige ofrecer también el ingreso con Apple, que ya está.

**Plata como entero en pesos.** Sin decimales, para no arrastrar errores de punto flotante.

**Una norma vencida rompe el CI a propósito.** Mostrar una cifra legal vieja es peor que un CI en rojo. Cada enero habrá que cargar el salario mínimo nuevo.

**Sin ejecución durable, memoria de usuario, búsqueda semántica, notificaciones ni panel de administración.** Dependen de decisiones de producto que no se han tomado.
