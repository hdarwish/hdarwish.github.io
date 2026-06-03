# Progress: [tinytell] Refresh Privacy + FAQ/Support pages to match app revamp
Card: t_7373ba1b
Branch: bld-7373b-tinypages
Started: 2026-06-04T00:00Z

## Checklist
- [x] Read card and audited existing pages
- [ ] Update privacy.html (favicon, brand header, nav fix, copy)
- [ ] Update support.html (favicon, brand header, nav fix, accent bar fix, copy)
- [ ] Create faq.html (redirect to support.html)
- [ ] Commit and push
- [ ] Verify raw GitHub URLs (HTTP 200 proof)
- [ ] Comment launch card t_eecc90ee

## Notes
- Both pages already use portfolio style.css?v=14 — consistent foundation
- support.html has wrong accent bar (bar-purple not in theme; should be bar-rose to match landing)
- Neither page has favicon or app icon brand header
- Nav inconsistency: pages don't link to TinyTell landing (tinytell/index.html)
- "waitlist management" copy → "account-based access management" for launch readiness
- faq.html: meta-refresh + JS redirect to support.html
- History correctly on-device only in both pages — no change needed
- Audio correctly sent to private server and discarded — no change needed
- No app code, EAS build, App Store submission, or secrets touched
