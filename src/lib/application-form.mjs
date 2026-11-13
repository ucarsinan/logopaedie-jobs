import { contactFieldError, isContactEmail as isEmail } from './contact-validation.mjs';

export const MAX_BODY_BYTES = 8 * 1024;

export const KNOWN_JOBS = Object.freeze({
  'logopaedin-sprachtherapeut-duisburg': 'Bewerbung als Logopädin / Sprachtherapeutin in Duisburg',
});

export const CONTACT_PATTERN_SOURCE = String.raw`(?:[^\s@]+@[^\s@]+\.[^\s@]+|\+?(?=(?:(?:\s|\(|\)|\.|/|-|‐|‑|‒|–|—|−)*\d){6})(?:\d|\s|\(|\)|\.|/|-|‐|‑|‒|–|—|−)+)`;

export const CONTACT_INTENTS = Object.freeze({
  kennenlernen: 'Die Praxis kennenlernen',
  stelle: 'Mehr über die Stelle erfahren',
  frage: 'Eine Frage stellen',
});

export const QUALIFICATIONS = Object.freeze({
  anerkannt: Object.freeze({
    label: 'Ich habe einen Abschluss in Logopädie oder Sprachtherapie',
    subject: 'Abschluss passt',
  }),
  ausbildung: Object.freeze({
    label: 'Ich bin noch in Ausbildung oder im Studium',
    subject: 'in Ausbildung',
  }),
  anderer: Object.freeze({
    label: 'Ich habe einen anderen Berufsabschluss',
    subject: 'anderer Abschluss',
  }),
});

const ALLOWED_FIELDS = new Set(['name', 'kontakt', 'nachricht', 'stelle', 'website', 'quelle', 'anliegen', 'abschluss']);
/**
 * @typedef {object} ApplicationData
 * @property {string} name
 * @property {string} contact
 * @property {string} message
 * @property {string} jobSlug
 * @property {string} [replyTo]
 * @property {string} [intent] Known `anliegen` key; absent for legacy posts.
 * @property {'anerkannt' | 'ausbildung' | 'anderer'} [qualification]
 */

/**
 * @typedef {{ ok: true, data: ApplicationData, bot: boolean } | { ok: false, code: 'invalid_form', fields: string[] }} ParseResult
 */

/**
 * @param {string | null} value
 * @returns {string}
 */
function normalize(value) {
  return (value ?? '').normalize('NFC').replace(/\r\n?/g, '\n').replace(/\s+/g, ' ').trim();
}

/**
 * @returns {ApplicationData}
 */
function emptyApplicationData() {
  return { name: '', contact: '', message: '', jobSlug: '' };
}

/**
 * Parses and validates the URL-encoded application form without logging or side effects.
 *
 * @param {URLSearchParams} body
 * @returns {ParseResult}
 */
export function parseApplicationForm(body) {
  const invalidFields = [...new Set(
    [...body.keys()].filter((field) => !ALLOWED_FIELDS.has(field)),
  )];

  // Count names only: legacy clients may still post quelle, but its value is ignored.
  const fieldCounts = new Map();
  for (const field of body.keys()) {
    fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1);
  }
  for (const [field, count] of fieldCounts) {
    if (count > 1) invalidFields.push(field);
  }

  if (invalidFields.length > 0) {
    return { ok: false, code: 'invalid_form', fields: invalidFields };
  }

  const website = normalize(body.get('website'));

  if (website) {
    return { ok: true, bot: true, data: emptyApplicationData() };
  }

  const name = normalize(body.get('name'));
  const contact = normalize(body.get('kontakt'));
  const intent = normalize(body.get('anliegen'));
  const message = intent && intent !== 'frage' ? '' : normalize(body.get('nachricht'));
  const jobSlug = normalize(body.get('stelle'));
  const qualification = normalize(body.get('abschluss'));
  const fields = [];
  if (intent && !Object.hasOwn(CONTACT_INTENTS, intent)) fields.push('anliegen');

  if (contactFieldError('name', name)) fields.push('name');
  if (contactFieldError('kontakt', contact)) {
    fields.push('kontakt');
  }
  if (contactFieldError('nachricht', intent && intent !== 'frage' ? '' : body.get('nachricht'))) fields.push('nachricht');
  if (!Object.hasOwn(KNOWN_JOBS, jobSlug)) fields.push('stelle');
  if (qualification && !Object.hasOwn(QUALIFICATIONS, qualification)) fields.push('abschluss');

  if (fields.length > 0) {
    return { ok: false, code: 'invalid_form', fields };
  }

  const fullMessage = intent && Object.hasOwn(CONTACT_INTENTS, intent)
    ? [CONTACT_INTENTS[intent], message].filter(Boolean).join('\n\n')
    : message;
  /** @type {ApplicationData} */
  const data = { name, contact, message: fullMessage, jobSlug };

  if (Object.hasOwn(CONTACT_INTENTS, intent)) data.intent = intent;
  if (qualification && intent !== 'frage') {
    data.qualification = /** @type {'anerkannt' | 'ausbildung' | 'anderer'} */ (qualification);
  }

  if (isEmail(contact)) data.replyTo = contact;

  return { ok: true, bot: false, data };
}
