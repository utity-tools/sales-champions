'use client';

import { useQuery } from '@tanstack/react-query';
import type { Targets } from '@/types';

export function useTargets() {
  return useQuery({
    queryKey: ['targets'],
    queryFn: async (): Promise<Targets> => {
      const res = await fetch('/api/targets');
      if (!res.ok) throw new Error('Error cargando targets');
      const row = await res.json();
      return {
        weekly: row.weekly,
        monthly: row.monthly,
        quarterly: row.quarterly,
        yearly: row.yearly,
        dealTarget: row.deal_target,
        convTarget: row.conv_target,
      };
    },
    staleTime: 60_000,
  });
}
