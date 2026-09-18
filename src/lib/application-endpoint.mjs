import { MAX_BODY_BYTES, parseApplicationForm } from './application-form.mjs';
import { sendApplication } from './application-mail.mjs';

const CANONICAL_ORIGIN = 'https://xn--logopdiejobs-kcb.de';
const SUCCESS_LOCATION = '/bewerbung/danke/';
const INVALID_FORM_LOCATION = '/jobs/logopaedin-sprachtherapeut-duisburg/?status=invalid_form#bewerbung';
const UNAVAILABLE_LOCATION = '/jobs/logopaedin-sprachtherapeut-duisburg/?status=service_unavailable#bewerbung';
const PUBLIC_INVALID_FIELDS = new Set(['name', 'kontakt', 'nachricht']);

/**
 * @typedef {(data: import('./application-form.mjs').ApplicationData) => Promise<'sent' | 'unavailable'>} ApplicationSender
 * @typedef {(location: string, status: number) => Response} Redirect
 */

/**
 * @param {Request} request
 * @returns {boolean}
 */
function wantsJson(request) {
  const accept = request.headers.get('accept')?.toLowerCase() ?? '';
  return accept.includes('application/json') || request.headers.get('sec-fetch-mode') === 'cors';
}

/**
 * @param {object} body
 * @param {number} status
 * @returns {Response}
 */
function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * @param {string[]} fields
 * @returns {string[]}
 */
function publicInvalidFields(fields) {
  return fields.filter((field) => PUBLIC_INVALID_FIELDS.has(field));
}

/**
 * @param {Request} request
 * @returns {boolean}
 */
function hasFormContentType(request) {
  const contentType = request.headers.get('content-type');
  return contentType?.split(';', 1)[0].trim().toLowerCase() === 'application/x-www-form-urlencoded';
}

/**
 * @param {Request} request
 * @param {boolean} isDevelopment
 * @param {string | null} previewOrigin
 * @returns {boolean}
 */
function hasAllowedOrigin(request, isDevelopment, previewOrigin) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  if (origin === CANONICAL_ORIGIN || origin === previewOrigin) return true;
  if (!isDevelopment) return false;

  try {
    const requestOrigin = new URL(request.url).origin;
    const originUrl = new URL(origin);
    const isLocalHost = originUrl.protocol === 'http:'
      && (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1');

    return isLocalHost && origin === requestOrigin;
  } catch {
    return false;
  }
}

/**
 * @param {Request} request
 * @returns {boolean}
 */
function exceedsAnnouncedBodyLimit(request) {
  const contentLength = request.headers.get('content-length');
  return contentLength !== null && Number(contentLength) > MAX_BODY_BYTES;
}

/**
 * @param {Request} request
 * @returns {Promise<URLSearchParams | null>}
 */
async function readFormBody(request) {
  if (!request.body) return new URLSearchParams();

  /** @type {ReadableStreamDefaultReader<Uint8Array> | undefined} */
  let reader;
  try {
    reader = request.body.getReader();
    // Bound retained application bytes even if an upstream chunk is oversized.
    // The adapter may already have buffered data before handing us the stream.
    const bytes = new Uint8Array(MAX_BODY_BYTES);
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value.byteLength > MAX_BODY_BYTES - length) return null;
      bytes.set(value, length);
      length += value.byteLength;
    }
    return new URLSearchParams(new TextDecoder().decode(bytes.subarray(0, length)));
  } catch {
    return null;
  } finally {
    if (reader) {
      // Every read has settled. Release ownership without cancelling the
      // provider stream: Vercel may still deliver its underlying end event.
      // Unread transport/runtime buffers remain outside our application limit.
      reader.releaseLock();
    }
  }
}

/**
 * Trust only Vercel's deployment metadata, never request host headers.
 * Missing or malformed metadata leaves the canonical-origin policy intact.
 * @param {string | undefined} environment
 * @param {string | undefined} hostname
 * @returns {string | null}
 */
function getPreviewOrigin(environment, hostname) {
  if (environment !== 'preview' || typeof hostname !== 'string' || hostname.length > 253) return null;
  const dnsHostname = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
  if (!dnsHostname.test(hostname)) return null;
  return `https://${hostname}`;
}

/**
 * Creates the POST handler used by the Astro adapter. Dependency injection is
 * limited to tests so no live SMTP transport is ever needed there.
 *
 * @param {{ sendApplication?: ApplicationSender, isDevelopment?: boolean, vercelEnvironment?: string, vercelUrl?: string }} [deps]
 */
export function createApplicationEndpoint({
  sendApplication: applicationSender = sendApplication,
  isDevelopment = false,
  vercelEnvironment = process.env.VERCEL_ENV,
  vercelUrl = process.env.VERCEL_URL,
} = {}) {
  const previewOrigin = getPreviewOrigin(vercelEnvironment, vercelUrl);

  /** @param {{ request: Request, redirect: Redirect }} context */
  return async function postApplication({ request, redirect }) {
    if (!hasFormContentType(request)) return new Response(null, { status: 415 });
    if (exceedsAnnouncedBodyLimit(request)) return new Response(null, { status: 413 });
    if (!hasAllowedOrigin(request, isDevelopment, previewOrigin)) return new Response(null, { status: 403 });

    const body = await readFormBody(request);
    if (!body) return new Response(null, { status: 413 });

    const result = parseApplicationForm(body);
    if (!result.ok) {
      if (wantsJson(request)) {
        return json({ ok: false, code: 'invalid_form', fields: publicInvalidFields(result.fields) }, 422);
      }
      return redirect(INVALID_FORM_LOCATION, 303);
    }

    if (result.bot) {
      if (wantsJson(request)) return json({ ok: true }, 200);
      return redirect(SUCCESS_LOCATION, 303);
    }

    let delivery;
    try {
      delivery = await applicationSender(result.data);
    } catch {
      delivery = 'unavailable';
    }

    if (delivery !== 'sent') {
      if (wantsJson(request)) return json({ ok: false, code: 'service_unavailable' }, 503);
      return redirect(UNAVAILABLE_LOCATION, 303);
    }

    if (wantsJson(request)) return json({ ok: true }, 200);
    return redirect(SUCCESS_LOCATION, 303);
  };
}
