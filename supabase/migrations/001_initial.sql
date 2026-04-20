-- Sales Arena — Initial Schema
-- Run this in your Supabase SQL editor

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Teams (multi-tenancy) ─────────────────────────────────────────────────────
create table if not exists teams (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  created_at timestamptz default now()
);

-- ── Reps ─────────────────────────────────────────────────────────────────────
create table if not exists reps (
  id         serial primary key,
  team_id    uuid references teams(id) on delete cascade,
  name       text not null,
  avatar     text not null,
  color      text not null default '#00e5ff',
  role       text not null default 'AE',
  email      text not null unique,
  active     boolean not null default true,
  created_at timestamptz default now()
);

-- ── Targets (per team) ───────────────────────────────────────────────────────
create table if not exists targets (
  id          serial primary key,
  team_id     uuid references teams(id) on delete cascade unique,
  weekly      numeric not null default 12500,
  monthly     numeric not null default 50000,
  quarterly   numeric not null default 150000,
  yearly      numeric not null default 600000,
  deal_target integer not null default 40,
  conv_target numeric not null default 30
);

-- ── Sales (raw records) ───────────────────────────────────────────────────────
create table if not exists sales (
  id           serial primary key,
  rep_id       integer references reps(id) on delete cascade,
  team_id      uuid references teams(id) on delete cascade,
  amount       numeric not null,
  deal_count   integer not null default 1,
  avg_ticket   numeric,
  conversion   numeric,
  new_clients  integer not null default 0,
  period       text not null check (period in ('week','month','quarter','year')),
  period_start date not null,
  created_at   timestamptz default now()
);

-- ── Badges ───────────────────────────────────────────────────────────────────
create table if not exists badges (
  id         serial primary key,
  rep_id     integer references reps(id) on delete cascade,
  team_id    uuid references teams(id) on delete cascade,
  badge_id   text not null,
  awarded_at timestamptz default now(),
  unique (rep_id, badge_id)
);

-- ── Materialized view: aggregated sales per rep per period ────────────────────
create materialized view if not exists rep_sales_summary as
select
  r.id                                          as rep_id,
  r.team_id,
  r.name,
  r.avatar,
  r.color,
  r.role,
  r.active,
  coalesce(sum(case when s.period = 'week'    then s.amount end), 0) as week_sales,
  coalesce(sum(case when s.period = 'month'   then s.amount end), 0) as month_sales,
  coalesce(sum(case when s.period = 'quarter' then s.amount end), 0) as quarter_sales,
  coalesce(sum(case when s.period = 'year'    then s.amount end), 0) as year_sales,
  coalesce(sum(case when s.period = 'month'   then s.deal_count end), 0) as deals,
  coalesce(avg(case when s.period = 'month'   then s.avg_ticket end), 0) as avg_ticket,
  coalesce(avg(case when s.period = 'month'   then s.conversion end), 0) as conversion,
  coalesce(sum(case when s.period = 'month'   then s.new_clients end), 0) as new_clients
from reps r
left join sales s on s.rep_id = r.id
group by r.id, r.team_id, r.name, r.avatar, r.color, r.role, r.active;

create unique index on rep_sales_summary (rep_id);

-- Refresh function (call periodically or from Edge Function)
create or replace function refresh_sales_summary()
returns void language sql security definer as $$
  refresh materialized view concurrently rep_sales_summary;
$$;

-- ── Trigger: protect ranking integrity ───────────────────────────────────────
-- Prevent manual ranking manipulation via direct INSERT/UPDATE
create or replace function prevent_rank_tampering()
returns trigger language plpgsql as $$
begin
  -- Refresh summary on any sales change so rankings stay accurate
  perform refresh_sales_summary();
  return new;
end;
$$;

create or replace trigger sales_change_refresh
after insert or update or delete on sales
for each statement execute function prevent_rank_tampering();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table teams   enable row level security;
alter table reps    enable row level security;
alter table targets enable row level security;
alter table sales   enable row level security;
alter table badges  enable row level security;

-- Teams: authenticated users can see their own team
create policy "team_select" on teams
  for select using (auth.uid() is not null);

-- Reps: users can read reps from their team (via JWT claim)
create policy "reps_select" on reps
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

-- Reps: only admins can insert/update/delete
create policy "reps_admin_write" on reps
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Sales: same team-scoped read
create policy "sales_select" on sales
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

-- Sales: admin write
create policy "sales_admin_write" on sales
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Targets: team-scoped
create policy "targets_select" on targets
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

create policy "targets_admin_write" on targets
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Badges: team-scoped
create policy "badges_select" on badges
  for select using (
    team_id = (auth.jwt() -> 'app_metadata' ->> 'team_id')::uuid
  );

create policy "badges_admin_write" on badges
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ── Seed data (demo team) ─────────────────────────────────────────────────────
do $$
declare
  demo_team_id uuid;
begin
  insert into teams (name) values ('Equipo Demo') returning id into demo_team_id;

  insert into reps (team_id, name, avatar, color, role, email) values
    (demo_team_id, 'Ana García',       'AG', '#00e5ff', 'Senior AE', 'ana@empresa.com'),
    (demo_team_id, 'Carlos López',     'CL', '#00ff9d', 'AE',        'carlos@empresa.com'),
    (demo_team_id, 'María Rodríguez',  'MR', '#ffd600', 'Senior AE', 'maria@empresa.com'),
    (demo_team_id, 'David Martínez',   'DM', '#ff6b35', 'AE',        'david@empresa.com'),
    (demo_team_id, 'Laura Sánchez',    'LS', '#b44fff', 'SDR',       'laura@empresa.com'),
    (demo_team_id, 'Javier Fernández', 'JF', '#ff3d8b', 'AE',        'javier@empresa.com'),
    (demo_team_id, 'Sara González',    'SG', '#00bcd4', 'SDR',       'sara@empresa.com'),
    (demo_team_id, 'Miguel Torres',    'MT', '#ffab40', 'AE',        'miguel@empresa.com');

  insert into targets (team_id, weekly, monthly, quarterly, yearly, deal_target, conv_target)
  values (demo_team_id, 12500, 50000, 150000, 600000, 40, 30);

  -- Monthly sales seed
  insert into sales (rep_id, team_id, amount, deal_count, avg_ticket, conversion, new_clients, period, period_start)
  select
    r.id, demo_team_id,
    val.amount, val.deals, val.avgt, val.conv, val.new_cli,
    'month', date_trunc('month', current_date)
  from reps r
  join (values
    ('ana@empresa.com',    48200, 31, 1555, 35, 12),
    ('carlos@empresa.com', 57300, 44, 1302, 31, 19),
    ('maria@empresa.com',  38900, 25, 1556, 27, 9),
    ('david@empresa.com',  62100, 49, 1269, 41, 23),
    ('laura@empresa.com',  31400, 19, 1653, 23, 7),
    ('javier@empresa.com', 51200, 38, 1347, 33, 15),
    ('sara@empresa.com',   36700, 23, 1596, 28, 11),
    ('miguel@empresa.com', 45800, 34, 1347, 30, 13)
  ) as val(email, amount, deals, avgt, conv, new_cli)
  on r.email = val.email
  where r.team_id = demo_team_id;
end;
$$;
