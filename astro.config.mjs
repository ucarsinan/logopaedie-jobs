// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const excludedSitemapPaths = new Set([
  '/4-tage-woche/',
  '/bilingual/',
  '/datenschutz/',
  '/gehalt/',
  '/impressum/',
  '/jobs/neu/',
]);

const isPublicIndexablePage = (page) => {
  const { pathname } = new URL(page);
  return !pathname.startsWith('/admin/') && !excludedSitemapPaths.has(pathname);
};

export default defineConfig({
  site: 'https://xn--logopdiejobs-kcb.de',

  adapter: vercel(),

  integrations: [
    sitemap({
      customSitemaps: ['https://xn--logopdiejobs-kcb.de/sitemap-jobs.xml'],
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
