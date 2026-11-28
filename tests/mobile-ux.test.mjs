import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the shared section navigation labels its icons and identifies the current section', async () => {
  const layout = await read('src/layouts/Fachportal.astro');
  const css = await read('src/styles/berufseinstieg.css');
  assert.match(layout, /<nav class="bereiche" aria-label="Bereiche"/);
  assert.match(layout, /currentPath === link.href \? 'page' : link === currentLink \? 'location'/);
  assert.match(layout, /aria-controls="portal-menue"/);
  assert.match(layout, /id="portal-menue"/);
  assert.match(layout, /aria-hidden="true" focusable="false"/);
  assert.match(layout, /<span>\{link.label\}<\/span>/);
  assert.match(css, /\.bereiche a \{[^}]*min-height: 44px/);
});

test('every public page offers a skip link and a focusable main target', async () => {
  const layout = await read('src/layouts/Layout.astro');
  assert.match(layout, /href="#main-content"[\s\S]*?>\s*Zum Hauptinhalt/);

  const homepage = await read('src/pages/index.astro');
  assert.match(homepage, /import Fachportal from '\.\.\/layouts\/Fachportal\.astro'/);
  assert.match(homepage, /<Fachportal\b/);

  const pages = [
    'src/pages/kontakt.astro',
    'src/pages/praxis.astro',
    'src/pages/404.astro',
    'src/pages/datenschutz.astro',
    'src/pages/impressum.astro',
    'src/pages/gehaltsrechner.astro',
    'src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro',
    'src/pages/berufshandbuch/index.astro',
    'src/pages/berufshandbuch/[slug].astro',
    'src/pages/bewerbung/danke.astro',
    'src/pages/schulen.astro',
  ];

  assert.match(await read('src/layouts/Fachportal.astro'), /<main[^>]*id="main-content"[^>]*tabindex="-1"/);
  for (const page of pages) {
    assert.match(await read(page), /<Fachportal\b/);
  }
});

test('the handbook indexes every topic and links to its article group', async () => {
  const page = await read('src/pages/berufshandbuch/index.astro');
  assert.ok(page.includes('href={`#${topic.id}`}'));
  assert.match(page, /<section id=\{topic.id\}/);
  assert.match(page, /groupedArticles\[topic.id\]\.map/);
  assert.match(page, /href="\/gehaltsrechner\/"/);
});

