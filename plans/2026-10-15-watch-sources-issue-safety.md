# Watch sources: safe issue text and no issue floods

*Plan, 15 Oct 2026. Fixes the two low-severity findings from the security audit (run 1, 14 Oct). Builds on `plans/2026-10-14-local-pages-automation.md`.*

---

## Summary

The weekly **Watch sources** job copies text from outside websites into GitHub issues, using the job's token. If one of those websites were compromised (for example the Cumbria hazards page), two things could happen:

1. **Fake instructions.** The page's text and links are pasted into the issue as live Markdown. A crafted link can add new lines, an `@mention` and a link labelled "Download the corrected register" pointing anywhere, and it looks as if the bot wrote it.
2. **Issue floods.** Each new PDF link on a watched page opens its own issue, with no limit. A page with 300 matching links opens 300 issues, and rotating the links opens 300 more next week.

**The fix, in two parts:**
- **A. Show outside text as inert text.** Anything that came from another website goes into a code block. Links are shown as the real URL, never as a label.
- **B. One "new PDF" issue per watched page, not one per link.** The issue lists the new links. A page can then open at most one such issue until you close it.

**What changes for you:** issues look almost the same. The "page says" excerpt and the new links sit in a grey code box. A new register edition still opens one issue, which now lists every new PDF on that page.

**Cost:** about 1 hour, including tests. No new dependencies, no workflow change.

---

## Root causes (from the audit)

| Finding | Cause | Where |
|---|---|---|
| Fake instructions | `issueFor()` puts `f.detail` and `f.link` into the issue body raw. `canonicalUrl()` decodes the link's path (`%0A` becomes a real new line), so a link can carry whole Markdown lines. | `scripts/lib/issues.js:34,39`, `scripts/lib/sources.js:115` |
| Issue floods | `runChecks()` makes one `new-pdf` finding per new link, and each one's title includes the link. `planIssues()` opens one issue per title, with no limit. | `scripts/lib/sources.js:259,343`, `scripts/lib/issues.js:53-68` |

---

## Plan

### Step 1: `scripts/lib/issues.js`, inert rendering (fixes finding 1)

Add two small helpers and use them in `issueFor()`:

```js
// Text from outside websites: shown as plain text, never as Markdown.
const clean = (s, max = 1500) =>
  String(s ?? '')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f  ]/g, ' ') // keep \n and \t only
    .slice(0, max);

// Fenced block that the content cannot close: the fence is longer than any backtick run inside.
const block = (s) => {
  const text = clean(s);
  const longest = Math.max(2, ...(text.match(/`+/g) ?? []).map((r) => r.length));
  const fence = '`'.repeat(longest + 1);
  return `${fence}text\n${text}\n${fence}`;
};

