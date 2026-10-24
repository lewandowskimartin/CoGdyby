// After-deploy ping, two channels:
//   1. IndexNow: tells Bing (and Yandex, Seznam, Naver, Yep) which pages are new or changed.
//   2. WebSub: tells Google's hub the RSS feed changed (new blog posts). Google does not use IndexNow.
//
// Run AFTER a deploy is live (Cloudflare builds on push, so this cannot run inside the build):
//   npm run indexnow             new + changed pages since the last run
//   npm run indexnow -- --all    every page in the live sitemap, and ping the hub regardless
//   npm run indexnow -- --dry    show what would be sent, send nothing
//   npm run indexnow -- /blog/some-post/ /kit/    just these paths
//
// How "changed" works: each page's <title> + <main> is hashed and kept in .indexnow-state.json
// (gitignored, local to this machine). Asset-hash churn in <head> is ignored on purpose.
// The key file public/<KEY>.txt must be deployed before the first ping, or IndexNow answers 403.

import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const SITE = 'https://cogdyby.pl';
// Testing only: fetch pages from a local preview while still submitting the real URLs.
const FETCH_ORIGIN = process.env.INDEXNOW_FETCH_ORIGIN || SITE;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const KEY = 'a419168d8e92f3203cd9f00e0ab72bfd'; // cogdyby.pl key; the matching file is public/<KEY>.txt
const STATE_FILE = new URL('../.indexnow-state.json', import.meta.url);
const FEED_HUB = 'https://pubsubhubbub.appspot.com/'; // Google's public WebSub hub, named in the feed
const HUB = process.env.WEBSUB_HUB || FEED_HUB; // where the ping goes (env override for testing only)
const FEED_URL = `${SITE}/rss.xml`;
const FEED_KEY = '__feed__'; // state entry for the feed fingerprint
const SKIP = [/\/polityka-prywatnosci\/$/, /\/regulamin\/$/]; // never worth a recrawl ping

const args = process.argv.slice(2);
const ALL = args.includes('--all');
const DRY = args.includes('--dry');
const paths = args.filter((a) => !a.startsWith('--'));

const get = async (url) => {
  const res = await fetch(url.replace(SITE, FETCH_ORIGIN), { headers: { 'user-agent': 'cogdyby-indexnow' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
};
const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
const fingerprint = (html) => {
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  return createHash('sha256').update(title + main).digest('hex').slice(0, 16);
};

async function liveUrls() {
  const index = await get(`${SITE}/sitemap-index.xml`);
  const urls = [];
  for (const sm of locs(index)) urls.push(...locs(await get(sm)));
  return [...new Set(urls)].filter((u) => u.startsWith(SITE) && !SKIP.some((r) => r.test(u)));
}

// --- IndexNow: Bing, Yandex, Seznam, Naver, Yep -----------------------------------------
// Returns the page fingerprints to remember, or null if the submission failed.
async function indexNow(state) {
  const candidates = paths.length ? paths.map((p) => new URL(p, SITE).href) : await liveUrls();
  const seen = {};
  const toSend = [];
  for (const url of candidates) {
    let fp;
    try { fp = fingerprint(await get(url)); } catch (e) { console.warn(`skip (${e.message})`); continue; }
    if (ALL || paths.length || state[url] !== fp) toSend.push(url);
    seen[url] = fp;
  }

  if (!toSend.length) { console.log('IndexNow: nothing new or changed, nothing sent.'); return seen; }
  console.log(`IndexNow: ${DRY ? 'would send' : 'sending'} ${toSend.length} URL(s):\n  ${toSend.join('\n  ')}`);
  if (DRY) return {};

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: toSend,
    }),
  });
  const meaning = {
    200: 'OK, received',
    202: 'Accepted (key still being validated, normal on the first run)',
    400: 'Bad request',
    403: 'Key not valid / key file not found',
    422: 'URLs do not belong to the host or key mismatch',
    429: 'Too many requests, try again later',
  };
  console.log(`IndexNow: ${res.status} ${meaning[res.status] || res.statusText}`);
  return res.status === 200 || res.status === 202 ? seen : null;
}

// --- WebSub: Google ----------------------------------------------------------------------
// Google's docs: "If you use Atom or RSS, you can use WebSub to broadcast your changes to
// search engines, including Google." The feed (src/pages/rss.xml.js) names the hub; here we
// tell the hub the feed changed, and Google (subscribed once rss.xml is submitted in Search
// Console) fetches it. Only blog posts are in the feed. Never fatal: a hub problem is a warning.
// Returns the feed fingerprint to remember, or null to leave state untouched.
async function webSub(state) {
  let xml;
  try { xml = await get(FEED_URL); } catch (e) { console.warn(`WebSub: skipped, feed not readable (${e.message}).`); return null; }
  if (!xml.includes('rel="hub"') || !xml.includes(FEED_HUB)) {
    console.warn('WebSub: skipped, the live feed does not name the hub yet. Deploy the feed change, then rerun.');
    return null;
  }
  // Fingerprint the items only: <lastBuildDate> or similar would otherwise change every build.
  const items = (xml.match(/<item>[\s\S]*?<\/item>/g) || []).join('');
  const fp = createHash('sha256').update(items).digest('hex').slice(0, 16);
  if (!ALL && state[FEED_KEY] === fp) { console.log('WebSub: feed unchanged, hub not pinged.'); return null; }
  console.log(`WebSub: ${DRY ? 'would ping' : 'pinging'} ${HUB} for ${FEED_URL}`);
  if (DRY) return null;
  try {
    const res = await fetch(HUB, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'hub.mode': 'publish', 'hub.url': FEED_URL }).toString(),
    });
    // The hub answers 204 No Content when it accepts a publish ping.
    if (res.status === 204 || res.status === 200) { console.log(`WebSub: ${res.status} hub accepted the ping`); return fp; }
    console.warn(`WebSub: ${res.status} ${res.statusText}, hub did not accept. IndexNow is unaffected; rerun later.`);
  } catch (e) {
    console.warn(`WebSub: hub unreachable (${e.message}). IndexNow is unaffected; rerun later.`);
  }
  return null;
}

async function main() {
  // Key file must be live, otherwise every IndexNow submission is rejected.
  const liveKey = (await get(`${SITE}/${KEY}.txt`).catch(() => '')).trim();
  if (liveKey !== KEY) {
    console.error(`Key file ${SITE}/${KEY}.txt is not live yet. Deploy first, then rerun.`);
    process.exit(1);
  }

  let state = {};
  try { state = JSON.parse(await readFile(STATE_FILE, 'utf8')); } catch { /* first run */ }

  const pages = await indexNow(state);
  const feedFp = await webSub(state);

  const next = { ...state, ...(pages || {}) };
  if (feedFp) next[FEED_KEY] = feedFp;
  if (!DRY) await writeFile(STATE_FILE, JSON.stringify(next, null, 2) + '\n');
  if (pages === null) process.exit(1);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
