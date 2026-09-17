import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const JOB_DETAIL_PATH = new URL('../src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro', import.meta.url);

test('the public job detail exposes one truthful JobPosting schema', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.equal((detail.match(/'@type': 'JobPosting'/g) ?? []).length, 1);
  assert.match(detail, /JSON\.stringify\(jobPostingSchema\)/);
  assert.match(detail, /datePosted: '2026-04-29'/);
  assert.match(detail, /employmentType: \['FULL_TIME', 'PART_TIME'\]/);
  assert.match(detail, /directApply: true/);
  assert.match(detail, /streetAddress: 'Tonhallenstraße 21'/);
  assert.match(detail, /addressCountry: 'DE'/);
  assert.match(detail, /currency: 'EUR'/);
  assert.match(detail, /minValue: 23/);
  assert.match(detail, /maxValue: 26/);
  assert.match(detail, /unitText: 'HOUR'/);
  assert.doesNotMatch(detail, /validThrough:/);
});
