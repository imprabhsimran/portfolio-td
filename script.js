/* ============================================================
   TANYA DHINGRA — script.js
   Custom cursor, scroll animations, nav behaviour
   ============================================================ */

(function () {
  'use strict';

  /* ---- Custom Cursor ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });

  // Scale on click
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    follower.style.transform = 'translate(-50%, -50%) scale(0.85)';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  /* ---- Nav Scroll Behaviour ---- */
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  /* ---- Reveal on Scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 120;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Hero Name Letter Animation ---- */
  function animateHeroOnLoad() {
    const lines = document.querySelectorAll('.hero-name .line');
    lines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(40px)';
      line.style.transition = `opacity 1s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.15}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.15}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        });
      });
    });

    // Animate hero tag and sub immediately
    const heroEls = document.querySelectorAll('.hero .reveal');
    heroEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 100);
    });
  }

  window.addEventListener('load', animateHeroOnLoad);

  /* ---- Smooth Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--ink)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- Scroll Line Animation ---- */
  const scrollLine = document.querySelector('.scroll-line');
  if (scrollLine) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollLine.style.opacity = '0';
      } else {
        scrollLine.style.opacity = '1';
      }
    });
  }

  /* ---- Work Item Hover Accent ---- */
  const workItems = document.querySelectorAll('.work-item');
  workItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.paddingLeft = '1.5rem';
      item.style.transition = 'padding-left 0.4s cubic-bezier(0.16,1,0.3,1)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.paddingLeft = '0';
    });
  });

  /* ---- Parallax on Hero BG Text ---- */
  const heroBgText = document.querySelector('.hero-bg-text');
  if (heroBgText) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
    });
  }

  /* ---- Image Error Fallback Placeholder ---- */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      const wrap = heroImg.parentElement;
      wrap.classList.add('no-img');
      heroImg.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%; height: 100%;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 1rem; color: var(--ink-muted);
        font-family: var(--font-mono); font-size: 0.72rem;
        letter-spacing: 0.1em; text-transform: uppercase;
        background: var(--bg-alt);
        border: 1px solid var(--border);
      `;
      placeholder.innerHTML = '<div style="font-size:3rem;opacity:0.2">TD</div><span>Tanya Dhingra</span>';
      wrap.insertBefore(placeholder, wrap.firstChild);
    });
  }

  /* ---- Typed tagline effect on page load ---- */
  function typeWriter(el, text, speed = 50) {
    el.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    setTimeout(type, 800);
  }

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 45);
  }

})();
