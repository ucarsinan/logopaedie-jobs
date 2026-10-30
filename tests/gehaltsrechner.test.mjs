import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { transform } from 'esbuild';

// Exercise the actual TypeScript module with the already installed compiler.
const source = await readFile(new URL('../src/lib/gehalt-daten.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'esm', target: 'es2020' });
const { berechneGehalt } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

const input = { stundenlohn: 23, wochenstunden: 38.5, sonderzahlungJahr: 0, arbeitgeberbeitragJahr: 0 };

test('converts hourly pay without a market factor or premature monthly rounding', () => {
  const result = berechneGehalt(input);
  assert.equal(result.bruttoMonat, 3837.17);
  assert.equal(result.bruttoJahr, 46046);
  assert.equal(berechneGehalt({ ...input, stundenlohn: 26 }).bruttoMonat, 4337.67);
});

test('uses the exact contracted hours for part-time, independently of work days', () => {
  assert.equal(berechneGehalt({ ...input, wochenstunden: 30 }).bruttoJahr, 35880);
  assert.equal(berechneGehalt({ ...input, wochenstunden: 32 }).bruttoMonat, 3189.33);
});

test('adds actual gross special payments once and keeps benefits separate', () => {
  const result = berechneGehalt({ ...input, sonderzahlungJahr: 1234.56, arbeitgeberbeitragJahr: 600 });
  assert.equal(result.bruttoJahr, 46046);
  assert.equal(result.bruttoJahrMitSonderzahlung, 47280.56);
  assert.equal(result.arbeitgeberbeitragJahr, 600);
  assert.equal(result.bruttoMonat, 3837.17);
});

test('rejects nonfinite, negative, missing and zero-hour inputs instead of displaying false pay', () => {
  for (const field of ['stundenlohn', 'wochenstunden', 'sonderzahlungJahr', 'arbeitgeberbeitragJahr']) {
    for (const value of [-1, NaN, Infinity, undefined, '23']) {
      assert.throws(() => berechneGehalt({ ...input, [field]: value }), RangeError);
    }
  }
  assert.throws(() => berechneGehalt({ ...input, wochenstunden: 0 }), RangeError);
  assert.throws(() => berechneGehalt({ ...input, stundenlohn: 0 }), RangeError);
});


test('rejects finite annual amounts that overflow during cent rounding', () => {
  assert.throws(() => berechneGehalt({ ...input, stundenlohn: 1e305, wochenstunden: 2 }), RangeError);
});

test('rejects positive inputs whose calculated gross pay underflows to zero', () => {
  assert.throws(() => berechneGehalt({ ...input, stundenlohn: Number.MIN_VALUE, wochenstunden: Number.MIN_VALUE }), RangeError);
});
