#!/usr/bin/env python3
"""
verify_social_parity.py — regression script for PR #17 social teaser backfill.

Enforces cross-file parity across:
  - blog/posts.json (entries with share_description/social_teasers/canonical_url)
  - blog/social-drafts/{date}.json (1:1 with posts, field values match)
  - blog/social-drafts/{date}.html (1:1 with JSON drafts)
  - blog/{date}.html (og:description, twitter:title, twitter:description present)
  - X teaser <= 280 chars for all posts

Exit 0 = all checks pass, exit 1 = failures.
Run from repo root: python3 verify_social_parity.py
"""

import html
import json
import os
import re
import sys

BLOG_DIR = "blog"
SOCIAL_DIR = os.path.join(BLOG_DIR, "social-drafts")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def meta_content(html_text, prop, attr="property"):
    """Extract content attribute from a meta tag matching the given property/name."""
    for pat in (
        rf'<meta\s+{attr}="{re.escape(prop)}"\s+content="([^"]*)"',
        rf'<meta\s+content="([^"]*)"\s+{attr}="{re.escape(prop)}"',
    ):
        m = re.search(pat, html_text)
        if m:
            return html.unescape(m.group(1))
    return None


def main():
    failures = []
    counts = {}

    # ── 1. Load posts.json ────────────────────────────────────────────────────
    posts_path = os.path.join(BLOG_DIR, "posts.json")
    with open(posts_path) as f:
        all_posts = json.load(f)

    posts = [p for p in all_posts if DATE_RE.match(p.get("date", ""))]
    post_by_date = {p["date"]: p for p in posts}
    N = len(posts)

    counts["posts_total"] = N
    counts["with_share_description"] = sum(1 for p in posts if p.get("share_description"))
    counts["with_social_teasers"] = sum(1 for p in posts if p.get("social_teasers"))
    counts["with_canonical_url"] = sum(1 for p in posts if p.get("canonical_url"))

    for key, field in (
        ("with_share_description", "share_description"),
        ("with_social_teasers", "social_teasers"),
        ("with_canonical_url", "canonical_url"),
    ):
        if counts[key] < N:
            failures.append(f"posts.json: {N - counts[key]} entries missing {field}")

    # ── 2. social-drafts JSON parity ──────────────────────────────────────────
    draft_jsons = sorted(f for f in os.listdir(SOCIAL_DIR) if f.endswith(".json"))
    draft_dates = {f[:-5] for f in draft_jsons}
    post_dates = set(post_by_date)
    counts["draft_json_files"] = len(draft_jsons)

    for d in sorted(post_dates - draft_dates):
        failures.append(f"Missing social-draft JSON: {d}.json")
    for d in sorted(draft_dates - post_dates):
        failures.append(f"Orphaned social-draft JSON (no post): {d}.json")

    field_ok = 0
    for date, post in sorted(post_by_date.items()):
        path = os.path.join(SOCIAL_DIR, f"{date}.json")
        if not os.path.exists(path):
            continue
        with open(path) as f:
            draft = json.load(f)
        ok = True
        if draft.get("share_description") != post.get("share_description"):
            failures.append(f"{date}: share_description mismatch (posts.json vs draft JSON)")
            ok = False
        pt, dt = post.get("social_teasers", {}), draft.get("social_teasers", {})
        for platform in ("x", "linkedin"):
            if dt.get(platform) != pt.get(platform):
                failures.append(
                    f"{date}: social_teasers.{platform} mismatch (posts.json vs draft JSON)"
                )
                ok = False
        if ok:
            field_ok += 1
    counts["draft_json_field_parity"] = field_ok

    # ── 3. social-drafts HTML parity ─────────────────────────────────────────
    draft_htmls = sorted(f for f in os.listdir(SOCIAL_DIR) if f.endswith(".html"))
    draft_html_dates = {f[:-5] for f in draft_htmls}
    counts["draft_html_files"] = len(draft_htmls)

    for d in sorted(draft_dates - draft_html_dates):
        failures.append(f"Missing social-draft HTML: {d}.html")
    for d in sorted(draft_html_dates - draft_dates):
        failures.append(f"Orphaned social-draft HTML (no JSON): {d}.html")

    # ── 4. blog HTML meta tags ────────────────────────────────────────────────
    blog_html_count = 0
    meta_ok = 0
    for date, post in sorted(post_by_date.items()):
        path = os.path.join(BLOG_DIR, f"{date}.html")
        if not os.path.exists(path):
            failures.append(f"Missing blog HTML: blog/{date}.html")
            continue
        blog_html_count += 1
        with open(path) as f:
            content = f.read()
        issues = [
            tag
            for tag, prop, attr in (
                ("og:description",     "og:description",     "property"),
                ("twitter:title",      "twitter:title",      "name"),
                ("twitter:description","twitter:description","name"),
            )
            if meta_content(content, prop, attr) is None
        ]
        if issues:
            failures.append(f"blog/{date}.html: missing meta tag(s): {', '.join(issues)}")
        else:
            meta_ok += 1

    counts["blog_html_files"] = blog_html_count
    counts["blog_html_meta_ok"] = meta_ok

    # ── 5. X teaser <= 280 chars ─────────────────────────────────────────────
    x_over = [
        (p["date"], len(p["social_teasers"]["x"]))
        for p in posts
        if len(p.get("social_teasers", {}).get("x", "")) > 280
    ]
    counts["x_over_280"] = len(x_over)
    for date, length in x_over:
        failures.append(f"{date}: X teaser is {length} chars (limit: 280)")

    # ── Summary table ────────────────────────────────────────────────────────
    matched = len(draft_dates & post_dates)
    rows = [
        ("posts.json date entries",       counts["posts_total"],              N,       False),
        ("  with share_description",      counts["with_share_description"],   N,       False),
        ("  with social_teasers",         counts["with_social_teasers"],      N,       False),
        ("  with canonical_url",          counts["with_canonical_url"],       N,       False),
        ("social-drafts JSON files",      counts["draft_json_files"],         N,       False),
        ("  field parity (JSON vs posts)",counts["draft_json_field_parity"],  matched, False),
        ("social-drafts HTML files",      counts["draft_html_files"],         N,       False),
        ("blog HTML files",               counts["blog_html_files"],          N,       False),
        ("  with all 3 meta tags",        counts["blog_html_meta_ok"],        N,       False),
        ("X teasers > 280 chars",         counts["x_over_280"],               0,       True),
    ]

    print("Metric                                 Count  Expected  Status")
    print("-" * 62)
    for label, count, expected, want_zero in rows:
        status = "OK" if count == expected else "FAIL"
        print(f"{label:<38} {count:5}  {expected:5}     {status}")

    print()
    if failures:
        print(f"FAIL — {len(failures)} check(s) failed:")
        for msg in failures:
            print(f"  * {msg}")
        sys.exit(1)
    else:
        print(f"PASS — all parity checks OK")
        print(
            f"  {N} posts / {counts['draft_json_files']} JSON drafts / "
            f"{counts['draft_html_files']} HTML drafts / "
            f"{counts['blog_html_files']} blog HTMLs / x_over_280=0"
        )


if __name__ == "__main__":
    main()
