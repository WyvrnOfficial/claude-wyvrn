# Conventions: design

**Stack:** design
**Applies to extensions:** .css, .scss, .tsx, .jsx, .html, .rs, .xaml, .qml, .qss

**Guard:** this file applies ONLY when `.claude-wyvrn-local/conventions/design.md` exists in the project (created by `/wyvrn-apply-design`). If it is absent, the project has no declared brand -- skip this file entirely and apply no rule from it.

## Token contract

- The project's brand token files (paths declared in `.claude-wyvrn-local/conventions/design.md`) are the only source of visual values. Generated from `~/.claude-wyvrn/extensions/design-system/tokens/<brand>.tokens.json`; never edit generated token files by hand.
- No literal colors outside the token files. This covers hex (`#44d62c`), `rgb()`/`rgba()`, `hsl()`/`hsla()`, `0xRRGGBB`, `Color32::from_rgb*`, XAML `Color="#..."`, QML `color: "#..."`.
- No new color, radius, or font value without first adding a token to the project override file. "It is close enough to the brand green" is a violation.
- Do not restyle from screenshots of razer.com or wyvrn.com. Tokens are the contract.

## Surface and depth

- Depth comes from surface contrast between the `canvas` and `surface*` tokens -- never from drop shadows.
- The direction of the hierarchy is brand-specific and stated in the project design.md (Razer: cards darker than canvas; Wyvrn: surfaces lighter than a pure-black canvas).
- Glow is prohibited. The single exception: the Wyvrn `accent-glow` token where the project design.md sanctions it.

## Spacing

- Every spacing value (padding, margin, gap, inset) is a multiple of `spacing.unit` (4px).
- An off-grid value is allowed only with an adjacent comment citing its redline source.

## Typography

- Only the brand families (`font.display`, `font.body` tokens). No other family, including system fonts as the primary face.
- The font files must actually load: `@font-face` sources (web) or explicit font loading (native) pointing at assets that exist in the repo. Silently falling back to a system font is a violation, not a fallback.
- Uppercase micro-labels and eyebrows use the `tracking.eyebrow` token where the brand defines one.

## States

- Disabled: `opacity.disabled` token, and zero hover/press feedback while disabled.
- Press: brightness shift only. No scale bounce, no glow, no color swap to a non-token value.
- Focus: inset ring in the `accent` token. Never the browser/framework default outline in final UI.

## Prohibitions

- No framework-default look: default Tailwind palette classes (`bg-gray-*`, `text-blue-*`, `bg-slate-*`, ...), default shadcn/ui radii and shadows, unstyled browser form controls.
- No emoji as icons.
- No decorative animation beyond what a token or the project design.md declares. Motion is crisp and short; no infinite ambient loops in tools.

## Audit

Literal-value detection patterns per stack (used by `/wyvrn-design-audit`; token files themselves are excluded):

| Files | Color-literal patterns | Notes |
|---|---|---|
| `.css`, `.scss`, `.html` | `#[0-9a-fA-F]{3,8}\b`, `rgba?\(`, `hsla?\(` | also flag `font-family` not referencing token vars |
| `.tsx`, `.jsx` | same as CSS, in style objects, class strings, and SVG fills | also flag default Tailwind palette classes |
| `.rs` | `Color32::from_rgb`, `Color::from_rgb`, `0x[0-9a-fA-F]{6,8}` in UI code | tokens live in the generated `tokens.rs` |
| `.xaml` | `(Color\|Background\|Foreground\|Fill)="#` | tokens live in a ResourceDictionary |
| `.qml`, `.qss` | `color\s*:\s*"#`, `#[0-9a-fA-F]{3,8}\b` | tokens live in the generated QML/QSS artifact |

Completion rule: before declaring complete any task that touched files matching this stack, run the `/wyvrn-design-audit` checks in diff scope and fix the findings. This rule binds `/flow` Step 8 through convention authority.
