# Estado

Documento de relevo. Quien termina una tarea lo actualiza para que la siguiente persona o agente sepa dónde va el trabajo.

Última actualización: 15 de noviembre de 2026 (rama `v1`; backend en `claude/backend-v1-0eae5c`).

## Luca 1.0: en qué paso va

Plan de siete pasos. La rama `v1` ya tiene la base técnica, el prototipo y el currículo.

| Paso | Qué | Estado |
|---|---|---|
| 0 | Rama `v1`, contratos en `packages/core/src/esquemas.ts` | Hecho |
| 1 | Dirección visual y personaje | Hecho: Semilla · Grabado, ver `DESIGN.md` |
| 2 | Biblioteca de assets en `apps/mobile/assets` | Parcial: 3 poses, desprendible y 20 íconos. El resto espera a la generación de imágenes |
| 3 | App con datos de muestra | Dos tandas hechas en `claude/app-v1-020a11`: bienvenida, inicio, Aprender con lecciones, prima, documentos, decisión y Sobre mí. Falta conectar la API (paso 5) |
| 4 | Backend: cuentas, tablas, agentes y rutas | Hecho y fusionado en `v1`. Migración `20261115000000_luca.sql` aplicada en `makers-dev` el 15 de noviembre: avisos de seguridad en cero y prueba de aislamiento entre dos usuarios (revertida) |
| 5 | Conectar app y API | Pendiente |
| 6 | Contenido de los 12 módulos | Pendiente |
| 7 | Pulido y verificación | Pendiente |

## Qué funciona y cómo se comprobó

| Pieza | Estado | Cómo se comprobó |
|---|---|---|
| Monorepo, tipos | Listo | `pnpm typecheck` limpio en los cinco paquetes |
| `packages/core`, `conocimiento`, `ai` | Listo | `pnpm test`: 47 pruebas en todo el repo. Las cuentas cuadran con el prototipo (neto 3.312.000, prima y cesantías 900.000, intereses 27.000) |
| API | Rutas de Luca 1.0 probadas contra `makers-dev` | Pruebas de cada ruta con dobles en memoria, y el 15 de noviembre un recorrido por HTTP con `index.ts` real y el proveedor simulado: perfil, eventos, subir y leer un PDF, explicarlo, progreso, decisión completa, aislamiento entre dos usuarios y `DELETE /yo`. Todo pasó sin cambios de código; los usuarios de prueba se borraron |
| Evals | Arnés listo | `pnpm eval`: 7 casos contra el proveedor simulado, uno o más por agente |
| App | Primera tanda de Luca 1.0 con datos de muestra | Recorrida en el simulador de iOS (iPhone 17 Pro, Expo Go) de login a inicio, en claro y oscuro y con letra grande; login también en web a 375 px. Capturas en `apps/mobile/capturas/`. Nunca con una sesión real ni en un celular físico |
| Base de datos | Aplicada en `makers-dev` | Migración aplicada, avisos de seguridad de Supabase en cero, y prueba con dos usuarios: ninguno lee ni escribe filas del otro, y la app no puede insertar en `ai_runs` |
| Login | Pantalla lista con Google, Apple y correo, **sin probar un ingreso real** | La pantalla se vio en web. El correo está activo en Supabase; Google y Apple responden "provider is not enabled" porque faltan sus credenciales |

## App de Luca 1.0 (primera tanda)

**Cimientos** (`apps/mobile/src`): tokens de `DESIGN.md` en `constants/tema.ts` (color claro y oscuro, tipo, forma, movimiento); Bricolage Grotesque con `@expo-google-fonts/bricolage-grotesque` y cifras tabulares; `lib/assets.ts` indexa la biblioteca por los nombres de `DESIGN.md` con `require.context`, así una imagen nueva entra sin tocar pantallas (mientras falta, pinta la pieza de `grabado/` que le toca); `lib/datos/` tiene la interfaz `FuenteDeDatos` y la de muestra (Valentina), con toda cifra calculada por `packages/core`. Para conectar la API (paso 5) se cambia la fuente en `lib/datos/contexto.tsx`.

**Componentes:** botón impreso (principal, secundario, tinta, texto), chip, tarjeta, burbuja de Luca que habla palabra por palabra, renglón de documento, fila editable en línea, "Lo que viene", tajadas de progreso, hoja inferior con arrastre, campo, wordmark (SVG de diseño), cifra que rueda, celebración con confeti de grabado, grano de papel, barra de pestañas con ficha deslizante. Reanimated respeta "Reducir movimiento"; háptica en avanzar, elegir y celebrar.

