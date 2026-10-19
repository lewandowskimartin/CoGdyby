# Social Plan — Facebook & Pinterest

> Prepared at Home · written 30 September 2026 against the local build (127.0.0.1:4321)
> Audience: women 25–65 in the UK who run the household admin. Voice: calm, practical, sourced. No fear.

---

## 1. What the build tells us (and what it needs before posting)

The site is in good shape for social: five clean link targets, a no-sign-up quiz, a free sample, a £14.99 pack and a course in Early Access until 14 October. The voice is consistent everywhere and the palette (cream, terracotta, espresso, Fraunces) is distinctive enough to be recognisable in a feed.

| What's there | Why it matters for social |
|---|---|
| Quiz: 10 questions, no sign-up, instant score, results page with three gaps and a free fix each | Best top-of-funnel link. Passes Pinterest's "quality landing page" rule (no gate before content). |
| Free sample: fridge card by email, separate tick box for marketing | Second-best link. Pins must say "free download by email" so the email step isn't a surprise. |
| Pack page: 12 pages listed by name, "why pay when gov.uk is free" answered honestly | The page-by-page list is a ready-made carousel. |
| Early Access: £29, £79 after launch, 30 seats, closes 14 Oct, 30-day guarantee, founder note | Two weeks left. This is Facebook's job, not Pinterest's (pins take 4–12 weeks to gain traction). |
| 15 guides, each with an end-of-article course box | Guides feed Pinterest checklists and Facebook value posts. |
| `?src=` tagging on Early Access links | Extend the same idea to every social link so you can see which post sold what. |

Gaps that will hurt social if left:

1. **Homepage hero is a blank placeholder.** The printed pack is the single most important social asset. Photograph the real printed pack (Photography Guide doc) before the first pin goes out. Pinterest ranks on visual quality; a mockup won't do it.
2. **No per-page OG images.** Every Facebook share of the quiz, free sample or Early Access page will show a generic preview. Facebook link previews are the ad. Four OG images (home, quiz, free sample, early access) before posting.
3. ~~**Quiz results page has no course link and no share button.**~~ **Done (30 Sep 2026).** The results page now carries a segmented Ready in 30 card on every band: 0–35 gets it above the £14.99 pack as the main ask, 40–70 and 75+ get a lighter version below the pack (gap-filling and family-handover angles). Each links to `/early-access?src=quiz-<band>`, so GA and PostHog show which band buys seats. After the 14 October close the card stays and swaps itself to the £49 early-bird tier rather than disappearing. A "Share your score" button sits under the gauge: Web Share on mobile, clipboard on desktop, selectable field if the clipboard is blocked, firing `quiz_share` with method, band and score. The shared link is the quiz page with `?src=share` — never the results URL, which would hand over the visitor’s own answers.
4. **Pack checkout.** Confirm every "Get the pack" CTA points at the live Payhip URL (the fix-later list still had `href="#"`).
5. ~~**Substantiation.** The Early Access page cites Storm Isha (45,000 homes, 30+ hour outages).~~ **Done (30 Sep 2026).** The unverifiable Storm Isha figures were replaced on the Early Access page with three claims that each carry a primary source and a numbered footnote: Storm Arwen outage durations (Ofgem final report), the Brixham boil-water notice (Drinking Water Inspectorate), and the GOV.UK Prepare guidance plus the 2026 preparedness survey. Those four sources are the only figures cleared for posts.

---

## 2. Strategy

### The split

- **Pinterest = evergreen traffic.** Quiz, free sample, guides, pack. Pins posted in October rank for winter (Pinterest wants seasonal content 30–60 days ahead) and keep sending clicks through 2027. Nothing about the 14 October deadline goes on Pinterest.
- **Facebook = the two-week window plus community.** Course posts, the founder's own voice, shares from your personal profile and value posts in groups. After 14 October, Facebook drops to two posts a week and becomes the "share this with your mum" channel.

### The honest bit about Facebook

