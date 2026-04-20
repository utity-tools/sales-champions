'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboardStore';
import { PeriodTabs } from './PeriodTabs';
import { DateRangePicker } from './DateRangePicker';

export function Navbar() {
  const { view, period, repIdx, reps, setView, setPeriod, setRepIdx } = useDashboardStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ── Reusable sub-components ─────────────────────────────────── */

  const ViewToggle = () => (
    <div style={{ display: 'flex', gap: 3, background: '#06101e', borderRadius: 8, padding: 3, border: '1px solid var(--border)', flexShrink: 0 }}>
      {(['personal', 'team'] as const).map((k) => (
        <button key={k} onClick={() => { setView(k); setDrawerOpen(false); }} style={{
          background: view === k ? 'linear-gradient(135deg,#00e5ff22,#b44fff22)' : 'transparent',
          border: view === k ? '1px solid #00e5ff44' : '1px solid transparent',
          color: view === k ? 'var(--text)' : 'var(--muted)',
          borderRadius: 6, padding: '5px 11px', fontSize: 12,
          fontFamily: 'inherit', cursor: 'pointer',
          fontWeight: view === k ? 700 : 400, transition: 'all .2s', whiteSpace: 'nowrap',
        }}>
          {k === 'personal' ? '👤 Mi Dashboard' : '🏆 Equipo'}
        </button>
      ))}
    </div>
  );

  const UserSelector = ({ wrap = false }: { wrap?: boolean }) => (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, flexWrap: wrap ? 'wrap' : 'nowrap' }}>
      <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>Usuario:</span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {reps.filter((r) => r.active).map((r, i) => (
          <button key={r.id} title={r.name}
            onClick={() => { setRepIdx(i); setDrawerOpen(false); }}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: repIdx === i ? `${r.color}33` : '#0b1929',
              border: repIdx === i ? `2px solid ${r.color}` : '2px solid var(--border)',
              color: repIdx === i ? r.color : 'var(--muted)',
              fontSize: 10, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: repIdx === i ? `0 0 10px ${r.color}55` : 'none',
              transition: 'all .2s', flexShrink: 0,
            }}>{r.avatar}</button>
        ))}
      </div>
    </div>
  );

  const AdminLink = () => (
    <Link href="/admin" style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: '#1a0a2e', border: '1px solid #b44fff44', borderRadius: 7,
      color: '#b44fff', fontSize: 11, fontFamily: 'inherit',
      textDecoration: 'none', padding: '5px 10px', transition: 'all .2s',
      flexShrink: 0, whiteSpace: 'nowrap',
    }}>⚙️ Admin</Link>
  );

  return (
    <nav className="nav-root">
      {/* ── Row 1 (always visible) ── */}
      <div className="nav-row1">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            fontSize: 18, fontWeight: 900, letterSpacing: 2,
            background: 'linear-gradient(90deg,#00e5ff,#00ff9d)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap',
          }}>SALES ARENA</div>
          <div className="nav-hide-mobile" style={{
            fontSize: 9, letterSpacing: 2, color: 'var(--muted)',
            borderLeft: '1px solid var(--border)', paddingLeft: 8, textTransform: 'uppercase',
          }}>Dashboard</div>
        </div>

        {/* Desktop: all controls in a single flex row */}
        <div className="nav-desktop-controls">
          <ViewToggle />
          <PeriodTabs value={period} onChange={setPeriod} />
          <DateRangePicker />
          <div style={{ flex: 1 }} />
          {view === 'personal' && <UserSelector />}
          <AdminLink />
        </div>

        {/* Tablet row-1 extras: view toggle + spacer + admin link */}
        <div className="nav-tablet-row1">
          <ViewToggle />
          <div style={{ flex: 1 }} />
          <AdminLink />
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setDrawerOpen((o) => !o)} aria-label="Menú">
          {drawerOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Row 2 (tablet only): period + date + users ── */}
      <div className="nav-row2">
        <PeriodTabs value={period} onChange={setPeriod} />
        <DateRangePicker />
        {view === 'personal' && <UserSelector />}
      </div>

      {/* ── Drawer (mobile only) ── */}
      <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="nav-drawer-row"><ViewToggle /></div>
        <div className="nav-drawer-row">
          <PeriodTabs value={period} onChange={setPeriod} />
          <DateRangePicker />
        </div>
        {view === 'personal' && (
          <div className="nav-drawer-row"><UserSelector wrap /></div>
        )}
        <div className="nav-drawer-row"><AdminLink /></div>
      </div>
    </nav>
  );
}
