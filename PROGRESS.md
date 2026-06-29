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
