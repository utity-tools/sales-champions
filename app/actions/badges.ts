'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const BadgeSchema = z.object({
  rep_id: z.number(),
  badge_id: z.string().min(1),
  team_id: z.string().uuid(),
});

export async function awardBadge(formData: unknown) {
  const parsed = BadgeSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('badges').insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

export async function revokeBadge(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('badges').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}
