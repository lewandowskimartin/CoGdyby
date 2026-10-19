# Preparedness quiz: installer

Unzip into Downloads, then in Terminal:

```bash
cd "/Users/marcinlewandowski/Documents/GitHub/UK Household Preparedness"
python3 ~/Downloads/quiz-install/install-quiz.py
```

It adds the quiz, edits PostLayout, index, privacy and astro.config, adds `posthog-js`, then runs the tests and `npm run build`. It stops with nothing changed if a file doesn't match what's expected. It's safe to re-run, and it commits nothing. Check with `git diff`, then commit.

## Switches (all off by default)

- **Pack button:** in `src/data/quiz.js`, set `PACK.live = true` and `PACK.url` to the Payhip link. Until then the button goes to the free fridge card.
- **Email step:** set the build env var `PUBLIC_MAILERLITE_ACTION` to the action URL of your MailerLite embedded form (custom fields `quiz_band`, `quiz_weakest`, `quiz_url`, `marketing_consent`).
- **PostHog:** set the build env var `PUBLIC_POSTHOG_KEY` (EU project, with "Cookieless server hash mode" turned on). If you enable it, add PostHog to section 4 of the privacy page.

Quiz events already go to your GA4, but only for visitors who accept analytics in the cookie banner.
