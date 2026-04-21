'use client';

import { useQuery } from '@tanstack/react-query';

interface BadgeRow {
  id: number;
  rep_id: number;
  badge_id: string;
  team_id: string;
  awarded_at: string;
}

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async (): Promise<Map<number, string[]>> => {
      const res = await fetch('/api/badges');
      if (!res.ok) throw new Error('Error cargando badges');
      const rows: BadgeRow[] = await res.json();

      const byRep = new Map<number, string[]>();
      for (const row of rows) {
        const existing = byRep.get(row.rep_id) ?? [];
        byRep.set(row.rep_id, [...existing, row.badge_id]);
      }
      return byRep;
    },
    staleTime: 60_000,
  });
}
