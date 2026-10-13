# Synapse web recipes

Every rule below is extracted from the Synapse 5 reference implementation, measured against the Figma redlines. Nothing is invented. When a recipe and a new Figma redline disagree, the Figma wins and this file gets updated.

## States

- **Selection/hover rings are INSET RINGS**: `inset-ring-2` + `inset-ring-<color>` (Tailwind v4 box-shadow utilities). NEVER borders, NEVER outlines: no layout shift, and the ring shares the element's exact rounded edge. A reserved transparent border leaks a halo; an outline with negative offset lets the background peek at fractional DPI. Both banned.
  - Rest: `inset-ring-white/50`. Hover: `hover:inset-ring-white/70`. Selected: `inset-ring-razer-green/50` (profile cards, detection rows, tiles).
- **Hover** on filled controls: `hover:brightness-110`. On bordered fields: lighten the border (`border-white/15 -> hover:border-white/30`; text inputs: `#444444 -> hover:border-white/30`).
- **Press**: `active:brightness-90`. Color only, no scale, no glow.
- **Disabled = zero feedback**: `disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:brightness-100` (every interactive primitive).
- **Transitions**: `transition-[filter] duration-100` (or `transition-[border-color,filter]`, `transition-[background-color,filter]`). 100ms everywhere; the one entrance animation is the `animate-tile-enter` token (tile-enter 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both, rise-and-fade, no glow) - shipped with its keyframes in the generated theme.css/vars.css; non-Tailwind stacks copy the keyframes from vars.css.
- Gotcha: `hover:brightness` creates a stacking context; hosts of dropdown panels need `focus-within:z-50` (Select, profile pill).

## Baseline

- The generated theme.css/vars.css carries the brand baseline on `body`: `background-color` = canvas, `color` = plain white, `font-family` = the display face. SCSS/Rust projects apply the same three rules themselves.

## Shadows

- Static surfaces NEVER carry shadows: depth is surface contrast (surface darker than canvas).
- Floating overlays are the only exception: Select panels, menus and tooltips carry `shadow-lg`.

## Recurring values that are recipes, not tokens

- Hairline border: `border-white/15`, hover `border-white/30` (Select trigger, circular icon buttons).
- Text-input idle border: `#444444` (every text input aligns on it). Focus: `border-white/40`.
- Rim on green fills: `border-black/30` (primary Button, Toggle track).
- Grey scale: white -> `off-white #CCCCCC` -> `grey #999999` -> `white/40` placeholders. `#D6D6D6` does not exist.
- Chip fill: `#454545` (Tag chip and plain); the outline state pill sits on `#44444440`.
- Info disc fill: `#5D5D5D` (the InfoTip "?" and NudgeTip "!" glyph discs).
- Dimmed label: `#707070` (SOON-dimmed main labels, sub-row micro labels).
- Toggle OFF track: `#6E6E6E`.

## Component recipes (exact classes)