test('reading pages keep recruiting links at the end and provide the shared contact route', async () => {
  const article = await read('src/pages/berufshandbuch/[slug].astro');
  const portal = await read('src/layouts/Fachportal.astro');
  assert.match(portal, /href="\/kontakt\/"/);
  assert.match(article, /<Content \/>[\s\S]*beitrag.data.topic === 'karriere-bewerbung'[\s\S]*href="\/jobs\//);
});

test('content images provide responsive candidates and sizes', async () => {
  const files = [
    'src/components/Hero.astro',
    'src/components/Gallery.astro',
    'src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro',
  ];

  for (const file of files) {
    const source = await read(file);
    const images = source.match(/<Image[\s\S]*?\/>/g) ?? [];
    assert.ok(images.length > 0, `${file} must contain an Astro Image`);
    for (const image of images) {
      assert.match(image, /widths=\{\[/, `${file} image needs responsive widths`);
      assert.match(image, /sizes="/, `${file} image needs a sizes hint`);
    }
  }
});

test('dynamic salary results are announced without interrupting the user', async () => {
  const calculator = await read('src/components/Gehaltsrechner.astro');
  assert.match(calculator, /id="rechner-ergebnis"[^>]*aria-live="polite"/);
});

test('key mobile labels retain readable contrast and footer links remain tappable', async () => {
  const [about, detail, requirements, footer] = await Promise.all([
    read('src/components/About.astro'),
    read('src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro'),
    read('src/components/Anforderungen.astro'),
    read('src/components/Footer.astro'),
  ]);

  assert.doesNotMatch(about, /text-white\/80/);
  assert.doesNotMatch(about, /text-\[10px\][^\n]*text-slate-400/);
  assert.doesNotMatch(detail, /<dt class="[^"]*text-slate-400/);
  assert.doesNotMatch(requirements, /text-xs text-slate-400 text-center/);
  assert.match(footer, /footerLinks[\s\S]*?inline-flex min-h-11/);
  assert.match(footer, /href="\/impressum\/" class="[^"]*min-h-11/);
  assert.match(footer, /href="\/datenschutz\/" class="[^"]*min-h-11/);
});

test('the practice portrait pairs the original room photograph with an attributed quotation', async () => {
  const about = await read('src/components/About.astro');
  assert.match(about, /<h1 id="praxis-vorstellung"/);
  assert.match(about, /<Image src=\{therapieraum\} alt="[^"]+"/);
  assert.match(about, /<figure class="praxis-zitat">[\s\S]*?<blockquote>[\s\S]*?<figcaption><strong>Emel Şimşek-Uçar<\/strong>/);
});

test('the mobile gallery is a calm manual carousel with accessible controls', async () => {
  const gallery = await read('src/components/Gallery.astro');

  assert.match(gallery, /data-mobile-gallery/);
  assert.match(gallery, /data-gallery-track/);
  assert.match(gallery, /snap-x snap-mandatory/);
  assert.match(await read('src/styles/berufseinstieg.css'), /\.raumstrecke \{ display: grid; grid-template-columns:/);
  assert.match(gallery, /data-gallery-prev/);
  assert.match(gallery, /data-gallery-next/);
  assert.match(gallery, /rooms\.map\(\(_, i\) => \([\s\S]*?<button type="button" data-gallery-dot/);
  assert.doesNotMatch(gallery, /setInterval|autoplay/i);
});

test('the job landing keeps native contact paths available without JavaScript', async () => {
  const page = await read('src/components/ApplicationContact.astro');
  const form = page.match(/<form\b[^>]*id="bewerbung-form"[\s\S]*?<\/form>/)?.[0] ?? '';
  const alternatives = await read('src/components/ContactAlternatives.astro');

  assert.match(form, /method="post" action="\/bewerbung\/senden\/"/);
  assert.doesNotMatch(form, /<form[^>]*(?:novalidate|hidden)/);
  assert.doesNotMatch(form, /<fieldset[^>]*(?:hidden|disabled)/);
  assert.match(form, /<button type="submit"/);
  assert.match(alternatives, /<RecruitingWhatsAppLink\b/);
  assert.match(alternatives, /href="tel:\+4915510062296"/);
  assert.match(alternatives, /href=\{RECRUITING_EMAIL_HREF\}/);
});

test('the job hero leads to its embedded form and retains the native workplace film', async () => {
  const page = await read('src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro');
  const hero = page.match(/<section\b[^>]*id="preview-hero"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(hero, /<a href="#kontaktformular"[^>]*>\s*Unverbindlich kennenlernen\s*<\/a>/);
  assert.match(hero, /id="hero-film"><WorkplaceFilm\s*\/>/);
  assert.match(page, /import WorkplaceFilm from/);
  assert.doesNotMatch(hero, /href="\/kontakt\/"/);
});

test('landing contact targets are unique and its page stylesheet preserves touch and focus support', async () => {
  const [component, page, css] = await Promise.all([
    read('src/components/ApplicationContact.astro'),
    read('src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro'),
    read('src/styles/recruiting-landing.css'),
  ]);

  for (const id of ['kontaktformular', 'bewerbung-form', 'bewerbung-status', 'kontakt-anliegen', 'kontakt-daten']) {
    assert.equal((component.match(new RegExp(`id="${id}"`, 'g')) ?? []).length, 1, `${id} must be unique`);
  }
  const contactLinks = [...page.matchAll(/<a\b[^>]*href="#kontaktformular"[^>]*>[\s\S]*?<\/a>/g)];
  assert.ok(contactLinks.length >= 1);
  assert.ok(contactLinks.some(([link]) => link.includes('Unverbindlich kennenlernen')));
  assert.match(css, /#kontaktformular input:not\(\[type=radio\]\),#kontaktformular button\{min-height:44px\}/);
  assert.match(css, /#main-content summary:focus-visible\{[^}]*outline:/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(page, /import .*recruiting-landing\.css/);
});
