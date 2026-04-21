import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('team_id');

  let query = supabase.from('rep_sales_summary').select('*');
  if (teamId) query = query.eq('team_id', teamId);

  const { data, error } = await query.order('total_amount', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
