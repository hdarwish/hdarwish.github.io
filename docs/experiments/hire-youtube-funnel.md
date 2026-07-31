# Experiment: `/hire/` YouTube funnel + zero-infra attribution spec

**Status:** DRAFT — review-only PR on branch `bld/yt-funnel-hire`. Not merged, not deployed.
YouTube descriptions are **not** published until Hafs approves the exact copy.
**Card:** `t_aed4aeaf` (parent strategy `t_907977d0`; corrects archived routing cards
`t_d3afe32a`, `t_8085b3fd`).
**Surface:** `hire/index.html` — intended live URL: `https://hafs.dev/hire/` (direct-URL only; no
homepage nav card added by this PR).
**Type:** Lead funnel. Static page + `mailto:` CTA. No backend, no form, no upload, no storage, no
payment, no tracking script, no analytics SaaS.

---

## Hypothesis
Eight topical YouTube videos (systems / backend / mobile) can route qualified inbound to a single,
narrow `/hire/` page, and inquiries can be attributed **per video** using only free, already-present
infrastructure (GitHub Pages static hosting + Gmail plus-addressing) — with **no new PII** and no
tracking install.

## What was built (this PR)
- `hire/index.html` — one static page, house style (`style.css`, shared nav, theme toggle, footer,
  shared `script.js` for the theme toggle only). Offer = 3 narrow lanes (Systems & APIs, Backend
  Rescue, Mobile-grade Infra). Proof = 3 existing artifacts (og-production-analytics repo,
  smart-product-assistant/ShelfMind repo, eSIM+BBC career track linking back to the portfolio).
  One contact action = a `mailto:` CTA to `hafs.darwish+hire@gmail.com`.
- `hire/youtube-descriptions.md` — durable 8-video description-template artifact. Each video has a
  **distinct** `utm_campaign=<video-slug>` and `[PARENT_VIDEO_ID]` / `[PARENT_VIDEO_URL]` /
  `[PLAYLIST_ID]` / `[PLAYLIST_URL]` placeholders.
- `docs/experiments/hire-youtube-funnel.md` — this spec.

## Explicit non-build (guardrails honored)
- **NO_FORM / NO_EMAIL_CAPTURE** — CTA is a `mailto:` only; nothing is submitted or parsed by the site.
- **NO_ANALYTICS_SAAS / NO_PIXEL / NO_TRACKING_INSTALL** — no GA, Plausible, Umami, or third-party
  script. The inline enhancement script (below) makes **zero network calls** and stores nothing.
- **NO_NEW_PII** — attribution reuses Gmail plus-addressing. The only personal data received is what a
  visitor voluntarily types into their own email draft and chooses to send.
- **NO_AUTH / NO_PAYMENT / NO_SIGNUP_WALL / NO_DARK_PATTERN.**
- **NO_PUBLIC_MERGE / NO_YT_EDIT_FROM_THIS_CARD** — delivered as a branch/PR for review only; YouTube
  descriptions stay unpublished until Hafs approves the exact copy.

---

## Attribution mechanism (zero-infra)

Two independent signals, neither of which adds infrastructure or PII:

### A. Inquiry attribution — the primary, reliable signal (site/email side)
- **Every** `/hire/` CTA targets the dedicated alias **`hafs.darwish+hire@gmail.com`**. Any email to
  that alias = a funnel inquiry. This works with **JavaScript disabled** → funnel-level attribution
  always survives.
- **Progressive enhancement (per-video):** a tiny inline script on `hire/index.html` reads
  `?utm_campaign=<slug>` from the URL and reflects the slug into the mailto **subject**:
  `Hire inquiry` → `Hire inquiry [<slug>]`. When the visitor sends the pre-filled draft, the source
  video's slug is in the subject line. The script makes no network call, sets no cookie, stores
  nothing — it only edits the CTA's `href` in the visitor's own browser.
- **Result:** inquiries are queryable per campaign from the inbox with no tooling install.

### B. Click attribution — best-effort only (YouTube side)
- **Honest limitation:** GitHub Pages is static hosting and **does not expose server access logs** to
  the site owner. There is therefore **no queryable, first-party record of clicks by campaign** on the
  site. This PR does **not** fabricate one, and deliberately does **not** add a redirect logger, pixel,
  or analytics SaaS to manufacture one.
