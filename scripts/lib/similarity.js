// Duplicate-text check for the local guides: the doorway guardrail in
// plans/2026-10-14-local-risk-pages.md says no two /local/ pages may share more than 30%
// of their 5-word phrases. Used by scripts/check-similarity.mjs.

import { normalise } from './sources.js';

export const SHINGLE = 5;
export const LIMIT = 0.3;

// Set of every run of `n` consecutive words.
export function shingles(text, n = SHINGLE) {
  const words = normalise(text)
    .replace(/[^\p{L}\p{N}' ]+/gu, ' ')
    .split(' ')
    .filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(' '));
  return out;
}

// Share of phrases the two sets have in common (0 = nothing shared, 1 = identical).
export function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let shared = 0;
  for (const s of a) if (b.has(s)) shared++;
  return shared / (a.size + b.size - shared);
}

// Every pair of pages with its score, highest first. pages: [{ name, text }]
export function comparePages(pages, n = SHINGLE) {
  const sets = pages.map((p) => ({ name: p.name, set: shingles(p.text, n) }));
  const pairs = [];
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      pairs.push({ a: sets[i].name, b: sets[j].name, score: jaccard(sets[i].set, sets[j].set) });
    }
  }
  return pairs.sort((x, y) => y.score - x.score);
}
