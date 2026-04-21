'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { GaugeChart } from '@/components/ui/GaugeChart';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BadgeIcon } from '@/components/ui/BadgeIcon';
import { RankBadge } from '@/components/ui/RankBadge';
import { MiniBarChart } from '@/components/ui/MiniBarChart';
import { Particles } from '@/components/ui/Particles';
import { fmt, getSalesForPeriod, getTargetForPeriod, getRank, calcXP } from '@/lib/data';
import { BADGE_DEFS, WEEKLY_SALES_CHART } from '@/lib/data';
import { useDashboardStore } from '@/store/dashboardStore';
import { useRepSummary } from '@/lib/hooks/useRepSummary';
import { useTargets } from '@/lib/hooks/useTargets';
import { useBadges } from '@/lib/hooks/useBadges';

export function PersonalView() {
  const { repIdx, period } = useDashboardStore();
  const { data: summary, isLoading: loadingReps } = useRepSummary();
  const { data: targets, isLoading: loadingTargets } = useTargets();
  const { data: badgesMap } = useBadges();
  const [celebrate, setCelebrate] = useState(false);

  const reps = summary?.reps ?? [];
  const salesData = summary?.salesData ?? [];
  const tgt = targets ?? { weekly: 0, monthly: 0, quarterly: 0, yearly: 0, dealTarget: 0, convTarget: 0 };

  const rep = reps[repIdx];
  const data = salesData[repIdx];
  const sales = data ? getSalesForPeriod(data, period) : 0;
  const target = getTargetForPeriod(tgt, period);
  const rank = rep ? getRank(repIdx, period, salesData) : 1;
  const badgeIds = rep ? (badgesMap?.get(rep.id) ?? []) : [];
  const overTarget = sales >= target && target > 0;
  const weeklyData = WEEKLY_SALES_CHART.data[repIdx] ?? [];
  const weekTotal = weeklyData.reduce((a, b) => a + b, 0);
  const xp = data ? calcXP(sales, data.deals, data.streak) : 0;

  useEffect(() => {
    if (overTarget) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 2100);
      return () => clearTimeout(t);
    }
  }, [repIdx, period, overTarget]);

  if (loadingReps || loadingTargets) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--muted)', fontSize: 14 }}>
        Cargando datos...
      </div>
    );
  }

  if (!rep || !data) return null;

  return (
    <div className="personal-grid animate-in-up">
      <Particles active={celebrate} />

      {/* ── HERO CARD ── */}
      <Card
        glow={rep.color}
        className="personal-hero"
        style={{ display: 'flex', flexDirection: 'column', padding: 20, position: 'relative', overflow: 'hidden' }}
        delay={0}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${rep.color}, transparent)` }} />

        <div className="hero-inner">
          <div className="hero-avatar-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <motion.div
              style={{
                width: 80, height: 80, borderRadius: '50%',
                border: `3px solid ${rep.color}`,
                background: `radial-gradient(circle at 35% 35%, ${rep.color}33, #0b1929)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 900, color: rep.color,
                boxShadow: `0 0 24px ${rep.color}55`,
                flexShrink: 0,
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {rep.avatar}
            </motion.div>
            <RankBadge rank={rank} size={44} />
          </div>

          <div className="hero-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 2 }}>{rep.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{rep.role}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>Posición #{rank} en el equipo</div>

            <div style={{
              background: '#112444', borderRadius: 10, padding: '8px 14px', width: '100%',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
              border: '1px solid #ff6b3566',
            }}>
              <span style={{ fontSize: 18, display: 'inline-block', animation: 'streakFlame 0.8s ease-in-out infinite' }}>🔥</span>
              <div>
                <div className="num" style={{ fontSize: 20, color: '#ff6b35', lineHeight: 1 }}>{data.streak}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>días en racha</div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, alignSelf: 'flex-start' }}>LOGROS</div>
            <div className="badge-row">
              {BADGE_DEFS.map((b) => (
                <BadgeIcon key={b.id} badge={b} earned={badgeIds.includes(b.id)} />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ── PROGRESS CARD ── */}
      <Card className="personal-progress" style={{ padding: 16 }} delay={0.1}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
          Progreso hacia Objetivo
        </div>
        <div className="progress-inner">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GaugeChart value={sales} max={target} color={rep.color} size={130} />
            <div style={{ textAlign: 'center', marginTop: -8 }}>
              <div className="num" style={{ fontSize: 22, color: rep.color }}>{fmt(sales)}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                de {fmt(target)} objetivo {period === 'week' ? 'semanal' : 'mensual'}
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 8 }}>
            <ProgressBar
              value={sales} target={target} color={rep.color}
              label={period === 'week' ? 'Objetivo semanal' : 'Objetivo mensual'}
              sublabel={`${Math.round((sales / (target || 1)) * 100)}% completado`}
            />
            {period === 'month' && (
              <ProgressBar
                value={data.week} target={tgt.weekly} color="#b44fff"
                label="Objetivo semanal"
                sublabel={`${Math.round((data.week / (tgt.weekly || 1)) * 100)}% completado`}
              />
            )}
            <div style={{ marginTop: 12, background: '#112444', borderRadius: 8, padding: 10, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              {overTarget ? (
                <span style={{ color: '#00ff9d', fontWeight: 700 }}>🎉 ¡Objetivo superado! +{fmt(sales - target)} extra</span>
              ) : (
                <span>Faltan <strong style={{ color: rep.color }}>{fmt(target - sales)}</strong> para el objetivo</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ── KPI GRID ── */}
      <div className="personal-kpis">
        <div className="kpi-grid-inner">
          <KpiCard label="Ventas totales" value={fmt(sales)} color={rep.color} delay={0.15} />
          <KpiCard label="Deals cerrados" value={data.deals} color="#00ff9d" sub={`≈${(data.deals / 30).toFixed(2)} / día`} delay={0.2} />
          <KpiCard label="Ticket medio" value={`${data.avgT}€`} color="#ffd600" delay={0.25} />
          <KpiCard label="Conversión" value={`${data.conv}%`} color="#b44fff" delay={0.3} />
          <KpiCard label="Nuevos clientes" value={data.newCli} color="#ff3d8b" delay={0.35} />
          <KpiCard
            label="Ranking equipo" value={`#${rank}`}
            color={rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : 'var(--muted)'}
            delay={0.4}
          />
          <KpiCard label="Racha actual" value={`${data.streak}d`} color="#ff6b35" delay={0.45} />
          <KpiCard label="Score" value={xp} sub="XP puntos" color="#00e5ff" delay={0.5} />
        </div>
      </div>

      {/* ── WEEKLY CHART ── */}
      <Card className="personal-chart" style={{ padding: 16 }} delay={0.2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Ventas esta semana</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Desglose por día</div>
          </div>
          <div className="num" style={{ color: rep.color, fontWeight: 800, fontSize: 15 }}>{fmt(weekTotal)}</div>
        </div>
        <MiniBarChart labels={WEEKLY_SALES_CHART.labels} data={weeklyData} color={rep.color} height={80} />
      </Card>
    </div>
  );
}
