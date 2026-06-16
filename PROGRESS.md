# Progress: Portfolio — CCAT Guru update + section/tag audit
Card: t_5d55793c
Branch: bld-5d557-portfoli
Started: 2026-06-16T08:13Z
Completed: 2026-06-16T08:30Z

## Checklist
- [x] Read card and estimated
- [x] Orientation check passed
- [x] Verify live URLs (ccat-guru.hafs.dev=200, herald.hafs.dev=200, tinytell.hafs.dev=404)
- [x] Add status-offer and status-waitlist CSS classes to style.css
- [x] Update CCAT Guru card (description, status Live, link to verified URL)
- [x] Update TinyTell card (description updated to baby cry classification, tags updated)
- [x] Restructure projects section into Live/Public Systems, Consulting Offers, Labs
- [x] Normalize status badges across all cards
- [x] Normalize tags across all cards (Title Case, 4-6 per card)
- [x] Static check (grep stale phrases — all removed)
- [x] Commit 804871b and push to origin/bld-5d557-portfoli
- [x] PR opened: https://github.com/hdarwish/hdarwish.github.io/pull/14

## Acceptance Criteria Self-Check
- [x] AC1: index.html no longer contains "creator community awareness tool" — PASS (grep confirms removed)
- [x] AC2: index.html no longer contains "voice journaling/sentiment" text — PASS (grep confirms removed)
- [x] AC3: CCAT Guru linked accurately to https://ccat-guru.hafs.dev/ (200 OK verified) — PASS
- [x] AC4: Project statuses/tags consistent, not visually noisy — PASS (5-class taxonomy: Live, Building, Open Source, Offer, Waitlist)
- [x] AC5: Final proof — commit SHA 804871b, PR #14, URLs checked (see above) — PASS

## Notes
- ccat-guru.hafs.dev returns 200 — marked Live and linked
- tinytell.hafs.dev returns 404 — kept as Building, local tinytell/index.html link preserved
- herald.hafs.dev returns 200 — kept as Live
- Added CSS classes status-offer (amber/orange) and status-waitlist (purple) with overrides for all 5 themes
- "Launching Q3 2026" retained as body text only in CodeReview Bot description (not a badge)
- PR: https://github.com/hdarwish/hdarwish.github.io/pull/14
