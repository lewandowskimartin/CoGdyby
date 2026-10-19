// Pure scoring for the preparedness quiz. No DOM, so it can run in Node tests and the browser.
import { QUESTIONS, AREAS, BANDS } from '../data/quiz.js';

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
 * @returns {{ total:number, band:object, areaScores:Record<string,number>, weakest:string|null, gaps:object[] }}
 */
export function scoreAnswers(answers, { questions = QUESTIONS, areas = AREAS, bands = BANDS } = {}) {
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

  const gaps = questions
    .map((q, i) => ({ ...q, points: answers[i], index: i }))
    .filter((q) => q.points < MAX_POINTS)
    .sort((a, b) => a.points - b.points || priority[a.area] - priority[b.area] || a.index - b.index)
    .slice(0, 3);

  return { total, band, areaScores, weakest, gaps };
}
