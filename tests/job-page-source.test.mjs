import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pagePath = new URL('../src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro', import.meta.url);
const configPath = new URL('../astro.config.mjs', import.meta.url);

test('job detail consumes the validated record and publication artifacts', async () => {
  const page = await readFile(pagePath, 'utf8');

  assert.match(page, /import jobSource from ['"]\.\.\/\.\.\/content\/jobs\/logopaedin-sprachtherapeut-duisburg\.json['"]/);
  assert.match(page, /jobSchema\.parse\(jobSource\)/);
  assert.match(page, /publicationArtifacts\(job\)/);
  assert.match(page, /robots=\{robots\}/);
  assert.match(page, /jobPosting &&/);
  assert.match(page, /faqPage &&/);
  assert.match(page, /presentation\.statusMessage/);
  assert.doesNotMatch(page, /const jobPostingSchema\s*=/);
  assert.doesNotMatch(page, /salary\.hourly_(?:min|max)/);
  assert.doesNotMatch(page, /job\.(?:location|salary|weekly_hours)/);
});

test('sitemap consumes includeInSitemap from the same publication adapter', async () => {
  const config = await readFile(configPath, 'utf8');

  assert.match(config, /logopaedin-sprachtherapeut-duisburg\.json/);
  assert.match(config, /jobSchema\.parse\(jobSource\)/);
  assert.match(config, /publicationArtifacts\(job\)/);
  assert.match(config, /includeInSitemap/);
  assert.match(config, /JOB_PATH/);
});

test('job page no longer maintains the old rounded monthly range as an independent source', async () => {
  const page = await readFile(pagePath, 'utf8');

  assert.doesNotMatch(page, /3\.840[–-]4\.338/);
  assert.match(page, /gerundet|Jahresmittel/);
});
