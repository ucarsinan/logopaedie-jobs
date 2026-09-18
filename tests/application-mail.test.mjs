import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildApplicationMail,
  formatResponseDeadline,
  buildSmtpTransportOptions,
  sendApplication,
} from '../src/lib/application-mail.mjs';

const DATA = Object.freeze({
  name: 'Ada Beispiel',
  contact: 'ada@example.test',
  message: 'Ich freue mich auf ein Kennenlernen.',
  jobSlug: 'logopaedin-sprachtherapeut-duisburg',
  replyTo: 'ada@example.test',
});

const CONFIG = Object.freeze({
  host: 'smtp.example.test',
  port: 587,
  user: 'mailer@example.test',
  password: 'synthetic-password',
  from: 'Karriere <jobs@example.test>',
  to: 'Team <bewerbungen@example.test>',
});

const ENVIRONMENT_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'APPLICATION_FROM',
  'APPLICATION_TO',
];

async function withMailEnvironment(values, action) {
  const before = new Map(ENVIRONMENT_KEYS.map((key) => [key, process.env[key]]));

  try {
    for (const key of ENVIRONMENT_KEYS) {
      if (values[key] === undefined) delete process.env[key];
      else process.env[key] = values[key];
    }

    return await action();
  } finally {
    for (const key of ENVIRONMENT_KEYS) {
      const value = before.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('returns unavailable when any required SMTP setting is missing', async () => {
  for (const omittedKey of ENVIRONMENT_KEYS) {
    const environment = {
      SMTP_HOST: CONFIG.host,
      SMTP_PORT: String(CONFIG.port),
      SMTP_USER: CONFIG.user,
      SMTP_PASSWORD: CONFIG.password,
      APPLICATION_FROM: CONFIG.from,
      APPLICATION_TO: CONFIG.to,
    };
    delete environment[omittedKey];

    let calls = 0;
    const result = await withMailEnvironment(environment, () => sendApplication(DATA, {
      sendMail: async () => {
        calls += 1;
      },
    }));

    assert.equal(result, 'unavailable');
    assert.equal(calls, 0);
  }
});

test('sends one text-only mail using configured subject, from and to fields', async () => {
  /** @type {unknown[]} */
  const received = [];
  const result = await withMailEnvironment({
    SMTP_HOST: CONFIG.host,
    SMTP_PORT: String(CONFIG.port),
    SMTP_USER: CONFIG.user,
    SMTP_PASSWORD: CONFIG.password,
    APPLICATION_FROM: CONFIG.from,
    APPLICATION_TO: CONFIG.to,
  }, () => sendApplication(DATA, {
    sendMail: async (mail) => {
      received.push(mail);
    },
  }));

  assert.equal(result, 'sent');
  assert.equal(received.length, 1);
  assert.deepEqual(received[0], buildApplicationMail(DATA, CONFIG));
  assert.equal(received[0].from, CONFIG.from);
  assert.equal(received[0].to, CONFIG.to);
  assert.match(received[0].subject, /Bewerbung als Logopädin/);
  assert.equal(typeof received[0].text, 'string');
  assert.match(received[0].text, /Stelle: Bewerbung als Logopädin/);
  assert.match(received[0].text, /Name: Ada Beispiel/);
  assert.match(received[0].text, /Kontakt: ada@example\.test/);
  assert.match(received[0].text, /Nachricht:\nIch freue mich auf ein Kennenlernen\./);
  assert.equal('html' in received[0], false);
  assert.equal('attachments' in received[0], false);
});

test('maps transport failures to unavailable without exposing their detail', async () => {
  const result = await withMailEnvironment({
    SMTP_HOST: CONFIG.host,
    SMTP_PORT: String(CONFIG.port),
    SMTP_USER: CONFIG.user,
    SMTP_PASSWORD: CONFIG.password,
    APPLICATION_FROM: CONFIG.from,
    APPLICATION_TO: CONFIG.to,
  }, () => sendApplication(DATA, {
    sendMail: async () => {
      throw new Error('synthetic transport failure');
    },
  }));

  assert.equal(result, 'unavailable');
});

test('uses a recognised email contact as replyTo', () => {
  const mail = buildApplicationMail(DATA, CONFIG);

  assert.equal(mail.replyTo, DATA.replyTo);
});

test('does not use a phone contact as replyTo', () => {
  const mail = buildApplicationMail({
    ...DATA,
    contact: '+49 203 123456',
    replyTo: undefined,
  }, CONFIG);

  assert.equal('replyTo' in mail, false);
});

test('does not use a non-email replyTo value even when it has no line breaks', () => {
  const mail = buildApplicationMail({
    ...DATA,
    replyTo: 'not-an-email-address',
  }, CONFIG);

  assert.equal('replyTo' in mail, false);
});

test('builds explicit secure SMTP options for port 465 only', () => {
  for (const [port, secure, requireTLS] of [[465, true, false], [587, false, true]]) {
    assert.deepEqual(buildSmtpTransportOptions({ ...CONFIG, port }), {
      host: CONFIG.host,
      port,
      secure,
      requireTLS,
      auth: {
        user: CONFIG.user,
        pass: CONFIG.password,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }
});

test('does not allow newlines in the applicant name to affect mail headers', () => {
  const mail = buildApplicationMail({
    ...DATA,
    name: 'Ada Beispiel\r\nBcc: injected@example.test',
  }, CONFIG);

  assert.equal(mail.from, CONFIG.from);
  assert.equal(mail.to, CONFIG.to);
  assert.equal(mail.replyTo, DATA.replyTo);
  assert.equal(mail.subject.includes('Ada Beispiel'), false);
  assert.equal(mail.subject.includes('\n'), false);
  assert.match(mail.text, /Bcc: injected@example\.test/);
});

test('response deadline adds twelve hours during the day', () => {
  // 18.09.2026 ist Sommerzeit: 07:30 UTC entspricht 09:30 in Berlin.
  const deadline = formatResponseDeadline(new Date('2026-09-18T07:30:00Z'));
  assert.equal(deadline, 'Fr, 18.09.2026, 21:30 Uhr');
});

test('response deadline started in the evening begins at eight the next morning', () => {
  // 20:15 Berlin liegt im Nachtfenster, die Frist startet erst um 08:00.
  const deadline = formatResponseDeadline(new Date('2026-09-18T18:15:00Z'));
  assert.equal(deadline, 'Sa, 19.09.2026, 20:00 Uhr');
});

test('response deadline started after midnight begins at eight the same morning', () => {
  // 02:00 Berlin am Samstag.
  const deadline = formatResponseDeadline(new Date('2026-09-19T00:00:00Z'));
  assert.equal(deadline, 'Sa, 19.09.2026, 20:00 Uhr');
});

test('response deadline crosses the month boundary', () => {
  // 30.09.2026 um 18:00 Berlin.
  const deadline = formatResponseDeadline(new Date('2026-09-30T16:00:00Z'));
  assert.equal(deadline, 'Do, 01.10.2026, 06:00 Uhr');
});

test('application mail carries the internal deadline and the call-first note', () => {
  const mail = buildApplicationMail(
    { ...DATA, receivedAt: new Date('2026-09-18T07:30:00Z') },
    CONFIG,
  );
  assert.match(mail.text, /Antwort fällig bis: Fr, 18\.09\.2026, 21:30 Uhr/);
  assert.match(mail.text, /Bitte zuerst anrufen/);
});
