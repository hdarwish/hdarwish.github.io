# Progress: Apply hover solid-card treatment to normal blog/list state
Card: t_ecdb8d35
Branch: bld-ecdb8-hoverfix
Started: 2026-06-01T14:08Z

## Checklist
- [x] Read card and estimated
- [x] Inspect prior builder branch (bld-ecdb8-hovercards) — partial fix, not merged to master
- [x] Fix blog.html .blog-card normal state (accent border + shadow)
- [x] Fix blog/2026-06-01.html .blog-post-card (opaque var(--surface) bg, stronger border, shadow)
- [x] Batch-fix all 35 blog/*.html post files (same treatment)
- [x] Fix herald/blog/generate_blog_post.py template (future posts inherit)
- [x] Commit and push to bld-ecdb8-hoverfix (SHA: 0d383a4)
- [x] Merge to master and push (merge SHA: 214d08d)
- [x] Herald generator pushed (SHA: e2d6b9f)
- [x] Live deployment verified via curl

## Acceptance Criteria Self-Check
- [x] AC1: blog.html .blog-card normal state has accent border + shadow — PASS
  Evidence: live curl shows `border: 1px solid rgba(59, 130, 246, 0.35); box-shadow: 0 2px 8px rgba(0,0,0,0.35)` not only under :hover
- [x] AC2: blog/2026-06-01.html .blog-post-card is opaque + solid border — PASS
  Evidence: live curl shows `background: var(--surface)` (opaque #1a1a1e, no alpha), `border: 1px solid rgba(59,130,246,0.35)`, shadow in resting state; rgba(16,20,28,0.98) removed
- [x] AC3: All 35 existing post pages updated — PASS
  Evidence: batch Python script changed 34 (var(--border) pattern) + 1 (rgba pattern for 2026-05-31) = 35 total; verified 0 files with old pattern
- [x] AC4: Herald generator updated for future posts — PASS
  Evidence: herald/blog/generate_blog_post.py commit e2d6b9f on main; template now uses var(--surface) + rgba(0.35) border + shadow
- [x] AC5: No regression to hero image or HN discussion refs — PASS
  Evidence: only .blog-post-card and .blog-card CSS touched; hero wrapper and HN reference filtering untouched
- [x] AC6: Changes on master (Pages source) not just branch — PASS
  Evidence: master SHA 214d08d pushed to origin; live curl confirms deployment

## Notes
- Prior builder branch bld-ecdb8-hovercards had partial CSS fixes but was never merged to master
- Architect review fail resolved: rgba(16,20,28,0.98) → var(--surface) (opaque); border 0.15 → 0.35
- Screenshots: Reviewer/Architect visual verification still required per card AC
