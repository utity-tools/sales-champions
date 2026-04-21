import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const BadgeSchema = z.object({
  rep_id: z.number(),
  badge_id: z.string().min(1),
  team_id: z.string().uuid(),
});

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('team_id');
  const repId = searchParams.get('rep_id');

  let query = supabase.from('badges').select('*').order('awarded_at', { ascending: false });

  if (teamId) query = query.eq('team_id', teamId);
  if (repId) query = query.eq('rep_id', Number(repId));

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const parsed = BadgeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase.from('badges').insert(parsed.data).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
