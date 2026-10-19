// Run with: npm test   (or: node --test scripts/lib/similarity.test.mjs)
import test from 'node:test';
import assert from 'node:assert/strict';
import { shingles, jaccard, comparePages, LIMIT } from './similarity.js';

test('shingles: 5-word runs, case and punctuation ignored', () => {
  const s = shingles('Know where your STOPCOCK is, and your fuse box.');
  assert.ok(s.has('know where your stopcock is'));
  assert.ok(s.has('is and your fuse box'));
  assert.equal(s.size, 5);
  assert.equal(shingles('too short').size, 0);
});

test('jaccard: identical 1, disjoint 0, empty 0', () => {
  const a = shingles('one two three four five six');
  assert.equal(jaccard(a, a), 1);
  assert.equal(jaccard(a, shingles('seven eight nine ten eleven twelve')), 0);
  assert.equal(jaccard(new Set(), new Set()), 0);
});

test('comparePages: a name-swap page fails, a genuinely different page passes', () => {
  const template = 'Your 30-minute plan. Sign up for flood warnings for your postcode. Keep a torch, radio and power bank where you can find them in the dark. Know where your stopcock and electricity switch-off are.';
  const pages = [
    { name: 'alpha', text: `Alpha emergency plan. ${template}` },
    { name: 'beta', text: `Beta emergency plan. ${template}` },
    { name: 'gamma', text: 'Gamma faces coastal surges along the east coast, and the 2019 breach forced 580 homes to evacuate within hours while rest centres opened in nearby towns.' },
  ];
  const pairs = comparePages(pages);
  const score = (a, b) => pairs.find((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a)).score;
  assert.ok(score('alpha', 'beta') > LIMIT);
  assert.ok(score('alpha', 'gamma') < LIMIT);
  assert.equal(pairs[0].a, 'alpha'); // highest first
});
