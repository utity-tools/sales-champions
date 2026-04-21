import { describe, it, expect } from 'vitest';
import {
  AuthSchema,
  SaleSchema,
  TargetSchema,
  BadgeSchema,
  CreateRepSchema,
  UpdateRepSchema,
} from '@/lib/schemas';

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('AuthSchema', () => {
  it('accepts valid credentials', () => {
    const result = AuthSchema.safeParse({ email: 'user@example.com', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = AuthSchema.safeParse({ email: 'not-an-email', password: 'secret123' });
    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe('Email inválido');
  });

  it('rejects password shorter than 8 chars', () => {
    const result = AuthSchema.safeParse({ email: 'user@example.com', password: 'short' });
    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe('Mínimo 8 caracteres');
  });
});

describe('SaleSchema', () => {
  const valid = {
    rep_id: 1,
    amount: 1000,
    deal_count: 5,
    avg_ticket: 200,
    conversion: 35,
    new_clients: 2,
    period: 'month' as const,
    period_start: '2026-04-01',
    team_id: VALID_UUID,
  };

  it('accepts a valid sale', () => {
    expect(SaleSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects negative amount', () => {
    const result = SaleSchema.safeParse({ ...valid, amount: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid period', () => {
    const result = SaleSchema.safeParse({ ...valid, period: 'biweekly' });
    expect(result.success).toBe(false);
  });

  it('rejects conversion > 100', () => {
    const result = SaleSchema.safeParse({ ...valid, conversion: 101 });
    expect(result.success).toBe(false);
  });

  it('rejects non-uuid team_id', () => {
    const result = SaleSchema.safeParse({ ...valid, team_id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejects fractional deal_count', () => {
    const result = SaleSchema.safeParse({ ...valid, deal_count: 1.5 });
    expect(result.success).toBe(false);
  });
});

describe('TargetSchema', () => {
  const valid = {
    team_id: VALID_UUID,
    weekly: 12500,
    monthly: 50000,
    quarterly: 150000,
    yearly: 600000,
    deal_target: 40,
    conv_target: 30,
  };

  it('accepts valid targets', () => {
    expect(TargetSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects zero for weekly target', () => {
    expect(TargetSchema.safeParse({ ...valid, weekly: 0 }).success).toBe(false);
  });

  it('rejects conv_target > 100', () => {
    expect(TargetSchema.safeParse({ ...valid, conv_target: 101 }).success).toBe(false);
  });

  it('rejects fractional deal_target', () => {
    expect(TargetSchema.safeParse({ ...valid, deal_target: 40.5 }).success).toBe(false);
  });
});

describe('BadgeSchema', () => {
  const valid = { rep_id: 1, badge_id: 'deal10', team_id: VALID_UUID };

  it('accepts valid badge', () => {
    expect(BadgeSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty badge_id', () => {
    expect(BadgeSchema.safeParse({ ...valid, badge_id: '' }).success).toBe(false);
  });

  it('rejects non-uuid team_id', () => {
    expect(BadgeSchema.safeParse({ ...valid, team_id: 'bad' }).success).toBe(false);
  });
});

describe('CreateRepSchema', () => {
  const valid = {
    name: 'Ana García',
    avatar: 'AG',
    color: '#00e5ff',
    role: 'Senior AE',
    email: 'ana@empresa.com',
    team_id: VALID_UUID,
  };

  it('accepts a valid rep', () => {
    expect(CreateRepSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects avatar longer than 3 chars', () => {
    expect(CreateRepSchema.safeParse({ ...valid, avatar: 'ABCD' }).success).toBe(false);
  });

  it('rejects invalid hex color', () => {
    expect(CreateRepSchema.safeParse({ ...valid, color: 'red' }).success).toBe(false);
    expect(CreateRepSchema.safeParse({ ...valid, color: '#gg0000' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(CreateRepSchema.safeParse({ ...valid, email: 'bad-email' }).success).toBe(false);
  });
});

describe('UpdateRepSchema', () => {
  it('accepts partial updates', () => {
    expect(UpdateRepSchema.safeParse({ name: 'New Name' }).success).toBe(true);
    expect(UpdateRepSchema.safeParse({ active: false }).success).toBe(true);
    expect(UpdateRepSchema.safeParse({}).success).toBe(true);
  });

  it('still validates fields when provided', () => {
    expect(UpdateRepSchema.safeParse({ color: 'notacolor' }).success).toBe(false);
    expect(UpdateRepSchema.safeParse({ email: 'bad' }).success).toBe(false);
  });
});
