---
name: wyvrn-apply-design
description: Stamps the Synapse or Wyvrn brand onto the current project. Copies the right generated token artifact for the detected stack, downloads the brand fonts into the project from their official sources, aligns the document head, and writes the project-local design convention that activates brand enforcement in every future /flow. Slash command `/wyvrn-apply-design [synapse|wyvrn]`.
---

# wyvrn-apply-design

Applies one brand (synapse | wyvrn) to the current project. After this skill runs, `conventions/design.md` (global) becomes active for the project and every `/flow` touching styled files enforces the brand. The goal is a clean Synapse project, head included.

All prompts via `AskUserQuestion`. Parallelize independent reads and writes.

## Preconditions

- `~/.claude-wyvrn/VERSION` missing -> halt: `Wyvrn harness not installed. Run claude-wyvrn install.`
- `.claude-wyvrn-local/` missing -> halt: `Project not set up. Run claude-wyvrn setup first.`
- `~/.claude-wyvrn/extensions/design-system/` missing -> halt: `design-system extension missing. Reinstall the harness.`

## Step 1 -- Brand

From the argument (`synapse` or `wyvrn`). If absent or invalid: AskUserQuestion header `Brand`, options `[Synapse, Wyvrn]`, descriptions naming the surface hierarchy each implies (synapse: cards darker than canvas; wyvrn: surfaces lighter than a pure-black canvas, the wyvrn.com system).

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

## Step 4 -- Fonts (downloaded INTO the project)

The package does NOT ship font binaries; fonts land in each project from their official sources (`recipes/synapse-web.md` documents them).

1. Grep the project for existing brand font assets (`RazerF5*`, `Roboto*`) and `@font-face`/font-loading declarations. Skip whatever is already wired.
2. For synapse, two official sources:
   - Download the official woffs from the razer.com head: `https://www.razer.com/assets/fonts/RazerF5.woff` (400) and `https://www.razer.com/assets/fonts/RazerF5SemiBold.woff` (600). Confirm via AskUserQuestion header `Fonts` before fetching.
   - Or copy a RazerF5 set already present in a sibling Synapse project on disk, when one is reachable.
3. Destination: the project's font/assets folder (`src/assets/font/`, or `public/assets/fonts/` for plain-HTML projects).
4. Wire `@font-face` (`font-family: 'RazerF5'`, `font-display: swap`) per the recipes file. Roboto via `@fontsource/roboto` when npm is present.
5. Never fetch from any URL other than the official ones listed in the recipes file.

## Step 5 -- Document head (synapse)

Align `index.html` (or the host page) on the Synapse head, per the recipes template:

1. `<title>` format: `Razer <tool name> | For Gamers. By Gamers.`
2. Favicon: download `https://www.razer.com/favicon.png` (razer.com's own 96x96 PNG) to `/favicon.png`; link it with `type="image/png"`.
3. `<meta name="theme-color">` = the canvas token value. Charset utf-8, standard viewport.
4. Preload links for the local font files.

Show the head diff and confirm via AskUserQuestion before editing an existing head. Never touch meta tags outside this list.

## Step 6 -- Write the project convention

Write `.claude-wyvrn-local/conventions/design.md`:

```
# Conventions: design (project)

**Stack:** design
**Applies to extensions:** .css, .scss, .tsx, .jsx, .html, .rs, .xaml, .qml, .qss
**Brand:** <synapse|wyvrn>
**Token files:** <project-relative paths copied in Step 3>
**Fonts:** <wired | paths downloaded in Step 4>
**Recipes:** ~/.claude-wyvrn/extensions/design-system/recipes/<brand>-web.md

## Brand facts

- Surface hierarchy: <synapse: cards darker than canvas | wyvrn: surfaces lighter than pure-black canvas>.
- The green #44d62c exists ONLY as its token (`razer-green` in synapse, `accent` in wyvrn); never as a literal.
- <synapse: shadows only on floating overlays; glow prohibited | wyvrn: glow only via the accent-glow token>.
- <synapse: title format `Razer <name> | For Gamers. By Gamers.`, razer.com favicon>.

## Audit scope

- Token files above are excluded from literal-color checks.
- <extra exclusions, e.g. generated code, vendored folders -- or omit>

## Project-specific overrides

<deviations from the global design.md, each with a reason -- or "None.">
```

This file's existence is what activates the global `conventions/design.md` guard.

## Step 7 -- Sync project context

Invoke `/wyvrn-refresh-context` Mode B, scope `PROJECT.md`, proposed change: one line under stack summary naming the brand, the token file paths, and the font status.

## Step 8 -- Report

```
Brand applied: <brand>

Wrote:
  - <token file(s)>
  - <font files downloaded/copied>
  - <head changes>
  - .claude-wyvrn-local/conventions/design.md

Next:
  - /wyvrn-design-audit --full   # baseline the existing violations
  - git add <files> && /wyvrn-commit
```

## Boundaries

- Do NOT modify `~/.claude-wyvrn/`.
- Do NOT overwrite existing styles beyond the token files, fonts, head, and the wired import; restyling components is `/flow` work driven by the audit findings.
- Do NOT fetch from any URL not listed in the recipes file.
- Do NOT commit; the user commits via `/wyvrn-commit`.
