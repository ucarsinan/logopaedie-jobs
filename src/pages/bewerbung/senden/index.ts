import type { APIRoute } from 'astro';

import jobSource from '../../../content/jobs/logopaedin-sprachtherapeut-duisburg.json' with { type: 'json' };
import { createApplicationEndpoint } from '../../../lib/application-endpoint.mjs';
import { isApplicationOpen } from '../../../lib/job-publication-artifacts.mjs';

export const prerender = false;

export const POST: APIRoute = createApplicationEndpoint({
  acceptApplications: () => isApplicationOpen(jobSource),
  isDevelopment: import.meta.env.DEV,
});
