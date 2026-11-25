import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { jobSchema } from '../src/lib/job-model.mjs';
import { minimalInactiveJob, syntheticJob } from './fixtures/job-record.mjs';
import { publicationArtifacts } from '../src/lib/job-publication-artifacts.mjs';

const productionJobPath = new URL(
  '../src/content/jobs/logopaedin-sprachtherapeut-duisburg.json',
  import.meta.url,
);

test('the authorized production record is ACTIVE and publication-ready', async () => {
  const source = JSON.parse(await readFile(productionJobPath, 'utf8'));
  const job = jobSchema.parse(source);
  const artifacts = publicationArtifacts(job);

  assert.equal(job.publication_status, 'ACTIVE');
  assert.equal(job.published_at, '2026-09-27');
  assert.equal(job.last_reviewed_at, '2026-11-25');
  assert.equal(job.expires_at, '2027-01-18');
  assert.deepEqual(job.schedule.workdays, ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
  assert.equal(job.schedule.four_day_option, true);
  assert.doesNotMatch(job.schedule.regular_times.join(' '), /\b\d{1,2}:\d{2}\b/);
  assert.deepEqual(job.treatment_units.map(({ minutes }) => minutes), [30, 45, 60]);
  assert.equal(job.documentation_time.paid, true);
  assert.match(job.documentation_time.scope.join(' '), /Vor- und Nachbereitung/);
  assert.deepEqual(job.home_visits, {
    status: 'OPTIONAL',
    travel_time: 'Fahrzeit für freiwillige Hausbesuche ist bezahlte Arbeitszeit.',
    travel_costs: 'Fahrtkosten und Parkkosten werden erstattet.',
  });
  assert.match(job.team_support.join(' '), /Wöchentlicher.*Supervision/);
  assert.match(job.process_steps.join(' '), /Hospitation/);
  assert.equal(job.acknowledgement.method, 'AUTOMATIC');
  assert.match(job.acknowledgement.details, /Bewerbungs-Dankeseite/);

  assert.equal(artifacts.robots, 'index, follow');
  assert.equal(artifacts.includeInSitemap, true);
  assert.equal(artifacts.showApplication, true);
  assert.equal(artifacts.jobPosting?.validThrough, '2027-01-18');
  assert.equal(artifacts.faqPage?.['@type'], 'FAQPage');
});

for (const status of ['DRAFT', 'PAUSED', 'FILLED', 'EXPIRED']) {
  test(`${status} produces no public job artifacts`, () => {
    const artifacts = publicationArtifacts(jobSchema.parse(minimalInactiveJob(status)));
    assert.equal(artifacts.robots, 'noindex, follow');
    assert.equal(artifacts.includeInSitemap, false);
    assert.equal(artifacts.jobPosting, null);
    assert.equal(artifacts.faqPage, null);
    assert.equal(artifacts.showApplication, false);
    assert.equal(artifacts.presentation.active, null);
  });
}

test('ACTIVE produces the complete public artifact contract', () => {
  const artifacts = publicationArtifacts(syntheticJob('ACTIVE'));
  assert.equal(artifacts.robots, 'index, follow');
  assert.equal(artifacts.includeInSitemap, true);
  assert.equal(artifacts.showApplication, true);
  assert.equal(artifacts.jobPosting?.['@type'], 'JobPosting');
  assert.equal(artifacts.faqPage?.['@type'], 'FAQPage');
  assert.doesNotThrow(() => JSON.stringify(artifacts.jobPosting));
});

test('inactive presentation metadata and copy are truthful for every status', () => {
  const expected = {
    DRAFT: ['Entwurf', 'redaktionell geprüft', 'noch nicht zur Bewerbung freigegeben'],
    PAUSED: ['Pausiert', 'derzeit pausiert', 'aktuell nicht möglich'],
    FILLED: ['Besetzt', 'inzwischen besetzt', 'nicht mehr möglich'],
    EXPIRED: ['Abgelaufen', 'ist abgelaufen', 'aktuell nicht möglich'],
  };

  for (const [status, [label, descriptionFragment, noticeFragment]] of Object.entries(expected)) {
    const { presentation } = publicationArtifacts(jobSchema.parse(minimalInactiveJob(status)));
    assert.match(presentation.pageTitle, new RegExp(label));
    assert.match(presentation.pageDescription, new RegExp(descriptionFragment));
    assert.match(presentation.statusMessage, new RegExp(noticeFragment));
    assert.doesNotMatch(presentation.pageDescription, /Gehalt|Duisburg|bewirb|kennenlernen/i);
  }
});

test('page, sitemap and application endpoint do not branch independently on publication status', async () => {
  const [page, config, applicationRoute] = await Promise.all([
    readFile(new URL('../src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro', import.meta.url), 'utf8'),
    readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/bewerbung/senden/index.ts', import.meta.url), 'utf8'),
  ]);

  assert.doesNotMatch(page, /publication_status\s*[!=]==?/);
  assert.doesNotMatch(config, /publication_status\s*[!=]==?/);
  assert.match(page, /showApplication/);
  assert.match(config, /includeInSitemap/);
  assert.match(applicationRoute, /isApplicationOpen\(jobSource\)/);
  assert.match(applicationRoute, /acceptApplications:\s*\(\)\s*=>/);
  assert.doesNotMatch(applicationRoute, /publication_status\s*[!=]==?/);
});
