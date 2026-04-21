-- ── PARTE 3: Row Level Security ──────────────────────────────────────────────
-- Ejecuta esto DESPUÉS de la parte 2

alter table teams   enable row level security;
alter table reps    enable row level security;
alter table targets enable row level security;
alter table sales   enable row level security;
alter table badges  enable row level security;

-- Teams: cualquier usuario autenticado puede ver equipos
create policy "team_select" on teams
  for select using (auth.uid() is not null);

-- Reps: lectura limitada al propio equipo (via JWT claim)
create policy "reps_select" on reps
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

create policy "reps_admin_write" on reps
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Sales: equipo propio
create policy "sales_select" on sales
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

create policy "sales_admin_write" on sales
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Targets: equipo propio
create policy "targets_select" on targets
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

create policy "targets_admin_write" on targets
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Badges: equipo propio
create policy "badges_select" on badges
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

create policy "badges_admin_write" on badges
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
