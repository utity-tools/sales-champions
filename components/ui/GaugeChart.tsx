'use client';

import { motion } from 'framer-motion';

interface GaugeChartProps {
  value: number;
  max: number;
  color: string;
  size?: number;
}

export function GaugeChart({ value, max, color, size = 120 }: GaugeChartProps) {
  const pct = Math.min(value / max, 1);
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size * 0.56;
  const startAngle = -200;
  const totalAngle = 220;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcPath = (start: number, end: number, radius: number) => {
    const x1 = cx + radius * Math.cos(toRad(start));
    const y1 = cy + radius * Math.sin(toRad(start));
    const x2 = cx + radius * Math.cos(toRad(end));
    const y2 = cy + radius * Math.sin(toRad(end));
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const filledEnd = startAngle + Math.max(totalAngle * pct, 0.01);

  return (
    <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
      {/* Track */}
      <path
        d={arcPath(-200, 20, r)}
        fill="none"
        stroke="#1a3356"
        strokeWidth={size * 0.06}
        strokeLinecap="round"
      />
      {/* Fill */}
      <motion.path
        d={arcPath(-200, filledEnd, r)}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.06}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.16}
        fontFamily="var(--font-exo2, 'Exo 2')"
        fontWeight="800"
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}
