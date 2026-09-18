import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const CONTACT_PATH = new URL('../src/components/ApplicationContact.astro', import.meta.url);
const ABOUT_PATH = new URL('../src/components/About.astro', import.meta.url);
const TASKS_PATH = new URL('../src/components/Aufgaben.astro', import.meta.url);
const HERO_PATH = new URL('../src/components/Hero.astro', import.meta.url);
const QUICK_APPLY_PATH = new URL('../src/components/QuickApply.astro', import.meta.url);
const FAQ_PATH = new URL('../src/components/FaqSection.astro', import.meta.url);
const FAQ_SCHEMA_PATH = new URL('../src/components/FaqSchema.astro', import.meta.url);
const JOBS_INDEX_PATH = new URL('../src/pages/jobs/index.astro', import.meta.url);
const JOB_DETAIL_PATH = new URL('../src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro', import.meta.url);
const PRIVACY_PATH = new URL('../src/pages/datenschutz.astro', import.meta.url);
const THANK_YOU_PATH = new URL('../src/pages/bewerbung/danke.astro', import.meta.url);
const APPLICATION_ENDPOINT_PATH = new URL('../src/pages/bewerbung/senden/index.ts', import.meta.url);
const RESERVED_API_ENDPOINT_PATH = new URL('../src/pages/api/bewerbung/index.ts', import.meta.url);

const CONTACT_ANSWER = 'Über das kurze Formular direkt auf der konkreten Stellenanzeige auf LogopädieJobs.de, über WhatsApp für Bewerbungen, telefonisch unter +49 155 10062296, per E-Mail an social@logopaedie-simsek.de oder per Post an die Tonhallenstraße 21, 47051 Duisburg. Ein Lebenslauf ist freiwillig.';

test('the complete green application card links to the central form', async () => {
  const about = await readFile(ABOUT_PATH, 'utf8');

  assert.match(about, /<a[\s\S]*?href="\/jobs\/logopaedin-sprachtherapeut-duisburg\/#bewerbung"[\s\S]*?aria-label="Jetzt unverbindlich Kontakt aufnehmen"[\s\S]*?>[\s\S]*?Dabei\?[\s\S]*?Jetzt bewerben[\s\S]*?<\/a>/);
  assert.doesNotMatch(about, /<a href="\/#apply"/);
});

test('specialty cards use compact mobile headers and retain their desktop spacing', async () => {
  const tasks = await readFile(TASKS_PATH, 'utf8');

  assert.equal((tasks.match(/p-5 sm:p-8/g) ?? []).length, 4);
  assert.equal((tasks.match(/flex items-center gap-4 mb-4 sm:block sm:mb-0/g) ?? []).length, 4);
  assert.equal((tasks.match(/w-10 h-10 sm:w-12 sm:h-12/g) ?? []).length, 4);
  assert.equal((tasks.match(/w-5 h-5 sm:w-6 sm:h-6/g) ?? []).length, 4);
});

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

test('home hero adds WhatsApp beside email without adding a third action row', async () => {
  const hero = await readFile(HERO_PATH, 'utf8');

  assert.match(hero, /grid grid-cols-2 gap-3 pt-4/);
  assert.match(hero, /<RecruitingWhatsAppLink[\s\S]*?label="WhatsApp"[\s\S]*?class="w-full"/);
  assert.match(hero, /href=\{RECRUITING_EMAIL_HREF\}[^>]*class="[^"]*w-full/);
  assert.match(hero, /href="\/jobs\/logopaedin-sprachtherapeut-duisburg\/"[^>]*class="[^"]*col-span-2[^"]*w-full/);
});

test('form errors do not draw a ring around the direct contact alternatives', async () => {
  const contact = await readFile(CONTACT_PATH, 'utf8');

  assert.doesNotMatch(contact, /alternatives\.classList\.add/);
  assert.doesNotMatch(contact, /showStatus\([^\n]*, true\)/);
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

  assert.match(
    contact,
    /<a href="tel:\+4915510062296" data-contact-icon="phone" class="[^"]*min-h-11[^"]*w-full[^"]*focus[^"]*">\s*<svg[^>]*aria-hidden="true"/,
  );
  assert.match(
    contact,
    /<a href=\{RECRUITING_EMAIL_HREF\} data-contact-icon="mail" class="[^"]*min-h-11[^"]*w-full[^"]*focus[^"]*">\s*<svg[^>]*aria-hidden="true"/,
  );
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

test('job benefit cards place number and heading side by side on mobile', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.match(detail, /<div class="grid sm:grid-cols-2 gap-3 sm:gap-5">/);
  assert.equal((detail.match(/h-full p-4 sm:p-6 rounded-\[1\.9rem\]/g) ?? []).length, 1);
  assert.equal((detail.match(/flex items-center gap-3 mb-3 sm:block sm:mb-0/g) ?? []).length, 1);
  assert.match(detail, /w-10 h-10 sm:w-12 sm:h-12[^']*mb-0 sm:mb-5/);
  assert.match(detail, /<h3 class="text-lg sm:text-xl font-semibold text-slate-900 mb-0 sm:mb-3">\{title\}<\/h3>/);
});

test('job journey cards use compact numbered mobile headers', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.match(detail, /<div class="grid sm:grid-cols-2 gap-3 sm:gap-4">/);
  assert.equal((detail.match(/flex items-center gap-3 mb-2 sm:block sm:mb-0/g) ?? []).length, 1);
  assert.match(detail, /w-9 h-9 sm:w-auto sm:h-auto[^\n]*sm:mb-2/);
  assert.match(detail, /<h3 class="font-semibold text-slate-900 mb-0 sm:mb-2">\{title\}<\/h3>/);
});

test('thank-you page makes no public two-working-day promise', async () => {
  const thankYou = await readFile(THANK_YOU_PATH, 'utf8');

  assert.doesNotMatch(thankYou, /zwei (?:Arbeits|Werk)tagen/i);
  assert.match(thankYou, /Kontaktanfrage ist bei der Praxis eingegangen/);
});

test('application endpoint avoids Vercels reserved root API directory and supports trailing slashes', async () => {
  const [endpoint, contact] = await Promise.all([
    readFile(APPLICATION_ENDPOINT_PATH, 'utf8'),
    readFile(CONTACT_PATH, 'utf8'),
  ]);

  assert.match(endpoint, /export const POST/);
  assert.match(contact, /action="\/bewerbung\/senden\/"/);
  await assert.rejects(access(RESERVED_API_ENDPOINT_PATH));
});

test('the public response promise matches the internal deadline rule', async () => {
  const contact = await readFile(
    new URL('../src/components/ApplicationContact.astro', import.meta.url),
    'utf8',
  );
  const thanks = await readFile(
    new URL('../src/pages/bewerbung/danke.astro', import.meta.url),
    'utf8',
  );

  for (const source of [contact, thanks]) {
    assert.match(source, /Wir melden uns innerhalb von 12 Stunden/);
    // Die Nachtregel muss mitgenannt werden, sonst verspricht die Seite mehr
    // als die interne Frist aus DEC-135 hergibt.
    assert.match(source, /Anfragen zwischen 20 und 8 Uhr beantworten wir am Morgen\./);
    assert.match(source, /auch am Wochenende/);
  }
});
