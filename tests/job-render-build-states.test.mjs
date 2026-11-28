import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

import { minimalInactiveJob, syntheticJob } from './fixtures/job-record.mjs';
import { jobSchema } from '../src/lib/job-model.mjs';
import { publicationArtifacts } from '../src/lib/job-publication-artifacts.mjs';

const execFileAsync = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
const routePath = 'jobs/logopaedin-sprachtherapeut-duisburg/index.html';
const practicePath = 'praxis/index.html';
const contactPath = 'kontakt/index.html';
const schoolsPath = 'schulen/index.html';
const recordPath = 'src/content/jobs/logopaedin-sprachtherapeut-duisburg.json';
const statusCopy = {
  DRAFT: 'noch nicht zur Bewerbung freigegeben',
  PAUSED: 'Diese Stelle ist derzeit pausiert',
  FILLED: 'Diese Stelle ist inzwischen besetzt',
  EXPIRED: 'Diese Stellenanzeige ist abgelaufen',
};

function pageFixture(status) {
  if (status !== 'ACTIVE') return minimalInactiveJob(status);
  return {
    ...syntheticJob('ACTIVE'),
    job_id: 'LOGO-JOB-DUI-TEST-ACTIVE',
    slug: 'logopaedin-sprachtherapeut-duisburg',
    canonical_url: 'https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/',
    title: 'Synthetische aktive Logopädie-Stelle',
  };
}

function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

function visibleFaq(html) {
  const match = html.match(/<section\b[^>]*\bid="faq"[^>]*>[\s\S]*?<\/section>/);
  assert.ok(match, 'Die gebaute ACTIVE-Seite muss einen sichtbaren FAQ-Abschnitt enthalten.');
  return match[0];
}

function visibleConditions(html) {
  const match = html.match(/<section\b[^>]*\bid="praxisalltag"[^>]*>[\s\S]*?<\/section>/);
  assert.ok(match, 'Die reale ACTIVE-Seite muss einen sichtbaren Abschnitt mit Stellenkonditionen enthalten.');
  return match[0];
}

