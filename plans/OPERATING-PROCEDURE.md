# Operating procedure

Rules for any change to this repo, whoever makes it (you or Claude). Follow the steps in order and don't skip any.

## 1. Research first
- Read the existing code, docs and context before writing anything.
- Confirm the actual requirement. If it's ambiguous, list your assumptions and pick the most reasonable one. Don't stall, but state the assumption.
- Check how the codebase already does similar things and match it.

## 2. Plan
- Write the plan before touching code: files to change, order of steps, what could break.
- Prefer the simplest approach that works. No gold-plating and no features nobody asked for.
- Note anything you're NOT doing, so the scope is explicit.

## 3. Sense-check the plan
- Re-read it against the original request. Does it actually solve the problem?
- Spot edge cases, dependencies and side effects now, not later.
- If the plan shows the task is bigger or riskier than it looked, flag it before executing.

## 4. Execute
- Follow the plan. Make focused, minimal changes.
- Use the conventions, patterns and libraries already in the project.
- Keep changes small enough to reason about, and commit in logical steps.

## 5. Test what you built
- Actually run it. Don't assume it works because it looks right.
- Cover the happy path AND the obvious failure cases.
- Check you didn't break anything next to it (regressions).

## 6. Amend
- Fix what the tests exposed, then re-test until clean.
- Remove debug code, dead code and anything added just to explore.

## 7. Report
- State what you changed, what you tested and the result.
- Call out anything unresolved, assumed or deferred, honestly.

## 8. Parallelise the work
- Split the job into independent chunks and run them as separate agents/workers at the same time: as many as the task genuinely needs, no more.
- Parallelise only what's truly independent. Anything with a dependency waits for its input.
- Give each worker a tightly scoped brief and a clear "done" condition, so results come back clean and mergeable.
- Reconcile the outputs yourself: check for conflicts, overlaps and gaps before treating the combined result as final.
- Precision and reliability beat raw speed. Never spawn more workers than you can verify.

## Expectations
- Correctness over speed. A working small change beats a broken big one.
- Match the existing codebase. Don't impose new patterns without a reason.
- Never fake success. If something fails or you're blocked, say so plainly.
- If reality contradicts the plan, stop and re-plan rather than forcing it.
- Leave the workspace clean: no leftover scratch files, no half-finished edits.

## Repo-specific notes
- Plans for each task live in `plans/YYYY-MM-DD-<topic>.md`.
- Run `npm run build` before every push. Cloudflare builds from the `test-2` branch on GitHub.
- Tools that touch the repo from a sandbox should use `GIT_OPTIONAL_LOCKS=0` for read-only git commands, so they don't leave a stale `.git/index.lock` behind.
