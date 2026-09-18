import nodemailer from 'nodemailer';

import { KNOWN_JOBS } from './application-form.mjs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interne Antwortfrist nach DEC-135: 12 Stunden an allen Tagen, Anruf vor
// E-Mail. Geht eine Anfrage zwischen 20:00 und 08:00 Uhr ein, beginnt die
// Frist erst um 08:00 Uhr.
const DEADLINE_HOURS = 12;
const NIGHT_START_HOUR = 20;
const DAY_START_HOUR = 8;
const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

/**
 * Wanduhrzeit in Europe/Berlin, unabhaengig von der Serverzeitzone.
 *
 * @param {Date} instant
 * @returns {{year: number, month: number, day: number, hour: number, minute: number}}
 */
function berlinWallClock(instant) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(instant).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = Number(part.value);
    return acc;
  }, /** @type {Record<string, number>} */ ({}));
  return {
    year: parts.year, month: parts.month, day: parts.day,
    hour: parts.hour, minute: parts.minute,
  };
}

/**
 * Rechnet die interne Frist aus. Die Arithmetik laeuft in Berliner
 * Wanduhrzeit; an den beiden Zeitumstellungen im Jahr kann sie deshalb um
 * eine Stunde abweichen. Das ist fuer eine Erinnerungszeile hinnehmbar.
 *
 * @param {Date} receivedAt
 * @returns {string} z. B. "Sa, 19.09.2026, 09:30 Uhr"
 */
export function formatResponseDeadline(receivedAt) {
  let { year, month, day, hour, minute } = berlinWallClock(receivedAt);

  if (hour >= NIGHT_START_HOUR) {
    ({ year, month, day } = shiftDay(year, month, day, 1));
    hour = DAY_START_HOUR;
    minute = 0;
  } else if (hour < DAY_START_HOUR) {
    hour = DAY_START_HOUR;
    minute = 0;
  }

  hour += DEADLINE_HOURS;
  while (hour >= 24) {
    hour -= 24;
    ({ year, month, day } = shiftDay(year, month, day, 1));
  }

  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const pad = (/** @type {number} */ value) => String(value).padStart(2, '0');
  return `${weekday}, ${pad(day)}.${pad(month)}.${year}, ${pad(hour)}:${pad(minute)} Uhr`;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {number} offset
 */
function shiftDay(year, month, day, offset) {
  const shifted = new Date(Date.UTC(year, month - 1, day + offset));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
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

  /** @type {MailOptions} */
  const mail = {
    subject: `Neue Bewerbung: ${job}`,
    from: config.from,
    to: config.to,
    text: [
      'Neue Bewerbung über das Kurzformular',
      '',
      `Stelle: ${job}`,
      `Name: ${data.name}`,
      `Kontakt: ${data.contact}`,
      ...(data.message ? ['', 'Nachricht:', data.message] : []),
      '',
      `Antwort fällig bis: ${formatResponseDeadline(data.receivedAt ?? new Date())}`,
      'Bitte zuerst anrufen. Eine kurze Rückmeldung genügt für die Frist.',
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
