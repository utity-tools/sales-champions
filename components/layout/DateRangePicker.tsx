'use client';

import { useState, useRef, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export function DateRangePicker() {
  const { dateRange, setDateRange } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fmtShortDate = (d: string) => {
    const [, m, day] = d.split('-');
    return `${day}/${m}`;
  };

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title={`${dateRange.from} → ${dateRange.to}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          background: '#0b1929',
          border: `1px solid ${open ? '#00e5ff44' : 'var(--border)'}`,
          borderRadius: 8,
          color: open ? 'var(--text)' : 'var(--muted)',
          fontSize: 11,
          fontFamily: 'inherit',
          cursor: 'pointer',
          padding: '5px 9px',
          transition: 'all .2s',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: 13 }}>📅</span>
        <span className="mono" style={{ fontSize: 10 }}>
          {fmtShortDate(dateRange.from)}→{fmtShortDate(dateRange.to)}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 300,
            background: '#0e2038',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 14,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-end',
            boxShadow: '0 8px 32px #00000099',
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4, letterSpacing: 1 }}>DESDE</div>
            <input
              type="date"
              value={dateRange.from}
              max={dateRange.to}
              onChange={(e) => setDateRange(e.target.value, dateRange.to)}
              style={{ fontSize: 11, padding: '5px 8px' }}
              className="mono"
            />
          </div>
          <div style={{ color: '#2a4570', fontSize: 16, paddingBottom: 8 }}>→</div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4, letterSpacing: 1 }}>HASTA</div>
            <input
              type="date"
              value={dateRange.to}
              min={dateRange.from}
              onChange={(e) => setDateRange(dateRange.from, e.target.value)}
              style={{ fontSize: 11, padding: '5px 8px' }}
              className="mono"
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: '#00e5ff22',
              border: '1px solid #00e5ff44',
              borderRadius: 6,
              color: '#00e5ff',
              fontSize: 11,
              fontFamily: 'inherit',
              cursor: 'pointer',
              padding: '6px 12px',
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