function visiblePage(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/g, '');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('the normal build renders every authorized production condition from the real record', { timeout: 60_000 }, async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'logopaedie-jobs-production-build-'));
  try {
    await Promise.all([
      cp(join(root, 'src'), join(temporaryRoot, 'src'), { recursive: true }),
      cp(join(root, 'public'), join(temporaryRoot, 'public'), { recursive: true }),
      cp(join(root, 'astro.config.mjs'), join(temporaryRoot, 'astro.config.mjs')),
      cp(join(root, 'package.json'), join(temporaryRoot, 'package.json')),
      cp(join(root, 'tsconfig.json'), join(temporaryRoot, 'tsconfig.json')),
    ]);
    await symlink(join(root, 'node_modules'), join(temporaryRoot, 'node_modules'), 'dir');
    await execFileAsync(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], {
      cwd: temporaryRoot,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
      maxBuffer: 10 * 1024 * 1024,
    });

    const [html, practiceHtml, schoolsHtml, source] = await Promise.all([
      readFile(join(temporaryRoot, 'dist/client', routePath), 'utf8'),
      readFile(join(temporaryRoot, 'dist/client', practicePath), 'utf8'),
      readFile(join(temporaryRoot, 'dist/client', schoolsPath), 'utf8'),
      readFile(join(temporaryRoot, recordPath), 'utf8'),
    ]);
    const job = jobSchema.parse(JSON.parse(source));
    const { presentation } = publicationArtifacts(job);
    const conditionsHtml = visibleConditions(html);

    assert.deepEqual(Object.keys(presentation.conditions).sort(), [
      'contract', 'documentation', 'homeVisits', 'onboarding', 'overtime', 'reviewBoundary',
      'tariff', 'training', 'treatmentLoad', 'treatmentUnits', 'workModel',
    ]);
    for (const { text } of presentation.conditionItems) {
      assert.match(conditionsHtml, new RegExp(escapeRegExp(text)));
    }
    for (const label of [
      'Arbeitsmodell', 'Vertrag', 'Prüfstand der Anzeige',
      'Therapien pro Woche', 'Bezahlte Arbeitszeit', 'Hausbesuche',
      'Überstunden', 'Fortbildungen', 'Einarbeitung',
    ]) {
      assert.match(conditionsHtml, new RegExp(escapeRegExp(label)));
    }
    assert.doesNotMatch(conditionsHtml, /Behandlungseinheiten|Tarifbindung|kein Tarifvertrag|30, 45 oder 60 Minuten/);
    assert.doesNotMatch(conditionsHtml, /<dt>(?:reviewBoundary|treatmentLoad|homeVisits)<\/dt>/);

    assert.match(presentation.conditions.reviewBoundary, /25\.11\.2026/);
    assert.match(presentation.conditions.reviewBoundary, /18\.01\.2027/);
    assert.match(presentation.conditions.reviewBoundary, /weder ein Vertragsende noch das Ende der Suche/);
    assert.match(presentation.conditions.tariff, /kein Tarifvertrag/);
    assert.match(presentation.conditions.workModel, /38,5 Wochenstunden/);
    assert.match(presentation.conditions.workModel, /Montag bis Freitag/);
    assert.match(presentation.conditions.workModel, /flexibel individuell vereinbart/);
    assert.match(presentation.conditions.workModel, /Vier-Tage-Woche ist möglich/);
    assert.equal(presentation.conditions.contract, 'Unbefristet.');
    assert.match(presentation.conditions.treatmentUnits, /30, 45 oder 60 Minuten/);
    assert.match(presentation.conditions.treatmentLoad, /Bei einer Vollzeitstelle mit 38,5 Wochenstunden sind 42–45 Therapien pro Woche/);
    assert.match(presentation.conditions.documentation, /bezahlte Arbeitszeit/);
    assert.match(presentation.conditions.documentation, /Vor- und Nachbereitung/);
    assert.match(presentation.conditions.homeVisits, /freiwillig/);
    assert.match(presentation.conditions.homeVisits, /Fahrzeit.*bezahlte Arbeitszeit/);
    assert.match(presentation.conditions.homeVisits, /Fahrtkosten und Parkkosten.*erstattet/);
    assert.match(presentation.conditions.overtime, /nicht vorgesehen/);
    assert.match(presentation.conditions.overtime, /Freizeitausgleich oder Auszahlung/);
    assert.match(presentation.conditions.training, /Kurs- und Teilnahmegebühren.*übernommen/);
    assert.match(presentation.conditions.training, /zusätzliche freie Tage/i);
    assert.match(presentation.conditions.training, /wählt die Fortbildung/);
    assert.match(presentation.conditions.training, /Reise- und Übernachtungskosten.*nicht/);
    assert.match(presentation.conditions.onboarding, /schrittweise/);

    for (const publicHtml of [practiceHtml, schoolsHtml]) {
      assert.match(publicHtml, /ca\. 3\.840–4\.340 € brutto/);
      assert.match(publicHtml, /23–26 € brutto pro Stunde/);
      assert.doesNotMatch(publicHtml, /3\.840–4\.338 €|3\.840–4\.338 EUR/);
    }

    const practiceFaq = jsonLd(practiceHtml).find((entry) => entry['@type'] === 'FAQPage');
    assert.ok(practiceFaq, 'Die Praxisseite muss ihr FAQ-Schema weiterhin ausgeben.');
    const salaryFaq = practiceFaq.mainEntity.find((entry) => entry.name === 'Wie hoch ist das Gehalt?');
    assert.ok(salaryFaq, 'Das Praxis-FAQ-Schema muss die Gehaltsfrage enthalten.');
    assert.equal(
      salaryFaq.acceptedAnswer.text,
      'ca. 3.840–4.340 € brutto im Monat im rechnerischen Jahresmittel bei Vollzeit mit 38,5 Stunden, je nach Erfahrung. Die Grundlage sind 23–26 € brutto pro Stunde.',
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test('real Astro builds enforce every publication state without mutating the production record', { timeout: 120_000 }, async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'logopaedie-jobs-state-build-'));
  try {
    await Promise.all([
      cp(join(root, 'src'), join(temporaryRoot, 'src'), { recursive: true }),
      cp(join(root, 'public'), join(temporaryRoot, 'public'), { recursive: true }),
      cp(join(root, 'astro.config.mjs'), join(temporaryRoot, 'astro.config.mjs')),
      cp(join(root, 'package.json'), join(temporaryRoot, 'package.json')),
      cp(join(root, 'tsconfig.json'), join(temporaryRoot, 'tsconfig.json')),
    ]);
    await symlink(join(root, 'node_modules'), join(temporaryRoot, 'node_modules'), 'dir');

    for (const status of ['ACTIVE', 'DRAFT', 'PAUSED', 'FILLED', 'EXPIRED']) {
      await rm(join(temporaryRoot, 'dist'), { recursive: true, force: true });
      await rm(join(temporaryRoot, '.astro'), { recursive: true, force: true });
      await mkdir(join(temporaryRoot, 'src/content/jobs'), { recursive: true });
      await writeFile(join(temporaryRoot, recordPath), `${JSON.stringify(pageFixture(status), null, 2)}\n`);
      await execFileAsync(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], {
        cwd: temporaryRoot,
        env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
        maxBuffer: 10 * 1024 * 1024,
      });

      const [html, practiceHtml, schoolsHtml, contactHtml, sitemap] = await Promise.all([
        readFile(join(temporaryRoot, 'dist/client', routePath), 'utf8'),
        readFile(join(temporaryRoot, 'dist/client', practicePath), 'utf8'),
        readFile(join(temporaryRoot, 'dist/client', schoolsPath), 'utf8'),
        readFile(join(temporaryRoot, 'dist/client', contactPath), 'utf8'),
        readFile(join(temporaryRoot, 'dist/client/sitemap-0.xml'), 'utf8'),
      ]);
      const structuredData = jsonLd(html);
      const jobPostings = structuredData.filter((entry) => entry['@type'] === 'JobPosting');
      const faqPages = structuredData.filter((entry) => entry['@type'] === 'FAQPage');
      const sitemapContainsJob = sitemap.includes('/jobs/logopaedin-sprachtherapeut-duisburg/');

      if (status === 'ACTIVE') {
        const renderedPage = visiblePage(html);
        assert.match(html, /<meta name="robots" content="index, follow">/);
        assert.equal(jobPostings.length, 1);
        assert.equal(faqPages.length, 1);
        assert.match(html, /id="bewerbung-form"/);
        assert.equal(sitemapContainsJob, true);

        const posting = jobPostings[0];
        assert.equal(posting.title, 'Synthetische aktive Logopädie-Stelle');
        assert.equal(posting.datePosted, '2020-01-01');
        assert.equal(posting.validThrough, '2099-12-31');
        assert.deepEqual(posting.employmentType, ['FULL_TIME', 'PART_TIME']);
        assert.equal(posting.jobLocation.address.addressLocality, 'Musterstadt');
        assert.equal(posting.baseSalary.value.minValue, 23);
        assert.equal(posting.baseSalary.value.maxValue, 26);
        assert.equal(posting.baseSalary.value.unitText, 'HOUR');

        const faq = faqPages[0];
        const faqHtml = visibleFaq(html);
        assert.equal(faq.mainEntity.length, 3);
        assert.equal((faqHtml.match(/<details\b/g) ?? []).length, faq.mainEntity.length);
        for (const question of faq.mainEntity) {
          assert.match(faqHtml, new RegExp(escapeRegExp(question.name)));
          assert.match(faqHtml, new RegExp(escapeRegExp(question.acceptedAnswer.text)));
        }

        const contactFaq = faq.mainEntity.find((question) => question.name === 'Wie kann ich Kontakt aufnehmen?');
        assert.ok(contactFaq);
        assert.match(contactFaq.acceptedAnswer.text, /kurze Formular/);
        assert.match(contactFaq.acceptedAnswer.text, /telefonisch/);
        assert.doesNotMatch(contactFaq.acceptedAnswer.text, /WhatsApp|E-Mail|Post/);
        assert.doesNotMatch(faqHtml, /WhatsApp|E-Mail|Post/);

        assert.match(renderedPage, /Vollzeit mit 38,5 Wochenstunden/);
        assert.match(renderedPage, /Teilzeit mit 16–32 Wochenstunden/);
        assert.match(renderedPage, /Arbeitstage: Montag bis Freitag/);
        assert.match(renderedPage, /08:00 bis 17:00 Uhr/);
        assert.match(renderedPage, /Vier-Tage-Woche ist möglich/);
        assert.match(renderedPage, /Unbefristet\./);
        assert.doesNotMatch(renderedPage, /Therapieeinheiten dauern|Behandlungseinheiten|Tarifbindung|Tarifvertrag/);
        assert.doesNotMatch(renderedPage, /30, 45 oder 60 Minuten/);
        assert.doesNotMatch(renderedPage, /flexiblem Stundenumfang|flexibel individuell vereinbart/);
        assert.match(practiceHtml, /ca\. 3\.840–4\.340 € brutto/);
        assert.match(schoolsHtml, /ca\. 3\.840–4\.340 € brutto/);
        assert.match(contactHtml, /id="bewerbung-form"/);
        assert.match(practiceHtml, /Wir suchen mehrere/);
      } else {
        assert.match(html, /<meta name="robots" content="noindex, follow">/);
        assert.equal(jobPostings.length, 0);
        assert.equal(faqPages.length, 0);
        assert.doesNotMatch(html, /id="bewerbung-form"/);
        assert.doesNotMatch(contactHtml, /id="bewerbung-form"|Offene Stellen/);
        assert.match(contactHtml, new RegExp(statusCopy[status]));
        assert.equal(sitemapContainsJob, false);
        assert.match(html, new RegExp(statusCopy[status]));
        assert.doesNotMatch(practiceHtml, /23–26 €|3\.840–4\.340 €/);
        assert.doesNotMatch(schoolsHtml, /23–26 €|3\.840–4\.340 €/);
        assert.doesNotMatch(practiceHtml, /Logopädin gesucht|Wir suchen Logopäd:innen|Wir suchen mehrere/);
        assert.match(practiceHtml, /Karriereinformationen der Praxis für Logopädie Şimşek/);
      }
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
