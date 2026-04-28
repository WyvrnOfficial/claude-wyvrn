# Wyvrn Claude Tools — Harness

A standardized structure that lets Claude Code, Claude CLI, and Claude Cowork agents do development work autonomously and predictably.

Starting in v0.2, the harness installs **globally per machine** (one install, many projects) and each project carries a small **project-local folder** for its artifacts.

## Install (v0.2 — manual)

This archive contains two top-level folders:

- `.claude-wyvrn/` — the harness itself. Install to `~/.claude-wyvrn/` (your home directory).
- `.claude-wyvrn-local/` — CLAUDE.md —  Install to local project directory.

### Install the harness globally (once per machine)

1. Copy the contents of `.claude-wyvrn/` into `~/.claude-wyvrn/`.
2. On Windows this is typically `%USERPROFILE%\.claude-wyvrn\`.
3. Verify: `~/.claude-wyvrn/VERSION` should exist and contain a version number.

All projects on this machine will share this harness. When a new harness version is released, update this one folder and every project picks it up.

### Install project-template into a project (once per project)

From the root of the project:

1. Copy `CLAUDE.md` into the project root. 
2. Copy the `.claude-wyvrn-local/` folder into the project root.
3. Track both in git.
4. Open `.claude-wyvrn-local/ARCHITECTURE.md` and fill it in for your project, or run `/bootstrap-project` to auto-draft `ARCHITECTURE.md` and `PROJECT.md` from the repo and confirm via session.
5. Optionally add stack-specific conventions (see Customization below). For projects with a pre-existing `CLAUDE.md` or other ad-hoc Claude setup, run `/migrate-foreign-framework` instead — it harvests existing content into `PROJECT.md` and the appropriate harness slots.

### CI

CI needs the harness installed the same way as a developer machine. Before running any flow-based automation, install the harness at `~/.claude-wyvrn/` in the CI environment. The project-template files (`CLAUDE.md` and `.claude-wyvrn-local/`) come with the repo.

## What you can do

### Run a flow

Three flow types:

- `/flow-feature` — add new functionality.
- `/flow-fix` — resolve a bug.
- `/flow-refactor` — restructure code without changing behavior.

Each flow reads its required context, asks clarifying questions through the active session, does the work autonomously, verifies the result, and closes with a verifier report. Phases and rules are in `~/.claude-wyvrn/workflows/WORKFLOW.md`.

Each flow type has its own initial-prompt requirements. Check the flow file (`~/.claude-wyvrn/workflows/FEATURE.md`, `FIX.md`, or `REFACTOR.md`) before invocation.

### Invoke utility skills directly

Most of the time you'll only invoke the flow skills above. Each sub-step is also available standalone:

- `/run-clarifier` — re-run clarification on an existing spec.
- `/run-verifier` — re-verify a closed flow's artifacts.
- `/template-check <artifact-path>` — check template compliance for one file.
- `/decision-log` — manually log a decision record.
- `/archive` — archive old validated or failed flows.
- `/bootstrap-project` — draft `PROJECT.md` and `ARCHITECTURE.md` from the repo on a fresh install.
- `/migrate-foreign-framework` — migrate a project with a hand-written `CLAUDE.md` or ad-hoc `.claude/` setup into the harness layout.

### Customization

Drop files into project territory to customize behavior without touching the global harness:

- **`.claude-wyvrn-local/PROJECT.md`** — project specification. When present, agents read this instead of the root `README.md` for project context. Plays the role a hand-written `CLAUDE.md` plays in non-harness projects: domain context, gotchas, idioms, where things live. Auto-draft via `/bootstrap-project` on a fresh install, or hand-author using `~/.claude-wyvrn/templates/project.md`.
- **`.claude-wyvrn-local/conventions/[stack].md`** — project-specific stack conventions. Overrides any matching global conventions. Use the template at `~/.claude-wyvrn/templates/conventions.md`.
- **`.claude-wyvrn-local/ARCHITECTURE.md`** — project architecture. Seeded from the template. Fill in your modules, interfaces, and invariants before first use.

Machine-wide stack conventions go into `~/.claude-wyvrn/conventions/` using the same template. These apply to every project on the machine and are typically maintained by whoever owns the harness install.

### Validation mode

Flows default to non-blocking validation: the flow closes on verifier success and you review the report asynchronously. If you prefer the flow to pause until you explicitly validate:

- Per-flow: include `validation: blocking` in the initial prompt.
- Project-wide default: declare it in `PROJECT.md`.

## Folder map

### Machine-wide (`~/.claude-wyvrn/`)

| Path | Purpose |
|---|---|
| `HARNESS.md` | Agent rules. |
| `INDEX.md` | Agent navigation map. |
| `DECISIONS.md` | Decision procedure. |
| `conventions/` | Universal and stack-specific rules. |
| `workflows/` | Flow definitions. |
| `templates/` | Templates for every artifact type. |
| `agents/` | Subagent definitions. |
| `skills/` | Invocable skills. |
| `extensions/` | Drop-in extensions. Empty by default. |

### Per project

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Entry point for the agent. |
| `.claude-wyvrn-local/` | Your project's artifacts and overrides. Track in git. |
| `.claude-wyvrn-local/ARCHITECTURE.md` | Your project architecture. Fill in before first use. |
| `.claude-wyvrn-local/features/` | Feature specs. |
| `.claude-wyvrn-local/fixes/` | Fix specs. |
| `.claude-wyvrn-local/refactors/` | Refactor specs. |
| `.claude-wyvrn-local/decisions/` | Decision records. |
| `.claude-wyvrn-local/clarifications/` | Clarification batches. |
| `.claude-wyvrn-local/reviews/` | Verifier reports. |
| `.claude-wyvrn-local/verifier-gaps/` | Verifier gap reports. |
| `.claude-wyvrn-local/conventions/` | Project-specific stack conventions (optional). |
| `.claude-wyvrn-local/.archive/` | Archived artifacts. Off-limits to agents during flows. |

## What not to do

- **Don't edit files under `~/.claude-wyvrn/`** directly unless you're updating the machine-wide harness intentionally. To customize for one project, use `.claude-wyvrn-local/` overrides.
- **Don't hand-write artifacts.** Artifacts come from templates through flows. Writing them by hand bypasses template compliance and verification.
- **Don't answer agent questions by editing artifact files.** The agent asks through the session; you answer through the session. Agents record your answers in the artifacts.
- **Don't skip the verifier.** A flow is not complete without a successful verifier pass.
- **Don't expand flow scope mid-flow.** If you realize you want more, either let the current flow close and start a new one, or respond to the out-of-scope prompt when it appears.

## Where to learn more

The files under `~/.claude-wyvrn/` are the authoritative reference. They're written for agents but are also readable by humans. In order of usefulness for a dev who wants to understand the system:

1. `~/.claude-wyvrn/HARNESS.md` — the rules agents follow.
2. `~/.claude-wyvrn/workflows/WORKFLOW.md` — what happens during a flow.
3. `~/.claude-wyvrn/DECISIONS.md` — how agents classify decisions and when they stop to ask.
4. `~/.claude-wyvrn/conventions/CONVENTIONS.md` — how agents produce code and artifacts.
5. `~/.claude-wyvrn/INDEX.md` — the map of where everything lives.

Individual flow types, agents, and skills have their own files under `workflows/`, `agents/`, and `skills/`.

## Version

See `~/.claude-wyvrn/VERSION` for the installed harness version.
