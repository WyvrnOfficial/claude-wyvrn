# Synapse web recipes

Every rule below is extracted from the Synapse 5 reference implementation, measured against the Figma redlines. Nothing is invented. When a recipe and a new Figma redline disagree, the Figma wins and this file gets updated.

## States

- **Selection/hover rings are INSET RINGS**: `inset-ring-2` + `inset-ring-<color>` (Tailwind v4 box-shadow utilities). NEVER borders, NEVER outlines: no layout shift, and the ring shares the element's exact rounded edge. A reserved transparent border leaks a halo; an outline with negative offset lets the background peek at fractional DPI. Both banned.
  - Rest: `inset-ring-white/50`. Hover: `hover:inset-ring-white/70`. Selected: `inset-ring-razer-green/50` (profile cards, detection rows, tiles).
- **Hover** on filled controls: `hover:brightness-110`. On bordered fields: lighten the border (`border-white/15 -> hover:border-white/30`; text inputs: `#444444 -> hover:border-white/30`).
- **Press**: `active:brightness-90`. Color only, no scale, no glow.
- **Disabled = zero feedback**: `disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:brightness-100` (every interactive primitive).
- **Transitions**: `transition-[filter] duration-100` (or `transition-[border-color,filter]`, `transition-[background-color,filter]`). 100ms everywhere; the one entrance animation is tile-enter, 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), rise-and-fade, no glow.
- Gotcha: `hover:brightness` creates a stacking context; hosts of dropdown panels need `focus-within:z-50` (Select, profile pill).

## Shadows

- Static surfaces NEVER carry shadows: depth is surface contrast (surface darker than canvas).
- Floating overlays are the only exception: Select panels, menus and tooltips carry `shadow-lg`.

## Recurring values that are recipes, not tokens

- Hairline border: `border-white/15`, hover `border-white/30` (Select trigger, circular icon buttons).
- Text-input idle border: `#444444` (every text input aligns on it). Focus: `border-white/40`.
- Rim on green fills: `border-black/30` (primary Button, Toggle track).
- Grey scale: white -> `off-white #CCCCCC` -> `grey #999999` -> `white/40` placeholders. `#D6D6D6` does not exist.

## Component recipes (exact classes)

- **Button**: `h-8 px-4 rounded-sm font-display uppercase text-xs` + the state block above. primary: `bg-razer-green text-ink-soft border border-black/30`. outline: `border-razer-green text-razer-green bg-transparent`. danger: `bg-danger text-white border-black/30`. sm: `h-[30px]`.
- **Input**: `h-10 rounded-sm border-[#444444] bg-surface px-4 font-display text-sm placeholder:text-white/40`. One height for every text input: 40px. Leading icon: 16px inset, 16px glyph, 10px to the placeholder (`pl-[42px]`).
- **Select**: trigger `h-8 px-2 rounded-sm border-white/15 font-display text-sm`; panel `bg-surface border-white/15 rounded-sm shadow-lg`, drops up when short of space; options `h-8 px-2 hover:bg-surface-active`, current option `text-razer-green`.
- **Toggle**: track 32x18 `rounded-full border-black/30`, ON `bg-razer-green`, OFF `bg-[#6E6E6E]`; knob `bg-ink` 14px. sm: 28x16.
- **Tag**: chip `h-4 rounded-lg bg-[#454545] px-2 font-display text-2xs` + 8px dot (`bg-razer-green` active / `bg-off-white` inactive); active rim `border-[#44D62C4D]`. plain (SOON): `h-4 rounded-sm border-white/8 bg-[#454545] font-body text-[9.8px] uppercase text-grey`.
- **IconButton**: circle `rounded-full border-white/15 bg-surface`; square 32x32 `rounded-md border-white/[.18] bg-[#0D0D0F]/70`.
- **ProfileCard**: 115x65 `rounded-lg p-2 inset-ring-2` + the design veil gradient; name Roboto 400 11/14.4, 0.3px tracking, caps, 2 lines max.
- **Title**: display `font-display text-2xl/none uppercase [text-box:trim-both_cap_alphabetic]`; secondary `font-body text-xl/4 uppercase text-center`.
- **Subtitle**: `font-body text-sm text-off-white text-center`, `leading-none` or caps `leading-4`.

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

RazerF5 is downloaded INTO the project, never hotlinked, never shipped in this repo. Official woff URLs, straight from the razer.com head:

- `https://www.razer.com/assets/fonts/RazerF5.woff` (weight 400)
- `https://www.razer.com/assets/fonts/RazerF5SemiBold.woff` (weight 600)
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
