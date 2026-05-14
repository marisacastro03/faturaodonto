import {
  anchorScrollBehavior,
  DEFAULT_COUNTDOWN_TTL_MS,
  distanceToDeadline,
  faqClickAction,
  getFadeInSelectorString,
  padTimeUnit,
  parseStoredDeadlineMs,
  renewDeadlineIfExpired,
  resolveDeadlineFromStorage,
  shouldAnimateStatCounter,
  shouldHeaderShowScrolledState,
  shouldShowMobileCtaBar,
  splitCountdownParts,
  statAnimationAfterTick,
  statAnimationStep,
  statsEntriesTriggerCounters,
} from './landing-logic.js';

const COUNTDOWN_STORAGE_KEY = 'faturaodonto_deadline';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.getElementById('header');
  const mobileCta = document.getElementById('mobileCta');
  const heroSection = document.querySelector('.hero');
  const precoSection = document.getElementById('preco');

  let scrollRafPending = false;
  function updateScrollDerivedUi() {
    if (header) {
      header.classList.toggle(
        'header--scrolled',
        shouldHeaderShowScrolledState(window.scrollY)
      );
    }
    if (mobileCta) {
      const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
      const precoTop = precoSection ? precoSection.getBoundingClientRect().top : Infinity;
      const show = shouldShowMobileCtaBar(heroBottom, precoTop, window.innerHeight);
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

  function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');
    counters.forEach((counter) => {
      if (counter.dataset.fixed) {
        counter.textContent = counter.dataset.fixed;
        return;
      }
      if (!shouldAnimateStatCounter(counter.dataset)) return;

      const target = +counter.dataset.target;
      const step = statAnimationStep(target, 2000, 16);
      let currentFloat = 0;

      const update = () => {
        const { currentFloat: nextFloat, displayValue, done } = statAnimationAfterTick(
          currentFloat,
          step,
          target
        );
        currentFloat = nextFloat;
        counter.textContent = String(displayValue);
        if (!done) requestAnimationFrame(update);
      };
      update();
    });
  }

  const statsSection = document.querySelector('.hero__stats');
  let counterStarted = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (statsEntriesTriggerCounters(entries) && !counterStarted) {
        counterStarted = true;
        animateCounters();
      }
    },
    { threshold: 0.5 }
  );

  if (statsSection) statsObserver.observe(statsSection);

  function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!countdownEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function loadDeadlineMs() {
      const raw = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
      const ms = resolveDeadlineFromStorage(raw, Date.now(), DEFAULT_COUNTDOWN_TTL_MS);
      if (!Number.isFinite(parseStoredDeadlineMs(raw))) {
        localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(ms));
      }
      return ms;
    }

    let deadlineMs = loadDeadlineMs();

    function updateCountdown() {
      const now = Date.now();
      const { deadlineMs: nextDeadline, renewed } = renewDeadlineIfExpired(
        deadlineMs,
        now,
        DEFAULT_COUNTDOWN_TTL_MS
      );
      if (renewed) {
        localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
        localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(nextDeadline));
        deadlineMs = nextDeadline;
      }

      const distance = distanceToDeadline(deadlineMs, Date.now());
      const { days, hours, minutes, seconds } = splitCountdownParts(distance);

      daysEl.textContent = padTimeUnit(days);
      hoursEl.textContent = padTimeUnit(hours);
      minutesEl.textContent = padTimeUnit(minutes);
      secondsEl.textContent = padTimeUnit(seconds);
    }

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    window.addEventListener('pagehide', () => clearInterval(intervalId), { once: true });
  }
  initCountdown();

  const fadeElements = document.querySelectorAll(getFadeInSelectorString());

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
      if (faqClickAction(wasActive) === 'close-all') {
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

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: anchorScrollBehavior(prefersReducedMotion()),
      });
    });
  });
});
