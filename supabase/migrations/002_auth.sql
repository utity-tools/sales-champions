-- ── PARTE 1: Tabla user_profiles ─────────────────────────────────────────────
-- Vincula auth.uid() con team_id y role
-- Ejecuta esto en el SQL Editor de Supabase

create table if not exists user_profiles (
  id        uuid primary key references auth.users on delete cascade,
  team_id   uuid not null references teams(id) on delete cascade,
  role      text not null default 'rep' check (role in ('admin', 'rep')),
  created_at timestamptz default now()
);

alter table user_profiles enable row level security;

-- Cada usuario solo ve su propio perfil
create policy "profile_select_own" on user_profiles
  for select using (auth.uid() = id);

-- Solo admins pueden insertar/actualizar perfiles (gestión de equipo)
create policy "profile_admin_write" on user_profiles
  for all using (
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- ── PARTE 2: Reescribir RLS usando user_profiles ──────────────────────────────
-- Ejecuta esto DESPUÉS de la parte 1

-- Eliminar políticas anteriores basadas en app_metadata
drop policy if exists "team_select"        on teams;
drop policy if exists "reps_select"        on reps;
drop policy if exists "reps_admin_write"   on reps;
drop policy if exists "sales_select"       on sales;
drop policy if exists "sales_admin_write"  on sales;
drop policy if exists "targets_select"     on targets;
drop policy if exists "targets_admin_write" on targets;
drop policy if exists "badges_select"      on badges;
drop policy if exists "badges_admin_write" on badges;

-- Helper function: obtiene team_id del usuario actual
create or replace function auth_team_id()
returns uuid language sql stable security definer as
'select team_id from user_profiles where id = auth.uid()';

-- Helper function: comprueba si el usuario actual es admin
create or replace function auth_is_admin()
returns boolean language sql stable security definer as
'select exists(select 1 from user_profiles where id = auth.uid() and role = ''admin'')';

-- Teams: cualquier usuario autenticado con perfil puede leer su equipo
create policy "team_select" on teams
  for select using (id = auth_team_id());

-- Reps: solo reps del mismo equipo
create policy "reps_select" on reps
  for select using (team_id = auth_team_id());

create policy "reps_admin_write" on reps
  for all using (auth_is_admin() and team_id = auth_team_id());

-- Sales
create policy "sales_select" on sales
  for select using (team_id = auth_team_id());

create policy "sales_admin_write" on sales
  for all using (auth_is_admin() and team_id = auth_team_id());

-- Targets
create policy "targets_select" on targets
  for select using (team_id = auth_team_id());

create policy "targets_admin_write" on targets
  for all using (auth_is_admin() and team_id = auth_team_id());

-- Badges
create policy "badges_select" on badges
  for select using (team_id = auth_team_id());

create policy "badges_admin_write" on badges
  for all using (auth_is_admin() and team_id = auth_team_id());

-- ── PARTE 3: Crear usuario de prueba ─────────────────────────────────────────
-- Ejecuta esto DESPUÉS de crear el usuario en Supabase Auth Dashboard
-- Reemplaza <AUTH_USER_UUID> con el UUID real del usuario creado

-- insert into user_profiles (id, team_id, role)
-- select '<AUTH_USER_UUID>', id, 'admin'
-- from teams where name = 'Equipo Demo';
