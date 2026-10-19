# Local pages automation: source watching and fact checks

*Plan, 14 Oct 2026. Companion to `plans/2026-10-14-local-risk-pages.md`. Goal: no copy-paste and no manual rounds of other websites to find out that something changed.*

---

## Summary

A weekly job checks every source behind the local pages and opens a GitHub issue when something changes: a new register, a moved PDF, a figure that's no longer on its source page, or a dead link. Every fact in the YAML carries the exact sentence it came from, so the check works at the level of single facts, not whole pages.

**What changes for you:** instead of hunting through 30 websites each quarter, you get an issue on your phone saying, for example, "Cumbria: new PDF linked from the hazards page" with both links. You decide what to do. Nothing on a safety page changes without you approving it.

| Now (manual) | After Phase 1 |
|---|---|
| Re-open every register each quarter to see if it changed | A weekly check of the page that *links* to each register flags new editions and moved files |
| Re-check gov.uk pages and datasets by eye | Read their "last updated" date from the GOV.UK Content API and the data.gov.uk API |
| Click every link and phone number on publish day | `npm run check:sources` confirms every quoted fact is still on its source |
| Read pages side by side for duplicate text | Similarity check runs on every push |
| Find dead links when a reader reports them | Link checker runs on every push |

**Cost:** about 3.5 hours, added to the local pages build. No new services, no API keys, no monthly fees. It runs on GitHub Actions' free minutes.

**Principles**
1. **Detect, don't publish.** The automation finds changes and proposes them; you approve. That matters for ratings and phone numbers on a safety page.
2. **Stateless.** What we expect lives in the YAML that's already in the repo, so the job never commits anything. A bot commit would trigger a Cloudflare deploy.
3. **Quiet by default.** It watches links, dates and quoted sentences, not whole-page fingerprints, so cookie banners and footers don't raise false alarms.

---

## Status: Phase 1 built (14 Oct 2026, not committed)

**In the repo:** `src/content.config.ts` (`local` and `localNational` collections with `sourced` and `watch`), `src/content/local/_national.yaml`, `src/content/local/cumbria.yaml` (first area, with draft copy for `atHome`/`firstAction`), `scripts/check-sources.mjs`, `scripts/check-similarity.mjs`, `scripts/watch-issues.mjs`, `scripts/lib/` (code and 19 new tests), `scripts/fixtures/`, `package.json` (scripts `test`, `check:sources`, `check:similarity`; dev dependencies `unpdf` and `js-yaml`), plus `CLAUDE.md` and `.gitignore` notes.

**Waiting on Martin:** the two workflow files are in `Claude outputs/workflows/`. The remote tools aren't allowed to write into `.github/`, so they need moving into `.github/workflows/` by hand.

**Tested:**
- `npm test`: 63 pass (44 existing, 19 new). A fake network covers every kind of finding.
- `astro sync` rejects a fact without a quote. The site still builds (37 pages).
- Similarity check: a name-swap pair fails and a different page passes.
- Internal link check: clean on the real build, and fails on injected broken links.
- `actionlint`: clean on both workflows.
- Issue script against a mock GitHub API: opens new issues, skips open ones, and handles a label that already exists.

**Live run on the Mac (14 Oct, 22:50): 22 of 22 ok.** It took three rounds to get there. powercut105.com, police.uk and SP Energy Networks block automated checks (HTTP 403), and the Met Office storm page answers scripts with 404. Those facts now cite pages that let the checker in (ENWL for 105, GOV.UK for 101, the Met Office blog for the Desmond rainfall). Quote matching now ignores spaces that PDF extraction splits words with. A missing quote shows what the page says around it. `--probe <url>` diagnoses a single page.

**Not tested before that:** a live run. This sandbox can't reach gov.uk or the LRF sites. The first real run is on the Mac, or via "Run workflow".

