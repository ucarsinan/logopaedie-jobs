import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';

const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const require = createRequire(import.meta.url);
const { getTransformedRoutes } = require('@vercel/routing-utils');
const { routes, error } = getTransformedRoutes(JSON.parse(await read('../vercel.json')));
assert.equal(error, null);

function expectPermanentRedirect(source, destination) {
  const rule = routes.find(route => route.headers?.Location && new RegExp(route.src).test(source));
  assert.ok(rule, source);
  assert.equal(rule.status, 308, source);
  assert.equal(source.replace(new RegExp(rule.src), rule.headers.Location), destination, source);
}

test('retains the old handbook addresses in one permanent hop', async () => {
  const paths = (await read('../docs/seo/bestand-vor-v8.txt')).split('\n');
  for (const path of paths.filter(path => path.startsWith('/berufshandbuch/'))) {
    const alias = path.replace('/berufshandbuch/', '/ratgeber/');
    expectPermanentRedirect(alias, path);
    expectPermanentRedirect(alias.slice(0, -1), path);
  }
  for (const [alias, slug] of Object.entries({
    gehalt: 'gehalt-logopaedie-nrw',
    '4-tage-woche': '4-tage-woche-logopaedie',
    bilingual: 'bilinguale-sprachtherapie',
  })) {
    for (const prefix of ['/', '/ratgeber/', '/berufshandbuch/']) {
      for (const suffix of ['', '/']) {
        expectPermanentRedirect(prefix + alias + suffix, '/berufshandbuch/' + slug + '/');
      }
    }
  }
});

test('preserves older XML feeds and HTML entry addresses', () => {
  for (const source of ['/sitemap.xml', '/sitemap-jobs.xml']) {
    expectPermanentRedirect(source, '/sitemap-index.xml');
  }
  expectPermanentRedirect('/impressum.html', '/impressum/');
  expectPermanentRedirect('/datenschutz.html', '/datenschutz/');
  expectPermanentRedirect('/index.html', '/');
  expectPermanentRedirect('/gehaltsrechner/index.html', '/gehaltsrechner/');
});
