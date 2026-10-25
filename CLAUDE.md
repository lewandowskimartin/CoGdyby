# CLAUDE.md — working notes for this repo

Co gdyby (cogdyby.pl) — the Polish-market version of Prepared at Home (preparedathome.co.uk).
Astro site, all visitor-facing copy in Polish. Read this before making changes.
Author: Martin (Marcin Lewandowski), a product designer. He has a sharp eye; "looks about right" is not good enough.

## Co gdyby rules (read first)

- **Language and voice:** Polish, calm, concrete, for mothers 30+. Gender-neutral (no "zrobiłeś/zrobiłaś",
  "chciałbyś"); Polish quotes „…”; dashes sparingly; no AI tells. Full guide: the "Co Gdyby" project doc
  `claude/co-gdyby-voice-guide.md`. Facts come from the government Poradnik bezpieczeństwa
  (https://www.gov.pl/poradnikbezpieczenstwa), IMGW, ISOK, operators; never "Poradnik RCB".
- **URLs are Polish:** /quiz/, /quiz/wynik/, /darmowa-karta/, /dla-rodziny/, /starsi-rodzice/, /regulamin/,
  /polityka-prywatnosci/, Polish blog slugs. Old English URLs 301 via `public/_redirects`; add a line there
  whenever a URL changes.
- **Legal (selling from the UK to Polish consumers):** seller details live only in `src/config/seller.ts`.
  Checklist: project doc `claude/co-gdyby-legal-checklist.md`. Never show a struck-through "regular" price that
  was never charged (Omnibus). Course prices, seats and deadlines are shown only while that tier is really on
  sale (`eaPhase()` in `src/config/earlyAccess.ts`: date not passed, not sold out, Payhip link set).
- **Checkout:** the Payhip links in `src/config/pack.ts` / `src/config/earlyAccess.ts` must point at Polish
  products priced in PLN. Never point them at the UK (English, GBP) products.
- **No affiliate links.** Analytics = Google Analytics 4 (`G-9Z5M267864`, `GoogleAnalytics.astro`) +
  Microsoft Clarity (`z36pb30qkh`, `Clarity.astro`, never on /quiz/wynik/) + optional PostHog (cookieless, EU).
  All load ONLY after consent (`cg:analytics-consent`); quiz-results query string stripped from GA, ads signals off. If analytics changes, bump
  `VERSION` in CookieConsent.astro and update section 6 of /polityka-prywatnosci/.
- **Local pages:** 16 voivodeships in `src/content/local/`. `npm run check:similarity` must stay under 30%.

## The rule that would have saved the most time

**VERIFY VISUALLY BEFORE SAYING "DONE". Never ship a UI/CSS change you have only reasoned about.**

For any visual change:
1. Make the edit.
2. Render the actual result and LOOK at it — screenshot the running page, or render the
   component/section to an image. Eyeballing the code or a user's reference screenshot is not verifying.
3. Only then report back.

Dev server runs at `http://127.0.0.1:4321`. Pages: `/` (home), `/early-access`, quiz under
`/household-preparedness-quiz`. Use the browser tools to screenshot the real page when the server is up.
If you genuinely cannot render, say so plainly in the report — do not imply you checked.

Real failures this rule prevents (all happened, all cost extra rounds):
- A heading orphaned the last word ("...through / it?") — invisible in code, obvious on screen.
- A heading rendered left-aligned while the body was centred — looked broken; never previewed.

## Diagnose, don't guess

When CSS behaves unexpectedly, find the CAUSE in the cascade before editing. Trace which rules
and specificity actually apply. Guessing and nudging values is what turns a 2-minute fix into six rounds.

Concrete example from this repo: `.final p { max-width: 460px; margin: 0 auto 32px }` applies to
EVERY `<p>` inside the green `.final` panel — including new elements dropped in there. It silently
constrained a new heading's box and pinned it left. **Scoped component styles still inherit from and
collide with global.css.** Before styling a new element inside an existing section, check what global
rules already target it (`.final p`, `.final h2`, `.final-inner { text-align: center }`, etc.).

## Read the user's intent, not the literal words

- A reference screenshot is a spec. Match its STRUCTURE — alignment, hierarchy, how elements relate —
  not just the one surface detail you noticed.
- "Do the bottom like this" / "different style" meant *restyle the element*, not *add a border*.
  When unsure what a terse instruction targets, restate the interpretation in one line, then act.

## Design taste (Martin will notice)

- No orphans / widows in headings — use `text-wrap: balance` on display headings.
- Keep alignment consistent within a block (don't mix a left heading with centred body).
- Match the existing system; don't invent patterns.

## Brand / tech quick-reference (from src/styles/global.css :root)

- Emerald accent `--action: #0A6B4A` (5.5:1 on paper), hover `--action-hover: #08573C`, mint `--action-2: #BDEFD3` (on dark ink, and button fill on the emerald panel).
  On the emerald panel text is cream `#FBF7F0` (6.1:1); dark ink fails there (2.2:1). Primary button on the panel is mint with ink text.
- Ink `--ink: #2B2721`, soft `--ink-soft: #5C554A`; paper creams `--paper #F3EBDD`, `--paper-2 #FBF7F0`.
- Display font `--disp` = Fraunces (serif); body `--body` = DM Sans; mono `--mono` = IBM Plex Mono.
- Pack page images: `public/img/pack-page-01..12.png` (240×339). Composite lockups: `public/img/pack-lockup.*`.
- Early Access course copy/prices are config-driven: `src/config/earlyAccess.ts` (EA.NAME, PRICE, etc.).
- Logo `public/img/cogdyby-logo.svg`. Pack page images are still the UK (Prepared at Home, English, terracotta) artwork — replace with Co gdyby versions.

## Local guides: every fact is sourced

- Data for /local/<area>/ lives in `src/content/local/<area>.yaml` (shared numbers in `_national.yaml`).
  Every fact has `source: { url, quote, checked }`, where `quote` is the exact words on the source page.
  The build fails on a fact without one. Use `manual: true` only for text that can't be extracted.
- `npm run check:sources` confirms every quote is still on its page and checks the `watch` lists
  (register pages and gov.pl). Run it before publishing; it exits 1 on any problem.
- `.github/workflows/watch-sources.yml` runs it every Monday and opens issues labelled `source-watch`.
  `.github/workflows/checks.yml` runs tests, build, similarity and internal links on every push.
- `npm test` runs all unit tests (src and scripts). Plan: `plans/2026-10-14-local-pages-automation.md`.

## Housekeeping

- Work in-place in this folder; don't leave scratch files (no `.claude-tmp/`, no stray previews).
- Default branch is `main`. Don't commit unless asked.
- Full working procedure (research → plan → sense-check → execute → test → amend → report) is the
  standing operating procedure Martin set; this file is the project-specific layer on top of it.
