'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { BadgeSchema } from '@/lib/schemas';

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
