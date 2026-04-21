'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const TargetSchema = z.object({
  team_id: z.string().uuid(),
  weekly: z.number().positive(),
  monthly: z.number().positive(),
  quarterly: z.number().positive(),
  yearly: z.number().positive(),
  deal_target: z.number().int().positive(),
  conv_target: z.number().min(0).max(100),
});

export async function upsertTargets(formData: unknown) {
  const parsed = TargetSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const supabase = await createClient();
  const { team_id, ...values } = parsed.data;

  const { error } = await supabase
    .from('targets')
    .upsert({ team_id, ...values }, { onConflict: 'team_id' });

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/admin');
  return { success: true };
}
