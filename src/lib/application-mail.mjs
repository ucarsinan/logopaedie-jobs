import nodemailer from 'nodemailer';

import { KNOWN_JOBS } from './application-form.mjs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
