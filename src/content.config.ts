// src/content.config.ts
// Astro v6 Content Collections — Konfiguration mit Glob-Loadern.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { jobSchema } from './lib/job-model.mjs';

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
    series: z.literal('fruehe-sprache').optional(),
    priority: z.number().int().min(0).default(100),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Redaktion'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroImageCaption: z.string().optional(),
    draft: z.boolean().default(false),
    relatedArticles: z.array(z.string()).optional(),
    definition: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

const arbeitsalltag = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/arbeitsalltag' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortTitle: z.string(),
    thumbnail: z.string(),
    articleImage: z.string(),
    imageAlt: z.string().min(1),
    order: z.number().int(),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/jobs' }),
  schema: jobSchema,
});

export const collections = { ratgeber, arbeitsalltag, jobs };
