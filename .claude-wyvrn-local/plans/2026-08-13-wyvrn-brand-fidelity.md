# 2026-08-13 - Wyvrn brand fidelity vs wyvrn.com reference

## Task

Same exercise as the synapse/poppin fidelity pass, for the wyvrn brand: audit the harness's wyvrn artifacts (tokens, generated files, conventions, apply-design skill) against the wyvrn.com reference implementation (WyvrnOfficial/wyvrn), then close the gaps. The reference is a shadcn/ui + Tailwind 3 + Radix site with HSL variables, structurally unlike poppin's bespoke system, and it carries its own slop (blue --ring from a copy slip, near-white --input, .glow-purple holding green, a dead Press Start 2P font, a hotlinked favicon).

## Branch

feature/BJ_designSystemSkill (already appropriate, gitflow followed).

## Decisions (user-confirmed)

- Keep the harness's semantic token names (canvas/surface/accent); document the shadcn mapping in the recipes.
- Curate the reference slop instead of graving it or fixing wyvrn.com first; every deviation is listed with its reason in recipes/wyvrn-web.md.
- Sanction the marketing ambient loops for the wyvrn brand via recipes; conventions/design.md carve-outs added (ambient loops + shadcn-based look).

## Mistakes & corrections

- None during implementation. Audit-phase note: opacity.disabled 0.4 in wyvrn.tokens.json looked plausible but was synapse doctrine imported into wyvrn; the reference standard is disabled:opacity-50 (17 components, exceptions 30/70). Lesson: cross-brand token reuse is a fidelity smell; verify each brand's values against its own reference.

## Global harness issues

- None. The animation-token support added earlier for synapse (tile-enter) absorbed wyvrn's float-soft with zero generator changes.

## Files changed

- `extensions/design-system/tokens/wyvrn.tokens.json` - opacity.disabled 0.4 -> 0.5 (reference standard); new `on-accent` #000000 (the site's primary-foreground); new `animate.float-soft` token with keyframes; $description now states the curated-extraction contract.
- `extensions/design-system/recipes/wyvrn-web.md` - NEW: shadcn<->harness token mapping, curated deviations list, states (color swaps not brightness), glow roles, container/typography, full motion vocabulary, component recipes (Button 6 variants, Card, Badge, Input, Tabs, Switch, prose links), wyvrn document head, font source.
- `extensions/design-system/generated/wyvrn/*` - regenerated (on-accent, 0.5, float-soft across theme.css/vars.css/scss; rust gets the color + opacity).
- `skills/wyvrn-apply-design/SKILL.md` - Step 5 wyvrn font path (sibling-copy TTF set, 'Razer F5' with space); Step 6 generalized to per-brand heads.
- `conventions/design.md` - two wyvrn carve-outs: sanctioned shadcn usage, sanctioned ambient loops on marketing surfaces.
- `extensions/design-system/README.md` + root `README.md` - wyvrn provenance/curation and per-brand recipes wording; synapse Bold woff added to the font list.
- `extensions/design-system/scripts/generate-tokens.test.mjs` - new wyvrn assertions (on-accent, opacity 0.5, float-soft + keyframes).

## Tests

- `generate-tokens.test.mjs` via `node --test`: 6/6 pass (the new wyvrn artifact test included).

## Project-file updates

None (harness source repo; READMEs updated as part of the task itself).

## Time saved (agent vs. human-only)

- Human-only baseline: ~5h (auditing a 50-component shadcn site against the harness, HSL->hex verification, doctrine conflicts to arbitrate, recipes authoring, skill/convention updates).
- Agent-assisted actual: ~30 min including the three user decisions.
- Time saved: ~4h 30m (90%).
- Basis: 9 files touched, one new 100-line recipes file; the audit half (HSL conversions, slop identification, component reads) dominates; largest uncertainty is the arbitration time a human would spend on the naming/curation/motion decisions.
