#!/usr/bin/env python3
"""Fix script for bld-6fb3d-social PR:
1. Generate HTML files for blog/social-drafts/YYYY-MM-DD.html (browser-readable, preserves JSON)
2. Backfill missing og:description, twitter:title, twitter:description in blog HTML files
"""

import json
import os
import re
import html

BLOG_DIR = "blog"
SOCIAL_DIR = os.path.join(BLOG_DIR, "social-drafts")

def html_escape(s):
    return html.escape(s, quote=True)

def generate_social_draft_html(date, data):
    title = html_escape(data.get("title", date))
    linkedin = html_escape(data.get("social_teasers", {}).get("linkedin", ""))
    x_text = html_escape(data.get("social_teasers", {}).get("x", ""))
    share_desc = html_escape(data.get("share_description", ""))
    url = html_escape(data.get("url", f"https://hafs.dev/blog/{date}.html"))
    json_str = html_escape(json.dumps(data, indent=2))
    tags_list = data.get("tags", [])
    tags_html = "".join(f'<span class="tag">#{t}</span>' for t in tags_list)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Draft: {title} ({date}) - Hafs Ibrahim</title>
    <meta name="description" content="{share_desc}">
    <meta property="og:title" content="Social Draft: {title}">
    <meta property="og:description" content="{share_desc}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://hafs.dev/blog/social-drafts/{date}.html">
    <meta property="og:image" content="https://hafs.dev/og-blog.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Social Draft: {title}">
    <meta name="twitter:description" content="{share_desc}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../style.css">
    <style>
        body {{ background: #0d1117; color: #e6edf3; font-family: 'Inter', sans-serif; }}
        .container {{ max-width: 820px; margin: 0 auto; padding: 4rem 2rem; }}
        h1 {{ font-size: 1.8rem; margin-bottom: 0.5rem; color: #58a6ff; }}
        .date {{ color: #8b949e; font-size: 0.9rem; margin-bottom: 2rem; font-family: 'JetBrains Mono', monospace; }}
        .tags {{ margin-bottom: 2rem; }}
        .tag {{ background: rgba(56, 139, 253, 0.15); border: 1px solid rgba(56, 139, 253, 0.4);
                color: #58a6ff; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; margin-right: 0.5rem; }}
        .platform-card {{ background: #161b22; border: 1px solid #30363d; border-radius: 12px;
                          padding: 1.5rem; margin-bottom: 1.5rem; }}
        .platform-card h2 {{ font-size: 1rem; color: #8b949e; text-transform: uppercase;
                             letter-spacing: 0.08em; margin-bottom: 1rem; }}
        .draft-text {{ white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;
                       font-size: 0.88rem; line-height: 1.6; color: #e6edf3; }}
        .char-count {{ color: #8b949e; font-size: 0.75rem; margin-top: 0.75rem; }}
        .json-section {{ margin-top: 3rem; }}
        .json-section h2 {{ font-size: 1rem; color: #8b949e; margin-bottom: 1rem; }}
        .json-pre {{ background: #161b22; border: 1px solid #30363d; border-radius: 8px;
                     padding: 1.5rem; overflow-x: auto; font-size: 0.8rem; line-height: 1.5; }}
        .back-link {{ display: inline-block; margin-bottom: 2rem; color: #58a6ff; text-decoration: none; font-size: 0.9rem; }}
        .back-link:hover {{ text-decoration: underline; }}
        .post-link {{ display: inline-block; margin-top: 1rem; color: #58a6ff; font-size: 0.85rem; }}
    </style>
</head>
<body>
    <div class="container">
        <a href="../../blog.html" class="back-link">← Back to blog</a>
        <h1>{title}</h1>
        <div class="date">{date}</div>
        <div class="tags">{tags_html}</div>

        <div class="platform-card">
            <h2>LinkedIn</h2>
            <div class="draft-text">{linkedin}</div>
            <div class="char-count">{len(data.get("social_teasers", {}).get("linkedin", ""))} characters</div>
        </div>

        <div class="platform-card">
            <h2>X (Twitter)</h2>
            <div class="draft-text">{x_text}</div>
            <div class="char-count">{len(data.get("social_teasers", {}).get("x", ""))} characters (limit: 280)</div>
        </div>

        <a href="{url}" class="post-link">→ View full post</a>

        <div class="json-section">
            <h2>Raw JSON</h2>
            <pre class="json-pre">{json_str}</pre>
        </div>
    </div>
</body>
</html>
"""

def fix_blog_html_meta(html_path, post):
    with open(html_path) as f:
        content = f.read()

    share_desc = html_escape(post.get("share_description", ""))
    title = html_escape(post.get("title", ""))
    changed = False

    # Add og:description after og:title if missing
    if "og:description" not in content:
        content = re.sub(
            r'(<meta property="og:title"[^>]*>)',
            rf'\1\n    <meta property="og:description" content="{share_desc}">',
            content
        )
        changed = True

    # Add twitter:title and twitter:description after twitter:card if missing
    if "twitter:title" not in content or "twitter:description" not in content:
        replacement = f'<meta name="twitter:card" content="summary_large_image">'
        if "twitter:title" not in content:
            replacement += f'\n    <meta name="twitter:title" content="{title}">'
        if "twitter:description" not in content:
            replacement += f'\n    <meta name="twitter:description" content="{share_desc}">'
        content = content.replace(
            '<meta name="twitter:card" content="summary_large_image">',
            replacement
        )
        changed = True

    if changed:
        with open(html_path, "w") as f:
            f.write(content)
        return True
    return False


def main():
    with open(os.path.join(BLOG_DIR, "posts.json")) as f:
        posts = json.load(f)

    # Build date -> post lookup
    post_by_date = {p["date"]: p for p in posts}

    # Step 1: Generate HTML files for social-drafts
    html_created = 0
    for filename in sorted(os.listdir(SOCIAL_DIR)):
        if not filename.endswith(".json"):
            continue
        date = filename[:-5]  # strip .json
        json_path = os.path.join(SOCIAL_DIR, filename)
        html_path = os.path.join(SOCIAL_DIR, f"{date}.html")
        with open(json_path) as f:
            data = json.load(f)
        html_content = generate_social_draft_html(date, data)
        with open(html_path, "w") as f:
            f.write(html_content)
        html_created += 1
        print(f"  Created: {html_path}")

    print(f"\nCreated {html_created} social-draft HTML files")

    # Step 2: Backfill missing meta tags in blog HTML files
    updated = 0
    skipped = 0
    for filename in sorted(os.listdir(BLOG_DIR)):
        if not filename.endswith(".html"):
            continue
        date = filename[:-5]
        if date not in post_by_date:
            print(f"  WARN: no post data for {filename}")
            continue
        html_path = os.path.join(BLOG_DIR, filename)
        if fix_blog_html_meta(html_path, post_by_date[date]):
            updated += 1
            print(f"  Updated meta: {filename}")
        else:
            skipped += 1

    print(f"\nUpdated {updated} blog HTML files, {skipped} already complete")

    # Step 3: Verification counts
    print("\n=== Verification ===")
    print(f"posts.json entries: {len(posts)}")
    with_desc = sum(1 for p in posts if p.get("share_description"))
    with_teasers = sum(1 for p in posts if p.get("social_teasers"))
    print(f"With share_description: {with_desc}")
    print(f"With social_teasers: {with_teasers}")

    json_files = [f for f in os.listdir(SOCIAL_DIR) if f.endswith(".json")]
    html_files = [f for f in os.listdir(SOCIAL_DIR) if f.endswith(".html")]
    print(f"social-drafts JSON files: {len(json_files)}")
    print(f"social-drafts HTML files: {len(html_files)}")

    # Check X over 280
    over_280 = [p["date"] for p in posts if len(p.get("social_teasers", {}).get("x", "")) > 280]
    print(f"X teasers over 280 chars: {len(over_280)}")

    # Check blog HTML meta parity
    import os as _os
    blog_htmls = sorted([f for f in _os.listdir(BLOG_DIR) if f.endswith(".html")])
    missing_meta = []
    for filename in blog_htmls:
        path = _os.path.join(BLOG_DIR, filename)
        with open(path) as fh:
            c = fh.read()
        issues = []
        if "og:description" not in c:
            issues.append("og:description")
        if "twitter:title" not in c:
            issues.append("twitter:title")
        if "twitter:description" not in c:
            issues.append("twitter:description")
        if issues:
            missing_meta.append((filename, issues))
    print(f"Blog HTML files with missing meta: {len(missing_meta)}")
    for f, issues in missing_meta[:5]:
        print(f"  {f}: {issues}")

    print("\nDone.")


if __name__ == "__main__":
    main()