A new Facebook page has zero reach. Link posts get the lowest reach of any format (about 0.05% engagement vs 0.20% for plain text posts and albums leading on views and shares, per Socialinsider's 2026 benchmarks). So on Facebook the plan is: post native (photo, album or text), put the link as the last line of the caption and pinned in the first comment, and get distribution from three places that aren't the page itself: your personal profile, a handful of UK groups where a genuinely useful post is welcome, and shares of the two most shareable posts (the fridge card and the five numbers). Organic Facebook will not sell 20 course seats in 14 days from a cold start. The seats come from the existing list, quiz traffic and people who already know you. Facebook's job for the course is to give those people a reason and a link.

The Launch Campaign Plan ruled out Facebook ads. I'd keep that for the course (don't cold-sell £29 to strangers) but revise it for one thing: a £30–50 boost on the quiz post to UK women 30–60 is cheap email capture and worth a test after the first week of organic data.

### The audience insight

Women 25–65 running a household don't want to be told the world is dangerous. They want the admin done so they can stop thinking about it. Every post sells one of two feelings: **done** ("one evening, sorted, on the fridge") or **looked after** ("Mum's fridge has the plan on it even when I'm not there"). The scenario is always boring and British: a power cut, a storm, a boiler out, a burst pipe. The reference point is always gov.uk. The visual is always a kitchen, never a bunker.

### What the government survey hands you

