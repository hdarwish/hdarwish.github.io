// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
});

// Close mobile nav on link click
links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observe elements for animation
document.querySelectorAll('.timeline-item, .project-card, .skill-group, .stat, .about-text, .contact-box').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ============================================
// Journey Map — Interactive SVG Career Map
// ============================================
(function() {
    const mapWrap = document.getElementById('journey-map-wrap');
    const svg = document.getElementById('journey-map');
    if (!svg || !mapWrap) return;

    const cities = svg.querySelectorAll('.journey-city');
    const overlay = document.getElementById('journey-card-overlay');
    const cards = overlay ? overlay.querySelectorAll('.journey-card') : [];
    const segs = svg.querySelectorAll('.journey-flight-seg');
    const flightPath = document.getElementById('flight-path');
    let activeCity = null;
    let animationTriggered = false;

    // City center coordinates in SVG space
    const cityCoords = {
        cairo:   { x: 569, y: 334 },
        london:  { x: 221, y: 95 },
        dubai:   { x: 837, y: 387 },
        abudhabi:{ x: 827, y: 395 }
    };

    // Draw flight path on scroll into view
    function triggerDrawAnimation() {
        if (animationTriggered) return;
        animationTriggered = true;

        // Measure each segment's actual length and set dasharray
        segs.forEach(seg => {
            const len = seg.getTotalLength();
            seg.style.strokeDasharray = len;
            seg.style.strokeDashoffset = len;
        });

        // Stagger the draw
        const delays = [200, 1400, 2600, 3400];
        segs.forEach((seg, i) => {
            setTimeout(() => {
                seg.classList.add('drawn');
            }, delays[i]);
        });

        // After all segments drawn, show the animated dashed overlay
        setTimeout(() => {
            if (flightPath) flightPath.classList.add('visible');
            segs.forEach(s => { s.style.opacity = '0'; s.style.transition = 'opacity 0.5s'; });
        }, 4200);
    }

    // Intersection observer for draw animation
    const journeyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerDrawAnimation();
                journeyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    journeyObserver.observe(svg);

    // Zoom to city
    function zoomToCity(cityId) {
        if (activeCity === cityId) {
            zoomOut();
            return;
        }

        activeCity = cityId;
        mapWrap.classList.add('zoomed');

        // Fade other cities
        cities.forEach(c => {
            const id = c.getAttribute('data-city');
            if (id === cityId) {
                c.classList.add('active');
                c.classList.remove('faded');
            } else {
                c.classList.add('faded');
                c.classList.remove('active');
            }
        });

        // Show card
        cards.forEach(card => {
            if (card.getAttribute('data-city') === cityId) {
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
            }
        });

        // Smooth viewBox zoom
        const coords = cityCoords[cityId];
        if (coords) {
            const zoomW = 400, zoomH = 250;
            const vx = Math.max(0, Math.min(coords.x - zoomW / 2, 1000 - zoomW));
            const vy = Math.max(0, Math.min(coords.y - zoomH / 2, 556 - zoomH));
            animateViewBox(svg, vx, vy, zoomW, zoomH, 500);
        }
    }

    function zoomOut() {
        activeCity = null;
        mapWrap.classList.remove('zoomed');

        cities.forEach(c => {
            c.classList.remove('active', 'faded');
        });

        cards.forEach(card => {
            card.classList.remove('visible');
        });

        animateViewBox(svg, 0, 0, 1000, 556, 400);
    }

    // Smooth viewBox animation using requestAnimationFrame
    function animateViewBox(svgEl, tx, ty, tw, th, duration) {
        const vb = svgEl.viewBox.baseVal;
        const sx = vb.x, sy = vb.y, sw = vb.width, sh = vb.height;
        const start = performance.now();

        function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
            vb.x = sx + (tx - sx) * ease;
            vb.y = sy + (ty - sy) * ease;
            vb.width = sw + (tw - sw) * ease;
            vb.height = sh + (th - sh) * ease;
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // Click handlers for city dots
    cities.forEach(city => {
        city.addEventListener('click', (e) => {
            e.stopPropagation();
            zoomToCity(city.getAttribute('data-city'));
        });
        city.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                zoomToCity(city.getAttribute('data-city'));
            }
        });
    });

    // Close buttons on cards
    cards.forEach(card => {
        const closeBtn = card.querySelector('.journey-card-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                zoomOut();
            });
        }
    });

    // Click on SVG background to zoom out
    svg.addEventListener('click', (e) => {
        if (activeCity && !e.target.closest('.journey-city')) {
            zoomOut();
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeCity) zoomOut();
    });

    // Also observe journey section for fade-in
    const journeySection = document.getElementById('journey');
    if (journeySection) {
        const journeyItems = journeySection.querySelectorAll('.journey-mobile-card');
        journeyItems.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
})();

// Theme cycle — single button that rotates through themes
(function() {
    var themes = [
        { id: 'dark',  icon: '🌑', name: 'dark' },
        { id: 'light', icon: '🌞', name: 'light' },
        { id: 'eink',  icon: '📰', name: 'eink' },
        { id: 'xterm', icon: '💻', name: 'xterm' },
        { id: 'drunk', icon: '🥴', name: 'drunk' }
    ];

    var saved = localStorage.getItem('theme') || 'dark';
    var idx = Math.max(0, themes.findIndex(function(t) { return t.id === saved; }));
    document.documentElement.setAttribute('data-theme', themes[idx].id);

    var btn = document.getElementById('theme-cycle');
    if (!btn) return;

    var iconEl = btn.querySelector('.theme-icon');
    var nameEl = btn.querySelector('.theme-name');

    function update() {
        iconEl.textContent = themes[idx].icon;
        nameEl.textContent = themes[idx].name;
    }

    update();

    btn.addEventListener('click', function() {
        idx = (idx + 1) % themes.length;
        document.documentElement.setAttribute('data-theme', themes[idx].id);
        localStorage.setItem('theme', themes[idx].id);
        update();
    });
})();

