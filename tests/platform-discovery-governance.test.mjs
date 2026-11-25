import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const discoveryDir = new URL('../reports/2026-11-24-platform-discovery-v01/', import.meta.url);

async function readArtifact(name) {
  return readFile(new URL(name, discoveryDir), 'utf8');
}

async function readDiscoveryArtifacts(directory = discoveryDir, prefix = '') {
  const artifacts = new Map();
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) {
      const nested = await readDiscoveryArtifacts(new URL(`${entry.name}/`, directory), name);
      for (const artifact of nested) artifacts.set(...artifact);
    } else if (entry.isFile()) {
      artifacts.set(name, await readFile(url, 'utf8'));
    }
  }
  return artifacts;
}

function markdownTableHeaders(markdown) {
  const lines = markdown.split(/\r?\n/);
  const headers = [];
  for (let index = 0; index < lines.length - 1; index += 1) {
    if (/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(lines[index + 1])) {
      headers.push(...lines[index].split('|').map((value) => value.trim()).filter(Boolean));
    }
  }
  return headers;
}

function forbiddenPersonalDataColumns(columns) {
  const forbiddenParts = ['name', 'email', 'telefon', 'kontakt', 'contact', 'nachricht', 'lebenslauf', 'transkript'];
  return columns.filter((column) => {
    const normalized = column
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    return forbiddenParts.some((part) => normalized.includes(part));
  });
}

function assertArtifactHeadersSafe(artifacts) {
  for (const [name, artifact] of artifacts) {
    if (!name.endsWith('.csv') && !name.endsWith('.md')) {
      throw new Error(`${name} ist kein zulässiges Discovery-Artefakt`);
    }
    const columns = name.endsWith('.csv')
      ? artifact.trim().split(/\r?\n/)[0].split(',').map((column) => column.trim().toLowerCase())
      : markdownTableHeaders(artifact);
    const forbidden = forbiddenPersonalDataColumns(columns);
    assert.deepEqual(forbidden, [], `${name} enthält PII-Spalten: ${forbidden.join(', ')}`);
  }
}

const gateContracts = {
  'Gate B': [/5 qualifizierte Kontakte/i, /nachweisbaren Kanal/i],
  'Gate C': [
    /10 abgeschlossene Arbeitgeberinterviews/i,
    /3 verbindliche Pilotzusagen/i,
    /Pilotstellen bleiben redaktionell verwaltet/i,
  ],
  'Gate D': [/3 tatsächlich bezahlte Pilotanzeigen/i],
  'Gate E': [/30 qualifizierte Kontakte/i, /wiederholter Bedarf/i, /Rechts-/i, /Sicherheits-/i, /Löschkonzept/i],
  'Gate F': [/15 aktive Arbeitgeber/i, /5 Wiederbuchungen/i, /positiver Deckungsbeitrag/i],
};

function gateRowSatisfiesContract(gate, row) {
  return gateContracts[gate].every((requirement) => requirement.test(row));
}

test('discovery artifacts contain every approved gate threshold', async () => {
  const scorecard = await readArtifact('GATE-SCORECARD.md');
  const rows = new Map(
    scorecard
      .split(/\r?\n/)
      .filter((line) => /^\| Gate [B-F] \|/.test(line))
      .map((line) => [line.split('|')[1].trim(), line]),
  );

  for (const [gate, requirements] of Object.entries(gateContracts)) {
    const row = rows.get(gate);
    assert.ok(row, `${gate} fehlt`);
    assert.equal(gateRowSatisfiesContract(gate, row), true, `${gate} ist unvollständig`);

    for (const requirement of requirements) {
      const incompleteRow = row.replace(requirement, '[FEHLENDE BEDINGUNG]');
      assert.equal(
        gateRowSatisfiesContract(gate, incompleteRow),
        false,
        `${gate} darf ohne ${requirement} nicht bestehen`,
      );
    }
  }
});

test('discovery controls expose machine-readable hard cost and weekly time caps', async () => {
  const readme = await readArtifact('README.md');
  assert.match(readme, /^external_cost_cap_eur: 5000$/m);
  assert.match(readme, /^weekly_time_min_hours: 4$/m);
  assert.match(readme, /^weekly_time_max_hours: 6$/m);
});

test('repository artifacts reject personal-data columns', async () => {
  const allowedColumns = new Set([
    'date',
    'workstream',
    'hours',
    'external_cost_eur',
    'approved_budget_reference',
    'notes_without_personal_data',
  ]);
  const requiredFiles = [
    'BUDGET-UND-ZEITLOG.csv',
    'GATE-SCORECARD.md',
    'HYPOTHESENREGISTER.md',
    'README.md',
    'RISIKOREGISTER.md',
  ];
  const artifacts = await readDiscoveryArtifacts();
  const files = [...artifacts.keys()];
  assert.deepEqual(requiredFiles.filter((file) => !files.includes(file)), []);

  const csvFiles = requiredFiles.filter((file) => file.endsWith('.csv'));
  assert.deepEqual(csvFiles, ['BUDGET-UND-ZEITLOG.csv']);

  const budgetColumns = artifacts.get('BUDGET-UND-ZEITLOG.csv')
    .trim().split(/\r?\n/)[0].split(',').map((column) => column.trim().toLowerCase());
  assert.deepEqual(budgetColumns, [...allowedColumns]);
  assertArtifactHeadersSafe(artifacts);

  assert.deepEqual(
    forbiddenPersonalDataColumns(['candidate_email', 'contact_name', 'Telefonnummer', 'e-mail']),
    ['candidate_email', 'contact_name', 'Telefonnummer', 'e-mail'],
  );

  const readme = await readArtifact('README.md');
  assert.match(readme, /Namen, E-Mail-Adressen, Telefonnummern/);
  assert.deepEqual(markdownTableHeaders(readme), []);
});

test('additional discovery artifacts cannot introduce personal-data columns', () => {
  assert.throws(
    () => assertArtifactHeadersSafe(new Map([
      ['README.md', '# Sicher'],
      ['future/UNKNOWN.csv', 'segment,candidate_email,status\nsynthetic,forbidden,ADAPT'],
    ])),
    /candidate_email/,
  );
});
