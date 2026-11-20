# Estado

Documento de relevo. Quien termina una tarea lo actualiza para que la siguiente persona o agente sepa dónde va el trabajo.

Última actualización: 16 de noviembre de 2026 (rama `v1`; primer despliegue a producción).

## Pendiente al 16 de noviembre de 2026

Web publicada y conectada a la API: https://luca-demo-delta.vercel.app (ingreso real más "Probar sin cuenta"). API: https://luca-api-flax.vercel.app. Detalle en "Producción".

Lo que falta para cerrar la app 1.0, en orden:

1. Hecho el 16 de noviembre: API desplegada, web conectada y primeras llamadas reales al modelo (ver "Producción").
2. Juan David: URL de la web agregada en Supabase el 20 de noviembre. Falta probar un ingreso real con Google y con código al correo. Apple está sin configurar.
3. Hecho el 20 de noviembre y fusionado en `v1`: pasada final (ver "pasada final"). La web la tiene: publicada el 20 de noviembre.
4. Build de iPhone, después de la web.

Contenido: 1 de 12 módulos escrito (prima y cesantías). Los otros 11 se escriben en `packages/contenido`, cada persona en su rama desde `v1` y con PR hacia `v1`, tocando solo `packages/contenido` y `packages/conocimiento`. No se edita `packages/core/src/esquemas.ts` desde esas ramas.

## Luca 1.0: en qué paso va

Plan de siete pasos. La rama `v1` ya tiene la base técnica, el prototipo y el currículo.

| Paso | Qué | Estado |
|---|---|---|
| 0 | Rama `v1`, contratos en `packages/core/src/esquemas.ts` | Hecho |
| 1 | Dirección visual y personaje | Hecho: Semilla · Grabado, ver `DESIGN.md` |
| 2 | Biblioteca de assets en `apps/mobile/assets` | Hecho: 12 poses, 5 etapas de crecimiento, 12 portadas, 12 medallas, 7 objetos, 4 escenas, 20 íconos SVG, ícono y arranque |
| 3 | App con datos de muestra | Dos tandas hechas en `claude/app-v1-020a11`: bienvenida, inicio, Aprender con lecciones, prima, documentos, decisión y Sobre mí. Falta conectar la API (paso 5) |
| 4 | Backend: cuentas, tablas, agentes y rutas | Hecho y fusionado en `v1`. Migración `20261115000000_luca.sql` aplicada en `makers-dev` el 15 de noviembre: avisos de seguridad en cero y prueba de aislamiento entre dos usuarios (revertida) |
| 5 | Conectar app y API | Hecho en `claude/app-v1-020a11`: fuente real contra la API, subida al bucket, modo demostración y web lista para Vercel (sin desplegar) |
| 6 | Contenido de los 12 módulos | 1 de 12 (prima y cesantías). Los otros 11 los escriben Ariel y Juan José |
| 7 | Pulido y verificación | Hecho el 20 de noviembre en `v1`, salvo Android y VoiceOver real |

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

## App de Luca 1.0: fase 4 (datos reales y web)

**Fuente de datos.** `lib/datos/api.ts` implementa `FuenteDeDatos` con el cliente tipado `hc<AppType>`: perfil, eventos, progreso, decisiones (crear, conversar con NDJSON, cerrar), `DELETE /yo` y documentos. Subir un documento: selector (`expo-document-picker`) o cámara (`expo-image-picker`), archivo al bucket privado `documentos` en `<user_id>/...`, fila en `documents`, `POST /documentos/:id/leer`, y `/explicar` al abrirlo. La lista de documentos sale de `documents` y `GET /documentos/:id`. El contenido de Aprender sigue saliendo de `@makers/contenido` en la app. `lib/datos/contexto.tsx` elige la fuente por sesión y se monta de cero al cambiar de persona o de modo.

**Modo demostración.** `EXPO_PUBLIC_MODO_DEMO=si` muestra "Probar sin cuenta" en el login (en desarrollo siempre está): sesión local con los datos ficticios de Valentina, sin tocar Supabase ni la API, y empieza de cero cada vez. Con cuenta real no hay datos ficticios: una cuenta nueva empieza vacía y pasa por conocerte; quien ya tiene salario guardado entra directo al inicio.

