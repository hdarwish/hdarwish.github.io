# Experiment: Resume Engine fake-door (no-upload CV bullet review)

**Status:** Draft — PR/preview prep only. NOT launched. NOT publicly merged.
**Card:** `t_946ac540` — [portfolio][builder][P1] Draft no-upload Resume Engine fake-door CTA PR
**Surface:** `resume-engine/index.html` → live URL after any future launch merge: `https://hafs.dev/resume-engine/`
**Type:** Fake-door demand test. Static page + mailto CTA. No backend, no upload, no storage, no payment, no tracking.

---

## Hypothesis
There is standalone demand for a lightweight, human **CV bullet critique** (a "6-filter pass") as a lead magnet
for consulting / productized-service work — separate from the existing full-rewrite `resume-boost` fake-door.
A privacy-safe, no-upload contact CTA is enough to measure that interest before building anything real.

## What was built
- A single static page, `resume-engine/index.html`, using existing site conventions (`style.css`, shared nav,
  theme toggle, footer).
- The offer: a **6-filter pass** on 2–3 CV bullets — (1) strong lead verb, (2) quantified outcome,
  (3) scope & scale, (4) concrete specifics, (5) signal over duties, (6) role alignment.
- The CTA is a **`mailto:` link only**. It opens the visitor's own email client with a pre-filled draft.
  Nothing is submitted, parsed, or stored by the site.

## Explicit non-build (guardrails honored)
- **NO_RESUME_UPLOAD** — page has no file input and no resume text box.
- **NO_RESUME_STORAGE** — static page; nothing is persisted anywhere.
- **NO_AI_API** — no model/API call; review is a human email reply.
- **NO_EXTERNAL_FORM_SERVICE** — no Typeform/Google Forms/etc.
- **NO_PAYMENT / NO_AUTH** — no checkout, no sign-up, no account.
- **NO_TRACKING_INSTALL** — no analytics/pixel/third-party script added. (Page loads existing shared `script.js`
  for the theme toggle only — no tracking code introduced by this card.)
- **NO_PUBLIC_MERGE_FROM_THIS_CARD** — delivered as a branch/PR for review only.

## Proposed launch (pending Architect/Reviewer approval — NOT yet done)
- **Launch window:** 7 days, first Monday–Sunday after approval to merge.
- **Owner:** Hafs Ibrahim (inbound email review + reply).
- **Launch step (not in this PR):** link the page from the homepage projects grid / nav so it is discoverable.
  Until then the page is reachable only by direct URL for preview.

## Success metric
- **Primary:** ≥ 3 qualified inbound CV-review requests to `hafs.darwish+resumeengine@gmail.com`
  during the 7-day window. "Qualified" = a real person naming a target role and asking for bullet feedback
  (not spam/automated).
- **Secondary (only if a zero-new-infra source already exists):** ≥ 10 CTA clicks / page visits.
  No analytics is installed by this card; the `+resumeengine` email alias is the zero-infra attribution signal
  (inbound volume to that alias = interest). If GitHub Pages / server access logs are available post-launch,
  they may serve as the visit source without adding any tracking script.

## Kill criteria
- **0 qualified requests by day 7** → remove or park the page. Do not invest further.
- Any privacy complaint or confusion about data handling → pull immediately and revisit copy.

## Rollback path (exact)
- **Files introduced by this card:**
  - `resume-engine/index.html`
  - `docs/experiments/resume-engine-fakedoor.md`
- **Branch:** `bld-946ac-resume-engine`
- **To revert before merge:** simply do not merge the PR (branch is isolated from `master`).
- **To revert after any future launch merge:** `git revert <merge_commit_sha>` (or delete the two files above
  and the homepage link added at launch), then redeploy. No data migration, no infra teardown — it is static.

## Launch copy (for reference / future homepage card)
> **Resume Engine** — A focused 6-filter pass on your CV bullet points, so each line earns its space and
> survives the recruiter skim. No upload, no account, no payment — you email me the bullets you choose to share.

## CTA text
- Primary button: **"Request a 6-filter review"**
- Bottom button: **"Email me my bullets for review"**
- Reassurance line: *"Opens your email app · Nothing sends until you press send"*
- mailto target: `hafs.darwish+resumeengine@gmail.com`
  Subject: `Resume Engine — CV bullet review request`
  Pre-filled body prompts for target role, seniority, and up to 3 bullets (all optional, user-pasted only).
