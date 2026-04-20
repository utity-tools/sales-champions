import { z } from 'zod';

export type Period = 'week' | 'month' | 'quarter' | 'year';
export type View = 'personal' | 'team';

export const RepSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string(),
  color: z.string(),
  role: z.string(),
  email: z.string().email(),
  active: z.boolean(),
});
export type Rep = z.infer<typeof RepSchema>;

export const SalesDataSchema = z.object({
  repId: z.number(),
  week: z.number(),
  month: z.number(),
  quarter: z.number(),
  year: z.number(),
  deals: z.number(),
  avgT: z.number(),
  conv: z.number(),
  newCli: z.number(),
  streak: z.number(),
});
export type SalesData = z.infer<typeof SalesDataSchema>;

export const TargetsSchema = z.object({
  weekly: z.number(),
  monthly: z.number(),
  quarterly: z.number(),
  yearly: z.number(),
  dealTarget: z.number(),
  convTarget: z.number(),
});
export type Targets = z.infer<typeof TargetsSchema>;

export const BadgeDefSchema = z.object({
  id: z.string(),
  icon: z.string(),
  label: z.string(),
  desc: z.string(),
  color: z.string(),
});
export type BadgeDef = z.infer<typeof BadgeDefSchema>;

export const WeeklySalesChartSchema = z.object({
  labels: z.array(z.string()),
  data: z.array(z.array(z.number())),
});
export type WeeklySalesChart = z.infer<typeof WeeklySalesChartSchema>;

export interface TeamStats {
  totalSales: number;
  totalDeals: number;
  avgPerRep: number;
  teamTargetPct: number;
}
