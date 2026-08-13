# Wyvrn web recipes

Every rule below is extracted from the wyvrn.com reference implementation (WyvrnOfficial/wyvrn: src/index.css, tailwind.config.ts, src/components/ui). The extraction is CURATED: the reference carries a few known bugs, corrected here and listed under "Curated deviations". Outside that list, when a recipe and the reference disagree, the reference wins and this file gets updated.

## Token mapping (harness name <-> site variable)

Harness token names are the stable contract; the reference speaks shadcn. Shadcn projects map tokens through `tailwind.config` colors.

| Harness token | Site variable (HSL) |
|---|---|
| `canvas` | `--background` (0 0% 0%) |
| `surface` | `--card`, `--secondary`, `--border` (0 0% 10%) |
| `surface-overlay` | `--popover` (0 0% 5%) |
| `surface-muted` | `--muted` (0 0% 15%) |
| `accent` | `--primary`, `--green`, `--accent`, `--glow-green` (112 67.5% 50.6%) |
| `accent-dark` | `--primary-dark` (112 67.5% 40%) |
| `accent-light` | `--primary-light` (112 67.5% 65%) |
| `on-accent` | `--primary-foreground` (0 0% 0%) |
| `text` | `--foreground` (0 0% 100%) |
| `text-muted` | `--muted-foreground` (0 0% 65%) |
| `border-strong` | `--cardborder` (0 0% 65%) |
| `danger` | `--destructive` (0 84% 60%) |

## Curated deviations (each with its reason)

- `--ring` ships as hue 211 (a blue) on the site: a copy slip of the primary HSL. Focus rings use the accent.
- `--input` ships as 0 0% 99% (a near-white border): field borders use `border` / `border-strong` instead.
- `.glow-purple` carries a GREEN rgba despite its name: the glows below are named by role, values kept.
- `Press Start 2P` (`font-pixel`) is declared in tailwind.config and hotlinked from Google Fonts but used nowhere in src: excluded from the brand. Do not hotlink fonts.
- The favicon is hotlinked to an external upload bucket while `public/favicon.ico` exists: ship the icon locally.

## States

- **Hover and press are COLOR SWAPS through tokens**, not brightness filters (brightness is synapse language): `bg-accent -> hover:bg-accent-light -> active:bg-accent-dark`, `transition-colors` (~150-300ms).
- **Focus**: `focus-visible:ring-2` with the accent + `ring-offset-background`.
- **Disabled**: `disabled:opacity-50 disabled:pointer-events-none` (sparse exceptions at 30 and 70 stay at their use sites).

## Depth and glow

- Surfaces sit LIGHTER than the pure-black canvas: overlay 5%, card 10%, muted 15%.
- Glow is sanctioned only from the accent (`accent-glow`), three roles: box `0 0 30px rgba(68,214,44,0.3)`, soft box `0 0 40px rgba(68,214,44,0.2)`, text `0 0 20px rgba(68,214,44,0.5)`. Also the radial wash `radial-gradient(circle at center, rgba(68,214,44,0.15) 0%, transparent 70%)`.
- Overlays keep their stock shadcn shadows (Switch thumb `shadow-lg`, active tab `shadow-sm`).

## Layout and typography

- Container: centered, 2rem side padding, max 1400px at 2xl.
- Body: `'Razer F5'` on the black canvas, `antialiased`. Headings h1-h6: `font-bold tracking-tight`.
- Weights in the brand set: 100 Thin, 400 (+ italic), 600 Semibold, 700 (+ italic).

## Motion

Ambient loops are SANCTIONED on wyvrn marketing surfaces: this brand is the exception to the global no-ambient-loops rule (tools keep the ban).

- `animate-float-soft` token: float-soft 4s ease-in-out infinite (translateY 0 -> -8px -> 0).
- accordion-down/up 0.2s ease-out (Radix height vars); testimonial-progress 6s linear (duration synced inline with the JS interval).
- Scroll reveal: fade-in-up material (opacity 0 + translateY(30px) -> visible), 0.8s ease-out, stagger delays 0.1-0.5s (`scroll-animate` + `-delay-1..5`).
- Ambient washes: rgb-flow-1/2/3 15/20/25s ease-in-out infinite (the 20s one reversed), slow-zoom 30s alternate (scale 1 -> 1.1), color-shift 20s (hue-rotate cycle).
- Chroma hero slides: in/out left/right, 0.3s ease-out forwards.

## Component recipes (exact classes)

Components are shadcn/ui on Radix; the brand character is the tokens plus the variants below. Anything not listed is stock shadcn.

- **Button**: base `rounded-md text-base font-medium transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50`. default: `bg-accent text-on-accent hover:bg-accent-light active:bg-accent-dark`. destructive: `bg-danger text-white hover:bg-danger/90`. outline: `border border-accent text-accent bg-transparent hover:bg-accent/20 hover:text-accent-light hover:border-accent-light active:bg-accent-dark/10`. secondary: `border border-text-muted text-text-muted bg-black hover:border-white hover:bg-[#444] hover:text-white active:bg-[#222]`. ghost: `hover:bg-black`. link: `text-accent underline-offset-4 hover:underline`. Sizes: default `h-10 px-4`, sm `h-9 px-4`, lg `h-11 px-8`, icon `h-10 w-10`.
- **Card**: `rounded-lg bg-surface`; header `p-6`; title `text-2xl font-bold leading-tight tracking-tight`; description `text-sm text-text-muted`; content/footer `p-6 pt-0`.
- **Badge**: `rounded-full border px-2.5 py-0.5 text-xs font-semibold`; default `bg-accent text-on-accent hover:bg-accent/80`; secondary `bg-text-muted/20 text-white`; destructive `bg-danger text-white`.
- **Input**: `h-10 rounded-md bg-surface px-3 py-2 text-base placeholder:text-text-muted` (border per the curated deviations, not the site's `--input`).
- **Tabs**: list `h-12 rounded-md bg-surface-muted p-1 text-text-muted`; trigger `rounded-sm px-3 py-1.5 font-medium text-white`, active `bg-accent text-black shadow-sm`.
- **Switch**: track 44x24 `rounded-full border-2 border-transparent`, checked `bg-accent`; thumb 20px `rounded-full bg-canvas shadow-lg`, checked `translate-x-5`.
- **Links** (prose/blog): accent color, underline offset 3px thickness 1.5px, `font-weight: 600`, hover wash `color-mix(accent 12%, transparent)`, visited stays accent (no purple).

## Document head

Template from the reference index.html; no razer.com title format here (that is synapse):

- `<title>` pattern: `WYVRN` (site root) or `WYVRN <page>`.
- `meta description` + matching `og:` and `twitter:` pairs (og:type website, og:image 1200x630, twitter:card summary_large_image, twitter:site @WYVRN_Official).
- `link rel="canonical"` on the page URL; JSON-LD `Organization` and `WebSite` blocks.
- Favicon: `/favicon.ico`, shipped locally (see curated deviations).

## Fonts: source

The brand set is the 6-weight dehinted RazerF5 TTF family under `src/assets/font/` of the reference repo (with `COPYRIGHT.txt` and `LICENSE.txt`; `RazerF5.zip` archives the set). No official woff endpoint exists for this set: copy it, license files included, from a sibling wyvrn checkout. Family name is `'Razer F5'` (WITH the space, unlike synapse's `'RazerF5'`), `font-display: swap`.
