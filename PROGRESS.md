# Progress: Make Journey section experience-driven and richer
Card: t_a35f02ca
Branch: bld-a35f0-journey
Started: 2026-07-15

## Checklist
- [x] Read card and estimated
- [x] Inspect Journey and Experience sections in index.html
- [x] Identify divergences (company name, thin descriptions, missing details)
- [ ] Update desktop journey card descriptions to match Experience depth
- [ ] Update mobile journey card descriptions to match
- [ ] Fix Shory company name divergence (Journey="Shory" vs Experience="Shory — First Tech")
- [ ] Verify build/lint passes
- [ ] Commit and push
- [ ] Open PR

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
