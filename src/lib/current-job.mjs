import jobSource from '../content/jobs/logopaedin-sprachtherapeut-duisburg.json' with { type: 'json' };
import { jobSchema } from './job-model.mjs';
import { publicationArtifacts } from './job-publication-artifacts.mjs';

export const currentJob = publicationArtifacts(jobSchema.parse(jobSource));
