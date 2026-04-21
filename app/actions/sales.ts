'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SaleSchema = z.object({
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

export async function createSale(formData: unknown) {
  const parsed = SaleSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('sales').insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteSale(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('sales').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}
