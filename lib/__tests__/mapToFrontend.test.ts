import { describe, it, expect } from 'vitest';
import { mapToFrontend } from '@/lib/hooks/useRepSummary';
import type { RepSummary } from '@/lib/supabase/types';

const mockRows: RepSummary[] = [
  {
    rep_id: 1,
    team_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Ana García',
    avatar: 'AG',
    color: '#00e5ff',
    role: 'Senior AE',
    active: true,
    week_sales: 11800,
    month_sales: 48200,
    quarter_sales: 138500,
    year_sales: 521000,
    deals: 31,
    avg_ticket: 1555,
    conversion: 35,
    new_clients: 12,
  },
  {
    rep_id: 2,
    team_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Carlos López',
    avatar: 'CL',
    color: '#00ff9d',
    role: 'AE',
    active: true,
    week_sales: 13900,
    month_sales: 57300,
    quarter_sales: 162000,
    year_sales: 610000,
    deals: 44,
    avg_ticket: 1302,
    conversion: 31,
    new_clients: 19,
  },
];

describe('mapToFrontend', () => {
  it('returns correct number of reps and salesData', () => {
    const { reps, salesData } = mapToFrontend(mockRows);
    expect(reps).toHaveLength(2);
    expect(salesData).toHaveLength(2);
  });

  it('maps rep fields correctly', () => {
    const { reps } = mapToFrontend(mockRows);
    expect(reps[0]).toEqual({
      id: 1,
      name: 'Ana García',
      avatar: 'AG',
      color: '#00e5ff',
      role: 'Senior AE',
      email: '',
      active: true,
    });
  });

  it('maps salesData fields correctly', () => {
    const { salesData } = mapToFrontend(mockRows);
    expect(salesData[0]).toEqual({
      repId: 1,
      week: 11800,
      month: 48200,
      quarter: 138500,
      year: 521000,
      deals: 31,
      avgT: 1555,
      conv: 35,
      newCli: 12,
      streak: 0,
    });
  });

  it('sets email to empty string (not in DB view)', () => {
    const { reps } = mapToFrontend(mockRows);
    reps.forEach((r) => expect(r.email).toBe(''));
  });

  it('sets streak to 0 (not in DB view)', () => {
    const { salesData } = mapToFrontend(mockRows);
    salesData.forEach((s) => expect(s.streak).toBe(0));
  });

  it('returns empty arrays for empty input', () => {
    const { reps, salesData } = mapToFrontend([]);
    expect(reps).toEqual([]);
    expect(salesData).toEqual([]);
  });

  it('preserves order from input', () => {
    const { reps } = mapToFrontend(mockRows);
    expect(reps[0].id).toBe(1);
    expect(reps[1].id).toBe(2);
  });
});
