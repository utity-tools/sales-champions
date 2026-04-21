import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

const UpdateRepSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().min(1).optional(),
  color: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const body = await request.json();

  const parsed = UpdateRepSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reps')
    .update(parsed.data)
    .eq('id', Number(id))
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase.from('reps').update({ active: false }).eq('id', Number(id));
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
