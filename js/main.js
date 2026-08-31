// ── case study scroll-reveal ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.cs-reveal, .cs-reveal-left, .cs-reveal-right, .service-card, .contact-card, .contact-form-container, .about-grid');
  // Add base reveal class to sections that previously used fadeObs
  document.querySelectorAll('.service-card, .contact-card, .contact-form-container, .about-grid').forEach(el => { el.classList.add('cs-reveal'); });
  if (els.length > 0) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  }
});
// ────────────────────────────────────────────────────────────



    // ── hamburger menu ──────────────────────────────────────────
    (function() {
      const btn    = document.getElementById('nav-hamburger-btn');
      const menu   = document.getElementById('nav-mobile');
      if (!btn || !menu) return;

      function openMenu() {
        menu.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close navigation menu');
        document.body.style.overflow = 'hidden';
        // focus first link for keyboard accessibility
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }

      function closeMenu() {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation menu');
        document.body.style.overflow = '';
        btn.focus(); // return focus to trigger
      }

      function toggleMenu() {
        const isOpen = menu.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
      }

      btn.addEventListener('click', toggleMenu);

      // close on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
      });

      // close when a mobile link is clicked (navigates to section)
      menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
      });

      // close if viewport grows past breakpoint (e.g. rotating device)
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && menu.classList.contains('open')) closeMenu();
      });
    })();
    // ────────────────────────────────────────────────────────────



    // ── slider progetti & filtri ─────────────────────────────
    (function() {
      const track  = document.getElementById('projectsTrack');
      const prev   = document.getElementById('sliderPrev');
      const next   = document.getElementById('sliderNext');
      const dotsContainer = document.getElementById('projectsDots');
      const filterBtns = document.querySelectorAll('.filter-btn');
      
      if (!track) return;

      function getCards() { return track.querySelectorAll('.project-card:not(.hidden)'); }
      function getCardWidth() {
        const c = getCards()[0];
        if (!c) return 320;
        const gap = parseInt(getComputedStyle(track).gap) || 24;
        return c.offsetWidth + gap;
      }
      function currentIndex() {
        return Math.round(track.scrollLeft / getCardWidth()) || 0;
      }
      function goTo(idx) {
        const cards = getCards();
        if(!cards.length) return;
        const clamped = Math.max(0, Math.min(idx, cards.length - 1));
        track.scrollTo({ left: clamped * getCardWidth(), behavior: 'smooth' });
      }
      
      function getCardsPerView() {
        return Math.max(1, Math.floor(track.clientWidth / getCardWidth()));
      }
      
      function getNumPages() {
        const cards = getCards();
        if(!cards.length) return 0;
        return Math.ceil(cards.length / getCardsPerView());
      }
      
      function currentPageIndex() {
        const idx = currentIndex();
        // Calculate which page we are on
        const cpv = getCardsPerView();
        // If we are at the very end (due to not enough cards for a full last page), highlight the last dot
        const cards = getCards();
        if (cards.length > 0 && idx >= cards.length - cpv) {
          return getNumPages() - 1;
        }
        return Math.floor(idx / cpv);
      }
      
      function goToPage(pageIdx) {
        goTo(pageIdx * getCardsPerView());
      }
      
      function renderDots() {
        if (!dotsContainer) return;
        const numPages = getNumPages();
        dotsContainer.innerHTML = '';
        if (numPages <= 1) return; // Hide dots if everything fits on one screen
        for (let i = 0; i < numPages; i++) {
          const btn = document.createElement('button');
          btn.className = 'projects-dot' + (i === 0 ? ' active' : '');
          btn.dataset.index = i;
          btn.setAttribute('aria-label', 'Page ' + (i + 1));
          btn.addEventListener('click', () => goToPage(i));
          dotsContainer.appendChild(btn);
        }
      }
      
      function updateDots() {
        if (!dotsContainer) return;
        const pIdx = currentPageIndex();
        const dots = dotsContainer.querySelectorAll('.projects-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === pIdx));
      }
      
      // Re-calculate dots on resize since cards per view might change
      window.addEventListener('resize', () => {
        renderDots();
        updateDots();
      });
      
      function updateArrows() {
        const idx = currentIndex();
        const cards = getCards();
        if (prev) prev.disabled = idx === 0 || cards.length === 0;
        if (next) next.disabled = idx >= cards.length - 1 || cards.length === 0;
      }

      if (prev) prev.addEventListener('click', () => goTo(currentIndex() - 1));
      if (next) next.addEventListener('click', () => goTo(currentIndex() + 1));
      track.addEventListener('scroll', () => { updateDots(); updateArrows(); }, { passive: true });

      // Scroll restoration & accessibility for project cards
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach((card) => {
        // Accessibility
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });

        // Intercept with pointerdown (fires before onclick)
        card.addEventListener('pointerdown', () => {
          sessionStorage.setItem('portfolioScrollY', window.scrollY);
          sessionStorage.setItem('portfolioTrackScroll', track.scrollLeft);
        });
      });

      // Restore scroll position when returning from a project page
      const savedY = sessionStorage.getItem('portfolioScrollY');
      const savedTrack = sessionStorage.getItem('portfolioTrackScroll');
      if (savedY !== null) {
        // Disable smooth scroll temporarily for instant jump
        document.documentElement.style.scrollBehavior = 'auto';
        track.style.scrollBehavior = 'auto';
        
        window.scrollTo(0, parseInt(savedY));
        track.scrollLeft = parseInt(savedTrack);
        
        sessionStorage.removeItem('portfolioScrollY');
        sessionStorage.removeItem('portfolioTrackScroll');
        
        // Re-enable smooth scroll after restoration
        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = '';
          track.style.scrollBehavior = '';
        });
      }

      // Filtering logic
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active state
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const filter = btn.dataset.filter;
          if (!window.allCardsCached) window.allCardsCached = track.querySelectorAll(".project-card");
          const allCards = window.allCardsCached;
          
          allCards.forEach(c => {
            if (filter === 'all' || c.dataset.category === filter) {
              c.classList.remove('hidden');
            } else {
              c.classList.add('hidden');
            }
          });
          
          // Reset scroll
          track.scrollTo({ left: 0, behavior: 'instant' });
          
          // Re-init slider controls
          renderDots();
          updateArrows();
        });
      });

      // init
      renderDots();
      updateArrows();
    })();
    // ─────────────────────────────────────────────────────────

    

    
// Magnetic Buttons

