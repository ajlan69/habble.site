(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var WA_NUMBER = '916238712579';
  var WA_BASE = 'https://wa.me/' + WA_NUMBER + '?text=Hi%20Habble%2C%20I%20want%20to%20get%20a%20website%20for%20my%20business.';

  var ICONS = {
    top: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    music: '<span class="fab-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>'
  };

  function buildStack() {
    if ($('.fab-stack')) return;
    var stack = document.createElement('div');
    stack.className = 'fab-stack';
    stack.setAttribute('role', 'group');
    stack.setAttribute('aria-label', 'Quick actions');
    stack.innerHTML =
      '<button class="fab" id="fabMusic" type="button" aria-pressed="false" aria-label="Play background music">' + ICONS.music + '<span class="fab-label">Music</span></button>' +
      '<button class="fab fab-top" id="fabTop" type="button" aria-label="Back to top">' + ICONS.top + '<span class="fab-label">Top</span></button>' +
      '<a class="fab wa-float" id="waFloat" href="' + WA_BASE + '" target="_blank" rel="noopener" aria-label="Chat with Habble on WhatsApp">' + ICONS.wa + '<span class="wa-tip">Chat with us<small>Replies within a few hours</small></span></a>';
    document.body.appendChild(stack);
  }

  buildStack();

  var waFloat = $('#waFloat');
  if (waFloat && !reduceMotion) {
    window.setTimeout(function () { waFloat.classList.add('show-tip'); }, 2600);
    window.setTimeout(function () { waFloat.classList.remove('show-tip'); }, 9000);
  }

  var fabTop = $('#fabTop');
  var mbar = $('#mbar');
  if (fabTop || mbar) {
    var tick = false;
    var onScroll = function () {
      if (tick) return; tick = true;
      window.requestAnimationFrame(function () {
        tick = false;
        var y = window.scrollY || 0;
        if (fabTop) fabTop.classList.toggle('is-show', y > 520);
        if (mbar) {
          var show = y > 480;
          mbar.classList.toggle('is-show', show);
          document.body.classList.toggle('has-mbar', show);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }
  if (fabTop) {
    fabTop.addEventListener('click', function () {
      if (window.habbleSmoothTo) window.habbleSmoothTo(0);
      else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  var form = $('#inqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('#inqName') && $('#inqName').value.trim()) || '';
      var biz = ($('#inqBiz') && $('#inqBiz').value.trim()) || '';
      var plan = ($('#inqPlan') && $('#inqPlan').value) || 'Not sure yet — please advise';
      var msg = ($('#inqMsg') && $('#inqMsg').value.trim()) || '';
      var text = 'Hi Habble, I\'m ' + (name || 'a business owner') +
        (biz ? ' from ' + biz : '') +
        '. I\'m interested in: ' + plan + '.' +
        (msg ? ' Details: ' + msg : '');
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  if (!reduceMotion) {
    var fabs = $$('.fab');
    var px = -1e4, py = -1e4, raf = 0;
    var RADIUS = 120, PUSH = 30;
    var run = function () {
      raf = 0;
      for (var i = 0; i < fabs.length; i++) {
        var el = fabs[i];
        var r = el.getBoundingClientRect();
        if (!r.width) continue;
        var dx = r.left + r.width / 2 - px;
        var dy = r.top + r.height / 2 - py;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < RADIUS) {
          var force = (RADIUS - dist) / RADIUS;
          var tx = (dx / dist) * force * PUSH;
          var ty = (dy / dist) * force * PUSH;
          el.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
        } else if (el.style.transform) {
          el.style.transform = '';
        }
      }
    };
    window.addEventListener('mousemove', function (e) {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = window.requestAnimationFrame(run);
    }, { passive: true });
  }

  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master = null, sfxBus = null, musicBus = null;
  var musicOn = false, unlocked = false, melodyTimer = 0, step = 0;

  var PAD = [110.00, 164.81, 220.00, 261.63];
  var MELODY = [440.00, 523.25, 587.33, 659.25, 523.25, 392.00, 329.63, 440.00];

  function initAudio() {
    if (ctx || !AC) return;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.5;
    sfxBus.connect(master);

    musicBus = ctx.createGain();
    musicBus.gain.value = 0.0001;
    musicBus.connect(master);

    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    musicBus.connect(filter);
    filter.connect(master);

    var delay = ctx.createDelay();
    delay.delayTime.value = 0.42;
    var fb = ctx.createGain(); fb.gain.value = 0.34;
    var wet = ctx.createGain(); wet.gain.value = 0.5;
    filter.connect(delay);
    delay.connect(fb); fb.connect(delay);
    delay.connect(wet); wet.connect(master);

    var padGain = ctx.createGain();
    padGain.gain.value = 0.16;
    padGain.connect(musicBus);
    PAD.forEach(function (f, i) {
      var osc = ctx.createOscillator();
      osc.type = i % 2 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      osc.detune.value = (i - 1.5) * 4;
      var g = ctx.createGain();
      g.gain.value = 0.5;
      osc.connect(g); g.connect(padGain);
      osc.start();
    });
  }

  function playClick(strong) {
    if (!ctx) return;
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(strong ? 540 : 420, t);
    osc.frequency.exponentialRampToValueAtTime(strong ? 180 : 150, t + 0.09);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(strong ? 0.34 : 0.2, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(gain); gain.connect(sfxBus);
    osc.start(t); osc.stop(t + 0.16);
  }

  function melody() {
    if (!ctx || !musicOn) return;
    var t = ctx.currentTime;
    var freq = MELODY[step % MELODY.length];
    step++;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    osc.connect(gain); gain.connect(musicBus);
    osc.start(t); osc.stop(t + 2.6);
  }

  function startMusic() {
    initAudio();
    if (!ctx || musicOn) return;
    if (ctx.state === 'suspended') ctx.resume();
    musicOn = true;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
    musicBus.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.4);
    melody();
    melodyTimer = window.setInterval(melody, 1600);
    syncMusicButton();
  }

  function stopMusic() {
    if (!ctx || !musicOn) return;
    musicOn = false;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
    musicBus.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    window.clearInterval(melodyTimer);
    syncMusicButton();
  }

  var fabMusic = $('#fabMusic');
  function syncMusicButton() {
    if (!fabMusic) return;
    fabMusic.classList.toggle('is-active', musicOn);
    fabMusic.setAttribute('aria-pressed', String(musicOn));
    fabMusic.setAttribute('aria-label', musicOn ? 'Pause background music' : 'Play background music');
    var label = fabMusic.querySelector('.fab-label');
    if (label) label.textContent = musicOn ? 'Pause' : 'Music';
  }

  var muted = false;
  try { muted = window.localStorage.getItem('habble-bgm-muted') === '1'; } catch (e) {}

  function setMuted(m) {
    muted = m;
    try { window.localStorage.setItem('habble-bgm-muted', m ? '1' : '0'); } catch (e) {}
  }

  function unlock(e) {
    if (unlocked) return;
    if (e && e.target && e.target.closest && e.target.closest('#fabMusic')) return;
    unlocked = true;
    initAudio();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (!muted) startMusic();
  }
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock);

  if (fabMusic) {
    fabMusic.addEventListener('click', function () {
      initAudio();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      unlocked = true;
      if (musicOn) { stopMusic(); setMuted(true); }
      else { startMusic(); setMuted(false); }
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && musicOn && ctx && ctx.state === 'suspended') ctx.resume();
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button, summary, .fab');
    if (!el) return;
    initAudio();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    var cls = typeof el.className === 'string' ? el.className : '';
    playClick(/primary|btn-wa|wa-float/.test(cls));
  }, true);

  syncMusicButton();
})();
