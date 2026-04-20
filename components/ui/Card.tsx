'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  glow?: string;
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
  delay?: number;
}

export function Card({ children, glow, className = '', style = {}, animate = true, delay = 0 }: CardProps) {
  const base: React.CSSProperties = {
    background: 'var(--card)',
    border: `1px solid ${glow ? glow + '44' : 'var(--border)'}`,
    borderRadius: 12,
    padding: 16,
    boxShadow: glow
      ? `0 0 20px ${glow}22, inset 0 1px 0 ${glow}22`
      : '0 2px 8px #00000044',
    ...style,
  };

  if (!animate) {
    return (
      <div style={base} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      style={base}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
