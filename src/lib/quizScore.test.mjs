// Run with: node --test src/lib/quizScore.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseAnswers,
  encodeAnswers,
  scoreAnswers,
  manageBand,
  areaStatus,
  parseProfile,
  encodeProfile,
  profileFlags,
  isAsked,
  profileStepAsked,
  resolveQuestion,
  householdNumbers,
  plural,
  EMPTY_PROFILE,
} from './quizScore.js';
import {
  QUESTIONS,
  AREAS,
  BANDS,
  TIERS,
  STANDING_ACTIONS,
  AREA_STATUS,
  MANAGE_QUESTIONS,
  MANAGE_BANDS,
  PROFILE_STEPS,
  REGIONS,
  LEGACY_ORDER,
} from '../data/quiz.js';

const N = QUESTIONS.length;
const idx = (id) => QUESTIONS.findIndex((q) => q.id === id);
// Every question answered with v (as if the household has kids, a senior and pets).
const fill = (v) => Array(N).fill(v);
// Only the questions everyone is asked; conditional ones skipped.
const base = (v) => QUESTIONS.map((q) => (q.askIf ? null : v));
const BASE_COUNT = QUESTIONS.filter((q) => !q.askIf).length;

// ---- Data integrity ----

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
    for (const v of q.variants ?? []) {
      assert.ok(Array.isArray(v.when) && v.when.length, `${q.id} variant without when`);
      if (v.options) assert.equal(v.options.length, 3, `${q.id} variant options`);
    }
  }
  for (const a of AREAS) assert.ok(QUESTIONS.some((q) => q.area === a.id && !q.askIf), `${a.id} has an always-asked question`);
  assert.equal(Math.min(...BANDS.map((b) => b.min)), 0);
});

test('every flag a variant or askIf names actually exists', () => {
  const flags = new Set(Object.keys(profileFlags(EMPTY_PROFILE)));
  for (const q of QUESTIONS) {
    for (const f of q.askIf ?? []) assert.ok(flags.has(f), `${q.id} askIf ${f}`);
    for (const v of q.variants ?? []) for (const f of v.when) assert.ok(flags.has(f), `${q.id} when ${f}`);
  }
  for (const s of PROFILE_STEPS) for (const f of s.askIf ?? []) assert.ok(flags.has(f), `step ${s.id} askIf ${f}`);
});

test('q1–q10 still exist, so old result links keep working', () => {
  for (const id of LEGACY_ORDER) assert.ok(idx(id) >= 0, `${id} missing`);
  for (const id of LEGACY_ORDER) assert.equal(QUESTIONS[idx(id)].askIf, undefined, `${id} became conditional`);
});

