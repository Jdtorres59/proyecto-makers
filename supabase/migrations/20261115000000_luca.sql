-- Tablas de Luca 1.0. Reflejan los contratos de packages/core/src/esquemas.ts.
-- Plata en bigint (pesos enteros). Toda tabla con RLS y políticas de "solo el dueño".
-- La API escribe con la llave secreta (salta RLS); las políticas protegen el acceso directo desde la app.

-- Lo que Luca sabe de la persona (PerfilFinanciero, sin las deudas). Una fila por usuario.
create table public.financial_profiles (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  name text,
  company text,
  job_title text,
  salary bigint check (salary >= 0),
  pay_day smallint check (pay_day between 1 and 31),
  start_date date,
  goal text,
  housing text check (housing in ('familia', 'arriendo', 'propia', 'otra')),
  updated_at timestamptz not null default now()
);

-- Deudas (Deuda). El id lo pone la app; es único por persona.
create table public.debts (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  kind text not null check (kind in ('tarjeta', 'celular', 'credito', 'educativo', 'otra')),
  name text not null,
  monthly_payment bigint check (monthly_payment >= 0),
  remaining_payments integer check (remaining_payments >= 0),
  balance bigint check (balance >= 0),
  -- Tasa efectiva anual en porcentaje, por ejemplo 26.50.
  annual_rate numeric(7, 4) check (annual_rate >= 0),
  pay_day smallint check (pay_day between 1 and 31),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Lo que la IA leyó de un documento (DocumentoLeido). Una lectura por documento; la escribe el servidor.
create table public.document_readings (
  document_id uuid primary key references public.documents (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('desprendible', 'extracto', 'oferta_credito', 'certificado_cesantias', 'contrato', 'otro')),
  title text not null,
  period text,
  -- Renglon[] tal como lo define esquemas.ts.
  lines jsonb not null default '[]',
  ai_run_id uuid references public.ai_runs (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index document_readings_user_id_idx on public.document_readings (user_id);
create index document_readings_ai_run_id_idx on public.document_readings (ai_run_id);

-- Lecciones terminadas (Progreso.leccionesTerminadas).
create table public.lesson_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- Medallas: módulos cuya acción ya se cumplió (Progreso.medallas).
create table public.medals (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  module_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- Decisiones de plata (Decision). Decide la persona; closed_at marca cuándo eligió.
create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  question text not null,
  document_ids uuid[] not null default '{}',
  chosen_path text,
  reasons text[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
create index decisions_user_created_idx on public.decisions (user_id, created_at desc);

alter table public.financial_profiles enable row level security;
alter table public.debts enable row level security;
alter table public.document_readings enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.medals enable row level security;
alter table public.decisions enable row level security;

-- (select auth.uid()) se evalúa una vez por consulta y no una vez por fila.
create policy "leer mi perfil financiero" on public.financial_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "crear mi perfil financiero" on public.financial_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "cambiar mi perfil financiero" on public.financial_profiles
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "borrar mi perfil financiero" on public.financial_profiles
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "leer mis deudas" on public.debts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "crear mis deudas" on public.debts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "cambiar mis deudas" on public.debts
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "borrar mis deudas" on public.debts
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Sin insert: la lectura la crea el servidor. La persona puede corregir renglones o borrarla.
create policy "leer mis lecturas" on public.document_readings
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "corregir mis lecturas" on public.document_readings
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "borrar mis lecturas" on public.document_readings
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "leer mi progreso" on public.lesson_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "registrar mi progreso" on public.lesson_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "borrar mi progreso" on public.lesson_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "leer mis medallas" on public.medals
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "registrar mis medallas" on public.medals
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "borrar mis medallas" on public.medals
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "leer mis decisiones" on public.decisions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "crear mis decisiones" on public.decisions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "cambiar mis decisiones" on public.decisions
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "borrar mis decisiones" on public.decisions
  for delete to authenticated using ((select auth.uid()) = user_id);

-- La base no dejaba borrar ejecuciones, valoraciones ni eventos desde la app. "Borrar todo lo que Luca
-- sabe de mí" lo hace la API con la llave secreta, así que no hacen falta políticas nuevas para eso.
