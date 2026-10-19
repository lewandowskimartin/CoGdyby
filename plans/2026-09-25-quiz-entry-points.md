# Quiz entry points: plan (2026-09-25)

Follows `plans/OPERATING-PROCEDURE.md`.

## Request
1. Home hero: swap the "For organisations" link for a quiz link that converts well.
2. Header nav: add a quiz link.
3. Footer: add a quiz link.
4. Home: turn the quiz section into a CTA section like "Get your household sorted this weekend", without taking focus away from the pack.
5. /families and /elderly-parents: add a quiz banner.

## Research findings
- Quiz: `/household-preparedness-quiz` (`QUIZ_PATH` in `src/data/quiz.js`). The results page shows the score with no sign-up (the email form is optional), and it sells the pack (`PACK.url = /#get`, `pack_clicked` event). So the quiz is a way into the pack, not a rival to it.
- `src/components/QuizCta.astro` already exists (the box at the end of each guide, built on `.article-cta`). I'll extend it rather than write a second component.
- The home quiz section uses `.btn-accent` (orange). That's the most eye-catching button on the page, stronger than the black "Get the pack" button. This is the main balance problem.
- PostHog has `autocapture: false` and nothing tracks clicks into the quiz. Without an event there's no way to know which entry point converts.
- The organisations audience is still reachable through the nav "Organisations" link, the B2B band and the footer. The final CTA's "For organisations" button stays.

## Copy decisions (conversion reasoning)
- CTA best practice: a secondary CTA should be low-commitment and visually weaker than the primary. Say what the person gets and how long it takes ("2 minutes"). A question that starts a curiosity gap works well for a self-assessment.
- Hero secondary link (the ghost link, visually weaker than the primary): **"Take the free 2-minute quiz"**. It says what it is, that it's free and how long it takes, and it fits on one line next to "Get the pack" on desktop. The first draft, "How prepared are you? Find out in 2 minutes", wrapped under the button.
- Nav: **"Free quiz"**. Short (nav labels are 1–2 words), says what it is, and "Free" lowers the barrier. It sits next to "Free sample" as the second free way in.
- Footer (Product column): **"Preparedness quiz"**. Descriptive, and matches the URL keyword for SEO.
- Home quiz band: eyebrow "Not ready to buy yet?", heading "How prepared is your household?", a short line of copy, an **outline** button "Take the 2-minute quiz", and a small line under it: "Free · no sign-up · instant score".
- Families: "How prepared is your family?" Elderly parents: "How prepared are Mum and Dad?"

## Visual hierarchy (pack stays dominant)
- The quiz band is a compact horizontal panel: a smaller heading (objection size), an outline button, a narrower max width and a darker panel tint. The final CTA keeps its 40–46px heading, full-width panel and black primary button.
- On the home page the quiz band sits straight above the final CTA, so it works as the soft option for people who aren't ready and hands over to the final pack pitch. It stays where the quiz section is now.
- The orange accent button is removed from the home page.

## Files
- `src/components/QuizCta.astro`: add `variant="band"` with `eyebrow`, `title`, `text`, `cta`, `location` props. The default article box stays as it is.
- `src/styles/global.css`: `.quiz-band` styles next to the Final CTA block.
- `src/pages/index.astro`: hero link swap, quiz section replaced with `<QuizCta variant="band">`.
- `src/components/Header.astro`: "Free quiz" `<li>`.
- `src/components/Footer.astro`: "Preparedness quiz" link.
- `src/pages/families.astro`, `src/pages/elderly-parents.astro`: band before the final CTA.
- `src/components/Animations.astro`: add `.quiz-band-inner` to the reveal list, so it animates like its neighbours.
- `src/layouts/BaseLayout.astro`: a small delegated click listener, `[data-quiz-cta]` → `track('quiz_cta_clicked', { location })`. It uses the existing `track()` (consent-aware, no personal data).

## Risks and checks
- Desktop nav at 760–1000px could overflow with a sixth item. Screenshot at 768/1024/1280, and fix the breakpoint if needed.
- Mobile menu: the new item has to appear in the slide-down list.
- The GSAP reveal must not leave the band invisible if the script fails. Same pattern as the other sections.
- Every quiz link resolves (the build outputs `/household-preparedness-quiz/index.html`).

## Not doing
- No A/B-testing framework. The click event gives per-location data, and copy can be tested later.
- The final CTA's "For organisations" button, blog footers and the quiz page itself stay as they are.
- Not fixing the existing double arrow on "For elderly parents →" / "For families with children →" (`.btn-ghost` adds its own →). Flagged separately.
- Not committing or pushing. That's left to Martin.

## Parallelisation
- Execution runs in one stream. Every change touches shared files (`global.css`, `QuizCta.astro`, and pages that depend on the component), so parallel editors would conflict.
- Verification runs in parallel: one independent reviewer agent checks the diff while I build and screenshot.

## Outcome (2026-09-25)
- Build: passes (26 pages). quizScore tests: 9/9 pass.
- Links: every quiz entry point points to `/household-preparedness-quiz` (200). One `id="quiz"` per page.
- Tracking (headless test with a mocked dataLayer): `quiz_cta_clicked` fires with `home-hero`, `home` and `families`. Nothing fires on the quiz page itself.
- Nav: the sixth link overflowed at 760px and wrapped up to about 1000px. The wrapping at 760–880px was already there before this change. Fixed with a 760–1079px rule (tighter gaps, `nowrap`, price hidden in the button). No overflow or wrapping at 760/800/900/1024/1079/1080/1280.
- Visual check at 390 and 1280: the band reads as secondary to the final pack CTA on all three pages. The band shows after the GSAP reveal (opacity 1).
- Reviewer agent: no bugs. Actioned: spacing under lifestyle bands, count from `QUESTIONS.length`, no tracking on quiz pages, nav fit.
- Still open: the double arrow on "For elderly parents → →" / "For families with children → →" (existing issue, not fixed).

## Follow-up (2026-09-25): colours
Request: final pack CTA background #CF5F33 with accessible text and buttons, and the quiz banner on #FBF7F0 as the template for every page.
- `.final` is shared by home, /families and /elderly-parents. Assumption: all three get the terracotta, since it's one pack CTA style. Easy to scope to the home page only if needed.
- Contrast on #CF5F33: white 3.93:1 fails AA for 17px body text and passes only for large headings. Near-black #161310 is 4.7:1 and passes for all text sizes, so the panel uses dark text.
- Buttons: primary ink with cream text, secondary cream with ink text. Both edges are at least 3:1 against the panel (WCAG 1.4.11).
- The focus outline was var(--action), the same colour as the new panel, so it would have been invisible. It's overridden to dark inside `.final`.
- The quiz band is now var(--paper-2) (#FBF7F0) at the same max width as `.final`, so the two panels line up.
