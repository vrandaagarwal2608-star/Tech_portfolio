/* =========================================================
   VRANDA AGARWAL PORTFOLIO — SCRIPT.JS
   Features: Particles, Scroll Reveal, Counter Animation,
             Navbar, Tilt Effect, Form Handling, Mobile Menu
   ========================================================= */

'use strict';

/* ── 1. PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animFrame;

  const CONFIG = {
    count: 80,
    maxRadius: 2.2,
    minRadius: 0.4,
    speed: 0.35,
    connectDist: 130,
    colors: ['#1464f6', '#06c8e4', '#3b82f6', '#ffffff'],
    opacity: 0.55,
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomColor() {
    return CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      color: randomColor(),
      alpha: 0.3 + Math.random() * 0.5,
    };
  }

  function initParticleList() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDist) {
          const lineAlpha = (1 - dist / CONFIG.connectDist) * 0.12;
          ctx.save();
          ctx.globalAlpha = lineAlpha;
          ctx.strokeStyle = '#1464f6';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha * CONFIG.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticleList();
  });

  resize();
  initParticleList();
  draw();
})();


/* ── 2. NAVBAR: SCROLL BACKGROUND + ACTIVE LINK ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function onScroll() {
    // Scrolled class for background
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 90;
      if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── 3. MOBILE MENU TOGGLE ── */
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    // Animate hamburger lines
    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
})();


/* ── 4. SCROLL REVEAL ── */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

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

  reveals.forEach(el => observer.observe(el));
})();


/* ── 5. COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const decimal  = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val  = ease * target;
      el.textContent = decimal > 0 ? val.toFixed(decimal) : Math.floor(val);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ── 6. PROJECT CARD 3-D TILT ── */
(function initTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (!tiltCards.length) return;

  const MAX_TILT = 8; // degrees

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotateX = -dy * MAX_TILT;
      const rotateY =  dx * MAX_TILT;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();


/* ── 7. SMOOTH SCROLL FOR ANCHOR LINKS ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 8. CONTACT FORM ── */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('form-btn');
  const btnTxt = document.getElementById('btn-text');
  const msg    = document.getElementById('form-msg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showMsg('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showMsg('Please enter a valid email address.', 'error');
      return;
    }

    // Loading state
    btn.disabled     = true;
    btnTxt.textContent = 'Sending…';
    btn.style.opacity  = '0.75';

    // Simulate send (replace with real endpoint / EmailJS / Formspree)
    await simulateSend();

    // Success
    showMsg('✅ Message sent! I\'ll get back to you soon.', 'success');
    form.reset();
    btn.disabled     = false;
    btnTxt.textContent = 'Send Message';
    btn.style.opacity  = '1';
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className   = 'form-msg ' + type;
    setTimeout(() => { msg.textContent = ''; msg.className = 'form-msg'; }, 5000);
  }

  function simulateSend() {
    return new Promise(resolve => setTimeout(resolve, 1400));
  }
})();


/* ── 9. SKILL BADGE RIPPLE EFFECT ── */
(function initBadgeRipple() {
  document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top  - size / 2}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.55s linear;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframes
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id    = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ── 10. HERO PARALLAX (subtle) ── */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img-wrap');
  if (!heroImg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroImg.style.transform = `translateY(${scrollY * 0.08}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── 11. MOUSE GLOW CURSOR (desktop only) ── */
(function initMouseGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

  const glow = document.createElement('div');
  glow.id = 'mouse-glow';
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20,100,246,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


/* ── 12. ACHIEVEMENT CARD SPOTLIGHT HOVER ── */
(function initSpotlight() {
  document.querySelectorAll('.ach-card.spotlight').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(6,200,228,0.10) 0%, rgba(6,200,228,0.04) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ── 13. TYPING ANIMATION FOR HERO ROLES (optional cycle) ── */
(function initHeroTagline() {
  const roles = [
    'Information Technology Engineer',
    'French Language Scholar',
    'AI & Generative AI Enthusiast',
    'Full Stack Developer',
  ];
  const badges = document.querySelectorAll('.role-badge');
  if (!badges.length) return;

  // Subtle entrance stagger (they fade in one by one on load)
  badges.forEach((badge, i) => {
    badge.style.opacity   = '0';
    badge.style.transform = 'translateY(10px)';
    badge.style.transition = `opacity 0.5s ease ${0.3 + i * 0.18}s, transform 0.5s ease ${0.3 + i * 0.18}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        badge.style.opacity   = '1';
        badge.style.transform = 'translateY(0)';
      });
    });
  });
})();


/* ── 14. CERT CARD FLIP ENTRANCE ── */
(function initCertCards() {
  const certCards = document.querySelectorAll('.cert-card');
  if (!certCards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  certCards.forEach((card, i) => {
    card.style.animationDelay        = `${i * 0.08}s`;
    card.style.animationPlayState    = 'paused';
    observer.observe(card);
  });
})();


/* ── 15. SCROLL PROGRESS BAR ── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id    = 'scroll-progress';
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #1464f6, #06c8e4);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct.toFixed(2) + '%';
  }, { passive: true });
})();


/* ── 16. PAGE LOAD FADE-IN ── */
(function initPageLoad() {
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.55s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

// ================= EMAILJS CONTACT FORM =================

emailjs.init("emZYlATqXYqjr9o0y");

document.getElementById("contact-form")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const btnText = document.getElementById("btn-text");
    const formMsg = document.getElementById("form-msg");

    btnText.textContent = "Sending...";

    emailjs.send(
        "portfolio_response",
        "template_zdhmplm",
        {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
            time: new Date().toLocaleString()
        }
    )
    .then(function() {

        formMsg.textContent = "✅ Message sent successfully!";
        formMsg.style.color = "#22c55e";

        document.getElementById("contact-form").reset();

        btnText.textContent = "Send Message";

    })
    .catch(function(error) {

        console.error(error);

        formMsg.textContent = "❌ Failed to send message.";
        formMsg.style.color = "#ef4444";

        btnText.textContent = "Send Message";

    });

});