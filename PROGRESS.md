# Progress: Apply hover solid-card treatment to normal blog/list state
Card: t_ecdb8d35
Branch: bld-ecdb8-hovercards
Started: 2026-06-01T13:10Z

## Checklist
- [x] Read card and estimated
- [x] Orientation check (branch, tests, files_changed)
- [x] Inspected blog.html, blog post pages, herald generator
- [ ] Patch blog.html `.blog-card` normal state (accent border + shadow)
- [ ] Patch blog/2026-06-01.html `.blog-post-card` (border 0.15→0.35, stronger shadow)
- [ ] Patch all other blog post pages (~33 files)
- [ ] Patch herald/blog/generate_blog_post.py generator
- [ ] Committed and pushed
- [ ] Screenshots captured

## Notes
- 2 post pages (2026-05-31, 2026-06-01) have rgba(0.15) border from prior partial fix
- ~33 post pages still use var(--border) — old template
- Herald generator at /Users/claude-worker/projects/herald/blog/generate_blog_post.py still has old template
- Fix: accent-tinted border (rgba 0.35) + box-shadow for depth on ALL normal states
