---
name: migrate-foreign-framework
description: Migrate a project that uses a different Claude convention (hand-written CLAUDE.md, ad-hoc Claude-specific files at the project root) into the claude-wyvrn layout. Harvests preservable content into PROJECT.md / ARCHITECTURE.md / project conventions and archives the originals.
---

# migrate-foreign-framework

Migrates projects with hand-written `CLAUDE.md` or other ad-hoc Claude files into the claude-wyvrn layout. Harvests project content, archives originals, installs the harness CLAUDE.md.

## Trigger

- Slash: `/migrate-foreign-framework`.
- Natural: "migrate this project to claude-wyvrn", "convert my CLAUDE.md to wyvrn".
- Typically invoked by `claude-wyvrn setup` on detection.

## Execution principles

- Parallelize independent reads and writes.
- All confirmations via `AskUserQuestion`.

## Preconditions

`~/.claude-wyvrn/VERSION` missing → halt: `Wyvrn harness not installed. Run claude-wyvrn install.`

## Constraints

- **Ignore `./.claude/`** entirely. That folder is Claude Code's own settings — unrelated to Wyvrn. Never read, write, or touch.
- **Never silently overwrite project files.** Writes go to new paths or paths explicitly authorized by the plan.
- **Always archive before deleting.** Foreign files move to `.claude-wyvrn-local/.archive/migration-<ISO_TIMESTAMP>/`. Never `rm`.
- **No source-code changes.** Touches `.claude-wyvrn-local/` and archived foreign files only.
- **No new templates.** PROJECT.md and ARCHITECTURE.md are free-form. New `conventions/<stack>.md` uses `~/.claude-wyvrn/templates/conventions.md`.

## Behavior

### 1. Inventory (parallel batch)

Scan project root for foreign Claude files. Read all found in one parallel batch:

- `CLAUDE.md` (case-sensitive)
- `claude.md`, `CONTEXT.md`, `AGENTS.md`, `INSTRUCTIONS.md`, `CLAUDE_HINTS.md`, `.cursorrules`
- Other ad-hoc Claude-context files at project root.

**Explicitly ignore `./.claude/`.**

Do not modify anything yet.

### 2. Classify content

Each meaningful content piece is one of:

- **Framework-specific (discard)** — generic "you are an AI assistant", boilerplate the harness supplies, instructions contradicting universal conventions.
- **Project description / context (preserve → PROJECT.md)** — name, purpose, domain, business rules, gotchas, idioms.
- **Architecture (preserve → ARCHITECTURE.md)** — module layout, interfaces, invariants, system overview.
- **Stack conventions (preserve → conventions/<stack>.md)** — project-specific rules about a tech stack.

When uncertain, preserve.

### 3. Propose plan

Present source-to-destination map:

```
.claude-wyvrn-local/PROJECT.md (new)
  ← CLAUDE.md lines 12-20: project overview
  ← CLAUDE.md lines 21-30: quickstart commands
  ← CLAUDE.md lines 56-62: gotchas
  ← CONTEXT.md (entire): split between description and gotchas

.claude-wyvrn-local/ARCHITECTURE.md (new)
  ← CLAUDE.md lines 31-44: modules section

.claude-wyvrn-local/conventions/typescript.md (new)
  ← CLAUDE.md lines 63-72: TypeScript style rules

Discarded:
  ← CLAUDE.md lines 1-11: generic AI-assistant preamble
  ← CLAUDE.md lines 73-80: "always be polite" instructions

Archived → .claude-wyvrn-local/.archive/migration-<TIMESTAMP>/:
  CLAUDE.md, CONTEXT.md
```

AskUserQuestion header `Migration`, options `[Apply, Refine, Abort]`.

- `Refine` (or "Other" + text) → update plan; re-show.
- `Abort` → exit.

Chunk into sequential calls when the plan is very large.

### 4. Apply (parallel writes)

1. **Archive originals** — create `.claude-wyvrn-local/.archive/migration-<ISO_TIMESTAMP>/`. Move foreign files via `git mv` (if git repo) else plain move. Never delete.
2. **Write merged content in parallel**:
   - `.claude-wyvrn-local/PROJECT.md` if any project context preserved.
   - `.claude-wyvrn-local/ARCHITECTURE.md` if any architecture content preserved.
   - `.claude-wyvrn-local/conventions/<stack>.md` for each preserved stack ruleset (start from `~/.claude-wyvrn/templates/conventions.md`).
3. **Install harness CLAUDE.md** at project root from `~/.claude-wyvrn/CLAUDE.md`.
4. **Print summary** — archived, written, discarded paths.

## Edge cases

- **Empty foreign file** → archive without extraction; install harness fresh.
- **Foreign content references missing files** → skip those references; note in summary.
- **`.claude-wyvrn-local/` already populated** → never overwrite existing files; fill only empty slots.
- **User aborts mid-flow** → list what was written for manual revert.

## Output

```
Migration complete.

Archived to .claude-wyvrn-local/.archive/migration-2026-05-18T14-32-00Z/:
  - CLAUDE.md
  - CONTEXT.md

Wrote:
  - CLAUDE.md (harness canonical)
  - .claude-wyvrn-local/PROJECT.md (new)
  - .claude-wyvrn-local/ARCHITECTURE.md (new)
  - .claude-wyvrn-local/conventions/typescript.md (new)

Discarded (covered by harness):
  - 11 lines of generic AI-assistant preamble

Ignored (not part of Wyvrn):
  - ./.claude/ (Claude Code settings)

Next:
  - git add . && git commit
  - Open the new ARCHITECTURE.md and PROJECT.md to verify the merge.
  - Once satisfied, the archive directory can be deleted.
```
