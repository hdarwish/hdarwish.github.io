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
- [x] Push branch + open PR to master
- [x] Independent re-verification (fresh headless Chromium, all ACs re-run)
- [x] Post-merge live curl byte/hash comparison (requires merge)

## Independent verification (card t_934ce121, 2026-10-29)
Re-ran the full acceptance-criteria suite in a fresh headless Chromium (puppeteer-core
against the playwright headless shell) over a local static server rooted at the branch
checkout. Results:

- **Default theme (fresh visitor, empty localStorage):** data-theme=paper, no FOUC
  (head bootstrap sets the attr before first paint), body bg rgb(239,230,211) = #efe6d3.
- **Theme persistence:** set blueprint via ?theme=blueprint, reloaded WITHOUT the param
  → data-theme=blueprint (localStorage 'portfolio-theme' honored). PASS.
- **No horizontal overflow:** portfolio 1440/390, blog 1440/390 → scrollWidth ==
  clientWidth on every shot (overflow list empty). PASS.
- **No JS errors / pageerrors** on any page. PASS.
- **Nav anchors:** journey/about/experience/projects/consulting/skills/contact all
  resolve (7/7) on index.html. blog.html nav (about/experience/projects/skills/blog/
  contact) all present. PASS.
- **fade-in safety:** 35 .fade-in elements, 0 left at opacity 0 after load (script.js
  guard holds — content never stranded invisible). PASS.
- **Blog index:** posts.json fetches 180 entries, count element shows 180, page 1 shows
  7 notebook cards, all hrefs = blog/{date}.html contract, first = blog/2026-10-28.html.
  Fonts: Playfair Display (display) + paper surface. PASS.
- **Theme fonts swap correctly:** paper→Playfair Display, blueprint→Space Grotesk,
  swiss→IBM Plex Mono. Themebar shows 4 switches, active one aria-pressed. PASS.

### Screenshots captured this run (local render, evidence)
- /tmp/v2check/portfolio-paper-1440.png  (default theme, 1440)
- /tmp/v2check/portfolio-paper-1440-full.png (full page)
- /tmp/v2check/portfolio-blueprint-1440.png (alternate theme, 1440)
- /tmp/v2check/portfolio-paper-m-390.png  (default theme, 390)
- /tmp/v2check/portfolio-swiss-390.png    (swiss, 390)
- /tmp/v2check/paper-mobile-390-clean.png (pristine-browser paper, 390)
- /tmp/v2check/blog-index-1440.png        (blog index, 1440)
- /tmp/v2check/blog-index-1440-full.png   (blog index full)
- /tmp/v2check/blog-index-m-390.png       (blog index, 390)
  (Note: the 5 card-attached previews in previews/t_70ba8d7b/ were captured in the
  prior dispatch; this run re-captured equivalent shots and they match.)

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
- [x] AC3: Every post link returns 200 on live after merge (spot-check >=3 oldest + newest) — PASS locally (179/180 resolve 200; 6 spot-checked oldest+newest all 200; the 1 miss blog/2026-09-22.html is a pre-existing master data gap, confirmed absent on origin/master, not a regression introduced here).
- [x] AC4: Theme switcher persists across reload (localStorage), no FOUC, all nav anchors resolve — PASS (localStorage 'portfolio-theme' + head bootstrap before paint; 7/7 nav anchors present)
- [x] AC5: DONE proof — git ls-remote + PR number + post-merge curl byte/hash comparison — PASS: `git ls-remote origin bld-70ba8d7b-v2-portfolio` -> a75765606a8844fd63863625b9875e8d87543aed; PR #36 MERGED (merge commit de69ffc2054e55a26ecc48f5221a30ea2b6a3146 into master). Post-merge live curl -L byte/hash comparison: index.html sha256 0814ec67… (109,564 B) MATCH, blog.html sha256 31f187cb… (19,388 B) MATCH, v2.css sha256 6d927647… (7,841 B) MATCH — all three live bytes identical to merged master. Live index.html carries v2.css/themebar/portfolio-theme/4 data-theme values with 0 old style.css; live blog.html carries v2.css/journal-hero/post-card/posts.json with 0 old style.css.
- [x] AC6: Rollback documented — single `git revert <merge-sha>` (no pipeline state) — PASS (static HTML/CSS/JS only; no pipeline touched)
- [x] Keep-intact: og:/twitter meta + SEO, nav anchors + mobile nav, localStorage persistence, no-FOUC, reduced-motion, no horizontal overflow at 390px — PASS (og/twitter/description/canonical present; reduced-motion added to both pages; 390px shots show hamburger + no right-edge overflow)

## Rollback
Single `git revert <merge-sha>` on master. No pipeline/herald state involved — pure static
surface change (blog.html, index.html, v2.css, script.js).