**Changes from the plan above:**
- **Freshness** is reported by the checker (🕰, issue label `source-stale`), not in the build log, because nobody reads build logs.
- **Already-open issues** are left alone rather than commented on weekly, to keep the noise down.
- **Unreachable pages** are reported once per page, listing every fact that uses it.
- **Links:** internal links are checked offline on every push. Outside links are checked weekly, with Amazon excluded and 403/429 treated as fine, and open one issue between them.

---

## How it fits the repo (findings)

- There's **no `.github/` folder yet**, so this adds the first workflows. Cloudflare builds on push (per `scripts/indexnow.mjs`), so checks that need the network run in GitHub Actions, never inside the Cloudflare build. A flaky council website must never block a deploy.
- Tests already exist as `src/lib/*.test.mjs` with no `test` script in `package.json`. New tests follow that pattern and run with `node --test`.
- `scripts/indexnow.mjs` is the house style for scripts: a plain ESM Node script with a header comment explaining usage and flags. The new scripts follow it.
- The local pages schema (from the main plan) is the natural home for watches and fact anchors, so there's no separate config to keep in sync.

---

## Phase 1: build with the five test pages (about 3.5 h)

### 1.1 Fact anchors in the schema (0.5 h)

Every sourced fact carries the URL, the exact words and the date it was checked. The build fails if any of the three is missing. Example:

```yaml
pastEvents:
  - name: Storm Babet
    date: Oct 2023
    summary: 1,259 homes and businesses flooded inside, across 92 communities.
    source:
      url: https://nottstv.com/more-than-1200-homes-and-businesses-suffered-internal-flooding-after-storm-babet/
      quote: "1,259 homes and businesses"
      checked: 2026-10-14
```

Schema addition in `src/content.config.ts`:

```ts
const sourced = z.object({
  url: z.string().url(),
  quote: z.string().min(4).nullable(),   // null only with manual: true
  manual: z.boolean().default(false),    // e.g. a risk matrix that only exists as an image
  checked: z.coerce.date(),
});
```

`source: sourced` is added to each risk row, past event, power and water entry, register, flood figure and LRF contact. Where text can't be extracted (the Nottinghamshire p.11 matrix is the known case), set `quote: null, manual: true`. The checker lists those in its report as "check by eye", so nothing is silently skipped.

National constants (105, Floodline 0345 988 1188, 999, 101, 111, the NRR 2026 link) go in `src/content/local/_national.yaml` with the same anchors, so all five pages share one checked copy.

### 1.2 Watches (inside each area's YAML)

```yaml
watch:
  - kind: links            # alert when a new PDF appears on this page
    url: https://cumbriaprepared.org.uk/hazards-and-threats-cumbria
    match: "risk register"
  - kind: govuk            # GOV.UK Content API: alert when public_updated_at is newer than `since`
    url: https://www.gov.uk/guidance/local-resilience-forums-contact-details
    since: 2026-02-11
  - kind: ckan             # data.gov.uk API: alert when metadata_modified is newer than `since`
    url: https://www.data.gov.uk/dataset/5a98b0a1-2741-4b2f-a51b-5b42f13219f2/...
    since: 2026-07-01
```

These three kinds cover every failure seen in today's research:

| What happened | Watch that catches it |
|---|---|
| Notts v8.0 at a **new URL**, old URL still live | `links` on the Notts LRF page: a register PDF that isn't the one in the YAML |
| Cumbria register **moved site** | `links` on Cumbria Prepared's hazards page |
| Lincolnshire **has no register** yet | `links` on the LRF risks page: any matching PDF at all |
| London site **down for maintenance** | Fetch failure, reported as "unreachable" (see risks) |
| gov.uk contact page or NRR updated | `govuk` |
| EA flood file updated | `ckan` |
| Figure changed or page removed (Babet count, PSR phone numbers) | Fact anchors (1.1) |

### 1.3 `scripts/check-sources.mjs` (1.5 h)

