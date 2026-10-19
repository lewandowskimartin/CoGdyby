# Quiz results upgrade: area bars, "you'd manage about…", "if it happened tonight", per-gap links

*Plan, 14 Oct 2026. Builds on "Feature — Quiz Results, Three-Tier Plan" (11 Oct). Prompted by blackoutplan.co.uk's results page (see "Competitor — Blackout Plan, 14 Oct 2026"). Not built yet.*

---

## 1. Research: what we have and what we're copying

**Our results page today** (`household-preparedness-quiz/results.astro`, `test-2`):
gauge + score out of 100 + band → **Your plan** (This week / This month / Longer term, tickable) → pack card → fridge card → email "Email me my plan" → Worth knowing.

**What the quiz already knows.** There are 10 questions, each worth 0/1/2 points, in five areas of two questions each:

| Area | Questions | Max |
|---|---|---|
| Your household plan | q1 written plan, q2 numbers on paper | 4 |
| Power and utilities | q5 torch/batteries/power bank, q6 shut-offs | 4 |
| Food and water | q3 no-cook food, q4 bottled water | 4 |
| Leaving in a hurry | q7 grab bag, q8 documents | 4 |
| Warnings and neighbours | q9 flood/alerts, q10 check-in buddy | 4 |

`scoreAnswers()` already returns `areaScores` (0–4 each) and `weakest`. **The bars need no new logic.**

**What the quiz doesn't know:** household size, how long they'd want to last, how they'd cook, or their freezer. So any "hours" figure has to be built from the two supplies answers alone. Blackout Plan asks 15 questions and still produces contradictions (it said "Food: Strong" after I answered "I couldn't cook", and "little to no lighting" after "1–2 torches"). The lesson is to promise less and keep every claim traceable to an answer.

**What Blackout Plan does that works:**
1. Five area bars with a status word (Needs attention / Moderate / Strong).
2. A time headline: "you'd be comfortable for approximately 6–12 hours".
3. "If this happened tonight": three no-purchase actions.
4. Product cards for the weakest area only.

**What we don't copy:** scores out of 10 (false precision on a 4-point scale), a precise hour count, product cards with images (they read as an ad block), and an ungated PDF (the pack is the printable).

---

## 2. Brainstorm: options considered

### A. Area bars
| Option | Verdict |
|---|---|
| Score /10 per area, like Blackout Plan | ✗ Fakes precision. Each area is 0–4 in steps of 1. |
| Percentage per area | ✗ Same problem; "50%" from two answers reads as measured. |
| **Four-segment bar plus a status word** | ✓ Honest granularity: one segment per point. Reads at a glance. |
| Sort bars weakest first | ✗ The order would change between results. Keep AREAS order and tag the weakest instead. |

**Status words** (match the brand, no red alarm language):
- 4 = **Sorted**
- 2–3 = **Partly there**
- 0–1 = **Start here**. Only the single `weakest` area gets the "Start here" tag; other 0–1 areas say **Not yet**.

### B. "You'd manage about…" headline
| Option | Verdict |
|---|---|
| Exact hours (Blackout Plan) | ✗ We can't compute it without household size, and it would be invented. |
| Add a household-size question | ✗ For now. It changes the `?a=` string, breaks saved result links, emails and tests, and lengthens a 2-minute quiz. Revisit in v2. |
| **Band from the two supplies answers, against the gov.uk 3-day benchmark** | ✓ Honest, zero new questions, and it ties to the official 72-hour message. |
| Power-cut "hours of light" from q5 | ✗ Too fuzzy (one torch vs three). |

**Rule:** `manage = min(q3, q4)` (food and water). It's the weakest link: you can't last three days on tins if there's no water.

| min(q3, q4) | Headline |
|---|---|
| 0 | Without the shops or the tap, you'd manage **less than a day**. |
| 1 | Without the shops or the tap, you'd manage **about a day**. |
| 2 | Without the shops or the tap, you'd manage **about three days**. That's what gov.uk asks for. |

- Under it, a 72-hour track filled to ⅙, ⅓ or full, labelled "gov.uk suggests 3 days".
- Small print: "A rough guide from two of your answers. Size it properly for your household →" linking to `/kit/` with the general scenario. This is a natural handoff to the kit builder.
- Never show hours as digits. "About a day" is honest; "18 hours" is not.

### C. "If it happened tonight"
The point is **emergency-mode actions**: what you'd do if the power went off tonight. It's different from the plan, which is preparation. That avoids duplicating the This week tier.

Rules: three actions, free, each takes minutes, at least two tailored to answers, every line sourced.

Pool, in priority order (`when` is the condition; the first two that match, then fill from the defaults):

| id | when | Action (draft copy) | Source |
|---|---|---|---|
| `charge` | q5 < 2 | Charge every phone and power bank tonight, and put a torch, or your phone, by the bed. | gov.uk Prepare |
| `fill` | q4 < 2 | Fill a few clean bottles or a jug from the tap, so you have drinking water if it stops. | gov.uk Prepare |
| `neighbour` | q10 < 2 | Text one neighbour your number and ask for theirs. | gov.uk Prepare |
| `candles` | q5 < 2 | If the lights go, use a torch rather than candles. | Fire services |
| `call105` | default | If the power goes, call 105. It's free and tells you if it's your street or your fuse box. (NI: 03457 643643) | Energy Networks Association |
| `fridge` | default | Keep the fridge and freezer shut: about 4 hours for the fridge, up to 48 for a full freezer. | FSA |

