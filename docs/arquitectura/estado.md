# Estado

Documento de relevo. Quien termina una tarea lo actualiza para que la siguiente persona o agente sepa dónde va el trabajo.

Última actualización: 14 de noviembre de 2026 (rama `base-tecnica`).

## Qué funciona y cómo se comprobó

| Pieza | Estado | Cómo se comprobó |
|---|---|---|
| Monorepo, tipos | Listo | `pnpm typecheck` limpio en los cinco paquetes |
| `packages/core`, `conocimiento`, `ai` | Listo | `pnpm test`: 13 pruebas |
| API | Lista con dobles | Pruebas de 401, 400, 404, 429 y streaming; además se levantó por HTTP y `curl` recibió la respuesta por partes |
| Evals | Arnés listo | `pnpm eval`: 3 casos contra el proveedor simulado |
| App | Compila y muestra el login | `expo-doctor` 20/20, Metro empaqueta para iOS y el login se vio en la versión web. No se abrió en un celular ni en el simulador. Ver "Qué falta" |
| Base de datos | Aplicada en `makers-dev` | Migración aplicada, avisos de seguridad de Supabase en cero, y prueba con dos usuarios: ninguno lee ni escribe filas del otro, y la app no puede insertar en `ai_runs` |
| Login | Pantalla lista, **sin probar un ingreso real** | La pantalla se vio en web. Supabase responde "provider is not enabled": faltan las credenciales de Google y Apple |

## Proyecto de Supabase

`makers-dev`, referencia `wktftxvnflgelkgrdkfy`, región us-east-1, en la organización personal de Juan David. La URL y la llave publicable van en `apps/mobile/.env`; la llave secreta, en `apps/api/.env`.

## Qué falta para que corra de punta a punta

1. **Activar Google y Apple en Supabase** (Authentication > Sign In / Providers). Google pide un cliente OAuth creado en Google Cloud; Apple pide un Services ID y una llave de la cuenta de Apple Developer. En ambos, la URL de retorno es `https://wktftxvnflgelkgrdkfy.supabase.co/auth/v1/callback`.
2. **Agregar las URL de regreso** en Authentication > URL Configuration: `makers://**`, `http://localhost:8081/**` y, mientras se use Expo Go, `exp://**`.
3. **Llave secreta de Supabase** en `apps/api/.env` (Project Settings > API Keys). Sin ella la API no arranca.
4. **Probar el flujo completo en un celular.** Login, autorización, streaming en el teléfono y valoración nunca se han ejecutado con una sesión real.
5. **Llave del modelo.** Sin definir (Anthropic directo o Amazon Bedrock). Ninguna llamada real al modelo se ha hecho: los evals solo han corrido contra el proveedor simulado, que sigue un guion y no dice nada sobre la calidad de las respuestas. La rama de Bedrock en `proveedor.ts` está escrita según la documentación y sin probar.
6. **Despliegue.** API en Vercel y builds de la app con EAS, sin hacer.
7. **Texto de autorización de datos.** Es un borrador de trabajo, no un texto legal.
8. **CI.** El flujo de GitHub Actions está escrito y no ha corrido todavía.

## Preguntas abiertas para el equipo

La base las deja abiertas a propósito. Cada una indica qué toca cuando se responda.

1. ¿Qué tiene que saber el producto de una persona para servirle, y de dónde lo saca? (tablas nuevas, `packages/core`)
2. ¿Qué hace el producto cuando la persona no lo está mirando? (ejecución durable, notificaciones, canal)
3. ¿Qué respuesta de la IA sería inaceptable? Cada una se vuelve un caso en `evals/casos.json`.
4. ¿Quién responde por que una norma esté al día? (`packages/conocimiento`)
5. ¿Qué evento de uso les diría que la persona aprendió o decidió algo? (tabla `events`)
6. ¿Cuánto están dispuestos a gastar por usuario al mes en modelo? (`TOPE_DIARIO_USD`, `modelos.ts`)
7. ¿Cuánto tiempo se conserva lo que la gente escribe y sube? (`ai_runs`, bucket `documentos`)
