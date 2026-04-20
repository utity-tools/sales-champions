'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Period, View, Rep, SalesData, Targets } from '@/types';
import { REPS, SALES_DATA, TARGETS, REP_BADGES } from '@/lib/data';

interface DateRange {
  from: string;
  to: string;
}

interface DashboardStore {
  // UI state
  view: View;
  period: Period;
  repIdx: number;
  dateRange: DateRange;
  // Data (editable via SuperAdmin)
  reps: Rep[];
  salesData: SalesData[];
  targets: Targets;
  badges: string[][];
  // Actions
  setView: (view: View) => void;
  setPeriod: (period: Period) => void;
  setRepIdx: (idx: number) => void;
  setDateRange: (from: string, to: string) => void;
  updateRep: (id: number, updates: Partial<Rep>) => void;
  addRep: (rep: Rep) => void;
  updateSalesData: (repId: number, updates: Partial<SalesData>) => void;
  updateTargets: (updates: Partial<Targets>) => void;
  updateBadges: (repIdx: number, badgeIds: string[]) => void;
  toggleBadge: (repIdx: number, badgeId: string) => void;
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
      reps: REPS,
      salesData: SALES_DATA,
      targets: TARGETS,
      badges: REP_BADGES,

      setView: (view) => set({ view }),
      setPeriod: (period) => set({ period }),
      setRepIdx: (repIdx) => set({ repIdx }),
      setDateRange: (from, to) => set({ dateRange: { from, to } }),

      updateRep: (id, updates) =>
        set((state) => ({
          reps: state.reps.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      addRep: (rep) =>
        set((state) => ({
          reps: [...state.reps, rep],
          salesData: [
            ...state.salesData,
            { repId: rep.id, week: 0, month: 0, quarter: 0, year: 0, deals: 0, avgT: 0, conv: 0, newCli: 0, streak: 0 },
          ],
          badges: [...state.badges, []],
        })),

      updateSalesData: (repId, updates) =>
        set((state) => ({
          salesData: state.salesData.map((d) => (d.repId === repId ? { ...d, ...updates } : d)),
        })),

      updateTargets: (updates) =>
        set((state) => ({ targets: { ...state.targets, ...updates } })),

      updateBadges: (repIdx, badgeIds) =>
        set((state) => {
          const next = [...state.badges];
          next[repIdx] = badgeIds;
          return { badges: next };
        }),

      toggleBadge: (repIdx, badgeId) =>
        set((state) => {
          const next = [...state.badges];
          const current = next[repIdx] ?? [];
          next[repIdx] = current.includes(badgeId)
            ? current.filter((b) => b !== badgeId)
            : [...current, badgeId];
          return { badges: next };
        }),
    }),
    {
      name: 'sales-arena-store',
      partialize: (state) => ({
        view: state.view,
        period: state.period,
        repIdx: state.repIdx,
        dateRange: state.dateRange,
        reps: state.reps,
        salesData: state.salesData,
        targets: state.targets,
        badges: state.badges,
      }),
    }
  )
);