- Mild overlap: `charge` vs the q5 plan row. Acceptable, since one is "now" and the other is "buy what's missing".
- Placement: a compact numbered card after the bars and before the plan. Heading: **If it happened tonight**. Sub: "Nothing to buy. A few minutes each."

### D. One honest product link per supplies gap
| Option | Verdict |
|---|---|
| Product image cards (Blackout Plan) | ✗ Reads as an ad block and breaks the calm tone. |
| **Text link on each `cost: 'shop'` plan row** | ✓ Sits next to the action it solves. One link per row. |
| Links on free actions | ✗ Never. |

- Mapping goes in `quiz.js` as `shop: '<affiliate id>'` per question:
  - q3 → `tins`
  - q4 → `water`
  - q5 → `torch` (power bank is in the same drawer; consider a combined list)
  - q7 → grab-bag list. **There's no list yet**, so create a Wish/Idea list (rucksack) first, or leave q7 without a link.
- Link text: **See options**, with `rel="sponsored nofollow noopener"` and `target="_blank"`. Built through `affiliateUrl()` so the tag is set once.
- One line under the This month tier, reusing the kit builder's honest-bit voice: "Use what you already have first. Some of these are affiliate links; buying through one may earn us a small commission at no extra cost to you."
- **Hidden when the row is ticked.** If you've done it, we stop selling it.
- **No affiliate links in the results email** (Amazon policy). The form only sends the results link, so this is already true. Keep a test for it.

---

## 3. The plan

### Page order (top to bottom)
1. Gauge + score + band (unchanged)
2. **NEW: "You'd manage about…"** headline + 72-hour track
3. **NEW: area bars** (5 rows, "Start here" tag on the weakest)
4. **NEW: If it happened tonight** (3 actions)
5. Your plan: three tiers, unchanged, **plus "See options" on shop rows**
6. Pack card, fridge card, email, Worth knowing (unchanged)

**Mobile check:** items 2–4 must fit in about one and a half screens at 360px. If they don't, move "tonight" below the plan.

### Files
| File | Change |
|---|---|
| `src/data/quiz.js` | `shop` id on q3, q4, q5 (and q7 once a list exists); `TONIGHT` pool with `when` rules and sources; `AREA_STATUS` words; `MANAGE_BANDS` copy |
| `src/lib/quizScore.js` | `manageBand(answers)` → 0/1/2 · `tonightActions(answers)` → 3 ids · `areaStatus(areaScores, weakest)` |
| `src/lib/quizScore.test.mjs` | tests below |
| `results.astro` | three new blocks + See options links + tracking |
| `src/styles/quiz.css` | segmented bar, track, tonight card (existing tokens only) |
| `src/components/PreparednessGauge.astro` | none |

### Tracking (PostHog + GA4 via `track()`)
- `quiz_shop_clicked` {item, band}
- `quiz_manage_kit_clicked` {band}, from the "size it properly" link
- Optionally `quiz_tonight_viewed` (likely noise; skip)
- **Success:** over 2 weeks vs the prior 2 weeks, results → kit builder CTR up, affiliate clicks > 0 per 100 results, and pack CTR not down. That last one is the guardrail: the new blocks must not push the pack card out of reach.

### Tests to add
- `manageBand`: all 9 combinations of q3 × q4 → min.
- `tonightActions`: always 3; never duplicates; tailored first; all defaults when every answer is 2.
- `areaStatus`: 4 → Sorted, 2–3 → Partly there, 0–1 → Not yet, exactly one Start here (none when everything is 4).
- No `shop` link on any `cost: 'free'` question.
- Headless: See options hidden when the row is ticked; links carry `rel="sponsored"`; nothing overflows at 360px; `?a=` links from before the change still render.

### Build order and estimate (about 5–6 h)
1. Area bars, presentation only: **1 h**
2. Manage band + track + kit handoff: **1.5 h**
3. Tonight card: **1 h**
4. See options links + disclosure: **1 h** (plus about 15 min to make the grab bag Wish list)
5. Tests, screenshots at 360/768/1280, copy pass (avoid-ai-slop + Brand Voice): **1.5 h**

### Sense check
- **Honesty:** every new claim traces to one or two answers and a named source. No precise hours, no prices.
- **No breaking change:** question count, `?a=` format and email fields are untouched.
- **Clutter:** three new blocks on top of a long page is the main risk. The mobile check in the page-order section is the gate.
- **Tone:** status words are calm ("Not yet", not "Critical"). No red; use the existing terracotta and ink.
- **Copy rules:** UK English, no Oxford comma, `105` and `0800 111 999` spaced as on the rest of the site.

### Out of scope (v2 ideas)
- A household-size question for real litres and meals (would need `?a=` versioning).
- Clicking an area bar to filter the plan to that area's actions.
- A seasonal "tonight" variant: cold snap actions from November to February, driven by the kit builder's `SUGGESTED_BY_MONTH`.
