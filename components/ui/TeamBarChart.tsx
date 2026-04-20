'use client';

import { motion } from 'framer-motion';
import type { Rep, SalesData } from '@/types';
import { getSalesForPeriod, fmtShort } from '@/lib/data';

interface TeamBarChartProps {
  period: string;
  reps: Rep[];
  salesData: SalesData[];
}

export function TeamBarChart({ period, reps, salesData }: TeamBarChartProps) {
  const combined = reps
    .map((r, i) => ({ ...r, val: getSalesForPeriod(salesData[i], period) }))
    .sort((a, b) => b.val - a.val);

  const max = Math.max(...combined.map((r) => r.val));
  const barH = 32;
  const gap = 8;
  const pad = 16;
  const maxW = 280;
  const chartH = combined.length * (barH + gap);

  return (
    <svg width="100%" viewBox={`0 0 380 ${chartH + pad * 2}`} style={{ overflow: 'visible' }}>
      {combined.map((r, rank) => {
        const bw = max > 0 ? (r.val / max) * maxW : 0;
        const y = pad + rank * (barH + gap);
        return (
          <g key={r.id}>
            <text x={0} y={y + barH * 0.7} fill="#6a8aaa" fontSize={11} fontFamily="var(--font-exo2, 'Exo 2')">{r.avatar}</text>
            <rect x={28} y={y} width={maxW} height={barH} rx={4} fill={r.color} opacity={0.1} />
            <motion.rect
              x={28}
              y={y}
              width={bw}
              height={barH}
              rx={4}
              fill={r.color}
              opacity={0.7}
              style={{ filter: `drop-shadow(0 0 4px ${r.color})` }}
              initial={{ width: 0 }}
              animate={{ width: bw }}
              transition={{ duration: 0.7, delay: rank * 0.07, ease: 'easeOut' }}
            />
            <text
              x={28 + bw + 6}
              y={y + barH * 0.7}
              fill={r.color}
              fontSize={11}
              fontFamily="var(--font-exo2, 'Exo 2')"
              fontWeight="700"
            >
              {fmtShort(r.val)}€
            </text>
          </g>
        );
      })}
    </svg>
  );
}
