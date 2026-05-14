document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll: cabeçalho + CTA mobile num único listener (passive + rAF)
  const header = document.getElementById('header');
  const mobileCta = document.getElementById('mobileCta');
  const heroSection = document.querySelector('.hero');
  const precoSection = document.getElementById('preco');

  let scrollRafPending = false;
  function updateScrollDerivedUi() {
    if (header) {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
    }
    if (mobileCta) {
      const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
      const precoTop = precoSection ? precoSection.getBoundingClientRect().top : Infinity;
      const show = heroBottom < 0 && precoTop > window.innerHeight;
      mobileCta.classList.toggle('visible', show);
    }
  }

  function onScroll() {
    if (scrollRafPending) return;
    scrollRafPending = true;
    requestAnimationFrame(() => {
      scrollRafPending = false;
      updateScrollDerivedUi();
    });
  }

  if (header || mobileCta) {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollDerivedUi();
  }

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  function setNavMenuOpen(open) {
    if (!navToggle || !navList) return;
    navList.classList.toggle('active', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (navToggle && navList) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'navList');

    navToggle.addEventListener('click', () => {
      const open = !navList.classList.contains('active');
      setNavMenuOpen(open);
    });

    navList.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => setNavMenuOpen(false));
    });
  }

  // Contadores do hero
  function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');
    counters.forEach((counter) => {
      if (counter.dataset.fixed) {
        counter.textContent = counter.dataset.fixed;
        return;
      }
      const target = +counter.dataset.target;
      if (!target) return;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = String(target);
        }
      };
      update();
    });
  }

  const statsSection = document.querySelector('.hero__stats');
  let counterStarted = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible && !counterStarted) {
        counterStarted = true;
        animateCounters();
      }
    },
    { threshold: 0.5 }
  );

  if (statsSection) statsObserver.observe(statsSection);

  // Countdown (7 dias a partir da primeira visita)
  function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!countdownEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function loadDeadlineMs() {
      const raw = localStorage.getItem('faturaodonto_deadline');
      let ms = raw ? Number(raw) : NaN;
      if (!Number.isFinite(ms)) {
        ms = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem('faturaodonto_deadline', String(ms));
      }
      return ms;
    }

    let deadlineMs = loadDeadlineMs();

    function updateCountdown() {
      let distance = deadlineMs - Date.now();

      if (distance < 0) {
        localStorage.removeItem('faturaodonto_deadline');
        deadlineMs = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem('faturaodonto_deadline', String(deadlineMs));
        distance = deadlineMs - Date.now();
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    window.addEventListener('pagehide', () => clearInterval(intervalId), { once: true });
  }
  initCountdown();

  // Fade-in ao scroll
  const fadeElements = document.querySelectorAll(
    '.feature-card, .module-card, .testimonial-card, .pricing-card, .publico__grid, .faq-item, .ad-card, .bonus-card, .glosa-tip, .numero-card, .jornada__step, .diff-item, .certificado__doc, .garantia__box, .instrutora__grid'
  );

  fadeElements.forEach((el) => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // FAQ acordeão (aria + Escape)
  const faqItems = document.querySelectorAll('.faq-item');

  function closeAllFaq() {
    faqItems.forEach((item) => {
      item.classList.remove('active');
      const btn = item.querySelector('.faq-item__question');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function openFaqItem(item) {
    closeAllFaq();
    item.classList.add('active');
    const btn = item.querySelector('.faq-item__question');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-item__question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      if (wasActive) {
        closeAllFaq();
      } else {
        openFaqItem(item);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.faq-item.active');
    if (!open) return;
    const btn = open.querySelector('.faq-item__question');
    closeAllFaq();
    if (btn && document.activeElement && open.contains(document.activeElement)) {
      btn.focus();
    }
  });

  // Âncoras internas (respeita redução de movimento)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    });
  });
});
