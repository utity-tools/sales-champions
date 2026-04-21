'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { SaleSchema } from '@/lib/schemas';

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
