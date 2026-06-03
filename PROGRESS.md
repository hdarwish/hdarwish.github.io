# Progress: [tinytell] Refresh Privacy + FAQ/Support pages to match app revamp
Card: t_7373ba1b
Branch: bld-7373b-tinypages
Started: 2026-06-04T00:00Z

## Checklist
- [x] Read card and audited existing pages
- [x] Update privacy.html (favicon, brand header, nav fix, copy update)
- [x] Update support.html (favicon, brand header, nav fix, accent bar fix, copy update)
- [x] Create faq.html (meta-refresh + JS redirect to support.html)
- [x] Commit SHA: 940553d and push to branch
- [x] PR #9 opened: https://github.com/hdarwish/hdarwish.github.io/pull/9
- [x] Raw GitHub URLs verified HTTP 200
- [ ] Comment launch card t_eecc90ee — BLOCKED: VM SSH tunnel down, hermes kanban unavailable from Mac

## Acceptance Criteria Self-Check

- [x] AC1: Visual match to app revamp — PASS: app icon brand header added, favicon added, accent bar fixed (bar-purple→bar-rose), nav consistent with landing page
- [x] AC2: Copy accuracy — auth/sign-in required: PASS: both pages explicitly require account
- [x] AC3: Copy accuracy — audio sent to private ML server over HTTPS: PASS: both pages state this clearly, no on-device audio claim
- [x] AC4: Copy accuracy — no medical diagnosis claims: PASS: both pages have explicit "Not a medical device" disclaimer box
- [x] AC5: Copy accuracy — history is local/on-device: PASS: both pages state on-device only, no server history
- [x] AC6: Copy accuracy — advice accurately described: PASS: support.html FAQ describes top-3 results + confidence + actionable advice
- [x] AC7: faq.html created: PASS: meta-refresh + JS redirect to support.html
- [x] AC8: Branch/commit/PR proof: PASS: SHA 940553d, branch bld-7373b-tinypages, PR #9
- [x] AC9: HTTP 200 proof: PASS: curl verified all 3 raw GitHub URLs return 200
- [ ] AC10: Launch card t_eecc90ee comment: BLOCKED (VM tunnel down) — not agent-executable without hermes
- [x] AC11: No app code / EAS build / App Store submission / secrets touched: PASS — only tinytell/*.html and PROGRESS.md changed

## Notes
- VM SSH tunnel at localhost:2222 is down; hermes CLI unavailable on Mac
- Launch card comment URLs: Privacy=https://hdarwish.github.io/tinytell/privacy.html, Support=https://hdarwish.github.io/tinytell/support.html, FAQ=https://hdarwish.github.io/tinytell/faq.html
- Pages will be live after PR #9 merges to master
- support.html previously had bar-purple (undefined class) in accent bar — corrected to amber/rose/green/blue
- "waitlist management" → "access management" in both pages for launch-readiness
