# Progress: Make Journey section experience-driven and richer
Card: t_a35f02ca
Branch: bld-a35f0-journey
Started: 2026-07-15

## Checklist
- [x] Read card and estimated
- [x] Inspect Journey and Experience sections in index.html
- [x] Identify divergences (company name, thin descriptions, missing details)
- [x] Update desktop journey card descriptions to match Experience depth
- [x] Update mobile journey card descriptions to match
- [x] Fix Shory company name divergence (Journey="Shory" → "Shory — First Tech")
- [x] Fix MCIT name divergence (Journey="MCIT Egypt" → "Ministry of Communications and IT, Egypt")
- [x] HTML structure validated (Python HTMLParser — clean)
- [x] Commit SHA: 8a8a96b
- [x] Push to origin/bld-a35f0-journey
- [x] PR opened: https://github.com/hdarwish/hdarwish.github.io/pull/23

## Acceptance Criteria Self-Check
- [x] AC1: Journey and Experience no longer maintain conflicting duplicate truth — company names aligned, descriptions derived from Experience — PASS
- [x] AC2: Experience wins when diverging — MCIT full name, Shory+First Tech, Talabat dash style all corrected from Experience — PASS
- [x] AC3: Journey visibly richer — all cards rewritten with narrative bullets matching Experience depth (Cairo ICT fair, team sizes, journalist narrative, data science, GitOps details) — PASS
- [x] AC4: No hallucinations — all added content sourced from existing Experience section bullet points — PASS
- [x] AC5: Responsive build passes — static HTML site, no build step; HTML structure validates clean — PASS
- [x] AC6: Branch pushed and PR opened — branch bld-a35f0-journey, PR #23 — PASS

## Notes
- Journey cards are popup overlays on SVG map (desktop) and horizontal scroll cards (mobile)
- Both desktop and mobile cards duplicate the data — must update both places
- No separate data model — all inline HTML
- Divergences found:
  - Shory company name: Journey="Shory" vs Experience="Shory — First Tech"
  - All Journey descriptions are terse sentence fragments vs Experience's narrative bullets
  - MCIT: Journey missing "launched at the Cairo ICT international fair"
  - Vodafone: Journey doesn't mention leading a team of 3 (only MCIT team size shown)
  - BBC: Journey missing "giving journalists tools to find connections" narrative
  - Careem: Journey missing data science partnership mention
  - Shory: Journey missing GitOps/ArgoCD/Helm/EKS/AKS platform details
