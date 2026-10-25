// Pure scoring for the preparedness quiz. No DOM, so it can run in Node tests and the browser.
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

const MAX_POINTS = 2;
const SKIPPED = '-';

// ---------------------------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------------------------

/** An empty profile: what an old link, or a missing ?p=, scores as. Nothing is assumed. */
export const EMPTY_PROFILE = Object.freeze({ home: null, people: null, water: null, who: [], region: null });

const HOME_IDS = PROFILE_STEPS.find((s) => s.id === 'home').options.map((o) => o.id);
const WHO_IDS = PROFILE_STEPS.find((s) => s.id === 'who').options.filter((o) => !o.exclusive).map((o) => o.id);
const PROFILE_RE = new RegExp(`^([${HOME_IDS.join('')}])([1-6])([mw-])([${WHO_IDS.join('')}]*)$`);

/** "f3-kp" → { home:'f', people:3, water:null, who:['k','p'] }. Anything malformed → EMPTY_PROFILE. */
export function parseProfile(p, r = null) {
  const region = REGIONS.some((x) => x.id === r) ? r : null;
  const m = typeof p === 'string' ? PROFILE_RE.exec(p) : null;
  if (!m) return { ...EMPTY_PROFILE, who: [], region };
  const who = WHO_IDS.filter((id) => m[4].includes(id)); // de-duplicated, canonical order
  return { home: m[1], people: Number(m[2]), water: m[3] === SKIPPED ? null : m[3], who, region };
}

/** The inverse of parseProfile, without the region (that travels as its own ?r=). Null when incomplete. */
export function encodeProfile(profile, { drop = [] } = {}) {
  if (!profile || !profile.home || !profile.people) return null;
  const who = WHO_IDS.filter((id) => profile.who?.includes(id) && !drop.includes(id)).join('');
  return `${profile.home}${profile.people}${profile.water ?? SKIPPED}${who}`;
}

/** The flags that question variants and conditional questions are written against. */
export function profileFlags(profile = EMPTY_PROFILE) {
  const who = profile.who ?? [];
  const known = Number.isInteger(profile.people) && profile.people > 0;
  return {
    known,
    alone: profile.people === 1,
    group: known && profile.people > 1,
    flat: profile.home === 'f',
    house: profile.home === 't' || profile.home === 'v',
    village: profile.home === 'v',
    well: profile.water === 'w',
    kids: who.includes('k'),
    senior: who.includes('s'),
    pets: who.includes('p'),
    carer: who.includes('c'),
    noCarer: !who.includes('c'),
    helps: who.includes('s') || who.includes('c'),
  };
}

/** Is this profile step asked, given the answers so far? */
export function profileStepAsked(step, profile = EMPTY_PROFILE) {
  if (!step.askIf) return true;
  const flags = profileFlags(profile);
  return step.askIf.some((f) => flags[f]);
}

/** Is this question asked for this household? Questions without `askIf` are asked of everyone. */
export function isAsked(q, profile = EMPTY_PROFILE) {
  if (!q.askIf) return true;
  const flags = profileFlags(profile);
  return q.askIf.some((f) => flags[f]);
}

// ---------------------------------------------------------------------------------------------
// Copy that depends on the household
// ---------------------------------------------------------------------------------------------

/** Polish plural: 1 litr, 2–4 litry (but 12–14 litrów), 5+ litrów. */
export function plural(n, one, few, many) {
  if (n === 1) return one;
  const t = n % 10;
  const h = n % 100;
  return t >= 2 && t <= 4 && !(h >= 12 && h <= 14) ? few : many;
}

/** The numbers the copy quotes for this household: 3 litres a person a day, for 3 days. */
export function householdNumbers(profile = EMPTY_PROFILE) {
  const n = profile.people;
  if (!Number.isInteger(n) || n < 1) return null;
  const litres = n * 9;
  const packs = n; // one 6 × 1.5 l pack is 9 litres, so one pack per person
  const atLeast = n >= 6 ? 'co najmniej ' : '';
  return {
    water: `${atLeast}${litres} ${plural(litres, 'litr', 'litry', 'litrów')}`,
    packs: `${packs} ${plural(packs, 'zgrzewka', 'zgrzewki', 'zgrzewek')}`,
    you: n === 1 ? 'Ciebie' : 'Was',
  };
}

