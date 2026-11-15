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
| App | Compila | `expo-doctor` 20/20 y tipos limpios. Ver "Qué falta" |
| Base de datos | Migración escrita, **sin aplicar** | No se ha corrido contra ningún Postgres |

## Qué falta para que corra de punta a punta

1. **Proyecto de Supabase.** No se pudo crear: la cuenta de Juan David ya tiene los 2 proyectos activos que permite el plan gratuito. Opciones: pausar uno, o crear una organización del equipo. Después: aplicar `supabase/migrations/`, revisar los avisos de seguridad y probar con dos usuarios que uno no lee filas del otro.
2. **Llenar los `.env`** de `apps/api` y `apps/mobile` a partir de los `.env.example`.
3. **Probar el login y el flujo completo en un celular.** Nunca se ha ejecutado contra un Supabase real: login, autorización, streaming en el teléfono y valoración están sin probar en dispositivo.
4. **Correo de login.** La plantilla de correo de Supabase debe incluir el código (`{{ .Token }}`), y el correo por defecto solo entrega a miembros del proyecto. Para personas externas hay que configurar un proveedor de correo.
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
