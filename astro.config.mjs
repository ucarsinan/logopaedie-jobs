// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import jobSource from './src/content/jobs/logopaedin-sprachtherapeut-duisburg.json' with { type: 'json' };
import { jobSchema } from './src/lib/job-model.mjs';
import { publicationArtifacts } from './src/lib/job-publication-artifacts.mjs';

const JOB_PATH = '/jobs/logopaedin-sprachtherapeut-duisburg/';
const job = jobSchema.parse(jobSource);
const { includeInSitemap } = publicationArtifacts(job);

const excludedSitemapPaths = new Set([
  '/4-tage-woche/',
  '/bewerbung/danke/',
  '/bilingual/',
  '/datenschutz/',
  '/gehalt/',
  '/impressum/',
  '/jobs/',
  '/jobs/neu/',
]);

const isPublicIndexablePage = (page) => {
  const { pathname } = new URL(page);
  if (pathname === JOB_PATH) return includeInSitemap;
  return !pathname.startsWith('/admin/') && !excludedSitemapPaths.has(pathname);
};

export default defineConfig({
  site: 'https://xn--logopdiejobs-kcb.de',
  trailingSlash: 'always',

  adapter: vercel(),

  integrations: [
    sitemap({
      filter: isPublicIndexablePage,
    }),
  ],

  // Konfiguration für die <Image /> Komponente
  image: {
    domains: ["logopädiejobs.de", "xn--logopdiejobs-kcb.de"],
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
