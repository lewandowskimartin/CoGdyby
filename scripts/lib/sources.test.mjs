// Run with: npm test   (or: node --test scripts/lib/sources.test.mjs)
// No network: every fetch goes to a fake that serves fixtures.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  normalise,
  htmlToText,
  findQuote,
  nearby,
  findPdfLinks,
  canonicalUrl,
  govukApiUrl,
  ckanApiUrl,
  collectSources,
  fetchSource,
  pdfToText,
  runChecks,
  fingerprint,
  formatReport,
} from './sources.js';

const FIXTURE = await readFile(new URL('../fixtures/lrf-hazards.html', import.meta.url), 'utf8');

// A one-page PDF with the given line of text, built by hand (offsets computed so it's valid).
function makePdf(line) {
  const content = `BT /F1 14 Tf 20 100 Td (${line}) Tj ET`;
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let out = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(out);
}

// Fake fetch: routes maps URL → { body, type, status } | Error | (() => …). Counts calls.
function fakeFetch(routes) {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    let r = routes[url];
    if (typeof r === 'function') r = r(calls.filter((c) => c === url).length);
    if (r === undefined) return new Response('not found', { status: 404 });
    if (r instanceof Error) throw r;
    return new Response(r.body, { status: r.status ?? 200, headers: { 'content-type': r.type ?? 'text/html; charset=utf-8' } });
  };
  impl.calls = calls;
  return impl;
}

const noWait = { wait: async () => {}, backoffMs: [0] };

// --- text -------------------------------------------------------------------

test('normalise: spacing, case, curly quotes and dashes compare equal', () => {
  assert.equal(normalise('1,259 Homes  and\nbusinesses'), '1,259 homes and businesses');
  assert.equal(normalise('“Very High” – Storm’s'), '"very high" - storm\'s');
  assert.equal(normalise('soft­hyphen'), 'softhyphen');
});

test('htmlToText: drops scripts, styles and comments; decodes entities', () => {
  const t = normalise(htmlToText(FIXTURE));
  assert.ok(t.includes('floodline: 0345 988 1188 – open 24 hours'.replace('–', '-')));
  assert.ok(!t.includes('datalayer'));
  assert.ok(!t.includes('content:'));
  assert.ok(!t.includes('draft'));
});

test('findQuote: string and list; reports what is missing', () => {
  const text = htmlToText(FIXTURE);
  assert.deepEqual(findQuote(text, '0345 988 1188'), { ok: true, missing: [] });
  assert.deepEqual(findQuote(text, ['Hazards and threats', '0345 988 1188']), { ok: true, missing: [] });
  assert.deepEqual(findQuote(text, ['Hazards and threats', '0800 000 0000']), { ok: false, missing: ['0800 000 0000'] });
});

test('findQuote: survives words split by PDF extraction ("28 th", "Rev iewed")', () => {
  assert.equal(findQuote('Cumbria CRR Rev iewed 28 th September 2026 Page 1', 'Reviewed 28th September 2026').ok, true);
  assert.equal(findQuote('Reviewed 27th September 2026', 'Reviewed 28th September 2026').ok, false);
});

test('nearby: shows the page text around the most distinctive word, numbers first', () => {
  const text = 'Intro text. This register was reviewed 28th October 2026 by the forum. More text follows here.';
  assert.match(nearby(text, 'Reviewed 28th September 2026', 20), /reviewed 28th october 2026/);
  assert.equal(nearby('nothing relevant at all', 'Reviewed 28th September 2026'), null);
});

// --- links ------------------------------------------------------------------

test('canonicalUrl: encoded and decoded forms match; fragment and host case ignored', () => {
  assert.equal(
    canonicalUrl('https://Example.org/a%20b%20%282%29.pdf#page=3'),
    canonicalUrl('https://example.org/a b (2).pdf')
  );
  assert.equal(canonicalUrl('/x.pdf', 'https://example.org/dir/page'), 'https://example.org/x.pdf');
  assert.equal(canonicalUrl('http://[bad'), null);
});

test('findPdfLinks: only PDFs whose text or file name matches, resolved and de-duplicated', () => {
  const links = findPdfLinks(FIXTURE, 'https://lrf.example.org/hazards', 'risk register');
  assert.deepEqual(links.sort(), [
    'https://council.example.gov.uk/files/2024/crr.pdf',
    'https://lrf.example.org/sites/default/files/2026-10/Community Risk Register Public Version (2).pdf',
  ]);
  assert.deepEqual(findPdfLinks(FIXTURE, 'https://lrf.example.org/hazards', 'booklet'), ['https://example.org/files/Risk Assessment Booklet.pdf']);
  assert.deepEqual(findPdfLinks(FIXTURE, 'https://lrf.example.org/hazards', 'nothing like this'), []);
  // pdfOnly: false also finds documents served without .pdf (and plain pages whose text matches).
  const any = findPdfLinks('<a href="/media/109576/download">London Risk Register</a> <a href="/x.pdf">Other</a>', 'https://gla.example/page', 'london risk register', { pdfOnly: false });
  assert.deepEqual(any, ['https://gla.example/media/109576/download']);
});

