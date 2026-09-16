import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  RECRUITING_EMAIL,
  RECRUITING_EMAIL_HREF,
  RECRUITING_PHONE_DISPLAY,
  RECRUITING_PHONE_HREF,
  WHATSAPP_HREF,
  WHATSAPP_MESSAGE,
  WHATSAPP_NUMBER,
} from '../src/lib/recruiting-whatsapp.mjs';

const COMPONENT_PATH = new URL('../src/components/RecruitingWhatsAppLink.astro', import.meta.url);

test('builds the canonical tracking-free recruiting WhatsApp link', () => {
  assert.equal(WHATSAPP_NUMBER, '4915510062296');
  assert.equal(
    WHATSAPP_MESSAGE,
    'Hallo, ich interessiere mich für die Stelle als Logopäd:in / Sprachtherapeut:in in Duisburg.',
  );
  assert.equal(
    WHATSAPP_HREF,
    `https://wa.me/4915510062296?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  );
  assert.doesNotMatch(WHATSAPP_HREF, /utm_|fbclid|paid_meta/i);
  assert.equal(RECRUITING_PHONE_DISPLAY, '+49 155 10062296');
  assert.equal(RECRUITING_PHONE_HREF, 'tel:+4915510062296');
  assert.equal(RECRUITING_EMAIL, 'social@logopaedie-simsek.de');
  assert.equal(RECRUITING_EMAIL_HREF, 'mailto:social@logopaedie-simsek.de');
});

test('renders a reusable accessible external WhatsApp link', async () => {
  const component = await readFile(COMPONENT_PATH, 'utf8');

  assert.match(component, /WHATSAPP_HREF/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /aria-label=\{label\}/);
});

test('renders the WhatsApp CTA as a prominent green button with a visible focus contract', async () => {
  const component = await readFile(COMPONENT_PATH, 'utf8');

  assert.match(component, /#25d366/);
  assert.match(component, /<svg[\s\S]*?aria-hidden="true"/);
  assert.match(component, /focus-visible:outline/);
  assert.match(component, /focus-visible:ring/);
  assert.match(component, /min-h-11/);
});

test('keeps the privacy heading readable at narrow mobile widths', async () => {
  const privacy = await readFile(
    new URL('../src/pages/datenschutz.astro', import.meta.url),
    'utf8',
  );

  assert.match(
    privacy,
    /<h1 class="[^"]*text-\[1\.5rem\][^"]*min-\[360px\]:text-\[2rem\][^"]*md:text-5xl[^"]*hyphens-auto[^"]*">[\s\S]*?Datenschutzerklärung[\s\S]*?<\/h1>/,
  );
});
