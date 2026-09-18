import assert from 'node:assert/strict';
import test from 'node:test';

import { createApplicationEndpoint } from '../src/lib/application-endpoint.mjs';

const ENDPOINT_URL = 'https://xn--logopdiejobs-kcb.de/bewerbung/senden/';
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
    vercelEnvironment: 'production',
    vercelUrl: '',
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
      'http://localhost:4321/bewerbung/senden/',
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
  const localUrl = 'http://localhost:4321/bewerbung/senden/';
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
      'http://127.0.0.1:4321/bewerbung/senden/',
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
    [invalid, '/jobs/logopaedin-sprachtherapeut-duisburg/?status=invalid_form#bewerbung'],
    [unavailable, '/jobs/logopaedin-sprachtherapeut-duisburg/?status=service_unavailable#bewerbung'],
  ]) {
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), location);
    assert.doesNotMatch(response.headers.get('location') ?? '', /Erika|erika|Nachricht|kontakt/i);
  }
});

// Synthetic streams only: no network or real SMTP.
function streamedRequest(chunks, headers = {}, { errorAt, cancelError = false } = {}) {
  const stats = { reads: 0, cancels: 0 };
  const body = new ReadableStream({
    pull(controller) {
      const index = stats.reads++;
      if (index === errorAt) controller.error(new Error('synthetic stream failure'));
      else if (index < chunks.length) controller.enqueue(chunks[index]);
      else controller.close();
    },
    cancel() {
      stats.cancels++;
      if (cancelError) throw new Error('synthetic cancel failure');
    },
  }, { highWaterMark: 0 });
  const req = new Request(ENDPOINT_URL, {
    method: 'POST', duplex: 'half', body,
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json', ...headers },
  });
  return { req, stats };
}

function paddedBytes(size) {
  const prefix = `${VALID_FORM.toString()}&nachricht=`;
  return new TextEncoder().encode(prefix + 'x'.repeat(size - utf8Bytes(prefix)));
}

for (const size of [8191, 8192, 8193]) {
  test(`stream boundary ${size} bytes without Content-Length`, async () => {
    let calls = 0;
    const { req, stats } = streamedRequest([paddedBytes(size)]);
    const response = await endpoint({ sendApplication: async () => { calls++; return 'sent'; } })({ request: req, redirect });
    assert.equal(response.status, size <= MAX_BODY_BYTES ? 200 : 413);
    assert.equal(calls, size <= MAX_BODY_BYTES ? 1 : 0);
    assert.equal(stats.cancels, size > MAX_BODY_BYTES ? 1 : 0);
    assert.equal(req.body.locked, false);
  });
}

test('retains UTF-8 characters split across byte chunks', async () => {
  const text = VALID_FORM.toString().replace('Neutrale+Nachricht', 'Grüße🙂');
  const bytes = new TextEncoder().encode(text);
  let received;
  const { req } = streamedRequest(Array.from(bytes, (byte) => new Uint8Array([byte])));
  const response = await endpoint({ sendApplication: async (data) => { received = data; return 'sent'; } })({ request: req, redirect });
  assert.equal(response.status, 200);
  assert.equal(received.message, 'Grüße🙂');
});

test('stops on the crossing chunk despite a falsely small Content-Length', async () => {
  let calls = 0;
  const bytes = paddedBytes(8193);
  const { req, stats } = streamedRequest([bytes.subarray(0, 8192), bytes.subarray(8192), new Uint8Array(1)], { 'content-length': '1' });
  const response = await endpoint({ sendApplication: async () => { calls++; return 'sent'; } })({ request: req, redirect });
  assert.equal(response.status, 413);
  assert.equal(stats.reads, 2);
  assert.equal(stats.cancels, 1);
  assert.equal(calls, 0);
  assert.equal(req.body.locked, false);
});

