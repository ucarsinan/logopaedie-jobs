import type { APIRoute } from 'astro';

import { createApplicationEndpoint } from '../../../lib/application-endpoint.mjs';

export const prerender = false;

export const POST: APIRoute = createApplicationEndpoint({
  isDevelopment: import.meta.env.DEV,
});
