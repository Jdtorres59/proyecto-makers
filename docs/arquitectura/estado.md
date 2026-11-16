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
| 3 | App con datos de muestra | En curso, en dos tandas |
| 4 | Backend: cuentas, tablas, agentes y rutas | Hecho y fusionado en `v1`. Migración `20261115000000_luca.sql` aplicada en `makers-dev` el 15 de noviembre: avisos de seguridad en cero y prueba de aislamiento entre dos usuarios (revertida) |
| 5 | Conectar app y API | Pendiente |
| 6 | Contenido de los 12 módulos | Pendiente |
| 7 | Pulido y verificación | Pendiente |

## Qué funciona y cómo se comprobó

| Pieza | Estado | Cómo se comprobó |
|---|---|---|
| Monorepo, tipos | Listo | `pnpm typecheck` limpio en los cinco paquetes |
| `packages/core`, `conocimiento`, `ai` | Listo | `pnpm test`: 47 pruebas en todo el repo. Las cuentas cuadran con el prototipo (neto 3.312.000, prima y cesantías 900.000, intereses 27.000) |
| API | Rutas de Luca 1.0 con dobles | Pruebas de cada ruta con datos en memoria y el proveedor simulado. `index.ts` (Supabase) compila pero no se ha corrido contra la base |
| Evals | Arnés listo | `pnpm eval`: 7 casos contra el proveedor simulado, uno o más por agente |
| App | Compila y muestra el login | `expo-doctor` 20/20, Metro empaqueta para iOS y el login se vio en la versión web. No se abrió en un celular ni en el simulador. Ver "Qué falta" |
| Base de datos | Aplicada en `makers-dev` | Migración aplicada, avisos de seguridad de Supabase en cero, y prueba con dos usuarios: ninguno lee ni escribe filas del otro, y la app no puede insertar en `ai_runs` |
| Login | Pantalla lista con Google, Apple y correo, **sin probar un ingreso real** | La pantalla se vio en web. El correo está activo en Supabase; Google y Apple responden "provider is not enabled" porque faltan sus credenciales |

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

2. Correr `index.ts` contra Supabase de verdad: subir un PDF, leerlo, explicarlo, borrar todo.
3. Correr los evals contra el modelo real cuando haya llave (`AI_PROVIDER=anthropic pnpm eval`).
4. Auxilio de transporte: con salario hasta 2 SMMLV, `eventosDePlata` devuelve los montos en null porque la norma de 2026 no se confirmó. Es justo el rango de mucha gente de la persona foco.
5. Que una persona verifique las normas y cambie `verificadoPor`.

## Proyecto de Supabase

`makers-dev`, referencia `wktftxvnflgelkgrdkfy`, región us-east-1, en la organización personal de Juan David. La URL y la llave publicable van en `apps/mobile/.env`; la llave secreta, en `apps/api/.env`.

## Qué falta para que corra de punta a punta

1. **Activar Google y Apple en Supabase** (Authentication > Sign In / Providers). Google pide un cliente OAuth creado en Google Cloud; Apple pide un Services ID y una llave de la cuenta de Apple Developer. En ambos, la URL de retorno es `https://wktftxvnflgelkgrdkfy.supabase.co/auth/v1/callback`.
2. **Agregar las URL de regreso** en Authentication > URL Configuration: `makers://**`, `http://localhost:8081/**` y, mientras se use Expo Go, `exp://**`.
3. **Correo de login.** La plantilla "Magic Link" de Supabase (Authentication > Emails) debe incluir el código `{{ .Token }}`; por defecto solo manda un enlace. Además, el correo por defecto de Supabase solo entrega a miembros del proyecto y tiene límite por hora: para personas externas hay que configurar un proveedor de correo (SMTP).
4. **Llave secreta de Supabase** en `apps/api/.env` (Project Settings > API Keys). Sin ella la API no arranca.
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
