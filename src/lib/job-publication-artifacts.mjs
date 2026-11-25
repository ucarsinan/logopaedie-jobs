import { monthlySalaryRange, toJobPosting } from './job-model.mjs';

const roundedCurrencyFormatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const hoursFormatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 20 });

const applicationRouteLabels = {
  SHORT_FORM: 'das kurze Formular',
  WHATSAPP: 'WhatsApp',
  PHONE: 'telefonisch',
  CALLBACK: 'einen Rückruf',
  EMAIL: 'E-Mail',
  POST: 'Post',
};
const conditionLabels = {
  workModel: 'Arbeitsmodell',
  contract: 'Vertrag',
  treatmentUnits: 'Behandlungseinheiten',
  reviewBoundary: 'Prüfstand der Anzeige',
  tariff: 'Tarifbindung',
  treatmentLoad: 'Therapien pro Woche',
  documentation: 'Bezahlte Arbeitszeit',
  homeVisits: 'Hausbesuche',
  overtime: 'Überstunden',
  training: 'Fortbildungen',
  onboarding: 'Einarbeitung',
};
const visibleConditionKeys = [
  'workModel', 'contract', 'reviewBoundary', 'treatmentLoad', 'documentation',
  'homeVisits', 'overtime', 'training', 'onboarding',
];
const workdayLabels = {
  MONDAY: 'Montag',
  TUESDAY: 'Dienstag',
  WEDNESDAY: 'Mittwoch',
  THURSDAY: 'Donnerstag',
  FRIDAY: 'Freitag',
  SATURDAY: 'Samstag',
  SUNDAY: 'Sonntag',
};

/** @param {string[]} items */
function germanList(items) {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} und ${items.at(-1)}`;
}

/** @param {string[]} items */
function germanOrList(items) {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} oder ${items.at(-1)}`;
}

