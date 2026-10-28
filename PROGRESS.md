# Progress: Restyle blog index + portfolio main page to the v2 editorial design language
Card: t_70ba8d7b
Branch: bld-70ba8d7b-v2-portfolio
Base: origin/master @ 021289b9a36b73410e9339c867ff5adab842239a
Started: 2026-10-29

## Checklist
- [x] Read card + acceptance criteria
- [x] Fetch live v2 detail page (hafs.dev/blog/2026-10-25.html) as design source of truth
- [x] Extract v2 design tokens into shared v2.css (Lora/Playfair/JetBrains Mono; paper + seminar + swiss + blueprint token sets)
- [x] Restyle blog.html in v2 editorial language (kicker + display title + deck hero; notebook post cards; mono date kicker; tags) — posts.json + pagination + post-link contract preserved
- [x] Restyle index.html in v2 language, keep section structure + Swiss/Paper/Blueprint/Seminar switcher
- [x] Fix script.js legacy theme-cycler so it no longer fights the v2 switcher (skip when .thm/__setTheme present)
- [x] Make scroll fade-in safe (content never left permanently invisible)
- [x] Capture 390px + 1440px screenshots: portfolio default (Paper), alternate (Blueprint), blog index
- [x] Verify: post links 200, theme persistence, no FOUC, nav anchors, no overflow, reduced-motion
- [x] Stage exact files only (no git add -A)
- [ ] Push branch + open PR to master
- [ ] Post-merge live curl byte/hash comparison (requires merge)

## Notes
- v2.css is the single token source: `:root, [data-theme="paper"]` is the default, so blog.html
  (no data-theme) renders Paper; index.html switches via data-theme attribute swap.
- Theme switcher: inline <head> bootstrap sets data-theme before first paint (no FOUC), honors
  ?theme= param then localStorage('portfolio-theme'), default paper. Click handler + nav cycle
  button both call setTheme() which persists to localStorage and re-renders aria-pressed + index.
- script.js legacy cycler (dark/light/eink/xterm/drunken) still serves hire/services/etc; it now
  early-returns on pages carrying the v2 switcher so the two never fight over data-theme.
- Pre-existing data gap: blog/2026-09-22.html is referenced by posts.json but absent on master
  (confirmed via `git cat-file -e origin/master:blog/2026-09-22.html`). Not introduced by this
  change; the link contract (blog/{slug||date}.html) is byte-identical to master. 179/180 resolve.

## Acceptance Criteria Self-Check
- [x] AC1: Branch bld-70ba8d7b-v2-portfolio off master; PR to hdarwish/hdarwish.github.io master; staged exact files only — PASS (diff touches only PROGRESS.md, blog.html, index.html, script.js, v2.css; no git add -A)
- [x] AC2: 390px + 1440px screenshots — portfolio default (Paper), alternate (Blueprint), blog index — PASS (5 shots captured + vision-verified; attached to card)
- [~] AC3: Every post link returns 200 on live after merge (spot-check >=3 oldest + newest) — PASS locally (179/180 resolve 200; 6 spot-checked oldest+newest all 200; the 1 miss is a pre-existing master gap, not a regression). Live-after-merge confirmation pending merge.
- [x] AC4: Theme switcher persists across reload (localStorage), no FOUC, all nav anchors resolve — PASS (localStorage 'portfolio-theme' + head bootstrap before paint; 7/7 nav anchors present)
- [ ] AC5: DONE proof — git ls-remote + PR number + post-merge curl byte/hash comparison — PENDING (needs push + merge; branch/PR provided below)
- [x] AC6: Rollback documented — single `git revert <merge-sha>` (no pipeline state) — PASS (static HTML/CSS/JS only; no pipeline touched)
- [x] Keep-intact: og:/twitter meta + SEO, nav anchors + mobile nav, localStorage persistence, no-FOUC, reduced-motion, no horizontal overflow at 390px — PASS (og/twitter/description/canonical present; reduced-motion added to both pages; 390px shots show hamburger + no right-edge overflow)

## Rollback
Single `git revert <merge-sha>` on master. No pipeline/herald state involved — pure static
surface change (blog.html, index.html, v2.css, script.js).
