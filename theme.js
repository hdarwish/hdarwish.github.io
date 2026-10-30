/* ============================================================
   theme.js — the single source of truth for the v2 theme system
   ============================================================
   Shared by index.html, blog.html, and every generated blog post
   (herald/blog/render_v2.py). A page never carries its own copy of
   the theme list, the boot, or the switcher logic — this file is
   the "layout parent" for theming on a static site.

   Responsibilities:
     1. Boot (no-FOUC): read the persisted choice and set
        data-theme on <html> as early as possible. index.html keeps
        a tiny inline head script for the very-first-paint case; this
        boot is the shared, authoritative one and is idempotent.
     2. Switcher: the top-right nav button (#theme-cycle) is the ONLY
        theme control. Clicking it advances to the next theme.
     3. Theme list: ORDER below is the single source of truth for the
        set and the cycle order.

   Persistence:
     - localStorage key 'portfolio-theme' (unchanged from v2 — current
       users' choice survives).
     - An explicit ?theme= query param wins and is persisted, so
       themed preview links work.
   Default: 'seminar' (Hafs keeps it).
   ============================================================ */
(function () {
    'use strict';

    var KEY = 'portfolio-theme';

    // Single source of truth: the 9-theme set, in cycle order.
    // Cycle: seminar → swiss → paper → blueprint → dark → light → eink → xterm → drunk
    var THEMES = [
        { id: 'seminar',   label: 'SEMINAR',   icon: '◑' },
        { id: 'swiss',     label: 'SWISS',     icon: '◼' },
        { id: 'paper',     label: 'PAPER',     icon: '▤' },
        { id: 'blueprint', label: 'BLUEPRINT', icon: '▦' },
        { id: 'dark',      label: 'DARK',      icon: '🌑' },
        { id: 'light',     label: 'LIGHT',     icon: '🌞' },
        { id: 'eink',      label: 'EINK',      icon: '📰' },
        { id: 'xterm',     label: 'XTERM',     icon: '💻' },
        { id: 'drunk',     label: 'DRUNK',     icon: '🥴' }
    ];
    var DEFAULT = 'seminar';

    function validIds() {
        return THEMES.map(function (t) { return t.id; });
    }
    function byId(id) {
        for (var i = 0; i < THEMES.length; i++) {
            if (THEMES[i].id === id) return THEMES[i];
        }
        return null;
    }
    function idxOf(id) {
        var ids = validIds();
        var i = ids.indexOf(id);
        return i === -1 ? 0 : i;
    }

    // ---- Boot: resolve the theme to apply right now --------------
    // Query param wins (and is persisted); else localStorage; else
    // default. Returns the resolved id without touching the DOM.
    function resolve() {
        var t = null;
        try {
            var q = new URLSearchParams(location.search).get('theme');
            if (q && validIds().indexOf(q) !== -1) {
                t = q;
                try { localStorage.setItem(KEY, t); } catch (e) {}
            } else {
                t = localStorage.getItem(KEY);
            }
        } catch (e) {}
        if (validIds().indexOf(t) === -1) t = DEFAULT;
        return t;
    }

    // ---- Apply: set data-theme + keep the switcher in sync -------
    function current() {
        return document.documentElement.getAttribute('data-theme') || DEFAULT;
    }
    function render() {
        var t = current();
        var meta = byId(t) || byId(DEFAULT);
        var btn = document.getElementById('theme-cycle');
        if (btn) {
            var icon = btn.querySelector('.theme-icon');
            var name = btn.querySelector('.theme-name');
            if (icon) icon.textContent = meta.icon;
            if (name) name.textContent = meta.label;
            btn.setAttribute('aria-label', 'Theme ' + meta.label + '. Activate to switch theme.');
            btn.setAttribute('title', 'Theme: ' + meta.label + ' (click to cycle)');
            // Expose position for accessibility / future UI: N of 9.
            btn.setAttribute('data-theme-index', String(idxOf(t) + 1));
            btn.setAttribute('data-theme-count', String(THEMES.length));
        }
    }
    function setTheme(t) {
        if (validIds().indexOf(t) === -1) return;
        document.documentElement.setAttribute('data-theme', t);
        try { localStorage.setItem(KEY, t); } catch (e) {}
        render();
    }
    function cycle() {
        var next = THEMES[(idxOf(current()) + 1) % THEMES.length];
        setTheme(next.id);
    }

    // ---- Wire up (idempotent) ------------------------------------
    function boot() {
        // Always apply the resolved theme (covers ?theme= and any
        // drift), then keep the switcher button in sync.
        document.documentElement.setAttribute('data-theme', resolve());
        var btn = document.getElementById('theme-cycle');
        if (btn && !btn.__themeWired) {
            btn.__themeWired = true;
            btn.addEventListener('click', function () { cycle(); });
        }
        render();
    }

    // Export for tests / other scripts; no-op in the browser.
    window.__theme = {
        KEY: KEY,
        THEMES: THEMES.map(function (t) { return t.id; }),
        DEFAULT: DEFAULT,
        resolve: resolve,
        setTheme: setTheme,
        cycle: cycle
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
