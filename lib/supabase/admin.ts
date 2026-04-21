import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Server-only client — bypasses RLS via service role key. Never expose to the browser.
export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