What it does:
1. Reads every YAML file in `src/content/local/`.
2. Collects each `source` (de-duplicated by URL) and each `watch`.
3. Fetches each URL once, politely: one request at a time, 3 tries with back-off, and a user-agent naming the site and hello@preparedathome.co.uk.
4. Extracts the text. HTML: tags stripped. PDF: **`unpdf`**, a new dev dependency that's small and works in Node on both the Mac and the runner. GOV.UK: `https://www.gov.uk/api/content/<path>`. data.gov.uk: `https://www.data.gov.uk/api/action/package_show?id=<id>`.
5. Normalises text before matching: whitespace, non-breaking spaces, curly quotes, en dashes and case. This avoids false alarms from formatting.
6. Prints a report grouped by area: ✅ found, ❌ quote missing, 🆕 new PDF or newer date, ⚠️ unreachable, 👁 manual check.

Usage, in the same style as indexnow.mjs:

```
npm run check:sources                       all areas
npm run check:sources -- --area cumbria     one area
npm run check:sources -- --json             machine output for the workflow
```

Exit code 1 if anything other than ✅ or 👁 is found, so it doubles as the **publish-day verification** step in the main plan.

### 1.4 Weekly GitHub Action: `.github/workflows/watch-sources.yml` (0.5 h)

- **When:** Mondays at 06:15 UTC, plus a "Run workflow" button.
- **Steps:** checkout, `npm ci`, `npm run check:sources -- --json`, then a short script step that turns findings into issues.
- **Issues:** one per finding, titled with a stable fingerprint, for example `[source] cumbria · new PDF · hazards-and-threats-cumbria`. Before opening, it searches open issues for that title and adds a comment instead of a duplicate. Labelled `source-watch`. GitHub's app notifies you on your phone.
- **Permissions:** the built-in `GITHUB_TOKEN` with `issues: write`. No secrets to add.
- **Commits nothing**, so no Cloudflare deploy is triggered.

### 1.5 Checks on every push: `.github/workflows/checks.yml` (0.5 h)