- The only **already-existing, no-new-tool** click signal is **YouTube Studio's own analytics** — the
  per-video "external link / card / end-screen" click report YouTube already provides for the channel.
  It is approximate (it counts clicks that leave YouTube, not landings on `/hire/`), so treat it as a
  directional numerator, not ground truth.
- **Smallest future upgrade, if a real click count is ever required** (documented, not built here):
  the *smallest no-new-PII* mechanism would be a static per-slug redirect stub committed to the repo
  (e.g. `hire/go/<slug>/index.html` doing a `<meta refresh>` to the UTM URL) — but that still yields no
  queryable count on GitHub Pages without server logs, so it is **not worth adding**. The recommended
  position is: rely on signal A (inquiries) as the decision metric, and YouTube Studio (signal B) as
  the soft top-of-funnel read. Do not add site-side click tracking.

---

## CFO attribution — exact commands / exports / endpoints

### 1. Inquiries by referrer (campaign) — primary metric
Source: the `hafs.darwish+hire@gmail.com` inbox (funnel) + subject slug (per video).

**a) Gmail UI search (copy-paste, zero setup):**
```
# All funnel inquiries:
to:hafs.darwish+hire@gmail.com

# Inquiries from one video (e.g. esim-scale):
to:hafs.darwish+hire@gmail.com subject:("[esim-scale]")
```

**b) Gmail API endpoint (queryable, scriptable, no new PII):**
```
GET https://gmail.googleapis.com/gmail/v1/users/me/messages?q=to:hafs.darwish%2Bhire@gmail.com
GET https://gmail.googleapis.com/gmail/v1/users/me/messages?q=to:hafs.darwish%2Bhire@gmail.com+subject:%5Besim-scale%5D
```
`resultSizeEstimate` (or the length of the returned `messages[]`) = the count for that campaign.

**c) Offline count from a Gmail export (Google Takeout → `.mbox`, an existing free export):**
```bash
# Total funnel inquiries in the export:
grep -icE '^(To|Delivered-To):.*hafs\.darwish\+hire@gmail\.com' hire-inbox.mbox

# Inquiries grouped by campaign slug (parsed from the [slug] subject tag):
grep -hoE '^Subject:.*\[[a-z0-9-]+\]' hire-inbox.mbox \
  | grep -oE '\[[a-z0-9-]+\]' \
  | sort | uniq -c | sort -rn
```

### 2. Clicks by campaign — top-of-funnel (approximate, YouTube-native)
Source: YouTube Studio (no new tool). There is **no site-side click log** (see limitation above).

**a) YouTube Studio UI:**
```
YouTube Studio → Analytics → Content → (select a video) → "External" / card & end-screen click report
→ Export current view (CSV). Repeat per video; group rows by the video's slug from the index table
in hire/youtube-descriptions.md.
```

**b) YouTube Analytics API endpoint (if a scripted export is wanted):**
```
GET https://youtubeanalytics.googleapis.com/v2/reports
      ?ids=channel==MINE
      &startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
      &metrics=cardClickRate,cardClicks,cardImpressions
      &dimensions=video
      &sort=-cardClicks
```
Map each returned `video` ID back to its slug via the table in `hire/youtube-descriptions.md`.
**Caveat for the CFO:** these are YouTube-side clicks, not verified `/hire/` landings; the reliable
conversion metric is inquiries-by-campaign in §1.

---

## Success metric (proposed — Hafs to confirm at launch)
- **Primary:** ≥ N qualified inbound inquiries to `hafs.darwish+hire@gmail.com` within the measurement
  window, where "qualified" = a real person describing a systems/backend/mobile problem (not spam).
  Per-video credit from the `[slug]` subject tag.
- **Secondary (no new infra):** YouTube Studio per-video external-click counts as a directional read.

## Kill / rollback (exact)
- **Files added by this PR:** `hire/index.html`, `hire/youtube-descriptions.md`,
  `docs/experiments/hire-youtube-funnel.md`. Nothing else is touched.
- **To kill:** delete the `hire/` directory (and optionally this doc) and redeploy. Static, no data
  migration, no infra teardown. YouTube descriptions, if ever published, are reverted in YouTube Studio
  independently.
- **To revert the whole thing:** `git revert <merge_sha>` (or never merge — this is review-only).

---

## Publication gate (HARD)
Landing copy (`hire/index.html`) and the 8 description templates (`hire/youtube-descriptions.md`) are
user-facing. They ship in this PR for review. **Do not** merge, deploy, edit any YouTube description,
or publish metadata until **Hafs explicitly approves the exact copy.**
