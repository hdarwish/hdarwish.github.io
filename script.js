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
