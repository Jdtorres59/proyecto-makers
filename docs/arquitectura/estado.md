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
| 3 | App con datos de muestra | Primera tanda hecha (login a inicio, rama `claude/app-v1-020a11`). Falta la segunda: Aprender, Documentos, Sobre mí, prima y decisión |
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

3. Correr los evals contra el modelo real cuando haya llave (`AI_PROVIDER=bedrock pnpm eval`, con las variables de Bedrock en el entorno).
4. Auxilio de transporte: con salario hasta 2 SMMLV, `eventosDePlata` devuelve los montos en null porque la norma de 2026 no se confirmó. Es justo el rango de mucha gente de la persona foco.
5. Que una persona verifique las normas y cambie `verificadoPor`.

## Despliegue de la API en Vercel (listo, sin desplegar)

La API sale como una sola función de Vercel. `pnpm build` en `apps/api` empaqueta `src/index.ts` con esbuild en `dist/server.js`: los paquetes `@makers/*` son TypeScript sin compilar y Vercel no los ejecutaría tal cual. `hono` queda por fuera del paquete porque Vercel busca el archivo de entrada por la línea `from "hono"`. `apps/api/vercel.json` fija el preset Hono, el build y la carpeta `dist`. `pnpm dev:api` no cambia.

Comprobado en local: el `dist/server.js` empaquetado, servido con Node 24, pasó el recorrido completo contra `makers-dev` con el proveedor simulado. Incluye NDJSON de `/ai/run` y de `conversar`, la consulta previa de CORS y la limpieza en cero. No se ha desplegado.

**Pasos para desplegar** (quien tenga la cuenta de Vercel):

1. En Vercel: Add New > Project > importar el repo de GitHub.
2. **Root Directory: `apps/api`**. Framework: Hono (lo toma de `vercel.json`). Build, Output e Install: dejar lo que trae `vercel.json` y lo que detecta Vercel (pnpm, por el `pnpm-lock.yaml` de la raíz).
3. Rama de producción: la que se vaya a publicar (hoy `v1`).
4. Variables de entorno (Settings > Environment Variables), solo en el panel y nunca en el repo:
   - `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (marcar como Sensitive)
   - `AI_PROVIDER=bedrock`, `BEDROCK_REGION`
   - `BEDROCK_AWS_ACCESS_KEY_ID` y `BEDROCK_AWS_SECRET_ACCESS_KEY` (Sensitive), o `AWS_BEARER_TOKEN_BEDROCK`
   - Opcionales: `BEDROCK_MODELO_PRINCIPAL` y `BEDROCK_MODELO_ECONOMICO` (si la cuenta usa otro ID), y `AI_MODELO=economico` mientras se prueba barato
   - `TOPE_DIARIO_USD` (por ejemplo `0.5`)
   - `ORIGENES_PERMITIDOS`: la URL pública de la app web, separadas por comas si son varias
   - `ENABLE_EXPERIMENTAL_COREPACK=1`, para que Vercel use la versión de pnpm de `packageManager`
5. Deploy. Revisar `https://<dominio>/health`: debe responder `{"ok":true,"proveedor":"bedrock"}`.
6. En la app web, `EXPO_PUBLIC_API_URL` apunta a ese dominio.

**Límites de Vercel que importan:**
- Una función dura máximo 300 s en Hobby (Pro: 300 s por defecto, configurable hasta 800 s). El streaming cuenta dentro de ese tiempo. Una conversación larga con varias rondas de herramientas en Opus podría acercarse; si pasa, se sube `maxDuration` en Pro o se baja el esfuerzo.
- El cuerpo de una petición no puede pasar de 4,5 MB. No afecta a los documentos, porque la app los sube directo a Supabase y la API los descarga.
- La función corre en `iad1` (us-east-1) por defecto, la misma región de Supabase.

**Prueba de humo del modelo real** (una sola llamada, cuesta unos centavos):

```bash
pnpm --filter @makers/api humo
```

Lee `apps/api/.env`. Llama una vez a `leer_documento` con `evals/fixtures/desprendible-ficticio.pdf` e imprime proveedor, modelo, estado, tokens y costo; si falla, también el error. No escribe en la base.

## Proyecto de Supabase

`makers-dev`, referencia `wktftxvnflgelkgrdkfy`, región us-east-1, en la organización personal de Juan David. La URL y la llave publicable van en `apps/mobile/.env`; la llave secreta, en `apps/api/.env`.

## Qué falta para que corra de punta a punta

1. **Activar Google y Apple en Supabase** (Authentication > Sign In / Providers). Google pide un cliente OAuth creado en Google Cloud; Apple pide un Services ID y una llave de la cuenta de Apple Developer. En ambos, la URL de retorno es `https://wktftxvnflgelkgrdkfy.supabase.co/auth/v1/callback`.
2. **Agregar las URL de regreso** en Authentication > URL Configuration: `makers://**`, `http://localhost:8081/**` y, mientras se use Expo Go, `exp://**`.
3. **Correo de login.** La plantilla "Magic Link" de Supabase (Authentication > Emails) debe incluir el código `{{ .Token }}`; por defecto solo manda un enlace. Además, el correo por defecto de Supabase solo entrega a miembros del proyecto y tiene límite por hora: para personas externas hay que configurar un proveedor de correo (SMTP).
4. **Llave secreta de Supabase** en `apps/api/.env` (Project Settings > API Keys). Ya está puesta en la copia principal y la API arrancó con ella.
5. **Probar el flujo completo en un celular.** Login, autorización, streaming en el teléfono y valoración nunca se han ejecutado con una sesión real.
6. **Llave del modelo.** Será Amazon Bedrock (endpoint `bedrock-mantle`, IDs `anthropic.claude-*`). La rama de Bedrock en `proveedor.ts` está revisada contra la documentación vigente y probada solo en la construcción del cliente: ninguna llamada real se ha hecho. Primer paso con credenciales: `pnpm --filter @makers/api humo`. Los evals solo han corrido contra el proveedor simulado.
7. **Despliegue.** API lista para Vercel (ver "Despliegue de la API en Vercel"), sin desplegar. Builds de la app con EAS, sin hacer.
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
