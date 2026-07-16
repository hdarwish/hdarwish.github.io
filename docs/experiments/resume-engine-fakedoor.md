# Experiment: Resume Engine fake-door (no-upload CV bullet review)

**Status:** Launching — public entry point added from the homepage. The page (PR #24) is already
merged/live; this step makes it discoverable.
**Cards:** `t_946ac540` (page draft PR #24, merged) · `t_2fe0aa48` (this card — homepage entry point + 7-day kill note)
**Surface:** `resume-engine/index.html` — live URL: `https://hafs.dev/resume-engine/`
**Deployment note (`t_f6570e4e`):** `/resume-engine/` remains the fallback page; `/resume-engine-tool/` is the dedicated-repo-sourced deployment the homepage card now links to. Same mailto alias and D7 metric unchanged.
**Entry point:** one card in the homepage "Labs / Experiments" grid (`index.html`) → `resume-engine/index.html`
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

## Launch (this PR adds the entry point)
- **Entry point:** a single `project-card` in the homepage "Labs / Experiments" grid linking to
  `resume-engine/index.html`. Chosen as the smallest reversible surface — no top-nav item, no redesign,
  no new CSS (reuses the existing `status-waitlist` badge styling with the label "Experiment"). Rollback
  is deleting that one card block; the link is isolated and touches nothing else.
- **Launch clock:** the 7-day window STARTS when this entry point reaches live `hafs.dev` (PR merged +
  GitHub Pages deploy). Until merge/deploy the page stays reachable only by direct URL.
- **Owner:** Hafs Ibrahim (inbound email review + reply).

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
- **Files touched by the launch card (`t_2fe0aa48`):**
  - `index.html` — one added `project-card` block (with an adjacent kill-note HTML comment) in the
    "Labs / Experiments" grid.
  - `docs/experiments/resume-engine-fakedoor.md` — this note.
- **Underlying page (already live from PR #24):** `resume-engine/index.html`.
- **To kill the experiment:** delete the single homepage `project-card` block (and its comment), then
  redeploy. The page can stay or be removed separately. No data migration, no infra teardown — it is static.
- **To revert the whole launch commit:** `git revert <this_PR_merge_sha>`.

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
