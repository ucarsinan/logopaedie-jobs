import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { jobSchema } from '../src/lib/job-model.mjs';
import { publicationArtifacts } from '../src/lib/job-publication-artifacts.mjs';
import { syntheticJob } from './fixtures/job-record.mjs';

const JOB_DETAIL_PATH = new URL('../src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro', import.meta.url);

test('the job detail renders only the publication adapter JobPosting', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.equal((detail.match(/'@type': 'JobPosting'/g) ?? []).length, 0);
  assert.match(detail, /publicationArtifacts\(job\)/);
  assert.match(detail, /jobPosting && <script[^>]+JSON\.stringify\(jobPosting\)/);
  assert.doesNotMatch(detail, /const jobPostingSchema\s*=/);
});

test('the publication adapter preserves the concrete JobPosting fields', () => {
  const { jobPosting } = publicationArtifacts(jobSchema.parse(syntheticJob('ACTIVE')));

  assert.equal(jobPosting['@type'], 'JobPosting');
  assert.equal(jobPosting.title, 'Synthetische Logopädie-Stelle');
  assert.equal(jobPosting.datePosted, '2020-01-01');
  assert.equal(jobPosting.validThrough, '2099-12-31');
  assert.equal(jobPosting.directApply, true);
  assert.equal(jobPosting.experienceRequirements, 'no requirements');
  assert.deepEqual(jobPosting.educationRequirements, {
    '@type': 'EducationalOccupationalCredential', credentialCategory: 'professional certificate',
  });
  assert.equal(jobPosting.qualifications, 'Staatlich anerkannter Abschluss in Logopädie');
  assert.deepEqual(jobPosting.employmentType, ['FULL_TIME', 'PART_TIME']);
  assert.equal(jobPosting.jobLocation.address.streetAddress, 'Beispielstraße 1');
  assert.equal(jobPosting.jobLocation.address.addressLocality, 'Musterstadt');
  assert.equal(jobPosting.jobLocation.address.addressCountry, 'DE');
  assert.equal(jobPosting.baseSalary.currency, 'EUR');
  assert.equal(jobPosting.baseSalary.value.minValue, 23);
  assert.equal(jobPosting.baseSalary.value.maxValue, 26);
  assert.equal(jobPosting.baseSalary.value.unitText, 'HOUR');
});
