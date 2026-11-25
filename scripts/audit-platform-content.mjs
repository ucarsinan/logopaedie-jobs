import {
  lstatSync,
  readdirSync,
  readFileSync,
  realpathSync,
} from 'node:fs';
import { pathToFileURL } from 'node:url';
import { extname, join, relative, resolve, sep } from 'node:path';

const CSV_COLUMNS = [
  'url',
  'repository',
  'audience',
  'intent',
  'owner_domain',
  'canonical',
  'cross_domain_cta',
  'jobposting_count',
  'status',
];

const TEXT_EXTENSIONS = new Set(['.astro', '.md', '.mdx', '.ts', '.js', '.mjs', '.cjs', '.txt']);
const CONFIG_NAMES = new Set(['astro.config.js', 'astro.config.mjs', 'astro.config.cjs', 'astro.config.ts']);
const JOBS_DOMAIN = 'logopädiejobs.de';
const JOBS_DOMAIN_ASCII = 'xn--logopdiejobs-kcb.de';
const PRACTICE_DOMAIN = 'logopaedie-simsek.de';

function isInside(root, candidate) {
  const path = relative(root, candidate);
  return path === '' || (!path.startsWith(`..${sep}`) && path !== '..' && !path.startsWith(sep));
}

function safeRoot(root, label) {
  if (typeof root !== 'string' || root.length === 0) {
    throw new TypeError(`${label} must be a non-empty path`);
  }
  return realpathSync(resolve(root));
}

function isApplicationPayload(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/').toLowerCase();
  return normalized.includes('/bewerbung/senden/')
    || normalized.includes('/applications/')
    || normalized.includes('/application-payload')
    || normalized.includes('/bewerbungen/')
    || /\/api\/.*(?:apply|application|bewerb)/.test(normalized);
}

