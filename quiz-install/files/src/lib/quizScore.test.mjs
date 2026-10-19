// Run with: node --test src/lib/quizScore.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAnswers, encodeAnswers, scoreAnswers } from './quizScore.js';
import { QUESTIONS, AREAS, BANDS } from '../data/quiz.js';

const fill = (v) => Array(QUESTIONS.length).fill(v);

test('all no: 0, starting band, three gaps in priority order', () => {
  const r = scoreAnswers(fill(0));
  assert.equal(r.total, 0);
  assert.equal(r.band.id, 'starting');
  assert.equal(r.weakest, 'plan');
  assert.deepEqual(r.gaps.map((g) => g.id), ['q1', 'q2', 'q5']);
});

test('all yes: 100, well band, no weakest, no gaps', () => {
  const r = scoreAnswers(fill(2));
  assert.equal(r.total, 100);
  assert.equal(r.band.id, 'well');
  assert.equal(r.weakest, null);
  assert.equal(r.gaps.length, 0);
});

test('band edges at 35/40 and 70/75', () => {
  const cases = [
    [[2, 2, 2, 1, 0, 0, 0, 0, 0, 0], 35, 'starting'],
    [[2, 2, 2, 2, 0, 0, 0, 0, 0, 0], 40, 'partly'],
    [[2, 2, 2, 2, 2, 2, 2, 0, 0, 0], 70, 'partly'],
    [[2, 2, 2, 2, 2, 2, 2, 1, 0, 0], 75, 'well'],
  ];
  for (const [a, total, band] of cases) {
    const r = scoreAnswers(a);
    assert.equal(r.total, total);
    assert.equal(r.band.id, band);
  }
});

test('score is always a multiple of 5 and bands cover 0–100 (exhaustive)', () => {
  const n = QUESTIONS.length;
  for (let m = 0; m < 3 ** n; m++) {
    let x = m;
    const a = [];
    for (let i = 0; i < n; i++) { a.push(x % 3); x = Math.floor(x / 3); }
    const r = scoreAnswers(a);
    assert.ok(r.total % 5 === 0 && r.total >= 0 && r.total <= 100);
    assert.ok(r.band);
    assert.ok(r.gaps.length <= 3);
    assert.equal(r.weakest === null, r.gaps.length === 0);
  }
});

test('tie-break: power beats supplies when both are equally weak', () => {
  // plan full, supplies 0/4, power 0/4, rest full
  const r = scoreAnswers([2, 2, 0, 0, 0, 0, 2, 2, 2, 2]);
  assert.equal(r.weakest, 'power');
  assert.deepEqual(r.gaps.map((g) => g.id), ['q5', 'q6', 'q3']);
});

test('lower points rank before area priority', () => {
  const r = scoreAnswers([1, 2, 2, 2, 2, 2, 2, 2, 2, 0]);
  assert.deepEqual(r.gaps.map((g) => g.id), ['q10', 'q1']);
  assert.equal(r.weakest, 'warnings');
});

test('invalid answers throw', () => {
  assert.throws(() => scoreAnswers([2, 2]));
  assert.throws(() => scoreAnswers(fill(3)));
  assert.throws(() => scoreAnswers(fill(1.5)));
  assert.throws(() => scoreAnswers('2222222222'));
});

test('parseAnswers accepts only 10 digits 0–2', () => {
  assert.deepEqual(parseAnswers('2102211020'), [2, 1, 0, 2, 2, 1, 1, 0, 2, 0]);
  for (const bad of ['', '210221102', '21022110201', '210221102a', '2102211023', null, undefined, ' 2102211020']) {
    assert.equal(parseAnswers(bad), null, `should reject ${JSON.stringify(bad)}`);
  }
  assert.equal(encodeAnswers([2, 1, 0, 2, 2, 1, 1, 0, 2, 0]), '2102211020');
});

test('data integrity: every question is complete and maps to a real area', () => {
  const areaIds = new Set(AREAS.map((a) => a.id));
  const ids = new Set();
  for (const q of QUESTIONS) {
    assert.ok(!ids.has(q.id), `duplicate ${q.id}`);
    ids.add(q.id);
    assert.ok(areaIds.has(q.area), `${q.id} area`);
    assert.equal(q.options.length, 3, `${q.id} options`);
    assert.ok(q.text && q.gap && q.fix, `${q.id} copy`);
    assert.ok(q.packPage === null || typeof q.packPage === 'string');
  }
  for (const a of AREAS) assert.ok(QUESTIONS.some((q) => q.area === a.id), `${a.id} has questions`);
  assert.equal(Math.min(...BANDS.map((b) => b.min)), 0);
});
