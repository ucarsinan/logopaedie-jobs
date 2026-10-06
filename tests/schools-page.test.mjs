import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const PAGE = 'src/pages/schulen.astro';
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const INTERNSHIP = 'Praktikum nach persönlicher Absprache, für Schüler:innen und Studierende in Deutschland.';

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
  assert.match(page, /\{INTERNSHIP_CONFIRMED && \([\s\S]*?Praktikum nach persönlicher Absprache, für Schüler:innen und Studierende in Deutschland\.[\s\S]*?\)\}/);
  const description = page.match(/const pageDescription = '([^']*)'/)?.[1] ?? '';
  assert.ok(description.length > 0);
  assert.doesNotMatch(description, /Praktikum/i);
});
