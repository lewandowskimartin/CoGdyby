#!/usr/bin/env python3
"""
Prepared at Home: install the preparedness quiz into this repo.

Run from the repo root:
    python3 /path/to/quiz-install/install-quiz.py

What it does:
  1. Adds the quiz files (never overwrites a different existing file).
  2. Makes four small edits: PostLayout (quiz prompt on every guide), homepage (quiz section),
     privacy page (quiz wording), astro.config (keep results page out of the sitemap).
  3. Adds the posthog-js dependency (PostHog stays off until you set PUBLIC_POSTHOG_KEY).
  4. Runs the unit tests and `npm run build`.

Safe to re-run: finished steps are skipped. If any file doesn't look as expected,
it stops before changing anything and tells you which file and why.
Nothing is committed; review with `git diff` and commit yourself.
"""
import filecmp
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PAYLOAD = HERE / "files"
REPO = Path.cwd()

NEW_FILES = [
    "src/data/quiz.js",
    "src/lib/quizScore.js",
    "src/lib/quizScore.test.mjs",
    "src/lib/track.js",
    "src/components/Quiz.astro",
    "src/components/QuizCta.astro",
    "src/components/PostHog.astro",
    "src/styles/quiz.css",
    "src/pages/household-preparedness-quiz/index.astro",
    "src/pages/household-preparedness-quiz/results.astro",
]

HOME_SECTION = """  <!-- QUIZ -->
  <section class="section" id="quiz">
    <div class="section-inner">
      <div class="objection">
        <span class="eyebrow">2-minute check</span>
        <h2 style="margin-top:12px">How prepared is your household?</h2>
        <p>Ten quick questions, based on the official gov.uk Prepare guidance. You get a score out of 100, your top three gaps and a free fix for each.</p>
        <a class="btn btn-accent" href="/household-preparedness-quiz">Take the quiz</a>
      </div>
    </div>
  </section>

"""

PRIV_COLLECT = """<li><strong>Quiz results</strong> — if you take our preparedness quiz and choose to email yourself your results: your email address, your score band, your weakest area, a link to your results and whether you asked for tips and offers. The quiz itself runs in your browser; your answers are not sent to us unless you email yourself the results link, which contains a short code for them.</li>
          """

PRIV_USE = """<li><strong>To email you your quiz results</strong>, and preparedness tips and offers only if you tick the box for them. Lawful basis: your consent — unsubscribe at any time.</li>
          """

PRIV_COOKIES = """
        <p>If you've accepted analytics, we also record anonymous preparedness quiz events in Google Analytics, such as that the quiz was completed and the score band. We never record your email address there. The results page address includes a short code for your answers, which Analytics may record with the page view; it doesn't identify you.</p>"""

# (file, marker that means "already done", [(anchor, replacement), ...])
PATCHES = [
    ("src/layouts/PostLayout.astro", "QuizCta", [
        ("import BaseLayout from './BaseLayout.astro';",
         "import BaseLayout from './BaseLayout.astro';\nimport QuizCta from '../components/QuizCta.astro';"),
        ('    <div class="article-cta">\n      <div class="box">\n        <p>Get the whole plan',
         '    <QuizCta />\n\n    <div class="article-cta">\n      <div class="box">\n        <p>Get the whole plan'),
    ]),
    ("src/pages/index.astro", 'id="quiz"', [
        ("  <!-- CONTACT — white-label enquiries -->",
         HOME_SECTION + "  <!-- CONTACT — white-label enquiries -->"),
    ]),
    ("src/pages/privacy.astro", "preparedness quiz", [
        ("<li><strong>Enquiry details</strong>", PRIV_COLLECT + "<li><strong>Enquiry details</strong>"),
        ("<li><strong>To answer enquiries.</strong>", PRIV_USE + "<li><strong>To answer enquiries.</strong>"),
        ("Our checkout provider may set cookies necessary to process your payment when you go to buy.</p>",
         "Our checkout provider may set cookies necessary to process your payment when you go to buy.</p>" + PRIV_COOKIES),
    ]),
    ("astro.config.mjs", "household-preparedness-quiz/results", [
        ("    sitemap(),\n",
         "    sitemap({ filter: (page) => !page.includes('/household-preparedness-quiz/results') }),\n"),
    ]),
]


