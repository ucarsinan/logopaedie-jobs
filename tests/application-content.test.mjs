import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const CONTACT_PATH = new URL('../src/components/ApplicationContact.astro', import.meta.url);
const QUICK_APPLY_PATH = new URL('../src/components/QuickApply.astro', import.meta.url);
const FAQ_PATH = new URL('../src/components/FaqSection.astro', import.meta.url);
const FAQ_SCHEMA_PATH = new URL('../src/components/FaqSchema.astro', import.meta.url);
const JOBS_INDEX_PATH = new URL('../src/pages/jobs/index.astro', import.meta.url);
const JOB_DETAIL_PATH = new URL('../src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro', import.meta.url);
const PRIVACY_PATH = new URL('../src/pages/datenschutz.astro', import.meta.url);
const THANK_YOU_PATH = new URL('../src/pages/bewerbung/danke.astro', import.meta.url);
const APPLICATION_API_INDEX_PATH = new URL('../src/pages/api/bewerbung/index.ts', import.meta.url);
const APPLICATION_API_FILE_PATH = new URL('../src/pages/api/bewerbung.ts', import.meta.url);

const CONTACT_ANSWER = 'Über das kurze Formular direkt auf der konkreten Stellenanzeige auf LogopädieJobs.de, über WhatsApp für Bewerbungen, telefonisch unter +49 155 10062296, per E-Mail an social@logopaedie-simsek.de oder per Post an die Tonhallenstraße 21, 47051 Duisburg. Ein Lebenslauf ist freiwillig.';

test('all recruiting contact surfaces use the shared WhatsApp CTA without color overrides', async () => {
  const sources = await Promise.all(
    [CONTACT_PATH, QUICK_APPLY_PATH, FAQ_PATH, JOBS_INDEX_PATH].map((path) => readFile(path, 'utf8')),
  );

  for (const source of sources) {
    assert.match(source, /RecruitingWhatsAppLink/);
    assert.match(source, /WhatsApp für Bewerbungen/);
    const callSite = source.match(/<RecruitingWhatsAppLink[\s\S]*?\/>/);
    assert.ok(callSite);
    assert.doesNotMatch(callSite[0], /(?:^|\s)(?:!?bg-|!?text-|!?border-(?:white|slate|simsek|emerald))/);
  }
});

