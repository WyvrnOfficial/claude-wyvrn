---
name: wyvrn-apply-design
description: Stamps the Razer or Wyvrn brand onto the current project. Copies the right generated token artifact for the detected stack, verifies fonts, and writes the project-local design convention that activates brand enforcement in every future /flow. Slash command `/wyvrn-apply-design [razer|wyvrn]`.
---

# wyvrn-apply-design

Applies one brand (razer | wyvrn) to the current project. After this skill runs, `conventions/design.md` (global) becomes active for the project and every `/flow` touching styled files enforces the brand.

All prompts via `AskUserQuestion`. Parallelize independent reads and writes.

## Preconditions

- `~/.claude-wyvrn/VERSION` missing -> halt: `Wyvrn harness not installed. Run claude-wyvrn install.`
- `.claude-wyvrn-local/` missing -> halt: `Project not set up. Run claude-wyvrn setup first.`
- `~/.claude-wyvrn/extensions/design-system/` missing -> halt: `design-system extension missing. Reinstall the harness.`

## Step 1 -- Brand

From the argument (`razer` or `wyvrn`). If absent or invalid: AskUserQuestion header `Brand`, options `[Razer (Synapse 5), Wyvrn]`, descriptions naming the surface hierarchy each implies.

## Step 2 -- Stack detection (parallel batch)

Read manifests and probe in one batch: `package.json`, `Cargo.toml`, `*.csproj`, `CMakeLists.txt`, plus a Glob for `*.css`/`*.scss` entry points.

Decision table (first match wins):

| Signal | Artifact to copy | Default destination |
|---|---|---|
| `tailwindcss` >= 4 in package.json | `generated/<brand>/theme.css` | alongside the main CSS entry |
| `tailwindcss` 3.x | `generated/<brand>/vars.css` + note: map vars into `tailwind.config` | alongside the main CSS entry |
| `.scss` sources present | `generated/<brand>/tokens.scss` | the styles folder |
| package.json without Tailwind (incl. Electron, Tauri frontends) | `generated/<brand>/vars.css` | the styles folder |
| `Cargo.toml` with `egui`/`eframe`/`iced`/`slint` | `generated/<brand>/tokens.rs` | `src/theme/` |
| None of the above | AskUserQuestion: which artifact and where | -- |

A project can match twice (e.g. Tauri = Cargo.toml + a web frontend): copy for each matched surface.

## Step 3 -- Copy tokens

1. Propose the destination path(s) via AskUserQuestion header `Tokens`, option 1 the default from the table, option 2 an alternative folder.
2. If the destination file already exists and differs: show a summary, confirm overwrite. Never overwrite silently.
3. Copy from `~/.claude-wyvrn/extensions/design-system/generated/<brand>/`. Wire the import (e.g. `@import './theme.css';` after `@import 'tailwindcss';`, or `mod theme;`) if the entry point is unambiguous; otherwise report the one-line wiring instruction.

## Step 4 -- Fonts

The package does NOT ship font binaries (RazerF5 is proprietary; the harness repo is public).

1. Grep the project for existing brand font assets (`RazerF5*.ttf`, `Roboto*`) and `@font-face`/font-loading declarations.
2. Present: found and wired / found but not wired / missing. If missing, state the internal source (the poppin repo carries the RazerF5 set under `src/assets/font/`; Roboto via `@fontsource/roboto`) and ask whether to copy from a user-supplied path now or record as a TODO in the project design.md.
3. Never fetch fonts from the internet without explicit confirmation.

## Step 5 -- Write the project convention

Write `.claude-wyvrn-local/conventions/design.md`:

```
# Conventions: design (project)

**Stack:** design
**Applies to extensions:** .css, .scss, .tsx, .jsx, .html, .rs, .xaml, .qml, .qss
**Brand:** <razer|wyvrn>
**Token files:** <project-relative paths copied in Step 3>
**Fonts:** <wired | TODO: copy RazerF5 from <source>>

## Brand facts

- Surface hierarchy: <razer: cards darker than canvas | wyvrn: surfaces lighter than pure-black canvas>.
- Accent: the green #44d62c exists ONLY as the `accent` token; never as a literal.
- <razer: glow prohibited outright | wyvrn: glow only via the accent-glow token>.

## Audit scope

- Token files above are excluded from literal-color checks.
- <extra exclusions, e.g. generated code, vendored folders -- or omit>

## Project-specific overrides

<deviations from the global design.md, each with a reason -- or "None.">
```

This file's existence is what activates the global `conventions/design.md` guard.

## Step 6 -- Sync project context

Invoke `/wyvrn-refresh-context` Mode B, scope `PROJECT.md`, proposed change: one line under stack summary naming the brand, the token file paths, and the font status.

## Step 7 -- Report

```
Brand applied: <brand>

Wrote:
  - <token file(s)>
  - .claude-wyvrn-local/conventions/design.md

Fonts: <status>
Next:
  - /wyvrn-design-audit --full   # baseline the existing violations
  - git add <files> && /wyvrn-commit
```

## Boundaries

- Do NOT modify `~/.claude-wyvrn/`.
- Do NOT overwrite existing styles beyond the token files and the wired import; restyling components is `/flow` work driven by the audit findings.
- Do NOT commit; the user commits via `/wyvrn-commit`.
