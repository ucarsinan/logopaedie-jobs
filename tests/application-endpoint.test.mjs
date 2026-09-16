import assert from 'node:assert/strict';
import test from 'node:test';

import { createApplicationEndpoint } from '../src/lib/application-endpoint.mjs';

const ENDPOINT_URL = 'https://xn--logopdiejobs-kcb.de/api/bewerbung';
const JOB_SLUG = 'logopaedin-sprachtherapeut-duisburg';
const MAX_BODY_BYTES = 8 * 1024;
const SMTP_ENVIRONMENT_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'APPLICATION_FROM',
  'APPLICATION_TO',
];
const VALID_FORM = new URLSearchParams({
  name: 'Erika Muster',
  kontakt: 'erika@example.test',
  nachricht: 'Neutrale Nachricht',
  stelle: JOB_SLUG,
  website: '',
});

function request(body = VALID_FORM.toString(), headers = {}, url = ENDPOINT_URL) {
  const requestHeaders = new Headers({
    'content-type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
    origin: 'https://xn--logopdiejobs-kcb.de',
  });

  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined) requestHeaders.delete(name);
    else requestHeaders.set(name, value);
  }

  return new Request(url, {
    method: 'POST',
    headers: requestHeaders,
    body,
  });
}

function redirect(location, status) {
  return new Response(null, { status, headers: { location } });
}

function endpoint(deps = {}) {
  return createApplicationEndpoint({
    sendApplication: async () => 'sent',
    isDevelopment: false,
    ...deps,
  });
}

function utf8Bytes(value) {
  return new TextEncoder().encode(value).byteLength;
}

async function json(response) {
  assert.match(response.headers.get('content-type') ?? '', /^application\/json/);
  return response.json();
}

