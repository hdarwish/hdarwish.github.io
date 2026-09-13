/*
 * wow-canvas.js — bounded procedural-canvas scaffold for the ThreeUI-inspired spike.
 *
 * SPIKE ARTIFACT ONLY — card t_c7e28ec6. Not wired into production.
 *
 * Inspiration: MengTo/threeui (MIT). No ThreeUI code is copied; this is a clean-room
 * 2D-canvas reimplementation of the *idea* of a bounded procedural masthead. three.js
 * is deliberately NOT used — a 2D context keeps the payload tiny and removes the WebGL
 * failure surface. See FINDINGS_t_c7e28ec6.md for attribution notes.
 *
 * Enforces every performance/accessibility gate from the card in one place so each
 * variant only has to supply init()/frame() draw callbacks:
 *   - content usable before enhancement (canvas is a decorative layer, aria-hidden)
 *   - lazy start after first paint (requestIdleCallback / rAF fallback)
 *   - ONE canvas per page (this scaffold assumes a single instance)
 *   - static poster fallback (<img>/SVG shown; canvas hidden) when unusable
 *   - devicePixelRatio capped (default 2)
 *   - pause when offscreen (IntersectionObserver) and when tab hidden
 *   - honor prefers-reduced-motion AND Save-Data → render one static frame, no loop
 *   - keyboard + touch controls (a real <button> toggles motion)
 *   - mobile / no-2d-context fallback → poster
 */
(function (global) {
  'use strict';

  var DPR_CAP = 2;

  function prefersReducedMotion() {
    return global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function saveDataOn() {
    var c = global.navigator && global.navigator.connection;
    return !!(c && c.saveData);
  }

  function supports2d(canvas) {
    try { return !!(canvas.getContext && canvas.getContext('2d')); }
    catch (e) { return false; }
  }

  /*
   * mount(opts):
   *   canvas   - the <canvas> element (required)
   *   poster   - element to reveal when the canvas can't/shouldn't animate (optional)
   *   toggle   - a <button> that plays/pauses motion (optional but recommended)
   *   init(ctx, w, h)          - build scene state; called on mount + on resize
   *   frame(ctx, w, h, t, dt)  - draw one animated frame (t = ms since start)
   *   still(ctx, w, h)         - draw one static frame for reduced-motion/poster path
   *                              (falls back to frame(...,0,0) if omitted)
   */
  function mount(opts) {
    var canvas = opts.canvas;
    var poster = opts.poster || null;
    var toggle = opts.toggle || null;
    var ctx, w = 0, h = 0, dpr = 1;
    var raf = 0, last = 0, start = 0, running = false, onscreen = true;

    function showPoster(reason) {
      if (poster) { poster.hidden = false; poster.setAttribute('data-reason', reason); }
      if (canvas) canvas.style.display = 'none';
    }

    // Hard fallbacks: no 2d context (old mobile / locked-down WebViews) → poster, done.
    if (!supports2d(canvas)) { showPoster('no-2d-context'); return { mode: 'poster' }; }
    ctx = canvas.getContext('2d');

    function resize() {
      dpr = Math.min(global.devicePixelRatio || 1, DPR_CAP); // cap DPR
      var r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (opts.init) opts.init(ctx, w, h);
    }

    function drawStill() {
      if (opts.still) opts.still(ctx, w, h);
      else if (opts.frame) opts.frame(ctx, w, h, 0, 0);
    }

    function loop(now) {
      if (!running) return;
      if (!start) { start = now; last = now; }
      var dt = now - last; last = now;
      if (opts.frame) opts.frame(ctx, w, h, now - start, dt);
      raf = global.requestAnimationFrame(loop);
    }

    function play() {
      if (running) return;
      running = true; last = 0;
      raf = global.requestAnimationFrame(loop);
      if (toggle) { toggle.setAttribute('aria-pressed', 'true'); toggle.textContent = '❚❚ pause motion'; }
    }
    function pause() {
      running = false;
      if (raf) global.cancelAnimationFrame(raf);
      if (toggle) { toggle.setAttribute('aria-pressed', 'false'); toggle.textContent = '▶ play motion'; }
    }

    // Static path: reduced-motion or Save-Data → paint one frame, no loop, no controls churn.
    var staticMode = prefersReducedMotion() || saveDataOn();

    function begin() {
      resize();
      if (staticMode) { drawStill(); if (toggle) toggle.hidden = true; return; }
      drawStill(); // paint one frame up front so the masthead never flashes blank pre-rAF
      // Only run while visible in the viewport AND the tab is foregrounded.
      if (global.IntersectionObserver) {
        var io = new IntersectionObserver(function (entries) {
          onscreen = entries[0].isIntersecting;
          if (onscreen && !global.document.hidden) play(); else pause();
        }, { threshold: 0.01 });
        io.observe(canvas);
      } else {
        play();
      }
      global.document.addEventListener('visibilitychange', function () {
        if (global.document.hidden) pause();
        else if (onscreen) play();
      });
      if (toggle) {
        toggle.hidden = false;
        toggle.addEventListener('click', function () { running ? pause() : play(); });
        // keyboard: the element is a <button>, so Space/Enter already toggle it.
      }
    }

    // Debounced resize.
    var rt;
    global.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { resize(); if (staticMode) drawStill(); }, 150);
    });

    // Lazy start AFTER first paint so content/LCP is never blocked.
    var kick = global.requestIdleCallback || function (fn) { return setTimeout(fn, 200); };
    if (global.document.readyState === 'complete') kick(begin);
    else global.addEventListener('load', function () { kick(begin); });

    return { play: play, pause: pause, mode: staticMode ? 'static' : 'animated' };
  }

  global.WowCanvas = { mount: mount, prefersReducedMotion: prefersReducedMotion, saveDataOn: saveDataOn };
})(window);
