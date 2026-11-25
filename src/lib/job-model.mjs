import { z } from 'astro/zod';

const recruitingOrigin = 'https://xn--logopdiejobs-kcb.de';
const employer = 'Praxis für Logopädie Şimşek';
const text = z.string().trim().min(1);
const textList = z.array(text).min(1);
const date = z.iso.date();
const httpsUrl = z.url({ protocol: /^https$/, normalize: true });
const positiveNumber = z.number().positive();
const positiveInteger = z.number().int().positive();

const localDate = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const hoursFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 20 });

const workdays = z.enum([
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
]);
const applicationRoute = z.enum(['SHORT_FORM', 'WHATSAPP', 'PHONE', 'CALLBACK', 'EMAIL', 'POST']);
const digitalRoutes = new Set(['SHORT_FORM', 'WHATSAPP', 'CALLBACK', 'EMAIL']);

const partTimeRange = z.strictObject({ min: positiveNumber, max: positiveNumber })
  .refine(({ min, max }) => min <= max, {
    path: ['max'], error: 'Die maximale Teilzeitstundenzahl unterschreitet das Minimum.',
  });

const salaryRange = z.strictObject({
  min: positiveNumber,
  max: positiveNumber,
  currency: z.literal('EUR'),
  unit: z.literal('HOUR'),
}).refine(({ min, max }) => min <= max, {
  path: ['max'], error: 'Der maximale Stundenlohn unterschreitet das Minimum.',
});

const loadRange = z.strictObject({
  period: z.enum(['DAY', 'WEEK']),
  min: positiveInteger,
  max: positiveInteger,
  buffer: text,
}).refine(({ min, max }) => min <= max, {
  path: ['max'], error: 'Die maximale Terminlast unterschreitet das Minimum.',
});
const exampleWeek = z.strictObject({
  example_week: loadRange.safeExtend({ period: z.literal('WEEK') }),
});

const commonJob = z.strictObject({
  schema_version: z.literal('1.0'),
  job_id: z.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  canonical_url: httpsUrl,
  employer: z.literal(employer),
  editorial_owner: z.literal('Praxisleitung'),
  title: text,
  contract_ends_at: date.optional(),
  privacy_notice_url: httpsUrl.optional(),
  additional_compensation: z.array(z.strictObject({ name: text, conditions: text })).optional(),
  career_stage_tags: z.array(z.enum(['ENTRY', 'RETURN', 'EXPERIENCED'])).optional(),
  benefits: textList.optional(),
  language_requirements: z.array(z.strictObject({ language: text, level: text })).optional(),
  specializations: z.strictObject({ required: z.array(text), learnable: z.array(text) }).optional(),
});