**Errores.** `lib/datos/errores.ts` traduce cada falla a `sin-conexion`, `tope` (429, mensaje propio), `sesion`, `archivo` o `servidor`, con texto llano. `components/problema.tsx` los muestra con `escenas/sin-conexion` o Luca atento, y "Intentar de nuevo". Carga inicial, lectura, explicación, subida, decisión, cierre y borrar todo tienen su estado de error.

**Confirmar lo leído** muestra los renglones tal como los leyó la API, con aviso cuando la confianza es media o baja, y se corrigen en el mismo lugar. Empresa, día de pago y fecha de ingreso se piden aparte (el desprendible real no los trae en renglones) porque sin ellos no hay fechas. En la decisión, si la lectura no trae saldo o tasas, la persona los escribe.

**Navegación.** `_layout.tsx` es una guarda: cada estado tiene sus rutas y, si la actual no es del estado, reemplaza la pila. Usa `setTimeout` y espera a `useRootNavigationState().key`, porque en web con la pestaña en segundo plano `requestAnimationFrame` no corre y el router procesaba la URL inicial después del primer reemplazo.

**Web.** `app.json` con `web.output: "single"` (SPA) y `apps/mobile/vercel.json` con install desde la raíz, `expo export -p web`, salida `dist` y reescritura de todas las rutas a `/`. En pantallas de 640 px o más, la app es una columna de teléfono centrada sobre el papel de la marca. `npx expo export -p web` sale sin errores (7 MB) y el paquete no lleva secretos.

**Recorrido con datos reales** (API local con `AI_PROVIDER=mock`, Supabase `makers-dev`, usuario `.test` creado y borrado al final, web a 375 px y a 1440 px): autorización, subida del PDF de `evals/fixtures` al bucket, lectura, confirmación con aviso de confianza y corrección, preguntas, inicio con prima de $900.000 calculada por la API, una lección (progreso guardado), decisión con conversación en streaming, dos papeles, datos faltantes escritos a mano, cierre guardado en `decisions`, y borrar todo: tablas y bucket en cero. Sin conexión: pantalla de problema y recuperación al volver la API. Capturas en `apps/mobile/capturas/fase-4/`.

**No verificado:** ingreso real con Google y con código al correo en el navegador (Google no está activo en Supabase; el código depende de la plantilla de correo), el tope 429 en vivo, la app nativa con la API (solo web), el modelo real (solo el simulado). Con la ventana de Claude sin mostrar, algunas transiciones de pantalla no terminaban en el navegador de pruebas; el contenido sí estaba y en pantalla visible funcionaron.

**Para publicar la web** (quien tenga la cuenta de Vercel): proyecto nuevo con Root Directory `apps/mobile` (toma `vercel.json`), `ENABLE_EXPERIMENTAL_COREPACK=1`, y las variables de `.env.example`: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_API_URL` (dominio de la API) y `EXPO_PUBLIC_MODO_DEMO`. En la API, `ORIGENES_PERMITIDOS` con el dominio de la web. En Supabase, Authentication > URL Configuration: el dominio de la web en Site URL y Redirect URLs (`https://<dominio>/**`), y activar Google si se va a usar.

**Falta:** el plan de la prima vive solo en el teléfono (la API no tiene dónde guardarlo); un enlace directo a una ruta interna funciona, pero si los datos todavía cargan, la persona ve el problema o el inicio primero.

## App de Luca 1.0: pasada final (20 de noviembre de 2026)

**Ícono y arranque.** iOS usa `assets/images/icon.png` (antes el `expo.icon` de la plantilla), Android el ícono adaptable sobre maíz `#D99A2B`, la web su favicon, y el arranque las piezas de `assets/marca/splash-*`.

