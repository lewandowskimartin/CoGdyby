// Source check for the local guides (/local/<area>/).
//
// Every fact in src/content/local/*.yaml carries the exact words it came from. This script
// fetches each source page (HTML or PDF) and confirms the words are still there. It also runs
// each file's `watch` list: a page that links to the risk register (alerts on a new or removed
// PDF), GOV.UK pages (alerts when "last updated" moves on) and data.gov.uk datasets.
//
//   npm run check:sources                       every area
//   npm run check:sources -- --area cumbria     one area (plus the national file)
//   npm run check:sources -- --verbose          also list what passed
//   npm run check:sources -- --json --out r.json   machine output (used by the weekly workflow)
//   npm run check:sources -- --probe <url> [--find "words"]
//       one URL: status with our headers and with none (shows bot blocking), the text we
//       extract, and whether "words" are in it. Use it to fix a "quote missing" or "unreachable".
//
// Exit code 1 if a quote is missing, a source changed or a page couldn't be reached, so it
// doubles as the publish-day check. "Stale" (checked over 90 days ago) and "check by eye"
// items are listed but don't fail. Plan: plans/2026-10-14-local-pages-automation.md

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { runChecks, formatReport, FAILING_STATUSES, fetchSource, responseText, findQuote, nearby, normalise } from './lib/sources.js';

const DIR = fileURLToPath(new URL('../src/content/local/', import.meta.url));

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};

const json = flag('--json');
const out = value('--out');
const only = value('--area');
const probe = value('--probe');

if (probe) {
  const once = { tries: 1 };
  const ours = await fetchSource(probe, once);
  // Same request with no custom headers: if this one works and ours doesn't, the site is
  // reacting to our user-agent or headers rather than the page being gone.
  const plain = await fetchSource(probe, { ...once, fetchImpl: (url, o) => fetch(url, { redirect: 'follow', signal: o.signal }) });
  const line = (label, r) => `${label}: ${r.ok ? 'OK' : 'FAILED'} · HTTP ${r.status || '-'} · ${r.contentType || '-'}${r.error ? ` · ${r.error}` : ''}`;
  console.log(line('with our headers', ours));
  console.log(line('with no headers  ', plain));
  const res = ours.ok ? ours : plain.ok ? plain : null;
  if (!res) process.exit(1);
  const text = await responseText(probe, res);
  console.log(`\nextracted ${normalise(text).length} characters of text`);
  const find = value('--find');
  if (find) {
    const q = findQuote(text, find);
    console.log(q.ok ? `✅ found: "${find}"` : `❌ not found: "${find}"\n   page says: "${nearby(text, find) ?? '(none of its words appear)'}"`);
  } else {
    console.log(`starts: "${normalise(text).slice(0, 400)}…"`);
  }
  process.exit(0);
}

let findings;
try {
  findings = await runChecks({ dir: DIR, only, log: json ? () => {} : (m) => process.stderr.write(`  ${m}\n`) });
} catch (err) {
  console.error(`check:sources failed: ${err.message}`);
  process.exit(2);
}

if (json) {
  const body = JSON.stringify({ generated: new Date().toISOString(), findings }, null, 2);
  if (out) await writeFile(out, body);
  else process.stdout.write(body + '\n');
} else {
  console.log(formatReport(findings, { verbose: flag('--verbose') }));
}

process.exit(findings.some((f) => FAILING_STATUSES.includes(f.status)) ? 1 : 0);