function fill(text, nums) {
  if (typeof text !== 'string' || !nums) return text;
  return text.replace(/\{(water|packs|you)\}/g, (_, k) => nums[k]);
}

/**
 * The question as this household sees it: matching variants applied in order (later ones win),
 * `extra` sentences appended to the fix, and {water}/{packs}/{you} filled in.
 * Template fields are only ever used inside variants that require a known household size.
 */
export function resolveQuestion(q, profile = EMPTY_PROFILE) {
  const flags = profileFlags(profile);
  const out = { ...q };
  const extras = [];
  for (const v of q.variants ?? []) {
    if (!v.when.every((f) => flags[f])) continue;
    for (const key of ['text', 'hint', 'options', 'gap', 'fix']) if (v[key] !== undefined) out[key] = v[key];
    if (v.extra) extras.push(v.extra);
  }
  if (extras.length) out.fix = [out.fix, ...extras].join(' ');
  const nums = householdNumbers(profile);
  for (const key of ['text', 'hint', 'gap', 'fix']) out[key] = fill(out[key], nums);
  delete out.variants;
  return out;
}

// ---------------------------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------------------------

/**
 * Turn the ?a= code into one entry per question: 0–2 points, or null for a question that was not
 * asked. Current codes have one character per QUESTIONS entry ("0–2" or "-"). Old 10-digit codes
 * (before the profile existed) map onto q1–q10, and everything newer counts as not asked.
 * Returns null for anything else, or when no question at all was answered.
 */
export function parseAnswers(str, questions = QUESTIONS, legacy = LEGACY_ORDER) {
  if (typeof str !== 'string') return null;
  const current = new RegExp(`^[0-${MAX_POINTS}${SKIPPED}]{${questions.length}}$`);
  let out = null;
  if (current.test(str)) {
    out = [...str].map((c) => (c === SKIPPED ? null : Number(c)));
  } else if (legacy && new RegExp(`^[0-${MAX_POINTS}]{${legacy.length}}$`).test(str)) {
    const byId = Object.fromEntries(legacy.map((id, i) => [id, Number(str[i])]));
    out = questions.map((q) => (q.id in byId ? byId[q.id] : null));
  }
  if (!out || out.every((v) => v === null)) return null;
  return out;
}

export function encodeAnswers(answers) {
  return answers.map((v) => (v === null || v === undefined ? SKIPPED : String(v))).join('');
}

// ---------------------------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------------------------

/**
 * @param {(number|null)[]} answers one entry per question; null = not asked
 * @returns {{ total:number, band:object, areaScores:Record<string,number>, areaMax:Record<string,number>,
 *   areaRows:object[], weakest:string|null, manage:object, gaps:object[], plan:Record<string,object[]> }}
 */