| Check | How | Fails the run when |
|---|---|---|
| Build | `npm ci && npm run build` (the zod schema enforces the fact anchors) | Any fact is missing its source or quote |
| Link check | [lychee](https://github.com/lycheeverse/lychee-action) over `dist/` | Dead links. Redirects and timeouts are warnings only |
| Similarity | `scripts/check-similarity.mjs`: 5-word shingles across `/local/*` pages | Any pair above 0.3 (the doorway guardrail) |
| Unit tests | `node --test` | Normaliser or quote matching broken |

**Freshness warnings** go in the build log and never fail a deploy: `checked` older than 90 days, or a register review date older than 2 years. The same dates are shown on the page, so readers see them too.

### 1.6 Tests (0.5 h)

- `scripts/lib/sources.test.mjs`, in the same `node --test` style as `src/lib/*.test.mjs`:
  - The normaliser treats "1,259 homes" and "1,259&nbsp;homes" as equal.
  - Curly and straight quotes match.
  - The PDF link finder picks the register PDF out of a saved copy of a real page (small HTML fixture in `scripts/fixtures/`, not a whole site).
  - The fingerprint stays the same across runs.
- **Live run** against the five areas once their YAML is entered. Expect all ✅, plus 👁 for the Notts matrix.
- **Failure drill:** change one quote in a YAML locally and confirm ❌. Point one watch at an older `since` date and confirm 🆕. Run the Action by hand and confirm it opens one issue, then comments on that issue rather than opening a duplicate on a second run. Close and delete the drill issues afterwards.

### Files (Phase 1)

| File | New or changed |
|---|---|
| `src/content.config.ts` | `sourced` object, `watch` array |
| `src/content/local/_national.yaml` | New: shared constants |
| `scripts/check-sources.mjs` | New |
| `scripts/check-similarity.mjs` | New |
| `scripts/lib/sources.js` + `sources.test.mjs` + `scripts/fixtures/` | New: shared fetch, normalise and match code, with tests |
| `.github/workflows/watch-sources.yml` | New |
| `.github/workflows/checks.yml` | New |
| `package.json` | Scripts `check:sources`, `check:similarity`, `test`; dev dependency `unpdf` |

---

## Phase 2: only if the January gate says "scale" (about 6 h)

These pay off at 38 areas, not 5.

| Piece | What it removes | Notes |
|---|---|---|
| **Data script** `scripts/build-local.mjs` | Hand-entering flood numbers and council lists | ONS LAD→LRF lookup, plus EA figures via the data.gov.uk API. Writes `src/data/local/<area>.json` with `asOf`. Confirm both licences first. |
| **Power company overlay** | Guessing which power company covers which council | Overlay NESO's [DNO licence-area boundaries](https://www.neso.energy/data-portal/gis-boundaries-gb-dno-license-areas) on ONS council boundaries and list each area's operators. This answers the Bassetlaw and north Lincolnshire questions from data. Check the licence. Water has no equivalent open file that I've confirmed, so water stays hand-entered and watched. |
| **Live flood warnings** | The stale build-time snapshot | Fetched in the reader's browser from the EA flood API. **Check CORS first.** If the API blocks browser calls, use a small Worker proxy or keep the link-out. |
| **Claude drafts the fix** | Reading the new register and re-typing ratings | A weekly scheduled Claude task picks up open `source-watch` issues, reads the new source (including image-only tables), updates the YAML with quotes and page numbers, and opens a pull request for you to review. This uses your existing Claude plan, so no API key in the repo. |

## Parked (unchanged from the main plan)

Emailing area groups when the EA shows a flood warning in their area. That's a retention feature for after the gate.

---

## Risks

| Risk | Response |
|---|---|
| Council and police sites block bots or go down (London was in maintenance today; North Lincs showed a bot check) | 3 tries with back-off. Report as ⚠️ unreachable with its own label, low priority. Only you decide whether it matters. |
| A source reformats and a quote stops matching (false alarm) | The normaliser handles the common cases. Otherwise the fix is a one-line quote update in YAML, which is still faster than re-checking by hand. |
| PDF text comes out scrambled (as with the Notts matrix) | `manual: true` puts it on the 👁 list every run, so it isn't forgotten. Phase 2's Claude step can read the page as an image. |
| Alert fatigue | Watches only check links, dates and quotes. Issues are de-duplicated. One weekly run. |
| GitHub Actions minutes | About 2 minutes per push and 3 per weekly run. Comfortably inside the free allowance. |
| A wrong fact published despite the checks | The checks confirm that a quote is on its source, not that the source is right. The Goretti mix-up would still need a person. Keep the publish-day read-through. |

## Changes to the main plan

| Session | Was | Now |
|---|---|---|
| 1 | Collection, template, hub, OG, Cumbria (3 h) | + fact anchors and watch schema, `_national.yaml` (3.5 h) |
| 2 | Nottinghamshire, signup, tracking (3 h) | + `check-sources.mjs` with tests (5 h) |
| 3 | Devon/Cornwall, London (3 h) | Unchanged; quotes entered as facts are typed (3 h) |
| 4 | Lincolnshire, links, About (2.5 h) | + both workflows, failure drill (3.5 h) |
| 5 | Manual verification (1.5 h) | Run `check:sources`, review 👁 items, read-through (1 h) |
| **Total** | **13 h** | **16 h** |

Every quarter after that, the "check each register" task is replaced by reading whatever the watcher has opened.

## Sources

- [GOV.UK Content API](https://content-api.publishing.service.gov.uk/) and [reference](https://content-api.publishing.service.gov.uk/reference.html)
- [data.gov.uk API documentation](https://guidance.data.gov.uk/get_data/api_documentation)
- [EA real-time flood-monitoring API](https://environment.data.gov.uk/flood-monitoring/doc/reference)
- [NESO: GIS boundaries for GB DNO licence areas](https://www.neso.energy/data-portal/gis-boundaries-gb-dno-license-areas)
- [lychee link checker action](https://github.com/lycheeverse/lychee-action)