**Pantallas:** login (misma lógica de Supabase), autorización, conocerte, leyendo, confirmar con edición, tres preguntas, listo, inicio y pestañas Aprender, Documentos y Sobre mí con pantallas mínimas honestas. Se quitó la prueba interna de IA del flujo.

**Modo de muestra:** solo en desarrollo, mantener presionado el nombre `luca` en el login entra sin cuenta con los datos de muestra. No existe en un build de producción (`__DEV__`).

**Navegación:** `_layout.tsx` calcula la primera pantalla de cada estado (sin sesión, sin autorización, conociéndote, adentro) y reemplaza la pila al cambiar. `Stack.Protected` de Expo Router 58 lanzaba `ROUTE_NAMES_CHANGED` sin manejar al proteger un grupo con Stack propio o pantallas sueltas; revisar al subir de versión.

**Contraste medido** (script WCAG sobre los tokens, también con el píxel más oscuro del grano): todo texto pasa 4,5:1 en ambos modos; el peor es `sobreVerde` sobre verde en claro, 5,17:1 (4,60:1 bajo el grano). El nombre en el login mide 13,56:1 en claro y 15,26:1 en oscuro.

**Falta:** segunda tanda; selector de archivos real y subida al bucket; inicio no se vio a 375 px (solo el login); no se probó con VoiceOver; ícono de app sigue siendo el de Expo.

## App de Luca 1.0 (segunda tanda)

