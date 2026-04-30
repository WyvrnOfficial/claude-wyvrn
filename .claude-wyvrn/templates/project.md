# <project name>

> [template] Project specification. Overrides `README.md` per `HARNESS.md` §1.4. Carries project-narrative content (domain, gotchas, idioms, where things live) — the role a hand-written `CLAUDE.md` plays in non-harness projects. Architecture goes in `ARCHITECTURE.md`. Code rules go in `conventions/`. Seeded by `/bootstrap-project` or harvested from existing `CLAUDE.md` by `/migrate-foreign-framework`.

**Last updated:** <ISO 8601 timestamp>
**Last updated by:** <FEAT-NNNN | FIX-NNNN | REF-NNNN | human>

## Description

> [template] One paragraph. What the project is, who runs it, what it produces. No marketing copy, no history.

<one paragraph>

## Quickstart commands

> [template] One per line, format `<purpose>: <command>`. Source from manifest scripts, Makefile, README. If none, write "N/A".

- <purpose>: <command>

## Stack summary

> [template] One line per item, format `<name> <version> — <role>`. Detailed code rules go in `conventions/[stack].md`.

- <name> <version> — <role>

## Domain glossary

> [template] Project-specific terms. Format: `**<term>** — <definition>`. Definitions self-contained. If none, write "N/A".

- **<term>** — <definition>

## Patterns and idioms

> [template] Project-specific patterns not enforceable from `conventions/`. Example: "all controllers extend `BaseController`", "events dispatched through `Bus` singleton". Stack-level rules go in `conventions/[stack].md`. If none, write "N/A".

- <pattern>

## Things to know

> [template] Gotchas, constraints, surprising behaviors. Format: fact → consequence. Example: "DB writes are eventually consistent — read-your-writes is not guaranteed". If none, write "N/A".

- <thing>

## Validation mode

> [template] One value: `blocking` or `non-blocking`. Default: `non-blocking`. See `README.md` validation-mode section.

**validation:** <blocking | non-blocking>

## Triviality detection

> [template] One value: `enabled` or `disabled`. Default: `enabled`. When enabled, flows that match the triviality criteria collapse to single-agent inline execution per `HARNESS.md` §10. Setting `disabled` forces every flow through the standard clarifier + verifier subagent pipeline.

**triviality:** <enabled | disabled>

## Clarifier mode

> [template] One value: `auto` or `required`. Default: `auto`. With `auto`, the clarifier subagent is skipped when the prompt-completeness check passes per `HARNESS.md` §10. With `required`, the clarifier always runs.

**clarifier:** <auto | required>

## Where to find what

> [template] Pointer table: topic → path. Tells the agent where to dig deeper. Do not duplicate content here. If none, write "N/A".

| Topic | Path |
|---|---|
| <topic> | <path> |

## Out-of-scope topics

> [template] Subjects this project does not cover. Agent-direction — areas to avoid even when adjacent-looking. If none, write "N/A".

- <topic, or N/A>

## Reference links

> [template] External resources. Format: `<label> — <URL>`. Issue tracker, dashboards, design docs, chat channels. If none, write "N/A".

- <label> — <URL>

## Change log

> [template] Append-only during normal flow. One entry per modification of this file. Edits to existing entries are recorded in the Changes section below, not by rewriting the entry in place.

### <ISO 8601 timestamp> — <FEAT-NNNN | FIX-NNNN | REF-NNNN | human>

<one-paragraph summary of what changed and why>

## Changes

> [template] Records edits made to prior sections of this document after their original write. One entry per edit. Append-only.

### <ISO 8601 timestamp> — <FEAT-NNNN | FIX-NNNN | REF-NNNN | human>

**Edited section:** <section path>
**Reason:** <why>
**Summary of change:** <what>
