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

const ALLOWED_FIELDS = new Set(['name', 'kontakt', 'nachricht', 'stelle', 'website', 'quelle', 'anliegen']);
const MAX_SOURCE_LENGTH = 200;
// Kampagnenkennungen bestehen aus Buchstaben, Ziffern und Trennzeichen.
// Alles andere faellt weg, bevor der Wert in eine E-Mail geschrieben wird.
const UNSAFE_SOURCE_CHARS = /[^A-Za-z0-9 ._:|/=&+-]+/g;

/**
 * @typedef {object} ApplicationData
 * @property {string} name
 * @property {string} contact
 * @property {string} message
 * @property {string} jobSlug
 * @property {string} [source]
 * @property {string} [replyTo]
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
 * Reduziert die vom Client gelieferte Herkunft auf ein kurzes, druckbares
 * Kuerzel. Verwirft niemals die Bewerbung: ein unbrauchbarer Wert wird
 * stillschweigend zu einem leeren String, damit eine echte Bewerbung
 * trotzdem ankommt.
 *
 * @param {string | null} value
 * @returns {string}
 */
function sanitizeSource(value) {
  return normalize(value).replace(UNSAFE_SOURCE_CHARS, '').slice(0, MAX_SOURCE_LENGTH).trim();
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

  for (const field of new Set(body.keys())) {
    if (body.getAll(field).length > 1) invalidFields.push(field);
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
  const fields = [];
  if (intent && !Object.hasOwn(CONTACT_INTENTS, intent)) fields.push('anliegen');

  if (contactFieldError('name', name)) fields.push('name');
  if (contactFieldError('kontakt', contact)) {
    fields.push('kontakt');
  }
  if (contactFieldError('nachricht', intent && intent !== 'frage' ? '' : body.get('nachricht'))) fields.push('nachricht');
  if (!Object.hasOwn(KNOWN_JOBS, jobSlug)) fields.push('stelle');

  if (fields.length > 0) {
    return { ok: false, code: 'invalid_form', fields };
  }

  const fullMessage = intent && Object.hasOwn(CONTACT_INTENTS, intent)
    ? [CONTACT_INTENTS[intent], message].filter(Boolean).join('\n\n')
    : message;
  /** @type {ApplicationData} */
  const data = { name, contact, message: fullMessage, jobSlug };

  const source = sanitizeSource(body.get('quelle'));
  if (source) data.source = source;

  if (isEmail(contact)) data.replyTo = contact;

  return { ok: true, bot: false, data };
}
