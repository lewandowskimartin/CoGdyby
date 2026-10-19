// Duplicate-text check across the built local guides (dist/local/<area>/index.html).
//
//   npm run build && npm run check:similarity
//
// Compares the <main> text of every pair of area pages by shared 5-word phrases and fails if
// any pair shares more than 30% (the doorway guardrail in plans/2026-10-14-local-risk-pages.md).
// The /local/ hub itself is left out. Passes quietly when no local pages are built yet.

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { htmlToText } from './lib/sources.js';
import { comparePages, LIMIT } from './lib/similarity.js';

const DIST = fileURLToPath(new URL('../dist/local/', import.meta.url));

if (!existsSync(DIST)) {
  console.log('check:similarity: no dist/local/ yet (run npm run build first, or no local pages exist). Nothing to check.');
  process.exit(0);
}

const pages = [];
for (const entry of await readdir(DIST, { withFileTypes: true })) {
  const file = path.join(DIST, entry.name, 'index.html');
  if (!entry.isDirectory() || !existsSync(file)) continue;
  const html = await readFile(file, 'utf8');
  const main = /<main\b[\s\S]*?<\/main>/i.exec(html)?.[0] ?? html;
  pages.push({ name: entry.name, text: htmlToText(main) });
}

if (pages.length < 2) {
  console.log(`check:similarity: ${pages.length} local page(s) built; need two to compare.`);
  process.exit(0);
}

const pairs = comparePages(pages);
const over = pairs.filter((p) => p.score > LIMIT);
for (const p of pairs) {
  console.log(`${p.score > LIMIT ? '❌' : '✅'} ${(p.score * 100).toFixed(1).padStart(5)}%  ${p.a} ↔ ${p.b}`);
}
console.log(over.length ? `\n${over.length} pair(s) above ${LIMIT * 100}%: rewrite shared sections until they pass.` : `\nAll ${pairs.length} pairs under ${LIMIT * 100}%.`);
process.exit(over.length ? 1 : 0);
