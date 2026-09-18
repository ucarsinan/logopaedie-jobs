import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOTS = ['src', 'public', 'youtube'];
const CURRENT_PROJECT_FILES = ['AGENTS.md', 'PROJECT_CONTEXT.md', 'PROJECT_REALITY.md', 'README.md'];
const TEXT_FILE_PATTERN = /\.(?:astro|md|mjs|ts|txt)$/;
const FULL_NAME = 'Praxis für Logopädie Şimşek';

const walk = async (directory) => {
  const entries = await readdir(new URL(`../${directory}/`, import.meta.url), { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const relativePath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) paths.push(...await walk(relativePath));
    else if (TEXT_FILE_PATTERN.test(entry.name)) paths.push(relativePath);
  }

  return paths;
};

test('public-facing sources always use the full practice name', async () => {
  const paths = [...(await Promise.all(ROOTS.map(walk))).flat(), ...CURRENT_PROJECT_FILES];

  for (const path of paths) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    const withoutFullName = source.replaceAll(FULL_NAME, '');

    assert.doesNotMatch(source, /Praxis\s+Şimşek/iu, `${path} abbreviates the practice name`);
    assert.doesNotMatch(withoutFullName, /Logopädie\s+Şimşek/iu, `${path} omits “Praxis für”`);
    assert.doesNotMatch(source, /(?:Praxis\s+Simsek|Logopaedie\s+Simsek)/iu, `${path} uses an ASCII practice-name variant`);
  }
});
