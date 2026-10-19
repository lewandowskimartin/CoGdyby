# Local risk pages: sense check, research and build plan

*Plan, 14 Oct 2026. Reviews the spec "Prepared at Home: local risk pages test spec" (14 Oct 2026). Facts were checked on 14 Oct against the sources linked. **Re-check every figure, phone number and URL on publish day.** Search results below came from a search tool, not Google UK, so treat them as a rough guide and repeat the manual check in a private window.*

---

## Verdict

**Go, with changes.** The idea holds up and the search gap is real. But four of the five areas have register facts in the spec that are wrong or out of date, and the data model breaks on three of them.

- **The opening is real.** In all four areas checked, "[area] power cut what to do" is held by one commercial site (Selectra) with thin county and town pages. Network operators and councils don't appear. "[area] emergency plan" mostly returns scattered parish and council PDFs, and in Cumbria they are legacy pages of abolished councils.
- **The registers don't share one rating system.** Cumbria and London use labels (Very High, High). Nottinghamshire and Devon/Cornwall use 1–5 likelihood and impact scores. Lincolnshire publishes no current register at all. The spec's `rating: z.enum(['very high', …])` fails for three of the five pages.
- **Drop the data script for this test.** For five pages, hand-entering the numbers with an `asOf` date is faster and safer. Build the script only if the gate says "scale" (38 LRFs).
- **Remove "warnings in force at build time".** On a static site, a "no warnings" line goes stale within hours, which is dangerous on a safety page. Link to the live checker instead.
- **The date is tight.** 25 Oct is 11 days away and collides with the content-gap posts (compensation w/c 19 Oct, broadband w/c 26 Oct, power stations by 6 Nov) and the launch blockers. Suggested: Cumbria and Nottinghamshire live by 25 Oct, all five by 8 Nov, gate on 23 Jan 2027.

---

## 1. Corrections to the spec

