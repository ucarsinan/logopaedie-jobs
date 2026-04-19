// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://xn--logopdiejobs-kcb.de',

  redirects: {
    '/gehalt/': '/ratgeber/gehalt-logopaedie-nrw/',
    '/4-tage-woche/': '/ratgeber/4-tage-woche-logopaedie/',
    '/bilingual/': '/ratgeber/bilinguale-sprachtherapie/',
  },

  adapter: vercel(),

  integrations: [sitemap()],

  // Konfiguration für die <Image /> Komponente
  image: {
    domains: ["logopädiejobs.de", "xn--logopdiejobs-kcb.de"],
  },

  vite: {
    plugins: [tailwindcss()]
  }
});