test('rejects falsely large Content-Length without consuming the stream', async () => {
  let calls = 0;
  const { req, stats } = streamedRequest([paddedBytes(8191)], { 'content-length': '99999' });
  const response = await endpoint({ sendApplication: async () => { calls++; return 'sent'; } })({ request: req, redirect });
  assert.equal(response.status, 413);
  assert.equal(stats.reads, 0);
  assert.equal(calls, 0);
});

test('accepts valid bounded body despite falsely small Content-Length', async () => {
  const { req } = streamedRequest([paddedBytes(8192)], { 'content-length': '1' });
  const response = await endpoint()({ request: req, redirect });
  assert.equal(response.status, 200);
});

test('rejects huge first chunk without reading subsequent chunks even if cancellation fails', async () => {
  let calls = 0;
  const { req, stats } = streamedRequest([new Uint8Array(1024 * 1024), new Uint8Array(1)], {}, { cancelError: true });
  const response = await endpoint({ sendApplication: async () => { calls++; return 'sent'; } })({ request: req, redirect });
  assert.equal(response.status, 413);
  assert.equal(stats.reads, 1);
  assert.equal(stats.cancels, 1);
  assert.equal(calls, 0);
  assert.equal(req.body.locked, false);
  assert.equal(await response.text(), '');
});

test('stream error after a partial body is neutral and never sends', async () => {
  let calls = 0;
  const { req } = streamedRequest([paddedBytes(1000)], {}, { errorAt: 1 });
  const response = await endpoint({ sendApplication: async () => { calls++; return 'sent'; } })({ request: req, redirect });
  assert.equal(response.status, 413);
  assert.equal(calls, 0);
  assert.equal(await response.text(), '');
  assert.equal(req.body.locked, false);
});

test('UTF-8 byte limit applies to raw multibyte input across chunks, also for no-JS', async () => {
  let calls = 0;
  const bytes = new TextEncoder().encode(`${VALID_FORM.toString()}&nachricht=${'€'.repeat(2800)}`);
  const { req, stats } = streamedRequest([bytes.subarray(0, 8190), bytes.subarray(8190)], { accept: 'text/html' });
  const response = await endpoint({ sendApplication: async () => { calls++; return 'sent'; } })({ request: req, redirect });
  assert.equal(response.status, 413);
  assert.equal(calls, 0);
  assert.equal(stats.cancels, 1);
  assert.equal(response.headers.get('location'), null);
});

test('empty stream remains a validation failure, not a transport attempt', async () => {
  let calls = 0;
  const { req } = streamedRequest([]);
  const response = await endpoint({ sendApplication: async () => { calls++; return 'sent'; } })({ request: req, redirect });
  assert.equal(response.status, 422);
  assert.equal(calls, 0);
});

// All accepted-origin probes stay invalid; transports are mocks only.
const PREVIEW_HOST = 'logopaedie-jobs-preview-a.vercel.app';
const PREVIEW_ORIGIN = `https://${PREVIEW_HOST}`;
const CANONICAL_ORIGIN = new URL(ENDPOINT_URL).origin;

for (const [label, origin, expected] of [
  ['exact deployment', PREVIEW_ORIGIN, 422],
  ['canonical', CANONICAL_ORIGIN, 422],
  ['other project', 'https://other.vercel.app', 403],
  ['other deployment', 'https://logopaedie-jobs-preview-b.vercel.app', 403],
  ['foreign', 'https://foreign.example.test', 403],
  ['wrong scheme', `http://${PREVIEW_HOST}`, 403],
  ['wrong port', `${PREVIEW_ORIGIN}:444`, 403],
  ['missing origin retains existing policy', undefined, 422],
]) {
  test(`preview origin: ${label}`, async () => {
    let calls = 0;
    const response = await endpoint({
      vercelEnvironment: 'preview', vercelUrl: PREVIEW_HOST,
      sendApplication: async () => { calls++; return 'sent'; },
    })({ request: request('qa=preview', { origin }, `${PREVIEW_ORIGIN}/bewerbung/senden/`), redirect });
    assert.equal(response.status, expected);
    assert.equal(calls, 0);
  });
}

