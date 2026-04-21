'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Period, View } from '@/types';

interface DateRange {
  from: string;
  to: string;
}

interface DashboardStore {
  view: View;
  period: Period;
  repIdx: number;
  dateRange: DateRange;
  setView: (view: View) => void;
  setPeriod: (period: Period) => void;
  setRepIdx: (idx: number) => void;
  setDateRange: (from: string, to: string) => void;
}

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      view: 'personal',
      period: 'month',
      repIdx: 0,
      dateRange: {
        from: firstOfMonth.toISOString().slice(0, 10),
        to: today.toISOString().slice(0, 10),
      },
      setView: (view) => set({ view }),
      setPeriod: (period) => set({ period }),
      setRepIdx: (repIdx) => set({ repIdx }),
      setDateRange: (from, to) => set({ dateRange: { from, to } }),
    }),
    {
      name: 'sales-arena-store',
      partialize: (state) => ({
        view: state.view,
        period: state.period,
        repIdx: state.repIdx,
        dateRange: state.dateRange,
      }),
    }
  )
);
