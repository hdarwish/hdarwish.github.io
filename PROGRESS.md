# Progress: Apply hover solid-card treatment to normal blog/list state
Card: t_ecdb8d35
Branch: bld-ecdb8-hovercards
Started: 2026-06-01T13:10Z

## Checklist
- [x] Read card and estimated
- [x] Orientation check (branch, tests, files_changed)
- [x] Inspected blog.html, blog post pages, herald generator
- [x] Patch blog.html `.blog-card` normal state (accent border + shadow)
- [x] Patch blog/2026-06-01.html `.blog-post-card` (border 0.15→0.35, stronger shadow)
- [x] Patch all other blog post pages (33 files via script)
- [x] Patch herald/blog/generate_blog_post.py generator (branch fix/hovercards-blog-post-card-border)
- [x] Committed and pushed (portfolio: f41fecc, herald: bc671c2)
- [x] Screenshots captured and committed

## What Changed

### blog.html `.blog-card` (list page)
- Before: `border: 1px solid var(--border)` (barely visible, ~#2a2a2e on #0a0a0b bg)
- After: `border: 1px solid rgba(59, 130, 246, 0.35)` + `box-shadow: 0 2px 8px rgba(0,0,0,0.35)`
- Hover now adds extra lift only; core card readability does not depend on hover

### All blog post pages (35 pages) `.blog-post-card`
- Pages with old template (var(--border)): now have rgba(0.35) border + box-shadow
- Pages with prior partial fix (rgba(0.15)): bumped to rgba(0.35), stronger shadow
- All hovers updated to add extra shadow lift

### Herald generator (future posts)
- Branch: fix/hovercards-blog-post-card-border on herald repo
- Same treatment: border opacity 0.35, stronger shadow

## Screenshots
- `screenshots/blog-list-normal-state.png` — cards clearly distinct with accent border, no hover needed
- `screenshots/blog-post-normal-state.png` — article panel clearly visible in normal state

## Acceptance Criteria Self-Check
- [x] AC1: blog.html .blog-card normal state has accent border + shadow — PASS (rgba 0.35 border, 0 2px 8px shadow)
- [x] AC2: blog/2026-06-01.html .blog-post-card normal state solid/opaque — PASS (rgba(16,20,28,0.98) bg, rgba(0.35) border, stronger shadow)
- [x] AC3: Generator source updated — PASS (herald branch fix/hovercards-blog-post-card-border, commit bc671c2)
- [x] AC4: Screenshots captured — PASS (screenshots/blog-list-normal-state.png, screenshots/blog-post-normal-state.png)
- [x] AC5: No regression — PASS (no changes to hero image, no HN discussion visible in screenshots)
- [x] AC6: Accent border approach covers light theme too (rgba(59,130,246,0.35) reads as light blue on white)

## Notes
- Reviewer/Architect visual verification still needed per card requirement
- Herald worktree cleaned up at /tmp/herald-hovercards-fix