| # | Spec says | What's true (14 Oct 2026) | Change |
|---|---|---|---|
| 1 | Nottinghamshire CRR v7.0, June 2024 | Replaced by **v8.0, cover dated Nov 2025** (the intro says "published July 2025"; the file name says v901). [New PDF](https://www.nottinghamcity.gov.uk/media/sybbyfav/nottingham-nottinghamshire-community-risk-register-v901-november-2025.pdf). The old URL still serves v7.0. | Cite "2025 edition (v8.0)". Use the new URL. |
| 2 | Notts lead risk: "flooding, severe weather" | Highest impact scores: **loss of power, water, gas or telecoms (5)** and pandemic (5). River flooding 4. Heat and cold 3. Surface water only 2. Likelihood scores couldn't be read reliably from the PDF text. | Lead with power and water, flooding second. **Martin to read the p.11 matrix by eye.** |
| 3 | Lincolnshire has a CRR to summarise | **No current register is published online.** The [LRF risks page](https://www.lincolnshireresilienceforum.org/risks/) (updated 15 Jul 2026) lists 9 risks with no ratings. The last named edition is 2018–21. The fire service's Community Risk Profile quotes the LRF register as rating flooding and severe weather "high". | Keep the page, built from the LRF list and the fire service profile. **Email the LRF for the current register** (5 minutes; it could upgrade the page). |
| 4 | Cumbria CRR reviewed 13 May 2024 | **Newer edition, "Reviewed 28th September 2026"**, on [Cumbria Prepared](https://cumbriaprepared.org.uk/hazards-and-threats-cumbria). The grid risk is now called "National power outage" (still Very High). Storms dropped to Medium. | Use the 2026 edition. It's the freshest of the five, so build it first. |
| 5 | Cumbria power: "SP Electricity North West, renamed Aug 2025" | Confirmed, [unveiled 4 Aug 2025](https://www.scottishpower.com/news/pages/new_look_for_sp_electricity_north_west.aspx). Its register is called the **Extra Care register**, not the PSR. Signing up with United Utilities shares you with it automatically. | Use both facts. That's a useful local tip. |
| 6 | Storm Goretti: "over 250,000 customers lost power" (South West) | 250,000 is the **minister's UK-wide figure** (13 Jan 2026). NGED's own total is 246,809 restored across the South West, South Wales and West Midlands. The South West figure found: **more than 45,000 properties off** on the morning of 9 Jan (PA). Gust of 99 mph at St Mary's Airport, the highest there since 1991 ([Met Office](https://www.metoffice.gov.uk/blog/2026/storm-goretti-key-stats-from-the-multi-hazard-event)). | Use "more than 45,000 homes and businesses in the South West", plus the 99 mph gust. |
| 7 | Devon/Cornwall register | **2024 edition, no publish or review date in it.** Uses likelihood × impact scores, not labels. LRF email on GOV.UK is **lrf@dc.police.uk** (the Torbay page in the spec has no contact). | Show "2024 edition" and the scores as worded. |
| 8 | London register "aligned to the 2022 assessment", so swap if nothing newer | Latest is **Version 14, 14 Jan 2025**. It is *aligned to* the 2022 NSRA but was itself reviewed in January 2025 and carries full ratings. The swap rule was written on the wrong premise. | **Keep London** (reasoning in section 3). West Yorkshire stays as reserve. |
| 9 | London water "varies by borough: list per borough" | Four companies (Thames 76%, Affinity 14%, Essex & Suffolk 7%, SES 4%). Two power operators (UK Power Networks; SSEN in parts of west London). | Don't list by borough. Link Water UK's [Find your supplier](https://www.water.org.uk/advice-for-customers/find-your-supplier/) and say 105 routes by postcode. |
| 10 | Notts water: Severn Trent | Severn Trent for most of the county; **Anglian Water supplies most of Bassetlaw**. | Two water rows. |
| 11 | Lincolnshire power: NGED | NGED for most of the county. **Northern Powergrid probably covers parts of the north** (West Lindsey parishes post its notices), but no boundary is verified. | Say "105 connects you to whichever company serves your postcode". Don't draw the boundary. |
| 12 | DCIoS councils | The LRF's partner page lists 12 councils and leaves out North Devon. | List all 13 in one sentence. |
| 13 | Flood numbers from the EA rivers-and-sea postcode file | London's lead flood risk is **surface water**, which that file doesn't cover. The EA's local-authority summary dataset was retired and superseded on 1 Aug 2025, and its page warns that the underlying receptor data isn't open. | At build: use the EA's current LA-level summary if its licence is OGL; otherwise use the NAO CSV with its date. For London, show surface water or drop the numbers block. |
| 14 | "Any warnings in force at build time" | Stale within hours on a static site. | Remove. Link to [Check for flooding](https://check-for-flooding.service.gov.uk/) and Floodline 0345 988 1188. |
| 15 | GA4 events `template_signup`, `pack_click` with an `area` parameter | The repo already tracks `pack_cta_clicked` with a `location` from any `data-pack-cta` attribute (BaseLayout.astro). The quiz already uses "area" for its five preparedness areas (`AREAS` in quiz.js). | Use `data-pack-cta="local-<slug>"` (no new code). New event `local_email_submitted { lrf }`. Use `lrf`, not `area`. PostHog gets both through `track()`. |
| 16 | MailerLite group per area | The site already posts straight to MailerLite with hidden fields (`EMAIL_FORM.action`, quiz and kit forms). | Same pattern: hidden `fields[local_area]`. In MailerLite: create the custom field and one automation that segments by it. No new forms. |
| 17 | "Use the name on the About page" | **There is no About page.** Posts use `author: Organization`. The site says "Martin" on /early-access/ and "Marcin Lewandowski" on /privacy/ and /terms/. | Decide the byline. Recommend a short /about/ page (YMYL trust signal, about 30 minutes). |
| 18 | Add "Local guides" to the main nav | The header already has 6 links plus the price button. | Add to the footer and as a section on /blog/. Put it in the header only if the gate says "scale". |
| 19 | OG images | `src/pages/og/[...slug].png.ts` only builds cards for STATIC_PAGES and blog posts. New /local/ pages would point at a **missing OG image**. | Add the local collection to its `getStaticPaths`. |

**Confirmed as stated:** [National Risk Register 2026](https://www.gov.uk/government/publications/national-risk-register-2026) (14 Jul 2026, guide replaced 12 Aug 2026). The national campaign "anchored in GOV.UK/Prepare, launching later this year" ([implementation report](https://www.gov.uk/government/publications/the-uk-government-resilience-action-plan-2026-implementation-report/the-uk-government-resilience-action-plan-2026-implementation-report-html), updated 1 Oct 2026). FAQ rich results ended 7 May 2026 (reported by [Search Atlas](https://searchatlas.com/news/faq-rich-results-are-dead-google-wants-control-of-the-answer-layer/); no official Google post found). Humber LRF covers North and North East Lincolnshire.

**Worth knowing:** the same implementation report commits the government to "launch new advice for households on preparing for disruption and emergencies". That raises demand, but it will also put a gov.uk page into the same results. The local angle is what that page won't cover.

**Not opened (permission prompts timed out):** the EA postcode dataset page, the ONS LAD→LRF lookup licence, the flood API reference and the live site. These move to the build-day checks.

---

## 2. Revised data model

The spec's schema assumes every register has labelled ratings. This one records the rating *as the register words it* and states which system it uses, so the page can say "the register scores this 5 out of 5 for impact" or "listed, not rated" honestly.

```ts
// src/content.config.ts (add alongside blog)
const local = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/local' }),
  schema: z.object({
    name: z.string(),                         // "Cumbria"
    lrf: z.object({ name: z.string(), url: z.string().url(), email: z.string().email() }),
    register: z.object({
      title: z.string(),
      edition: z.string(),                    // "Reviewed 28 Sep 2026", "2025 edition (v8.0)"
      url: z.string().url(),
      system: z.enum(['labels', 'scores', 'unrated']),
    }),
    risks: z.array(z.object({
      name: z.string(),
      rating: z.string(),                     // as worded: "Very high" / "Impact 5 of 5" / "Listed"
      likelihood: z.number().min(1).max(5).optional(),
      impact: z.number().min(1).max(5).optional(),
      page: z.number().optional(),            // register page, for re-checking
      atHome: z.string(),                     // your words
      firstAction: z.string(),
    })).min(4).max(6),
    power: z.array(z.object({ operator: z.string(), register: z.string(), url: z.string().url(), note: z.string().optional() })).min(1),
    water: z.array(z.object({ company: z.string(), url: z.string().url(), note: z.string().optional() })).min(1),
    pastEvents: z.array(z.object({ name: z.string(), date: z.string(), summary: z.string(), sourceUrl: z.string().url() })).min(1).max(2),
    flood: z.object({ source: z.string(), asOf: z.coerce.date(), rows: z.array(z.object({ band: z.string(), properties: z.number() })) }).optional(),
    councils: z.string(),                     // one sentence
    councilPages: z.array(z.object({ label: z.string(), url: z.string().url() })),
    radio: z.string(),
    planOrder: z.array(z.enum(['flood', 'power', 'water', 'storm', 'cold', 'heat', 'evacuation'])).length(5),
    firstHandNote: z.string().optional(),
    lastChecked: z.coerce.date(),
  }),
});
```

Changes from the spec: the rating is free text plus `system`; power and water are arrays (Notts, Lincolnshire and London each have two or more); `cold` is added to `planOrder` (it's rated High or 4×4 in three areas); `lrfCode` and the generated JSON are dropped for the test. Councils are one hand-written sentence.

---

## 3. The five pages

### Build order

1. **Cumbria.** Freshest register (Sep 2026), clean labels, stale competitors. Proves the template.
2. **Nottinghamshire.** Home area, first-hand note.
3. **Devon, Cornwall and Isles of Scilly.** Strongest story (Goretti).
4. **London.** Volume test.
5. **Lincolnshire.** Weakest register, best history. Last, so the LRF has time to reply.

### Why keep London

- The register is current enough (Jan 2025) and fully rated. West Yorkshire's 2025 register has **no ratings at all**.
- West Yorkshire Police already publishes a "Household Emergency Plan" page that ranks first for "West Yorkshire emergency plan". That's direct competition for the exact angle.
- The gate asks whether demand follows risk type or population. Without London, the test can't answer that.
- Costs: "London emergency plan" also returns London, Ontario; the flooding results are gov-heavy; two power operators and four water companies. The plan handles the utilities with 105 and the Water UK lookup. City Hall's site was down on 14 Oct, so recheck its URLs on build day.

---

### 3.1 Cumbria · `/local/cumbria/`

| | |
|---|---|
| Title tag | Cumbria emergency plan: local risks explained |
| H1 | Cumbria emergency plan: what the local risk register means for your home |
| Answer line (draft) | Cumbria's risk register, reviewed in September 2026, rates river flooding and a national power outage as very high risks for the county. |
| Register | Cumbria Community Risk Register (public version), reviewed 28 Sep 2026. [PDF](https://cumbriaprepared.org.uk/sites/default/files/13850690/2026-10/Cumbria%20Community%20Risk%20Register%20Public%20Version%20%282%29.pdf). System: labels. Page numbers to note at build. |
| LRF | Cumbria Local Resilience Forum: [cumbriaprepared.org.uk](https://cumbriaprepared.org.uk/homepage), crf.secretariat@westmorlandandfurness.gov.uk |
| Councils | Cumberland Council and Westmorland and Furness Council (the two unitaries since April 2023). |

**Risk table (rating as worded)**

| Risk | Rating | First thing to do |
|---|---|---|
| River (fluvial) flooding | Very high (L3, I4) | Sign up for flood warnings for your postcode |
| National power outage | Very high (L3, I5) | Torch, radio and power bank where you can find them in the dark |
| Localised surface water flooding | High (L3, I3) | Know where your stopcock and electrics switch-off are |
| Low temperatures and snow | High (L3, I3) | A warm-room plan and three days of food that needs no cooking |
| Reservoir or dam collapse | High (L2, I4) | Check your address on the long-term flood risk service, which includes reservoirs |
| Storms | Medium (L3, I2; down from High in 2024) | Secure loose items and charge everything before a named storm |

**Plan order:** flood → power → cold → evacuation → water.

**Power and water:** SP Electricity North West (105; the [Extra Care register](https://www.enwl.co.uk/power-cuts/extra-care/)). United Utilities ([priority services](https://www.unitedutilities.com/help-and-support/priority-services/), 0345 072 6093). Local tip: registering with United Utilities also puts you on the electricity register.

**Past events**
- **Storm Desmond, 5–6 Dec 2015:** UK 24-hour rainfall record of 341.4 mm at Honister Pass. 5,200 homes flooded across Cumbria and Lancashire ([Met Office](https://weather.metoffice.gov.uk/warnings-and-advice/uk-storm-centre/storm-desmond)).
- **Desmond power cuts:** 13,000 people lost power in Carlisle and across Cumbria after substations flooded ([ENWL, 9 Dec 2020](https://www.enwl.co.uk/about-us/news/latest-news-and-views/2020/Five-years-on-from-Storm-Desmond-North-West-power-network-stronger-than-ever/)).
- **Don't use** Cumbria Prepared's "over 50,000 homes" for Desmond. It contradicts the Met Office.

**Radio:** BBC Radio Cumbria (95.6 FM north Cumbria; check frequencies on the BBC site).

**Search check:** "emergency plan" returns legacy council pages and abolished councils (Copeland, Carlisle), the strongest opening. "Power cut" is all Selectra. "Flooding how to prepare" is Cumberland Council, harder.

---

### 3.2 Nottinghamshire · `/local/nottinghamshire/`

| | |
|---|---|
| Title tag | Nottinghamshire emergency plan: local risks explained |
| H1 | Nottinghamshire emergency plan: what the local risk register means for your home |
| Answer line (draft) | Nottinghamshire's 2025 risk register gives its highest impact score to losing power, water or gas, with flooding from the Trent and its tributaries close behind. |
| Register | Nottingham & Nottinghamshire CRR, 2025 edition (v8.0). [PDF](https://www.nottinghamcity.gov.uk/media/sybbyfav/nottingham-nottinghamshire-community-risk-register-v901-november-2025.pdf). System: scores. Matrix p.11. |
| LRF | Nottingham and Nottinghamshire LRF: [page on the Notts Police site](https://www.nottinghamshire.police.uk/police-forces/nottinghamshire-police/areas/about-us/about-us/additional-services/nottinghamshire-local-resilience-forum-lrf/), localresilienceforum@notts-fire.gov.uk |
| Councils | Nottingham City, Nottinghamshire County, and Ashfield, Bassetlaw, Broxtowe, Gedling, Mansfield, Newark and Sherwood and Rushcliffe. |

**Risk table (impact score as given; likelihood to add from p.11)**

| Risk | Rating | First thing to do |
|---|---|---|
| Loss of power, water, gas or telecoms (p.12) | Impact 5 of 5 | Join the Priority Services Register if anyone at home depends on power |
| River flooding (p.16) | Impact 4 of 5 | Flood warnings for your postcode, and a list of what goes upstairs first |
| Low temperatures and snow (p.24) | Impact 3 of 5 | Warm-room plan; check on older neighbours |
| Heatwave (p.22) | Impact 3 of 5 | Find your coolest room now; shade south-facing windows |
| Pandemic (p.14) | Impact 5 of 5 | Two weeks of regular medicines and basics |

**Plan order:** power → flood → water → cold → heat.

**Local specifics:** the Trent and its tributaries the Maun, Meden, Idle and Devon (p.9). 40.1°C at Gringley-on-the-Hill in July 2022 (p.22).

**Power and water:** NGED East Midlands (105; [PSR](https://customer.nationalgrid.co.uk/advice-and-guidance/priority-services/priority-services-register), 0800 096 3080). Severn Trent for most of the county ([priority services](https://www.stwater.co.uk/help-and-contact/priority-services/)). Anglian Water for most of Bassetlaw ([priority services](https://www.anglianwater.co.uk/help-and-advice/water-care/priority-services)).

**Past events**
- **Storm Babet, Oct 2023:** 1,259 homes and businesses flooded internally across 92 communities (county council figures via [Notts TV](https://nottstv.com/more-than-1200-homes-and-businesses-suffered-internal-flooding-after-storm-babet/)). Use this rather than the register's rounded "about 1,400".
- **Storm Henk, Jan 2024:** more than 570 properties flooded (CRR p.17).

**Radio:** BBC Radio Nottingham (103.8 FM; check on the BBC site).

**First-hand note (you):** three or four sentences from NG5. Prompts: what Babet or Henk looked like where you live; what you'd want a new neighbour to know; the one thing you've actually set up at home.

**Search check:** "emergency plan" and "flooding how to prepare" are council pages plus old news, an opening. "Power cut" is all Selectra.

**Before writing:** read the p.11 matrix by eye for likelihood scores. Cite "2025 edition"; the version and date labels disagree inside the PDF.

---

### 3.3 Devon, Cornwall and Isles of Scilly · `/local/devon-cornwall-isles-of-scilly/`

| | |
|---|---|
| Title tag | Devon and Cornwall emergency plan: local risks explained |
| H1 | Devon, Cornwall and Isles of Scilly emergency plan: what the local risk register means for your home |
| Answer line (draft) | The local risk register scores surface water flooding, long spells of cold and snow, and a national power failure among its top risks, and Storm Goretti showed in January 2026 what a long power cut looks like here. |
| Register | 2024 DCIoS Community Risk Register (no date given in it). [PDF](https://www.dcisprepared.org.uk/media/pddjjp3s/2024-devon-cornwall-and-isles-of-scilly-community-risk-register.pdf). System: scores. |
| LRF | [dcisprepared.org.uk](https://www.dcisprepared.org.uk/), lrf@dc.police.uk |
| Councils | Devon County, Cornwall, Plymouth, Torbay and the Council of the Isles of Scilly, plus East Devon, Exeter, Mid Devon, North Devon, South Hams, Teignbridge, Torridge and West Devon. |

**Risk table**

| Risk | Rating (L × I) | First thing to do |
|---|---|---|
| Surface water flooding (p.4–5) | 4 × 4 | Know your stopcock and electrics switch-off |
| Prolonged cold, snow and ice (p.4) | 4 × 4 | Warm-room plan, food that needs no cooking |
| National electricity transmission failure (p.4) | 3 × 5 | Torch, radio and power bank in one place |
| Storms (p.6) | 4 × 3 | Charge everything when an amber warning is issued |
| Coastal flooding (p.5) | 3 × 4 | Flood warnings for your postcode |

**Plan order:** power → storm → flood → cold → water.

**Power and water:** NGED South West (105; [PSR](https://customer.nationalgrid.co.uk/advice-and-guidance/priority-services/priority-services-register), 0800 096 3080). South West Water for Devon, Cornwall and the Isles of Scilly since 1 April 2020 (PSR 0344 346 1010).

**Past event: Storm Goretti, 8–9 Jan 2026.** Red wind warning for the Isles of Scilly and much of Cornwall. 99 mph gust at St Mary's Airport ([Met Office](https://www.metoffice.gov.uk/blog/2026/storm-goretti-key-stats-from-the-multi-hazard-event)). More than 45,000 South West properties without power on the morning of 9 Jan ([PA via Irish News](https://www.irishnews.com/news/northern-ireland/tens-of-thousands-without-power-as-storm-goretti-wreaks-havoc-across-uk-2AFTQRSYP5IAPAR3YI7Q5AUQAU/)). Some customers were off for several days ([NGED storm summary](https://powercuts.nationalgrid.co.uk/storm-summary)).

**Radio:** BBC Radio Devon and BBC Radio Cornwall (Cornwall's 96.0 FM covers Scilly; check on the BBC site).

**Search check:** "Cornwall power cut what to do" is all Selectra town pages. "Devon emergency plan" is weak parish results, an opening. People search Devon and Cornwall separately, but keep **one page per LRF**: splitting it would duplicate the register, which is the doorway pattern.

---

### 3.4 London · `/local/london/`

| | |
|---|---|
| Title tag | London emergency plan: local risks explained |
| H1 | London emergency plan: what the London Risk Register means for your home |
| Answer line (draft) | The London Risk Register rates surface water flooding, heatwaves, fires in high-rise flats and a national power failure as very high risks for the capital. |
| Register | London Risk Register, Version 14, 14 Jan 2025 ([PDF](https://www.london.gov.uk/media/109576/download)). Aligned to the 2022 national assessment; say so on the page. System: labels plus scores. |
| LRF | London Resilience Partnership, londonresilience@london.gov.uk |
| Councils | All 32 London boroughs and the City of London. |

**Risk table (all rated Very High in Version 14)**

| Risk | L / I | First thing to do |
|---|---|---|
| Surface water flooding (p.37) | 3 / 4 | Basement or ground-floor flat? Flood warnings and a "what goes up first" list |
| High temperatures and heatwaves (p.35) | 3 / 4 | Find your coolest room; plan for neighbours in top-floor flats |
| Fires in high-rise flats (L54a, p.9) | 4 / 4 | Know your building's fire strategy and two ways out |
| National electricity failure (p.8) | 3 / 5 | Torch, radio and power bank; how you'd get down without a lift |
| Low temperatures and snow (p.36) | 4 / 4 | Warm-room plan |

**Plan order:** flood → heat → evacuation → power → water. The high-rise fire risk is unique to London among the five and gives this page facts no other page has.

**Power and water:** UK Power Networks for most of London ([PSR](https://www.ukpowernetworks.co.uk/power-cut/priority-services-register)); SSEN in parts of west London; 105 routes to the right one. Water: Thames Water, Affinity Water, Essex & Suffolk Water or SES Water, via [Find your supplier](https://www.water.org.uk/advice-for-customers/find-your-supplier/).

**Past event:** 12 July 2021 flash floods, more than 1,000 flooding calls to London Fire Brigade across south-west and north-west London ([LFB](https://www.london-fire.gov.uk/incidents/2021/july/flooding-south-west-and-north-west-london)).

**Radio:** BBC Radio London (94.9 FM).

**Search check:** "power cut what to do" is a mix of hoa.org.uk, Selectra and borough pages, an opening. "Flooding how to prepare" is mostly london.gov.uk, hard. "Emergency plan" is muddied by London, Ontario.

**Reserve, West Yorkshire:** [2025 register](https://www.westyorkshireprepared.org.uk/wp-content/uploads/2025/10/3806-Community-Risk-Register-DIGITAL-FINAL-1.pdf) (no ratings), Northern Powergrid, Yorkshire Water, Boxing Day 2015 floods (Calderdale: more than 2,000 residents flooded), BBC Radio Leeds.

---

### 3.5 Lincolnshire · `/local/lincolnshire/`

| | |
|---|---|
| Title tag | Lincolnshire emergency plan: local risks explained |
| H1 | Lincolnshire emergency plan: what the local risks mean for your home |
| Answer line (draft) | Lincolnshire's resilience forum lists coastal flooding first among its local risks, and about 220,000 people in the county live in the coastal zone. |
| Register | No current CRR published. Use the [LRF risks page](https://www.lincolnshireresilienceforum.org/risks/) (updated 15 Jul 2026, 9 risks, unrated) plus the [fire service Community Risk Profile 2020–24](https://www.lincolnshire.gov.uk/downloads/file/4817/lfr-community-risk-profile) (flooding and severe weather "high", p.36; coastal zone figures, p.18). System: unrated. |
| LRF | [Lincolnshire Resilience Forum](https://www.lincolnshireresilienceforum.org/), [contact page](https://www.lincolnshireresilienceforum.org/contact-us/) (the GOV.UK entry lists a named officer's email; don't publish that) |
| Councils | Lincolnshire County Council and Boston, East Lindsey, City of Lincoln, North Kesteven, South Holland, South Kesteven and West Lindsey. North Lincolnshire and North East Lincolnshire are in the [Humber LRF](https://humberlrf.gov.uk/). |

**Risk list (as the LRF lists it; no ratings)**

| Risk | How it's described | First thing to do |
|---|---|---|
| Coastal flooding | First on the LRF list; "high" in the register (fire service profile) | Know your evacuation route and where you'd stay |
| River, surface water and groundwater flooding | Listed; "high" | Flood warnings for your postcode |
| Loss of gas or electricity | Listed | Torch, radio, power bank; PSR if needed |
| Extreme cold | Listed | Warm-room plan |
| Heatwave | Listed | Coolest room, shaded windows |

**Plan order:** flood → evacuation → power → cold → water.

**Power and water:** NGED East Midlands for most of the county (105; PSR). Parts of the north may be on Northern Powergrid; 105 routes you either way. Anglian Water ([priority services](https://www.anglianwater.co.uk/help-and-advice/extra-support/priority-services/)).

**Past events**
- **Wainfleet, June 2019:** the Steeping River relief channel bank breached on 12 June. 88 properties flooded inside and 580 homes were evacuated, about 1,000 people ([county council Section 19 report, Feb 2020](https://www.lincolnshire.gov.uk/downloads/file/3483/wainfleet-flood-investigation-report)).
- **Storm Babet, Oct 2023:** almost 700 properties flooded inside ([county council, 6 Dec 2023](https://www.lincolnshire.gov.uk/news/article/1699/extra-4m-allocated-for-flood-investigations-and-alleviation)).

**Radio:** BBC Radio Lincolnshire (94.9 FM); North Lincolnshire is BBC Radio Humberside.

**Search check:** "power cut" is all Selectra. "Emergency plan" and "flooding how to prepare" are scattered parish and council pages, a good opening.

**Action now:** email the LRF via its contact page asking for the current Community Risk Register. If it arrives before build, switch the page to the scored format.

---

## 4. Build plan (matched to the repo)

### Files

| File | Change |
|---|---|
| `src/content.config.ts` | Add the `local` collection (section 2) |
| `src/content/local/*.yaml` | 5 files, hand-entered and sourced |
| `src/pages/local/[slug].astro` | The page template. Article (Person author) and BreadcrumbList JSON-LD inline, the same pattern as PostLayout.astro |
| `src/pages/local/index.astro` | Hub: method, sources, the 5 areas, the not-affiliated line |
| `src/components/LocalSignup.astro` | Direct MailerLite post (`EMAIL_FORM.action`, as on the quiz results page) with hidden `fields[local_area]` and the consent field. Fires `track('local_email_submitted', { lrf })` |
| Pack card on the page | `data-pack-cta="local-<slug>"`, so BaseLayout tracks it with no new code |
| `src/pages/og/[...slug].png.ts` + `src/lib/og/pages.js` | Add the local pages, or they get no OG image |
| `src/pages/blog/index.astro` | A "Local guides" section |
| `src/components/Footer.astro` | One "Local guides" link (no list of areas) |
| `what-to-do-in-a-flood-uk.mdoc`, `how-to-prepare-for-a-power-cut-uk.mdoc`, `free-emergency-plan-template.astro` | One contextual link to /local/ each |
| `src/pages/about.astro` (recommended) | Short author page; the byline links to it |

The sitemap picks the pages up automatically. **Out of scope for the test:** the data script, postcodes.io, live flood warnings, the header nav item, flood-warning emails to area groups.

**Source watching and fact checks:** see `plans/2026-10-14-local-pages-automation.md`. Every fact in the YAML carries its source URL and quote. A weekly GitHub Action opens an issue when a register, link or quoted figure changes. Push checks cover the build, links and similarity. That plan adds 3 h net, and the session table below includes it.

### Sessions

| Session | Work | Hours |
|---|---|---|
| 1 | Collection (with fact anchors and watches), `_national.yaml`, template, hub, OG wiring, Cumbria end to end. Screenshot at 390px and 1280px | 3.5 |
| 2 | Nottinghamshire with your note; signup component and tracking tested in GA4 DebugView; `check-sources.mjs` with tests | 5 |
| 3 | Devon/Cornwall and London | 3 |
| 4 | Lincolnshire, contextual links, footer and blog section, About page; both GitHub workflows and the failure drill | 3.5 |
| 5 | Verification: `npm run check:sources`, review the 👁 items, read-through; Search Console submit | 1 |
| **Total** | | **16** |

### Before session 1 (you, about 30 minutes)

- [ ] Byline: "Martin" or "Marcin Lewandowski"? It goes in the schema and on the About page.
- [ ] Notts CRR p.11: read the likelihood scores by eye.
- [ ] Email Lincolnshire LRF for the current register.
- [ ] MailerLite: create the `local_area` field and one automation (template plus that area's top 3 actions, pack email 3 days later). Check `PUBLIC_MAILERLITE_ACTION` is set in production, or every signup form on the site stays hidden.
- [ ] Repeat the 15 searches in a UK private window; swap an area if gov.uk fills all five slots for every term.
- [ ] Confirm London over West Yorkshire.

### Build-day checks (couldn't open on 14 Oct; once the YAML is entered, `check:sources` covers these)

- EA dataset licence and attribution text: copy it in full from the dataset page.
- ONS LAD→LRF lookup licence (only matters if council lists come from it; hand-written sentences don't).
- City Hall URLs for London (the site was in maintenance).
- BBC radio frequencies on BBC pages (only Wikipedia was checked).
- Northern Powergrid and SSEN priority register URLs (they failed to load).

---

## 5. Gate (adjusted)

The thresholds stay as the spec set them. The dates move with publishing:

- Indexing check: 3 weeks after the last page is live (around 29 Nov if all are live by 8 Nov).
- Decision: 11 weeks after the last page is live (around **23 Jan 2027**).
- Also record per area: which register system (labels, scores, unrated) and whether Selectra still holds the power cut query. That tells you whether rated registers convert better, which matters for the 38-LRF rollout.

## Sources

- [Nottingham & Nottinghamshire CRR, 2025 edition](https://www.nottinghamcity.gov.uk/media/sybbyfav/nottingham-nottinghamshire-community-risk-register-v901-november-2025.pdf)
- [Cumbria CRR, reviewed 28 Sep 2026](https://cumbriaprepared.org.uk/sites/default/files/13850690/2026-10/Cumbria%20Community%20Risk%20Register%20Public%20Version%20%282%29.pdf)
- [DCIoS CRR 2024](https://www.dcisprepared.org.uk/media/pddjjp3s/2024-devon-cornwall-and-isles-of-scilly-community-risk-register.pdf)
- [London Risk Register, Version 14](https://www.london.gov.uk/media/109576/download)
- [Lincolnshire Resilience Forum: risks](https://www.lincolnshireresilienceforum.org/risks/)
- [Lincolnshire Fire and Rescue Community Risk Profile](https://www.lincolnshire.gov.uk/downloads/file/4817/lfr-community-risk-profile)
- [West Yorkshire CRR 2025](https://www.westyorkshireprepared.org.uk/wp-content/uploads/2025/10/3806-Community-Risk-Register-DIGITAL-FINAL-1.pdf)
- [GOV.UK: LRF contact details](https://www.gov.uk/guidance/local-resilience-forums-contact-details) (updated 11 Feb 2026)
- [National Risk Register 2026](https://www.gov.uk/government/publications/national-risk-register-2026)
- [Resilience Action Plan 2026 implementation report](https://www.gov.uk/government/publications/the-uk-government-resilience-action-plan-2026-implementation-report/the-uk-government-resilience-action-plan-2026-implementation-report-html)
- [Met Office: Storm Goretti key stats](https://www.metoffice.gov.uk/blog/2026/storm-goretti-key-stats-from-the-multi-hazard-event)
- [NGED storm summary](https://powercuts.nationalgrid.co.uk/storm-summary)
- [Storm Goretti urgent question, 13 Jan 2026](https://westminsterbrief.co.uk/archive/debate/13-january-2026/storm-goretti-6f1a)
- [ScottishPower: SP Electricity North West](https://www.scottishpower.com/news/pages/new_look_for_sp_electricity_north_west.aspx)
- [Met Office: Storm Desmond](https://weather.metoffice.gov.uk/warnings-and-advice/uk-storm-centre/storm-desmond)
- [Wainfleet flood investigation report](https://www.lincolnshire.gov.uk/downloads/file/3483/wainfleet-flood-investigation-report)
- [LFB: July 2021 flooding](https://www.london-fire.gov.uk/incidents/2021/july/flooding-south-west-and-north-west-london)
- [Search Atlas: FAQ rich results](https://searchatlas.com/news/faq-rich-results-are-dead-google-wants-control-of-the-answer-layer/)
