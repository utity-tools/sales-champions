import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const SaleSchema = z.object({
  rep_id: z.number(),
  amount: z.number().positive(),
  deal_count: z.number().int().nonnegative(),
  avg_ticket: z.number().nonnegative(),
  conversion: z.number().min(0).max(100),
  new_clients: z.number().int().nonnegative(),
  period: z.enum(['week', 'month', 'quarter', 'year']),
  period_start: z.string(),
  team_id: z.string().uuid(),
});

export const TargetSchema = z.object({
  team_id: z.string().uuid(),
  weekly: z.number().positive(),
  monthly: z.number().positive(),
  quarterly: z.number().positive(),
  yearly: z.number().positive(),
  deal_target: z.number().int().positive(),
  conv_target: z.number().min(0).max(100),
});

export const BadgeSchema = z.object({
  rep_id: z.number(),
  badge_id: z.string().min(1),
  team_id: z.string().uuid(),
});

export const CreateRepSchema = z.object({
  name: z.string().min(1),
  avatar: z.string().min(1).max(3),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  role: z.string().min(1),
  email: z.string().email(),
  team_id: z.string().uuid(),
});

export const UpdateRepSchema = CreateRepSchema.partial().extend({
  active: z.boolean().optional(),
});
