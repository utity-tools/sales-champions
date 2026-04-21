import { createClient } from '@/lib/supabase/server';
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

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const teamId = searchParams.get('team_id');
  const period = searchParams.get('period');
  const repId = searchParams.get('rep_id');

  let query = supabase.from('sales').select('*').order('period_start', { ascending: false });

  if (teamId) query = query.eq('team_id', teamId);
  if (period) query = query.eq('period', period);
  if (repId) query = query.eq('rep_id', Number(repId));

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const parsed = SaleSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase.from('sales').insert(parsed.data).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
