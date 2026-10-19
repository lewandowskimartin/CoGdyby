// Opens a GitHub issue for each problem in a check:sources JSON report.
// Run by .github/workflows/watch-sources.yml after `npm run check:sources -- --json --out report.json`.
//
//   node scripts/watch-issues.mjs report.json          needs GITHUB_TOKEN and GITHUB_REPOSITORY
//   node scripts/watch-issues.mjs report.json --dry    print what would be opened, touch nothing
//
// An issue whose title is already open is skipped (see scripts/lib/issues.js).

import { readFile } from 'node:fs/promises';
import { planIssues, LABELS, BASE_LABEL } from './lib/issues.js';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const DRY = args.includes('--dry');
if (!file) {
  console.error('Usage: node scripts/watch-issues.mjs <report.json> [--dry]');
  process.exit(2);
}

const { findings } = JSON.parse(await readFile(file, 'utf8'));
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;

async function gh(method, path, body) {
  const res = await fetch(`${process.env.GITHUB_API_URL ?? 'https://api.github.com'}/repos/${repo}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && !(method === 'POST' && path === '/labels' && res.status === 422)) {
    throw new Error(`GitHub ${method} ${path}: HTTP ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function openTitles() {
  const titles = [];
  for (let page = 1; page < 20; page++) {
    const batch = await gh('GET', `/issues?state=open&labels=${BASE_LABEL}&per_page=100&page=${page}`);
    titles.push(...batch.map((i) => i.title));
    if (batch.length < 100) break;
  }
  return titles;
}

if (DRY) {
  const { create } = planIssues(findings, []);
  for (const i of create) console.log(`would open: ${i.title}  [${i.labels.join(', ')}]`);
  console.log(`${create.length} issue(s) would be opened (dry run; open issues not checked).`);
  process.exit(0);
}

if (!repo || !token) {
  console.error('GITHUB_REPOSITORY and GITHUB_TOKEN must be set (or use --dry).');
  process.exit(2);
}

const { create, skipped } = planIssues(findings, await openTitles());
if (create.length) {
  for (const [name, l] of Object.entries(LABELS)) await gh('POST', '/labels', { name, ...l });
}
for (const issue of create) {
  const made = await gh('POST', '/issues', issue);
  console.log(`opened #${made.number}: ${issue.title}`);
}
for (const t of skipped) console.log(`already open: ${t}`);
console.log(`${create.length} opened, ${skipped.length} already open.`);
