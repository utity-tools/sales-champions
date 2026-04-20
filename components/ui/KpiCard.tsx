'use client';

import { motion } from 'framer-motion';
import { Card } from './Card';

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon?: string;
  delay?: number;
}

export function KpiCard({ label, value, sub, color, icon, delay = 0 }: KpiCardProps) {
  return (
    <Card glow={color} style={{ textAlign: 'center', padding: '14px 12px' }} delay={delay}>
      {icon && <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>}
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' }}>
        {label}
      </div>
      <motion.div
        className="num"
        style={{ fontSize: 30, color, lineHeight: 1, marginBottom: 2, textShadow: `0 0 16px ${color}66` }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      >
        {value}
      </motion.div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>}
    </Card>
  );
}
