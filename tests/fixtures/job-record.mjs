export function syntheticJob(publicationStatus = 'ACTIVE') {
  return {
    schema_version: '1.0',
    job_id: 'TEST-01',
    slug: 'synthetische-logopaedie-stelle',
    canonical_url: 'https://xn--logopdiejobs-kcb.de/jobs/synthetische-logopaedie-stelle/',
    employer: 'Praxis für Logopädie Şimşek',
    publication_status: publicationStatus,
    published_at: '2020-01-01',
    last_reviewed_at: '2020-01-02',
    expires_at: '2099-12-31',
    editorial_owner: 'Praxisleitung',
    title: 'Synthetische Logopädie-Stelle',
    location: {
      street_address: 'Beispielstraße 1',
      locality: 'Musterstadt',
      postal_code: '00000',
      region: 'Nordrhein-Westfalen',
      country: 'DE',
    },
    employment_types: ['FULL_TIME', 'PART_TIME'],
    contract_type: 'PERMANENT',
    weekly_hours: { full_time: 38.5, part_time: { min: 16, max: 32 } },
    schedule: {
      workdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      four_day_option: true,
      regular_times: ['08:00 bis 17:00 Uhr'],
    },
    salary: { min: 23, max: 26, currency: 'EUR', unit: 'HOUR' },
    salary_context: 'Einstufung nach Berufserfahrung.',
    tariff_status: { status: 'TARIFF', basis: 'Beispieltarif' },
    role_summary: 'Diagnostik & Therapie im synthetischen Beispiel.',
    responsibilities: ['Sprachdiagnostik durchführen', 'Therapien dokumentieren'],
    treatment_units: [{ minutes: 45, conditions: 'Einzelbehandlung' }],
    treatment_load: { period: 'DAY', min: 4, max: 6, buffer: 'Fünf Minuten je Termin' },
    documentation_time: {
      paid: true,
      planning: 'Eigene Zeitblöcke im Kalender',
      scope: ['Dokumentation', 'Vor- und Nachbereitung', 'Berichte'],
    },
    overtime_policy: {
      status: 'EXCEPTIONAL', compensation: 'Freizeitausgleich', compensation_period: 'Folgemonat',
    },
    home_visits: { status: 'NONE' },
    team_support: ['Feste Ansprechrolle', 'Wöchentliche Fallbesprechung'],
    onboarding: {
      components: ['Hospitation'],
      phases: ['Begleitete Woche', 'Selbstständige Planung'],
      appointment_ramp_up: 'Termine schrittweise bis zur dritten Woche erhöhen',
    },
    continuing_education: {
      time: 'Zwei Tage jährlich',
      costs: '500 Euro jährlich',
      leave: 'Bezahlte Freistellung',
      conditions: 'Vorher abstimmen',
    },
    credential_category: 'professional certificate',
    required_qualifications: ['Staatlich anerkannter Abschluss in Logopädie'],
    recognition_requirement: { status: 'REQUIRED', details: 'Staatliche Anerkennung' },
    experience_requirement: { status: 'NONE', details: 'Berufseinstieg möglich' },
    application_routes: ['SHORT_FORM', 'PHONE'],
    first_step_policy: { account_required: false, cover_letter_required: false, cv_required: false },
    process_steps: ['Erstkontakt', 'Rückmeldung', 'Kennenlernen', 'Nachweise'],
    acknowledgement: { method: 'AUTOMATIC', details: 'Bestätigung nach erfolgreicher Übermittlung' },
    response_window: { amount: 1, unit: 'WORKDAYS' },
    privacy_notice_url: 'https://xn--logopdiejobs-kcb.de/datenschutz/',
  };
}

export function minimalInactiveJob(publicationStatus = 'DRAFT') {
  if (!['DRAFT', 'PAUSED', 'FILLED', 'EXPIRED'].includes(publicationStatus)) {
    throw new TypeError('minimalInactiveJob unterstützt ausschließlich inaktive Statuswerte.');
  }

  return {
    schema_version: '1.0',
    job_id: 'TEST-MINIMAL-01',
    slug: 'logopaedin-sprachtherapeut-duisburg',
    canonical_url: 'https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/',
    employer: 'Praxis für Logopädie Şimşek',
    publication_status: publicationStatus,
    editorial_owner: 'Praxisleitung',
    title: 'Synthetische Logopädie-Stelle',
  };
}
