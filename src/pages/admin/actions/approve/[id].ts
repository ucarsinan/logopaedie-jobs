import type { APIRoute } from 'astro';
import { isAdminAuthenticated } from '../../../../lib/adminAuth';
import { getAdminClient } from '../../../../lib/supabaseAdmin';

export const prerender = false;

export const POST: APIRoute = async ({ params, cookies, redirect }) => {
  if (!isAdminAuthenticated(cookies)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response('Missing id', { status: 400 });

  const supabase = getAdminClient();
  const { error } = await supabase
    .from('job_postings')
    .update({ status: 'published' })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Optional: Vercel Deploy Hook triggern für ISR-Revalidierung
  const deployHook = import.meta.env.VERCEL_DEPLOY_HOOK_URL;
  if (deployHook) {
    await fetch(deployHook, { method: 'POST' }).catch(() => null);
  }

  return redirect('/admin/jobs/');
};
