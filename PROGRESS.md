<<<<<<< HEAD
# Progress: Update portfolio with TinyTell App Store launch
Card: t_69717abc
Branch: bld-69717-ttapp
Started: 2026-06-29

## Checklist
- [x] Read card and estimated
- [x] Inspect portfolio structure — TinyTell card at index.html:790, tinytell/index.html exists
- [x] Verify App Store URL returns 200 — https://apps.apple.com/us/app/tinytell/id6771931037
- [x] Update index.html TinyTell card (status: Building→Live, copy, App Store link)
- [x] Update tinytell/index.html (add App Store download button)
- [ ] Commit and push
- [ ] PR opened

## Notes
- TinyTell card currently shows status-wip "Building" with "App Store submission in progress."
- Need to flip to status-live "Live" and add App Store link
- No test suite in this repo (static HTML site)
- tinytell/index.html is the marketing page; card links to it
- App Store URL verified HTTP 200
=======
# Progress: Hermes Harness Architecture SVG — Publication Prep (Part 0)
Card: t_0796439a
Branch: bld-07964-portfoli
Started: 2026-06-26

## Checklist
- [x] Read card and estimated
- [x] Verified source SVG sha256 matches (857a38b202284920bea680e82b71a8c05f3137b2f8e8744fcb1eacd12219c8e7)
- [ ] Create publication-ready SVG (remove draft warnings, preserve labels/attribution)
- [ ] Add assets/ directory and place SVG
- [ ] Create minimal blog/visual-explainer page following existing site patterns
- [ ] Verify XML parses cleanly
- [ ] Commit and push
- [ ] Open PR

## Notes
- Source SVG: git show 86f600c18c93:assets/hermes-harness-architecture.svg
- Changes scoped to: SVG draft-warning removal + minimal blog page
- NOT creating the 5-post series (t_0130aa99 stays deferred)
- No merge/live publish/social post
>>>>>>> b8064d3 (feat(t_0796439a): publish-prep Hermes harness architecture SVG — Part 0 visual explainer)
