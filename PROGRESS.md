# Progress: Restore legacy themes + single top-right theme switcher
Card: t_0839ddff
Branch: bld-0839d-theme-restore
Started: 2026-10-30

## Checklist
- [x] Read card, measured current state, pulled legacy palettes from git
- [x] Set up worktree on bld-0839d-theme-restore
- [x] v2.css: add 5 legacy token blocks (dark/light/eink/xterm/drunk)
- [x] v2.css: make seminar the default (move :root to seminar palette)
- [x] New shared theme.js (boot + switcher + 9-theme list, single source of truth)
- [x] index.html: remove inline themebar markup/CSS/JS; add theme.js; keep nav button; 44px tap target
- [x] blog.html: add theme.js include + nav button; body uses tokens
- [x] herald render_v2.py post template: add v2.css + theme.js + top bar w/ nav button
- [x] Screenshot matrix (390/1440 x index/blog/post x seminar/eink/swiss) in previews/t_0839ddff/
- [x] Verify: grep themebar=0, 0 JS console errors (index+blog), persistence, no FOUC, cycle, nav anchors, og meta, no overflow
- [x] Herald test suite: 30 passed (incl. new switcher + relative-path tests)
- [x] Push to branch (portfolio + herald) + open PR

## Notes
- localStorage key = 'portfolio-theme' (kept). Cycle: seminar→swiss→paper→blueprint→dark→light→eink→xterm→drunk.
- Default theme = seminar. :root carries seminar palette so no-js/pre-boot paint is dark.
- **Bug found + fixed in verification (2026-10-30):** the old v1 5-theme cycler in
  `script.js` (used the 'theme' key + bound a 2nd click listener to the same
  #theme-cycle button) had a `.thm`/`__setTheme` guard that stopped firing once
  the .themebar row was removed, so every click double-advanced the theme
  (seminar→eink instead of seminar→swiss). Removed that block from script.js —
  theme.js is now the single source of truth on every page that loads it
  (index.html + blog.html). Verified: 1 step per click, correct 9-theme order.
- Post article-body palette is the pre-existing per-mode (Dark Seminar / Notebook) inline CSS — the shared theme system (data-theme + switcher + persistence) IS wired in; the article content palette is out of scope ("do NOT change generated post content"). Documented in previews/t_0839ddff/NOTES.md.
- favicon.ico 404 is pre-existing (live site 404s it too), not a JS error.
- Herald render change is on the same branch name bld-0839d-theme-restore in the herald repo.

## Acceptance Criteria Self-Check
- [x] AC1: 9 themes selectable via top-right button only; no .themebar markup/CSS/JS — PASS (grep themebar across index.html/blog.html/v2.css/theme.js = 0 hits; 9 data-theme blocks in v2.css; 9 themes in theme.js; cycle verified)
- [x] AC2: Screenshot matrix 390/1440 x (index, blog.html, one post preview) x (seminar, eink, swiss) in previews/<card-id>/ — PASS (18 shots in previews/t_0839ddff/screenshots/, all render correct theme, vision-verified)
- [x] AC3: Theme persists across reload AND across pages with no FOUC — PASS (headless: set eink -> reload stays eink -> blog carries eink -> post carries eink; boot sets data-theme before paint)
- [x] AC4: 0 console JS errors at 390/1440 on index + blog.html — PASS (only pre-existing favicon.ico 404, which also 404s on live; no JS errors)
- [x] AC5: nav anchors, post links, og/SEO meta intact; no overflow at 390/1440 — PASS (7 anchors present; 180 posts in posts.json + render fn intact; og:url/og-image/twitter intact; scrollWidth==clientWidth at both sizes)
- [x] AC6: Rollback via git revert — PASS (single-branch change, reversible)
- [x] AC7 (work 5): post template extended from herald template lane, proved with local preview, generated posts NOT touched — PASS (herald/blog/render_v2.py build_post_page_v2 modified; 30 herald tests pass; preview rendered locally; no blog/*.html hand-edited, no pipeline run)
