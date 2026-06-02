# 2026-06-02 — Add time-saved estimate to /flow artifact

## Task

Update the artifact generated at the end of each `/flow` run (the Step 9a learning log) so it includes an estimation of the time saved by having the task implemented by an agent versus a human implementing it unaided. The change is to the harness runbook spec, not to any application code.

## Branch

`feature/TR_flowTimeSavedEstimate`, based on `main` (repo has no `develop` branch; user chose to branch from `main`).

## Mistakes & corrections

None. The flow ran clean: context read, gitflow confirmed, two parallel edits, diff verified within scope.

## Global harness issues

Two inconsistencies surfaced during the flow. Root cause is in the global harness / its conventions, so they are logged here and surfaced in chat only — `~/.claude-wyvrn/` was not modified.

1. **Version drift.** `~/.claude-wyvrn/VERSION` reports `2.1.0`, but this repo's `README.md` (line 1) and `.claude-wyvrn/CLAUDE.md` both say `v2.0.0`. The installed harness is ahead of the repo's documented version. Suggested fix: reconcile the repo's README/CLAUDE.md version stamp with the installed `VERSION`, or document why they differ.
2. **gitflow.md assumes `develop`/`master`.** `conventions/gitflow.md` §1 names `develop` as the integration base and `master` as the release branch, but this repo (and many others) uses `main` with no `develop`. Step 2 of `flow/SKILL.md` has no fallback for a missing `develop`, so the base branch had to be chosen ad hoc. Suggested fix: have gitflow.md / flow Step 2 fall back to the repo's default branch when `develop` is absent.

## Files changed

- `.claude-wyvrn/skills/flow/SKILL.md` — added a **Time saved (agent vs. human-only)** required section to the Step 9a learning-log spec, with a four-part estimation method (human-only baseline, agent-assisted actual, time saved, basis).
- `README.md` — synced the "Learning logs" feature description to mention the new time-saved estimate.

## Tests

None. Both files are documentation/spec markdown with no executable code (universal.md §1.6 — docs do not require tests).

## Project-file updates

None. The change targets the harness runbook under `.claude-wyvrn/`, not the per-project `.claude-wyvrn-local/` files (PROJECT.md / ARCHITECTURE.md / conventions), so no `/wyvrn-refresh-context` sync was warranted.

## Time saved (agent vs. human-only)

- **Human-only baseline** — ~50m. Locate the artifact spec among the skills, decide placement, design a defensible estimation method and output format, edit both files consistently, follow gitflow, and write the learning log.
- **Agent-assisted actual** — ~7m for the implementation portion (excludes the separate session-start digest curation).
- **Time saved** — ~0h 43m (~85%).
- **Basis** — small, well-scoped docs/spec edit across 2 files; most human effort is in finding the right spec and designing the estimation method, not typing. Largest uncertainty is the human baseline, which swings with the developer's familiarity with the Wyvrn harness layout.
