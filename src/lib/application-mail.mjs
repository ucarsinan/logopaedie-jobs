import nodemailer from 'nodemailer';

import { KNOWN_JOBS, QUALIFICATIONS } from './application-form.mjs';
import { isContactEmail } from './contact-validation.mjs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const BERLIN_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Berlin',
  year: 'numeric', month: '2-digit', day: '2-digit',
});

/**
 * Interne Erinnerung für 18:00 Uhr Berliner Ortszeit am nächsten Arbeitstag
 * (Montag bis Freitag ohne gesonderte Feiertagsregel).
 *
 * @param {Date} receivedAt
 * @returns {string} z. B. "Mo, 21.09.2026, 18:00 Uhr"
 */
export function formatResponseDeadline(receivedAt) {
  const { year, month, day } = BERLIN_DATE.formatToParts(receivedAt).reduce((date, part) => {
    if (part.type !== 'literal') date[part.type] = Number(part.value);
    return date;
  }, /** @type {Record<string, number>} */ ({}));

  // UTC dient nur zum Zählen der Berliner Kalendertage, unabhängig von Zeitumstellungen.
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1));
  while (nextDay.getUTCDay() === 0 || nextDay.getUTCDay() === 6) {
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  }

  const weekday = WEEKDAYS[nextDay.getUTCDay()];
  const pad = (/** @type {number} */ value) => String(value).padStart(2, '0');
  return `${weekday}, ${pad(nextDay.getUTCDate())}.${pad(nextDay.getUTCMonth() + 1)}.${nextDay.getUTCFullYear()}, 18:00 Uhr`;
}

/** @typedef {import('./application-form.mjs').ApplicationData} ApplicationData */

/**
 * @typedef {object} MailConfig
 * @property {string} host
 * @property {number} port
 * @property {string} user
 * @property {string} password
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {object} MailOptions
 * @property {string} subject
 * @property {string} from
 * @property {string} to
 * @property {string} text
 * @property {string} [replyTo]
 */

/** @typedef {(mail: MailOptions) => Promise<unknown>} SendMail */

/**
 * @param {string | undefined} value
 * @returns {boolean}
 */
function isConfigured(value) {
  return typeof value === 'string' && value.length > 0;
}

/**
 * @returns {MailConfig | null}
 */
function readMailConfig() {
  const host = process.env.SMTP_HOST;
  const portValue = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.APPLICATION_FROM;
  const to = process.env.APPLICATION_TO;

  if (![host, portValue, user, password, from, to].every(isConfigured)) return null;

  const port = Number(portValue);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;

  return { host, port, user, password, from, to };
}

/**
 * @param {string | undefined} value
 * @returns {boolean}
 */
function isSafeReplyTo(value) {
  return typeof value === 'string' && !/[\r\n]/.test(value) && EMAIL_PATTERN.test(value);
}

/**
 * Builds the text-only message passed to the SMTP transport.
 *
 * @param {ApplicationData} data
 * @param {MailConfig} config
 * @returns {MailOptions}
 */
export function buildApplicationMail(data, config) {
  const job = KNOWN_JOBS[data.jobSlug];
  if (!job) throw new Error('Unknown application job');

  const tagged = Boolean(data.intent) && data.intent !== 'frage';
  const qualification = tagged && data.qualification ? QUALIFICATIONS[data.qualification] : undefined;
  const subjectSuffix = tagged ? ` – ${qualification ? qualification.subject : 'Abschluss nicht angegeben'}` : '';

  /** @type {MailOptions} */
  const mail = {
    subject: `Neue Bewerbung: ${job}${subjectSuffix}`,
    from: config.from,
    to: config.to,
    text: [
      'Neue Bewerbung über das Kurzformular',
      '',
      `Stelle: ${job}`,
      `Name: ${data.name}`,
      `Kontakt: ${data.contact}`,
      ...(tagged ? [`Abschluss: ${qualification ? qualification.label : 'nicht angegeben'}`] : []),
      ...(data.message ? ['', 'Nachricht:', data.message] : []),
      '',
      `Antwort fällig bis: ${formatResponseDeadline(data.receivedAt ?? new Date())}`,
      isContactEmail(data.contact)
        ? 'Bitte per E-Mail antworten. Eine kurze Rückmeldung genügt für die Frist.'
        : 'Bitte zuerst anrufen. Eine kurze Rückmeldung genügt für die Frist.',
    ].join('\n'),
  };

  if (isSafeReplyTo(data.replyTo)) mail.replyTo = data.replyTo;

  return mail;
}

/**
 * @param {MailConfig} config
 * @returns {object}
 */
export function buildSmtpTransportOptions(config) {
  return {
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      rejectUnauthorized: true,
    },
  };
}

/**
 * @param {MailConfig} config
 * @returns {SendMail}
 */
function createSmtpSendMail(config) {
  const transport = nodemailer.createTransport(buildSmtpTransportOptions(config));

  return (mail) => transport.sendMail(mail);
}

/**
 * Sends an application mail. SMTP failures intentionally have no public detail.
 *
 * @param {ApplicationData} data
 * @param {{ sendMail?: SendMail }} [deps]
 * @returns {Promise<'sent' | 'unavailable'>}
 */
export async function sendApplication(data, deps = {}) {
  const config = readMailConfig();
  if (!config) return 'unavailable';

  try {
    const sendMail = deps.sendMail ?? createSmtpSendMail(config);
    await sendMail(buildApplicationMail(data, config));
    return 'sent';
  } catch {
    return 'unavailable';
  }
}
