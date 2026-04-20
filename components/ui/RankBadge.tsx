'use client';

interface RankBadgeProps {
  rank: number;
  size?: number;
}

const RANK_COLORS: Record<number, string> = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' };
const RANK_LABELS: Record<number, string> = { 1: '👑', 2: '🥈', 3: '🥉' };

export function RankBadge({ rank, size = 48 }: RankBadgeProps) {
  const c = RANK_COLORS[rank] ?? '#6a8aaa';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${c}44, ${c}11)`,
        border: `2px solid ${c}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        boxShadow: `0 0 16px ${c}66`,
        animation: rank <= 3 ? 'glow-pulse 2s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }}
    >
      {rank <= 3 ? (
        <span style={{ fontSize: size * 0.4 }}>{RANK_LABELS[rank]}</span>
      ) : (
        <span className="num" style={{ fontSize: size * 0.35, fontWeight: 900, color: c }}>
          #{rank}
        </span>
      )}
    </div>
  );
}
