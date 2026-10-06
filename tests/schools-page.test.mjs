import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const PAGE = 'src/pages/schulen.astro';
const read = async (path) => (await readFile(new URL(`../${path}`, import.meta.url), 'utf8')).replaceAll('&nbsp;', ' ');

const INTERNSHIP = 'Praktikum nach persönlicher Absprache, für Auszubildende und Studierende der Logopädie und Sprachtherapie in Deutschland.';

test('schools page states approved wording verbatim', async () => {
  const page = await read(PAGE);

  assert.ok(page.includes('Berufsanfänger:innen sind willkommen.'));
  assert.ok(page.includes('Intensive strukturierte Einarbeitung, schrittweiser Terminaufbau und jederzeit eine Ansprechperson.'));
  assert.ok(page.includes('Dokumentation, Berichte und Organisation sind eingeplante Arbeitszeit.'));
  assert.ok(page.includes('Je nach Erfahrungslevel 23–26 EUR brutto pro Stunde; bei 38,5 Stunden ungefähr 3.840–4.338 EUR brutto im Monat.'));
  assert.ok(page.includes('Hospitation oder Probearbeit'));
  assert.equal(page.split(INTERNSHIP).length - 1, 1);
});

test('schools page avoids unapproved promises', async () => {
  const page = await read(PAGE);

  assert.doesNotMatch(page, /Einstiegsgehalt|Werkstudent|Bachelor-?arbeit|Praktikumsvergütung/i);
});

test('schools page uses existing components only', async () => {
  const page = await read(PAGE);
  const imports = [...page.matchAll(/^import\s+.+?\s+from\s+'([^']+)';$/gm)].map((match) => match[1]);
  const allowed = new Set([
    '../layouts/Layout.astro',
    '../components/Navigation.astro',
    '../components/Footer.astro',
    '../components/PracticeBrand.astro',
    '../components/ContactAlternatives.astro',
  ]);

  assert.ok(imports.length >= 4);
  for (const source of imports) assert.ok(allowed.has(source), `unexpected import ${source}`);
  assert.match(page, /<ContactAlternatives \/>/);
  assert.match(page, /href="\/kontakt\/"/);
});

test('schools page is accessible and branded', async () => {
  const page = await read(PAGE);

  assert.match(page, /<main id="main-content" tabindex="-1"/);
  assert.ok(page.includes('Praxis für Logopädie Şimşek'));
  assert.ok(page.includes('https://xn--logopdiejobs-kcb.de/schulen/'));
  assert.doesNotMatch(page, /<script/i);
});

test('schools page shows the internship statement only behind INTERNSHIP_CONFIRMED', async () => {
  const page = await read(PAGE);

  assert.match(page, /const INTERNSHIP_CONFIRMED = (true|false);/);
  assert.match(page, /\{INTERNSHIP_CONFIRMED && \([\s\S]*?Praktikum nach persönlicher Absprache, für Auszubildende und Studierende der Logopädie und Sprachtherapie in Deutschland\.[\s\S]*?\)\}/);
  const description = page.match(/const pageDescription = '([^']*)'/)?.[1] ?? '';
  assert.ok(description.length > 0);
  assert.doesNotMatch(description, /Praktikum/i);
});

test('schools page does not hide clipped content with overflow-x-hidden', async () => {
  const page = await read(PAGE);

  assert.doesNotMatch(page, /overflow-x-hidden/);
});

test('schools page canonical keeps the trailing slash configured site-wide', async () => {
  const [page, config, layout] = await Promise.all([read(PAGE), read('astro.config.mjs'), read('src/layouts/Layout.astro')]);

  assert.match(config, /trailingSlash:\s*'always'/);
  assert.match(layout, /new URL\(Astro\.url\.pathname, Astro\.site\)/);
  assert.match(page, /url: 'https:\/\/xn--logopdiejobs-kcb\.de\/schulen\/'/);
});

test('schools page leads with the career-entry benefit and a searchable title', async () => {
  const page = await read(PAGE);

  assert.ok(page.includes('Berufseinstieg als Logopäd:in in Duisburg'));
  assert.match(page, /const pageTitle = 'Berufseinstieg Logopädie Duisburg \| Praxis für Logopädie Şimşek';/);
  assert.ok(page.includes('Berufsanfänger:innen sind willkommen.'));
});

test('schools page answers graduates questions with approved wording', async () => {
  const page = await read(PAGE);
  const approved = [
    'Staatlich anerkannte und zugelassene Logopädie oder Sprachtherapie nach Ausbildung oder Studium.',
    'Sehr gute Deutschkenntnisse sind erforderlich',
    'Vollzeit umfasst 38,5 Wochenstunden. Teilzeit ist mit flexiblem Stundenumfang möglich.',
    'Eine Vier-Tage-Woche ist möglich.',
    'Vierköpfiges Team, flache Hierarchien, wöchentlicher Austausch, Supervision und gemeinsam geplante Aktivitäten.',
    'Eigene Schwerpunkte sind willkommen und können nach Einstieg aufgebaut werden.',
    'Fortbildungen werden finanziell und mit zusätzlichen freien Tagen unterstützt',
    'Eintritt nach Vereinbarung.',
    'Unverbindlicher Erstkontakt ohne klassische Unterlagen; Lebenslauf freiwillig.',
  ];

  for (const sentence of approved) assert.ok(page.includes(sentence), `missing: ${sentence}`);
  assert.match(page, /<dl[\s\S]*<dt[\s\S]*<dd/);
});

test('schools page has a block for schools using the recruiting contact data', async () => {
  const page = await read(PAGE);

  assert.ok(page.includes('Für Schulen und Hochschulen'));
  assert.ok(page.includes('social@logopaedie-simsek.de'));
  assert.ok(page.includes('+49 155 10062296'));
});

test('schools page links to the job page and the salary calculator', async () => {
  const page = await read(PAGE);

  assert.match(page, /href="\/jobs\/logopaedin-sprachtherapeut-duisburg\/"/);
  assert.match(page, /href="\/gehaltsrechner\/"/);
});

test('schools page links are keyboard and hover friendly and headings balance', async () => {
  const page = await read(PAGE);
  const links = page.match(/<a [^>]*href="[^"]*"[^>]*>/g) ?? [];

  assert.ok(links.length >= 3);
  for (const link of links) {
    assert.match(link, /focus-visible:/, `no focus style: ${link}`);
    assert.match(link, /hover:/, `no hover style: ${link}`);
  }
  assert.match(page, /<h1 class="[^"]*text-balance/);
  assert.match(page, /translate="no"[^>]*>Praxis für Logopädie Şimşek</);
});

test('footer links to the schools page without touching the main navigation', async () => {
  const [footer, navigation] = await Promise.all([read('src/components/Footer.astro'), read('src/components/Navigation.astro')]);

  assert.ok(footer.includes("{ href: '/schulen/', label: 'Für Auszubildende und Studierende' }"));
  assert.doesNotMatch(navigation, /\/schulen\//);
});
