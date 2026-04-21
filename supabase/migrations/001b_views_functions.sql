-- ── PARTE 2: Vista materializada + Funciones + Trigger ───────────────────────
-- Ejecuta esto DESPUÉS de la parte 1

create materialized view if not exists rep_sales_summary as
select
  r.id                                                                    as rep_id,
  r.team_id,
  r.name,
  r.avatar,
  r.color,
  r.role,
  r.active,
  coalesce(sum(case when s.period = 'week'    then s.amount end), 0)     as week_sales,
  coalesce(sum(case when s.period = 'month'   then s.amount end), 0)     as month_sales,
  coalesce(sum(case when s.period = 'quarter' then s.amount end), 0)     as quarter_sales,
  coalesce(sum(case when s.period = 'year'    then s.amount end), 0)     as year_sales,
  coalesce(sum(case when s.period = 'month'   then s.deal_count end), 0) as deals,
  coalesce(avg(case when s.period = 'month'   then s.avg_ticket end), 0) as avg_ticket,
  coalesce(avg(case when s.period = 'month'   then s.conversion end), 0) as conversion,
  coalesce(sum(case when s.period = 'month'   then s.new_clients end), 0) as new_clients
from reps r
left join sales s on s.rep_id = r.id
group by r.id, r.team_id, r.name, r.avatar, r.color, r.role, r.active;

create unique index on rep_sales_summary (rep_id);

create or replace function refresh_sales_summary()
returns void language sql security definer as
'refresh materialized view concurrently rep_sales_summary';

create or replace function prevent_rank_tampering()
returns trigger language plpgsql as
'begin perform refresh_sales_summary(); return new; end';

create or replace trigger sales_change_refresh
after insert or update or delete on sales
for each statement execute function prevent_rank_tampering();
