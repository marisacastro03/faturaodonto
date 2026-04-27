document.addEventListener('DOMContentLoaded', () => {

  // Header scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  navList.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Animated counter
  function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');
    counters.forEach(counter => {
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
          counter.textContent = target;
        }
      };
      update();
    });
  }

  // Intersection Observer for counters
  const statsSection = document.querySelector('.hero__stats');
  let counterStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counterStarted) {
      counterStarted = true;
      animateCounters();
    }
  }, { threshold: 0.5 });

  if (statsSection) statsObserver.observe(statsSection);

  // Countdown timer (7 days from first visit)
  function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    let deadline = localStorage.getItem('faturaodonto_deadline');
    if (!deadline) {
      deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime();
      localStorage.setItem('faturaodonto_deadline', deadline);
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        localStorage.removeItem('faturaodonto_deadline');
        deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime();
        localStorage.setItem('faturaodonto_deadline', deadline);
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(d).padStart(2, '0');
      document.getElementById('hours').textContent = String(h).padStart(2, '0');
      document.getElementById('minutes').textContent = String(m).padStart(2, '0');
      document.getElementById('seconds').textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  initCountdown();

  // Fade-in on scroll
  const fadeElements = document.querySelectorAll(
    '.feature-card, .module-card, .testimonial-card, .pricing-card, .publico__grid, .faq-item, .ad-card, .bonus-card, .glosa-tip, .numero-card, .jornada__step, .diff-item, .certificado__doc, .garantia__box, .instrutora__grid'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // FAQ Accordion
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Mobile CTA bar
  const mobileCta = document.getElementById('mobileCta');
  if (mobileCta) {
    const heroSection = document.querySelector('.hero');
    const precoSection = document.getElementById('preco');

    window.addEventListener('scroll', () => {
      const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
      const precoTop = precoSection ? precoSection.getBoundingClientRect().top : Infinity;
      const show = heroBottom < 0 && precoTop > window.innerHeight;
      mobileCta.classList.toggle('visible', show);
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