test('direct contact alternatives precede the form on mobile and remain below the intro on desktop', async () => {
  const contact = await readFile(CONTACT_PATH, 'utf8');
  const alternativesStart = contact.indexOf('<div id="bewerbung-alternativen"');
  const alternatives = contact.slice(alternativesStart, contact.indexOf('<script'));
  const formCardStart = contact.indexOf('rounded-3xl bg-white');

  assert.match(contact, /class="[^\"]*lg:grid-cols-\[minmax\(0,1\.1fr\)_minmax\(300px,0\.9fr\)\][^\"]*"/);
  assert.match(contact, /class="[^\"]*lg:col-start-1[^\"]*lg:row-start-1[^\"]*"/);
  assert.match(contact, /<div id="bewerbung-alternativen" class="[^\"]*order-2[^\"]*lg:col-start-1[^\"]*lg:row-start-2/);
  assert.match(contact, /class="[^\"]*order-3[^\"]*lg:col-start-2[^\"]*lg:row-start-1[^\"]*lg:row-span-2[^\"]*"/);
  assert.ok(alternativesStart < formCardStart);
  assert.doesNotMatch(alternatives, /sm:grid-cols-3/);
});

test('direct phone and email links are full-width and retain their decorative icons', async () => {
  const contact = await readFile(CONTACT_PATH, 'utf8');

  for (const [href, icon] of [
    ['tel:\\+4915510062296', 'phone'],
    ['mailto:social@logopaedie-simsek\\.de', 'mail'],
  ]) {
    assert.match(
      contact,
      new RegExp(`<a href="${href}" data-contact-icon="${icon}" class="[^\"]*min-h-11[^\"]*w-full[^\"]*focus[^\"]*">\\s*<svg[^>]*aria-hidden="true"`),
    );
  }
});

test('FAQ, schema and privacy describe WhatsApp as recruiting-only', async () => {
  const [faq, schema, privacy] = await Promise.all(
    [FAQ_PATH, FAQ_SCHEMA_PATH, PRIVACY_PATH].map((path) => readFile(path, 'utf8')),
  );

  for (const source of [faq, schema]) assert.match(source, /WhatsApp für Bewerbungen/);
  assert.match(privacy, /ausschließlich für Bewerbungen/i);
  assert.match(privacy, /keine Gesundheitsdaten/i);
  assert.match(privacy, /sechs Monate/i);
  assert.match(privacy, /mailto:social@logopaedie-simsek\.de/);
});

test('all FAQ contact-way enumerations use the same WhatsApp-inclusive answer', async () => {
  const [faq, schema, detail] = await Promise.all(
    [FAQ_PATH, FAQ_SCHEMA_PATH, JOB_DETAIL_PATH].map((path) => readFile(path, 'utf8')),
  );

  for (const source of [faq, schema, detail]) assert.ok(source.includes(CONTACT_ANSWER));
});

test('FAQ content points to the central form on the concrete job page', async () => {
  const [faq, schema] = await Promise.all([
    readFile(FAQ_PATH, 'utf8'),
    readFile(FAQ_SCHEMA_PATH, 'utf8'),
  ]);

  for (const source of [faq, schema]) {
    assert.match(source, /konkreten Stellenanzeige auf LogopädieJobs\.de/);
    assert.doesNotMatch(source, /Formular auf logopaedie-simsek\.de\/karriere/);
  }
  assert.match(faq, /href="\/jobs\/logopaedin-sprachtherapeut-duisburg\/#bewerbung"/);
});

test('native browser validation mirrors the required server-side contact shape', async () => {
  const contact = await readFile(CONTACT_PATH, 'utf8');

  assert.doesNotMatch(contact, /<form[^>]+novalidate/);
  assert.match(contact, /name="kontakt"[^>]+minlength="5"[^>]+maxlength="160"[^>]+pattern=\{CONTACT_PATTERN_SOURCE\}[^>]+required/);
});

test('job status pill is hidden below sm and uses the plural availability label', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.match(detail, /<div class="[^"]*\bhidden sm:flex\b[^"]*">[\s\S]*?<span[^>]*>Stellen verfügbar<\/span>/);
  assert.doesNotMatch(detail, />Stelle Aktiv<\/span>/);
});

test('hero facts and model pill use compact mobile spacing with desktop defaults restored', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.match(detail, /<dl class="mt-8 sm:mt-14 grid sm:grid-cols-3 gap-3 sm:gap-4">/);
  assert.match(detail, /<div class="p-px rounded-\[1rem\] sm:rounded-3xl bg-simsek-green ">[\s\S]*?<div class="h-full rounded-\[calc\(1rem-1px\)\] sm:rounded-\[calc\(1\.5rem-1px\)\] bg-white p-3 sm:p-5 shadow-sm">/);
  assert.doesNotMatch(detail, /<div class="p-px rounded-2xl sm:rounded-3xl bg-simsek-green ">/);
  assert.match(detail, /<dt class="text-\[10px\] sm:text-xs[^\"]*">/);
  assert.match(detail, /<dd class="text-xl sm:text-2xl[^\"]*">/);
  assert.match(detail, /<p class="text-xs sm:text-sm[^\"]*">\{note\}<\/p>/);
  assert.match(detail, /<div class="absolute -bottom-6 left-2 md:-left-4 xl:-left-10 bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl/);
  assert.match(detail, /<p class="text-\[10px\] md:text-xs[^\"]*uppercase/);
  assert.match(detail, /<p class="text-sm md:text-base font-bold/);
});

test('thank-you page makes no public two-working-day promise', async () => {
  const thankYou = await readFile(THANK_YOU_PATH, 'utf8');

  assert.doesNotMatch(thankYou, /zwei (?:Arbeits|Werk)tagen/i);
  assert.match(thankYou, /Kontaktanfrage ist bei der Praxis eingegangen/);
});

test('application endpoint is an index route compatible with the global trailing slash policy', async () => {
  const endpoint = await readFile(APPLICATION_API_INDEX_PATH, 'utf8');

  assert.match(endpoint, /export const POST/);
  await assert.rejects(access(APPLICATION_API_FILE_PATH));
});
