'use client';

import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
}

const COLORS = ['#00e5ff', '#00ff9d', '#ffd600', '#ff6b35', '#b44fff', '#ff3d8b'];

export function Particles({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const newP: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 50 + (Math.random() - 0.5) * 30,
      tx: (Math.random() - 0.5) * 300,
      ty: -(Math.random() * 300 + 100),
      size: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setParticles(newP);
    const t = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: p.size,
            height: p.size,
            background: p.color,
            // @ts-expect-error CSS custom property
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
          }}
        />
      ))}
    </>
  );
}