// --- APIs -------------------------------------------------------------------

test('API URLs for GOV.UK and data.gov.uk', () => {
  assert.equal(
    govukApiUrl('https://www.gov.uk/guidance/local-resilience-forums-contact-details'),
    'https://www.gov.uk/api/content/guidance/local-resilience-forums-contact-details'
  );
  assert.equal(
    ckanApiUrl('https://www.data.gov.uk/dataset/5a98b0a1-2741-4b2f-a51b-5b42f13219f2/some-slug'),
    'https://www.data.gov.uk/api/action/package_show?id=5a98b0a1-2741-4b2f-a51b-5b42f13219f2'
  );
  assert.throws(() => ckanApiUrl('https://www.data.gov.uk/search'));
});

// --- data -------------------------------------------------------------------

test('collectSources: finds every source with a readable path, skips watch', () => {
  const data = {
    lrf: { source: { url: 'https://a.example/', quote: 'x y z', checked: new Date('2026-10-14') } },
    risks: [{ source: { url: 'https://b.example/', quote: ['one', 'two'] } }, { source: { url: 'https://c.example/', quote: null, manual: true } }],
    watch: [{ kind: 'links', url: 'https://d.example/', source: { url: 'https://nope.example/' } }],
  };
  const s = collectSources(data);
  assert.deepEqual(s.map((x) => x.path), ['lrf.source', 'risks[0].source', 'risks[1].source']);
  assert.equal(s[2].manual, true);
});

// --- fetching ---------------------------------------------------------------

test('fetchSource: retries a 503, then succeeds', async () => {
  const f = fakeFetch({ 'https://x.example/': (n) => (n < 2 ? { body: 'busy', status: 503 } : { body: 'ok' }) });
  const r = await fetchSource('https://x.example/', { fetchImpl: f, ...noWait });
  assert.equal(r.ok, true);
  assert.equal(f.calls.length, 2);
});

test('fetchSource: no retry on 404; network errors never throw', async () => {
  const f = fakeFetch({ 'https://boom.example/': new Error('ECONNRESET') });
  const r404 = await fetchSource('https://gone.example/', { fetchImpl: f, ...noWait });
  assert.equal(r404.ok, false);
  assert.equal(r404.status, 404);
  assert.equal(f.calls.filter((c) => c === 'https://gone.example/').length, 1);
  const rErr = await fetchSource('https://boom.example/', { fetchImpl: f, ...noWait });
  assert.equal(rErr.ok, false);
  assert.match(rErr.error, /ECONNRESET/);
  assert.equal(f.calls.filter((c) => c === 'https://boom.example/').length, 3);
});

test('pdfToText: reads text from a PDF', async () => {
  const text = await pdfToText(makePdf('Reviewed 28th September 2026'));
  assert.ok(findQuote(text, 'Reviewed 28th September 2026').ok, text);
});

// --- end to end (fake network) ----------------------------------------------

const REGISTER = 'https://lrf.example.org/sites/default/files/2026-10/Community%20Risk%20Register%20Public%20Version%20%282%29.pdf';