/** @param {string} value */
function sentence(value) {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

/** @param {string} value */
function lowercaseInitial(value) {
  return `${value.charAt(0).toLocaleLowerCase('de-DE')}${value.slice(1)}`;
}

/** @param {string} isoDate */
function germanDate(isoDate) {
  return isoDate.split('-').reverse().join('.');
}

/** @param {import('./job-model.mjs').ActiveJobRecord} job */
function activeConditions(job) {
  const load = 'example_week' in job.treatment_load
    ? job.treatment_load.example_week
    : job.treatment_load;
  const loadPeriod = load.period === 'WEEK' ? 'Woche' : 'Tag';
  const documentationScope = germanList(job.documentation_time.scope);
  const employmentModels = [];
  if (job.employment_types.includes('FULL_TIME')) {
    employmentModels.push(`Vollzeit mit ${hoursFormatter.format(job.weekly_hours.full_time)} Wochenstunden.`);
  }
  if (job.employment_types.includes('PART_TIME')) {
    const partTime = job.weekly_hours.part_time;
    employmentModels.push('negotiable' in partTime
      ? 'Teilzeit mit individuell vereinbartem Stundenumfang.'
      : `Teilzeit mit ${hoursFormatter.format(partTime.min)}–${hoursFormatter.format(partTime.max)} Wochenstunden.`);
  }
  const workdays = job.schedule.workdays;
  const workdayLabel = workdays.length === 5
      && workdays.every((day, index) => day === ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'][index])
    ? 'Montag bis Freitag'
    : germanList(workdays.map((day) => workdayLabels[day]));
  const schedule = job.schedule.regular_times.map(sentence).join(' ');
  const workModel = `${employmentModels.join(' ')} Arbeitstage: ${workdayLabel}. ${schedule} ${job.schedule.four_day_option ? 'Eine Vier-Tage-Woche ist möglich.' : 'Eine Vier-Tage-Woche ist nicht vorgesehen.'}`;
  const contract = job.contract_type === 'PERMANENT'
    ? 'Unbefristet.'
    : `Befristet bis ${germanDate(job.contract_ends_at)}.`;
  const treatmentMinutes = germanOrList(job.treatment_units.map(({ minutes }) => String(minutes)));
  const treatmentConditions = [...new Set(job.treatment_units.map(({ conditions }) => conditions))];
  const treatmentUnits = treatmentConditions.length === 1
    ? `Therapieeinheiten dauern ${treatmentMinutes} Minuten (${treatmentConditions[0]}).`
    : `Therapieeinheiten: ${germanList(job.treatment_units.map(({ minutes, conditions }) => `${minutes} Minuten (${conditions})`))}.`;
  const tariff = job.tariff_status.status === 'NO_TARIFF'
    ? 'Für diese Stelle gilt kein Tarifvertrag.'
    : `Tarifgrundlage: ${job.tariff_status.basis}.`;
  const homeVisits = job.home_visits.status === 'OPTIONAL'
    ? `Hausbesuche sind freiwillig. ${job.home_visits.travel_time} ${job.home_visits.travel_costs}`
    : job.home_visits.status === 'REQUIRED'
      ? `Hausbesuche gehören zur Stelle. ${job.home_visits.travel_time} ${job.home_visits.travel_costs}`
      : 'Hausbesuche sind nicht vorgesehen.';
  const overtime = job.overtime_policy.status === 'NOT_EXPECTED'
    ? `Überstunden sind nicht vorgesehen. Wenn sie ausnahmsweise entstehen: ${job.overtime_policy.compensation}. Der Zeitpunkt ist ${lowercaseInitial(job.overtime_policy.compensation_period)}.`
    : `Überstundenregel: ${job.overtime_policy.compensation}. Ausgleichszeitraum: ${job.overtime_policy.compensation_period}.`;

  return {
    workModel,
    contract,
    treatmentUnits,
    reviewBoundary: `Zuletzt geprüft am ${germanDate(job.last_reviewed_at)}. Nächste Online-Anzeigen-Prüfung am ${germanDate(job.expires_at)}. Wenn die Stelle weiter offen ist, prüfen und verlängern wir die Anzeige. Dieses Datum ist weder ein Vertragsende noch das Ende der Suche.`,
    tariff,
    treatmentLoad: `Bei einer Vollzeitstelle mit ${hoursFormatter.format(job.weekly_hours.full_time)} Wochenstunden sind ${load.min}–${load.max} Therapien pro ${loadPeriod} vorgesehen. ${load.buffer}`,
    documentation: `${documentationScope} sind ${job.documentation_time.paid ? 'bezahlte Arbeitszeit' : 'nicht als bezahlte Arbeitszeit ausgewiesen'}. ${job.documentation_time.planning}`,
    homeVisits,
    overtime,
    training: `${job.continuing_education.costs} ${job.continuing_education.time}. ${job.continuing_education.conditions}`,
    onboarding: `${job.onboarding.components.join('. ')}. ${job.onboarding.appointment_ramp_up}`,
  };
}

const inactivePresentation = {
  DRAFT: {
    statusLabel: 'Entwurf',
    pageDescription: 'Diese Stellenseite wird redaktionell geprüft und ist noch nicht veröffentlicht.',
    statusMessage: 'Diese Stellenseite wird redaktionell geprüft und ist noch nicht zur Bewerbung freigegeben.',
  },
  PAUSED: {
    statusLabel: 'Pausiert',
    pageDescription: 'Diese Stelle ist derzeit pausiert. Bewerbungen sind aktuell nicht möglich.',
    statusMessage: 'Diese Stelle ist derzeit pausiert. Bewerbungen sind aktuell nicht möglich.',
  },
  FILLED: {
    statusLabel: 'Besetzt',
    pageDescription: 'Diese Stelle ist inzwischen besetzt. Bewerbungen sind nicht mehr möglich.',
    statusMessage: 'Diese Stelle ist inzwischen besetzt. Bewerbungen sind nicht mehr möglich.',
  },
  EXPIRED: {
    statusLabel: 'Abgelaufen',
    pageDescription: 'Diese Stellenanzeige ist abgelaufen. Bewerbungen sind aktuell nicht möglich.',
    statusMessage: 'Diese Stellenanzeige ist abgelaufen. Bewerbungen sind aktuell nicht möglich.',
  },
};

/** @param {import('./job-model.mjs').ActiveJobRecord} job */
function activePresentation(job) {
  const monthlySalary = monthlySalaryRange(job);
  const monthlySalaryLabel = `ca. ${roundedCurrencyFormatter.format(Math.round(monthlySalary.min / 10) * 10)}–${roundedCurrencyFormatter.format(Math.round(monthlySalary.max / 10) * 10)} €`;
  const hourlySalaryLabel = `${hoursFormatter.format(job.salary.min)}–${hoursFormatter.format(job.salary.max)} €`;
  const fullTimeHoursLabel = hoursFormatter.format(job.weekly_hours.full_time);
  const salaryAnswer = `${monthlySalaryLabel} brutto im Monat im rechnerischen Jahresmittel bei Vollzeit mit ${fullTimeHoursLabel} Stunden, je nach Erfahrung. Die Grundlage sind ${hourlySalaryLabel} brutto pro Stunde.`;
  const applicationRoutes = job.application_routes.map((route) => applicationRouteLabels[route]);
  const applicationAnswer = `Über ${germanList(applicationRoutes)}. Ein Anschreiben und ein Lebenslauf sind für den Erstkontakt nicht erforderlich.`;
  const faqs = [
    ['Was verdiene ich in der Praxis für Logopädie Şimşek?', salaryAnswer],
    ['Welche Qualifikation brauche ich?', job.required_qualifications.join(' ')],
    ['Wie kann ich Kontakt aufnehmen?', applicationAnswer],
  ];
  const conditions = activeConditions(job);

  return {
    active: {
      monthlySalaryLabel,
      hourlySalaryLabel,
      salaryAnswer,
      fullTimeHoursLabel,
      scheduleHeadline: job.schedule.regular_times.join(' '),
      fourDayOptionLabel: job.schedule.four_day_option ? 'Vier-Tage-Woche möglich' : 'Keine Vier-Tage-Woche',
    },
    canonicalUrl: job.canonical_url,
    pageTitle: `${job.title} in ${job.location.locality} | ${job.employer}`,
    pageDescription: `Logopädie-Job in ${job.location.locality}: ${monthlySalaryLabel} brutto/Monat im rechnerischen Jahresmittel.`,
    statusLabel: 'Aktiv',
    statusMessage: '',
    title: job.title,
    faqs,
    conditions,
    conditionItems: visibleConditionKeys.map((key) => ({
      key,
      label: conditionLabels[key],
      text: conditions[key],
    })),
  };
}

/** @param {Exclude<import('./job-model.mjs').JobRecord, { publication_status: 'ACTIVE' }>} job */
function unpublishedPresentation(job) {
  const copy = inactivePresentation[job.publication_status];
  return {
    active: null,
    canonicalUrl: job.canonical_url,
    pageTitle: `${job.title} – ${copy.statusLabel} | ${job.employer}`,
    pageDescription: copy.pageDescription,
    statusLabel: copy.statusLabel,
    statusMessage: copy.statusMessage,
    title: job.title,
    faqs: [],
    conditions: null,
    conditionItems: [],
  };
}

/** @param {ReturnType<typeof activePresentation>['faqs']} faqs */
function toFaqPage(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
}

const berlinDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Evaluate the application window at request time so a running deployment
 * closes automatically after validThrough without waiting for a rebuild.
 *
 * @param {Pick<import('./job-model.mjs').JobRecord, 'publication_status' | 'expires_at'>} job
 * @param {Date} [now]
 */
export function isApplicationOpen(job, now = new Date()) {
  if (job.publication_status !== 'ACTIVE' || typeof job.expires_at !== 'string') return false;
  return job.expires_at >= berlinDate.format(now);
}

/**
 * @param {import('./job-model.mjs').JobRecord} job
 * @param {{ now?: Date }} [options]
 */
export function publicationArtifacts(job, { now = new Date() } = {}) {
  const published = isApplicationOpen(job, now);
  const presentationJob = !published && job.publication_status === 'ACTIVE'
    ? { ...job, publication_status: 'EXPIRED' }
    : job;
  const presentation = published ? activePresentation(job) : unpublishedPresentation(presentationJob);

  return {
    robots: published ? 'index, follow' : 'noindex, follow',
    includeInSitemap: published,
    jobPosting: published ? toJobPosting(job) : null,
    faqPage: published ? toFaqPage(presentation.faqs) : null,
    showApplication: published,
    presentation,
  };
}
