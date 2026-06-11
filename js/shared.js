/* ============================================================
   CAPO SUD — shared.js
   Feature condivise tra TUTTE le pagine (vanilla JS, zero deps).
   Ogni modulo è auto-contenuto e si attiva solo se trova i suoi
   elementi nel DOM — sicuro da includere ovunque.

   Moduli:
   1. Mobile menu (burger / slide-in)
   2. Reveal-on-scroll (.reveal + auto-tag card comuni)
      4. Rotta di viaggio (progress line iniettata, spilli da
      [data-screen-label])
   5. Tilt 3D card (solo pointer fine, no reduced-motion)
   6. CTA magnetici (.btn-primary, solo pointer fine)
   7. Contatori animati [data-counter]
   8. Drag-scroll orizzontale (#cardsWrap)
   ============================================================ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE_POINTER = window.matchMedia('(pointer: fine)').matches;

  /* ---------- 1. MOBILE MENU ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu') || document.getElementById('mm');
  if (burger && menu) {
    var closeBtn = document.getElementById('closeMenu') || document.getElementById('mmClose');
    burger.addEventListener('click', function () { menu.classList.add('is-open'); });
    if (closeBtn) closeBtn.addEventListener('click', function () { menu.classList.remove('is-open'); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('is-open'); });
    });
  }

  /* ---------- 1b. NAV SCROLLED STATE ---------- */
  var navEl = document.getElementById('nav');
  if (navEl) {
    var navScroll = function () { navEl.classList.toggle('scrolled', window.scrollY > 30); };
    navScroll();
    window.addEventListener('scroll', navScroll, { passive: true });
  }

  /* ---------- 2. REVEAL-ON-SCROLL ---------- */
  // Auto-tag delle card comuni nelle pagine interne (se non già marcate)
  ['.article-card', '.itin-card', '.pstep', '.side-block', '.side-cta'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
  });
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (REDUCE || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in', 'is-in'); });
    } else {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in', 'is-in'); rio.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(function (el) { rio.observe(el); });
    }
  }

  /* ---------- 4. ROTTA DI VIAGGIO ---------- */
  (function () {
    var stops = Array.prototype.slice.call(
      document.querySelectorAll('section[data-screen-label], header[data-screen-label], main[data-screen-label]')
    ).filter(function (s) { return !/nav/i.test(s.getAttribute('data-screen-label')); });
    if (stops.length < 2) return;

    var route = document.getElementById('route');
    if (!route) {
      route = document.createElement('div');
      route.className = 'route';
      route.id = 'route';
      route.setAttribute('aria-hidden', 'true');
      route.innerHTML = '<div class="route-line"></div><div class="route-fill" id="routeFill"></div><div class="route-pin" id="routePin">✦</div>';
      document.body.appendChild(route);
    }
    var fill = document.getElementById('routeFill');
    var pin = document.getElementById('routePin');

    var dots = [];
    // non duplicare gli spilli se già presenti (pagina con markup proprio)
    if (!route.querySelector('.route-dot')) {
      stops.forEach(function (s) {
        var label = (s.getAttribute('data-screen-label') || '').split('/').pop().trim();
        var dot = document.createElement('div');
        dot.className = 'route-dot';
        dot.setAttribute('data-label', label);
        route.appendChild(dot);
        dots.push({ el: dot, sec: s });
      });
    }

    var ticking = false;
    function update() {
      ticking = false;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      var p = Math.max(0, Math.min(1, window.scrollY / docH));
      var vh = window.innerHeight;
      fill.style.height = (p * 100) + '%';
      pin.style.top = (p * 100) + '%';
      dots.forEach(function (d) {
        var rectTop = d.sec.getBoundingClientRect().top + window.scrollY;
        var dy = Math.max(0, Math.min(100, (rectTop / docH) * 100));
        d.el.style.top = dy + '%';
        d.el.classList.toggle('passed', window.scrollY + vh * 0.5 > rectTop);
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  })();

  /* ---------- 5. TILT 3D CARD ---------- */
  if (FINE_POINTER && !REDUCE) {
    document.querySelectorAll('.pcard, .itin-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateY(' + (px * 7) + 'deg) rotateX(' + (-py * 7) + 'deg) translateY(-4px)';
        card.style.boxShadow = (-px * 16) + 'px ' + (10 - py * 10) + 'px 28px rgba(26,20,16,0.22)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ---------- 6. CTA MAGNETICI ---------- */
  if (FINE_POINTER && !REDUCE) {
    document.querySelectorAll('.btn-primary').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.2;
        var dy = (e.clientY - r.top - r.height / 2) * 0.2;
        btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- 7. CONTATORI ANIMATI ---------- */
  (function () {
    var els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;
    if (REDUCE) {
      els.forEach(function (el) { el.textContent = el.dataset.counter + (el.dataset.suffix || ''); });
      return;
    }
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = +el.dataset.counter;
        var suffix = el.dataset.suffix || '';
        var dur = 1600;
        var t0 = performance.now();
        (function tick(now) {
          var p = Math.min(((now || performance.now()) - t0) / dur, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })();
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { cio.observe(el); });
  })();

  /* ---------- 8. DRAG-SCROLL ---------- */
  (function () {
    var wrap = document.getElementById('cardsWrap');
    if (!wrap || !FINE_POINTER) return; // su touch lo scroll nativo basta
    var down = false, sx, sl;
    wrap.addEventListener('mousedown', function (e) { down = true; sx = e.pageX - wrap.offsetLeft; sl = wrap.scrollLeft; });
    wrap.addEventListener('mouseleave', function () { down = false; });
    wrap.addEventListener('mouseup', function () { down = false; });
    wrap.addEventListener('mousemove', function (e) {
      if (!down) return;
      e.preventDefault();
      wrap.scrollLeft = sl - (e.pageX - wrap.offsetLeft - sx) * 1.4;
    });
  })();

  /* ---------- 9. IMAGE REVEAL (sipario sulle immagini) ---------- */
  (function () {
    if (REDUCE || !('IntersectionObserver' in window)) return;
    var sels = ['.article-card-img', '.itin-img', '.diary-photo', '.art-cover', '.feature-img'];
    var els = [];
    sels.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('img-reveal');
        els.push(el);
      });
    });
    if (!els.length) return;
    var iro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); iro.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    els.forEach(function (el) { iro.observe(el); });
  })();

  /* ---------- 10. PARALLAX LEGGERA (hero e copertine) ---------- */
  (function () {
    if (REDUCE) return;
    var targets = [];
    document.querySelectorAll('.page-hero-bg').forEach(function (el) {
      el.classList.add('plx');
      targets.push(el);
    });
    if (!targets.length) return;
    var pticking = false;
    function apply() {
      pticking = false;
      var vh = window.innerHeight;
      targets.forEach(function (el) {
        var box = (el.closest('.page-hero') || el.parentElement).getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        // -1 .. 1 rispetto al centro viewport
        var p = (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2);
        el.style.transform = 'translateY(' + (-p * box.height * 0.1).toFixed(1) + 'px) scale(1.12)';
      });
    }
    function onS() { if (!pticking) { pticking = true; requestAnimationFrame(apply); } }
    apply();
    window.addEventListener('scroll', onS, { passive: true });
    window.addEventListener('resize', onS);
  })();

})();