// A URL we can safely make clickable: http(s) only, shown as itself (no label), re-encoded.
const urlLine = (u) => {
  try {
    const x = new URL(u);
    if (x.protocol === 'https:' || x.protocol === 'http:') return `<${x.href}>`;
  } catch {}
  return block(u);
};
```

Body layout:

````
**New PDF**
```text
<detail — inert>
```
- Area: `cumbria`
- File: `src/content/local/cumbria.yaml` → `watch[0]`
- Source: https://… (from our YAML, unchanged)
- Link: <https://…encoded…>          (pdf-gone only; from our own `known` list)

**Next step:** …
````

- `detail` always goes through `block()`. It's the only field that can carry outside text: the "page says" excerpt, new links, error messages.
- `link` goes through `urlLine()`. `new URL().href` re-encodes spaces and new lines, so the link stays clickable but can't break the line. GitHub doesn't parse mentions or Markdown inside `<…>` autolinks.
- `Source:` stays as it is. It comes from our YAML.
- Titles stay as they are. GitHub doesn't render Markdown in titles, and `shortUrl()` already re-encodes.

### Step 2: `scripts/lib/sources.js`, one finding per watch (fixes finding 2)

In the `links` branch of `runChecks()` (line 343), replace the per-link loop for `added` with a single finding:

```js
if (added.length) {
  const shown = added.slice(0, 20);
  const more = added.length - shown.length;
  findings.push(finding({
    ...base,
    status: 'new-pdf',
    links: added,
    detail: `${added.length} new PDF link(s) matching "${w.match}":\n${shown.join('\n')}${more ? `\n…and ${more} more` : ''}`,
  }));
}
```

In `fingerprint()` (line 259), drop the link from `new-pdf` titles so the title is stable per watch. `pdf-gone` keeps its per-link title, because those links come from our own `known` list and can't be inflated from outside:

```js
const what = f.status === 'quote-missing' ? `"…" · ` : f.status === 'pdf-gone' ? `${shortUrl(f.link)} · ` : '';
```

New title shape: `[source] cumbria · new PDF · cumbriaprepared.org.uk/hazards-and-threats-cumbria`.

Update `NEXT_STEP['new-pdf']` in `issues.js`: "One or more new PDFs matching this watch are linked (listed above). If one is a new register edition, read it, update the risks and `register` in the YAML, then add the PDFs you've checked to `known`."

`canonicalUrl()` is left alone. Its decoding is what makes `known` comparisons work. The display problem is handled in Step 1.

### Step 3: Tests

`scripts/lib/issues.test.mjs`:
- **Injection:** `issueFor()` with `detail` containing `` "x\n\n@octocat [Get register](https://evil.example)\n```\nbreakout" ``. Expect: no line in the body starting with `@octocat`, every line of `detail` inside one fenced block, and the fence count even (the block isn't broken out of).
- **Control characters:** a ` ` or `\u0007` in `detail` doesn't appear in the body.
- **Link:** a link with an encoded new line renders as `<https://…%0A…>` on one line.
- **Update** the existing assertion at line 38: `Link: https://…` becomes `Link: <https://…>`. It also now uses `pdf-gone`, since `new-pdf` no longer has `link`.

`scripts/lib/sources.test.mjs`:
- **Flood:** a watched page with 300 matching PDF links produces exactly **one** `new-pdf` finding, with `links.length === 300` and `detail` capped at 20 links plus "…and 280 more".
- **Stable title:** two runs with different new-link sets give the same `new-pdf` title.
- The existing `pick('new-pdf')` assertion (line 237) should pass unchanged.

### Step 4: Verify (all offline, nothing sent to GitHub)
1. `npm test`: everything passes, old and new.
2. Re-run the audit's reproduction harnesses against the fixed code. They're in the audit output (`agents/h3-ci-supply` and `agents/v1-verify`, `agents/v2-verify`). Expected: the injected body is inert, and 300 links produce `issues_to_create=1`.
3. `npm run check:sources -- --json --out /tmp/report.json`, then `node scripts/watch-issues.mjs /tmp/report.json --dry`. This confirms the real sources still produce sensible titles. It's read-only and opens nothing.
4. Read one rendered body as GitHub would show it: paste a `--dry` body into a GitHub Markdown preview, or a private test issue you delete afterwards. Check that it reads well on your phone.

### Step 5: Rollout
- Before merging, check GitHub for open `source-watch` issues of type **new PDF**. The title format changes, so one open per-link issue would be followed by one new per-watch issue. Close the old ones once the new one appears, or before the next Monday run.
- Commit only when you ask, on `test-2`.

---

## What could break
- **An open per-watch issue hides a second new PDF until you close it.** This is intended: the issue says "check this watch", and closing it after updating `known` lets the next run report anything left over.
- **Links in `detail` are no longer clickable.** They're inside the code box. Long-press to copy, or use the clickable **Source** link to open the watched page.
- **`formatReport()` (the CLI output) shows the multi-line `new-pdf` detail.** That matches how `quote-missing` already prints its "page says" line.

## Not doing (out of scope)
- **A global per-run issue cap.** After Step 2, nothing from outside can raise the issue count, because counts are bounded by our own YAML. Add it later only if real use shows a need.
- **Restricting new-PDF links to the watched page's own domain.** Councils legitimately host PDFs elsewhere, and the link is now shown as its real URL.
- **The lychee "broken outside links" issue** (`watch-sources.yml:75-76`). Same class of problem, but its URLs come from our own built site. Wrapping `lychee/out.md` in a code fence is a one-line follow-up if wanted.
- **The other audit hardening items** (pinning Actions to SHAs, splitting the `issues: write` step into its own job, `_headers`). Tracked in the audit report.
