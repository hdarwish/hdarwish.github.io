# Preview: restore legacy themes + single top-right switcher

Card: t_0839ddff
Branch: bld-0839d-theme-restore
Date: 2026-10-30

## What changed
- Restored the 5 legacy v1 themes (dark / light / eink / xterm / drunk) as
  first-class `data-theme` variants in `v2.css`, ported onto the v2 token
  vocabulary so they re-skin the current editorial layout (nav, cards,
  sections). Palettes taken from `git show 021289b:style.css`.
- Theme set is now 9: seminar (default) · swiss · paper · blueprint ·
  dark · light · eink · xterm · drunk.
- Removed the dedicated `.themebar` row from index.html (markup + CSS + JS).
  The top-right nav button (`#theme-cycle`) is the ONLY switcher; it cycles
  all 9 in the order above, shows name+icon, ≥44px tap target (icon-only at
  ≤980px), honors reduced-motion.
- New shared `theme.js` = single source of truth for the theme list, the
  no-FOUC boot, and the switcher. index.html, blog.html, and the herald v2
  post template all reference `v2.css` + `theme.js` + the small nav button.
- Default theme flipped paper → **seminar** (`:root` now carries the seminar
  palette so no-js / pre-boot paint is dark, not a paper flash).
- localStorage key unchanged (`portfolio-theme`) → current users' choice
  survives. `?theme=` param still wins and persists.

## Screenshot matrix (screenshots/)
2 sizes (390 / 1440) × 3 pages (index, blog.html, one post preview) ×
3 themes (seminar, eink, swiss) = 18 shots.

Post preview (`blog/2026-10-30-preview.html`, generated from the herald v2
template in this branch) uses a no-diagram article so the matrix is not
cluttered by the pre-existing canary-fixture SVG `height="auto"` warnings.

## Verification (headless Chrome via puppeteer-core)
- Cycle: 9 clicks wrap seminar→…→drunk→seminar; button label updates; choice
  persists to localStorage.
- Persistence: set eink via `?theme=eink` → reload (no `?theme=`) stays eink
  → blog.html carries eink → post carries eink. No FOUC (boot runs before
  first paint; `<html>` starts with the resolved `data-theme`).
- Console: 0 JS errors on index + blog.html at 390/1440. (Only a pre-existing
  `favicon.ico` 404, which also 404s on live hafs.dev.)
- Nav anchors intact: #journey #about #experience #projects #consulting
  #skills #contact. og/SEO meta intact (og:url hafs.dev, og-image,
  twitter:card summary_large_image). No horizontal overflow at 390/1440.
- `grep -rn themebar` across index.html/blog.html/v2.css/theme.js = 0 hits.
- 9 `[data-theme=…]` blocks in v2.css; 9 themes in theme.js.
- Herald test suite: 30 passed (test_blog_v2_render.py) incl. new
  `test_post_page_has_theme_switcher` + `test_post_page_theme_uses_relative_paths`.

## Known limitation (documented, not a regression)
Blog post *article body* still renders its fixed per-mode palette (Dark
Seminar / Systems Notebook) because the v2 post template hardcodes those
colors in inline CSS — that is the pre-existing "posts have no theme
support" state this card references. The shared theme system (data-theme +
top-right switcher + persisted choice) is wired into the post template and
works; the article's own content palette is a separate, deeper surface
(out of scope per the card — "do NOT change generated post content"). The
post's top bar (back link + theme switcher) is themed and functional.

Rollback: `git revert <merge-sha>`.
