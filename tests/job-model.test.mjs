import assert from 'node:assert/strict';
import test from 'node:test';
import { jobSchema, monthlySalaryRange, toJobPosting } from '../src/lib/job-model.mjs';
import { syntheticJob } from './fixtures/job-record.mjs';

function assertInvalid(job, path) {
  const result = jobSchema.safeParse(job);
  assert.equal(result.success, false, `${path} muss ungültig sein`);
  assert.ok(result.error.issues.some((issue) => issue.path.join('.') === path));
}

test('accepts the complete active record', () => {
  assert.deepEqual(jobSchema.parse(syntheticJob()), syntheticJob());
});

for (const requiredField of Object.keys(syntheticJob())) {
  test(`rejects an active record without ${requiredField}`, () => {
    const job = syntheticJob();
    delete job[requiredField];
    assertInvalid(job, requiredField);
  });
}

test('rejects unsupported identity, status, schema version and editorial role', () => {
  assertInvalid({ ...syntheticJob(), employer: 'Beispielpraxis' }, 'employer');
  assertInvalid({ ...syntheticJob(), publication_status: 'DELETED' }, 'publication_status');
  assertInvalid({ ...syntheticJob(), schema_version: '2.0' }, 'schema_version');
  assertInvalid({ ...syntheticJob(), editorial_owner: 'Beispielperson' }, 'editorial_owner');
});

test('requires the canonical to match the HTTPS job route and accepts its IDN spelling', () => {
  const job = syntheticJob();
  const canonicals = [
    'http://xn--logopdiejobs-kcb.de/jobs/synthetische-logopaedie-stelle/',
    'https://logopaedie-simsek.de/jobs/synthetische-logopaedie-stelle/',
    'https://xn--logopdiejobs-kcb.de/jobs/andere-stelle/',
    `${job.canonical_url}?source=tracking`,
  ];
  for (const canonical_url of canonicals) {
    assertInvalid({ ...job, canonical_url }, 'canonical_url');
  }
  assert.equal(jobSchema.safeParse({
    ...job,
    canonical_url: 'https://logopädiejobs.de/jobs/synthetische-logopaedie-stelle/',
  }).success, true);
});

test('checks calendar validity, chronological order and an active expiry in the past', () => {
  assertInvalid({ ...syntheticJob(), published_at: '2020-02-30' }, 'published_at');
  assertInvalid({ ...syntheticJob(), published_at: '2099-01-01' }, 'published_at');
  assertInvalid({ ...syntheticJob(), last_reviewed_at: '2019-12-31' }, 'last_reviewed_at');
  assertInvalid({ ...syntheticJob(), last_reviewed_at: '2099-01-01' }, 'last_reviewed_at');
  assertInvalid({ ...syntheticJob(), expires_at: '2020-01-01' }, 'expires_at');
  assertInvalid({ ...syntheticJob(), expires_at: '2020-02-01' }, 'expires_at');
  assert.doesNotThrow(() => jobSchema.parse({ ...syntheticJob('EXPIRED'), expires_at: '2020-02-01' }));
});

test('rejects an inverted or nonpositive salary range in every publication state', () => {
  for (const status of ['DRAFT', 'ACTIVE']) {
    const job = syntheticJob(status);
    assertInvalid({ ...job, salary: { ...job.salary, min: 27 } }, 'salary.max');
    assertInvalid({ ...job, salary: { ...job.salary, min: 0 } }, 'salary.min');
    assertInvalid({ ...job, salary: { ...job.salary, unit: 'MONTH' } }, 'salary.unit');
  }
});

test('requires supported part-time figures or a negotiable schedule if part-time is offered', () => {
  assertInvalid({ ...syntheticJob(), weekly_hours: { full_time: 38.5 } }, 'weekly_hours.part_time');
  assertInvalid({
    ...syntheticJob(), weekly_hours: { full_time: 38.5, part_time: { min: 25, max: 20 } },
  }, 'weekly_hours.part_time.max');
  assertInvalid({
    ...syntheticJob(), weekly_hours: { full_time: 38.5, part_time: { min: 25, max: 40 } },
  }, 'weekly_hours.part_time.max');
  assert.doesNotThrow(() => jobSchema.parse({
    ...syntheticJob(), weekly_hours: { full_time: 38.5, part_time: { negotiable: true } },
  }));
});

test('requires a fixed-term end date and an exact tariff basis where applicable', () => {
  assertInvalid({ ...syntheticJob(), contract_type: 'FIXED_TERM' }, 'contract_ends_at');
  assertInvalid({ ...syntheticJob(), tariff_status: { status: 'TARIFF' } }, 'tariff_status.basis');
  assert.doesNotThrow(() => jobSchema.parse({
    ...syntheticJob(), tariff_status: { status: 'NO_TARIFF' },
  }));
});

test('rejects an active fixed-term job ending before publication', () => {
  assertInvalid({
    ...syntheticJob(), contract_type: 'FIXED_TERM', contract_ends_at: '2019-12-31',
  }, 'contract_ends_at');
});

test('rejects an active fixed-term job whose contract has already ended after publication', () => {
  assertInvalid({
    ...syntheticJob(), contract_type: 'FIXED_TERM', contract_ends_at: '2020-03-31',
  }, 'contract_ends_at');
  assert.doesNotThrow(() => jobSchema.parse({
    ...syntheticJob(), contract_type: 'FIXED_TERM', contract_ends_at: '2099-12-31',
  }));
});

