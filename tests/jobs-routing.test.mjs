import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const destination = '/jobs/logopaedin-sprachtherapeut-duisburg/';

test('current jobs links skip the retired overview in navigation and footer', async () => {
  for (const path of ['src/components/Navigation.astro', 'src/components/Footer.astro']) {
    const source = await read(path);
    assert.ok(source.includes(`href: '${destination}', label: 'Aktuelle Stellen'`));
    assert.doesNotMatch(source, /href: '\/jobs\/'/);
  }
});

test('legacy overview redirects permanently and preserves campaign attribution', async () => {
  const source = await read('src/pages/jobs/index.astro');
  const code = source.split('---')[1].replace('export const prerender = false;', '');
  const execute = new Function('Astro', code);
  for (const query of ['', '?utm_source=meta&utm_content=123&fbclid=synthetic-test']) {
    const response = execute({
      url: new URL(`https://example.test/jobs/${query}`),
      redirect: (location, status) => ({ location, status }),
    });
    assert.equal(response.status, 308);
    assert.equal(response.location, `${destination}${query}`);
  }
  const config = JSON.parse(await read('vercel.json'));
  assert.deepEqual(config.redirects.find(({ source }) => source === '/jobs'), {
    source: '/jobs', destination, permanent: true,
  });
});