const publicationFields = z.strictObject({
  published_at: date,
  last_reviewed_at: date,
  expires_at: date,
  location: z.strictObject({
    street_address: text,
    locality: text,
    postal_code: z.string().regex(/^\d{5}$/),
    region: text,
    country: z.literal('DE'),
  }),
  employment_types: z.array(z.enum(['FULL_TIME', 'PART_TIME'])).min(1),
  contract_type: z.enum(['PERMANENT', 'FIXED_TERM']),
  weekly_hours: z.strictObject({
    full_time: positiveNumber,
    part_time: z.union([partTimeRange, z.strictObject({ negotiable: z.literal(true) })]).optional(),
  }),
  schedule: z.strictObject({
    workdays: z.array(workdays).min(1),
    four_day_option: z.boolean(),
    regular_times: textList,
  }),
  salary: salaryRange,
  salary_context: text,
  tariff_status: z.strictObject({
    status: z.enum(['TARIFF', 'HOUSE_TARIFF', 'NO_TARIFF']),
    basis: text.optional(),
  }).refine(({ status, basis }) => status === 'NO_TARIFF' || basis !== undefined, {
    path: ['basis'], error: 'Für diese Tarifbindung ist die Tarifgrundlage erforderlich.',
  }),
  role_summary: text,
  responsibilities: textList,
  treatment_units: z.array(z.strictObject({ minutes: positiveInteger, conditions: text })).min(1),
  treatment_load: z.union([loadRange, exampleWeek]),
  documentation_time: z.strictObject({ paid: z.boolean(), planning: text, scope: textList }),
  overtime_policy: z.strictObject({
    status: z.enum(['NOT_EXPECTED', 'EXCEPTIONAL', 'REGULAR']),
    compensation: text.optional(),
    compensation_period: text.optional(),
  }).refine(({ status, compensation }) => status === 'NOT_EXPECTED' || compensation !== undefined, {
    path: ['compensation'], error: 'Der Überstundenausgleich ist erforderlich.',
  }).refine(({ status, compensation_period }) => status === 'NOT_EXPECTED' || compensation_period !== undefined, {
    path: ['compensation_period'], error: 'Der Zeitraum für den Überstundenausgleich ist erforderlich.',
  }),
  home_visits: z.strictObject({
    status: z.enum(['REQUIRED', 'OPTIONAL', 'NONE']),
    travel_time: text.optional(),
    travel_costs: text.optional(),
  }).refine(({ status, travel_time }) => status === 'NONE' || travel_time !== undefined, {
    path: ['travel_time'], error: 'Für Hausbesuche ist die Wegezeitregel erforderlich.',
  }).refine(({ status, travel_costs }) => status === 'NONE' || travel_costs !== undefined, {
    path: ['travel_costs'], error: 'Für Hausbesuche ist die Fahrtkostenregel erforderlich.',
  }),
  team_support: textList,
  onboarding: z.strictObject({ components: textList, phases: textList, appointment_ramp_up: text }),
  continuing_education: z.strictObject({ time: text, costs: text, leave: text, conditions: text }),
  required_qualifications: textList,
  recognition_requirement: z.strictObject({
    status: z.enum(['REQUIRED', 'IN_PROGRESS_ACCEPTED', 'NOT_APPLICABLE']),
    details: text,
  }),
  experience_requirement: z.strictObject({ status: z.enum(['NONE', 'PREFERRED', 'REQUIRED']), details: text }),
  application_routes: z.array(applicationRoute).min(1),
  first_step_policy: z.strictObject({
    account_required: z.literal(false),
    cover_letter_required: z.literal(false),
    cv_required: z.literal(false),
  }),
  process_steps: textList,
  acknowledgement: z.strictObject({ method: z.enum(['AUTOMATIC', 'MANUAL']), details: text }),
  response_window: z.strictObject({ amount: positiveNumber, unit: z.enum(['WORKDAYS', 'BUSINESS_HOURS']) }),
});

export const jobSchema = z.discriminatedUnion('publication_status', [
  commonJob.extend({ ...publicationFields.shape, publication_status: z.literal('ACTIVE') }),
  commonJob.extend({
    ...publicationFields.partial().shape,
    publication_status: z.enum(['DRAFT', 'PAUSED', 'FILLED', 'EXPIRED']),
  }),
]).superRefine((job, ctx) => {
  /** @param {string[]} path @param {string} message */
  const issue = (path, message) => ctx.addIssue({ code: 'custom', path, message });

  if (job.canonical_url !== `${recruitingOrigin}/jobs/${job.slug}/`) {
    issue(['canonical_url'], 'Die kanonische URL muss zur Stellenroute auf logopädiejobs.de passen.');
  }

  const today = localDate.format(new Date());
  const { published_at, last_reviewed_at, expires_at } = job;
  if (published_at && published_at > today) {
    issue(['published_at'], 'Das Veröffentlichungsdatum darf nicht in der Zukunft liegen.');
  }
  if (last_reviewed_at && (last_reviewed_at > today || (published_at && last_reviewed_at < published_at))) {
    issue(['last_reviewed_at'], 'Das Prüfdatum muss zwischen Veröffentlichung und heute liegen.');
  }
  const referenceDate = last_reviewed_at ?? published_at;
  if (expires_at && referenceDate && expires_at < referenceDate) {
    issue(['expires_at'], 'Das Ablaufdatum darf nicht vor der letzten Prüfung oder Veröffentlichung liegen.');
  }

  if (job.contract_type === 'FIXED_TERM' && !job.contract_ends_at) {
    issue(['contract_ends_at'], 'Für eine Befristung ist ein Enddatum erforderlich.');
  }
  if (job.weekly_hours) {
    const { full_time, part_time } = job.weekly_hours;
    if (job.employment_types?.includes('PART_TIME') && !part_time) {
      issue(['weekly_hours', 'part_time'], 'Teilzeit braucht eine Stundenspanne oder eine verhandelbare Regelung.');
    }
    if (part_time && 'max' in part_time && part_time.max > full_time) {
      issue(['weekly_hours', 'part_time', 'max'], 'Teilzeit darf den Vollzeitumfang nicht überschreiten.');
    }
  }
  if (job.experience_requirement?.status === 'REQUIRED' && job.career_stage_tags?.includes('ENTRY')) {
    issue(['career_stage_tags'], 'Berufseinstieg ist mit zwingend erforderlicher Berufserfahrung unvereinbar.');
  }

  if (job.publication_status === 'ACTIVE') {
    if (job.contract_type === 'FIXED_TERM' && job.contract_ends_at) {
      if (job.contract_ends_at < job.published_at) {
        issue(['contract_ends_at'], 'Das Vertragsende darf nicht vor der Veröffentlichung liegen.');
      } else if (job.contract_ends_at < today) {
        issue(['contract_ends_at'], 'Der befristete Vertrag einer aktiven Stelle darf nicht beendet sein.');
      }
    }
    if (job.expires_at < today) {
      issue(['expires_at'], 'Eine aktive Stelle darf nicht abgelaufen sein.');
    }
    if (job.application_routes.some((route) => digitalRoutes.has(route)) && !job.privacy_notice_url) {
      issue(['privacy_notice_url'], 'Digitale Bewerbungswege erfordern einen Datenschutzhinweis.');
    }
  }
});