test('requires concrete overtime compensation, travel conditions, and treatment-load figures', () => {
  assertInvalid({
    ...syntheticJob(), overtime_policy: { status: 'EXCEPTIONAL', compensation: 'Freizeitausgleich' },
  }, 'overtime_policy.compensation_period');
  assertInvalid({ ...syntheticJob(), home_visits: { status: 'OPTIONAL' } }, 'home_visits.travel_time');
  assertInvalid({
    ...syntheticJob(), treatment_load: { ...syntheticJob().treatment_load, min: 7 },
  }, 'treatment_load.max');
});

test('rejects a vague example week without numeric appointment figures and a defined period', () => {
  assertInvalid({
    ...syntheticJob(),
    treatment_load: { example_week: ['Nach Absprache'], buffer: 'Nach Bedarf' },
  }, 'treatment_load');
});

test('accepts a structured example week with an ordered appointment range and buffer', () => {
  const exampleWeek = { period: 'WEEK', min: 20, max: 30, buffer: 'Fünf Minuten je Termin' };
  const job = { ...syntheticJob(), treatment_load: { example_week: exampleWeek } };
  assert.deepEqual(jobSchema.parse(job).treatment_load, job.treatment_load);
  assertInvalid({
    ...job, treatment_load: { example_week: { ...exampleWeek, max: 15 } },
  }, 'treatment_load.example_week.max');
  assertInvalid({
    ...job, treatment_load: { example_week: { ...exampleWeek, period: 'DAY' } },
  }, 'treatment_load');
});

test('requires a secure privacy link for digital application routes', () => {
  const job = syntheticJob();
  delete job.privacy_notice_url;
  assertInvalid(job, 'privacy_notice_url');
  assert.doesNotThrow(() => jobSchema.parse({ ...job, application_routes: ['PHONE', 'POST'] }));
  assertInvalid({ ...job, privacy_notice_url: 'http://example.test/privacy/' }, 'privacy_notice_url');
});

test('allows missing operating conditions in drafts and rejects publication of the same record', () => {
  const job = syntheticJob('DRAFT');
  for (const field of [
    'tariff_status', 'treatment_load', 'overtime_policy', 'continuing_education', 'onboarding',
  ]) {
    delete job[field];
  }
  assert.equal(jobSchema.parse(job).publication_status, 'DRAFT');
  assertInvalid({ ...job, publication_status: 'ACTIVE' }, 'tariff_status');
});

test('derives monthly gross pay from hourly pay and full-time weekly hours', () => {
  assert.deepEqual(monthlySalaryRange(syntheticJob()), { min: 3837.17, max: 4337.67 });
  const job = syntheticJob();
  job.salary.min = 24;
  job.salary.max = 24;
  job.weekly_hours.full_time = 35;
  assert.deepEqual(monthlySalaryRange(job), { min: 3640, max: 3640 });
});

test('maps the source to serializable JobPosting markup with hourly salary and escaped description', () => {
  const job = jobSchema.parse(syntheticJob());
  const markup = toJobPosting(job);
  assert.deepEqual(JSON.parse(JSON.stringify(markup)), markup);
  assert.equal(markup['@context'], 'https://schema.org/');
  assert.equal(markup['@type'], 'JobPosting');
  assert.equal(markup.title, 'Synthetische Logopädie-Stelle');
  assert.equal(markup.url, 'https://xn--logopdiejobs-kcb.de/jobs/synthetische-logopaedie-stelle/');
  assert.equal(markup.datePosted, '2020-01-01');
  assert.equal(markup.validThrough, '2099-12-31');
  assert.equal(markup.directApply, true);
  assert.equal(markup.experienceRequirements, 'no requirements');
  assert.equal(markup.educationRequirements, 'Staatlich anerkannter Abschluss in Logopädie');
  assert.equal(markup.hiringOrganization.name, 'Praxis für Logopädie Şimşek');
  assert.equal(markup.identifier.value, 'TEST-01');
  assert.deepEqual(markup.employmentType, ['FULL_TIME', 'PART_TIME']);
  assert.equal(markup.workHours, 'Vollzeit: 38,5 Stunden pro Woche · Teilzeit: 16–32 Stunden pro Woche');
  assert.equal(markup.jobLocation.address.streetAddress, 'Beispielstraße 1');
  assert.deepEqual(markup.baseSalary, {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: { '@type': 'QuantitativeValue', minValue: 23, maxValue: 26, unitText: 'HOUR' },
  });
  assert.match(markup.description, /<p>Diagnostik &amp; Therapie im synthetischen Beispiel\.<\/p>/);
  assert.match(markup.description, /<li>Sprachdiagnostik durchführen<\/li>/);
  assert.match(markup.description, /<li>Staatlich anerkannter Abschluss in Logopädie<\/li>/);
  assert.match(markup.description, /Vollzeit: 38,5 Stunden pro Woche · Teilzeit: 16–32 Stunden pro Woche/);
  assert.match(markup.description, /Berufseinstieg möglich/);
  assert.equal('jobBenefits' in markup, false);
  assert.equal('industry' in markup, false);
  assert.equal('occupationalCategory' in markup, false);
});

test('does not advertise full-time hours when the posting only offers negotiable part-time', () => {
  const job = jobSchema.parse({
    ...syntheticJob(),
    employment_types: ['PART_TIME'],
    weekly_hours: { full_time: 38.5, part_time: { negotiable: true } },
  });
  assert.equal(toJobPosting(job).workHours, 'Teilzeit: Stundenumfang verhandelbar');
});
