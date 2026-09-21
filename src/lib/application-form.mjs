export const MAX_BODY_BYTES = 8 * 1024;

export const KNOWN_JOBS = Object.freeze({
  'logopaedin-sprachtherapeut-duisburg': 'Bewerbung als Logopädin / Sprachtherapeutin in Duisburg',
});

export const CONTACT_PATTERN_SOURCE = String.raw`(?:[^\s@]+@[^\s@]+\.[^\s@]+|\+?(?=(?:(?:\s|\(|\)|\.|/|-|‐|‑|‒|–|—|−)*\d){6})(?:\d|\s|\(|\)|\.|/|-|‐|‑|‒|–|—|−)+)`;

const ALLOWED_FIELDS = new Set(['name', 'kontakt', 'nachricht', 'stelle', 'website', 'quelle']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{6,}$/;
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
  return (value ?? '').replace(/\r\n?/g, '\n').replace(/\s+/g, ' ').trim();
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isEmail(value) {
  return EMAIL_PATTERN.test(value);
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isPhone(value) {
  return PHONE_PATTERN.test(value.replace(/[\s()./\-\u2010\u2011\u2012\u2013\u2014\u2212]/g, ''));
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

  if (invalidFields.length > 0) {
    return { ok: false, code: 'invalid_form', fields: invalidFields };
  }

  const website = normalize(body.get('website'));

  if (website) {
    return { ok: true, bot: true, data: emptyApplicationData() };
  }

  const name = normalize(body.get('name'));
  const contact = normalize(body.get('kontakt'));
  const message = normalize(body.get('nachricht'));
  const jobSlug = normalize(body.get('stelle'));
  const fields = [];

  if (name.length < 2 || name.length > 100) fields.push('name');
  if (contact.length < 5 || contact.length > 160 || (!isEmail(contact) && !isPhone(contact))) {
    fields.push('kontakt');
  }
  if (message.length > 1500) fields.push('nachricht');
  if (!Object.hasOwn(KNOWN_JOBS, jobSlug)) fields.push('stelle');

  if (fields.length > 0) {
    return { ok: false, code: 'invalid_form', fields };
  }

  /** @type {ApplicationData} */
  const data = { name, contact, message, jobSlug };

  const source = sanitizeSource(body.get('quelle'));
  if (source) data.source = source;

  if (isEmail(contact)) data.replyTo = contact;

  return { ok: true, bot: false, data };
}