**Ajustes de la primera:** en oscuro, Luca de 160 pt o menos se apoya en un sello redondo de papel claro con borde maíz (el halo no alcanzaba para brazos y piernas); login reequilibrado, sin hueco abajo; el contenido termina con aire sobre el botón fijo; botones de Google (blanco en claro, #131314 en oscuro) y Apple (negro en claro, blanco en oscuro) con su logo; poses nuevas donde dicen algo (`lee`, `piensa`, `atento`, `sorprendido`, `pulgar`, `muestra`, `espera`).

**Pantallas nuevas:** Aprender con los 12 módulos como camino (portada, medalla, candado si `publicado: false`, Luca creciendo con `crecimiento/`), ficha de módulo, reproductor de lección que pinta los ocho tipos de `Paso` con respuesta inmediata, háptica, celebración y medalla al cumplir la acción; lección de la prima (apuesta, cuenta, orden, reparto, plan) con los números de la persona; Documentos (lista, subir otro, documento explicado con renglones que se abren); decisión (chat, dos papeles, lectura, adivinar, comparador con plazos que recalculan con `costoTarjeta`, `costoPagoMinimo` y `costoPrestamo`, elegir y justificar, cierre); Sobre mí editable y "borrar todo" con confirmación.

**Contenido:** el único punto de carga es `fuente.modulos()`, que hoy llama a `modulosPara(perfil, hoy)` de `@makers/contenido`. Todos los módulos vienen con `publicado: false`; **en desarrollo hay un interruptor en Aprender ("abrir los módulos sin publicar") que viene encendido** y deja recorrer el módulo 2. No existe en producción. También en desarrollo, "ver los ocho tipos de paso" abre una lección de prueba con todos los tipos, porque el contenido real aún no usa `comparar`.

**Verificado en el simulador de iOS (iPhone 17 Pro):** recorrido completo en oscuro (login a decisión, lecciones, medalla, borrar todo) y las pantallas principales en claro; 51 capturas en `apps/mobile/capturas/tanda-2/`. Contraste: los colores nuevos salen de los mismos tokens ya medidos (peor texto 5,17:1).

**No verificado:** VoiceOver; Android; pantallas de 375 pt; letra grande en las pantallas nuevas; un botón dentro de una hoja con el campo enfocado a veces pide dos toques en el simulador.

## Backend de Luca 1.0

**Cuentas** (`packages/core/src/cuentas.ts`): neto del mes, prima, cesantías e intereses en año de 360 días, tarjeta diferida, pago mínimo (supuesto: 36 cuotas), préstamo de cuota fija con seguro, porcentaje del sueldo y `eventosDePlata(perfil, hoy)`. Leen las cifras legales de `conocimiento` en la fecha de la cuenta.

**Normas** (`packages/conocimiento`): aportes del empleado a salud y pensión, Fondo de Solidaridad Pensional, fechas de pago de prima, cesantías e intereses, tasa de intereses de cesantías y tasa de usura de noviembre de 2026. Todas con fuente oficial y **pendientes de verificación de una persona**. La usura vence el 30 de noviembre: el 1 de diciembre el CI se pone en rojo hasta cargar la nueva.

**Rutas** (`apps/api/src/app.ts`, todas con sesión):

| Ruta | Qué hace |
|---|---|
| `GET /perfil`, `PUT /perfil` | Lee y guarda el `PerfilFinanciero` (las deudas se reemplazan completas) |
| `POST /documentos/:id/leer` | Lee con IA un documento ya subido al bucket y registrado en `documents`; devuelve `DocumentoLeido` |
| `GET /documentos/:id` | La lectura guardada |
| `POST /documentos/:id/explicar` | Llena `explicacion` en cada renglón |
| `GET /eventos` | `EventoDePlata[]` de "Lo que viene" |
| `GET /progreso`, `POST /progreso` | Lee y suma lecciones y medallas |
| `POST /decisiones` | Crea una decisión con la pregunta |
| `POST /decisiones/:id/conversar` | Conversación con `acompanar_decision` (NDJSON como `/ai/run`); la app manda el historial y los documentos sumados |
| `POST /decisiones/:id/cerrar` | La persona registra su camino, motivos y nota |
| `DELETE /yo` | Borra todo lo que Luca sabe de la persona (conserva la cuenta y las autorizaciones) |

Las rutas con IA respetan el tope diario.

**Falta para el backend:**

3. Correr los evals contra el modelo real cuando haya llave (`AI_PROVIDER=anthropic pnpm eval`).
4. Auxilio de transporte: con salario hasta 2 SMMLV, `eventosDePlata` devuelve los montos en null porque la norma de 2026 no se confirmó. Es justo el rango de mucha gente de la persona foco.
5. Que una persona verifique las normas y cambie `verificadoPor`.

## Proyecto de Supabase

`makers-dev`, referencia `wktftxvnflgelkgrdkfy`, región us-east-1, en la organización personal de Juan David. La URL y la llave publicable van en `apps/mobile/.env`; la llave secreta, en `apps/api/.env`.

## Qué falta para que corra de punta a punta

1. **Activar Google y Apple en Supabase** (Authentication > Sign In / Providers). Google pide un cliente OAuth creado en Google Cloud; Apple pide un Services ID y una llave de la cuenta de Apple Developer. En ambos, la URL de retorno es `https://wktftxvnflgelkgrdkfy.supabase.co/auth/v1/callback`.
2. **Agregar las URL de regreso** en Authentication > URL Configuration: `makers://**`, `http://localhost:8081/**` y, mientras se use Expo Go, `exp://**`.
3. **Correo de login.** La plantilla "Magic Link" de Supabase (Authentication > Emails) debe incluir el código `{{ .Token }}`; por defecto solo manda un enlace. Además, el correo por defecto de Supabase solo entrega a miembros del proyecto y tiene límite por hora: para personas externas hay que configurar un proveedor de correo (SMTP).
4. **Llave secreta de Supabase** en `apps/api/.env` (Project Settings > API Keys). Ya está puesta en la copia principal y la API arrancó con ella.
5. **Probar el flujo completo en un celular.** Login, autorización, streaming en el teléfono y valoración nunca se han ejecutado con una sesión real.
6. **Llave del modelo.** Sin definir (Anthropic directo o Amazon Bedrock). Ninguna llamada real al modelo se ha hecho: los evals solo han corrido contra el proveedor simulado, que sigue un guion y no dice nada sobre la calidad de las respuestas. La rama de Bedrock en `proveedor.ts` está escrita según la documentación y sin probar.
7. **Despliegue.** API en Vercel y builds de la app con EAS, sin hacer.
8. **Texto de autorización de datos.** Es un borrador de trabajo, no un texto legal.
9. **CI.** El flujo de GitHub Actions está escrito y no ha corrido todavía.

## Preguntas abiertas para el equipo

La base las deja abiertas a propósito. Cada una indica qué toca cuando se responda.

1. ¿Qué tiene que saber el producto de una persona para servirle, y de dónde lo saca? (tablas nuevas, `packages/core`)
2. ¿Qué hace el producto cuando la persona no lo está mirando? (ejecución durable, notificaciones, canal)
3. ¿Qué respuesta de la IA sería inaceptable? Cada una se vuelve un caso en `evals/casos.json`.
4. ¿Quién responde por que una norma esté al día? (`packages/conocimiento`)
5. ¿Qué evento de uso les diría que la persona aprendió o decidió algo? (tabla `events`)
6. ¿Cuánto están dispuestos a gastar por usuario al mes en modelo? (`TOPE_DIARIO_USD`, `modelos.ts`)
7. ¿Cuánto tiempo se conserva lo que la gente escribe y sube? (`ai_runs`, bucket `documentos`)
