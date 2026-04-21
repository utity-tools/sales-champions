'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthSchema } from '@/lib/schemas';

export interface AuthState {
  error?: string;
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Mensaje genérico — no revelar si el email existe o no
    return { error: 'Credenciales incorrectas' };
  }

  redirect('/dashboard');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