- **Button**: `h-8 px-4 rounded-sm font-display uppercase text-xs` + the state block above. primary: `bg-razer-green text-ink-soft border border-black/30`. outline: `border-razer-green text-razer-green bg-transparent`. danger: `bg-danger text-white border-black/30`. sm: `h-[30px]`.
- **Input**: `h-10 rounded-sm border-[#444444] bg-surface px-4 font-display text-sm placeholder:text-white/40`. One height for every text input: 40px. Leading icon: 16px inset, 16px glyph, 10px to the placeholder (`pl-[42px]`).
- **Select**: trigger md `h-8 px-2 rounded-sm border-white/15 font-display text-sm`; lg `h-10` (rides beside the 40px text inputs); sm `h-[17.72px] text-[9px]` (the compact sidebar pill). A labeled (filter) trigger adds `bg-surface`; the inline label `font-display text-base text-off-white`, `gap-2` to the box. Panel `bg-surface border-white/15 rounded-sm shadow-lg w-max min-w-full`, drops up when short of space; options `h-8 px-2 hover:bg-surface-active` (sm: `h-6 text-[9px]`), current option `text-razer-green`. Root carries `focus-within:z-50`.
- **Toggle**: track 32x18 `rounded-full border-black/30`, ON `bg-razer-green`, OFF `bg-[#6E6E6E]`; knob `bg-ink` 14px. sm: 28x16, knob 12px.
- **Tag**: chip `h-4 gap-2 rounded-lg bg-[#454545] px-2 font-display text-2xs` + 8px dot (`bg-razer-green` active / `bg-off-white` inactive); active rim `border-[0.56px] border-[#44D62C4D]`. outline (state pill): `h-3 justify-center whitespace-nowrap rounded-lg border-[0.5px] border-white/25 bg-[#44444440] px-2 font-body text-[8px]/4`, active rim `border-[#44D62C4D]`, no dot. plain (SOON): `h-4 rounded-sm border-white/8 bg-[#454545] px-1.5 font-body text-[9.8px] uppercase text-grey`, no dot, no tone.
- **IconButton**: circle `rounded-full border-white/15 bg-surface` (sm 32, md 52, lg 84); square 32x32 `rounded-md border-white/[.18] bg-[#0D0D0F]/70`.
- **ProfileCard**: 115x65 `rounded-lg p-2 inset-ring-2` + the design veil gradient; name Roboto 400 11/14.4, 0.3px tracking, caps, 2 lines max.
- **Title**: display `font-display text-2xl/none uppercase [text-box:trim-both_cap_alphabetic]`; secondary `font-body text-xl/4 uppercase text-center`.
- **Subtitle**: `font-body text-sm text-off-white text-center`, `leading-none` or caps `leading-4`.
- **Eyebrow**: `font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70` (section heads); accent variant `text-razer-green` (form legends).
- **Tabs**: bar `inline-flex items-center gap-1 rounded-tabs border border-white/30 p-1`; item `rounded-full px-4 py-1.5 font-display text-sm`, active `bg-razer-green text-ink-soft`, idle `text-white/60 hover:text-white`.
- **SegmentedControl**: bar `h-[30px] rounded-full border border-white/15 p-[3px]`; item `h-6 rounded-full px-3 font-body text-[11px]`, active `bg-razer-green text-ink-soft`, idle `text-grey hover:text-white`.
- **Slider**: track `h-1 rounded-full bg-white/15`, fill `bg-razer-green`, thumb 14px (`size-3.5`) `rounded-full bg-razer-green`, `focus-visible:brightness-125`.
- **Tooltip**: panel `rounded-md border border-white/15 bg-surface px-3 py-2 font-display text-xs/5 normal-case tracking-normal text-white shadow-lg`; the 2px offset is PADDING on the positioned wrapper (a hover bridge, not a dead gap); flips to right alignment at the viewport edge.
- **Menu**: bare `size-8 rounded-sm` trigger; panel `rounded-md border border-white/15 bg-surface py-1 shadow-lg w-max min-w-28`, 2px below and 12px left of the dots; item `h-7 px-3 font-body text-sm hover:text-razer-green`.
- **ConfirmDialog**: overlay `bg-ink/60`; panel `w-[420px] rounded-lg border border-white/15 bg-surface p-6`; title `font-body text-base uppercase`, body `font-body text-[13px]/5 text-grey`; Cancel outline Button + confirm Button (danger for irreversible actions).
- **SectionPanel**: `rounded-lg bg-surface-raised p-6`; title `font-body text-xl uppercase text-razer-green` with the master Toggle beside it; footnote `font-body text-[11px] text-grey`; switched off = the whole body at 40% + `inert`, descendant opacity flattened to keep the dim uniform.
- **SettingRow**: main `h-[54px]`, label `font-body text-xs uppercase text-white` (dimmed `#707070` while SOON); sub rows `h-9 pl-4 -mt-[13px]`, micro label `font-body text-[11px] tracking-eyebrow text-[#707070]`.
- **Skeleton**: `animate-pulse bg-white/5`, sized by the caller to what it stands in for.
- **TextLink**: `font-display text-razer-green underline underline-offset-2` + the brightness states.
- **InfoTip / NudgeTip**: `#5D5D5D` disc glyphs (the "?" 16px disc in a 24 box; the "!" 20px disc, sm 14px), `hover:brightness-125`, tooltip revealed on hover or focus.

## Document head

The clean Synapse head:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#282828" />
    <title>Razer TOOL_NAME | For Gamers. By Gamers.</title>
    <link rel="preload" href="/assets/fonts/RazerF5.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="/assets/fonts/RazerF5SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />
  </head>
</html>
```

- Title format follows razer.com: `NAME | For Gamers. By Gamers.` (razer.com serves `Razer United States | For Gamers. By Gamers.`).
- Favicon: the razer.com favicon byte for byte (96x96 PNG, served at `https://www.razer.com/favicon.png`), shipped as `/favicon.png`. razer.com mislabels `type` as image/x-icon; use image/png.
- `theme-color` is the canvas token.

## Fonts: official sources

RazerF5 is downloaded INTO the project, never hotlinked, never shipped in this repo. The reference implementation declares three weights: 400, 600 and 700 (`font-bold` display type exists: the config hero title, bold eyebrows). Official woff URLs, straight from razer.com:

- `https://www.razer.com/assets/fonts/RazerF5.woff` (weight 400)
- `https://www.razer.com/assets/fonts/RazerF5SemiBold.woff` (weight 600)
- `https://www.razer.com/assets/fonts/RazerF5Bold.woff` (weight 700)
- `https://www.razer.com/assets/fonts/RazerF5Light.woff` (weight 300, optional)

If a RazerF5 set (TTF or woff) already exists in a sibling Synapse project on disk, copying it is equally valid. Roboto comes from `@fontsource/roboto` (400). Declare with `@font-face`, `font-display: swap`:

```css
@font-face {
  font-family: 'RazerF5';
  src: url('../assets/font/RazerF5.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```
