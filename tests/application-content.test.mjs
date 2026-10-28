import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const CONTACT_PATH = new URL('../src/components/ApplicationContact.astro', import.meta.url);
const ALTERNATIVES_PATH = new URL('../src/components/ContactAlternatives.astro', import.meta.url);
const ABOUT_PATH = new URL('../src/components/About.astro', import.meta.url);
const TASKS_PATH = new URL('../src/components/Aufgaben.astro', import.meta.url);
const HERO_PATH = new URL('../src/components/Hero.astro', import.meta.url);
const QUICK_APPLY_PATH = new URL('../src/components/QuickApply.astro', import.meta.url);
const FAQ_PATH = new URL('../src/components/FaqSection.astro', import.meta.url);
const FAQ_SCHEMA_PATH = new URL('../src/components/FaqSchema.astro', import.meta.url);
const JOB_DETAIL_PATH = new URL('../src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro', import.meta.url);
const PRIVACY_PATH = new URL('../src/pages/datenschutz.astro', import.meta.url);
const THANK_YOU_PATH = new URL('../src/pages/bewerbung/danke.astro', import.meta.url);
const APPLICATION_ENDPOINT_PATH = new URL('../src/pages/bewerbung/senden/index.ts', import.meta.url);
const RESERVED_API_ENDPOINT_PATH = new URL('../src/pages/api/bewerbung/index.ts', import.meta.url);

const CONTACT_ANSWER = 'Über das kurze Formular auf unserer Kontaktseite auf LogopädieJobs.de, über WhatsApp, telefonisch unter +49 155 10062296, per E-Mail an social@logopaedie-simsek.de oder per Post an die Tonhallenstraße 21, 47051 Duisburg. Ein Lebenslauf ist freiwillig.';

test('the complete green application card links to the central form', async () => {
  const about = await readFile(ABOUT_PATH, 'utf8');

  assert.match(about, /<a[\s\S]*?href="\/kontakt\/"[\s\S]*?aria-label="Jetzt unverbindlich Kontakt aufnehmen"[\s\S]*?>[\s\S]*?Dabei\?[\s\S]*?Kennenlernen[\s\S]*?<\/a>/);
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
    [ALTERNATIVES_PATH, QUICK_APPLY_PATH, FAQ_PATH].map((path) => readFile(path, 'utf8')),
  );

  for (const source of sources) {
    assert.match(source, /RecruitingWhatsAppLink/);
    assert.match(source, /Schreib uns auf WhatsApp/);
    const callSite = source.match(/<RecruitingWhatsAppLink[\s\S]*?\/>/);
    assert.ok(callSite);
    assert.doesNotMatch(callSite[0], /(?:^|\s)(?:!?bg-|!?text-|!?border-(?:white|slate|simsek|emerald))/);
  }
});

test('home hero gives WhatsApp a full row above two secondary actions', async () => {
  const hero = await readFile(HERO_PATH, 'utf8');

  assert.match(hero, /grid grid-cols-2 gap-3 pt-4/);
  assert.match(hero, /<RecruitingWhatsAppLink[\s\S]*?label="Schreib uns auf WhatsApp"[\s\S]*?class="col-span-2 h-12 w-full"/);
  assert.match(hero, /href=\{RECRUITING_EMAIL_HREF\}[^>]*class="[^"]*w-full/);
  assert.match(hero, /href="\/jobs\/logopaedin-sprachtherapeut-duisburg\/"[^>]*class="[^"]*min-h-12[^"]*w-full/);
});

test('form errors do not draw a ring around the direct contact alternatives', async () => {
  const contact = await readFile(CONTACT_PATH, 'utf8');

  assert.doesNotMatch(contact, /alternatives\.classList\.add/);
  assert.doesNotMatch(contact, /showStatus\([^\n]*, true\)/);
});

test('shared alternatives stay before the embedded form and after the standalone form', async () => {
  const contact = await readFile(CONTACT_PATH, 'utf8');
  const form = contact.indexOf('<form id="bewerbung-form"');
  assert.ok(contact.indexOf('{!standalone && <ContactAlternatives />}') < form);
  assert.ok(contact.indexOf('{standalone && <ContactAlternatives />}') > form);
});

