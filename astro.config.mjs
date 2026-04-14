// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Deine Domain für die Sitemap-Generierung
  site: 'https://xn--logopdiejobs-kcb.de',

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