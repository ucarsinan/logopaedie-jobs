import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  auditRepositories,
  toOwnershipCsv,
} from '../scripts/audit-platform-content.mjs';

function fixtureRepository(name, files) {
  const root = mkdtempSync(join(tmpdir(), `platform-audit-${name}-`));

  for (const [relativePath, content] of Object.entries(files)) {
    const path = join(root, relativePath);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, content);
  }

  return root;
}

function auditFixtures({ jobs = {}, practice = {} }) {
  return auditRepositories({
    jobsRoot: fixtureRepository('jobs', jobs),
    practiceRoot: fixtureRepository('practice', practice),
  });
}

test('finds duplicate JobPosting output across repositories', () => {
  const result = auditFixtures({
    jobs: {
      'src/pages/jobs/therapeutin.astro': '<script type="application/ld+json">{"@type":"JobPosting"}</script>',
    },
    practice: {
      'src/pages/karriere.astro': '<script type="application/ld+json">{"@type":"JobPosting"}</script>',
    },
  });

  assert.equal(result.jobPostingOccurrences.length, 2);
  assert.ok(result.duplicateIntentCandidates.some((candidate) => candidate.intent === 'career'));
});

test('classifies patient and career ownership separately', () => {
  const result = auditFixtures({
    jobs: {
      'src/pages/jobs/index.astro': '<title>Logopädie Jobs und Karriere</title>',
    },
    practice: {
      'src/pages/therapie/sprachstoerungen.astro': '<title>Therapie bei Sprachstörungen für Patient:innen</title>',
    },
  });

  const careerPage = result.pages.find((page) => page.repository === 'jobs');
  const patientPage = result.pages.find((page) => page.repository === 'practice');
  assert.equal(careerPage.intent, 'career');
  assert.equal(careerPage.ownerDomain, 'logopädiejobs.de');
  assert.equal(patientPage.intent, 'patient');
  assert.equal(patientPage.ownerDomain, 'logopaedie-simsek.de');
});

test('maps ratgeber content to the rendered berufshandbuch route without inventing other collection routes', () => {
  const result = auditFixtures({
    jobs: {
      'src/content/ratgeber/gehalt/nrw.md': '<title>Gehalt in NRW</title>',
      'src/content/internal/briefing.md': '<title>Interne Quelle</title>',
    },
  });

  assert.ok(result.pages.some((page) => page.url === '/berufshandbuch/gehalt/nrw/'));
  assert.ok(result.pages.some((page) => (
    page.url === 'NOT_FOUND:src/content/internal/briefing.md'
      && page.status === 'NOT_FOUND'
  )));
  assert.equal(result.pages.some((page) => page.url.startsWith('/content/')), false);
});

test('reports a career bridge that targets only the portal homepage', () => {
  const result = auditFixtures({
    practice: {
      'src/pages/karriere.astro': '<a href="https://logopädiejobs.de/">Offene Stellen</a>',
    },
  });

  assert.ok(result.crossDomainLinks.some((link) => (
    link.repository === 'practice'
      && link.target === 'https://logopädiejobs.de/'
      && link.homepageOnly === true
  )));
});

test('does not read env files, git metadata, dist, node_modules or application payloads', () => {
  const forbiddenMarker = 'FORBIDDEN_PRIVATE_MARKER';
  const result = auditFixtures({
    jobs: {
      '.env': forbiddenMarker,
      '.git/config': forbiddenMarker,
      'dist/index.html': forbiddenMarker,
      'node_modules/example/index.js': forbiddenMarker,
      'src/pages/bewerbung/senden/index.ts': forbiddenMarker,
      'src/pages/jobs/index.astro': '<title>Stellen</title>',
      'public/other.txt': forbiddenMarker,
    },
  });

  assert.equal(JSON.stringify(result).includes(forbiddenMarker), false);
  assert.equal(result.pages.length, 1);
});

test('emits stable CSV columns url,repository,audience,intent,owner_domain,canonical,cross_domain_cta,jobposting_count,status', () => {
  const result = auditFixtures({
    jobs: {
      'src/pages/jobs/index.astro': '<link rel="canonical" href="https://logopädiejobs.de/jobs/" />',
    },
  });

  const [header] = toOwnershipCsv(result).split('\n');
  assert.equal(
    header,
    'url,repository,audience,intent,owner_domain,canonical,cross_domain_cta,jobposting_count,status',
  );
});
