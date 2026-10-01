# Design Notes — Hafs Ibrahim Portfolio Theme-Switcher Prototype

## Mission
Demonstrate **dynamic theme switching**: one content/structure system with multiple genuinely distinct themes the visitor can switch between at runtime.

## Themes implemented
1. **Swiss** — near-black canvas, single chartreuse accent, IBM Plex Mono, 1px grid lines, sharp rectangles (the existing Type-as-Structure look).
2. **Paper** — warm paper ground, single vermilion ink accent, grotesque/serif display pairing, same structural grid but airier.
3. **Blueprint** — deep drafting blue, pale drafting-white accent, grotesque everywhere, 1px drafting-grid texture on ground.

Every theme is **genuinely distinct** — different palette, type system, and texture — NOT a light/dark inversion of the same theme.

## Token-driven architecture
Each theme = a full set of CSS custom properties scoped under `[data-theme="..."]`.  
Switching = one attribute swap on the `<html>` element; zero content re-render, zero layout jank, no flash-of-wrong-theme (inline bootstrap script reads `localStorage` and sets the attribute before first paint).

### Theme-token reference

#### Swiss (`[data-theme="swiss"]`)
```css
/* Palette */
--bg:         #0a0a0a;    /* Near-black canvas */
--bg-raised:  #111111;    /* Hover state */
--bg-card:    #161616;    /* Card backgrounds */
--fg:         #e8e8e8;    /* Primary text */
--fg-dim:     #808080;    /* Secondary text (adjusted for 4.5+ contrast) */
--fg-muted:   #7d7d7d;    /* Tertiary / labels (adjusted for 4.5+ contrast) */
--accent:     #b4ff39;    /* Electric chartreuse — single accent color */
--accent-soft:rgba(180, 255, 57, 0.12);  /* Accent background tint */
--btn-fg:     #0a0a0a;    /* Button text on accent */
--line:       #222222;    /* Grid lines, dividers */
--line-strong:#333333;    /* Interactive borders */

/* Typography */
--font-body:  'IBM Plex Mono', 'Menlo', 'Consolas', monospace;
--font-display:'IBM Plex Mono', 'Menlo', 'Consolas', monospace;
--fw-hero:    700;  --lh-hero:0.95;  --ls-hero:-0.03em;
--fw-title:   700; --ls-title:-0.02em;
--fw-h3:      600;    --fw-def:300;    --fw-year:700;
--label-size:10px; --label-ls:0.15em;
--tick-caps:1;   --tick-ls:0.1em;  --tick-anim:scroll 30s linear infinite;
--btn-caps:1;    --btn-ls:0.08em;
--tag-caps:1;    --tag-ls:0.06em;

/* Spacing (8px base grid) */
--pad:       32px;  --pad-lg:64px;
--max-w:     1200px;

/* Status badge colors (WCAG AA on bg) */
--st-live:#b4ff39;  --st-oss:#6ec1e4;
--st-building:#f0a030;--st-offer:#c084fc;
--st-waitlist:#7d7d7d;
```

#### Paper (`[data-theme="paper"]`)
```css
/* Palette */
--bg:         #f4f1ea;    /* Warm paper ground */
--bg-raised:  #edeae1;    /* Hover state */
--bg-card:    #efebe2;    /* Card backgrounds */
--fg:         #1d1815;    /* Primary text (near-black) */
--fg-dim:     #6b635a;    /* Secondary text */
--fg-muted:   #8a8178;    /* Tertiary / labels */
--accent:     #c93a1d;    /* Vermilion ink accent */
--accent-soft:rgba(201, 58, 29, 0.08);  /* Accent background tint */
--btn-fg:     #f4f1ea;    /* Button text on accent */
--line:       #d9d3c6;    /* Grid lines, dividers */
--line-strong:#c8c0af;    /* Interactive borders */

/* Typography */
--font-body:  'Source Serif 4', 'Georgia', 'Times New Roman', serif;
--font-display:'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
--fw-hero:    500;  --lh-hero:1.02;  --ls-hero:-0.015em;
--fw-title:   500; --ls-title:-0.01em;
--fw-h3:      600;    --fw-def:400;    --fw-year:500;
--label-size:10px; --label-ls:0.18em;
--tick-caps:1;   --tick-ls:0.08em;  --tick-anim:drift 46s linear infinite;
--btn-caps:1;    --btn-ls:0.1em;
--tag-caps:0;    --tag-ls:0.02em;

/* Spacing (same grid, looser gutters) */
--pad:       44px;  --pad-lg:96px;
--max-w:     1080px;

/* Status badge colors (WCAG AA on bg) */
--st-live:#1f7a48;  --st-oss:#1f5fa8;
--st-building:#a35a12;--st-offer:#7c3aa8;
--st-waitlist:#6f665d;
```

