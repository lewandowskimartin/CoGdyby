// Shared code for the local-guide source checks (scripts/check-sources.mjs).
// Plan: plans/2026-10-14-local-pages-automation.md
//
// Everything here is plain functions so the tests can run without the network:
// runChecks() takes a fetch function, and the tests pass a fake one.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

export const USER_AGENT =
  'Mozilla/5.0 (compatible; PreparedAtHome-SourceWatch/1.0; +https://preparedathome.co.uk; hello@preparedathome.co.uk)';
export const STALE_DAYS = 90;

// Statuses that need a person to look. 'manual' and 'ok' don't.
export const PROBLEM_STATUSES = ['quote-missing', 'new-pdf', 'pdf-gone', 'updated', 'unreachable', 'stale'];
// Statuses that fail the CLI (publish-day check). 'stale' is a reminder, not a failure.
export const FAILING_STATUSES = ['quote-missing', 'new-pdf', 'pdf-gone', 'updated', 'unreachable'];

const LABELS = {
  ok: 'found',
  manual: 'check by eye',
  'quote-missing': 'quote missing',
  'new-pdf': 'new PDF',
  'pdf-gone': 'PDF no longer linked',
  updated: 'updated',
  unreachable: 'unreachable',
  stale: 'stale',
};
export const statusLabel = (s) => LABELS[s] ?? s;

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