function collectDirectory(root, relativeDirectory, errors) {
  const absoluteDirectory = join(root, relativeDirectory);
  const files = [];

  try {
    if (!lstatSync(absoluteDirectory).isDirectory()) return files;
    for (const entry of readdirSync(absoluteDirectory, { withFileTypes: true })) {
      const relativePath = join(relativeDirectory, entry.name);
      const absolutePath = join(root, relativePath);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        files.push(...collectDirectory(root, relativePath, errors));
      } else if (entry.isFile() && TEXT_EXTENSIONS.has(extname(entry.name)) && !isApplicationPayload(relativePath)) {
        files.push({ absolutePath, relativePath: relativePath.replaceAll('\\', '/') });
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') errors.push({ repositoryPath: relativeDirectory, message: error.message });
  }
  return files;
}

function allowedFiles(root, errors) {
  const files = [
    ...collectDirectory(root, 'src/pages', errors),
    ...collectDirectory(root, 'src/content', errors),
    ...collectDirectory(root, 'src/components', errors),
  ];

  for (const relativePath of ['public/llms.txt', 'public/robots.txt']) {
    const absolutePath = join(root, relativePath);
    try {
      if (lstatSync(absolutePath).isFile()) files.push({ absolutePath, relativePath });
    } catch (error) {
      if (error.code !== 'ENOENT') errors.push({ repositoryPath: relativePath, message: error.message });
    }
  }

  for (const name of CONFIG_NAMES) {
    const absolutePath = join(root, name);
    try {
      if (lstatSync(absolutePath).isFile()) files.push({ absolutePath, relativePath: name });
    } catch (error) {
      if (error.code !== 'ENOENT') errors.push({ repositoryPath: name, message: error.message });
    }
  }

  return files.filter(({ absolutePath }) => {
    try {
      return isInside(root, realpathSync(absolutePath));
    } catch (error) {
      errors.push({ repositoryPath: relative(root, absolutePath), message: error.message });
      return false;
    }
  });
}

function routeFromPath(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/');
  if (normalized === 'public/llms.txt') return '/llms.txt';
  if (normalized === 'public/robots.txt') return '/robots.txt';
  if (normalized.startsWith('src/content/')) {
    if (normalized.startsWith('src/content/ratgeber/')) {
      return `/berufshandbuch/${normalized.slice('src/content/ratgeber/'.length).replace(/\.(?:md|mdx)$/, '')}/`;
    }
    return `NOT_FOUND:${normalized}`;
  }
  if (!normalized.startsWith('src/pages/')) return null;
  const route = normalized
    .slice('src/pages/'.length)
    .replace(/\.(?:astro|md|mdx|ts|js)$/, '')
    .replace(/\/index$/, '');
  return route === 'index' || route === '' ? '/' : `/${route}/`;
}

function extractCanonical(source) {
  const direct = source.match(/(?:rel=["']canonical["'][^>]*href|canonical(?:Url|URL)?\s*=)\s*[{:]*["'`]([^"'`]+)["'`]/i);
  if (direct) return direct[1];
  const variable = source.match(/canonical(?:Url|URL)?\s*=\s*["'`]([^"'`]+)["'`]/i);
  return variable?.[1] ?? '';
}

function classify(source, relativePath) {
  const sample = `${relativePath} ${source}`.toLowerCase();
  const normalizedPath = relativePath.toLowerCase();
  if (/src\/pages\/(?:404|datenschutz|impressum|barrierefreiheit)(?:\.|\/|$)/.test(normalizedPath)
    || normalizedPath === 'public/robots.txt') {
    return { audience: 'allgemein', intent: 'mixed', ownerDomain: '' };
  }
  if (/src\/pages\/(?:jobs|karriere|kariyer|berufshandbuch|bewerbung|gehaltsrechner|schulen)(?:\/|\.|$)/.test(normalizedPath)) {
    return { audience: 'Fachkräfte und Arbeitgeber', intent: 'career', ownerDomain: JOBS_DOMAIN };
  }
  if (/src\/pages\/(?:therapie|therapieangebot|terapi|iletisim|team|ekip)(?:\/|\.|$)/.test(normalizedPath)) {
    return { audience: 'Patient:innen und Angehörige', intent: 'patient', ownerDomain: PRACTICE_DOMAIN };
  }
  const careerScore = (sample.match(/job|stelle|karriere|kariyer|bewerb|gehalt|arbeitgeber|ausbildung/g) ?? []).length;
  const patientScore = (sample.match(/patient|therapie|terapi|behandlung|störung|stoerung|kontakt|iletisim/g) ?? []).length;
  if (careerScore > patientScore) return { audience: 'Fachkräfte und Arbeitgeber', intent: 'career', ownerDomain: JOBS_DOMAIN };
  if (patientScore > careerScore) return { audience: 'Patient:innen und Angehörige', intent: 'patient', ownerDomain: PRACTICE_DOMAIN };
  return { audience: 'allgemein', intent: 'mixed', ownerDomain: '' };
}

function findCrossDomainLinks(source, repository, sourcePath) {
  const targetPattern = repository === 'jobs'
    ? /https?:\/\/(?:www\.)?logopaedie-simsek\.de(?:\/[^\s"'<>)]*)?/giu
    : /https?:\/\/(?:www\.)?(?:logopädiejobs\.de|xn--logopdiejobs-kcb\.de)(?:\/[^\s"'<>)]*)?/giu;
  return [...new Set(source.match(targetPattern) ?? [])].map((target) => {
    const parsed = new URL(target);
    return {
      repository,
      sourcePath,
      target,
      homepageOnly: parsed.pathname === '/' && parsed.search === '' && parsed.hash === '',
    };
  });
}

function auditOneRepository(root, repository) {
  const errors = [];
  const pages = [];
  const jobPostingOccurrences = [];
  const crossDomainLinks = [];

  for (const file of allowedFiles(root, errors)) {
    let source;
    try {
      source = readFileSync(file.absolutePath, 'utf8');
    } catch (error) {
      errors.push({ repositoryPath: file.relativePath, message: error.message });
      continue;
    }
    const jobPostingCount = (source.match(/JobPosting/g) ?? []).length;
    if (jobPostingCount > 0) {
      jobPostingOccurrences.push({ repository, path: file.relativePath, count: jobPostingCount });
    }
    crossDomainLinks.push(...findCrossDomainLinks(source, repository, file.relativePath));

    const route = routeFromPath(file.relativePath);
    if (!route) continue;
    const classification = classify(source, file.relativePath);
    const expectedRepository = classification.intent === 'career' ? 'jobs'
      : classification.intent === 'patient' ? 'practice'
        : null;
    pages.push({
      url: route,
      repository,
      audience: classification.audience,
      intent: classification.intent,
      ownerDomain: classification.ownerDomain,
      canonical: extractCanonical(source),
      crossDomainCta: findCrossDomainLinks(source, repository, file.relativePath).map(({ target }) => target).join(' | '),
      jobPostingCount,
      status: route.startsWith('NOT_FOUND:') ? 'NOT_FOUND'
        : expectedRepository === null ? 'INSUFFICIENT_EVIDENCE'
        : expectedRepository === repository ? 'SUPPORTED'
          : 'CONFLICTING',
    });
  }

  return { pages, jobPostingOccurrences, crossDomainLinks, errors };
}

export function auditRepositories({ jobsRoot, practiceRoot }) {
  const roots = {
    jobs: safeRoot(jobsRoot, 'jobsRoot'),
    practice: safeRoot(practiceRoot, 'practiceRoot'),
  };
  const jobs = auditOneRepository(roots.jobs, 'jobs');
  const practice = auditOneRepository(roots.practice, 'practice');
  const pages = [...jobs.pages, ...practice.pages].sort((a, b) => (
    a.repository.localeCompare(b.repository) || a.url.localeCompare(b.url)
  ));
  const intentsByRepository = new Map();
  for (const page of pages) {
    if (!intentsByRepository.has(page.intent)) intentsByRepository.set(page.intent, new Set());
    intentsByRepository.get(page.intent).add(page.repository);
  }
  const duplicateIntentCandidates = [...intentsByRepository]
    .filter(([intent, repositories]) => intent !== 'mixed' && repositories.size > 1)
    .map(([intent, repositories]) => ({ intent, repositories: [...repositories].sort() }));

  return {
    pages,
    jobPostingOccurrences: [...jobs.jobPostingOccurrences, ...practice.jobPostingOccurrences],
    crossDomainLinks: [...jobs.crossDomainLinks, ...practice.crossDomainLinks],
    duplicateIntentCandidates,
    errors: [...jobs.errors, ...practice.errors],
  };
}

function csvCell(value) {
  const string = String(value ?? '');
  return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

export function toOwnershipCsv(auditResult) {
  const rows = auditResult.pages.map((page) => ({
    url: page.url,
    repository: page.repository,
    audience: page.audience,
    intent: page.intent,
    owner_domain: page.ownerDomain,
    canonical: page.canonical,
    cross_domain_cta: page.crossDomainCta,
    jobposting_count: page.jobPostingCount,
    status: page.status,
  }));
  return [CSV_COLUMNS.join(','), ...rows.map((row) => CSV_COLUMNS.map((column) => csvCell(row[column])).join(','))].join('\n');
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  const [jobsRoot, practiceRoot] = process.argv.slice(2);
  if (!jobsRoot || !practiceRoot) {
    console.error('Usage: node scripts/audit-platform-content.mjs <jobsRoot> <practiceRoot>');
    process.exitCode = 1;
  } else {
    process.stdout.write(`${toOwnershipCsv(auditRepositories({ jobsRoot, practiceRoot }))}\n`);
  }
}
