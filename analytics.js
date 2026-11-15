(function () {
    'use strict';

    var WEBSITE_ID = '';
    var TRACKER = 'https://cloud.umami.is/script.js';

    if (window.hafsAnalytics) return;
    window.hafsAnalytics = true;

    function isOwnHost(host) {
        return host === 'hafs.dev' || /\.hafs\.dev$/.test(host);
    }

    function classify(href, here) {
        if (!href) return null;
        if (href.indexOf('mailto:') === 0) return { name: 'email-link', data: { from: here.pathname } };
        if (href.charAt(0) === '#' && href.length > 1) {
            return { name: 'section-link', data: { to: href.slice(1, 60), from: here.pathname } };
        }
        var url;
        try { url = new URL(href, here.href); } catch (e) { return null; }
        if (!/^https?:$/.test(url.protocol) || isOwnHost(url.hostname)) return null;
        return { name: 'outbound-link', data: { to: url.hostname, from: here.pathname } };
    }

    window.hafsAnalyticsClassify = classify;

    if (!WEBSITE_ID || !isOwnHost(location.hostname)) return;

    var s = document.createElement('script');
    s.defer = true;
    s.src = TRACKER;
    s.setAttribute('data-website-id', WEBSITE_ID);
    document.head.appendChild(s);

    document.addEventListener('click', function (ev) {
        try {
            var a = ev.target && ev.target.closest && ev.target.closest('a[href]');
            var event = a && classify(a.getAttribute('href'), location);
            if (event && window.umami) window.umami.track(event.name, event.data);
        } catch (e) { /* analytics must never break navigation */ }
    }, true);
})();
