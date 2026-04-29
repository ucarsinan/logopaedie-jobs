import type { APIRoute } from 'astro';
import { getAdminClient } from '../lib/supabaseAdmin';

export const prerender = false;

const staticJobs = [
  {
    slug: 'logopaedin-sprachtherapeut-duisburg',
    lastmod: '2026-04-29T00:00:00+02:00',
  },
];

export const GET: APIRoute = async ({ site }) => {
  let jobs: Array<{ slug: string; created_at: string }> = [];

  try {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('job_postings')
      .select('slug, created_at, valid_through')
      .eq('status', 'published');

    jobs = data ?? [];
  } catch {
    jobs = [];
  }

  const dynamicJobs = jobs.map((j) => ({
    slug: j.slug,
    lastmod: new Date(j.created_at).toISOString(),
  }));

  const jobsBySlug = new Map([...staticJobs, ...dynamicJobs].map((job) => [job.slug, job]));

  const urls = Array.from(jobsBySlug.values())
    .map((j) => {
      const loc = new URL(`/jobs/${j.slug}/`, site).toString();
      return `<url><loc>${loc}</loc><lastmod>${j.lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
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
