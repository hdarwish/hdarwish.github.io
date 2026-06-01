# Progress: Correct false bg-transparency fix on generated article body/hero
Card: t_453b5fce
Branch: bld-453b5-portfolio (tracking origin/master)
Started: 2026-06-01T08:15Z

## Checklist
- [x] Read card and estimated
- [x] Oriented: branch=bld-453b5-portfolio, up to date with origin/master
- [x] Verified portfolio blog/2026-05-31.html already has correct .blog-post-card (rgba) + hero wrapper (f5539e2 on master)
- [x] Verified live site https://hafs.dev/blog/2026-05-31.html shows fixed CSS and hero framing
- [x] Verified herald origin/main has generator fix at 883b4fd
- [x] Tests passing (none exist)

## Acceptance Criteria Self-Check
- [x] AC1: curl shows .blog-post-card background not var(--surface) — PASS (live: `rgba(16, 20, 28, 0.98)` with box-shadow)
- [x] AC2: Hero image has frame style/wrapper — PASS (live: `<div class="blog-hero-image-wrapper" style="...border:1px solid rgba(59,130,246,0.2);box-shadow:0 2px 8px rgba(0,0,0,0.3);">`)
- [x] AC3: Generator/template source updated — PASS (herald origin/main commit 883b4fd "Fix blog post card background and hero image framing")
- [x] AC4: Commit on master — PASS (portfolio f5539e218d0a18ea0734bf46d861f1dec53b187f on origin/master)
- [x] AC5: Evidence provided — PASS (see below)

## Evidence
- Portfolio commit: f5539e218d0a18ea0734bf46d861f1dec53b187f (on origin/master)
- Changed files: blog/2026-05-31.html (inline style block + hero wrapper)
- Herald generator commit: 883b4fd (origin/main) — same fixes in generate_blog_post.py
- Live URL: https://hafs.dev/blog/2026-05-31.html
- Live .blog-post-card: background rgba(16, 20, 28, 0.98), border rgba(59,130,246,0.15), box-shadow confirmed
- Live hero: blog-hero-image-wrapper with border+shadow confirmed via curl

## Notes
- Both the portfolio HTML fix (f5539e2) and the herald generator fix (883b4fd) were completed by prior sessions on this branch
- This session confirmed live correctness and documented the evidence
- No new commits needed: all fixes already on respective remotes
