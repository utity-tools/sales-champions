'use client';

import { motion } from 'framer-motion';

interface MiniBarChartProps {
  labels: string[];
  data: number[];
  color: string;
  height?: number;
}

export function MiniBarChart({ labels, data, color, height = 80 }: MiniBarChartProps) {
  const max = Math.max(...data) * 1.1;
  const barW = 32;
  const gap = 10;
  const pad = 10;
  const total = data.length * (barW + gap);

  return (
    <svg width="100%" viewBox={`0 0 ${total + pad * 2} ${height + 20}`} style={{ overflow: 'visible' }}>
      {data.map((v, i) => {
        const bh = (v / max) * (height - 10);
        const x = pad + i * (barW + gap);
        const y = height - bh;
        return (
          <g key={i}>
            <rect x={x} y={height} width={barW} height={0} rx={3} fill={color} opacity={0.2} />
            <motion.rect
              x={x}
              y={y}
              width={barW}
              height={bh}
              rx={3}
              fill={color}
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}
              initial={{ height: 0, y: height }}
              animate={{ height: bh, y }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
            />
            <text x={x + barW / 2} y={height + 14} textAnchor="middle" fill="#6a8aaa" fontSize={9} fontFamily="var(--font-exo2, 'Exo 2')">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
