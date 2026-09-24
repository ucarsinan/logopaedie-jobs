import assert from 'node:assert/strict';
import test from 'node:test';

import { CONTACT_PATTERN_SOURCE, KNOWN_JOBS, MAX_BODY_BYTES, parseApplicationForm } from '../src/lib/application-form.mjs';

const JOB_SLUG = 'logopaedin-sprachtherapeut-duisburg';
const EMAIL = 'erika@example.test';
const PHONE = '0203 000000';
const NAME = 'Erika Muster';
const NEUTRAL_MESSAGE = 'Neutrale Nachricht';

function form(values = {}) {
  return new URLSearchParams({
    name: NAME,
    kontakt: EMAIL,
    nachricht: NEUTRAL_MESSAGE,
    stelle: JOB_SLUG,
    website: '',
    ...values,
  });
}

function invalidFields(values) {
  const result = parseApplicationForm(form(values));
  assert.equal(result.ok, false);
  assert.equal(result.code, 'invalid_form');
  return result.fields;
}

test('exports the 8 KiB body cap and maps the known job server-side', () => {
  assert.equal(MAX_BODY_BYTES, 8 * 1024);
  assert.deepEqual(Object.keys(KNOWN_JOBS), [JOB_SLUG]);
  assert.equal(typeof KNOWN_JOBS[JOB_SLUG], 'string');
});

test('parses a valid email contact and exposes it only as replyTo', () => {
  const result = parseApplicationForm(form());

  assert.deepEqual(result, {
    ok: true,
    bot: false,
    data: {
      name: NAME,
      contact: EMAIL,
      message: NEUTRAL_MESSAGE,
      jobSlug: JOB_SLUG,
      replyTo: EMAIL,
    },
  });
});

test('accepts a phone contact with at least six digits without replyTo', () => {
  const result = parseApplicationForm(form({ kontakt: PHONE }));

  assert.equal(result.ok, true);
  assert.equal(result.bot, false);
  assert.equal(result.data.contact, PHONE);
  assert.equal('replyTo' in result.data, false);
});

test('accepts common Unicode hyphens and dashes in phone contacts', () => {
  for (const separator of ['‐', '‑', '‒', '–', '—', '−']) {
    const contact = `0203 ${separator} 000000`;
    const result = parseApplicationForm(form({ kontakt: contact }));

    assert.equal(result.ok, true, `expected separator ${separator} to be accepted`);
    assert.equal(result.data.contact, contact);
    assert.equal('replyTo' in result.data, false);
  }
});

test('browser contact pattern mirrors accepted email and phone shapes', () => {
  const browserPattern = new RegExp(`^(?:${CONTACT_PATTERN_SOURCE})$`, 'v');

  assert.equal(browserPattern.test(EMAIL), true);
  assert.equal(browserPattern.test(PHONE), true);
  assert.equal(browserPattern.test('0203 – 000000'), true);
  assert.equal(browserPattern.test('neutral text'), false);
  assert.equal(browserPattern.test('0203 – 0'), false);
});

test('requires at least six digits for phone contacts', () => {
  const digits = PHONE.replace(/\D/g, '');
  assert.deepEqual(invalidFields({ kontakt: digits.slice(0, 5) }), ['kontakt']);

  const result = parseApplicationForm(form({ kontakt: digits.slice(0, 6) }));
  assert.equal(result.ok, true);
  assert.equal(result.data.contact, digits.slice(0, 6));
  assert.equal('replyTo' in result.data, false);
});

test('normalizes whitespace and line breaks before returning data', () => {
  const result = parseApplicationForm(form({
    name: '  Erika\r\n  Muster  ',
    kontakt: '  erika@example.test  ',
    nachricht: '  Neutrale\r\n Nachricht  ',
  }));

  assert.equal(result.ok, true);
  assert.deepEqual(result.data, {
    name: NAME,
    contact: EMAIL,
    message: NEUTRAL_MESSAGE,
    jobSlug: JOB_SLUG,
    replyTo: EMAIL,
  });
});

test('rejects unknown fields', () => {
  assert.deepEqual(invalidFields({ neutral: 'Textbaustein' }), ['neutral']);
});

test('enforces every name boundary', () => {
  assert.deepEqual(invalidFields({ name: ' ' }), ['name']);
  assert.deepEqual(invalidFields({ name: `${NAME}${'x'.repeat(89)}` }), ['name']);

  const shortestValid = parseApplicationForm(form({ name: NAME.slice(0, 2) }));
  assert.equal(shortestValid.ok, true);
  assert.equal(shortestValid.data.name.length, 2);

  const result = parseApplicationForm(form({ name: `${NAME}${'x'.repeat(88)}` }));
  assert.equal(result.ok, true);
  assert.equal(result.data.name.length, 100);
});

test('enforces every contact boundary', () => {
  assert.deepEqual(invalidFields({ kontakt: 'a@b' }), ['kontakt']);
  assert.deepEqual(invalidFields({ kontakt: `erika@${'x'.repeat(150)}.test` }), ['kontakt']);

  const shortestValid = parseApplicationForm(form({ kontakt: 'a@b.co' }));
  assert.equal(shortestValid.ok, true);
  assert.equal(shortestValid.data.contact.length, 6);

  const result = parseApplicationForm(form({ kontakt: `erika@${'x'.repeat(60)}.${'x'.repeat(60)}.${'x'.repeat(27)}.test` }));
  assert.equal(result.ok, true);
  assert.equal(result.data.contact.length, 160);
});