def fail(msg):
    print(f"\nSTOPPED, nothing was changed: {msg}")
    sys.exit(1)


def main():
    if not (REPO / "package.json").exists() or not (REPO / "src/layouts/BaseLayout.astro").exists():
        fail(f"run this from the root of the Prepared at Home repo (current folder: {REPO}).")
    if not PAYLOAD.exists():
        fail(f"can't find the quiz files next to this script ({PAYLOAD}).")

    # ---- Plan everything first; write nothing until every check passes ----
    copies = []
    for rel in NEW_FILES:
        src, dst = PAYLOAD / rel, REPO / rel
        if not src.exists():
            fail(f"bundle is missing {rel}.")
        if dst.exists():
            if filecmp.cmp(src, dst, shallow=False):
                print(f"  = {rel} (already installed)")
                continue
            fail(f"{rel} already exists and is different. Move it aside, then re-run.")
        copies.append((src, dst, rel))

    edits = []
    for rel, marker, ops in PATCHES:
        path = REPO / rel
        if not path.exists():
            fail(f"{rel} not found.")
        text = path.read_text(encoding="utf-8")
        if marker in text:
            print(f"  = {rel} (already edited)")
            continue
        new = text
        for anchor, repl in ops:
            n = new.count(anchor)
            if n != 1:
                fail(f"{rel}: expected this text once, found it {n} times:\n    {anchor.splitlines()[0]!r}\n"
                     "  The file may have changed since the quiz was prepared. Send it to Claude.")
            new = new.replace(anchor, repl)
        edits.append((path, new, rel))

    # ---- Apply ----
    for src, dst, rel in copies:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        print(f"  + {rel}")
    for path, new, rel in edits:
        path.write_text(new, encoding="utf-8")
        print(f"  ~ {rel}")

    # PostHog loader needs the package present at build time (it stays switched off until
    # PUBLIC_POSTHOG_KEY is set, and the library is only downloaded by visitors when it is).
    if '"posthog-js"' not in (REPO / "package.json").read_text(encoding="utf-8"):
        print("\nAdding posthog-js dependency…")
        r = subprocess.run(["npm", "install", "posthog-js@^1"], cwd=REPO, capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stdout[-2000:] + r.stderr[-2000:])
            print("npm install posthog-js FAILED. Files are installed; run it yourself, then npm run build.")
            sys.exit(1)
        print("  + posthog-js (package.json)")

    # ---- Verify ----
    if "--no-build" in sys.argv:
        print("\nFiles installed. Skipped tests and build (--no-build).")
        return
    print("\nRunning unit tests…")
    t = subprocess.run(["node", "--test", "src/lib/quizScore.test.mjs"], cwd=REPO, capture_output=True, text=True)
    summary = [l for l in t.stdout.splitlines() if l.startswith(("# pass", "# fail"))]
    print("  " + "  ".join(summary) if summary else t.stdout[-2000:] + t.stderr[-2000:])
    if t.returncode != 0:
        print("Unit tests FAILED (output above). Files are installed; review with git diff.")
        sys.exit(1)
    print("Running npm run build…")
    b = subprocess.run(["npm", "run", "build"], cwd=REPO, capture_output=True, text=True)
    if b.returncode != 0:
        print(b.stdout[-3000:] + b.stderr[-3000:])
        print("Build FAILED (output above). Files are installed; review with git diff.")
        sys.exit(1)
    built = [l.strip() for l in b.stdout.splitlines() if "page(s) built" in l or "household-preparedness-quiz" in l]
    print("  " + "\n  ".join(built))
    print("\nDone. Review with `git diff` / `git status`, then commit.")


if __name__ == "__main__":
    main()
