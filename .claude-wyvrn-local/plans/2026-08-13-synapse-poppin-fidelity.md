# 2026-08-13 - Synapse fidelity vs poppin (7 audit gaps)

## Task

An audit compared the Synapse design-system artifacts (tokens, generated files, recipes, apply-design skill) against their source of truth: the poppin components and its design-system bible page. Tokens were byte-faithful but 7 gaps broke the "nothing invented, drop-in" promise. The task closed all 7: (1) the tile-enter animation missing from tokens/generated artifacts, (2) RazerF5 Bold 700 missing from the font pipeline, (3) the Tag outline variant missing from recipes, (4) Select recipes covering only the md trigger, (5) the body baseline (canvas/white/display) applied nowhere, (6) 12 bible components without recipes including Tabs (the only radius-tabs consumer), (7) recurring literals (#5D5D5D, #707070, #454545, #6E6E6E) and the eyebrow pattern undocumented.

## Branch

feature/BJ_designSystemSkill (already appropriate, gitflow followed).

## Mistakes & corrections

- First em-dash scan used `grep -P '[\x{2013}\x{2014}]'`, which this Git Bash grep rejects ("character value too large") while the `|| echo CLEAN` fallback masked the failure as a pass. Corrected by rerunning with perl. Lesson: never OR a validation command into its own success message; check the tool actually ran.

## Global harness issues

- None. The generator's "adding a stack = adding one emitter" design held; the animation type slotted in cleanly.

## Files changed

- `extensions/design-system/tokens/synapse.tokens.json` - new `animate.tile-enter` token carrying the animation shorthand plus its keyframes (values verbatim from poppin globals.css).
- `extensions/design-system/scripts/generate-tokens.mjs` - handles the `animation` type in the theme.css/vars.css/scss emitters (rust skips web-only animation) and emits the brand body baseline (canvas background, text color or white, display face) in theme.css and vars.css when the brand defines canvas + display.
- `extensions/design-system/scripts/generate-tokens.test.mjs` - NEW zero-dep node:test smoke test: regenerates both brands, asserts the animation token, keyframes, body baseline (both brands) and the rust skip.
- `extensions/design-system/generated/{synapse,wyvrn}/*` - regenerated (synapse gains animation + baseline; wyvrn gains baseline via its own text token; tokens.rs byte-identical).
- `extensions/design-system/recipes/synapse-web.md` - Baseline section; recurring literals #454545/#5D5D5D/#707070/#6E6E6E; Tag outline variant + chip 0.56px rim + plain px-1.5; Select lg/sm/filled/label/panel sizing/z-50; 13 new component recipes (Eyebrow, Tabs, SegmentedControl, Slider, Tooltip, Menu, ConfirmDialog, SectionPanel, SettingRow, Skeleton, TextLink, InfoTip/NudgeTip); RazerF5Bold.woff (700) added to official sources (URL existence verified via HTTP 206).
- `skills/wyvrn-apply-design/SKILL.md` - Step 5 downloads the Bold woff too.

## Tests

- `generate-tokens.test.mjs` via `node --test`: 5/5 pass (regeneration, synapse animation+keyframes, body baseline both brands, vars.css completeness, scss variable + rust skip).

## Project-file updates

None (no PROJECT.md/ARCHITECTURE.md in this repo; README's design-system paragraph still accurate).

## Time saved (agent vs. human-only)

- Human-only baseline: ~4h (cross-repo audit of 20+ components against tokens/recipes/skill, generator extension, regeneration, recipe writing, font-source verification).
- Agent-assisted actual: ~25 min end to end (audit + fix).
- Time saved: ~3h 35m (90%).
- Basis: 9 files touched across two repos; the audit half (reading every poppin ui component and mapping it to recipe lines) dominates the human baseline; largest uncertainty is how fast a human already familiar with both repos would be.
