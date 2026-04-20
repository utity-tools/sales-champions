'use client';

import { motion } from 'framer-motion';
import { fmt } from '@/lib/data';

interface ProgressBarProps {
  value: number;
  target: number;
  color: string;
  label: string;
  sublabel?: string;
}

export function ProgressBar({ value, target, color, label, sublabel }: ProgressBarProps) {
  const pct = Math.min((value / target) * 100, 100);
  const over = value > target;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span style={{ color: over ? '#00ff9d' : color, fontWeight: 700 }}>
          <span className="num">{fmt(value)}</span>
          <span style={{ color: 'var(--muted)', fontWeight: 400 }}> / {fmt(target)}</span>
          {over && <span style={{ marginLeft: 6, color: '#00ff9d', fontSize: 11 }}>✓ SUPERADO</span>}
        </span>
      </div>
      <div style={{ height: 8, background: '#1a3356', borderRadius: 4, overflow: 'visible', position: 'relative' }}>
        <motion.div
          style={{
            height: '100%',
            borderRadius: 4,
            background: over ? `linear-gradient(90deg,${color},#00ff9d)` : color,
            boxShadow: `0 0 8px ${color}`,
            position: 'relative',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {pct >= 5 && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translate(50%, -50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: over ? '#00ff9d' : color,
                boxShadow: `0 0 10px ${over ? '#00ff9d' : color}`,
              }}
            />
          )}
        </motion.div>
      </div>
      {sublabel && (
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, textAlign: 'right' }}>{sublabel}</div>
      )}
    </div>
  );
}
