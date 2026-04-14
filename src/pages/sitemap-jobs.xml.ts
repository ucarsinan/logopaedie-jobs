import type { APIRoute } from 'astro';
import { getAdminClient } from '../lib/supabaseAdmin';

export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const supabase = getAdminClient();
  const { data: jobs } = await supabase
    .from('job_postings')
    .select('slug, created_at, valid_through')
    .eq('status', 'published');

  const urls = (jobs ?? [])
    .map((j) => {
      const loc = new URL(`/jobs/${j.slug}/`, site).toString();
      const lastmod = new Date(j.created_at).toISOString();
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq></url>`;
    })
    .join('');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
};
