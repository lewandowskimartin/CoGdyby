# PreparedBritain: what to learn, and how we win on Google and with visitors

*15 Oct 2026. Sources: their homepage, sitemap, /guides, /areas, /about, the compensation guide and the Nottingham power-cut page, all fetched today. Our side: live sitemap and repo `test-2` (1fdc54d). Search checks used a search tool, not Google UK, so treat them as a rough guide.*

---

## 1. What they are now

| | PreparedBritain | Prepared at Home |
|---|---|---|
| Indexed pages (sitemap) | **505+** (the file is cut off mid-entry, so likely more) | **35** |
| Guides | 140 | 18 |
| Kit/review pages | 120 categories + 105 reviews | 7 kit builders |
| Local pages | ~99 town power-cut pages + 23 "area dossiers" | /local/ (Cumbria live, more planned) |
| Tools | 14 kit builders, compensation calculator, cold-weather payment checker, money check | quiz, kit builder |
| Author | "Tom Calder", described as their **editorial name**; founder Tom Rowland | Organization only, **no About page** |
| Money | Amazon affiliate, **AdSense**, **sponsored posts** ("Advertise with us"), shop (Home Pack £14.99) | pack £14.99, course, Amazon affiliate |
| Freshness | "Checked 15 Oct 2026" in the header, "What's changed" notes, dated sources | **0 of 18 posts carry an updated date** |
| Founded | 2026 (sitemap lastmod from 18 Jul 2026) | 2026 |

**Their engine is volume plus freshness.** Trackers refresh every few hours, town pages are generated from live feeds, and there are dozens of brand-vs-brand power-station comparisons. We can't and shouldn't match that at 5–8 hours a week.

## 2. Where they're strong (learn from it)

