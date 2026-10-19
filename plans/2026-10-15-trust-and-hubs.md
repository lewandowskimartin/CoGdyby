# Trust signals and hubs: checked dates, sources block, corrections, hubs, preferred source

*Plan, 15 Oct 2026. Follows `plans/2026-10-15-preparedbritain-seo-lessons.md` §6. Repo `test-2` at 1fdc54d. Not built yet.*

---

## 0. What's there today (research)

| Thing | Current state |
|---|---|
| Post dates | `updatedDate` exists in `content.config.ts`, `PostLayout.astro` (meta line + `dateModified`) and Keystatic. **0 of 18 posts use it.** |
| Post sources | Every post ends with one italic line, e.g. *"This article follows the official advice on prepare.campaign.gov.uk… not instructions for a specific emergency"*. Usually 1–2 **homepage** links. Three posts add a specific caveat (home skills: savings current in 2026; blackouts: forecasts update through winter; landline: dates from Openreach/Ofcom/gov.uk). |
| Local pages | Already solved: per-fact `source { url, quote, checked }`, "Last checked [date]", a **"Sources and method"** list with check dates, a corrections email (`CORRECTIONS_EMAIL` in `src/data/local.js`), and `npm run check:sources` + weekly GitHub watch with **GOV.UK "last updated" alerts**. |
| /blog/ | Already grouped by `GUIDE_GROUPS` (4 groups + Local guides), but group titles are tiny mono labels with no intro and no anchors. Title tag "Guides — Prepared at Home". |
| Homepage | "Free guides" strip of 4 posts from `HOME_GUIDES`, then "See all guides". No topic links. |
| Footer | Facebook + Pinterest icons; Contact mailto under Organisations. |
| Keystatic | `keystatic.config.ts` blog schema = title, description, pubDate, updatedDate, draft, content. **Fields not declared there risk being dropped when a post is saved in the CMS.** |

**Principle:** make the blog match the local pages. One pattern for sources, dates and corrections across the site, reusing what's built, with no second system.

---

## 1. Updated and checked dates

