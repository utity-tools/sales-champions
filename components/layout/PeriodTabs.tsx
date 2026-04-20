'use client';

import type { Period } from '@/types';

const OPTS: { k: Period; l: string }[] = [
  { k: 'week', l: 'Semana' },
  { k: 'month', l: 'Mes' },
  { k: 'quarter', l: 'Trim.' },
  { k: 'year', l: 'Año' },
];

interface PeriodTabsProps {
  value: Period;
  onChange: (p: Period) => void;
}

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#0b1929', borderRadius: 8, padding: 3 }}>
      {OPTS.map((o) => (
        <button
          key={o.k}
          onClick={() => onChange(o.k)}
          style={{
            background: value === o.k ? '#1a3356' : 'transparent',
            border: value === o.k ? '1px solid #2a4570' : '1px solid transparent',
            color: value === o.k ? 'var(--text)' : 'var(--muted)',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            fontFamily: 'inherit',
            cursor: 'pointer',
            fontWeight: value === o.k ? 700 : 400,
            boxShadow: value === o.k ? '0 0 8px #00e5ff22' : 'none',
            transition: 'all .2s',
            whiteSpace: 'nowrap',
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