1. **Visible freshness on every page.** "Checked 15 Oct 2026" in the header, a dated "What's changed" box on guides, and source lists with check dates. Google and readers both read this as care.
2. **Sources as a feature.** The compensation guide cites 12 sources (Ofgem, legislation.gov.uk, DNO pages, NI), each with a check date. It covers Northern Ireland separately.
3. **One answer, then a tool.** The guide gives the figure, then links "Work out what you're owed" to a calculator. Every guide hands off to something useful.
4. **Breadcrumbs and hubs.** Home › Guides › Money & bills, and category hubs (/guides#power, /kit#water).
5. **Trust pages:** How we test, Corrections, About, Affiliate disclosure, Press and data.
6. **Google "preferred source" link** in the footer, pointing at Google's source-preference setting. Free to add.

## 3. Where they're weak (our openings)

1. **Plans, not stuff.** Of 140 guides, only **one** is about making a household plan. They have nothing on a plan template, ICE cards, what to tell children, a documents checklist, neighbours, or planning for older relatives (only a kit builder and a benefits guide). That is exactly what we sell, and who we sell to.
2. **No real author.** "Tom Calder" is a pen name. Google's guidance on YMYL topics (safety, money) favours real, accountable people. **Martin is a real, named designer**, and that only counts once it's on the site.
3. **Tone drift.** Small-boats tracker, a plague explainer, "war register", "nuclear bunkers" and "conscription". These catch news traffic but cut against "calm, not doom". Our calm, family-first voice is clearer.
4. **Ads and advertorials.** AdSense plus labelled sponsored guides (e.g. a gravity water filter). That's fine for revenue, but it dilutes trust for a mum planning for her parents.
5. **Templated local pages.** The Nottingham page is one live feed line plus copy that reads the same for any town, and its "nearby" list shows Cornwall and Cardiff. Their area dossiers cover crime, utilities and live status, **not the Local Resilience Forum's risk register**. Our /local/ pages answer a different and better question: "what are the official risks here, and what should my household do?"
6. **Heavy pages.** Mega-menus put 100+ links on every page. Our static Astro pages are lighter. Check Core Web Vitals in Search Console to confirm, then keep it that way.
7. **Technical:** their sitemap is one 505-URL file and was truncated when fetched (no closing tag). Not our problem, but it's a reminder to keep ours as a valid index.

## 4. What this changes in our content plan (14 Oct)

They already have **deep guides on three of the four posts** we planned:

| Planned post | Their coverage | New call |
|---|---|---|
| Power cut compensation | 1,800–2,000 words, 12 sources, calculator, NI section, updated 29 Sep | **Downgrade.** Add a short, sourced compensation section to `what-to-do-during-a-power-cut-uk` linking Ofgem. Write a full post later only if Search Console shows impressions for it. |
| Broadband or mobile down | **None found** (only the PSTN switch-off) | **Move to first.** Open SERP: ISP blogs, forums, Selectra. |
| Portable power station | ~10 deep guides (sizing, CPAP, fridge freezer, gas boiler, 6+ brand comparisons) | **Drop as a pillar.** At most, a short "most homes don't need one" section in the power cut prep post, with the power-bank alternative. |
| Food safe after a power cut | Has a guide | **Drop the new post.** Strengthen the food section in `what-to-do-during-a-power-cut-uk` instead. |

## 5. The strategy: own the plan, not the shopping list

Win the **household plan** cluster, where they are thin and our product sits, plus **local risk pages**, where our angle is unique. Search check today: "household emergency plan template UK" returns almost all council PDFs (Wyre Forest, Doncaster, North Devon, Nottingham City, Reigate and Banstead). "Emergency plan for elderly parents UK" returns an Indian care blog, a telecare seller and forums. Both are weak results that a well-designed UK page can beat.

### New priority pages (replacing the downgraded posts)

| # | Page | Intent | Why we win | Converts to |
|---|---|---|---|---|
| 1 | **Household emergency plan template (UK)**, an HTML guide with a free **one-page** printable plan (ungated) | Template | Current results are plain council PDFs; a designed page plus an instant printable beats a Word doc | Pack (the full 12-page version) |
| 2 | **Emergency plan for elderly parents** (guide, distinct from the /elderly-parents/ sales page) | Plan for someone else | Weak results; it's our core audience; links PSR, landline switchover, local pages | Pack + Parents' Edition idea |
| 3 | **Broadband or mobile down: what to do** (from the 14 Oct plan) | In the moment | No PB guide; weak results | Kit builder, quiz |
| 4 | **ICE cards: what to write and where to keep them** | Quick how-to | PB has nothing; it's a page in our pack | Pack |
| 5 | **Talking to children about emergencies** (calm, age-banded) | Parents | PB has only a baby/power-cut guide | Families page, pack's children's version |
| 6 | **Important documents checklist: what to keep together** | Checklist | PB has nothing; it's quiz q8 | Pack |
| 7 | **A neighbour check-in plan** (ties to Ready Together) | Community | PB has nothing; timely | Pack, local pages |

Check volumes in Search Console or a keyword tool before writing. The ranking evidence above is a SERP check, not volume.

### Fix the template-intent mismatch
`/free-emergency-plan-template/` is ranked on "template", but it's an email-gated **fridge card**, not a plan template. Either:
- (a) add the free ungated one-page plan to that page and keep the fridge card as the email offer, or
- (b) build page 1 at its own URL and retitle the current page around the fridge card.

**(a) is less work and uses the URL that already has the keyword.** Respect the rule that hi-res fridge card images are never served.

## 6. Site-wide fixes (do these regardless; each is small)

| Fix | Why | Effort |
|---|---|---|
| **Author = a real Person with an About page.** Switch `PostLayout.astro` and `local/[area].astro` JSON-LD from `Organization` to `Person` (with `url` to /about/) once the page exists | YMYL trust. Their author is a pen name; ours would be real. The local pages plan already flagged that there's no About page | 1–2 h (you decide name and photo) |
| **Updated dates on posts.** `updatedDate` is already in the schema and layout, but no post uses it. Add it when a post is re-checked, and show "Checked [date]" near the sources | Freshness for readers and Google; matches PB's strongest habit honestly | 15 min per post as part of re-checks |
| **"Sources and checks" block** at the end of each guide: the 3–6 official sources with check dates | Trust; their compensation page does this well | Template once, then per post |
| **Hubs:** make /blog/ group headings real sections ("Power cuts and winter" etc.) with an intro line each, and link each group from the homepage | Topical clusters; matches their hub structure without the mega-menu | 1–2 h |
| **Google "preferred source" link** in the footer (check the feature is live for UK users first) | Free; PB does it | 10 min |
| **Correction line:** "Spotted an error? Email hello@… and we'll fix it" in the post footer | Trust; cheap | 10 min |
| **Keep pages light.** No mega-menu, no ads. Check Core Web Vitals in Search Console | A real edge over their 100+ link pages | Check only |

## 7. What not to copy
- **Live trackers, AdSense, sponsored posts, brand-vs-brand affiliate farms.** Heavy maintenance and trust cost. They own that ground.
- **War, plague and conscription explainers.** They get news spikes but are off-brand for a calm, family product.
- **Town pages generated from a feed.** Our local pages work because they're hand-checked against the LRF register. Keep it that way (the local pages plan already has source-watching).

## 8. Order of work (fits 5–8 h a week)
1. **This week:** About page + Person schema; footer correction line and preferred-source link; add `updatedDate` to posts as you re-check them.
2. **Next:** page 1 (plan template on `/free-emergency-plan-template/`) and page 2 (elderly parents guide).
3. **Then:** broadband/mobile post; the compensation and food sections folded into existing posts.
4. **Rolling:** local pages per the 14 Oct plan; pages 4–7 one a week.
5. **Measure in Search Console after 6–8 weeks:** impressions on "template", "elderly parents" and "broadband down" queries; CTR on pages with the new dates and author.

## Sources
- [PreparedBritain homepage](https://www.preparedbritain.co.uk/)
- [PreparedBritain guides index](https://www.preparedbritain.co.uk/guides)
- [PreparedBritain: power cut compensation guide](https://www.preparedbritain.co.uk/guides/power-cut-compensation)
- [PreparedBritain: Nottingham power cuts](https://www.preparedbritain.co.uk/trackers/power-cuts/nottingham)
- [PreparedBritain: area dossiers](https://www.preparedbritain.co.uk/areas)
- [PreparedBritain: about](https://www.preparedbritain.co.uk/about)
- [PreparedBritain sitemap](https://www.preparedbritain.co.uk/sitemap.xml)
- [Prepared at Home sitemap](https://preparedathome.co.uk/sitemap-0.xml)
