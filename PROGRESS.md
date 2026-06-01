# Progress: Apply hover solid-card treatment to normal blog/list state
Card: t_ecdb8d35
Branch: bld-ecdb8-hoverfix
Started: 2026-06-01T14:08Z

## Checklist
- [x] Read card and estimated
- [x] Inspect prior builder branch (bld-ecdb8-hovercards) — partial fix, not merged to master
- [ ] Fix blog.html .blog-card normal state (accent border + shadow)
- [ ] Fix blog/2026-06-01.html .blog-post-card (opaque bg, stronger border, shadow)
- [ ] Batch-fix all blog/*.html post files (same treatment)
- [ ] Fix herald/blog/generate_blog_post.py template (future posts inherit)
- [ ] Commit and push to bld-ecdb8-hoverfix
- [ ] Merge to master and push
- [ ] Acceptance criteria self-check

## Notes
- Prior builder branch bld-ecdb8-hovercards had partial CSS fixes but was never merged to master
- Architect review fail: post card still uses rgba(16, 20, 28, 0.98) — needs explicit opaque
- Key fix: var(--border) = #2a2a2e against var(--surface) = #1a1a1e is nearly invisible; accent border at 0.35 opacity makes cards pop
- All blog/*.html files need batch treatment; generator updated for future posts
