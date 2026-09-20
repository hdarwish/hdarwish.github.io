# Design Notes — Hafs Ibrahim Portfolio Revamp

## Aesthetic: "Type-as-Structure" (Swiss Brutalist)

### Philosophy

The default AI-generated portfolio aesthetic — soft gradients, rounded corners, glassmorphism,
glowing orbs, pastel accent colors, decorative blobs — has become so ubiquitous that it
signals "entry-level template" rather than "senior engineer." Following the ukslim article
principles ("AI-generated posters don't have to be horrible"), this design explicitly rejects
that default and commits to a specific, different aesthetic.

The chosen direction draws from two sources:
1. **Swiss International Typographic Style** — grid-based layout, information-first hierarchy,
   clean structure, restrained use of decoration.
2. **Neo-Brutalism** — high contrast, raw edges, no rounded corners, no shadows, no gradients.
   Bold confidence through typography and composition rather than ornamentation.

### Design Tokens

```css
/* Palette */
--bg:         #0a0a0a;    /* Near-black canvas */
--bg-raised:  #111111;    /* Hover state */
--bg-card:    #161616;    /* Card backgrounds */
--fg:         #e8e8e8;    /* Primary text (not pure white — less harsh) */
--fg-dim:     #777777;    /* Secondary text */
--fg-muted:   #555555;    /* Tertiary / labels */
--accent:     #b4ff39;    /* Electric chartreuse — single accent color */
--accent-dim: rgba(180, 255, 57, 0.12);  /* Accent background tint */
--border:     #222222;    /* Grid lines, dividers */
--border-strong: #333333; /* Interactive borders */

/* Typography */
--font: 'IBM Plex Mono', 'Menlo', 'Consolas', monospace;
/* Single typeface throughout — hierarchy via weight and size, not font family */

/* Spacing (8px base grid) */
--gap:    8px;
--gap-lg: 16px;
--gap-xl: 32px;
--gap-2xl: 64px;
```

### Type Scale

| Element          | Size              | Weight |
|-----------------|-------------------|--------|
| Hero name       | 48–96px (clamp)   | 700    |
| Section titles  | 28–44px (clamp)   | 700    |
| H3 / headings   | 16px              | 600    |
| Body text       | 13–14px           | 400    |
| Tags / labels   | 10–11px           | 500–600 |
| Meta / captions | 9–10px            | 500–600 |

### Layout Principles

1. **1px grid lines** — Sections separated by `border-bottom: 1px solid var(--border)`.
   No shadows, no cards with rounded corners. Structure comes from lines, not depth.
2. **Accent borders** — Hero bottom and consulting top use 3px solid accent green.
   These thick lines act as section markers and visual rhythm.
3. **1-column → 2-column → 3-column grid** — Progressive density. Hero is single column.
   Journey is 4 columns. Projects auto-fill. Skills are 3 columns.
4. **No rounded corners anywhere** — Every element is a sharp rectangle.
   This is a deliberate rejection of the "friendly AI" default.
5. **No shadows, no glassmorphism** — Depth is communicated through background color
   shifts (bg vs bg-raised) and border lines.
6. **Monospace everything** — The single typeface (IBM Plex Mono) creates a technical,
   engineering-first feel. Numbers align. Code-like rhythm.
7. **Scrolling ticker** — Replaces the "signal feed" with a data-stream aesthetic.
   All-caps monospace text scrolling continuously.

### Color Usage

- **#b4ff39 (chartreuse)** is used for: accent lines, status dots, links, category labels,
  the active nav city, and the CTA button background. It's the ONLY color besides
  the grayscale palette. This restraint is what makes it work.
- **Status badges** use distinct colors (green=live, blue=oss, orange=building, purple=offer)
  but only as thin 1px borders — never filled backgrounds.

### What This Avoids

| Default AI Look                | This Design                  |
|-------------------------------|------------------------------|
| Rounded corners               | Sharp rectangles             |
| Drop shadows                  | 1px border lines             |
| Gradient backgrounds          | Solid near-black             |
| Glassmorphism / blur          | Opaque with border           |
| Multiple accent colors        | Single chartreuse accent     |
| Decorative blobs / orbs       | Zero decoration              |
| Sans-serif (Inter/System)     | Monospace (IBM Plex Mono)    |
| Card-based with padding       | Grid-based with 1px lines    |
| Hero image / photo            | Hero is pure typography      |

---

## Self-Critique: How This Avoids the Identikit-AI Look

Applying the three principles from the ukslim article:

### 1. "The default AI aesthetic is the enemy"

The default AI portfolio looks like: Inter/system font, soft blue-purple gradients,
rounded card corners, subtle shadows, glassmorphism navbar, decorative gradient orbs,
a hero with a headshot and glowing background. This design does the opposite of every
single one of those choices. There are zero gradients, zero rounded corners, zero
shadows, zero decorative elements. The hero is pure type. The accent is electric
chartreuse — a color rarely used in portfolio design because it feels "harsh" to
AI models trained on soft, approachable aesthetics.

### 2. "Explicitly specify a design aesthetic instead of accepting the model's default"

The aesthetic is explicitly "Swiss Brutalist" — a combination of Swiss International
Typographic Style (grid-based, information-first, strong hierarchy) and Neo-Brutalism
(raw, high-contrast, no ornamentation). Every design decision was made to serve this
specific aesthetic, not chosen by default:
- Monospace typeface → Swiss Style's love of structured, functional typography
- 1px grid lines → Swiss Style's grid-based layout system
- No decoration → Brutalism's "function is the aesthetic"
- Single accent color → Swiss Style's restrained palette principle
- Sharp rectangles → Brutalism's rejection of "friendly" rounded shapes

### 3. "Craft and composition over template features"

The composition relies on:
- **Type weight hierarchy** — 700/600/500/400 weights create clear reading levels
  without needing color or size changes alone
- **Grid rhythm** — 1px lines create visual cadence; the 3px accent lines create
  emphasis beats; consistent 8px spacing creates mathematical harmony
- **Density modulation** — Hero is spacious, timeline is dense, projects auto-fill.
  The density changes tell the reader what's important.
- **Information density** — Every pixel serves information. No decorative space.
  The ticker at the top is a data stream, not decoration.

### What might still feel "AI-ish"

Honestly: the 1-column hero with large type is a common pattern. But the combination
of monospace + near-black + chartreuse + sharp edges creates a gestalt that is
distinctly different from the typical soft/pastel AI portfolio. The type-as-structure
approach — where typography IS the visual design rather than decoration ON TOP of
typography — is what sets this apart.

---

## File Structure

```
portfolio-prototype/
├── index.html        ← Standalone prototype (open in any browser)
└── DESIGN_NOTES.md   ← This file
```

The prototype is a single self-contained HTML file with inline CSS.
No build step, no external dependencies (except Google Fonts for IBM Plex Mono).
Double-click to open, or serve with any static file server.