The GOV.UK 2026 Public Survey of Risk Perception, Resilience and Preparedness is your content calendar. Headline findings: 13% said their household was largely or totally prepared; 14% had a household plan; 4% had three or more days of bottled water; 53% owned a torch; 14% had visited GOV.UK/Prepare and 74% of those acted on it. The barriers people named: not enough money (29%), worry about waste (25%), not knowing enough (23%). Those three barriers map directly to three posts below (cheap ways, keep what you'd use anyway, the quiz). Every number is sourced and calm. Use them precisely and link the source.

### Funnel map

| Post links to | Job | Platform lead |
|---|---|---|
| Quiz | Traffic, segmentation, email (results link) | Both |
| Free sample (fridge card) | Email capture, the "share this" object | Pinterest |
| Guides | Pinterest search traffic, trust | Pinterest |
| The pack (£14.99) | Revenue, portfolio proof | Pinterest, Facebook album |
| Early Access (£29, to 14 Oct) | Course validation | Facebook only |

---

## 3. Creative system (so ten posts look like one brand)

Four templates. Everything below is one of these.

| Template | What it is | Where |
|---|---|---|
| **A. Paper Object** | Photo of the real printed page or card in a real kitchen: fridge door, kitchen table, under the stairs. One line of Fraunces over cream or over the photo. | Pinterest hero pins, Facebook photo posts |
| **B. Plain Type** | Cream background, one sentence in Fraunces (sentence case), a small terracotta caption line, source in IBM Plex Mono at the bottom, URL bottom right. No image. | The "typography" posts. Facebook feed and Pinterest. |
| **C. Checklist Card** | Five to seven items with tick boxes, a title, a one-line source. Designed to be screenshotted and saved. | Pinterest workhorse. Facebook photo post. |
| **D. Carousel** | Cover, four to six slides, closing slide with CTA and URL. Slide 2 must earn the swipe on its own. | Facebook albums (best organic format for views and shares), Pinterest carousel pins (up to 5 cards). |

Rules across all four: sentence case, no exclamation marks, no red, no sirens, no torch-lit faces, no stock disaster photography, no countdown graphics, no clocks. Terracotta is the only accent. The acorn mascot can appear in template B and C as a small corner mark, never as the subject. Real hands, real fridges, real school letters and magnets in shot.

Specs: Pinterest 1000×1500 (2:3); Facebook single image 1080×1350 (4:5); Facebook album slides 1080×1080; Pinterest carousel cards 1000×1500. Text on Pinterest images: 6–10 words in the headline, readable at thumbnail size. Pin title 40–60 characters with the search phrase in it (for example "UK power cut checklist"), description one sentence of context, one benefit, the URL, two to four specific hashtags.

Link tagging: Early Access already supports `?src=`. For everything else use `?utm_source=pinterest&utm_medium=social&utm_campaign=oct26&utm_content=p03` (and `facebook`). Then both Pinterest Analytics, Facebook Insights and Cloudflare/GA4 agree on what worked.

---

## 4. The posts

Ten posts plus one seasonal. Each has: format, platform, headline, copy, visual, link, and the Facebook text-only version. Copy is written in the site voice and is ready to use; swap the URLs for production ones.

### Post 1 — The quiz (Plain Type)

**Platform:** Both. Facebook first post, pinned.
**Headline on image:** How prepared is your household?
**Caption line:** Ten questions, two minutes, no sign-up. A score out of 100 and your three biggest gaps, each with a free fix.
**Source line (mono):** Based on the GOV.UK Prepare guidance · independent, not affiliated
**Link:** /household-preparedness-quiz
**Pinterest title:** How prepared is your household? Free 2-minute UK quiz
**Pinterest description:** A quick self-check based on the official gov.uk Prepare guidance. Score out of 100, your top three gaps and a free fix for each. No sign-up. preparedathome.co.uk/household-preparedness-quiz

**Facebook text post:**
> Quick one. Out of 100, how prepared would you say your household is for a power cut that lasts a day? Have a guess before you look.
>
> Then take the two-minute quiz and see how close you were. Ten questions, based on the gov.uk Prepare guidance, no sign-up, nothing stored. It tells you your three biggest gaps and a free fix for each.
>
> Link in the first comment. Feel free to put your number below.

### Post 2 — Three numbers from the government survey (Plain Type, or 3-slide carousel)

**Platform:** Both.
**Slide/line 1:** 13% of people say their household is largely or totally prepared for an emergency.
**Slide/line 2:** 14% have a written household plan. 4% have three days of water put by.
**Slide/line 3:** The people surveyed said the main things stopping them were money, worrying about waste and not knowing enough. All three are fixable in an evening.
**Source line:** UK Public Survey of Risk Perception, Resilience and Preparedness, 2026 · GOV.UK
**Link:** /household-preparedness-quiz
**Pinterest title:** How prepared are UK households? The 2026 government survey in three numbers

**Facebook text post:**
> I read the government's 2026 preparedness survey so you don't have to. Three numbers stayed with me.
>
> 13% said their household was largely or totally prepared. 14% had a written plan. 4% had three days of water.
>
> What I found reassuring is why people said they hadn't done more: money, worry about waste and not knowing enough. All three come down to nobody having shown you where to start.
>
> Start here: the two-minute quiz. Link in the comments, survey linked there too.

### Post 3 — The fridge card (Paper Object)

**Platform:** Pinterest lead. Facebook photo post.
**Visual:** The printed fridge card on a real fridge, held by an ordinary magnet, next to a school letter and a child's drawing. Filled in by hand with dummy details. Warm daylight.
**Headline on image:** The one page your household will actually use
**Caption line:** UK emergency numbers, your meeting point, where the water and gas turn off. Free to print.
**Link:** /free-emergency-plan-template
**Pinterest title:** Free printable UK emergency fridge card (999, 111, 101, 105, gas)
**Pinterest description:** A printable fridge card with the UK emergency numbers, your meeting point and your shut-off locations. Fill it in and pin it up. Free download by email at preparedathome.co.uk/free-emergency-plan-template

**Facebook text post:**
> Ours is on the fridge between the school letters. Five numbers on it: 999, 111, 101, 105 for a power cut and 0800 111 999 if you smell gas. Underneath: where we meet if we have to leave, and where the stopcock is, because I couldn't have told you that a year ago.
>
> It's the first page of our household plan and it's free. Print it, fill it in with a pen, stick it up. Link in the comments.

### Post 4 — What's in the pack, page by page (Carousel)

**Platform:** Facebook album, Pinterest carousel (5 cards: cover + 4).
**Cover:** The twelve pages fanned out on a kitchen table. "Twelve pages. One evening."
**Slides:** 01–03 Start here (how to use it, in an emergency, the numbers) · 04–06 Your household (who lives here, who to call, where we meet) · 07–08 Shut-offs and grab bag · 09–10 Medication, documents, Priority Services Register · 11–12 Children's version and ICE cards
**Closing slide:** £14.99. Print as many copies as you need. preparedathome.co.uk
**Link:** homepage pack section
**Pinterest title:** UK household emergency plan pack: what's on all 12 pages

**Facebook text post:**
> What's actually in the pack, page by page, for anyone who's asked.
>
> Pages 1–3 are the numbers and what to do first. 4–6 are who lives here, who we'd call, where we'd meet. 7 is where the water, gas and electric turn off. 8 is the grab bag list. 9 and 10 are medication, documents and the Priority Services Register. 11 is the children's version, 12 is the wallet cards.
>
> Fill it in once at the kitchen table. It's £14.99 and you print as many as you like. Link in the comments.

### Post 5 — The grab bag under the stairs (Carousel)

**Platform:** Both.
**Cover:** A normal rucksack in an under-stairs cupboard, door open. "A grab bag that fits under the stairs"
**Slides (one item group each, from the guide):** Documents and cash · Medication and glasses · Light and charging (torch, power bank, spare batteries) · Warmth (blanket, layers) · Water and something to eat · The children's bit (a small comfort, a copy of the plan)
**Closing slide:** Full checklist in the guide. preparedathome.co.uk
**Link:** /blog/uk-emergency-grab-bag-checklist
**Pinterest title:** UK emergency grab bag checklist: what to pack (gov.uk based)

**Facebook text post:**
> Ours is a rucksack under the stairs. Here's what's in it and, more usefully, what we took out.
>
> In: copies of documents, a bit of cash, a week of medication, spare glasses, a torch and a power bank, a blanket, water, a few snacks and a small thing each for the kids.
>
> Out: the multi-tool nobody knows how to use, the tinned food with no opener, and the survival guide that weighs a kilo.
>
> Full checklist, based on the gov.uk grab bag list, in the comments.

### Post 6 — Power cut, sorted in one drawer (Checklist Card)

**Platform:** Pinterest lead (post now for November–February search). Facebook photo post in late October.
**Title on card:** A power cut, sorted in one drawer
**Items:** ☐ A torch and spare batteries ☐ A power bank, kept charged ☐ 105 written down (England, Scotland and Wales; Northern Ireland 03457 643643) ☐ Know where your fuse box is ☐ Keep the fridge and freezer shut ☐ A blanket and a flask
**Source line:** From the gov.uk Prepare guidance and your network operator · guide at preparedathome.co.uk
**Link:** /blog/what-to-do-during-a-power-cut-uk
**Pinterest title:** UK power cut checklist: what to have ready and who to call

**Facebook text post:**
> 105 is the number for a power cut in England, Scotland and Wales. Free, from any phone, it puts you through to your network operator rather than your supplier. In Northern Ireland it's 03457 643643.
>
> Worth writing down somewhere that isn't your phone. Ours is on the fridge card. The rest of the power cut list (torch drawer, power bank, fridge shut) is in the comments.

### Post 7 — For the fridge at Mum's (Paper Object)

**Platform:** Both. The emotional centre of the plan for the 45–65 half of the audience.
**Visual:** The fridge card on an older relative's fridge: reading glasses on the counter, a landline handset, a calendar. Filled in.
**Headline on image:** For when you can't be there
**Caption line:** The plan on your parents' fridge means everyone knows what to do, without you having to hover.
**Link:** /elderly-parents
**Pinterest title:** Emergency plan for elderly parents: a fridge card everyone can read

**Facebook text post:**
> If your parents live a drive away, this is the page we'd start with. It goes on their fridge. It has the numbers, who to call, where they'd go and where the stopcock is. Large type, filled in by hand, so it works when the phone's flat and the Wi-Fi's off.
>
> There's a Priority Services Register page too. It's a free register with the energy and water companies for anyone who'd need extra help in an outage, and not many people know it exists. Link in the comments.

### Post 8 — Ready in 30 (Carousel, Facebook only, run 1–14 October)

**Cover:** A kitchen table, a mug, one printed page. "Ready in 30. One step a week."
**Slides:** Week 0: the 20-minute audit · Week 1: water, heat, light · Week 2: food, medication, cash · Week 3: comms and the family plan · Week 4: run one drill, print the plan, done
**Offer slide:** Early Access for the first 30 households: £29. £79 after launch. Closes 14 October, midnight UK. 30-day money-back guarantee from the day the course opens.
**Link:** /early-access?src=fb-carousel

**Facebook text post (the founder note):**
> I'm Martin. I'm a dad, a dog owner and a former Scout, and "be prepared" stuck. When I went looking for help doing it at home, everything I found was American, tactical or trying to scare me. So I built the calm version for normal British families, and now I'm making it a course.
>
> Ready in 30 is five short weeks: audit, water and light, food and medication, the family plan, then one drill and a printed plan on the fridge. Short sessions at the kitchen table. Then back to normal life, which is the point.
>
> The first 30 households get in for £29 in return for honest feedback. It's £79 after launch. Early Access closes on 14 October at midnight, and there's a 30-day money-back guarantee from the day the course opens. Link in the comments.

**Closing post (Facebook text, 12–13 October):**
> Early Access for Ready in 30 closes Wednesday at midnight. After that the course is £49 in launch week and £79 at list. If you've been meaning to, this is the week. If it's not for you, the free quiz and fridge card aren't going anywhere. Link in the comments.

### Post 9 — Getting prepared without spending much (Checklist Card)

**Platform:** Both. Answers the "money" and "waste" barriers from the survey.
**Title on card:** Getting prepared without spending much
**Items:** ☐ Keep a few extra tins of what you already eat, and rotate them ☐ Fill bottles you already have ☐ The torch you already own, in one known drawer ☐ Write the five numbers on paper ☐ Join the Priority Services Register if anyone qualifies (free) ☐ Download the gov.uk plan (free) or our fridge card (free)
**Source line:** Guide: cheap ways to prepare · preparedathome.co.uk
**Link:** /blog/cheap-ways-to-prepare-for-emergencies-uk
**Pinterest title:** Cheap ways to prepare for emergencies in the UK (most cost nothing)

**Facebook text post:**
> In the government's survey, the top reason people gave for not preparing further was money, and the second was worrying about waste. Fair. So here's the version that costs almost nothing.
>
> Keep a few extra tins of what you'd eat anyway and rotate them. Fill bottles you already own. Put the torch you already have in one drawer everyone knows. Write five numbers on paper. If anyone at home would need extra help in an outage, the Priority Services Register is free.
>
> The full guide, including the bits worth spending a tenner on, is in the comments.

### Post 10 — The government plan is free. Why pay? (Carousel)

**Platform:** Both. The trust post.
**Cover:** "The gov.uk plan is free. So why pay £14.99?"
**Slide 2:** What the official template does well: the right advice, the right numbers, free, from gov.uk/prepare.
**Slide 3:** What it is: a Word document of about four pages, designed to be filled in on a computer.
**Slide 4:** What the pack adds: a fridge card, a grab bag checklist, a children's version, ICE wallet cards, utility shut-offs, the Priority Services Register, twelve pages designed to print and fill in by hand.
**Slide 5:** If the free one works for you, use it. Either way, start with the free fridge card.
**Link:** /free-emergency-plan-template
**Pinterest title:** Gov.uk emergency plan vs a designed household pack: an honest comparison

**Facebook text post:**
> Someone asked why they'd pay £14.99 when the government plan is free. Good question, and the honest answer is: you might not need to.
>
> The gov.uk template is sound. It's a Word document, about four pages, and it covers the basics. If you fill it in and keep it, you're ahead of most households.
>
> Ours takes the same advice and turns it into something that lives on the fridge: twelve printed pages, a fridge card, a grab bag list, a children's version, wallet cards. Design is the difference, and that's what we do.
>
> The fridge card is free either way. Link in the comments.

### Post 11 (seasonal bonus) — Clocks go back on 25 October: test the alarms

**Platform:** Pinterest from 1 October, Facebook on 24–25 October.
**Template:** Plain Type. "Clocks back on Sunday. Test the smoke alarms while you're up the ladder."
**Caption line:** A ten-second job the fire services ask for twice a year. Our home fire safety checklist has the rest.
**Link:** /blog/home-fire-safety-uk-checklist
**Legal note:** this is standard fire-service messaging and squarely "encouraging prudent behaviour", so it's the safest fear-adjacent post you can run.

---

## 5. Cadence, distribution and measurement

**1–14 October (course window).** Facebook: four posts a week in this order: 1, 8 (carousel), 3, 2, 8 (founder text), 9, 4, 10, 5, then the closing post on 12 or 13 October. Pinterest: publish every post above as pins (two or three visual variants each, so 25–30 pins), schedule two or three a day across the five boards from the Launch Campaign Plan, evenings and Sunday mornings.

**After 14 October.** Facebook: two posts a week, alternating value (checklists, guides) and product (pack, fridge card). Pinterest: one fresh pin a day from the batch, then one or two a week of new pins as guides publish. Re-pin 6 and 9 at the top of boards whenever a named storm is in the news; don't write new content for the news cycle.

**Distribution on Facebook.** The page posts. Your personal profile shares posts 1, 3 and 8 with a line of your own. Groups: pick three to five UK groups where members ask practical household questions (local community groups, parenting groups, allotment and thrifty-living groups, one preparedness group), read the rules, and post the text-only versions of 3, 6 and 9 with no link unless links are allowed; answer comments; let people ask for the link. That is the whole Facebook growth mechanism at this stage. A £30–50 boost on post 1 to UK women 30–60, run after the first week, is the only paid spend worth testing.

**Measure.** Pinterest: impressions, saves, outbound clicks per pin (saves predict future clicks). Facebook: reach, shares, link clicks by UTM. Site: quiz starts and completions, fridge card emails, pack sales, Early Access seats by `src`. Kill any pin variant under 0.5% click-through after four weeks; make more of anything above 1%.

---

## 6. Legal and platform check

Nothing in the plan breaks a rule as written. These are the lines to hold.

**Fear and distress (CAP Code rule 4.2).** Ads must not cause fear or distress without justifiable reason, and any fear must be proportionate. Encouraging prudent behaviour and product relevance both count as justifiable reasons, but the ASA has ruled against exaggeration: a health insurer claiming the NHS was "at breaking point" and a water filter ad run during a boil-water notice were both found to exaggerate risk. Practical rule for us: name real, past, sourced events only; never speculate about the next one; never use "this winter will…" as a hook. The guide title "Will the UK have blackouts this winter?" is fine as editorial; as a social hook, reframe it as "What NESO actually says about winter supply".

**Substantiation (CAP 3.7).** Every number in a post must have a source you can produce. The cleared list, as of 30 September 2026, is exactly these four:

- **Storm Arwen, Nov 2021** — over a million customers lost power; around 40,000 off supply for more than three days; nearly 4,000 for over a week. [Ofgem, final report on the networks' response to Storm Arwen, 9 June 2022](https://www.ofgem.gov.uk/research/storm-arwen-report)
- **Brixham, May 2024** — up to 16,000 homes and businesses on a boil-water notice after cryptosporidium entered the supply. [Drinking Water Inspectorate, South West Water enforcement outcome, 2 June 2026](https://www.dwi.gov.uk/2-june-2026-south-west-water-fined-a-record-1-853-million-for-drinking-water-failures-in-brixham/)
- **What GOV.UK asks of households** — be ready for an emergency lasting a few days; 2.5–3 litres of drinking water per person per day (WHO figure, quoted by GOV.UK). [GOV.UK Prepare, Get prepared for emergencies](https://prepare.campaign.gov.uk/get-prepared-for-emergencies/)
- **The 2026 survey** — 13% felt largely or totally prepared; 14% had a household plan; 4% had three or more days of bottled water; 53% had a torch. [GOV.UK, UK Public Survey of Risk Perception, Resilience and Preparedness 2026, headline findings](https://www.gov.uk/government/statistics/uk-public-survey-of-risk-perception-resilience-and-preparedness-2026/uk-public-survey-of-risk-perception-resilience-and-preparedness-2026-headline-findings-html) (fieldwork 27 February to 11 May 2026)

Anything not on that list does not go in a post until it has a named source with a date. The retired Storm Isha figures (45,000 homes, 30+ hour average outage) could not be traced to a primary source and must not be reused anywhere.

**Pricing and urgency (CAP 3.17, 3.39; DMCC Act 2024).** The ASA's savings-claims guidance says a scored-out future price is likely misleading unless the ad makes explicitly clear it is the intended future price. So "£29 ~~£79~~" on its own is out; "£29. £79 after launch." is in, and the £79 must then actually be charged. Don't say "save £50" (no established selling price). State the end date, and don't extend it after the fact: the DMCC Act carries over the banned practice of falsely claiming a product is available for a limited time to elicit an immediate decision, and the CMA can now fine directly (up to 10% of global turnover, though enforcement is aimed at clear breaches). The 30 seats must be real; "selling fast" and seat counts only if true. No countdown graphics on social.

**Reviews and testimonials.** Fake reviews are a categorical ban under the DMCC Act. You have no customer quotes yet, so the plan uses none. When First 30 Households feedback arrives, use it only with written permission, first name and county, unedited.

**"Free" claims (CAP 3.23–3.26).** The quiz is free with nothing required. The fridge card is free but needs an email; that's allowed, and Pinterest's landing-page rule requires the pin to say sign-up is needed, hence "free download by email" in every fridge card pin.

**Government content and branding (Open Government Licence v3).** Quoting gov.uk guidance is fine with attribution. The licence forbids suggesting official status or endorsement, so keep "independent, not affiliated" on any post that cites gov.uk, and never use the crown, the GOV.UK wordmark or Prepare campaign artwork in images.

**Platform rules.** Pinterest's advertising guidelines list "playing on people's fear" and "alarmist" language under clickbait, and require ads to be truthful about what people should expect. Meta prohibits sensational content and misleading claims, and its personal-attributes rule means any future paid post must not imply knowledge of the reader ("as a mum over 40…"). The organic copy above already complies because the voice does. Facebook also demotes engagement bait; post 1 asks a genuine question, which is fine, but never "like if you agree" or "tag a friend".

**Emergency numbers.** 105 is England, Scotland and Wales only. Any post that prints it says so and gives the Northern Ireland number, as post 6 does.

**Safety instruction.** Posts recommend and point to guides; none instruct on operating equipment, medication or shutting off gas. Keep it that way (this is also the liability line from the Project Brief).

**Data.** The quiz result email has a separate marketing tick box, which satisfies PECR. Never collect emails in Facebook comments; always send people to the form.

**Images.** Dummy names and addresses on every filled-in card. Your own photography or licensed images only. The acorn mascot is AI-generated; that's fine for organic, and Meta may label it.

---

## 7. Sense check

- **What will work.** The fridge card as the hero object (it's the most shareable thing you own), the survey numbers used calmly, the checklists on Pinterest, and the honest "why pay" post. The 25–65 female audience is exactly who Pinterest serves and who runs UK Facebook groups.
- **What won't.** Expecting Facebook page posts alone to bring traffic. Expecting Pinterest to help the 14 October close. Selling the course cold to strangers.
- **The biggest lever isn't a post.** It's the share button on the quiz results page plus per-page OG images. Build those first; then every post 1 share carries a score and a proper preview.
- **Three things before the first post:** photograph the printed pack (the hero placeholder is a blocker), make four OG images, wire the pack checkout.
- **Time budget.** Ten posts in four templates is about two evenings of design once the photography exists, plus an hour a week to schedule and answer comments.

---

## Sources

- [GOV.UK: UK Public Survey of Risk Perception, Resilience and Preparedness 2026, headline findings](https://www.gov.uk/government/statistics/uk-public-survey-of-risk-perception-resilience-and-preparedness-2026/uk-public-survey-of-risk-perception-resilience-and-preparedness-2026-headline-findings-html)
- [UK Defence Journal: UK to launch national resilience campaign this year](https://ukdefencejournal.org.uk/uk-to-launch-national-resilience-campaign-this-year/)
- [Ofgem: Final report on the review into the networks' response to Storm Arwen (9 June 2022)](https://www.ofgem.gov.uk/research/storm-arwen-report)
- [Drinking Water Inspectorate: South West Water fined for drinking water failures in Brixham (2 June 2026)](https://www.dwi.gov.uk/2-june-2026-south-west-water-fined-a-record-1-853-million-for-drinking-water-failures-in-brixham/)
- [GOV.UK Prepare: Get prepared for emergencies](https://prepare.campaign.gov.uk/get-prepared-for-emergencies/)
- [ASA: Fear and distress (CAP Code 4.2 guidance and rulings)](https://www.asa.org.uk/advice-online/fear-and-distress.html)
- [ASA: Promotional savings claims (reference prices, introductory offers)](https://www.asa.org.uk/advice-online/promotional-savings-claims.html)
- [Osborne Clarke: CMA final unfair commercial practices guidance under the DMCC Act](https://www.osborneclarke.com/insights/cma-publishes-final-unfair-commercial-practices-guidance-under-uk-dmcca-what-your-business)
- [Pinterest advertising guidelines](https://policy.pinterest.com/en/advertising-guidelines)
- [Meta advertising standards](https://transparency.meta.com/policies/ad-standards/)
- [Socialinsider: 2026 organic Facebook engagement benchmarks](https://www.socialinsider.io/social-media-benchmarks/facebook)
- [Postiz: what type of content works best on Facebook in 2026](https://postiz.com/blog/what-type-of-content-works-best-on-facebook-in-2026)
- [Ignite Social Media: Pinterest content strategy in 2026](https://www.ignitesocialmedia.com/pinterest-marketing/pinterest-content-strategy-in-2026-a-complete-guide/)
- [The National Archives: Open Government Licence user guidance](https://cdn.nationalarchives.gov.uk/documents/information-management/ogl-user-guidance.pdf)
