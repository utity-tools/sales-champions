import { describe, it, expect } from 'vitest';
import {
  fmt,
  fmtShort,
  getSalesForPeriod,
  getTargetForPeriod,
  getRank,
  calcXP,
} from '@/lib/data';
import type { SalesData, Targets } from '@/types';

const mockSales: SalesData[] = [
  { repId: 1, week: 5000,  month: 20000, quarter: 60000, year: 240000, deals: 10, avgT: 2000, conv: 30, newCli: 3, streak: 5 },
  { repId: 2, week: 10000, month: 40000, quarter: 120000, year: 480000, deals: 20, avgT: 2000, conv: 40, newCli: 8, streak: 10 },
  { repId: 3, week: 2000,  month: 8000,  quarter: 24000,  year: 96000,  deals: 5,  avgT: 1600, conv: 20, newCli: 1, streak: 2 },
];

const mockTargets: Targets = {
  weekly: 12500,
  monthly: 50000,
  quarterly: 150000,
  yearly: 600000,
  dealTarget: 40,
  convTarget: 30,
};

describe('fmt', () => {
  it('formats millions with 2 decimal places', () => {
    expect(fmt(1_500_000)).toBe('1.50M€');
    expect(fmt(2_000_000)).toBe('2.00M€');
  });

  it('formats thousands with no decimals', () => {
    expect(fmt(1000)).toBe('1k€');
    expect(fmt(48200)).toBe('48k€');
  });

  it('formats sub-thousand as raw euros', () => {
    expect(fmt(500)).toBe('500€');
    expect(fmt(0)).toBe('0€');
  });
});

describe('fmtShort', () => {
  it('formats millions with 1 decimal place', () => {
    expect(fmtShort(1_500_000)).toBe('1.5M');
    expect(fmtShort(2_000_000)).toBe('2.0M');
  });

  it('formats thousands with no decimals', () => {
    expect(fmtShort(1000)).toBe('1k');
    expect(fmtShort(48200)).toBe('48k');
  });

  it('formats sub-thousand as plain number', () => {
    expect(fmtShort(500)).toBe('500');
    expect(fmtShort(0)).toBe('0');
  });
});

describe('getSalesForPeriod', () => {
  const data = mockSales[0];

  it('returns correct value for each period', () => {
    expect(getSalesForPeriod(data, 'week')).toBe(5000);
    expect(getSalesForPeriod(data, 'month')).toBe(20000);
    expect(getSalesForPeriod(data, 'quarter')).toBe(60000);
    expect(getSalesForPeriod(data, 'year')).toBe(240000);
  });
});

describe('getTargetForPeriod', () => {
  it('maps each period to the correct target', () => {
    expect(getTargetForPeriod(mockTargets, 'week')).toBe(12500);
    expect(getTargetForPeriod(mockTargets, 'month')).toBe(50000);
    expect(getTargetForPeriod(mockTargets, 'quarter')).toBe(150000);
    expect(getTargetForPeriod(mockTargets, 'year')).toBe(600000);
  });

  it('falls back to monthly for unknown period', () => {
    expect(getTargetForPeriod(mockTargets, 'unknown')).toBe(50000);
  });
});

describe('getRank', () => {
  it('returns 1 for the top rep', () => {
    expect(getRank(1, 'month', mockSales)).toBe(1);
  });

  it('returns 2 for the second rep', () => {
    expect(getRank(0, 'month', mockSales)).toBe(2);
  });

  it('returns 3 for the lowest rep', () => {
    expect(getRank(2, 'month', mockSales)).toBe(3);
  });
});

describe('calcXP', () => {
  it('calculates XP correctly', () => {
    expect(calcXP(1000, 10, 5)).toBe(1 + 100 + 25);
    expect(calcXP(0, 0, 0)).toBe(0);
    expect(calcXP(50000, 44, 21)).toBe(Math.round(50 + 440 + 105));
  });
});
