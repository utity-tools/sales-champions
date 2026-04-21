import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

const CreateRepSchema = z.object({
  name: z.string().min(1),
  avatar: z.string().min(1),
  color: z.string(),
  role: z.string(),
  email: z.string().email(),
  team_id: z.string().uuid(),
});

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('reps')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();

  const parsed = CreateRepSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase.from('reps').insert(parsed.data).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