/** @typedef {z.infer<typeof jobSchema>} JobRecord Eine validierte Stelle der Praxis für Logopädie Şimşek. */
/** @typedef {Extract<JobRecord, { publication_status: 'ACTIVE' }>} ActiveJobRecord Ein veröffentlichungsfähiger Datensatz. */

/** @param {Pick<ActiveJobRecord, 'salary' | 'weekly_hours'>} job */
export function monthlySalaryRange(job) {
  const { full_time } = job.weekly_hours;
  const { min, max } = job.salary;
  return {
    min: Math.round((min * full_time * 52 / 12) * 100) / 100,
    max: Math.round((max * full_time * 52 / 12) * 100) / 100,
  };
}

/** @param {string} value */
function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/** @param {string[]} items */
function htmlList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

/** @param {ActiveJobRecord} job */
function workHoursText(job) {
  const { full_time, part_time } = job.weekly_hours;
  const hours = [];
  if (job.employment_types.includes('FULL_TIME')) {
    hours.push(`Vollzeit: ${hoursFormat.format(full_time)} Stunden pro Woche`);
  }
  if (job.employment_types.includes('PART_TIME') && part_time) {
    const partTimeHours = 'negotiable' in part_time
      ? 'Stundenumfang verhandelbar'
      : `${hoursFormat.format(part_time.min)}–${hoursFormat.format(part_time.max)} Stunden pro Woche`;
    hours.push(`Teilzeit: ${partTimeHours}`);
  }
  return hours.join(' · ');
}

/** @param {ActiveJobRecord} job */
export function toJobPosting(job) {
  const { location, salary } = job;
  const workHours = workHoursText(job);
  const experience = job.experience_requirement.status === 'NONE'
    ? 'no requirements'
    : job.experience_requirement.details;
  const description = [
    `<p>${escapeHtml(job.role_summary)}</p>`,
    '<p>Aufgaben</p>',
    htmlList(job.responsibilities),
    '<p>Qualifikation</p>',
    htmlList(job.required_qualifications),
    `<p>Arbeitszeit: ${escapeHtml(workHours)}</p>`,
    `<p>Berufserfahrung: ${escapeHtml(job.experience_requirement.details)}</p>`,
    ...(job.language_requirements?.length
      ? ['<p>Sprachkenntnisse</p>', htmlList(job.language_requirements.map(({ language, level }) => `${language}: ${level}`))]
      : []),
  ].join('');

  return {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description,
    url: job.canonical_url,
    datePosted: job.published_at,
    validThrough: job.expires_at,
    directApply: !job.first_step_policy.account_required,
    identifier: { '@type': 'PropertyValue', name: job.employer, value: job.job_id },
    employmentType: job.employment_types,
    workHours,
    educationRequirements: job.required_qualifications.join('\n'),
    experienceRequirements: experience,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.employer,
      sameAs: 'https://logopaedie-simsek.de/',
      logo: `${recruitingOrigin}/praxis-simsek-logo.svg`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.street_address,
        addressLocality: location.locality,
        addressRegion: location.region,
        postalCode: location.postal_code,
        addressCountry: location.country,
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: salary.min,
        maxValue: salary.max,
        unitText: salary.unit,
      },
    },
    responsibilities: job.responsibilities.join('\n'),
    qualifications: job.required_qualifications.join('\n'),
  };
}