test('templates only appear where the household size is known', () => {
  for (const q of QUESTIONS) {
    for (const key of ['text', 'hint', 'gap', 'fix']) {
      assert.doesNotMatch(String(q[key] ?? ''), /\{/, `${q.id}.${key} uses a template without a known household`);
    }
  }
  // And nothing is ever left unfilled, for any household size.
  for (let people = 1; people <= 6; people++) {
    const profile = parseProfile(`f${people}-kspc`);
    for (const q of QUESTIONS) {
      const r = resolveQuestion(q, profile);
      for (const key of ['text', 'hint', 'gap', 'fix']) assert.doesNotMatch(String(r[key] ?? ''), /\{|\}/, `${q.id}.${key}`);
    }
  }
});

test('copy stays gender-neutral (no -łeś/-łaś/-łam/-łem forms)', () => {
  const texts = QUESTIONS.flatMap((q) => [q.text, q.hint, q.gap, q.fix, ...q.options,
    ...(q.variants ?? []).flatMap((v) => [v.text, v.hint, v.gap, v.fix, v.extra, ...(v.options ?? [])])]);
  for (const s of PROFILE_STEPS) texts.push(s.text, s.hint, ...(s.options ?? []).map((o) => o.label));
  for (const t of texts.filter(Boolean)) {
    assert.doesNotMatch(t, /\p{L}+(łeś|łaś|łam|łem)(?!\p{L})/iu, t);
  }
});

// ---- Profile ----

test('parseProfile reads the compact code and rejects anything else', () => {
  assert.deepEqual(parseProfile('f3-kp'), { home: 'f', people: 3, water: null, who: ['k', 'p'], region: null });
  assert.deepEqual(parseProfile('v2wsc', 'pomorskie'), { home: 'v', people: 2, water: 'w', who: ['s', 'c'], region: 'pomorskie' });
  // Letters in any order, duplicates ignored, canonical order back out.
  assert.deepEqual(parseProfile('t4mppk').who, ['k', 'p']);
  for (const bad of ['', 'x3-', 'f0-', 'f7-', 'f3', 'f3-z', null, undefined, ' f3-']) {
    assert.deepEqual(parseProfile(bad), { ...EMPTY_PROFILE, who: [] }, `should reject ${JSON.stringify(bad)}`);
  }
  assert.equal(parseProfile('f3-', 'atlantyda').region, null);
});

test('encodeProfile round-trips, and can drop flags', () => {
  for (const code of ['f1-', 't3m', 'v6wkspc', 'f2-p']) assert.equal(encodeProfile(parseProfile(code)), code);
  assert.equal(encodeProfile(parseProfile('t3mksc'), { drop: ['s', 'c'] }), 't3mk');
  assert.equal(encodeProfile(EMPTY_PROFILE), null);
});

test('the water step is only asked about a house', () => {
  const water = PROFILE_STEPS.find((s) => s.id === 'water');
  assert.equal(profileStepAsked(water, parseProfile('f3-')), false);
  assert.equal(profileStepAsked(water, parseProfile('t3-')), true);
  assert.equal(profileStepAsked(water, parseProfile('v3-')), true);
});

test('conditional questions follow the household', () => {
  const ask = (code) => QUESTIONS.filter((q) => isAsked(q, parseProfile(code))).map((q) => q.id);
  const always = QUESTIONS.filter((q) => !q.askIf).map((q) => q.id);
  assert.deepEqual(ask('f2-'), always);
  assert.ok(ask('f2-k').includes('q22'));
  assert.ok(ask('f2-p').includes('q20'));
  assert.ok(ask('f2-s').includes('q21'));
  assert.ok(ask('f1-c').includes('q21'));
  assert.equal(ask('f4-kspc').length, N);
  // An old link has no profile: nothing conditional is assumed.
  assert.deepEqual(QUESTIONS.filter((q) => isAsked(q, EMPTY_PROFILE)).map((q) => q.id), always);
});

test('every region slug has a local page file', async () => {
  const { readdir } = await import('node:fs/promises');
  const files = new Set((await readdir(new URL('../content/local/', import.meta.url))).map((f) => f.replace(/\.yaml$/, '')));
  assert.equal(REGIONS.length, 16);
  for (const r of REGIONS) assert.ok(files.has(r.id), `${r.id}.yaml missing`);
});

// ---- Personalised copy ----

test('plural follows Polish rules', () => {
  const l = (n) => plural(n, 'litr', 'litry', 'litrów');
  assert.deepEqual([1, 2, 4, 5, 9, 12, 14, 18, 22, 27, 54].map(l),
    ['litr', 'litry', 'litry', 'litrów', 'litrów', 'litrów', 'litrów', 'litrów', 'litry', 'litrów', 'litry']);
});

test('water numbers: 9 litres and one pack per person', () => {
  assert.equal(householdNumbers(EMPTY_PROFILE), null);
  assert.deepEqual(householdNumbers(parseProfile('f1-')), { water: '9 litrów', packs: '1 zgrzewka', you: 'Ciebie' });
  assert.deepEqual(householdNumbers(parseProfile('f3-')), { water: '27 litrów', packs: '3 zgrzewki', you: 'Was' });
  assert.deepEqual(householdNumbers(parseProfile('f6-')), { water: 'co najmniej 54 litry', packs: '6 zgrzewek', you: 'Was' });
});

test('the water question quotes the household’s own number', () => {
  const q4 = QUESTIONS[idx('q4')];
  assert.match(resolveQuestion(q4, parseProfile('t4m')).text, /36 litrów/);
  assert.match(resolveQuestion(q4, parseProfile('t4m')).fix, /Dla Was to 36 litrów, czyli mniej więcej 4 zgrzewki/);
  assert.match(resolveQuestion(q4, parseProfile('f1-')).fix, /Dla Ciebie to 9 litrów/);
  assert.equal(resolveQuestion(q4, EMPTY_PROFILE).text, q4.text);
  assert.match(resolveQuestion(q4, parseProfile('v3w')).fix, /Pompa w studni/);
  assert.doesNotMatch(resolveQuestion(q4, parseProfile('t3m')).fix, /studni/);
});

test('a flat and a house get different advice on valves, heating and shelter', () => {
  const q = (id, code) => resolveQuestion(QUESTIONS[idx(id)], parseProfile(code));
  assert.match(q('q6', 'f2-').fix, /administracja/);
  assert.doesNotMatch(q('q6', 't2m').fix, /administracja/);
  assert.match(q('q6', 't2m').fix, /Pokażcie je wszystkim/);
  assert.doesNotMatch(q('q6', 't1m').fix, /Pokażcie/);
  assert.match(q('q15', 't2m').options[2], /bez prądu/);
  assert.doesNotMatch(q('q15', 'f2-').options[2], /bez prądu/);
  assert.match(q('q15', 't1m').options[2], /^Tak, mam/);
  assert.match(q('q17', 'f2-').fix, /piwnica/);
});

test('someone living alone is addressed as one person', () => {
  const alone = parseProfile('f1-');
  for (const id of ['q1', 'q7', 'q13', 'q14', 'q15']) {
    const r = resolveQuestion(QUESTIONS[idx(id)], alone);
    assert.doesNotMatch(r.text, /\bmacie\b|domownik/i, `${id}: ${r.text}`);
  }
});

test('resolveQuestion leaves the source data untouched', () => {
  const before = JSON.stringify(QUESTIONS);
  resolveQuestion(QUESTIONS[idx('q4')], parseProfile('v3wk'));
  assert.equal(JSON.stringify(QUESTIONS), before);
});

// ---- Answers ----

test('parseAnswers: current codes, skipped questions and old 10-digit links', () => {
  const code = encodeAnswers(base(1));
  assert.equal(code.length, N);
  assert.deepEqual(parseAnswers(code), base(1));
  // Old link: q1–q10 in the old order, everything newer not asked.
  const old = parseAnswers('2102211020');
  assert.equal(old.filter((v) => v !== null).length, 10);
  assert.deepEqual(LEGACY_ORDER.map((id) => old[idx(id)]), [2, 1, 0, 2, 2, 1, 1, 0, 2, 0]);
  for (const bad of ['', '210221102', '21022110201', '210221102a', '-'.repeat(N), '3'.repeat(N), null, undefined, ' 2102211020']) {
    assert.equal(parseAnswers(bad), null, `should reject ${JSON.stringify(bad)}`);
  }
});

test('invalid answers throw', () => {
  assert.throws(() => scoreAnswers([2, 2]));
  assert.throws(() => scoreAnswers(fill(3)));
  assert.throws(() => scoreAnswers(fill(1.5)));
  assert.throws(() => scoreAnswers(fill(null)));
  assert.throws(() => scoreAnswers('2'.repeat(N)));
});

// ---- Scoring ----

test('all no: 0, starting band, three gaps in priority order', () => {
  const r = scoreAnswers(base(0));
  assert.equal(r.total, 0);
  assert.equal(r.band.id, 'starting');
  assert.equal(r.weakest, 'plan');
  assert.deepEqual(r.gaps.map((g) => g.id), ['q1', 'q2', 'q3']);
});

test('all yes: 100, well band, no weakest, no gaps', () => {
  for (const answers of [base(2), fill(2)]) {
    const r = scoreAnswers(answers);
    assert.equal(r.total, 100);
    assert.equal(r.band.id, 'well');
    assert.equal(r.weakest, null);
    assert.equal(r.gaps.length, 0);
  }
});

test('skipped questions change neither the score nor the plan', () => {
  const answers = base(1);
  const withPets = [...answers];
  withPets[idx('q20')] = 1;
  assert.equal(scoreAnswers(answers).total, 50);
  assert.equal(scoreAnswers(withPets).total, 50);
  const planned = (a) => TIERS.flatMap((t) => scoreAnswers(a).plan[t.id]).map((x) => x.id);
  assert.ok(!planned(answers).includes('q20'));
  assert.ok(planned(withPets).includes('q20'));
});

test('the score is the share of points from the questions that were asked', () => {
  const answers = base(0);
  answers[idx('q1')] = 2;
  answers[idx('q2')] = 1;
  assert.equal(scoreAnswers(answers).total, Math.round((3 / (BASE_COUNT * 2)) * 100));
});

test('an old link scores exactly as it did before the profile existed', () => {
  const cases = [
    ['2221000000', 35, 'starting'],
    ['2222000000', 40, 'partly'],
    ['2222222000', 70, 'partly'],
    ['2222222100', 75, 'well'],
  ];
  for (const [code, total, band] of cases) {
    const r = scoreAnswers(parseAnswers(code));
    assert.equal(r.total, total, code);
    assert.equal(r.band.id, band, code);
  }
  // Areas with nothing asked (health, fire) don't show up as empty bars.
  const rows = scoreAnswers(parseAnswers('0000000000')).areaRows.map((r) => r.id);
  assert.ok(!rows.includes('health') && !rows.includes('fire'));
});

test('score is always 0–100 with a band, at most 3 gaps, weakest only when something is missing', () => {
  // A seeded sweep: 3^22 is too many to try, so walk a few thousand mixed answer sets.
  let seed = 7;
  const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  for (let n = 0; n < 3000; n++) {
    const a = QUESTIONS.map((q) => (q.askIf && rand() < 0.5 ? null : Math.floor(rand() * 3)));
    const r = scoreAnswers(a);
    assert.ok(Number.isInteger(r.total) && r.total >= 0 && r.total <= 100);
    assert.ok(r.band);
    assert.ok(r.gaps.length <= 3);
    assert.equal(r.weakest === null, r.gaps.length === 0);
  }
});

test('tie-break: supplies beats power when both are equally weak', () => {
  const answers = base(2);
  for (const q of QUESTIONS) if (q.area === 'supplies' || q.area === 'power') answers[idx(q.id)] = 0;
  const r = scoreAnswers(answers);
  assert.equal(r.weakest, 'supplies');
  assert.deepEqual(r.gaps.map((g) => g.id), ['q3', 'q4', 'q11']);
});

test('lower points rank before area priority', () => {
  const answers = base(2);
  answers[idx('q1')] = 1;
  answers[idx('q10')] = 0;
  const r = scoreAnswers(answers);
  assert.deepEqual(r.gaps.map((g) => g.id), ['q10', 'q1']);
  // Weakest is by share, not by the single worst answer: 1/4 on the plan is below 6/8 on warnings.
  assert.equal(r.weakest, 'plan');
});

test('gaps and plan carry the household’s wording', () => {
  const answers = base(0);
  const r = scoreAnswers(answers, { profile: parseProfile('f4-') });
  const q4 = TIERS.flatMap((t) => r.plan[t.id]).find((a) => a.id === 'q4');
  assert.match(q4.fix, /36 litrów/);
});

test('every band carries Ready in 30 copy, and only the lowest band leads with it', () => {
  for (const b of BANDS) {
    assert.ok(b.course, `band ${b.id} has no course copy`);
    assert.ok(b.course.heading.length > 0 && b.course.text.length > 0, `band ${b.id} course copy`);
    assert.equal(typeof b.course.lead, 'boolean');
  }
  assert.deepEqual(BANDS.filter((b) => b.course.lead).map((b) => b.id), ['starting']);
  assert.equal(scoreAnswers(base(1)).total, 50);
  assert.equal(scoreAnswers(base(1)).band.course.lead, false);
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
  for (const v of [0, 1]) {
    for (const a of scoreAnswers(fill(v)).plan[first]) assert.equal(a.cost, 'free', `${a.id} reached "${first}"`);
  }
});

test('all no: capped tiers push the overflow down', () => {
  const plan = scoreAnswers(fill(0)).plan;
  assert.equal(plan.week.length, TIERS[0].cap);
  assert.deepEqual(ids(plan.week), ['q1', 'q2', 'q22']);
  assert.equal(plan.month.length, TIERS[1].cap);
  const quizActions = TIER_IDS.flatMap((t) => plan[t]).filter((a) => !a.standing);
  assert.equal(quizActions.length, N);
});

test('all yes: nothing from the quiz, but the standing actions still give a plan', () => {
  const plan = scoreAnswers(fill(2)).plan;
  assert.equal(plan.week.length, 0);
  assert.equal(plan.month.length, 0);
  assert.deepEqual(ids(plan.longer), STANDING_ACTIONS.map((a) => a.id));
  assert.ok(plan.longer.every((a) => a.standing === true));
});

test('the plan holds every unfinished asked answer exactly once, and nothing finished', () => {
  const mixed = QUESTIONS.map((_, i) => i % 3);
  for (const answers of [fill(0), fill(1), base(0), mixed]) {
    const r = scoreAnswers(answers);
    const planned = TIER_IDS.flatMap((id) => r.plan[id]).filter((a) => !a.standing);
    const expected = QUESTIONS.filter((_, i) => answers[i] !== null && answers[i] < 2).map((q) => q.id);
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

// ---- "You'd manage…" ----

test('manage band is the weaker of the food and water answers, every combination', () => {
  assert.deepEqual(MANAGE_QUESTIONS, ['q3', 'q4']);
  for (const food of [0, 1, 2]) {
    for (const water of [0, 1, 2]) {
      const answers = fill(2);
      answers[idx('q3')] = food;
      answers[idx('q4')] = water;
      const band = manageBand(answers);
      assert.equal(band.min, Math.min(food, water), `food ${food}, water ${water}`);
      assert.equal(scoreAnswers(answers).manage.id, band.id);
    }
  }
});

test('nothing outside food and water moves the band (cash included)', () => {
  const high = manageBand(fill(2));
  for (let i = 0; i < N; i++) {
    if (MANAGE_QUESTIONS.includes(QUESTIONS[i].id)) continue;
    const answers = fill(2);
    answers[i] = 0;
    assert.equal(manageBand(answers).id, high.id, `${QUESTIONS[i].id} changed the band`);
  }
});

test('only the top band carries a note, and it quotes the Poradnik figure', () => {
  for (const b of MANAGE_BANDS) assert.doesNotMatch(b.text, /\d/, `${b.id} text contains a digit`);
  const noted = MANAGE_BANDS.filter((b) => b.note);
  assert.ok(noted.length === 1, 'only the top band carries a note');
  assert.match(noted[0].note, /Poradnik bezpieczeństwa/);
  assert.match(noted[0].note, /3 dni/);
});

// ---- Where you stand ----

const rowsFor = (answers) => scoreAnswers(answers).areaRows;

test('one row per asked area, in AREAS order, with the max taken from the questions', () => {
  const rows = rowsFor(fill(1));
  assert.deepEqual(rows.map((r) => r.id), AREAS.map((a) => a.id));
  for (const row of rows) {
    assert.equal(row.max, QUESTIONS.filter((q) => q.area === row.id).length * 2, `${row.id} max`);
  }
  const baseRows = rowsFor(base(1));
  for (const row of baseRows) {
    assert.equal(row.max, QUESTIONS.filter((q) => q.area === row.id && !q.askIf).length * 2, `${row.id} base max`);
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
  const answers = fill(2);
  answers[0] = 1;
  const rows = rowsFor(answers);
  const weakest = rows.find((r) => r.id === QUESTIONS[0].area);
  assert.equal(weakest.status, AREA_STATUS.partly);
  assert.equal(weakest.isWeakest, false);
  assert.equal(rows.filter((r) => r.status === AREA_STATUS.start).length, 0);
});

test('areaStatus works standalone on supplied scores, and drops areas with no max', () => {
  const areas = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }, { id: 'd', label: 'D' }];
  const rows = areaStatus({ a: 4, b: 2, c: 0, d: 0 }, { a: 4, b: 4, c: 4, d: 0 }, 'c', { areas });
  assert.deepEqual(rows.map((r) => [r.id, r.status]), [
    ['a', AREA_STATUS.sorted],
    ['b', AREA_STATUS.partly],
    ['c', AREA_STATUS.start],
  ]);
});
