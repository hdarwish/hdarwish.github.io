# Progress: UAE T212 Educational Landing Page
Card: t_6eab0c84
Branch: bld-6eab0-t212
Started: 2026-06-30T09:41Z

## Checklist
- [x] Read card and estimated
- [x] Explore site conventions (style.css, services/index.html)
- [x] Create /uae-invest/index.html — bilingual Arabic/English landing page
- [x] CTA: mailto fake-door with UTM tracking (no T212 referral link available)
- [x] All required compliance copy included
- [x] No stock picks, no leverage/CFD/options promotion
- [x] Commit and push to branch
- [x] PR opened

## Notes
- Target live URL after Architect merge/deploy: hafs.dev/uae-invest/; current proof is local static artifact /uae-invest/index.html; live URL pending Architect merge/deploy
- Uses existing style.css + Cairo Arabic font
- CTA = mailto to hafs.darwish@gmail.com with pre-filled subject/body + UTM params in URL
- Arabic-first layout (RTL), bilingual throughout
- All 5 compliance requirements in dedicated disclaimer block

## Acceptance Criteria Self-Check
- [x] AC1: Artifact — static file /uae-invest/index.html committed to branch; live URL (hafs.dev/uae-invest/) pending Architect merge/deploy — NOT yet public
- [x] AC2: Changed files + commit/branch/PR — committed to bld-6eab0-t212, PR opened
- [x] AC3: CTA/tracking proof — mailto CTA + UTM params (utm_source=site, utm_medium=landing, utm_campaign=uae_t212_poc)
- [x] AC4: Copy/disclaimer proof — full disclaimer block: not financial advice, capital at risk, no stock pick, no leverage/CFDs, UAE residents only
- [x] AC5: No stock pick / price target / leverage / CFD / options / broad platform build — confirmed absent; explicit "Out of Scope" card states this
