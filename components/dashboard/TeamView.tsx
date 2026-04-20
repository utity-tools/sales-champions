'use client';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TeamBarChart } from '@/components/ui/TeamBarChart';
import { fmt, fmtShort, getSalesForPeriod, getTargetForPeriod } from '@/lib/data';
import { useDashboardStore } from '@/store/dashboardStore';

export function TeamView() {
  const { period, reps, salesData, targets } = useDashboardStore();

  const sorted = reps
    .map((r, i) => ({
      ...r, idx: i,
      data: salesData[i],
      sales: salesData[i] ? getSalesForPeriod(salesData[i], period) : 0,
    }))
    .sort((a, b) => b.sales - a.sales);

  const top3 = sorted.slice(0, 3);
  const totalSales = sorted.reduce((a, r) => a + r.sales, 0);
  const totalDeals = sorted.reduce((a, r) => a + (r.data?.deals ?? 0), 0);
  const teamTarget = reps.length * getTargetForPeriod(targets, period);

  const PODIUM_ORDER = [top3[1], top3[0], top3[2]];
  const PODIUM_RANKS = [2, 1, 3];
  const PODIUM_HEIGHTS = [70, 100, 60];
  const RANK_COLORS: Record<number, string> = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' };

  return (
    <div className="team-grid animate-in-up">

      {/* ── PODIUM ── */}
      <Card className="team-podium" style={{ display: 'flex', flexDirection: 'column' }} delay={0}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>
          Top 3 del Período
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10, flex: 1, paddingBottom: 8 }}>
          {PODIUM_ORDER.map((r, i) => {
            if (!r) return null;
            const actualRank = PODIUM_RANKS[i];
            const c = RANK_COLORS[actualRank];
            return (
              <div key={r.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: `2px solid ${c}`,
                  background: `radial-gradient(circle, ${r.color}33, #0b1929)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color: r.color,
                  boxShadow: `0 0 14px ${c}66`, flexShrink: 0,
                }}>{r.avatar}</div>
                <div style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', maxWidth: 64, lineHeight: 1.3 }}>{r.name}</div>
                <div className="num" style={{ fontSize: 11, color: c, fontWeight: 800 }}>{fmtShort(r.sales)}€</div>
                <div style={{
                  width: 54, height: PODIUM_HEIGHTS[i],
                  background: `linear-gradient(180deg,${c}33,${c}11)`,
                  border: `1px solid ${c}44`, borderRadius: '6px 6px 0 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, boxShadow: `0 0 10px ${c}33`,
                }}>
                  {i === 1 ? '👑' : i === 0 ? '🥈' : '🥉'}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── TEAM STATS ── */}
      <Card className="team-stats" delay={0.1}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
          Resumen de Equipo
        </div>
        <div className="team-stats-grid">
          {[
            { label: 'Ventas totales equipo', value: fmt(totalSales), color: '#00e5ff' },
            { label: 'Objetivo de equipo',    value: `${Math.round((totalSales / teamTarget) * 100)}%`, color: '#00ff9d' },
            { label: 'Total deals cerrados',  value: totalDeals, color: '#ffd600' },
            { label: 'Media por comercial',   value: fmt(Math.round(totalSales / (reps.length || 1))), color: '#b44fff' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#112444', borderRadius: 8, padding: 10, textAlign: 'center' }}>
              <div className="num" style={{ fontSize: 20, color }}>{value}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.3, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        <ProgressBar value={totalSales} target={teamTarget} color="#00e5ff" label="Objetivo de equipo" />
      </Card>

      {/* ── LEADERBOARD ── */}
      <Card className="team-leaderboard" delay={0.15}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
          Ranking Completo
        </div>
        <div className="leaderboard-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr>
                {['#', 'Comercial', 'Ventas', 'Deals', 'Ticket Medio', 'Conversión', 'Racha'].map((h) => (
                  <th key={h} style={{
                    fontSize: 10, color: 'var(--muted)', padding: '0 8px 8px',
                    borderBottom: '1px solid var(--border)', textTransform: 'uppercase',
                    letterSpacing: 0.5, textAlign: 'left', fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, rank) => {
                const rankNum = rank + 1;
                const rc = RANK_COLORS[rankNum] ?? 'var(--muted)';
                const isTop = rankNum <= 3;
                return (
                  <tr key={r.id}
                    style={{ transition: 'background .15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#112444')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #0e2038' }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: isTop ? `${rc}22` : 'transparent',
                        border: isTop ? `1px solid ${rc}88` : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: rc,
                      }}>{rankNum}</div>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #0e2038' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: `${r.color}22`, border: `1.5px solid ${r.color}88`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 800, color: r.color, flexShrink: 0,
                        }}>{r.avatar}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{r.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)' }}>{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #0e2038' }}>
                      <span className="num" style={{ color: r.color, fontSize: 14 }}>{fmt(r.sales)}</span>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #0e2038' }}>
                      <span className="num" style={{ color: '#00ff9d', fontSize: 14 }}>{r.data?.deals ?? 0}</span>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #0e2038' }}>
                      <span className="num" style={{ color: '#ffd600', fontSize: 14 }}>{r.data?.avgT ?? 0}€</span>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #0e2038' }}>
                      <span className="num" style={{ color: '#b44fff', fontSize: 14 }}>{r.data?.conv ?? 0}%</span>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #0e2038', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 13 }}>🔥</span>
                      <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: 12, marginLeft: 4 }}>{r.data?.streak ?? 0}d</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── TEAM CHART ── */}
      <Card className="team-chart" delay={0.2}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
          Ventas por Comercial
        </div>
        <TeamBarChart period={period} reps={reps} salesData={salesData} />
      </Card>
    </div>
  );
}
