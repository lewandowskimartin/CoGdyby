// Pure scoring for the preparedness quiz. No DOM, so it can run in Node tests and the browser.
import {
  QUESTIONS,
  AREAS,
  BANDS,
  TIERS,
  STANDING_ACTIONS,
  AREA_STATUS,
  MANAGE_AREA,
  MANAGE_BANDS,
} from '../data/quiz.js';

const MAX_POINTS = 2;

/** Turn "2102211020" into [2,1,0,...]. Returns null if the string is not exactly one 0–2 digit per question. */
export function parseAnswers(str, questions = QUESTIONS) {
  if (typeof str !== 'string') return null;
  const pattern = new RegExp(`^[0-${MAX_POINTS}]{${questions.length}}$`);
  if (!pattern.test(str)) return null;
  return [...str].map(Number);
}

export function encodeAnswers(answers) {
  return answers.join('');
}

/**
 * @returns {{ total:number, band:object, areaScores:Record<string,number>, areaMax:Record<string,number>,
 *   areaRows:object[], weakest:string|null, manage:object, gaps:object[], plan:Record<string,object[]> }}
 */
export function scoreAnswers(
  answers,
  { questions = QUESTIONS, areas = AREAS, bands = BANDS, tiers = TIERS, standing = STANDING_ACTIONS } = {},
) {
  if (
    !Array.isArray(answers) ||
    answers.length !== questions.length ||
    answers.some((v) => !Number.isInteger(v) || v < 0 || v > MAX_POINTS)
  ) {
    throw new Error('Invalid answers');
  }

  const maxTotal = questions.length * MAX_POINTS;
  const points = answers.reduce((sum, v) => sum + v, 0);
  const total = Math.round((points / maxTotal) * 100);

  // Highest band whose minimum the score reaches.
  const band = [...bands].sort((a, b) => b.min - a.min).find((b) => total >= b.min);

  const priority = Object.fromEntries(areas.map((a, i) => [a.id, i]));
  const areaScores = Object.fromEntries(areas.map((a) => [a.id, 0]));
  const areaMax = Object.fromEntries(areas.map((a) => [a.id, 0]));
  questions.forEach((q, i) => {
    areaScores[q.area] += answers[i];
    areaMax[q.area] += MAX_POINTS;
  });

  // Weakest = lowest share of its maximum; ties go to the earlier area in AREAS. Null when every area is full.
  let weakest = null;
  for (const a of areas) {
    const share = areaScores[a.id] / areaMax[a.id];
    if (share === 1) continue;
    if (weakest === null || share < areaScores[weakest] / areaMax[weakest]) weakest = a.id;
  }

  // Every unfinished answer, hardest-hit first: a flat No (0) before a partial (1), then by
  // area priority, then by question order. The top three are the headline gaps; all of them
  // become the plan.
  const ranked = questions
    .map((q, i) => ({ ...q, points: answers[i], index: i }))
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
  { questions = QUESTIONS, bands = MANAGE_BANDS, area = MANAGE_AREA } = {},
) {
  const points = questions.map((q, i) => (q.area === area ? answers[i] : null)).filter((v) => v !== null);
  const worst = points.length ? Math.min(...points) : 0;
  return [...bands].sort((a, b) => b.min - a.min).find((b) => worst >= b.min);
}

/**
 * One row per area for the bars: score, maximum and a status word. Max comes from the questions
 * rather than a hardcoded 4, so adding a question to an area doesn't silently break the bars.
 * @returns {object[]} in AREAS order
 */
export function areaStatus(areaScores, areaMax, weakest, { areas = AREAS, status = AREA_STATUS } = {}) {
  return areas.map((a) => {
    const score = areaScores[a.id];
    const max = areaMax[a.id];
    const share = max ? score / max : 0;
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