test('direct phone and email links are full-width and retain their decorative icons', async () => {
  const contact = await readFile(ALTERNATIVES_PATH, 'utf8');

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

  for (const source of [faq, schema]) assert.match(source, /über WhatsApp,/);
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

test('FAQ content points to the central contact page', async () => {
  const [faq, schema] = await Promise.all([
    readFile(FAQ_PATH, 'utf8'),
    readFile(FAQ_SCHEMA_PATH, 'utf8'),
  ]);

  for (const source of [faq, schema]) {
    assert.match(source, /Kontaktseite auf LogopädieJobs\.de/);
    assert.doesNotMatch(source, /Formular auf logopaedie-simsek\.de\/karriere/);
  }
  assert.match(faq, /href="\/kontakt\/"/);
});

test('native browser validation mirrors the required server-side contact shape', async () => {
  const contact = await readFile(CONTACT_PATH, 'utf8');

  assert.doesNotMatch(contact, /<form[^>]+novalidate/);
  assert.match(contact, /name="kontakt"[^>]+minlength="5"[^>]+maxlength="160"[^>]+pattern=\{CONTACT_PATTERN_SOURCE\}[^>]+required/);
});

test('the job landing makes qualification and salary conditions explicit', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');
  const hero = detail.match(/<section\b[^>]*id="preview-hero"[\s\S]*?<\/section>/)?.[0] ?? '';
  const qualification = detail.match(/<section\b[^>]*id="qualifikation"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(hero, /<h1\b[^>]*>[\s\S]*?Logopäd:in\?[\s\S]*?Sprachtherapeut:in \(m\/w\/d\)[\s\S]*?Arbeitsort: Duisburg[\s\S]*?<\/h1>/);
  assert.match(hero, /3\.840–4\.338 €/);
  assert.match(hero, /brutto\/Monat bei 38,5 Std\.\/Woche · je nach Erfahrung/);
  assert.match(hero, /Grundlage: 23–26 € brutto pro Stunde/);
  assert.match(qualification, /staatlich anerkannt und zugelassen/);
  assert.match(qualification, /sehr gute Deutschkenntnisse/);
  assert.match(qualification, /Berufserfahrung ist keine Voraussetzung/);
  assert.match(qualification, /href="\/schulen\/"/);
});

test('the production landing retains native metadata without preview blockers or build hashes', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.match(detail, /<Layout\b/);
  assert.match(detail, /set:html=\{JSON\.stringify\(jobPostingSchema\)\}/);
  assert.match(detail, /set:html=\{JSON\.stringify\(faqSchema\)\}/);
  assert.match(detail, /import .*recruiting-landing\.css/);
  assert.doesNotMatch(detail, /<meta\b[^>]*name="robots"[^>]*content="noindex/);
  assert.doesNotMatch(detail, /(?:id|class)="(?:preview-bar|preview-note)"/);
  assert.doesNotMatch(detail, /href="\/(?:bisher|vorher-v\d+|entwurf)\.html"/);
  assert.doesNotMatch(detail, /stopImmediatePropagation|Lokale Vorschau:|Dieser Link bleibt/);
  assert.doesNotMatch(detail, /(?:src|href|srcset)="\/_astro\//);
});

test('the everyday section presents six labeled employment facts with expandable details', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');
  const everyday = detail.match(/<section\b[^>]*id="praxisalltag"[\s\S]*?<\/section>/)?.[0] ?? '';
  const facts = everyday.match(/<dl class="short-facts">([\s\S]*?)<\/dl>/)?.[1] ?? '';
  const labels = [...facts.matchAll(/<dt\b[^>]*>[\s\S]*?<span>([^<]+)<\/span><\/dt>/g)].map(match => match[1]);

  assert.deepEqual(labels, ['Arbeitsmodell', 'Vertrag', 'Urlaub', 'Fortbildung', 'Eigenständig planen', 'Zeit für deine Arbeit']);
  assert.equal((facts.match(/<dd>/g) ?? []).length, 6);
  assert.match(facts, /30 Tage bei fünf Arbeitstagen, bei weniger Arbeitstagen anteilig/);
  assert.match(facts, /Dokumentation, Berichte und Organisation sind eingeplante Arbeitszeit/);
  assert.match(everyday, /<details class="short-full-details"><summary>Alle Details zu Arbeitsalltag und Ausstattung<\/summary>/);
});

test('the team section explains onboarding and keeps individual specialties accessible', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');
  const team = detail.match(/<section\b[^>]*id="team"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(team, /<h2\b[^>]*id="team-heading"[^>]*>Lerne Emel und unser Team kennen\.<\/h2>/);
  assert.match(team, /Strukturierte Einarbeitung<\/strong> und schrittweiser Terminaufbau/);
  assert.match(team, /jederzeit eine Ansprechperson/);
  assert.match(team, /Berufsanfänger:innen willkommen/);
  assert.match(team, /<details class="short-team-details"><summary>Team und fachliche Schwerpunkte<\/summary>/);
  for (const name of ['Mara Nießalla', 'Şeyma Bozoğlan', 'Kristina Imping', 'Emel Şimşek-Uçar']) assert.ok(team.includes(name));
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

test('the landing binds the native contact pattern without Astro string-escape loss', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');
  assert.match(detail, /import \{ CONTACT_PATTERN_SOURCE \} from '\.\.\/\.\.\/lib\/application-form\.mjs'/);
  assert.match(detail, /name="kontakt"[^>]*pattern=\{CONTACT_PATTERN_SOURCE\}[^>]*required/);
  assert.doesNotMatch(detail, /pattern="/);
});
