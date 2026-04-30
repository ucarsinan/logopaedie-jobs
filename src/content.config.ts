// src/content.config.ts
// Astro v6 Content Collections — Konfiguration mit Glob-Loadern.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ratgeber = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ratgeber' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kategorie: z
      .enum(['Gehalt', 'Arbeitszeit', 'Karriere', 'Fachwissen', 'Duisburg / NRW', 'Sonstiges'])
      .default('Karriere'),
    topic: z.enum([
      'karriere-bewerbung',
      'gehalt-arbeitsmodelle',
      'fachwissen-spezialisierung',
      'praxisalltag-region',
    ]),
    intent: z.enum(['gehalt', 'bewerbung', 'arbeitszeit', 'fachwissen', 'praxisalltag']),
    featured: z.boolean().default(false),
    priority: z.number().int().min(0).default(100),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Redaktion'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
    relatedArticles: z.array(z.string()).optional(),
    definition: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

// seiten-Collection wird angelegt, sobald der Bereich aktiv bespielt wird.

export const collections = { ratgeber };
