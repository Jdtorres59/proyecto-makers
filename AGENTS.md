# AGENTS.md

Reglas del repo para personas y agentes. `CLAUDE.md` importa este archivo: se edita aquí.

## Qué es esto

Base técnica de una EdTech de finanzas AI-first (Makers Fellowship). **El producto no está definido.** Lo que hay en `docs/ideas/` son posibilidades, no decisiones. No construyas features de producto sin una decisión del equipo anotada en `docs/arquitectura/decisiones.md`.

Antes de empezar una tarea, lee `docs/arquitectura/estado.md`.

## Mapa

| Carpeta | Qué vive ahí |
|---|---|
| `apps/mobile` | App Expo (iOS, Android, web). Tiene su propio `AGENTS.md` con reglas de Expo |
| `apps/api` | Servidor Hono. Único lugar con llaves secretas y acceso al modelo |
| `packages/core` | Dominio determinista: plata en COP, cálculos, esquemas compartidos |
| `packages/ai` | Capa de IA: proveedor, modelos, prompts, herramientas, agentes, registro |
| `packages/conocimiento` | Normas colombianas con cifra, fuente y vigencia |
| `supabase/migrations` | Esquema de la base de datos y políticas RLS |
| `evals` | Casos que la IA no puede fallar |
| `docs/investigacion`, `docs/ideas`, `insumos`, `build` | Investigación previa. No se toca desde tareas de código |
| `docs/arquitectura` | Mapa del sistema, decisiones y estado del trabajo |

## Comandos

Requiere Node 24 o 26 y pnpm (`corepack enable pnpm`).

```bash
pnpm install
pnpm typecheck     # tipos en todo el repo
pnpm test          # pruebas unitarias
pnpm eval          # evals contra el proveedor simulado (gratis)
pnpm dev:api       # API en http://localhost:8787 (necesita apps/api/.env)
pnpm dev:mobile    # app Expo (necesita apps/mobile/.env)
```

Corre `pnpm typecheck && pnpm test && pnpm eval` antes de dar una tarea por terminada.

## Reglas de trabajo

- Una rama por tarea y PR a `main`. No se mezcla con el CI en rojo.
- Un solo agente escribe en una copia de trabajo a la vez. Otros pueden leer o revisar.
- **El repo es público.** Nunca subas llaves, archivos `.env` ni datos reales de personas (desprendibles, extractos, cédulas, correos). Los datos de prueba son ficticios.
- Migraciones: solo se agregan archivos nuevos en `supabase/migrations`. Una migración aplicada no se edita.
- Toda tabla nueva lleva RLS activo y políticas de "solo el dueño".
- Idioma: dominio, documentación y textos de la app en español. Tablas y columnas de la base de datos en inglés `snake_case`.
- Dependencias: no agregues una por pocas líneas. Las versiones compartidas viven en el catálogo de `pnpm-workspace.yaml`. En `apps/mobile` se instalan con `npx expo install`.
- Al terminar: actualiza `docs/arquitectura/estado.md`. Si tomaste una decisión que otro debería conocer, anótala en `decisiones.md`.

## Reglas de IA

Salen de la investigación del equipo (`docs/ideas/04`, `docs/investigacion/08`). Cambiarlas es una decisión de equipo.

1. La llave del modelo solo existe en `apps/api`. La app nunca llama al modelo directo.
2. Toda llamada al modelo pasa por `ejecutarAgente()` en `packages/ai`. Así queda registrada en `ai_runs` con costo, versión de prompt y herramientas usadas.
3. Las cuentas con plata se hacen en `packages/core` y se le dan al modelo como herramientas. El modelo no calcula.
4. Las cifras legales salen de `packages/conocimiento`. Cada norma lleva fuente, vigencia y quién la verificó. Un agente no agrega normas sin que una persona las verifique.
5. Cambiar el texto de un prompt exige cambiar su versión.
6. Todo cambio de prompt, modelo o herramienta suma o ajusta un caso en `evals/casos.json`.
7. Los IDs de modelo y el nivel de esfuerzo viven solo en `packages/ai/src/modelos.ts`.
8. La IA explica y da pistas; no decide por la persona ni recomienda productos o entidades.

## Cómo agregar

- **Un agente:** una entrada en `packages/ai/src/agentes.ts` y al menos un caso en `evals/casos.json`.
- **Una herramienta:** en `packages/ai/src/herramientas.ts`, con esquema zod. La lógica va en `packages/core` con su prueba.
- **Una norma:** en `packages/conocimiento/src/normas.ts`, verificada contra la fuente oficial.
- **Una tabla:** migración nueva con RLS y políticas. Revisa los avisos de seguridad de Supabase después de aplicarla.
- **Una pantalla:** archivo en `apps/mobile/src/app/`. El diseño visual todavía no tiene dirección: no inventes una sin acordarla.