**Accesibilidad.** En esta versión de RN-web `accessibilityState` no llega al DOM, así que la app usa props `aria-*` (`aria-selected`, `aria-checked`, `aria-expanded`, `aria-disabled`, `aria-busy`), que también sirven en iOS y Android. Además:
- Las opciones dicen "Correcta", "No es esta" o "Elegido", y el ordenar dice el puesto.
- El deslizador funciona con flechas, PageUp/PageDown e Inicio/Fin, y anuncia su valor.
- El reparto dice cuánto tiene cada destino.
- La hoja inferior tiene nombre, el velo no es un segundo "Cerrar" y el foco no sale de ella.
- Las imágenes decorativas están ocultas al lector y el foco visible es de 3 px.
- Las pantallas de fondo quedan fuera del orden del teclado.

Revisado en web con el árbol de accesibilidad: no hay controles sin nombre ni objetivos de menos de 44 px.

**Pantallas chicas.** De login al cierre de la decisión, incluidas las 4 lecciones de prima y los 8 tipos de paso, sin texto cortado ni scroll horizontal a 320 y 375 px. A menos de 360 px de ancho las etiquetas de las pestañas bajan a 12 pt. En web ancha la app va en una columna centrada.

**Contraste**, medido en el DOM con el color real sobre el fondo real:
- Mínimo en texto: 5,17:1 en claro y 6,42:1 en oscuro.
- La opción descartada subió de opacidad 0,55 a 0,7, porque en claro quedaba en 3,7:1 y ahora queda en 5,9:1.
- El maíz sobre fondo claro (2,1:1) solo se usa con contorno oscuro.
- `lineaSuave` solo se usa en bordes que no llevan información.

**Movimiento.** Revisado con los estándares de review-animations:
- La medalla entra desde 0,6 y no desde 0.
- La hoja sale con curva de cajón y no con ease-in.
- Lo demás cumple (pulsación de 160 ms o resorte, sacudida de 50 a 70 ms, resortes interrumpibles) y respeta "Reducir movimiento". No se agregaron animaciones nuevas.

**Anti plantilla.** Cero rayas largas, cero mayúsculas espaciadas, cero textos genéricos. Los errores hablan en la voz de Luca y dicen qué hacer, y el estado vacío de documentos tiene su escena. Se cambió "Irme a vivir sola" por "Vivir por mi cuenta". En el contenido del módulo de prima no hubo nada que reportar.

**Producción.** https://luca-demo-delta.vercel.app recorrida con "Probar sin cuenta" a 375 px, de login al cierre de la decisión: todo responde 200/304, sin errores de consola y sin llamadas a la API ni al modelo. En escritorio la columna está centrada. Esta versión todavía no tiene los arreglos de esta pasada.

**Letra del sistema al máximo** (iPhone 16e, accesibilidad XXXL, claro): recorrido completo en el simulador, del login al cierre de la decisión, pasando por una lección, documentos, Sobre mí y la prima. `useLetraGrande()` (`fontScale` de 1,6 o más) en `constants/tema.ts` reacomoda las filas que partían palabras ("desprendi/ble", "présta/mo", "$300.00/0"):
- La burbuja de Luca, la tarjeta de crecimiento y los módulos de Aprender ponen la imagen encima.
- En los renglones del documento, las filas editables, los caminos de la decisión y la comparación, el monto baja debajo de la etiqueta.
- "Nuevo" en Documentos baja debajo del título.
- La ilustración de "Subir mi desprendible" se oculta.
- Las fichas de tamaño fijo (PDF, números de orden, fecha de "Lo que viene", fecha en Listo) topan su texto, porque el dato también va en la etiqueta accesible.
- El encabezado "Lo que viene" envuelve y el estado de cada papel en la decisión usa dos líneas.

**No verificado:**
- Android: no hay SDK ni emulador en este Mac.
- VoiceOver real. Se revisó el árbol de accesibilidad en web.

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

## Producción (16 de noviembre de 2026)

Espacio de Vercel `juan-david-torres-casas-projects` (Hobby). Ningún dominio propio ni recurso de pago.

| Proyecto | URL | Root Directory | Variables de producción (solo nombres) |
|---|---|---|---|
| `luca-api` | https://luca-api-flax.vercel.app | `apps/api` | `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (secreta), `ANTHROPIC_API_KEY` (secreta), `AI_PROVIDER=anthropic`, `TOPE_DIARIO_USD`, `ORIGENES_PERMITIDOS` (la web y `http://localhost:8081`), `ENABLE_EXPERIMENTAL_COREPACK=1` |
| `luca-demo` | https://luca-demo-delta.vercel.app | `apps/mobile` | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_API_URL` (la API), `EXPO_PUBLIC_MODO_DEMO=si`, `ENABLE_EXPERIMENTAL_COREPACK=1` |