export function scoreAnswers(
  answers,
  {
    profile = EMPTY_PROFILE,
    questions = QUESTIONS,
    areas = AREAS,
    bands = BANDS,
    tiers = TIERS,
    standing = STANDING_ACTIONS,
  } = {},
) {
  if (
    !Array.isArray(answers) ||
    answers.length !== questions.length ||
    answers.some((v) => v !== null && (!Number.isInteger(v) || v < 0 || v > MAX_POINTS)) ||
    answers.every((v) => v === null)
  ) {
    throw new Error('Invalid answers');
  }

  const asked = questions
    .map((q, i) => ({ ...resolveQuestion(q, profile), points: answers[i], index: i }))
    .filter((q) => q.points !== null);

  const maxTotal = asked.length * MAX_POINTS;
  const points = asked.reduce((sum, q) => sum + q.points, 0);
  const total = Math.round((points / maxTotal) * 100);

  // Highest band whose minimum the score reaches.
  const band = [...bands].sort((a, b) => b.min - a.min).find((b) => total >= b.min);

  const priority = Object.fromEntries(areas.map((a, i) => [a.id, i]));
  const areaScores = Object.fromEntries(areas.map((a) => [a.id, 0]));
  const areaMax = Object.fromEntries(areas.map((a) => [a.id, 0]));
  for (const q of asked) {
    areaScores[q.area] += q.points;
    areaMax[q.area] += MAX_POINTS;
  }

  // Weakest = lowest share of its maximum; ties go to the earlier area in AREAS. Areas with no
  // asked questions (an old link has none on health or fire) are left out. Null when all are full.
  let weakest = null;
  for (const a of areas) {
    if (!areaMax[a.id]) continue;
    const share = areaScores[a.id] / areaMax[a.id];
    if (share === 1) continue;
    if (weakest === null || share < areaScores[weakest] / areaMax[weakest]) weakest = a.id;
  }

  // Every unfinished answer, hardest-hit first: a flat No (0) before a partial (1), then by
  // area priority, then by question order. The top three are the headline gaps; all of them
  // become the plan.
  const ranked = asked
    .filter((q) => q.points < MAX_POINTS)
    .sort((a, b) => a.points - b.points || priority[a.area] - priority[b.area] || a.index - b.index);

  const gaps = ranked.slice(0, 3);
  const plan = buildPlan(ranked, { tiers, standing });

  return {
    total,
    band,
    areaScores,
    areaMax,
    areaRows: areaStatus(areaScores, areaMax, weakest, { areas }),
    weakest,
    manage: manageBand(answers, { questions }),
    gaps,
    plan,
  };
}

/**
 * How long this household could manage without the shops or the tap, from the food and water
 * answers alone. The weaker of the two decides it.
 * @returns {object} the matching MANAGE_BANDS entry
 */
export function manageBand(
  answers,
  { questions = QUESTIONS, bands = MANAGE_BANDS, ids = MANAGE_QUESTIONS } = {},
) {
  const points = questions
    .map((q, i) => (ids.includes(q.id) ? answers[i] : null))
    .filter((v) => v !== null && v !== undefined);
  const worst = points.length ? Math.min(...points) : 0;
  return [...bands].sort((a, b) => b.min - a.min).find((b) => worst >= b.min);
}

/**
 * One row per area for the bars: score, maximum and a status word. Max comes from the asked
 * questions, so an area nobody was asked about drops out instead of showing an empty bar.
 * @returns {object[]} in AREAS order
 */
export function areaStatus(areaScores, areaMax, weakest, { areas = AREAS, status = AREA_STATUS } = {}) {
  return areas
    .filter((a) => areaMax[a.id] > 0)
    .map((a) => {
      const score = areaScores[a.id];
      const max = areaMax[a.id];
      const share = score / max;
      const low = share < 0.5;
      const isWeakest = a.id === weakest && low;
      return {
        id: a.id,
        label: a.label,
        score,
        max,
        isWeakest,
        status: share === 1 ? status.sorted : isWeakest ? status.start : low ? status.notYet : status.partly,
      };
    });
}

/**
 * Sort the ranked actions into their tiers, then append the standing actions to the last tier.
 * A tier at its cap pushes the overflow down a tier, so "This week" stays a list someone will
 * actually finish rather than a wall of ten things.
 * @returns {Record<string, object[]>} one array per tier id, in tier order
 */
export function buildPlan(ranked, { tiers = TIERS, standing = STANDING_ACTIONS } = {}) {
  const order = tiers.map((t) => t.id);
  const cap = Object.fromEntries(tiers.map((t) => [t.id, t.cap ?? Infinity]));
  const plan = Object.fromEntries(order.map((id) => [id, []]));

  for (const action of ranked) {
    let tier = order.includes(action.tier) ? action.tier : order[order.length - 1];
    while (plan[tier].length >= cap[tier] && order.indexOf(tier) < order.length - 1) {
      tier = order[order.indexOf(tier) + 1];
    }
    plan[tier].push({ ...action, tier });
  }

  const last = order[order.length - 1];
  for (const action of standing) plan[last].push({ ...action, tier: last, standing: true });

  return plan;
}
