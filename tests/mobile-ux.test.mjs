import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the mobile navigation exposes state and uses reliable touch targets', async () => {
  const navigation = await read('src/components/Navigation.astro');

  assert.match(navigation, /id="mobile-menu-btn"[\s\S]*?aria-controls="mobile-menu"[\s\S]*?aria-expanded="false"/);
  assert.match(navigation, /id="mobile-menu-btn"[\s\S]*?class="[^"]*min-h-11[^"]*min-w-11/);
  assert.match(navigation, /aria-current=\{link\.active \? 'page' : undefined\}/);
  assert.match(navigation, /setAttribute\('aria-expanded'/);
  assert.match(navigation, /setAttribute\('aria-label', isOpen \? 'Menü schließen' : 'Menü öffnen'\)/);
  assert.doesNotMatch(navigation, /mobile-nav-link[^\n]*py-2\.5/);
});

test('every public page offers a skip link and a focusable main target', async () => {
  const layout = await read('src/layouts/Layout.astro');
  assert.match(layout, /href="#main-content"[\s\S]*?>\s*Zum Hauptinhalt/);

  const pages = [
    'src/pages/index.astro',
    'src/pages/404.astro',
    'src/pages/datenschutz.astro',
    'src/pages/impressum.astro',
    'src/pages/gehaltsrechner.astro',
    'src/pages/jobs/index.astro',
    'src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro',
    'src/pages/berufshandbuch/index.astro',
    'src/pages/berufshandbuch/[slug].astro',
    'src/pages/bewerbung/danke.astro',
  ];

  for (const page of pages) {
    assert.match(await read(page), /<main[^>]*id="main-content"[^>]*tabindex="-1"/);
  }
});

test('the handbook tablet grid cannot overflow its columns', async () => {
  const handbook = await read('src/pages/berufshandbuch/index.astro');

  assert.match(handbook, /md:grid-cols-\[minmax\(0,1\.1fr\)_minmax\(0,0\.9fr\)\]/);
  assert.match(handbook, /<header class="[^"]*min-w-0/);
  assert.match(handbook, /<aside class="[^"]*min-w-0/);
  assert.match(handbook, /article\.data\.title[\s\S]*?break-words/);
});

test('informational recruiting CTAs lead to the central contact flow', async () => {
  const [salary, handbook, article] = await Promise.all([
    read('src/pages/gehaltsrechner.astro'),
    read('src/pages/berufshandbuch/index.astro'),
    read('src/pages/berufshandbuch/[slug].astro'),
  ]);

  for (const source of [salary, handbook, article]) {
    assert.match(source, /\/jobs\/logopaedin-sprachtherapeut-duisburg\/#bewerbung/);
    assert.doesNotMatch(source, /RECRUITING_EMAIL_HREF/);
  }
  assert.match(article, /RecruitingWhatsAppLink/);
});

test('content images provide responsive candidates and sizes', async () => {
  const files = [
    'src/components/Hero.astro',
    'src/components/About.astro',
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

test('the four about metrics share equal mobile grid rows', async () => {
  const about = await read('src/components/About.astro');

  assert.match(about, /grid grid-cols-2 auto-rows-fr/);
  assert.equal((about.match(/h-full p-6 rounded-3xl/g) ?? []).length, 3);
  assert.match(about, /class="group h-full p-px rounded-3xl/);
});

test('the mobile gallery is a calm manual carousel with accessible controls', async () => {
  const gallery = await read('src/components/Gallery.astro');

  assert.match(gallery, /data-mobile-gallery/);
  assert.match(gallery, /data-gallery-track/);
  assert.match(gallery, /snap-x snap-mandatory/);
  assert.match(gallery, /md:grid md:grid-cols-3/);
  assert.match(gallery, /data-gallery-prev/);
  assert.match(gallery, /data-gallery-next/);
  assert.equal((gallery.match(/data-gallery-dot/g) ?? []).length, 4);
  assert.doesNotMatch(gallery, /setInterval|autoplay/i);
});
