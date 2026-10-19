// Run with: node --test src/lib/quizScore.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAnswers, encodeAnswers, scoreAnswers, manageBand, areaStatus } from './quizScore.js';
import { QUESTIONS, AREAS, BANDS, TIERS, STANDING_ACTIONS, AREA_STATUS, MANAGE_AREA, MANAGE_BANDS } from '../data/quiz.js';

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

test('every band carries Ready in 30 copy, and only the lowest band leads with it', () => {
  for (const b of BANDS) {
    assert.ok(b.course, `band ${b.id} has no course copy`);
    assert.equal(typeof b.course.heading, 'string');
    assert.ok(b.course.heading.length > 0, `band ${b.id} course heading is empty`);
    assert.ok(b.course.text.length > 0, `band ${b.id} course text is empty`);
    assert.equal(typeof b.course.lead, 'boolean');
  }
  assert.deepEqual(
    BANDS.filter((b) => b.course.lead).map((b) => b.id),
    ['starting'],
  );
});

test('the band that leads with the course is the one a 0-35 score falls into', () => {
  for (const score of [0, 5, 15, 35]) {
    const answers = fill(0);
    // Two points per question, 10 questions: set the first `score / 5` points by hand.
    for (let i = 0; i < score / 5; i++) answers[i] = 1;
    const r = scoreAnswers(answers);
    assert.equal(r.total, score);
    assert.equal(r.band.id, 'starting');
    assert.equal(r.band.course.lead, true);
  }
  assert.equal(scoreAnswers(fill(1)).total, 50);
  assert.equal(scoreAnswers(fill(1)).band.course.lead, false);
});

// ---- Your plan: the three tiers ----

const TIER_IDS = TIERS.map((t) => t.id);
const LAST_TIER = TIER_IDS[TIER_IDS.length - 1];
const ids = (list) => list.map((a) => a.id);

test('every question carries a tier that exists and an effort label', () => {
  for (const q of QUESTIONS) {
    assert.ok(TIER_IDS.includes(q.tier), `${q.id} has tier "${q.tier}"`);
    assert.ok(typeof q.effort === 'string' && q.effort.length > 0, `${q.id} has no effort`);
    assert.ok(['free', 'shop'].includes(q.cost), `${q.id} has cost "${q.cost}"`);
  }
});

test('the first tier only ever holds free actions, so its label stays true', () => {
  const first = TIERS[0].id;
  assert.match(TIERS[0].note, /za darmo/i);
  for (const q of QUESTIONS.filter((q) => q.tier === first)) {
    assert.equal(q.cost, 'free', `${q.id} is tiered "${first}" but costs money`);
  }
  // And at runtime, for every possible all-or-nothing answer set.
  for (const v of [0, 1]) {
    for (const a of scoreAnswers(fill(v)).plan[first]) {
      assert.equal(a.cost, 'free', `${a.id} reached "${first}" but costs money`);
    }
  }
});

test('all no: the first tier is capped and the overflow drops a tier', () => {
  const plan = scoreAnswers(fill(0)).plan;
  assert.equal(plan.week.length, TIERS[0].cap);
  assert.deepEqual(ids(plan.week), ['q1', 'q2', 'q6']);
  // Six unfinished actions are left over, three of them pushed out of the capped first tier.
  assert.equal(plan.month.length, 6);
  assert.ok(['q8', 'q9', 'q10'].every((id) => ids(plan.month).includes(id)));
  assert.deepEqual(ids(plan.longer), ['q7', ...STANDING_ACTIONS.map((a) => a.id)]);
});

test('all yes: nothing from the quiz, but the standing actions still give a plan', () => {
  const plan = scoreAnswers(fill(2)).plan;
  assert.equal(plan.week.length, 0);
  assert.equal(plan.month.length, 0);
  assert.deepEqual(ids(plan.longer), STANDING_ACTIONS.map((a) => a.id));
  assert.ok(plan.longer.every((a) => a.standing === true));
});

test('the plan holds every unfinished answer exactly once, and nothing finished', () => {
  for (const answers of [fill(0), fill(1), [2, 1, 0, 2, 1, 0, 2, 1, 0, 2], [0, 2, 2, 2, 2, 2, 2, 2, 2, 1]]) {
    const r = scoreAnswers(answers);
    const planned = TIER_IDS.flatMap((id) => r.plan[id]).filter((a) => !a.standing);
    const expected = QUESTIONS.filter((_, i) => answers[i] < 2).map((q) => q.id);
    assert.deepEqual(planned.map((a) => a.id).sort(), expected.sort());
    assert.equal(new Set(planned.map((a) => a.id)).size, planned.length, 'an action appears twice');
  }
});

test('standing actions are appended to the last tier, whatever the score', () => {
  for (const v of [0, 1, 2]) {
    const plan = scoreAnswers(fill(v)).plan;
    const standing = plan[LAST_TIER].filter((a) => a.standing);
    assert.deepEqual(ids(standing), STANDING_ACTIONS.map((a) => a.id));
    assert.deepEqual(ids(plan[LAST_TIER]).slice(-standing.length), ids(standing), 'standing actions come last');
  }
});

