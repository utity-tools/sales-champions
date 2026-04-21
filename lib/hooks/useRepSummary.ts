'use client';

import { useQuery } from '@tanstack/react-query';
import type { Rep, SalesData } from '@/types';
import type { RepSummary } from '@/lib/supabase/types';

export function mapToFrontend(rows: RepSummary[]): { reps: Rep[]; salesData: SalesData[] } {
  const reps: Rep[] = rows.map((r) => ({
    id: r.rep_id,
    name: r.name,
    avatar: r.avatar,
    color: r.color,
    role: r.role,
    email: '',
    active: r.active,
  }));

  const salesData: SalesData[] = rows.map((r) => ({
    repId: r.rep_id,
    week: r.week_sales,
    month: r.month_sales,
    quarter: r.quarter_sales,
    year: r.year_sales,
    deals: r.deals,
    avgT: r.avg_ticket,
    conv: r.conversion,
    newCli: r.new_clients,
    streak: 0,
  }));

  return { reps, salesData };
}

export function useRepSummary() {
  return useQuery({
    queryKey: ['rep-summary'],
    queryFn: async () => {
      const res = await fetch('/api/summary');
      if (!res.ok) throw new Error('Error cargando datos');
      const rows: RepSummary[] = await res.json();
      return mapToFrontend(rows);
    },
    staleTime: 60_000,
  });
}
