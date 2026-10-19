// Run with: npm test   (or: node --test scripts/lib/issues.test.mjs)
import test from 'node:test';
import assert from 'node:assert/strict';
import { planIssues, issueFor } from './issues.js';

const f = (status, title, extra = {}) => ({
  area: 'cumbria',
  file: '/repo/src/content/local/cumbria.yaml',
  path: 'risks[0].source',
  url: 'https://example.org/register.pdf',
  status,
  title,
  detail: 'detail',
  ...extra,
});

test('planIssues: only problems, skips titles already open and repeats in one run', () => {
  const findings = [
    f('ok', 'a'),
    f('manual', 'b'),
    f('quote-missing', 'c'),
    f('quote-missing', 'c'),
    f('updated', 'd'),
    f('unreachable', 'e'),
    f('stale', 's'),
  ];
  const { create, skipped } = planIssues(findings, ['d']);
  assert.deepEqual(create.map((i) => i.title), ['c', 'e', 's']);
  assert.deepEqual(skipped, ['c', 'd']);
});

test('issueFor: labels, repo-relative file path and a next step', () => {
  const i = issueFor(f('unreachable', 'x'));
  assert.deepEqual(i.labels, ['source-watch', 'source-unreachable']);
  assert.match(i.body, /File: `src\/content\/local\/cumbria\.yaml` → `risks\[0\]\.source`/);
  assert.match(i.body, /\*\*Next step:\*\*/);
  assert.deepEqual(issueFor(f('stale', 'y')).labels, ['source-watch', 'source-stale']);
  assert.match(issueFor(f('new-pdf', 'z', { link: 'https://example.org/new.pdf' })).body, /Link: https:\/\/example\.org\/new\.pdf/);
});
