# design-system extension

Brand tokens and recipes for Synapse and Wyvrn, consumed by `/wyvrn-apply-design` and enforced by `conventions/design.md` + `/wyvrn-design-audit`.

## Contract

`tokens/<brand>.tokens.json` (W3C DTCG format) is the single source of truth for values. Everything under `generated/` is derived output -- never edit generated files by hand; edit the JSON and regenerate.

```
node scripts/generate-tokens.mjs            # all brands
node scripts/generate-tokens.mjs synapse    # one brand
```

## Brands and provenance

- **synapse** -- byte-faithful mirror of the poppin `@theme` (poppin/src/styles/globals.css, the Synapse 5 system redlined off the 'Poppin web app' Figma). Token names are poppin's own (`razer-green`, `off-white`, `grey`, `surface*`), so poppin can consume `generated/synapse/theme.css` verbatim. State rules, borders, motion, component recipes and the document-head template are in `recipes/synapse-web.md`, every line cited from poppin. Nothing invented.
- **wyvrn** -- extracted from the wyvrn.com design system (WyvrnOfficial/wyvrn, src/index.css).

## Generated formats

| File | Stack | Consumed by |
|---|---|---|
| `theme.css` | Tailwind 4 (`@theme`) | Vite/React apps (poppin-style) |
| `vars.css` | Any CSS | Plain web tools, Electron, Tauri |
| `tokens.scss` | SCSS | Legacy Sass builds |
| `tokens.rs` | Rust | egui / iced / Slint tools |

Adding a stack (XAML, QML, Unity USS, Python, C++ header) = one emitter function in `scripts/generate-tokens.mjs` wired into `FORMATS`, plus an audit pattern row in `conventions/design.md`. Tauri and Electron frontends are web: they use the CSS artifacts, no native generator needed.

## Fonts are NOT shipped here

Fonts are downloaded INTO each project by `/wyvrn-apply-design`, from official sources only: poppin's TTF set when reachable on disk, else the woffs razer.com itself serves (`https://www.razer.com/assets/fonts/RazerF5.woff`, `RazerF5SemiBold.woff`). Roboto comes from `@fontsource/roboto`. No binaries in this repository (public repo, proprietary font).
