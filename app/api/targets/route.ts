import { createClient } from '@/lib/supabase/server';
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

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('team_id');

  let query = supabase.from('targets').select('*');
  if (teamId) query = query.eq('team_id', teamId);

  const { data, error } = await query.single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const parsed = TargetSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { team_id, ...values } = parsed.data;

  const { data, error } = await supabase
    .from('targets')
    .upsert({ team_id, ...values }, { onConflict: 'team_id' })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