async function withoutSmtpConfiguration(action) {
  const before = new Map(SMTP_ENVIRONMENT_KEYS.map((key) => [key, process.env[key]]));

  try {
    for (const key of SMTP_ENVIRONMENT_KEYS) delete process.env[key];
    return await action();
  } finally {
    for (const key of SMTP_ENVIRONMENT_KEYS) {
      const value = before.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('rejects unsupported content types without parsing or transport', async () => {
  let calls = 0;
  const response = await endpoint({
    sendApplication: async () => {
      calls += 1;
      return 'sent';
    },
  })({ request: request(VALID_FORM.toString(), { 'content-type': 'application/json' }), redirect });

  assert.equal(response.status, 415);
  assert.equal(calls, 0);
});

test('rejects an announced body larger than 8 KiB before reading it', async () => {
  let calls = 0;
  const response = await endpoint({
    sendApplication: async () => {
      calls += 1;
      return 'sent';
    },
  })({ request: request(VALID_FORM.toString(), { 'content-length': '8193' }), redirect });

  assert.equal(response.status, 413);
  assert.equal(calls, 0);
});

test('rejects a body larger than 8 KiB by its actual UTF-8 length', async () => {
  const response = await endpoint()({
    request: request(VALID_FORM.toString() + `&nachricht=${'x'.repeat(8192)}`),
    redirect,
  });

  assert.equal(response.status, 413);
});

test('accepts an actual body of exactly 8 KiB', async () => {
  const prefix = `${VALID_FORM.toString()}&nachricht=`;
  const body = prefix + 'x'.repeat(MAX_BODY_BYTES - utf8Bytes(prefix));
  assert.equal(utf8Bytes(body), MAX_BODY_BYTES);

  const response = await endpoint()({ request: request(body), redirect });

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { ok: true });
});

test('rejects an over-limit body based on multi-byte UTF-8 length', async () => {
  const prefix = `${VALID_FORM.toString()}&nachricht=`;
  const body = prefix + '€'.repeat(Math.ceil((MAX_BODY_BYTES + 1 - utf8Bytes(prefix)) / 3));
  assert.ok(utf8Bytes(body) > MAX_BODY_BYTES);

  const response = await endpoint()({ request: request(body), redirect });

  assert.equal(response.status, 413);
});

test('rejects a present foreign origin without transport', async () => {
  let calls = 0;
  const response = await endpoint({
    sendApplication: async () => {
      calls += 1;
      return 'sent';
    },
  })({ request: request(VALID_FORM.toString(), { origin: 'https://foreign.example.test' }), redirect });

  assert.equal(response.status, 403);
  assert.equal(calls, 0);
});

test('rejects localhost origins outside development', async () => {
  const response = await endpoint()({
    request: request(
      VALID_FORM.toString(),
      { origin: 'http://localhost:4321' },
      'http://localhost:4321/api/bewerbung',
    ),
    redirect,
  });

  assert.equal(response.status, 403);
});

test('allows a missing origin', async () => {
  const response = await endpoint()({
    request: request(VALID_FORM.toString(), { origin: undefined }),
    redirect,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { ok: true });
});

test('allows only the current localhost or loopback origin during development', async () => {
  const handler = endpoint({ isDevelopment: true });
  const localUrl = 'http://localhost:4321/api/bewerbung';
  const allowed = await handler({
    request: request(VALID_FORM.toString(), { origin: 'http://localhost:4321' }, localUrl),
    redirect,
  });
  const rejected = await handler({
    request: request(VALID_FORM.toString(), { origin: 'http://localhost:4322' }, localUrl),
    redirect,
  });
  const loopback = await handler({
    request: request(
      VALID_FORM.toString(),
      { origin: 'http://127.0.0.1:4321' },
      'http://127.0.0.1:4321/api/bewerbung',
    ),
    redirect,
  });

  assert.equal(allowed.status, 200);
  assert.equal(rejected.status, 403);
  assert.equal(loopback.status, 200);
});

test('uses JSON responses for fetch requests that do not explicitly accept JSON', async () => {
  const response = await endpoint()({
    request: request(VALID_FORM.toString(), { accept: '*/*', 'sec-fetch-mode': 'cors' }),
    redirect,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { ok: true });
});

test('returns invalid_form and fields for invalid JSON requests', async () => {
  const response = await endpoint()({
    request: request(new URLSearchParams({ ...Object.fromEntries(VALID_FORM), name: 'X' }).toString()),
    redirect,
  });

  assert.equal(response.status, 422);
  assert.deepEqual(await json(response), { ok: false, code: 'invalid_form', fields: ['name'] });
});

test('does not reflect unknown fields or the hidden job slug in JSON errors', async () => {
  const unknownField = await endpoint()({
    request: request(new URLSearchParams({ ...Object.fromEntries(VALID_FORM), neutral: 'Textbaustein' }).toString()),
    redirect,
  });
  const unknownJob = await endpoint()({
    request: request(new URLSearchParams({ ...Object.fromEntries(VALID_FORM), stelle: 'unbekannt' }).toString()),
    redirect,
  });

  assert.deepEqual(await json(unknownField), { ok: false, code: 'invalid_form', fields: [] });
  assert.deepEqual(await json(unknownJob), { ok: false, code: 'invalid_form', fields: [] });
});

test('acknowledges a honeypot bot without calling the transport', async () => {
  let calls = 0;
  const response = await endpoint({
    sendApplication: async () => {
      calls += 1;
      return 'sent';
    },
  })({ request: request(new URLSearchParams({ ...Object.fromEntries(VALID_FORM), website: 'neutral' }).toString()), redirect });

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { ok: true });
  assert.equal(calls, 0);
});

test('maps missing SMTP configuration to JSON 503 without transport detail', async () => {
  const response = await withoutSmtpConfiguration(() => createApplicationEndpoint()({
    request: request(),
    redirect,
  }));

  assert.equal(response.status, 503);
  assert.deepEqual(await json(response), { ok: false, code: 'service_unavailable' });
});

test('returns JSON success after the injected fake transport succeeds', async () => {
  let received;
  const response = await endpoint({
    sendApplication: async (data) => {
      received = data;
      return 'sent';
    },
  })({ request: request(), redirect });

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { ok: true });
  assert.deepEqual(received, {
    name: 'Erika Muster',
    contact: 'erika@example.test',
    message: 'Neutrale Nachricht',
    jobSlug: JOB_SLUG,
    replyTo: 'erika@example.test',
  });
});

test('uses only fixed native redirects without applicant data', async () => {
  const native = { accept: 'text/html' };
  const success = await endpoint()({ request: request(VALID_FORM.toString(), native), redirect });
  const invalid = await endpoint()({
    request: request(new URLSearchParams({ ...Object.fromEntries(VALID_FORM), name: 'X' }).toString(), native),
    redirect,
  });
  const unavailable = await endpoint({ sendApplication: async () => 'unavailable' })({
    request: request(VALID_FORM.toString(), native),
    redirect,
  });

  for (const [response, location] of [
    [success, '/bewerbung/danke/'],
    [invalid, 'https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/?status=invalid_form#bewerbung'],
    [unavailable, 'https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/?status=service_unavailable#bewerbung'],
  ]) {
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), location);
    assert.doesNotMatch(response.headers.get('location') ?? '', /Erika|erika|Nachricht|kontakt/i);
  }
});
