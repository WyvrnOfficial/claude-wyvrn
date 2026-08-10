---
name: wyvrn-design-audit
description: Mechanically audits styled code against the project's declared brand (tokens-only colors, 4px grid, brand fonts actually loaded, no framework-default look). Reports findings; never edits. Slash command `/wyvrn-design-audit [--full]`. Default scope is the current diff; --full sweeps the whole project.
---

# wyvrn-design-audit

Read-only audit of styled code against `conventions/design.md` (global) + `.claude-wyvrn-local/conventions/design.md` (project). Returns a findings list. Fixing is `/flow` work.

## Preconditions

- `~/.claude-wyvrn/VERSION` missing -> halt: `Wyvrn harness not installed. Run claude-wyvrn install.`
- `.claude-wyvrn-local/conventions/design.md` missing -> halt: `No brand declared. Run /wyvrn-apply-design first.`

## Scope

- **Default (diff):** files changed on the working tree plus the current branch vs its gitflow base, filtered to the design extensions (`.css`, `.scss`, `.tsx`, `.jsx`, `.html`, `.rs`, `.xaml`, `.qml`, `.qss`).
- **`--full`:** every file with those extensions in the project, excluding `node_modules/`, `dist/`, `build/`, `target/`, vendored folders, and the exclusions listed under `Audit scope` in the project design.md.
- Token files declared in the project design.md are always excluded from literal-value checks.

## Checks (issue all greps in one parallel batch)

1. **Color literals** -- per-stack patterns from the global design.md audit table. Every hit outside token files is a finding.
2. **Off-grid spacing** -- px values in spacing contexts (`padding`, `margin`, `gap`, `inset`, `top/right/bottom/left`, Tailwind arbitrary values `p-[Npx]`) not divisible by 4 and lacking an adjacent redline comment.
3. **Fonts** -- (a) `font-family` / font constants referencing families outside the brand tokens; (b) declared `@font-face` sources or native font loads whose asset files do not exist in the repo; (c) brand family named nowhere at all (the tool silently ships system fonts).
4. **Framework-default look** -- default Tailwind palette classes (`bg-gray-*`, `text-blue-*`, `bg-slate-*`, `text-red-*`, ...), shadcn default shadows (`shadow-md`+ on cards), browser-default form controls in final UI, default focus outlines.
5. **Glow and shadows** -- `box-shadow`/`text-shadow`/`drop-shadow` hits; allowed only when the project design.md sanctions the wyvrn `accent-glow` token and the value references it.
6. **Emoji as icons** -- emoji codepoints inside JSX/HTML element content acting as UI glyphs (buttons, labels, nav).

## Report

Group by check, ordered by count descending:

```
Design audit -- <brand>, scope: <diff|full>, N files scanned

[colors]    12 findings
  src/App.tsx:88   #22c55e in inline style        -> color.accent? add a token if intentional
  ...
[spacing]    3 findings
[fonts]      1 finding
[defaults]   5 findings
[glow]       0 findings
[emoji]      2 findings

Total: 23 findings in 9 files. Clean checks: glow.
```

Every finding: `file:line`, the offending value, and the nearest token or rule it should use. If zero findings: `Design audit clean -- <brand>, N files.`

## After the report

- Inside a `/flow` (Step 8 completion rule): the flow fixes diff-scope findings before declaring done.
- Standalone: offer `/flow fix the design audit findings` as the follow-up. Do not start editing inside this skill.

## Boundaries

- Read-only. Never edit files, never auto-fix.
- Do not judge aesthetics; only the mechanical rules above. Taste lives in the conventions, not the audit.