test('the top three gaps are the first three ranked actions', () => {
  const r = scoreAnswers([0, 1, 0, 2, 2, 1, 2, 2, 2, 2]);
  assert.equal(r.gaps.length, 3);
  const planned = TIER_IDS.flatMap((id) => r.plan[id]).filter((a) => !a.standing);
  for (const g of r.gaps) assert.ok(planned.some((a) => a.id === g.id), `${g.id} missing from the plan`);
});

// ---- "You'd manage…" ----

const SUPPLY_IDX = QUESTIONS.map((q, i) => (q.area === MANAGE_AREA ? i : null)).filter((i) => i !== null);

test('manage band is the weaker of the two supplies answers, every combination', () => {
  assert.equal(SUPPLY_IDX.length, 2, 'the band assumes exactly two supplies questions');
  for (const food of [0, 1, 2]) {
    for (const water of [0, 1, 2]) {
      const answers = fill(2);
      answers[SUPPLY_IDX[0]] = food;
      answers[SUPPLY_IDX[1]] = water;
      const band = manageBand(answers);
      assert.equal(band.min, Math.min(food, water), `food ${food}, water ${water}`);
      assert.equal(scoreAnswers(answers).manage.id, band.id);
    }
  }
});

test('nothing outside the supplies answers moves the band', () => {
  const base = fill(2);
  const high = manageBand(base);
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (SUPPLY_IDX.includes(i)) continue;
    const answers = fill(2);
    answers[i] = 0;
    assert.equal(manageBand(answers).id, high.id, `${QUESTIONS[i].id} changed the band`);
  }
});

test('only the top band carries a note, and it quotes the Poradnik figure', () => {
  // The Polish government Poradnik bezpieczeństwa does state a figure (supplies for at least
  // 3 days), so the top band may cite it, but only with the source named. The answer bands
  // themselves stay in the visitor's words, with no invented numbers.
  for (const b of MANAGE_BANDS) {
    assert.doesNotMatch(b.text, /\d/, `${b.id} text contains a digit`);
  }
  const noted = MANAGE_BANDS.filter((b) => b.note);
  assert.ok(noted.length === 1, 'only the top band carries a note');
  assert.match(noted[0].note, /Poradnik bezpieczeństwa/);
  assert.match(noted[0].note, /3 dni/);
});

// ---- Where you stand ----

const rowsFor = (answers) => scoreAnswers(answers).areaRows;

test('one row per area, in AREAS order, with the max taken from the questions', () => {
  const rows = rowsFor(fill(1));
  assert.deepEqual(rows.map((r) => r.id), AREAS.map((a) => a.id));
  for (const row of rows) {
    const asked = QUESTIONS.filter((q) => q.area === row.id).length;
    assert.equal(row.max, asked * 2, `${row.id} max`);
  }
});

test('status words: full is Sorted, half or better is Partly there, under half is Not yet', () => {
  assert.ok(rowsFor(fill(2)).every((r) => r.status === AREA_STATUS.sorted));
  assert.ok(rowsFor(fill(1)).every((r) => r.status === AREA_STATUS.partly));
  const low = rowsFor(fill(0));
  assert.ok(low.every((r) => r.status === AREA_STATUS.notYet || r.status === AREA_STATUS.start));
});

test('at most one Start here, and none when everything is full', () => {
  for (const v of [0, 1, 2]) {
    const starts = rowsFor(fill(v)).filter((r) => r.status === AREA_STATUS.start);
    assert.ok(starts.length <= 1, `${starts.length} areas tagged Start here`);
  }
  assert.equal(rowsFor(fill(2)).filter((r) => r.isWeakest).length, 0);
  assert.equal(rowsFor(fill(0)).filter((r) => r.status === AREA_STATUS.start).length, 1);
});

test('the weakest area is not tagged Start here when it is only one point short', () => {
  // Everything full except a single point: that area is the weakest, but "Start here" over
  // "Partly there" would read as a mistake.
  const answers = fill(2);
  answers[0] = 1;
  const rows = rowsFor(answers);
  const weakest = rows.find((r) => r.id === QUESTIONS[0].area);
  assert.equal(weakest.status, AREA_STATUS.partly);
  assert.equal(weakest.isWeakest, false);
  assert.equal(rows.filter((r) => r.status === AREA_STATUS.start).length, 0);
});

test('areaStatus works standalone on supplied scores', () => {
  const scores = { plan: 4, power: 2, supplies: 0, leaving: 1, warnings: 3 };
  const max = { plan: 4, power: 4, supplies: 4, leaving: 4, warnings: 4 };
  const rows = areaStatus(scores, max, 'supplies');
  assert.deepEqual(rows.map((r) => r.status), [
    AREA_STATUS.sorted,
    AREA_STATUS.partly,
    AREA_STATUS.start,
    AREA_STATUS.notYet,
    AREA_STATUS.partly,
  ]);
});
