'use client';

import { motion } from 'framer-motion';
import type { BadgeDef } from '@/types';

interface BadgeIconProps {
  badge: BadgeDef;
  earned?: boolean;
  size?: number;
}

export function BadgeIcon({ badge, earned = true, size = 40 }: BadgeIconProps) {
  return (
    <motion.div
      title={`${badge.label}: ${badge.desc}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: earned ? 1 : 0.2, cursor: 'default' }}
      whileHover={earned ? { scale: 1.1 } : {}}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: earned
            ? `radial-gradient(circle at 35% 35%, ${badge.color}44, ${badge.color}11)`
            : '#1a3356',
          border: `2px solid ${earned ? badge.color : '#1a3356'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.42,
          boxShadow: earned ? `0 0 12px ${badge.color}55` : 'none',
          animation: earned ? 'glow-pulse 3s ease-in-out infinite' : 'none',
          color: badge.color,
        }}
      >
        {badge.icon}
      </div>
      <span
        style={{
          fontSize: 9,
          color: earned ? badge.color : 'var(--muted)',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: 48,
        }}
      >
        {badge.label}
      </span>
    </motion.div>
  );
}
