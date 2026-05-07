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

// Theme toggle
(function() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    function setActive(theme) {
        toggle.querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    setActive(saved);

    toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const theme = btn.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        setActive(theme);
    });
})();