#### Blueprint (`[data-theme="blueprint"]`)
```css
/* Palette */
--bg:         #0a1b30;    /* Deep drafting blue */
--bg-raised:  #0e2138;    /* Hover state */
--bg-card:    #10233d;    /* Card backgrounds */
--fg:         #e3edf7;    /* Pale drafting-white */
--fg-dim:     #8ba3bd;    /* Secondary text */
--fg-muted:   #7e97b2;    /* Tertiary / labels (WCAG AA) */
--accent:     #8ab4e8;    /* Accent blue */
--accent-soft:rgba(138, 180, 232, 0.12); /* Accent background tint */
--btn-fg:     #0a1b30;    /* Button text on accent */
--line:       #22395c;    /* Grid lines, dividers */
--line-strong:#31496e;    /* Interactive borders */

/* Typography */
--font-body:  'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
--font-display:'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
--fw-hero:    700;  --lh-hero:0.98;  --ls-hero:-0.01em;
--fw-title:   700; --ls-title:-0.005em;
--fw-h3:      600;    --fw-def:400;    --fw-year:700;
--label-size:10px; --label-ls:0.14em;
--tick-caps:1;   --tick-ls:0.12em;  --tick-anim:scroll 22s linear infinite;
--btn-caps:1;    --btn-ls:0.1em;
--tag-caps:0;    --tag-ls:0.02em;

/* Spacing (same as Swiss) */
--pad:       32px;  --pad-lg:64px;
--max-w:     1200px;

/* Background texture: 1px drafting grid (36px squares) */
background-image:
  linear-gradient(rgba(138, 180, 232, 0.075) 1px, transparent 1px),
  linear-gradient(90deg, rgba(138, 180, 232, 0.075) 1px, transparent 1px);
background-size: 36px 36px;
background-attachment: fixed;

/* Status badge colors */
--st-live:#59d6a0;  --st-oss:#8ab4e8;
--st-building:#e0a13f;--st-offer:#c792ea;
--st-waitlist:#7e97b2;
```

### Switching mechanism (runtime)
1. **Bootstrap script** (in `<head>`, runs before first paint):
   - Reads `?theme=` URL parameter (for themed visits/previews) **or**
   - Falls back to `localStorage.getItem('portfolio-theme')`
   - Defaults to `'swiss'` if neither is valid
   - Sets `document.documentElement.setAttribute('data-theme', chosenTheme)`
   - Perserts choice to `localStorage` when `?theme=` is used
2. **CSS** — all colors, typography, spacing, texture, and borders are expressed as `var(--token)`; swapping `[data-theme]` causes every computed value to update simultaneously.
3. **Zero content re-render** — the DOM is untouched; only computed styles change. Layout remains identical; only palette, type, texture, and rhythm shift.
4. **Persistence** — the chosen theme is saved to `localStorage` and read on every subsequent visit (unless overridden by `?theme=`).
5. **No FOUC** — the attribute is set during head parsing, before any style/layout pass or first paint.
6. **Switcher UI** — three native `<button>` elements in the theme bar:
   - Visible selected state via `aria-pressed` and filled background
   - Keyboard-reachable (real `<button>` elements, not divs)
   - Minimal and native to the active theme (re-skinned by the same tokens)
   - Persists across reloads via the bootstrap script

### Theme-bar anatomy
- Positioned `fixed` below the nav (`top: var(--nav-h)`)
- Height: `var(--bar-h)` (40px desktop, 36px mobile)
- Re-paints with every theme switch — background, border, text, and button styles all derive from the active theme’s tokens.
- Selected button: `background: var(--accent); color: var(--btn-fg); border-color: var(--accent);`
- Other buttons: `background: transparent; border: 1px solid var(--line-strong); color: var(--fg-dim);`

## Honest self-critique: What is gained/lost by running N themes in production?

### Gains
1. **Personalization without accounts** — visitors can pick a theme that suits their environment (dark for low-light, paper for reading comfort, blueprint for technical focus) and have it remembered.
2. **Demonstrates range** — shows the same information architecture can support multiple aesthetic directions, useful for stakeholder alignment or A/B testing preferences.
3. **Accessibility playground** — high-contrast themes (swiss, blueprint) vs. warmer, softer themes (paper) let users self-select for visual comfort.
4. **No layout shift** — because themes are pure token swaps, there is zero content reflow or jank during switching.
5. **Future-proof** — adding a 4th theme is just another `[data-theme]` block; no HTML or JS changes needed.

### Losses / Costs
1. **CSS bloat** — every token is triplicated (three themes). The `index.html` grew from ~41 KB to ~52 KB (~25% increase) due to the theme tokens alone. In production, this could be mitigated by:
   - Extracting theme tokens to a separate CSS file loaded conditionally (adds a round-trip)
   - Using a build step to generate minimal per-theme CSS (breaks the "double-click open" goal)
   - Accepting the ~8 KB gzip penalty for the flexibility (still under 15 KB gzipped)
2. **Runtime overhead** — negligible: one attribute swap, no layout thrash. The browser restyles efficiently.
3. **Theme-maintenance cost** — every design tweak (e.g., adjusting `--gap-xl`) must be verified across three themes. Risk of drift increases with N.
4. **Potential decision fatigue** — some visitors may prefer a "designer-chosen" single theme rather than making a choice. Mitigated by:
   - Making Swiss the default (the known, reviewed direction)
   - Remembering the choice so the decision is made once
5. **No thematic meaning** — the themes are aesthetic variants, not semantic modes (e.g., "high-contrast accessibility mode"). They don’t convey different information; they re-skin the same information.

### Verdict for hafs.dev production
- **Prototype successful**: the theme switcher works as specified — instant, persistent, no FOUC, genuinely distinct themes.
- **Production readiness**: technically sound, but the added CSS weight (~8 KB gzip) and maintenance overhead must be weighed against the actual user benefit.
- **Recommendation**: A/B test with real visitors (via a feature flag) to see if theme selection rate justifies the cost. If <5% switch away from default, revert to single-theme Swiss. If >15% actively choose and stick with an alternate theme, the multi-theme approach earns its keep.

---
Prototype branch: `bld-portfolio-theme-switcher`  
Built from: origin/master @ 66a1b41  
Screenshots committed: desktop (1440×900) and mobile (390×844) for each theme + switcher-in-use shots  
Verify: open `portfolio-theme-switcher/index.html` in any browser; switch themes; reload; confirm persistence.  