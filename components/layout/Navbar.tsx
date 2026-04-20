'use client';

import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboardStore';
import { PeriodTabs } from './PeriodTabs';
import { DateRangePicker } from './DateRangePicker';

export function Navbar() {
  const { view, period, repIdx, reps, setView, setPeriod, setRepIdx } = useDashboardStore();

  return (
    <nav
      style={{
        background: '#0b1929',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        overflow: 'visible',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8, flexShrink: 0 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2,
            background: 'linear-gradient(90deg,#00e5ff,#00ff9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SALES ARENA
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 2,
            color: 'var(--muted)',
            borderLeft: '1px solid var(--border)',
            paddingLeft: 8,
            textTransform: 'uppercase',
          }}
        >
          Dashboard
        </div>
      </div>

      {/* View toggle */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          background: '#06101e',
          borderRadius: 8,
          padding: 3,
          border: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {(['personal', 'team'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setView(k)}
            style={{
              background: view === k ? 'linear-gradient(135deg,#00e5ff22,#b44fff22)' : 'transparent',
              border: view === k ? '1px solid #00e5ff44' : '1px solid transparent',
              color: view === k ? 'var(--text)' : 'var(--muted)',
              borderRadius: 6,
              padding: '5px 14px',
              fontSize: 12,
              fontFamily: 'inherit',
              cursor: 'pointer',
              fontWeight: view === k ? 700 : 400,
              transition: 'all .2s',
              whiteSpace: 'nowrap',
            }}
          >
            {k === 'personal' ? '👤 Mi Dashboard' : '🏆 Equipo'}
          </button>
        ))}
      </div>

      {/* Period tabs */}
      <PeriodTabs value={period} onChange={setPeriod} />

      {/* Date range picker */}
      <DateRangePicker />

      <div style={{ flex: 1 }} />

      {/* User selector — only in personal view */}
      {view === 'personal' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', marginRight: 4 }}>Usuario:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {reps.filter((r) => r.active).map((r, i) => (
              <button
                key={r.id}
                title={r.name}
                onClick={() => setRepIdx(i)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: repIdx === i ? `${r.color}33` : '#0b1929',
                  border: repIdx === i ? `2px solid ${r.color}` : '2px solid var(--border)',
                  color: repIdx === i ? r.color : 'var(--muted)',
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: repIdx === i ? `0 0 10px ${r.color}55` : 'none',
                  transition: 'all .2s',
                  flexShrink: 0,
                }}
              >
                {r.avatar}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SuperAdmin link */}
      <Link
        href="/admin"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          background: '#1a0a2e',
          border: '1px solid #b44fff44',
          borderRadius: 7,
          color: '#b44fff',
          fontSize: 11,
          fontFamily: 'inherit',
          textDecoration: 'none',
          padding: '5px 10px',
          transition: 'all .2s',
          flexShrink: 0,
        }}
      >
        ⚙️ Admin
      </Link>
    </nav>
  );
}