Sin `AI_MODELO`: todos los agentes usan el predeterminado, Haiku 5.5. Node 24 en ambos. Las dos construyen en Vercel desde el código (no se sube una carpeta ya exportada).

**Cómo volver a publicar** (no hay integración con GitHub, a propósito: ver `decisiones.md`). Desde una copia limpia del commit, para que no suba nada fuera de git:

```bash
D=$(mktemp -d) && git archive HEAD | tar -x -C "$D" && cd "$D"
vercel link --yes --scope juan-david-torres-casas-projects --project luca-api && vercel deploy --prod --yes
# para la web, en otra copia: --project luca-demo
```

`vercel link` crea un `.env.local` con un token temporal de Vercel en esa carpeta; se borra con la carpeta.

**Verificado:**

- API: `GET /health` da 200 con `{"ok":true,"proveedor":"anthropic"}`; `GET /perfil` sin token da 401; la consulta previa de CORS devuelve `access-control-allow-origin` para la web y para `http://localhost:8081`, y no lo devuelve para otro origen.
- Web: el paquete trae la URL de la API y la de Supabase, y ninguna llave secreta (lo que coincide con `sb_secret` es código de supabase-js). En el navegador a 375 px: carga el login, "Probar sin cuenta" recorre autorización, conocerte, confirmar, preguntas y listo hasta inicio con "Lo que viene"; consola sin errores. Una ruta interna (`/inicio`) responde 200.
- Primera llamada real (local, `pnpm --filter @makers/api humo` con `AI_PROVIDER=anthropic`): estado `ok`, `claude-haiku-5-5`, 3.491 tokens de entrada y 544 de salida, US$0,0006, 4,2 s. Los cuatro renglones coinciden con el PDF ficticio (salario 3.600.000, salud 144.000, pensión 144.000, neto 3.312.000), todos con confianza alta. `humo` ahora imprime la salida.
- Punta a punta contra producción, con un usuario `@luca.test` creado por la API de administración: autorización, perfil, subida del PDF al bucket con el token de la persona, lectura real (200, mismos cuatro renglones), confirmación, `GET /eventos` con sueldo 30 nov, prima 20 dic $900.000, intereses 31 ene $27.000 y cesantías 14 feb, una fila en `ai_runs` (`leer_documento`, `claude-haiku-5-5`, `anthropic`, `ok`, 3.491/592 tokens, US$0,000645), `DELETE /yo` 204 con tablas y bucket en cero, y usuario borrado sin archivos restantes.

**20 de noviembre de 2026:** web (`luca-demo`) publicada de nuevo desde `4e179c3` con la pasada final; la API no cambió. Verificado en https://luca-demo-delta.vercel.app a 375 px: favicon de Luca (no el de Expo), estilo de foco visible (`#luca-foco`) cargado, recorrido con "Probar sin cuenta" de login a inicio con "Lo que viene", consola sin errores y ninguna petición a la API ni a Supabase. Sin llamadas al modelo ni cuentas nuevas.

**Gasto real en modelo:** dos llamadas, unos US$0,0013 en total.

**Sin probar en producción:** ingreso real con Google o con código al correo (falta la URL en Supabase), la explicación de renglones y la decisión con el modelo real, el tope 429 en vivo, los evals contra el modelo real.

**Para Juan David** (Supabase > Authentication > URL Configuration): agregar en Redirect URLs `https://luca-demo-delta.vercel.app/**`. Si se quiere que sea la dirección principal, poner `https://luca-demo-delta.vercel.app` en Site URL. Para probar: abrir la web, "Seguir con correo", escribir un correo de un miembro del proyecto y entrar con el código (la plantilla Magic Link debe incluir `{{ .Token }}`). Google necesita además activarse en Providers.

## Despliegue de la API en Vercel (instrucciones originales)

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
