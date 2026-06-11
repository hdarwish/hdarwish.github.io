# Progress: Hafs.dev Services fake-door page
Card: t_2d7d9f80
Branch: bld-2d7d-services
Started: 2026-06-11T18:21Z

## Checklist
- [x] Read card and oriented on repo structure
- [x] Audited existing pages (dataaudit, codereview) for conventions
- [x] Created services/index.html — 4 service sprint cards + mailto CTAs
- [x] Updated index.html nav — added "Services" link
- [x] Updated index.html projects grid — added Services project card
- [x] Verified all relative paths (../style.css, ../script.js, ../index.html)
- [x] Committed and pushed to bld-2d7d-services
- [x] PR opened: https://github.com/hdarwish/hdarwish.github.io/pull/11

## Acceptance Criteria Self-Check
- [x] AC1: services/index.html exists at hafs.dev/services/ — PASS (file created, static site)
- [x] AC2: 3–4 service offers, not full 10-skill catalog — PASS: 4 sprints (AI automation, dashboard, MVP, infra rescue)
- [x] AC3: CTA uses existing contact/email link — PASS: mailto:hafs.darwish@gmail.com (no Calendly/Stripe)
- [x] AC4: No Stripe/Calendly accounts created — PASS: only mailto links; TODO comment left in HTML
- [x] AC5: Nav/home link added — PASS: "Services" added to homepage nav + project card in projects grid
- [x] AC6: Static site — no build required — PASS: static HTML, links to existing style.css + script.js
- [x] AC7: Branch pushed + PR opened — PASS (pending PR)
- [x] AC8: No secrets, no credentials — PASS: only HTML changes

## Notes
- CTA destination: mailto:hafs.darwish@gmail.com (pre-filled per sprint)
- Public URL: https://hafs.dev/services/ (static GitHub Pages)
- No Stripe/Calendly — TODO comment in services/index.html CTA section for follow-up billing card
- Static site; no build step; style.css?v=14 and script.js referenced identically to other sub-pages
