# Progress: Portfolio — CCAT Guru update + section/tag audit
Card: t_5d55793c
Branch: bld-5d557-portfoli
Started: 2026-06-16T08:13Z

## Checklist
- [x] Read card and estimated
- [x] Orientation check passed
- [x] Verify live URLs (ccat-guru.hafs.dev=200, herald.hafs.dev=200, tinytell.hafs.dev=404)
- [x] Add status-offer and status-waitlist CSS classes to style.css
- [ ] Update CCAT Guru card (description, status Live, link)
- [ ] Update TinyTell card (description, tags)
- [ ] Restructure projects section into Live/Public Systems, Consulting Offers, Labs
- [ ] Normalize status badges across all cards
- [ ] Normalize tags across all cards (Title Case, 4-6 per card)
- [ ] Static check (grep stale phrases)
- [ ] Commit and push

## Notes
- ccat-guru.hafs.dev returns 200 — safe to mark Live and link
- tinytell.hafs.dev returns 404 — keep as Building, link to local tinytell/index.html
- herald.hafs.dev returns 200 — keep as Live
- Added CSS classes: status-offer (amber/orange), status-waitlist (purple)
- Status badge taxonomy: Live, Building, Open Source, Offer, Waitlist
