import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

test('shared contact controller never reads attribution APIs', async () => {
  const source = await readFile(new URL('../src/components/ApplicationContact.astro', import.meta.url), 'utf8');
  const controller = source.match(/<script>\s*import \{ contactFieldError \}[^;]+;([\s\S]*?)<\/script>/)?.[1];
  assert.ok(controller, 'native contact controller found');
  const accesses = [];
  class Input {}
  class Form {}
  class Element {}
  const sourceField = new Input();
  const location = { search: '?utm_source=synthetic-campaign&fbclid=synthetic-click', hostname: 'local.example.test' };
  const document = {
    querySelector: (selector) => selector === '#quelle' ? sourceField : null,
    get referrer() { accesses.push('referrer'); return 'https://external.example.test/'; },
  };
  const window = { location, get sessionStorage() { accesses.push('sessionStorage'); return { getItem: () => '', setItem() {} }; } };
  class Params extends URLSearchParams {
    get(key) { accesses.push(key); return super.get(key); }
  }
  runInNewContext(controller, { document, window, URLSearchParams: Params, URL,
    HTMLInputElement: Input, HTMLFormElement: Form, HTMLElement: Element });
  assert.deepEqual(accesses, ['status']);
  assert.equal(sourceField.value, undefined);
});
