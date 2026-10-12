/* HABBLE — app.js: small vanilla-JS enhancements (no libraries, no build step).
 * Loaded with <script src="app.js" defer> alongside assets/js/main.js.
 * - Footer live clock (#live-clock)
 * - Footer year fallback (#year)
 * Works with JS disabled: clock line simply stays empty, content unaffected.
 */
(function () {
  'use strict';

  /* Footer year (main.js also sets this; harmless duplicate guard). */
  var yr = document.getElementById('year');
  if (yr && !yr.textContent.trim()) {
    yr.textContent = String(new Date().getFullYear());
  }

  /* Live clock in the footer. Updates every second, local time. */
  var clock = document.getElementById('live-clock');
  if (clock) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      fmt = null;
    }
    var tick = function () {
      var now = new Date();
      var txt = fmt ? fmt.format(now) : now.toLocaleTimeString();
      clock.textContent = txt;
      clock.setAttribute('datetime', now.toISOString());
    };
    tick();
    window.setInterval(tick, 1000);
  }
})();