async function withArea(yamlText, fn) {
  const dir = await mkdtemp(path.join(tmpdir(), 'pah-sources-'));
  try {
    await writeFile(path.join(dir, 'testshire.yaml'), yamlText);
    await writeFile(
      path.join(dir, '_national.yaml'),
      `contacts:\n  - id: floodline\n    label: Floodline\n    number: 0345 988 1188\n    source: { url: 'https://lrf.example.org/hazards', quote: '0345 988 1188', checked: 2026-10-14 }\n`
    );
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const AREA = `
name: Testshire
register:
  source: { url: '${REGISTER}', quote: Reviewed 28th September 2026, checked: 2026-10-14 }
risks:
  - name: River flooding
    source: { url: '${REGISTER}', quote: [Reviewed 28th, Fluvial flooding], checked: 2026-10-14 }
  - name: Matrix
    source: { url: 'https://lrf.example.org/matrix.pdf', quote: null, manual: true, checked: 2026-10-14 }
pastEvents:
  - name: Old fact
    source: { url: 'https://down.example/', quote: anything, checked: 2026-01-01 }
watch:
  - kind: links
    url: https://lrf.example.org/hazards
    match: risk register
    known:
      - ${REGISTER}
      - https://lrf.example.org/old-register.pdf
  - kind: govuk
    url: https://www.gov.uk/guidance/local-resilience-forums-contact-details
    since: 2026-02-11
  - kind: ckan
    url: https://www.data.gov.uk/dataset/abc-123/flood
    since: 2026-07-31
`;

test('runChecks: each kind of finding, against a fake network', async () => {
  const f = fakeFetch({
    [REGISTER]: { body: makePdf('Reviewed 28th September 2026'), type: 'application/pdf' },
    'https://lrf.example.org/hazards': { body: FIXTURE },
    'https://down.example/': { body: 'busy', status: 503 },
    'https://www.gov.uk/api/content/guidance/local-resilience-forums-contact-details': { body: JSON.stringify({ public_updated_at: '2026-02-11T09:00:00Z' }), type: 'application/json' },
    'https://www.data.gov.uk/api/action/package_show?id=abc-123': { body: JSON.stringify({ result: { metadata_modified: '2026-09-02T10:00:00' } }), type: 'application/json' },
  });
  await withArea(AREA, async (dir) => {
    const findings = await runChecks({ dir, fetchImpl: f, now: new Date('2026-10-14'), fetchOptions: noWait });
    const pick = (status) => findings.filter((x) => x.status === status).map((x) => `${x.area}:${x.path}`);

    assert.deepEqual(pick('ok').sort(), ['national:contacts[0].source', 'testshire:register.source', 'testshire:watch[1]'].sort());
    assert.deepEqual(pick('quote-missing'), ['testshire:risks[0].source']);
    assert.deepEqual(findings.find((x) => x.status === 'quote-missing').missing, ['Fluvial flooding']);
    assert.deepEqual(pick('manual'), ['testshire:risks[1].source']);
    assert.deepEqual(pick('unreachable'), ['testshire:pastEvents[0].source']);
    assert.deepEqual(pick('stale'), ['testshire:pastEvents[0].source']);
    assert.deepEqual(pick('new-pdf'), ['testshire:watch[0]']); // the 2024 crr.pdf
    assert.deepEqual(pick('pdf-gone'), ['testshire:watch[0]']); // old-register.pdf
    assert.deepEqual(pick('updated'), ['testshire:watch[2]']); // ckan: 2026-09-02 > 2026-07-31

    // The register PDF is fetched once although three facts and a watch point at it.
    assert.equal(f.calls.filter((c) => c === REGISTER).length, 1);
    // The hazards page serves both a national fact and a watch: fetched once.
    assert.equal(f.calls.filter((c) => c === 'https://lrf.example.org/hazards').length, 1);

    // Titles are stable and distinct, so the weekly job can de-duplicate issues.
    const titles = findings.filter((x) => x.status !== 'ok' && x.status !== 'manual').map((x) => x.title);
    assert.equal(new Set(titles).size, titles.length, titles.join('\n'));
    assert.ok(titles.some((t) => /^\[source\] testshire · quote missing · "Fluvial flooding" · lrf\.example\.org\/sites\/default\//.test(t)), titles.join('\n'));

    const report = formatReport(findings);
    assert.match(report, /❌ risks\[0\]\.source: not on the page: "Fluvial flooding"/);
    assert.match(report, /3 ok · 1 quote missing · 3 changed · 1 unreachable · 1 stale · 1 check by eye/);
  });
});

test('runChecks: --area limits to that area plus national; unknown area throws', async () => {
  await withArea(AREA, async (dir) => {
    const f = fakeFetch({});
    const findings = await runChecks({ dir, only: 'testshire', fetchImpl: f, now: new Date('2026-10-14'), fetchOptions: noWait });
    assert.deepEqual([...new Set(findings.map((x) => x.area))].sort(), ['national', 'testshire']);
    await assert.rejects(runChecks({ dir, only: 'nowhere', fetchImpl: f, fetchOptions: noWait }), /No area file/);
  });
});

test('runChecks: an unreachable page is one finding, listing every fact that uses it', async () => {
  const yamlText = `
name: Testshire
a: { source: { url: 'https://down.example/', quote: one, checked: 2026-10-14 } }
b: { source: { url: 'https://down.example/', quote: two, checked: 2026-10-14 } }
`;
  await withArea(yamlText, async (dir) => {
    const f = fakeFetch({ 'https://lrf.example.org/hazards': { body: FIXTURE } });
    const findings = await runChecks({ dir, only: 'testshire', fetchImpl: f, now: new Date('2026-10-14'), fetchOptions: noWait });
    const u = findings.filter((x) => x.status === 'unreachable');
    assert.equal(u.length, 1);
    assert.equal(u[0].path, 'a.source, b.source');
    assert.match(u[0].detail, /HTTP 404 \(2 facts use this page\)/);
  });
});

test('fingerprint: same finding gives the same title', () => {
  const f = { area: 'cumbria', status: 'updated', url: 'https://www.gov.uk/guidance/x' };
  assert.equal(fingerprint(f), fingerprint({ ...f }));
  assert.equal(fingerprint(f), '[source] cumbria · updated · gov.uk/guidance/x');
});
