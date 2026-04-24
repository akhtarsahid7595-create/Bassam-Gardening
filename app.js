/* ═══════════════════════════════════════════════════
   IDESIGN LANDSCAPE — JavaScript
   Animations · Interactions · Scroll · Modal
═══════════════════════════════════════════════════ */

'use strict';

// ─── NAVBAR SCROLL BEHAVIOUR ──────────────────────
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastY = y;
  }, { passive: true });

  // Hamburger toggle
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
})();

// ─── PARALLAX HERO ────────────────────────────────
(function initParallax() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = `translateY(${y * 0.35}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ─── SCROLL REVEAL ────────────────────────────────
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if (prefersReduced) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

// ─── PORTFOLIO FILTER ─────────────────────────────
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide items
      items.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 280);
        }
      });
    });
  });

  // Initialise visibility
  items.forEach(item => {
    item.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
    item.style.opacity = '1';
    item.style.transform = 'scale(1)';
  });
})();

// ─── PORTFOLIO MODAL ──────────────────────────────
(function initPortfolioModal() {
  const modal    = document.getElementById('portfolioModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalLoc   = document.getElementById('modalLoc');

  function openModal(item) {
    const img   = item.querySelector('img');
    const cat   = item.querySelector('.portfolio-cat');
    const name  = item.querySelector('.portfolio-name');
    const loc   = item.querySelector('.portfolio-loc');

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCat.textContent   = cat ? cat.textContent : '';
    modalTitle.textContent = name ? name.textContent : '';
    modalLoc.textContent   = loc ? loc.textContent : '';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-expand').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.closest('.portfolio-item'));
    });
  });

  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

// ─── SMOOTH SCROLL ────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── TESTIMONIAL SLIDER ──────────────────────────
(function initTestimonialScroll() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  
  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      track.scrollTo({
        left: cards[i].offsetLeft - track.offsetLeft,
        behavior: 'smooth'
      });
    });
    dotsContainer.appendChild(dot);
  });

  // Update active dot on scroll
  track.addEventListener('scroll', () => {
    const scrollPos = track.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 16; // 16 is gap
    const activeIndex = Math.round(scrollPos / cardWidth);
    
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }, { passive: true });
})();

// ─── WHY US SLIDER ───────────────────────────────
(function initWhySlider() {
  const track = document.getElementById('whyTrack');
  const dotsContainer = document.getElementById('whyDots');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.why-card');
  let currentIndex = 0;
  let autoPlayInterval;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      stopAutoPlay();
      scrollToIndex(i);
      startAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  function scrollToIndex(index) {
    const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(track).gap);
    track.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    currentIndex = index;
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      scrollToIndex(currentIndex);
    }, 6000); // 6 seconds for "slow" transition
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Update dots on scroll
  track.addEventListener('scroll', () => {
    const scrollPos = track.scrollLeft;
    const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(track).gap);
    const activeIndex = Math.round(scrollPos / cardWidth);
    
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
    currentIndex = activeIndex;
  }, { passive: true });

  // Interaction handlers
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  track.addEventListener('touchstart', stopAutoPlay, { passive: true });
  track.addEventListener('touchend', startAutoPlay);

  startAutoPlay();
})();

// ─── VIEW ALL SERVICES TOGGLE ──────────────────────
(function initServicesToggle() {
  const btn = document.getElementById('viewAllServices');
  const extraCards = document.querySelectorAll('.service-card--extra');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isShowing = btn.textContent.toLowerCase().includes('less');
    
    extraCards.forEach(card => {
      card.classList.toggle('show', !isShowing);
    });

    btn.textContent = isShowing ? 'View All Services' : 'Show Less Services';
    
    if (isShowing) {
      document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    }
  });
})();

// ─── STATS COUNT-UP ANIMATION ─────────────────────
(function initCountUp() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const endText = el.textContent.trim();
        const endNum  = parseInt(endText.replace(/\D/g, ''), 10);
        const suffix  = endText.replace(/[\d]/g, '');
        if (isNaN(endNum)) return;

        let start = 0;
        const duration = 1800;
        const step = (timestamp) => {
          if (!el._startTime) el._startTime = timestamp;
          const progress = Math.min((timestamp - el._startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
          el.textContent = Math.floor(eased * endNum) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.8 }
  );

  stats.forEach(el => observer.observe(el));
})();

// ─── ACTIVE NAV LINK HIGHLIGHT ───────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();
