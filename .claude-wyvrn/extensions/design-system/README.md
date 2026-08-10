# design-system extension

Brand tokens for Razer (Synapse 5) and Wyvrn, consumed by `/wyvrn-apply-design` and enforced by `conventions/design.md` + `/wyvrn-design-audit`.

## Contract

`tokens/<brand>.tokens.json` (W3C DTCG format) is the single source of truth. Everything under `generated/` is derived output -- never edit generated files by hand; edit the JSON and regenerate.

```
node scripts/generate-tokens.mjs           # all brands
node scripts/generate-tokens.mjs razer     # one brand
```

## Generated formats

| File | Stack | Consumed by |
|---|---|---|
| `theme.css` | Tailwind 4 (`@theme`) | Vite/React apps (poppin-style) |
| `vars.css` | Any CSS | Plain web tools, Electron, Tauri |
| `tokens.scss` | SCSS | Legacy Sass builds |
| `tokens.rs` | Rust | egui / iced / Slint tools |

Adding a stack (XAML, QML, Unity USS, Python, C++ header) = one emitter function in `scripts/generate-tokens.mjs` wired into `FORMATS`, plus an audit pattern row in `conventions/design.md`. Tauri and Electron frontends are web: they use the CSS artifacts, no native generator needed.

## Token semantics shared across brands

`color.canvas` / `color.surface*` (depth by contrast -- direction is brand-specific), `color.accent`, `color.text*`, `font.display` / `font.body`, `spacing.unit` (4px grid), `radius.*`, `opacity.disabled`.

Brand-specific facts live in each JSON's `$description`: Razer cards sit darker than the canvas and glow is prohibited; Wyvrn surfaces sit lighter than a pure-black canvas and glow exists only as `color.accent-glow`.

## Fonts are NOT shipped here

RazerF5 is a proprietary Razer asset and this repository is public. `/wyvrn-apply-design` verifies the target project carries the font files and points to an internal source when missing. Roboto is fetchable from Fontsource/Google Fonts.