### Brainstorm
| Option | Verdict |
|---|---|
| A. Use `updatedDate` alone and bump it whenever a post is re-checked | ✗ Re-checking without changing anything would move `dateModified`. Google's guidance is to change the date only for significant changes; fake freshness is a trust risk. |
| B. One `checked` date driving both the visible date and `dateModified` | ✗ Same problem, hidden. |
| **C. Two dates with different meanings** | ✓ `updatedDate` = the content changed (drives schema `dateModified` and "updated …" in the meta line). `checked` = facts re-verified against sources, even if nothing changed (shown as "Checked [date]" in the sources block; not in `dateModified`). |
| D. Add a "What's changed" note (PreparedBritain's habit) | ✓ Small, and it **enforces honesty**: an `updatedDate` must come with a change note for that date. |

### Decision
- New frontmatter: `checked` (date) and `changes` (list of `{ date, note }`).
- **Rule (build-time):** if `updatedDate` is set, `changes` must contain an entry with that date. No silent date bumps.
- Meta line stays: "4 September 2026 · updated 15 October 2026".
- Sources block shows "Checked 15 October 2026" plus, if any, a short "What's changed" list (newest first, max 3).
- `/blog/` cards show "Updated [date]" when `updatedDate` exists, otherwise the publish date.
- **Stale warning:** `checked` older than 180 days prints a warning in `npm test` (not a failure). Same idea as the 90-day `STALE_DAYS` on local pages, with a longer window for guides.

### Sense check
- **Don't run a mass date bump.** Each post gets `checked` only after a real re-check. Do the most-visited posts first (Search Console).
- Posts with moving numbers (NESO winter outlook, Ofgem, price-cap-linked savings) get a real re-check before winter. That's when `updatedDate` should move, with a change note.
- **Sitemap `lastmod`:** `@astrojs/sitemap` currently writes none. Feeding it `updatedDate` needs the config to read frontmatter outside `astro:content`. **Out of scope for now**; revisit once most posts carry real dates.

---

## 2. "Sources and checks" block

### Brainstorm
| Option | Verdict |
|---|---|
| A. Keep sources as body text, written per post | ✗ Inconsistent and untestable. Today's lines mostly cite homepages. |
| B. Footnotes on each claim | ✗ Heavy to write and maintain in Markdoc at 5–8 h a week. |
| **C. Frontmatter list rendered by the layout**, the same look as the local "Sources and method" | ✓ Consistent, testable, editable in Keystatic. |
| D. Also run blog sources through `check:sources` (quotes + GOV.UK watch) | ✓ **Phase 2.** It's the automation that tells you *when* to re-check a post. |

### Decision
- Frontmatter:
  ```yaml
  checked: 2026-10-20
  sources:
    - title: "GOV.UK Prepare: power cuts"
      url: https://prepare.campaign.gov.uk/…
      checked: 2026-10-20
      quote: "…"            # optional; for figures and dates (used in phase 2)
  sourcesNote: "Savings figures are from the Energy Saving Trust and WRAP…"   # optional, the per-post caveat
  changes:
    - { date: 2026-10-20, note: "Added the 2026 Ofgem compensation figures." }
  ```
- **Render** (end of the article, after the prose, before the kit/quiz box):
  - H2 **Sources and checks**
  - "Checked [date]." plus `sourcesNote` if present
  - list: title link · "checked [date]"
  - What's changed (if any)
  - the fixed line: "General information to help your household get ready, not instructions for a specific emergency. In an emergency, call 999." (moved out of the 18 posts)
  - the correction line (item 5)
- **Extract one component** `src/components/SourcesBlock.astro` and use it on **both** posts and local pages, so they can't drift. The local page keeps its own intro sentence ("We check each source weekly…") via a prop.
- **Schema:** add `citation: [urls]` to the Article JSON-LD. Cheap, harmless.
- **Validation:** `sources` optional during migration. A unit test lists posts with fewer than 3 sources. When all 18 are done, make `sources` required (min 3, max 6) in `content.config.ts`.

### Sense check
- **The real cost is content, not code.** Most posts cite one or two homepages. Replacing them with the specific pages each claim relies on (Prepare hazard pages, FSA, Ofgem, Met Office, NESO, ENA 105) takes about 20–30 minutes per post. That's 6–9 hours across 18 posts. Do them in order of traffic, as part of the re-check in item 1. The same visit sets `checked`.
- **Remove each post's italic line in the same edit** as its migration, never in bulk. Otherwise a post briefly has no sources at all.
- **Keystatic:** declare `checked`, `sources` (array of objects), `sourcesNote` and `changes` in `keystatic.config.ts` **before** any post uses them.
- **Design:** must sit in the 720px article column and match the local page's `.sources` styling. Screenshot a post with and without a block at 390 and 1280 (CLAUDE.md rule).

---

## 3. Hubs: real sections on /blog/ and topic links from the homepage

### Brainstorm
| Option | Verdict |
|---|---|
| A. Separate hub pages per topic (`/guides/power-cuts/`) | ✗ For now. With 4–6 posts per group they'd be thin, and they add a URL scheme next to `/blog/`. Revisit when a group passes 8 posts. |
| **B. Make the existing /blog/ groups real sections:** proper headings, an intro line, anchor IDs and a jump list at the top; link each group from the homepage | ✓ Most of the gain for little work; uses `GUIDE_GROUPS` as is. |
| C. Add the group to each post's breadcrumb (Home › Guides › Power cuts and winter) | ✗ Breadcrumbs pointing to anchors add little. Skip. |

### Decision
- `GUIDE_GROUPS` gains `id` (e.g. `power-cuts`) and `intro` (one or two sentences, in brand voice), optionally a `kit` link (power cuts → `/kit/power-cut/`, storms → `/kit/storm/`, kit/water/food → `/kit/`).
- **/blog/ layout:**
  - lede (keep)
  - **jump list** of group names (anchor links)
  - each group gets a Fraunces H2, its intro and its posts. Keep a small mono eyebrow with the count ("6 guides") so the existing design language stays.
  - Local guides stays its own section.
- **/blog/ title and description:** "UK household emergency guides: power cuts, storms, floods and kit · Prepared at Home" and a matching description.
- **Homepage "Free guides":** replace the 4-post strip with **4 topic tiles**. Each has the group name, intro line, its top 2 guides and "All 6 guides →" linking `/blog/#power-cuts`. `HOME_GUIDES` becomes a `featured` list per group (the seasonal swap note moves with it).

### Sense check
- **Intros must be real sentences**, not keyword padding. One or two lines each, avoid-ai-slop pass.
- **Anchors must be stable:** IDs come from `id`, not the title, so renaming a group doesn't break homepage links. The existing internal-links check in `checks.yml` should cover anchors; confirm it does, or add a test.
- **Homepage weight:** the tiles must not grow the section much on mobile. Two guides per tile keeps it near today's height. Screenshot at 390 and 1280 against the current strip.
- **"Start here"** stays first. It's the right entry point and matches PreparedBritain's habit of leading with basics.

---

## 4. Google "preferred source" link

### Research (15 Oct 2026)
- Preferred Sources has been available to **English-language users worldwide since December 2025** ([Google, 16 Dec 2025](https://blog.google/feed/preferred-sources-expands/)), so UK users have it. It was expanded to all Search languages in 2026.
- **It only affects Top Stories** (and a "From your sources" section). Link format: `https://google.com/preferences/source?q=preparedathome.co.uk`. Google offers button assets; any button or link to that URL is fine. **Promoting it is optional**, and "sources that aren't updated regularly may be unavailable for selection" ([ppc.land summary of Google's guide, updated 30 Apr 2026](https://ppc.land/google-updates-preferred-sources-guide-doubling-publisher-click-through-rates/)).

### Sense check
- **Value is low for us.** Evergreen guides rarely appear in Top Stories. It costs about 10 minutes and signals "we're a real publisher", but **a link to a page that says the site can't be selected would look broken.**

### Plan
1. **You:** open `https://google.com/preferences/source?q=preparedathome.co.uk` while signed in to Google. If Prepared at Home appears and can be selected, go ahead. If not, park it until posting is more regular.
2. Footer: a small text link next to the Facebook and Pinterest icons, "Add us as a preferred source on Google", plus `data-footer-cta="google-source"` for tracking. Text rather than Google's badge, so it matches the calm design. Swap in the badge later if wanted.

---

## 5. Correction line

### Brainstorm
| Option | Verdict |
|---|---|
| A. Footer link on every page | ✗ Too generic, and nobody reads footers for this. |
| **B. Last line of the Sources and checks block** (as local pages do) | ✓ It sits right where someone has just checked our sources. |
| C. A /corrections/ page listing every change (PreparedBritain) | ✗ For now. The per-post "What's changed" list (item 1) gives the same honesty without a page to maintain. |

### Decision
- Wording (brand voice, "we" as the brand): **"Spotted something wrong or out of date? Email hello@preparedathome.co.uk and we'll check it and put it right."**
- Move `CORRECTIONS_EMAIL` from `src/data/local.js` into a shared `src/config/site.ts`, with `local.js` re-exporting it so nothing else changes.
- **The promise needs a process:** when a correction comes in, fix it, set `updatedDate`, and add a `changes` note ("Corrected the gas emergency number, thanks to a reader"). The item 1 rule forces the note.

---

## Build order and estimate

| Step | Work | Est. |
|---|---|---|
| 1 | Schema (`content.config.ts`) + Keystatic fields: `checked`, `sources`, `sourcesNote`, `changes`, plus the updatedDate→changes rule | 45 min |
| 2 | `SourcesBlock.astro` (shared), wired into `PostLayout.astro` and the local page; fixed disclaimer line; correction line; `citation` in JSON-LD; `site.ts` for the email | 1.5 h |
| 3 | Tests: rule test, "posts missing sources" report, stale warning; build; screenshots of a post (with and without a block) and a local page at 390 and 1280 | 1 h |
| 4 | **Migrate the first 3 posts** (highest traffic): real sources, `checked`, remove the italic line. Review with you before doing the rest. | 1.5 h |
| 5 | Hubs: `GUIDE_GROUPS` ids, intros and kit links; /blog/ sections + jump list + title; homepage topic tiles; screenshots; internal-link check | 2.5 h |
| 6 | Preferred source: your check, then the footer link | 15 min |
| 7 | Migrate the remaining 15 posts as part of re-checks (one or two a session) | 6–8 h, spread out |
| 8 | **Phase 2:** extend `check:sources` to blog frontmatter (optional quotes + GOV.UK "last updated" watch), so the weekly job flags posts to re-check | 2–3 h |

**Steps 1–5: about 7 hours.** Then content migration over the following weeks.

## Out of scope
- An About page and switching `author` to a Person. It's the bigger trust win (see the SEO lessons doc), but it needs your decision on name and photo.
- Sitemap `lastmod`, separate topic hub pages and a /corrections/ page.

## Decisions for you
1. OK with **two dates** (updated = content changed, checked = facts re-verified)?
2. Which **3 posts first**? I'd pick the top 3 by Search Console clicks; if there's no data yet, the emergency kit, power cut prep and water posts.
3. Correction wording as drafted, or in your own first person ("Email me")?
4. Run the preferred-source check (item 4, step 1).
