# YouTube description templates — `/hire/` funnel (8 videos)

**Status:** DRAFT — review only. Do **not** paste into YouTube until Hafs approves this exact copy.
**Landing target:** `https://hafs.dev/hire/`
**Attribution model:** zero-infra. See `docs/experiments/hire-youtube-funnel.md` for the full spec,
the honest limitation, and the exact CFO commands. No pixel, no analytics SaaS, no new PII.

---

## How to use this file

1. Each of the 8 videos below has its **own** `utm_campaign=<video-slug>` — the slug is the only
   per-video-unique token, so inquiries and clicks can be grouped by video.
2. Replace the placeholders before publishing:
   - `[PARENT_VIDEO_ID]` — the 11-char YouTube ID of *this* video (e.g. `dQw4w9WgXcQ`).
   - `[PARENT_VIDEO_URL]` — `https://youtu.be/[PARENT_VIDEO_ID]`.
   - `[PLAYLIST_ID]` — the ID of the series playlist all 8 belong to.
   - `[PLAYLIST_URL]` — `https://www.youtube.com/playlist?list=[PLAYLIST_ID]`.
3. `utm_content=[PARENT_VIDEO_ID]` carries the source video ID into the link so a click can be traced
   to the exact upload even if two videos ever share a slug by mistake.
4. Keep the link on its own line so YouTube auto-links it.

**Canonical link shape (all 8 use this exact pattern, only the slug changes):**

```
https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=<video-slug>&utm_content=[PARENT_VIDEO_ID]
```

**One concrete sample (video 1):**

```
https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=esim-scale&utm_content=[PARENT_VIDEO_ID]
```

---

## Video 1 — slug: `esim-scale`

> **Working title:** How an eSIM platform actually provisions 20,000 phones
>
> I led the team on a Remote SIM Provisioning platform back in the early eSIM days — half the job was
> reading a spec that was still being written. Here's how the provisioning flow really works, end to end.
>
> 🛠 Need this kind of systems/backend work built or rescued? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=esim-scale&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Video 2 — slug: `graph-pipelines`

> **Working title:** Turning a media archive into a graph you can actually query
>
> At BBC scale, the interesting part isn't the data — it's the connections between stories. I walk
> through building pipelines that turn disparate content systems into a graph journalists can search.
>
> 🛠 Need data pipelines or a graph backend built? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=graph-pipelines&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Video 3 — slug: `fastapi-dashboard`

> **Working title:** A production analytics dashboard, backend to map
>
> FastAPI + PostgreSQL + Angular + Leaflet — a real oil & gas production dashboard, from schema to
> geospatial view. The repo is public; this is how the pieces fit.
>
> 🛠 Want a data-to-dashboard system built for your domain? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=fastapi-dashboard&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Video 4 — slug: `nl-search`

> **Working title:** "Blue sofa under $900" → a real database query
>
> Natural-language search that returns real products instead of keyword soup. I parse plain English into
> structured MongoDB queries — Express + TypeScript backend. Walkthrough of the parsing layer.
>
> 🛠 Building search or an NL-to-query backend? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=nl-search&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Video 5 — slug: `api-design`

> **Working title:** API design mistakes I stopped making after 15 years
>
> Versioning, idempotency, error shapes, and the boundaries that decide whether your API ages well.
> Concrete before/after examples from real platforms.
>
> 🛠 Want your API designed or reviewed before it hardens? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=api-design&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Video 6 — slug: `data-modeling`

> **Working title:** Modeling data so it survives the next 10x
>
> The schema decisions that quietly decide whether scaling is a config change or a rewrite. How I model
> for growth without over-engineering day one.
>
> 🛠 Need a data model that won't buckle at scale? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=data-modeling&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Video 7 — slug: `backend-rescue`

> **Working title:** Rescuing a backend that's slow, flaky, and scary to touch
>
> Profiling, isolating the hot path, and shipping the fix without a rewrite. My checklist for taking over
> a backend nobody wants to open.
>
> 🛠 Have a backend that needs rescuing? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=backend-rescue&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Video 8 — slug: `mobile-backend`

> **Working title:** The server side of a mobile app nobody talks about
>
> Provisioning, auth, sync, and device APIs — the mobile backend that has to be right before the app
> feels good. Lessons from telecom/eSIM-grade reliability.
>
> 🛠 Building the backend for a mobile or device product? Hire me — one email, no form:
> https://hafs.dev/hire/?utm_source=youtube&utm_medium=video-description&utm_campaign=mobile-backend&utm_content=[PARENT_VIDEO_ID]
>
> ▶ This video: [PARENT_VIDEO_URL]
> 📺 Full series: [PLAYLIST_URL]

---

## Slug ↔ campaign index (for the CFO report)

| # | Video slug        | utm_campaign      | Topic                                  |
|---|-------------------|-------------------|----------------------------------------|
| 1 | `esim-scale`      | `esim-scale`      | eSIM provisioning platform             |
| 2 | `graph-pipelines` | `graph-pipelines` | BBC-scale media graph pipelines        |
| 3 | `fastapi-dashboard`| `fastapi-dashboard`| Production analytics dashboard        |
| 4 | `nl-search`       | `nl-search`       | NL → database query search             |
| 5 | `api-design`      | `api-design`      | API design                             |
| 6 | `data-modeling`   | `data-modeling`   | Data modeling for scale                |
| 7 | `backend-rescue`  | `backend-rescue`  | Backend rescue                         |
| 8 | `mobile-backend`  | `mobile-backend`  | Mobile/device backend                  |