test('enforces the optional message maximum', () => {
  assert.deepEqual(invalidFields({ nachricht: 'x'.repeat(1501) }), ['nachricht']);

  const emptyResult = parseApplicationForm(form({ nachricht: '' }));
  assert.equal(emptyResult.ok, true);
  assert.equal(emptyResult.data.message, '');

  const result = parseApplicationForm(form({ nachricht: 'x'.repeat(1500) }));
  assert.equal(result.ok, true);
  assert.equal(result.data.message.length, 1500);
});

test('rejects contacts that are neither a simple email nor a separated phone number', () => {
  assert.deepEqual(invalidFields({ kontakt: 'neutral text' }), ['kontakt']);
});

test('rejects unknown job slugs', () => {
  assert.deepEqual(invalidFields({ stelle: 'unbekannte-stelle' }), ['stelle']);
});

test('treats a filled honeypot as a bot and removes applicant data', () => {
  const result = parseApplicationForm(form({ website: 'neutral' }));

  assert.deepEqual(result, {
    ok: true,
    bot: true,
    data: {
      name: '',
      contact: '',
      message: '',
      jobSlug: '',
    },
  });
});

test('rejects unknown fields before classifying a filled honeypot as a bot', () => {
  const result = parseApplicationForm(form({ website: 'neutral', neutral: 'Textbaustein' }));

  assert.deepEqual(result, {
    ok: false,
    code: 'invalid_form',
    fields: ['neutral'],
  });
});

const CRLF = String.fromCharCode(13, 10);

test('nimmt die Herkunft entgegen und reicht sie als source durch', () => {
  const quelle = 'meta | paid_social | recruiting_duisburg | 52564079917169 | Instagram_Feed';
  const result = parseApplicationForm(form({ quelle }));

  assert.equal(result.ok, true);
  assert.equal(result.data.source, quelle);
});

test('laesst source weg, wenn keine Herkunft mitgeschickt wird', () => {
  const result = parseApplicationForm(form());

  assert.equal(result.ok, true);
  assert.equal(Object.hasOwn(result.data, 'source'), false);
});

test('entfernt Zeilenumbrueche und Sonderzeichen aus der Herkunft', () => {
  const result = parseApplicationForm(form({
    quelle: 'meta' + CRLF + 'Bcc: angreifer@example.test' + CRLF + '<script>',
  }));

  assert.equal(result.ok, true);
  assert.equal(result.data.source.includes(String.fromCharCode(10)), false);
  assert.equal(result.data.source.includes(String.fromCharCode(13)), false);
  assert.equal(result.data.source.includes('<'), false);
  assert.equal(result.data.source.startsWith('meta '), true);
});

test('kuerzt eine uebergrosse Herkunft auf 200 Zeichen', () => {
  const result = parseApplicationForm(form({ quelle: 'a'.repeat(500) }));

  assert.equal(result.ok, true);
  assert.equal(result.data.source.length, 200);
});

test('eine unbrauchbare Herkunft weist die Bewerbung nicht ab', () => {
  const result = parseApplicationForm(form({ quelle: String.fromCharCode(0, 7) + '\u{1F600}' }));

  assert.equal(result.ok, true);
  assert.equal(Object.hasOwn(result.data, 'source'), false);
});


test('contact intents reach the existing message field without requiring free text', () => {
  for (const [anliegen, expected] of Object.entries({ kennenlernen: 'Die Praxis kennenlernen', stelle: 'Mehr über die Stelle erfahren', frage: 'Eine Frage stellen' })) {
    const result = parseApplicationForm(form({ anliegen, nachricht: '' }));
    assert.equal(result.ok, true);
    assert.equal(result.data.message, expected);
  }
});

test('optional question is included only for the question intent', () => {
  const question = parseApplicationForm(form({ anliegen: 'frage', nachricht: 'Wie läuft das Kennenlernen ab?' }));
  assert.equal(question.data.message, 'Eine Frage stellen\n\nWie läuft das Kennenlernen ab?');
  const changed = parseApplicationForm(form({ anliegen: 'stelle', nachricht: 'Alte Frage' }));
  assert.equal(changed.data.message, 'Mehr über die Stelle erfahren');
  assert.deepEqual(invalidFields({ anliegen: 'unbekannt' }), ['anliegen']);
});

test('rejects implausible names and contacts while accepting international names', () => {
  for (const name of ['12345', '---', '<script>', '🙂🙂']) assert.deepEqual(invalidFields({ name }), ['name']);
  for (const name of ['李', 'Şeyma', 'Anne-Marie O’Neill', 'محمد', 'Jean D.']) {
    assert.equal(parseApplicationForm(form({ name })).ok, true, name);
  }
  for (const kontakt of ['a..b@example.test', '.a@example.test', 'a@-example.test', 'a@example..test', '0000000000', '+1234567890123456', '(0203 123456', 'a@example.c']) {
    assert.deepEqual(invalidFields({ kontakt }), ['kontakt']);
  }
  for (const kontakt of ['anne+team@example.test', '+49 (0)203 123456', '0049 203 123456', '0203 / 123456-7']) {
    assert.equal(parseApplicationForm(form({ kontakt })).ok, true, kontakt);
  }
});

test('rejects duplicate fields instead of silently choosing one value', () => {
  const body = form(); body.append('kontakt', 'other@example.test');
  assert.equal(parseApplicationForm(body).ok, false);
});
