# SlopMonster copy audit — 14 Oct 2026

Site-wide copy pass using SlopMonster (installed at `.claude/skills/slopmonster/`), checked against the Brand Voice Guidelines (calm, practical, UK English, no Oxford comma, sources named, no invented claims).

## Result

| | Before | After |
|---|---|---|
| Pages scoring 5/5 | 11 of 37 | 17 of 37 |
| Pages at 3/5 | 16 | 1 |
| Source edits | | 136 across 33 files |

Every remaining finding is a justified exception (see below). Build passes, `npm test` 65/65, changed sections screenshotted at 1280px and 390px.

Re-run any time: `python3 .claude/skills/slopmonster/tools/deslop.py dist/<page>/index.html`

## Accuracy fixes (most important)

- **/families/ and /elderly-parents/ described pack pages that don't exist.** The "what's in the pack" grids listed "04–05 Home safety: smoke alarm checks, escape routes, flood-risk prompts" and "08 Fridge card". `pack/pack.html` has no smoke alarm, escape route or flood pages, and the fridge card is page 12. Both grids now match the real pack (same map as /free-emergency-plan-template/). Internal links kept.
- **Children's page claims.** Families said the children's pages have space for the home address and "walk through" what to say on 999. Page 11 actually has name, age, grown-ups' numbers, meeting place, trusted grown-up, a drawing box and three steps. Copy and the card mock now match. "Pages 11–12" corrected to "page 11".
- **Invented evidence removed:** "Research from local resilience forums shows children who help make the plan feel safer…" (no source).
- **ICE cards** listed "GP, conditions and medication"; the cards have name, contact and medical notes/allergies.
- **FAQ** called the free gov.uk plan "a single dense page most people… forget in a drawer", contradicting the homepage ("a Word document… covers the basics well") and the brand rule to respect the free alternative. Rewritten.
- **FAQ "no upsells"** removed: the site promotes Ready in 30 everywhere.
- **Families page title promised to "keep the whole household safe"**; the FAQ says no product can promise that.
- **Cookie banner** called Google Analytics + Microsoft Clarity "privacy-friendly". Removed the label.
- **Flood post** said two feet floats a car; the storm post said 30 cm. Aligned both on 30 cm.
- **Grab-bag post** told readers to carry 36 litres "for a grab bag you can actually carry". Now says it's heavy and to split it or keep it by the bag.
- **Kit builder bug:** the text "style above. -->" was rendering on every /kit/ page (an HTML comment containing a literal `<noscript>` tag). Fixed.

## Slop patterns removed

- "Actually" tic: 50 uses across the site. Kept only the homepage brand line ("…your family will actually keep").
- "No X. No Y. Just Z." (Prepare post, Early Access hero), "no cost, no obligation, no catch", "no subscription, no add-ons, no upsells".
- Antithesis/reveal lines: "Ready doesn't mean anxious. It means…", "aren't hypothetical; they're…", "The problem isn't willingness — it's…", "There's a myth that… It doesn't."
- Repeated stock phrases: "earns its place" (6×), "sorted for years" fragment triplets, "a number you have to search for is a number you don't have" (3 posts), "the thing everyone forgets" (4×), "is the difference between X and Y".
- Unsupported generalisations: "more common than most people think", "most people have never heard of", "the ones that come out best", "flying objects cause most storm damage", "the one piece of advice the fire services repeat most often".
- Em-dash titles switched to colons (6 posts, 7 kit builder SEO titles) so `<title>` no longer has two dashes. Slugs unchanged.
- Oxford commas removed where found.

## Left as is (justified checker findings)

- Lists of three that are just lists (food items; "Passports, insurance and birth certificates"; "housing associations, councils and Local Resilience Forums"; the gov.uk survey title).
- PSR post "not just the bill payer": a real distinction, not the construction.
- Em-dash flags on privacy/terms (legal text), the comparison table's N/A cells, and false positives where the checker joins a title to the nav.

## Needs your call

1. **Fire post:** "A working smoke alarm roughly doubles your chance of surviving a house fire" has no source. Find one or cut it.
2. **FAQ:** check "plus a separate fridge card" and "there's also a fillable PDF" against what Payhip delivers.
3. **Privacy page** still describes usage analytics as "privacy-friendly" (not edited, because it's a legal page).
4. **PSR post title** changed from "…free help most UK households don't know about" (unsupported) to "…free extra help in a power or water cut". It's a SERP title change.
5. **Early Access FAQ:** "each module has a variant" for flats/rural/London. Make sure the course delivers this.
6. **Free template table:** gov.uk template "~4 pages": worth checking.
7. **PSR post:** says thepsr.co.uk is one form for electricity, gas and water, then says you may need to register with both suppliers. Worth one clarifying line.

## Not done

- **Second-model pass** (SlopMonster step 3) not run: no GPT/Codex CLI on this machine. To run it: `DESLOP_WRITER=claude .claude/skills/slopmonster/tools/cleanse.sh <file>` once Codex is installed.
- **/local/ pages** not audited: they were being built in the repo by another session at the same time (uncommitted `src/pages/local/`, `src/lib/local.js`, plus edits to Footer, og/pages.js, blog/index). Their changes were left alone. My one edit in `src/lib/og/pages.js` (families OG headline) sits alongside theirs.
- Nothing committed.
