/* HABBLE — smooth.js: buttery inertia scrolling.
 * A tiny, dependency-free momentum scroller: wheel input feeds a target
 * position that a requestAnimationFrame loop eases toward, giving smooth,
 * weighted scrolling. Native scrolling is preserved on touch devices and
 * when the visitor prefers reduced motion. Anchors and the back-to-top
 * button glide through the same easing.
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* Native momentum on touch is already smooth — only take over on real pointers. */
  if (reduce || !fine) return;

  doc.style.scrollBehavior = 'auto';
  doc.classList.add('smooth-on');

  var target = window.scrollY || window.pageYOffset || 0;
  var current = target;
  var lastSet = target;
  var maxY = 0;
  var raf = 0;
  var EASE = 0.11;
  var clampY = function (v) { return v < 0 ? 0 : (v > maxY ? maxY : v); };

  function measure() {
    maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
    if (target > maxY) target = maxY;
    if (current > maxY) current = maxY;
  }

  function loop() {
    var diff = target - current;
    if (Math.abs(diff) < 0.1) {
      current = target;
      raf = 0;
    } else {
      current += diff * EASE;
      raf = window.requestAnimationFrame(loop);
    }
    if (Math.abs(current - lastSet) > 0.05) {
      lastSet = current;
      window.scrollTo(0, current);
    }
  }

  function kick() { if (!raf) raf = window.requestAnimationFrame(loop); }

  function to(y) {
    measure();
    target = clampY(y);
    kick();
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.defaultPrevented) return;
    if (document.body.classList.contains('nav-open')) return;
    e.preventDefault();
    measure();
    var d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    target = clampY(target + d);
    kick();
  }, { passive: false });

  /* If something else moves the page (scrollbar, keyboard, find-in-page),
     resync so our easing always starts from the real position. */
  window.addEventListener('scroll', function () {
    if (Math.abs(window.scrollY - lastSet) > 1.5) {
      current = target = lastSet = window.scrollY;
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    measure();
    current = target = lastSet = window.scrollY;
  });

  if ('ResizeObserver' in window) {
    new ResizeObserver(function () {
      measure();
      if (target > maxY) { target = maxY; kick(); }
    }).observe(document.body);
  }

  function headerOffset() {
    var h = document.querySelector('.site-head');
    return (h ? h.offsetHeight : 64) + 18;
  }

  function toEl(el) {
    to(el.getBoundingClientRect().top + (window.scrollY || 0) - headerOffset());
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) {
      var href = a.getAttribute('href');
      if (href.length < 2) { e.preventDefault(); to(0); return; }
      var el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        toEl(el);
        if (history.replaceState) history.replaceState(null, '', href);
      }
      return;
    }
    var top = e.target.closest && e.target.closest('#fabTop');
    if (top) { e.preventDefault(); to(0); }
  });

  window.habbleSmoothTo = to;

  measure();
  current = target = lastSet = window.scrollY || 0;
})();
