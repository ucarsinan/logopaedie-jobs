import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
test('legacy CMS and OAuth entry points are absent while public content and contact remain', () => {
  for (const path of ['public/admin/index.html', 'public/admin/config.yml', 'api/auth.js', 'api/callback.js']) {
    assert.equal(existsSync(new URL(path, root)), false, path);
  }
  for (const path of ['src/content/ratgeber', 'src/pages/berufshandbuch/[slug].astro', 'src/pages/bewerbung/senden/index.ts']) {
    assert.equal(existsSync(new URL(path, root)), true, path);
  }
  assert.match(readFileSync(new URL('src/content.config.ts', root), 'utf8'), /src\/content\/ratgeber/);
});
