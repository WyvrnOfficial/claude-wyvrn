# CLAUDE.md

Wyvrn harness v2.5.0.

## Trigger /flow when

User request modifies code, tests, configs, docs, or project files. Skip for read-only queries (explanation, analysis, exploration).

## Auto-loaded context

This file. Nothing else auto-loads at session start.

## On /flow invocation, read (parallel batch)

- `~/.claude-wyvrn/conventions/universal.md`
- `~/.claude-wyvrn/conventions/gitflow.md`
- `.claude-wyvrn-local/PROJECT.md` if present, else `README.md`
- `.claude-wyvrn-local/ARCHITECTURE.md` if present

Lazy-read on first matching file touch:

- `~/.claude-wyvrn/conventions/<stack>.md`
- `.claude-wyvrn-local/conventions/<stack>.md` (overrides global on conflict)

Stack extensions: `.js`→javascript; `.ts`/`.mts`/`.cts`→typescript; `.jsx`/`.tsx`→react+typescript/javascript+design; `.py`/`.pyi`→python; `.cs`→csharp; `.cpp`/`.cc`/`.cxx`/`.h`/`.hpp`/`.hxx`→cpp; `.css`/`.scss`/`.html`/`.rs`/`.xaml`/`.qml`/`.qss`→design.

design applies only when the project declares a brand (guard at the top of `conventions/design.md`; brand applied via `/wyvrn-apply-design`).

## Parallelize

Issue independent reads, edits, greps, and bash commands as a single tool-use message. Sequence only on data dependencies. See `~/.claude-wyvrn/conventions/universal.md` §1.7.

## Project settings

`.claude-wyvrn-local/PROJECT.md` may declare:

- `plan-review: on | off` - default `off`. When `on`, /flow Step 5 pauses for plan approval.

## Artifacts

/flow writes `.claude-wyvrn-local/plans/YYYY-MM-DD-<slug>.md` per task. Focus: mistakes + corrections. Do NOT auto-read these. /flow retrieves relevant past plans at Step 1 by greping for matching files, stacks, and prompt keywords.

## Convention rule

Conventions are authoritative. Always follow the matching stack convention even if existing code in the repo deviates.

## Preflight

If `~/.claude-wyvrn/VERSION` is missing, halt: `Wyvrn harness not installed. Run claude-wyvrn install.`