/* ------------------------------------------------------------------------
   UTM attribution beacon  (card t_8af9487b, 2026-08-16)

   WHY THIS EXISTS
   ---------------
   docs/experiments/hire-youtube-funnel.md records an honest limitation:
   "GitHub Pages is static hosting and does not expose server access logs to the
   site owner. There is therefore no queryable, first-party record of clicks by
   campaign." That was true when written. It is now closable without adding any
   SaaS, pixel, cookie or PII: conductor (which already serves herald.hafs.dev)
   runs nginx, so a first-party `location = /c` returning 204 with a structured
   access log gives the queryable click record. This function is the page side.

   WHAT IT DOES NOT DO -- the guardrails in that spec still hold:
     * no third-party script, no GA/Plausible/Umami, no pixel;
     * NO COOKIE and NO localStorage -- nothing is stored on the device;
     * no PII: the collector truncates the client IP to /24 before writing;
     * never blocks or delays a click. The mailto keeps working with JS off, and
       every path here is wrapped so a beacon failure cannot break the CTA.

   Two events, deliberately separate:
     1. LANDING -- fired once per pageview when the URL carries ?utm_*. Answers
        "did YouTube send anyone, and from which video".
     2. CTA CLICK -- fired when a consulting/hire CTA is activated. This is the
        high-intent event; a landing without it is a bounce.
   ------------------------------------------------------------------------ */
(function () {
    'use strict';

    // The collector. Served on a host that already resolves to conductor and is
    // already inside the live TLS SAN cert, so this needed no new DNS record and
    // no new certificate. Renaming it later is a one-line change here.
    var COLLECTOR = 'https://kanban.hafs.dev/c';

    function send(params) {
        try {
            var qs = Object.keys(params)
                .filter(function (k) { return params[k]; })
                .map(function (k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
                })
                .join('&');
            var url = COLLECTOR + '?' + qs;

            // sendBeacon survives the page unload that a mailto: or a cross-origin
            // navigation triggers -- a plain fetch() is cancelled mid-flight and the
            // click goes uncounted. That is the whole reason the CTA event is
            // reliable at all, so prefer it and only fall back when unavailable.
            if (navigator.sendBeacon && navigator.sendBeacon(url)) return;

            // Fallback: keepalive lets the request outlive the document too.
            if (window.fetch) {
                fetch(url, { method: 'GET', mode: 'no-cors', keepalive: true,
                             cache: 'no-store', credentials: 'omit' });
                return;
            }
            new Image().src = url;   // last resort, ancient browsers
        } catch (e) { /* attribution is best-effort and must never break the page */ }
    }

    // Only forward the UTM keys we intend to read, and cap their length so a
    // crafted URL cannot bloat the log. nginx's escape=json handles quoting.
    function clean(v) {
        return (v || '').replace(/[^A-Za-z0-9_\-.]/g, '').slice(0, 64);
    }

    var params, utm;
    try {
        params = new URLSearchParams(window.location.search);
        utm = {
            utm_source:   clean(params.get('utm_source')),
            utm_medium:   clean(params.get('utm_medium')),
            utm_campaign: clean(params.get('utm_campaign')),
            utm_content:  clean(params.get('utm_content'))
        };
    } catch (e) { return; }

    var tagged = utm.utm_source || utm.utm_medium || utm.utm_campaign || utm.utm_content;

    // ---- 1. LANDING -------------------------------------------------------
    // Fired only for tagged arrivals: an untagged visit is not attribution data,
    // and logging every pageview would turn this into general-purpose analytics,
    // which the spec's guardrails exclude.
    if (tagged) {
        send({
            e: 'landing',
            p: (window.location.pathname || '/').slice(0, 80),
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            utm_content: utm.utm_content
        });
    }

    // ---- 2. CTA CLICK -----------------------------------------------------
    // Delegated from the document so it covers the homepage consulting mailto,
    // the /hire/ CTA, and any consulting link added later, with no per-page wiring.
    document.addEventListener('click', function (ev) {
        try {
            var a = ev.target && ev.target.closest && ev.target.closest('a[href]');
            if (!a) return;
            var href = a.getAttribute('href') || '';

            var isMail    = href.indexOf('mailto:') === 0;
            var isConsult = href.indexOf('#consulting') !== -1 ||
                            href.indexOf('/hire') !== -1;
            if (!isMail && !isConsult) return;

            // Which destination was taken. The mailto is the highest-intent path
            // and the one a UTM can never follow -- that is exactly why it is
            // beaconed here, at the click, rather than inferred later.
            var dest = isMail ? 'mailto' : 'consulting';

            send({
                e: 'cta',
                dest: dest,
                p: (window.location.pathname || '/').slice(0, 80),
                // Carry the landing campaign through, so a click is attributable to
                // the video even though the mailto itself carries no query string.
                utm_source: utm.utm_source,
                utm_medium: utm.utm_medium,
                utm_campaign: utm.utm_campaign,
                utm_content: utm.utm_content
            });
        } catch (e) { /* never interfere with the click */ }
    }, true);   // capture phase: run before any handler that may navigate away
})();
