# Arquitectura

Base técnica construida el 14 de noviembre de 2026. Sirve para cualquier versión del producto; no contiene features de producto.

- [decisiones.md](decisiones.md): qué se decidió y por qué.
- [estado.md](estado.md): qué funciona, qué falta y quién sigue.

## Piezas

| Pieza | Tecnología | Por qué existe |
|---|---|---|
| App | Expo (React Native), Expo Router | Un solo código para iOS, Android y web |
| API | Hono sobre Node | La llave del modelo no puede vivir en el celular; el ciclo del agente corre aquí |
| Datos | Supabase: Auth, Postgres con RLS, Storage | Login, datos por usuario y archivos privados sin operar servidores |
| IA | SDK oficial de Anthropic | Funciona igual contra Anthropic directo y contra Amazon Bedrock |

## Flujo de información

```
Celular (Expo)
  │ 1. login con Google o Apple ────► Supabase Auth ──► token
  │ 2. sube documento ───────────────► Supabase Storage, bucket privado "documentos"
  │ 3. eventos de uso ───────────────► tabla events
  │ 4. pide trabajo a la IA (token) ─► apps/api  POST /ai/run
                                         │ valida el token y el tope de gasto del día
                                         ▼
                                    packages/ai  ejecutarAgente()
                                         │ constitución + prompt del agente
                                         │ herramientas: cálculos (core), normas (conocimiento)
                                         ▼
                                    Claude (anthropic | bedrock | mock)
                                         │
                                         ▼ fila en ai_runs: modelo, versión de prompt,
                                           tokens, costo, latencia, herramientas
  ◄─────────── respuesta por partes (NDJSON) ──┘
  │ 5. valoración ───────────────────► tabla ai_feedback
```

La app habla directo con Supabase para todo lo que protege RLS (sus propias filas y archivos) y pasa por la API solo para lo que necesita una llave secreta: el modelo.

## Tablas

| Tabla | Contenido | Quién escribe |
|---|---|---|
| `profiles` | Una fila por usuario | Trigger al registrarse |
| `consents` | Autorización de datos: versión del texto y fecha | La app |
| `documents` | Metadatos de archivos subidos | La app |
| `ai_runs` | Cada ejecución de IA, con entrada, salida y costo | Solo la API |
| `ai_feedback` | Valoración de una ejecución | La app |
| `events` | Eventos de uso | La app |

Todas tienen RLS: cada persona solo ve lo suyo.

## Un agente por dentro

Un agente es una entrada en `packages/ai/src/agentes.ts`: modelo, instrucciones y lista de herramientas. `ejecutarAgente()` le antepone la constitución (`prompts/constitucion.ts`), corre el ciclo modelo → herramientas → modelo hasta que el modelo termina (máximo 8 vueltas), valida con zod cada entrada de herramienta antes de ejecutarla y guarda el registro aunque algo falle.

El proveedor se escoge con `AI_PROVIDER`. `mock` sigue un guion fijo, no cuesta plata y es el que usan las pruebas y el CI.
