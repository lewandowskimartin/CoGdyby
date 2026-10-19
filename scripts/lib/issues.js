// Turns check:sources findings into GitHub issues (used by scripts/watch-issues.mjs).
// One issue per finding, titled with its fingerprint. If an issue with that title is already
// open it is left alone: no duplicate, and no weekly "still broken" noise.

import { PROBLEM_STATUSES, statusLabel } from './sources.js';

export const BASE_LABEL = 'source-watch';
export const LABELS = {
  [BASE_LABEL]: { color: 'CF5F33', description: 'A local guide source changed or needs checking' },
  'source-unreachable': { color: 'BFB8AA', description: 'Source page could not be fetched (may be temporary)' },
  'source-stale': { color: 'E8C468', description: 'Fact not re-checked for over 90 days' },
};

const NEXT_STEP = {
  'quote-missing':
    'Open the source and find the fact. If it changed, update the YAML (value, quote and `checked`). If the page moved, update the URL. If it was only reworded, update the quote.',
  'new-pdf':
    'A new PDF matching this watch is linked. If it is a new register edition, read it, update the risks and `register` in the YAML, then add the PDF to `known`.',
  'pdf-gone':
    'A PDF we rely on is no longer linked from this page. Find where it went (new edition or new location), update the YAML, and update `known`.',
  updated:
    'This page or dataset has been updated since we last reviewed it. Check what changed, update the YAML if needed, then move `since` to the new date.',
  unreachable:
    'The page could not be fetched. Often temporary (maintenance, bot checks). Open it in a browser: if it is gone, find the new location and update the YAML.',
  stale:
    'This fact has not been re-checked for over 90 days. Open the source, confirm it, and update `checked` (the quote check only proves the words are still there).',
};

export function issueFor(f) {
  const labels = [BASE_LABEL];
  if (f.status === 'unreachable') labels.push('source-unreachable');
  if (f.status === 'stale') labels.push('source-stale');
  const body = [
    `**${statusLabel(f.status)}**: ${f.detail}`,
    '',
    `- Area: \`${f.area}\``,
    `- File: \`${f.file?.replace(/^.*?(src\/content\/local\/)/, '$1') ?? '?'}\` → \`${f.path}\``,
    `- Source: ${f.url}`,
    f.link ? `- Link: ${f.link}` : null,
    '',
    `**Next step:** ${NEXT_STEP[f.status] ?? 'Check the source.'}`,
    '',
    'Close this issue once the YAML is updated (or if nothing needed to change). Re-run `npm run check:sources` locally to confirm.',
    '',
    '_Opened by the weekly "Watch sources" workflow._',
  ]
    .filter((l) => l !== null)
    .join('\n');
  return { title: f.title, body, labels };
}

// Which findings need a new issue, given the titles of issues already open.
export function planIssues(findings, openTitles) {
  const open = new Set(openTitles);
  const seen = new Set();
  const create = [];
  const skipped = [];
  for (const f of findings) {
    if (!PROBLEM_STATUSES.includes(f.status)) continue;
    if (open.has(f.title) || seen.has(f.title)) {
      skipped.push(f.title);
      continue;
    }
    seen.add(f.title);
    create.push(issueFor(f));
  }
  return { create, skipped };
}
