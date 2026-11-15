-- Base de datos mínima, sin tablas de producto.
-- Regla: toda tabla nueva lleva RLS activo y políticas de "solo el dueño".
-- Los nombres de tablas y columnas van en inglés snake_case; el dominio en el código va en español.

-- Perfil: una fila por usuario, creada sola al registrarse.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

-- La función solo debe correr como trigger, no desde la API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Autorizaciones de tratamiento de datos (Ley 1581 de 2012): qué texto aceptó la persona y cuándo.
create table public.consents (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null,
  text_version text not null,
  accepted_at timestamptz not null default now()
);
create index consents_user_id_idx on public.consents (user_id);

-- Metadatos de archivos subidos. El archivo vive en el bucket privado "documentos".
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  storage_path text not null,
  mime_type text,
  created_at timestamptz not null default now()
);
create index documents_user_id_idx on public.documents (user_id);

-- Una fila por ejecución de IA. Solo la escribe el servidor (la llave secreta salta RLS).
create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  agent text not null,
  prompt_version text not null,
  model text not null,
  provider text not null,
  status text not null check (status in ('ok', 'rechazo', 'truncado', 'error')),
  input text not null,
  output text not null default '',
  tools text[] not null default '{}',
  iterations integer not null default 0,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cache_read_tokens integer not null default 0,
  cache_write_tokens integer not null default 0,
  cost_usd numeric(12, 6) not null default 0,
  latency_ms integer not null default 0,
  error text,
  created_at timestamptz not null default now()
);
create index ai_runs_user_created_idx on public.ai_runs (user_id, created_at desc);

-- Valoración de una ejecución. Alimenta los evals.
create table public.ai_feedback (
  run_id uuid primary key references public.ai_runs (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  comment text,
  created_at timestamptz not null default now()
);
create index ai_feedback_user_id_idx on public.ai_feedback (user_id);

-- Eventos de uso. De aquí sale la personalización por comportamiento (documento 06).
create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  properties jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index events_user_created_idx on public.events (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.consents enable row level security;
alter table public.documents enable row level security;
alter table public.ai_runs enable row level security;
alter table public.ai_feedback enable row level security;
alter table public.events enable row level security;

-- (select auth.uid()) se evalúa una vez por consulta y no una vez por fila.
create policy "leer mi perfil" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "leer mis autorizaciones" on public.consents
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "registrar mi autorización" on public.consents
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "leer mis documentos" on public.documents
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "registrar mis documentos" on public.documents
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "borrar mis documentos" on public.documents
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "leer mis ejecuciones" on public.ai_runs
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "leer mis valoraciones" on public.ai_feedback
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "valorar mis ejecuciones" on public.ai_feedback
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.ai_runs r where r.id = run_id and r.user_id = (select auth.uid()))
  );
create policy "cambiar mis valoraciones" on public.ai_feedback
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "leer mis eventos" on public.events
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "registrar mis eventos" on public.events
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- Archivos: bucket privado; cada persona solo toca la carpeta que lleva su id.
insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false);

create policy "leer mis archivos" on storage.objects
  for select to authenticated
  using (bucket_id = 'documentos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "subir mis archivos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documentos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "borrar mis archivos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documentos' and (storage.foldername(name))[1] = (select auth.uid())::text);
