-- ── PARTE 1: Extensions + Tablas ─────────────────────────────────────────────
-- Pega esto primero y ejecuta

create extension if not exists "uuid-ossp";

create table if not exists teams (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  created_at timestamptz default now()
);

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

create table if not exists badges (
  id         serial primary key,
  rep_id     integer references reps(id) on delete cascade,
  team_id    uuid references teams(id) on delete cascade,
  badge_id   text not null,
  awarded_at timestamptz default now(),
  unique (rep_id, badge_id)
);
