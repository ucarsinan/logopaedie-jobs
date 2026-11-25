import assert from 'node:assert/strict';
import test from 'node:test';
import { jobSchema } from '../src/lib/job-model.mjs';
import { isApplicationOpen, publicationArtifacts } from '../src/lib/job-publication-artifacts.mjs';
import { minimalInactiveJob, syntheticJob } from './fixtures/job-record.mjs';

for (const status of ['DRAFT', 'PAUSED', 'FILLED', 'EXPIRED']) {
  test(`${status} excludes the posting from indexing, sitemap, markup and applications`, () => {
    const artifacts = publicationArtifacts(jobSchema.parse(minimalInactiveJob(status)));
    assert.equal(artifacts.robots, 'noindex, follow');
    assert.equal(artifacts.includeInSitemap, false);
    assert.equal(artifacts.jobPosting, null);
    assert.equal(artifacts.faqPage, null);
    assert.equal(artifacts.showApplication, false);
    assert.equal(artifacts.presentation.active, null);
  });
}

test('ACTIVE supplies the robots directive, sitemap entry, ready-to-render markup and application', () => {
  const artifacts = publicationArtifacts(jobSchema.parse(syntheticJob()));
  assert.deepEqual(Object.keys(artifacts).sort(), [
    'faqPage', 'includeInSitemap', 'jobPosting', 'presentation', 'robots', 'showApplication',
  ]);
  assert.equal(artifacts.robots, 'index, follow');
  assert.equal(artifacts.includeInSitemap, true);
  assert.equal(artifacts.showApplication, true);
  assert.equal(artifacts.faqPage?.['@type'], 'FAQPage');
  assert.equal(artifacts.presentation.active?.monthlySalaryLabel, 'ca. 3.840–4.340 €');
  assert.match(artifacts.presentation.pageDescription, /ca\. 3\.840–4\.340 €/);
  assert.doesNotMatch(artifacts.presentation.pageDescription, /auf Cent gerundet/);
  assert.equal(
    artifacts.presentation.conditions.workModel,
    'Vollzeit mit 38,5 Wochenstunden. Teilzeit mit 16–32 Wochenstunden. Arbeitstage: Montag bis Freitag. 08:00 bis 17:00 Uhr. Eine Vier-Tage-Woche ist möglich.',
  );
  assert.equal(artifacts.presentation.conditions.contract, 'Unbefristet.');
  assert.equal(
    artifacts.presentation.conditions.treatmentUnits,
    'Therapieeinheiten dauern 45 Minuten (Einzelbehandlung).',
  );
  assert.equal(
    artifacts.presentation.conditions.treatmentLoad,
    'Bei einer Vollzeitstelle mit 38,5 Wochenstunden sind 4–6 Therapien pro Tag vorgesehen. Fünf Minuten je Termin',
  );
  assert.deepEqual(
    artifacts.presentation.conditionItems.map(({ key }) => key),
    ['workModel', 'contract', 'reviewBoundary', 'treatmentLoad', 'documentation', 'homeVisits', 'overtime', 'training', 'onboarding'],
  );
  assert.equal(artifacts.presentation.active?.fourDayOptionLabel, 'Vier-Tage-Woche möglich');
  const markup = JSON.parse(JSON.stringify(artifacts.jobPosting));
  assert.equal(markup['@type'], 'JobPosting');
  assert.equal(markup.url, 'https://xn--logopdiejobs-kcb.de/jobs/synthetische-logopaedie-stelle/');
  assert.equal(markup.validThrough, '2099-12-31');
  assert.equal(markup.baseSalary.value.unitText, 'HOUR');
});

test('application availability closes after validThrough and remains open through that date in Berlin', () => {
  const job = { ...syntheticJob('ACTIVE'), expires_at: '2026-11-25' };

  assert.equal(isApplicationOpen(job, new Date('2026-11-25T22:59:59Z')), true);
  assert.equal(isApplicationOpen(job, new Date('2026-11-25T23:00:00Z')), false);
  assert.equal(publicationArtifacts(job, { now: new Date('2026-11-25T23:00:00Z') }).showApplication, false);
});

test('NOT_EXPECTED overtime keeps proper nouns and nouns capitalized', () => {
  const source = syntheticJob();
  source.overtime_policy = {
    status: 'NOT_EXPECTED',
    compensation: 'Freizeitausgleich oder Auszahlung nach individueller Vereinbarung',
    compensation_period: 'Flexibel nach individueller Vereinbarung; keine starre Ausgleichsfrist',
  };
  const { presentation } = publicationArtifacts(jobSchema.parse(source));

  assert.match(presentation.conditions.overtime, /flexibel nach individueller Vereinbarung/);
  assert.doesNotMatch(presentation.conditions.overtime, /individueller vereinbarung|starre ausgleichsfrist/);
});