// Make "1,259 homes", "1,259&nbsp;homes" and "1,259\nHomes" compare equal, and curly quotes
// and dashes match straight ones, so formatting changes on a source don't raise false alarms.
export function normalise(text) {
  return String(text)
    .normalize('NFKC')
    .replace(/[­​‌‍﻿]/g, '') // soft hyphen, zero-width chars
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…', pound: '£' };

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function htmlToText(html) {
  return decodeEntities(
    String(html)
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

// True when every phrase in `quote` (a string or a list) is in `text`.
// PDFs often split words with stray spaces ("28 th", "Rev iewed"), so a phrase also counts as
// found when it matches with all spaces removed.
export function findQuote(text, quote) {
  const hay = normalise(text);
  const squashed = hay.replace(/ /g, '');
  const phrases = Array.isArray(quote) ? quote : [quote];
  const missing = phrases.filter((p) => {
    const n = normalise(p);
    return !hay.includes(n) && !squashed.includes(n.replace(/ /g, ''));
  });
  return { ok: missing.length === 0, missing };
}

// When a quote is missing, the text around its most distinctive word, so the report shows what
// the page says now (often enough to fix the quote without opening the source).
export function nearby(text, phrase, width = 70) {
  const hay = normalise(text);
  const words = normalise(phrase)
    .split(' ')
    .filter((w) => w.length >= 3)
    .sort((a, b) => /\d/.test(b) - /\d/.test(a) || b.length - a.length); // numbers first, then longest
  for (const w of words) {
    const i = hay.indexOf(w);
    if (i >= 0) {
      const start = Math.max(0, i - width);
      const end = Math.min(hay.length, i + w.length + width);
      return `${start > 0 ? '…' : ''}${hay.slice(start, end)}${end < hay.length ? '…' : ''}`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

// Comparable form of a URL: no fragment, lower-case host, path percent-decoded once.
export function canonicalUrl(u, base) {
  try {
    const url = new URL(u, base);
    url.hash = '';
    let p = url.pathname;
    try {
      p = decodeURI(p);
    } catch {
      /* leave as is */
    }
    return `${url.protocol}//${url.host.toLowerCase()}${p}${url.search}`;
  } catch {
    return null;
  }
}

// PDF links on a page whose link text or file name contains `match` (case-insensitive).
// With { pdfOnly: false }, any matching link counts (for documents served without .pdf).
export function findPdfLinks(html, baseUrl, match, { pdfOnly = true } = {}) {
  const want = normalise(match);
  const found = new Map();
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  const body = String(html).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ');
  let m;
  while ((m = re.exec(body))) {
    const href = /\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[1]);
    if (!href) continue;
    const raw = decodeEntities(href[2] ?? href[3] ?? href[4] ?? '');
    const abs = canonicalUrl(raw, baseUrl);
    if (!abs || (pdfOnly && !/\.pdf$/i.test(new URL(encodeURI(abs)).pathname))) continue;
    const label = normalise(`${htmlToText(m[2])} ${abs}`);
    if (label.includes(want)) found.set(abs, abs);
  }
  return [...found.values()];
}

// ---------------------------------------------------------------------------
// APIs
// ---------------------------------------------------------------------------

// GOV.UK Content API: https://www.gov.uk/api/content/<path> gives public_updated_at.
export function govukApiUrl(pageUrl) {
  const u = new URL(pageUrl);
  return `https://www.gov.uk/api/content${u.pathname.replace(/\/$/, '')}`;
}

// data.gov.uk (CKAN) API: package_show gives metadata_modified.
export function ckanApiUrl(datasetUrl) {
  const m = /\/dataset\/([^/?#]+)/.exec(new URL(datasetUrl).pathname);
  if (!m) throw new Error(`Not a data.gov.uk dataset URL: ${datasetUrl}`);
  return `https://www.data.gov.uk/api/action/package_show?id=${encodeURIComponent(m[1])}`;
}

export const isoDay = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One URL, politely: up to `tries` attempts with back-off, a clear user-agent, a timeout.
// Never throws: returns { ok, status, contentType, bytes, error }.
export async function fetchSource(url, { fetchImpl = fetch, tries = 3, timeoutMs = 20000, backoffMs = [2000, 5000], wait = sleep } = {}) {
  let last = { ok: false, status: 0, error: 'not fetched' };
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetchImpl(url, {
        headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/pdf,application/json;q=0.9,*/*;q=0.8' },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
      });
      const bytes = new Uint8Array(await res.arrayBuffer());
      last = { ok: res.ok, status: res.status, contentType: res.headers.get('content-type') ?? '', bytes };
      // 4xx (other than 408/429) won't fix itself on a retry.
      if (res.ok || (res.status >= 400 && res.status < 500 && ![408, 429].includes(res.status))) return last;
      last.error = `HTTP ${res.status}`;
    } catch (err) {
      // Node's fetch says only "fetch failed"; the reason (DNS, TLS, refused…) is in err.cause.
      const why = err?.cause?.code ?? err?.cause?.message;
      last = { ok: false, status: 0, error: err?.name === 'TimeoutError' ? 'timed out' : `${err?.message ?? err}${why ? ` (${why})` : ''}` };
    }
    if (i < tries - 1) await wait(backoffMs[Math.min(i, backoffMs.length - 1)]);
  }
  return last;
}

export const looksLikePdf = (url, contentType, bytes) =>
  /pdf/i.test(contentType ?? '') || /\.pdf($|\?)/i.test(url) || (bytes?.[0] === 0x25 && bytes?.[1] === 0x50 && bytes?.[2] === 0x44 && bytes?.[3] === 0x46); // %PDF

export async function pdfToText(bytes) {
  const { extractText, getDocumentProxy } = await import('unpdf');
  const pdf = await getDocumentProxy(new Uint8Array(bytes), { verbosity: 0 }); // no font warnings in the report
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
}

export async function responseText(url, res) {
  if (looksLikePdf(url, res.contentType, res.bytes)) return pdfToText(res.bytes);
  return htmlToText(new TextDecoder().decode(res.bytes));
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Every `source:` object in an area file, with a readable path like "risks[2].source".
export function collectSources(node, trail = '') {
  const out = [];
  if (Array.isArray(node)) {
    node.forEach((v, i) => out.push(...collectSources(v, `${trail}[${i}]`)));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const here = trail ? `${trail}.${k}` : k;
      if (k === 'source' && v && typeof v === 'object' && typeof v.url === 'string') {
        out.push({ path: here, url: v.url, quote: v.quote ?? null, manual: !!v.manual, checked: v.checked ?? null });
      } else if (k !== 'watch') {
        out.push(...collectSources(v, here));
      }
    }
  }
  return out;
}

// Area files from src/content/local: [{ area, file, data }]. `_national.yaml` is area "national".
export async function loadAreas(dir) {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.yaml')).sort();
  const areas = [];
  for (const file of files) {
    const data = yaml.load(await readFile(path.join(dir, file), 'utf8'));
    areas.push({ area: file === '_national.yaml' ? 'national' : file.replace(/\.yaml$/, ''), file: path.join(dir, file), data });
  }
  return areas;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

const shortUrl = (u) => {
  try {
    const x = new URL(u);
    const p = x.pathname.length > 48 ? `${x.pathname.slice(0, 45)}…` : x.pathname;
    return `${x.host.replace(/^www\./, '')}${p === '/' ? '' : p}`;
  } catch {
    return u;
  }
};

// Stable issue title, so the weekly job can tell a new problem from one already reported.
export function fingerprint(f) {
  const what = f.status === 'quote-missing' ? `"${f.missing.join('", "').slice(0, 60)}" · ` : f.status === 'new-pdf' || f.status === 'pdf-gone' ? `${shortUrl(f.link)} · ` : '';
  return `[source] ${f.area} · ${statusLabel(f.status)} · ${what}${shortUrl(f.url)}`;
}

function finding(base) {
  return { ...base, title: fingerprint({ missing: [], ...base }) };
}

// Run every check in every area file. Returns a list of findings (one per fact or watch).
export async function runChecks({ dir, only = null, fetchImpl = fetch, now = new Date(), fetchOptions = {}, log = () => {} }) {
  const areas = (await loadAreas(dir)).filter((a) => !only || a.area === only || a.area === 'national');
  if (only && !areas.some((a) => a.area === only)) throw new Error(`No area file for "${only}" in ${dir}`);

  const cache = new Map();
  const get = (url) => {
    if (!cache.has(url)) {
      log(`fetch ${url}`);
      cache.set(url, fetchSource(url, { fetchImpl, ...fetchOptions }));
    }
    return cache.get(url);
  };
  const texts = new Map();
  const textOf = async (url) => {
    if (!texts.has(url)) {
      texts.set(url, (async () => {
        const res = await get(url);
        if (!res.ok) return { error: res.error ?? `HTTP ${res.status}` };
        try {
          return { text: await responseText(url, res) };
        } catch (err) {
          return { error: `could not read text: ${err.message}` };
        }
      })());
    }
    return texts.get(url);
  };

  const findings = [];
  for (const { area, file, data } of areas) {
    // 1. Quoted facts. An unreachable page is reported once, listing every fact that uses it.
    const unreachable = new Map(); // url -> { paths, error }
    for (const s of collectSources(data)) {
      const base = { area, file, path: s.path, url: s.url, kind: 'fact' };
      if (s.checked && (now - new Date(s.checked)) / 86400000 > STALE_DAYS) {
        findings.push(finding({ ...base, status: 'stale', detail: `last checked ${isoDay(s.checked)}, over ${STALE_DAYS} days ago` }));
      }
      if (s.manual || s.quote == null) {
        findings.push(finding({ ...base, status: 'manual', detail: 'no extractable text; check by eye' }));
        continue;
      }
      const t = await textOf(s.url);
      if (t.error) {
        const u = unreachable.get(s.url) ?? { paths: [], error: t.error };
        u.paths.push(s.path);
        unreachable.set(s.url, u);
        continue;
      }
      const q = findQuote(t.text, s.quote);
      if (q.ok) {
        findings.push(finding({ ...base, status: 'ok', missing: [], detail: 'quote found' }));
      } else {
        const near = nearby(t.text, q.missing[0]);
        const detail = `not on the page: "${q.missing.join('", "')}"${near ? `\n      page says: "${near}"` : ''}`;
        findings.push(finding({ ...base, status: 'quote-missing', missing: q.missing, nearby: near, detail }));
      }
    }
    for (const [url, u] of unreachable) {
      const n = u.paths.length;
      findings.push(finding({ area, file, path: u.paths.join(', '), url, kind: 'fact', status: 'unreachable', detail: `${u.error}${n > 1 ? ` (${n} facts use this page)` : ''}` }));
    }

    // 2. Watches
    for (const [i, w] of (data.watch ?? []).entries()) {
      const base = { area, file, path: `watch[${i}]`, url: w.url, kind: `watch:${w.kind}` };
      if (w.kind === 'links') {
        const res = await get(w.url);
        if (!res.ok) {
          findings.push(finding({ ...base, status: 'unreachable', detail: res.error ?? `HTTP ${res.status}` }));
          continue;
        }
        const live = findPdfLinks(new TextDecoder().decode(res.bytes), w.url, w.match, { pdfOnly: w.pdf !== false });
        const known = (w.known ?? []).map((k) => canonicalUrl(k));
        const added = live.filter((l) => !known.includes(l));
        const gone = known.filter((k) => !live.includes(k));
        for (const link of added) findings.push(finding({ ...base, status: 'new-pdf', link, detail: `new ${w.pdf === false ? 'link' : 'PDF'} matching "${w.match}": ${link}` }));
        for (const link of gone) findings.push(finding({ ...base, status: 'pdf-gone', link, detail: `known PDF no longer linked: ${link}` }));
        if (!added.length && !gone.length) findings.push(finding({ ...base, status: 'ok', detail: `${live.length} matching PDF link(s), as expected` }));
      } else if (w.kind === 'govuk' || w.kind === 'ckan') {
        const api = w.kind === 'govuk' ? govukApiUrl(w.url) : ckanApiUrl(w.url);
        const res = await get(api);
        let date = null;
        if (res.ok) {
          try {
            const json = JSON.parse(new TextDecoder().decode(res.bytes));
            date = w.kind === 'govuk' ? json.public_updated_at : json.result?.metadata_modified;
          } catch {
            /* handled below */
          }
        }
        if (!date) {
          findings.push(finding({ ...base, status: 'unreachable', detail: res.ok ? 'no date in API response' : res.error ?? `HTTP ${res.status}` }));
          continue;
        }
        const since = isoDay(w.since);
        const updated = isoDay(date) > since;
        findings.push(finding({ ...base, status: updated ? 'updated' : 'ok', detail: updated ? `updated ${isoDay(date)} (we last reviewed ${since})` : `last updated ${isoDay(date)}` }));
      } else {
        findings.push(finding({ ...base, status: 'unreachable', detail: `unknown watch kind "${w.kind}"` }));
      }
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const ICONS = { ok: '✅', manual: '👁 ', 'quote-missing': '❌', 'new-pdf': '🆕', 'pdf-gone': '🆕', updated: '🆕', unreachable: '⚠️ ', stale: '🕰 ' };

export function formatReport(findings, { verbose = false } = {}) {
  const lines = [];
  const byArea = Map.groupBy ? Map.groupBy(findings, (f) => f.area) : findings.reduce((m, f) => m.set(f.area, [...(m.get(f.area) ?? []), f]), new Map());
  for (const [area, list] of byArea) {
    const shown = verbose ? list : list.filter((f) => f.status !== 'ok');
    const okCount = list.filter((f) => f.status === 'ok').length;
    lines.push(`\n${area} (${okCount}/${list.length} ok)`);
    for (const f of shown) lines.push(`  ${ICONS[f.status] ?? '?'} ${f.path}: ${f.detail}\n      ${f.url}`);
  }
  const count = (s) => findings.filter((f) => f.status === s).length;
  lines.push(
    `\n${count('ok')} ok · ${count('quote-missing')} quote missing · ${count('new-pdf') + count('pdf-gone') + count('updated')} changed · ${count('unreachable')} unreachable · ${count('stale')} stale · ${count('manual')} check by eye`
  );
  return lines.join('\n');
}
