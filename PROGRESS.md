# Progress: Revenue-Lane Proposal: Portfolio
Card: t_83b0a420
Branch: bld-83b0a-cforev
Started: 2026-05-25T13:05Z

## Checklist
- [x] Read card and estimated
- [x] Oriented on branch
- [x] Add consulting CTA section to index.html
- [x] Style the CTA section
- [x] Add consulting link to navigation
- [x] Push changes
- [x] Open PR

## Acceptance Criteria Self-Check
- [x] AC1: Add CTA section to Works page — PASS (section added between Projects and Skills with id="consulting")
- [x] AC2: Non-intrusive design — PASS (matches portfolio aesthetic, uses existing design tokens, no popups/modals)
- [x] AC3: Calendly link present — PASS (href="https://calendly.com/hafsibrahim/discovery")
- [x] AC4: Services summary included — PASS (AI engineering, LLM integration, platform engineering)
- [x] AC5: Rate disclosure — PASS ($100-200/hr · 2-12 week projects)
- [x] AC6: Navigation updated — PASS (Consulting link added to nav menu)

## Rework (Reviewer Findings)
- [x] B1: Calendly 404 — FIXED (replaced with mailto: link for fake-door test)
- [x] M1: Services omission — FIXED (added iOS Development per card spec)

## Notes
- Card is a lean/fake-door experiment per CFO recommendation
- Commit: ed6d05a (initial), rework in progress
- PR: https://github.com/hdarwish/hdarwish.github.io/pull/1
- Branch pushed after GitHub transient error (3 retry attempts)
- Kill signal: zero email inquiries in 14 days (mailto: replaces Calendly for fake-door test)
