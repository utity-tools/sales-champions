-- ── PARTE 4: Datos de demo ───────────────────────────────────────────────────
-- Ejecuta esto al final

do $seed$
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
$seed$;

-- Refresca la vista con los datos recién insertados
select refresh_sales_summary();
