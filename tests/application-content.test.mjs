import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const CONTACT_PATH = new URL('../src/components/ApplicationContact.astro', import.meta.url);
const ALTERNATIVES_PATH = new URL('../src/components/ContactAlternatives.astro', import.meta.url);
const REQUIREMENTS_PATH = new URL('../src/components/Anforderungen.astro', import.meta.url);
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

test('the practice profile links to the central form and the job details', async () => {
  const section = await readFile(REQUIREMENTS_PATH, 'utf8');
  assert.match(section, /id="apply"/);
  assert.match(section, /href="\/kontakt\/"/);
  assert.match(section, /href="\/jobs\/logopaedin-sprachtherapeut-duisburg\/"/);
});

test('the practice profile explains the four specialties and links to bilingual therapy', async () => {
  const tasks = await readFile(TASKS_PATH, 'utf8');
  for (const field of ['Kindersprache', 'Neurologie', 'Redefluss', 'Beratung']) {
    assert.ok(tasks.includes(field));
  }
  assert.match(tasks, /<dl class="praxis-fachgebiete">/);
  assert.match(tasks, /href="\/berufshandbuch\/bilinguale-sprachtherapie\/"/);
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

test('both contact routes render the same form with alternatives after it', async () => {
  const [component, standalone, job] = await Promise.all(
    [CONTACT_PATH, new URL('../src/pages/kontakt.astro', import.meta.url), JOB_DETAIL_PATH].map(path => readFile(path, 'utf8')),
  );
  assert.match(standalone, /<ApplicationContact standalone \/>/);
  assert.match(job, /<ApplicationContact \/>/);
  assert.match(component, /<form id="bewerbung-form"[\s\S]*?<\/form>[\s\S]*?<ContactAlternatives \/>/);
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

test('homepage FAQs retain their answer while the job FAQ renders the route-aware presentation', async () => {
  const [faq, schema, detail] = await Promise.all(
    [FAQ_PATH, FAQ_SCHEMA_PATH, JOB_DETAIL_PATH].map((path) => readFile(path, 'utf8')),
  );

  for (const source of [faq, schema]) assert.ok(source.includes(CONTACT_ANSWER));
  assert.match(detail, /presentation\.faqs\.map\(\(\[question, answer\]\)/);
  assert.equal(detail.includes(CONTACT_ANSWER), false);
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
  assert.match(hero, /\{presentation\.active\.monthlySalaryLabel\}/);
  assert.match(hero, /brutto\/Monat im Jahresmittel · je nach Erfahrung/);
  assert.doesNotMatch(hero, /auf Cent gerundet/);
  assert.match(hero, /Grundlage: \{presentation\.active\.hourlySalaryLabel\} brutto pro Stunde/);
  assert.match(qualification, /staatlich anerkannten Abschluss/);
  assert.match(qualification, /keine eigene Praxiszulassung/);
  assert.match(qualification, /sehr gute Deutschkenntnisse/);
  assert.match(qualification, /Berufserfahrung ist keine Voraussetzung/);
  assert.match(qualification, /href="\/schulen\/"/);
});

test('the production landing retains native metadata without preview blockers or build hashes', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');

  assert.match(detail, /<Fachportal\b/);
  assert.match(detail, /jobPosting && <script[^>]+set:html=\{JSON\.stringify\(jobPosting\)\}/);
  assert.match(detail, /faqPage && <script[^>]+set:html=\{JSON\.stringify\(faqPage\)\}/);
  assert.match(detail, /robots=\{robots\}/);
  assert.match(detail, /import .*recruiting-landing\.css/);
  assert.doesNotMatch(detail, /(?:id|class)="(?:preview-bar|preview-note)"/);
  assert.doesNotMatch(detail, /href="\/(?:bisher|vorher-v\d+|entwurf)\.html"/);
  assert.doesNotMatch(detail, /stopImmediatePropagation|Lokale Vorschau:|Dieser Link bleibt/);
  assert.doesNotMatch(detail, /(?:src|href|srcset)="\/_astro\//);
});

test('the everyday section renders validated conditions alongside leave and practical details', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');
  const everyday = detail.match(/<section\b[^>]*id="praxisalltag"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(everyday, /presentation\.conditionItems\.map/);
  assert.match(everyday, /30 Tage bei fünf Arbeitstagen, bei weniger Arbeitstagen anteilig/);
  assert.match(everyday, /Mit iPrax legst du Termine, Pausen und Puffer selbst fest/);
  assert.match(everyday, /<details class="short-full-details"><summary>Alle Details zu Arbeitsalltag und Ausstattung<\/summary>/);
});

test('the team section explains onboarding and keeps individual specialties accessible', async () => {
  const detail = await readFile(JOB_DETAIL_PATH, 'utf8');
  const team = detail.match(/<section\b[^>]*id="team"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(team, /<h2\b[^>]*id="team-heading"[^>]*>Lerne Emel und unser Team kennen\.<\/h2>/);
  assert.match(team, /Strukturierte Einarbeitung/);
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

for (const [name, path] of [
  ['contact form', CONTACT_PATH],
  ['thank-you page', THANK_YOU_PATH],
]) {
  test(`${name} promises a personal response within one working day`, async () => {
    const source = await readFile(path, 'utf8');
    const promises = source.match(/<p\b[^>]*\bdata-response-promise\b[^>]*>[\s\S]*?<\/p>/g) ?? [];

    assert.ok(promises.length > 0);
    for (const promise of promises) {
      const copy = promise.replace(/<[^>]+>/g, '').trim();
      assert.match(copy, /innerhalb eines Arbeitstags persönlich/);
    }
    assert.doesNotMatch(source, /(?:12|zwölf) Stunden|auch am Wochenende|zwischen 20 und 8 Uhr/i);
  });
}

test('the landing CSS styles only the step legends, not the qualification legend', async () => {
  const css = await readFile('src/styles/recruiting-landing.css', 'utf8');
  assert.doesNotMatch(css, /#kontaktformular legend/);
  assert.match(css, /#kontaktformular #anliegen-heading/);
  assert.match(css, /#kontaktformular #kontakt-heading/);
});

test('the shared form binds the native contact pattern without Astro string-escape loss', async () => {
  const detail = await readFile(CONTACT_PATH, 'utf8');
  assert.match(detail, /import \{ CONTACT_PATTERN_SOURCE(?:, QUALIFICATIONS)? \} from '\.\.\/lib\/application-form\.mjs'/);
  assert.match(detail, /name="kontakt"[^>]*pattern=\{CONTACT_PATTERN_SOURCE\}[^>]*required/);
  assert.doesNotMatch(detail, /pattern="/);
});

test('step two offers an optional qualification question', async () => {
  const src = await readFile(CONTACT_PATH, 'utf8');
  assert.match(src, /<fieldset id="kontakt-abschluss"[\s\S]*?<legend[^>]*>Dein Abschluss <span[^>]*>\(optional\)<\/span><\/legend>/);
  assert.match(src, /<fieldset id="kontakt-abschluss"[^>]*aria-describedby="abschluss-hint"/);
  assert.match(src, /Object\.entries\(QUALIFICATIONS\)/);
  assert.match(src, /import \{[^}]*QUALIFICATIONS[^}]*\} from/);
  assert.doesNotMatch(src, /name="abschluss"[^>]*required/);
  assert.match(src, /id="abschluss-hint"[^>]*>Hilft uns, das Gespräch vorzubereiten\. Du kannst auch ohne Angabe absenden\.</);
  // Optional field: no client-side blocking error.
  assert.doesNotMatch(src, /abschluss-error|qualificationMissing|Bitte wähle deinen Abschluss aus/);
});

test('privacy policy names the qualification answer', async () => {
  const src = await readFile(PRIVACY_PATH, 'utf8');
  assert.match(src, /Angabe zu Ihrem Berufsabschluss/);
});