for (const [label, origin, expected] of [
  ['canonical', CANONICAL_ORIGIN, 422],
  ['preview deployment', PREVIEW_ORIGIN, 403],
  ['other Vercel host', 'https://other.vercel.app', 403],
  ['missing origin retains existing policy', undefined, 422],
]) {
  test(`production origin: ${label}`, async () => {
    const response = await endpoint({ vercelEnvironment: 'production', vercelUrl: PREVIEW_HOST })({
      request: request('qa=preview', { origin }), redirect,
    });
    assert.equal(response.status, expected);
  });
}

test('request Host and X-Forwarded-Host cannot authorize an origin', async () => {
  for (const origin of [PREVIEW_ORIGIN, 'https://attacker.example.test']) {
    const response = await endpoint({ vercelEnvironment: 'preview', vercelUrl: PREVIEW_HOST })({
      request: request('qa=preview', {
        origin, host: 'attacker.example.test', 'x-forwarded-host': 'attacker.example.test',
      }, 'https://attacker.example.test/bewerbung/senden/'), redirect,
    });
    assert.equal(response.status, origin === PREVIEW_ORIGIN ? 422 : 403);
  }
});

test('missing or malformed deployment metadata fails closed', async () => {
  for (const vercelUrl of ['', undefined, '*.vercel.app', 'https://host.vercel.app',
    'host.vercel.app/path', 'host.vercel.app?x=1', 'host.vercel.app#fragment',
    'user@host.vercel.app', 'host.vercel.app:443', ' host.vercel.app',
    'host.vercel.app.', 'host..vercel.app', '-host.vercel.app', 'host_.vercel.app',
    'localhost', 'a'.repeat(64) + '.vercel.app', 'a.'.repeat(127) + 'app']) {
    const response = await endpoint({ vercelEnvironment: 'preview', vercelUrl })({
      request: request('qa=preview', { origin: PREVIEW_ORIGIN }), redirect,
    });
    assert.equal(response.status, 403);
  }
  for (const vercelEnvironment of ['', undefined, 'development', 'Preview', 'production']) {
    const response = await endpoint({ vercelEnvironment, vercelUrl: PREVIEW_HOST })({
      request: request('qa=preview', { origin: PREVIEW_ORIGIN }), redirect,
    });
    assert.equal(response.status, 403);
  }
});

test('development loopback policy remains same-origin only', async () => {
  for (const [origin, expected] of [['http://127.0.0.1:4321', 422], ['http://127.0.0.1:4322', 403], [PREVIEW_ORIGIN, 403]]) {
    const response = await endpoint({ isDevelopment: true, vercelEnvironment: 'development', vercelUrl: PREVIEW_HOST })({
      request: request('qa=preview', { origin }, 'http://127.0.0.1:4321/bewerbung/senden/'), redirect,
    });
    assert.equal(response.status, expected);
  }
});

test('native error redirects stay on the requesting preview or production origin', async () => {
  for (const origin of [PREVIEW_ORIGIN, CANONICAL_ORIGIN]) {
    const handler = endpoint({ vercelEnvironment: 'preview', vercelUrl: PREVIEW_HOST,
      sendApplication: async () => 'unavailable' });
    for (const [body, code] of [['qa=preview', 'invalid_form'], [VALID_FORM.toString(), 'service_unavailable']]) {
      const response = await handler({request: request(body, {origin, accept: 'text/html'}, `${origin}/bewerbung/senden/`), redirect});
      assert.equal(response.status, 303);
      const location = response.headers.get('location');
      assert.equal(location, `/jobs/${JOB_SLUG}/?status=${code}#bewerbung`);
      assert.equal(new URL(location, origin).origin, origin);
    }
    const response = await handler({request: request('qa=preview', {origin}, `${origin}/bewerbung/senden/`), redirect});
    assert.equal(response.status, 422);
    assert.equal(response.headers.get('location'), null);
    assert.equal((await response.json()).code, 'invalid_form');
  }
});
