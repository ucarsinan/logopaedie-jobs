import type { APIRoute } from 'astro';
import { getAdminClient } from '../../../lib/supabaseAdmin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization');
  const secret = import.meta.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = getAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('job_postings')
    .update({ status: 'expired' })
    .eq('status', 'published')
    .lt('valid_through', today)
    .select('id, slug');

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ ok: true, expired: data?.length ?? 0, ids: data }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
