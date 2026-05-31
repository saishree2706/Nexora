/* ════════════════════════════════════════════════════════════════
   NEXORA · UI MOTION LAYER
   GSAP + ScrollTrigger + Lenis powered:
     · loader handoff & hero entrance timeline
     · smooth scrolling synced to ScrollTrigger
     · custom cursor (gsap.quickTo)
     · 3D card tilt (gsap.quickTo)
     · magnetic buttons (gsap.quickTo)
     · scroll progress bar
     · staggered scroll reveals
     · counter tweens
     · hero parallax
   Falls back gracefully on touch / reduced-motion / SSR.
   ════════════════════════════════════════════════════════════════ */

import { gsap }         from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis            from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const isTouch      = matchMedia('(pointer:coarse)').matches || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
const isMobile     = window.innerWidth < 768;
const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;

if (!isTouch) document.body.classList.add('no-touch');

/* ─────────────────────────────────────────────────────────────────
   LIVE CLOCK · footer (IST)
   ───────────────────────────────────────────────────────────────── */
function updateClock() {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const t = fmt.format(new Date());
  const b = document.getElementById('liveClockFt');
  if (b) b.textContent = t;
}
updateClock();
setInterval(updateClock, 30 * 1000);

/* ─────────────────────────────────────────────────────────────────
   AMBIENT CURSOR GLOW · soft body-wide spotlight
   ───────────────────────────────────────────────────────────────── */
if (!isTouch && !reduceMotion) {
  const spot = document.createElement('div');
  spot.id = 'ambientSpot';
  document.body.appendChild(spot);
  const setX = gsap.quickTo(spot, 'x', { duration: 0.55, ease: 'power3.out' });
  const setY = gsap.quickTo(spot, 'y', { duration: 0.55, ease: 'power3.out' });
  window.addEventListener('mousemove', (e) => {
    setX(e.clientX - 350);
    setY(e.clientY - 350);
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────────
   LENIS · smooth scrolling synced to GSAP ScrollTrigger
   ───────────────────────────────────────────────────────────────── */
let lenis = null;
if (!reduceMotion) {
  try {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.10,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis');
  } catch (err) {
    console.warn('[Nexora] Lenis init failed, falling back to native scroll:', err);
    lenis = null;
  }
}

/* Helper: smooth-scroll anchor links via Lenis (with GSAP fallback) */
function attachAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -60, duration: 1.2 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });
}
attachAnchorScroll();

/* ─────────────────────────────────────────────────────────────────
   LOADER · fade out then play hero entrance timeline
   ───────────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const minHold = reduceMotion ? 200 : 1400;

  setTimeout(() => {
    if (loader) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => loader.remove(),
      });
    }
    playHeroIntro();
  }, minHold);
});

function playHeroIntro() {
  if (reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-rail',  { x: -30, opacity: 0, duration: 0.9 }, 0)
    .from('.hero-loc',   { x:  30, opacity: 0, duration: 0.9 }, 0)
    .from('.hero-badge', { y: 20, opacity: 0, duration: 0.8 }, 0.05)
    .fromTo('.hero-title .ht-anim',
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1,
        duration: 0.95, ease: 'power4.out', stagger: 0.075,
      }, 0.18)
    .from('.hero-sub',   { y: 24, opacity: 0, duration: 0.8 }, 0.6)
    .from('.hero-micro', { y: 20, opacity: 0, duration: 0.7 }, 0.72)
    .from('.hero-btns .btn',         { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.85)
    .from('.hero-stats .stat-item',  { y: 26, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.98)
    .from('.scroll-ind', { y: 20, opacity: 0, duration: 0.7 }, 1.18);
}


/* ─────────────────────────────────────────────────────────────────
   MAGNETIC BUTTONS · gsap.quickTo
   ───────────────────────────────────────────────────────────────── */
if (!isTouch && !reduceMotion) {
  document.querySelectorAll('.btn,.nav-cta').forEach((btn) => {
    const setX = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' });
    const setY = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' });
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      setX((e.clientX - r.left - r.width  / 2) * 0.28);
      setY((e.clientY - r.top  - r.height / 2) * 0.38);
    });
    btn.addEventListener('mouseleave', () => { setX(0); setY(0); });
  });
}

/* ─────────────────────────────────────────────────────────────────
   CLICK RIPPLE
   ───────────────────────────────────────────────────────────────── */
document.querySelectorAll('.btn,.nav-cta,#toTop').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ─────────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR · ScrollTrigger driven
   ───────────────────────────────────────────────────────────────── */
const progress = document.getElementById('scrollProgress');
if (progress) {
  gsap.set(progress, { transformOrigin: 'left center', scaleX: 0, width: '100%' });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      progress.style.transform = `scaleX(${self.progress})`;
    },
  });
}

/* ─────────────────────────────────────────────────────────────────
   NAV STATE · background change + active link via ScrollTrigger
   ───────────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const toTop  = document.getElementById('toTop');
const nlinks = document.querySelectorAll('.nav-links a');

ScrollTrigger.create({
  start: 60,
  onUpdate: (self) => {
    const past = self.scroll() > 60;
    // Toggle a class instead of inline style so CSS can control per-theme look.
    if (navbar) navbar.classList.toggle('scrolled', past);
    if (toTop)  toTop.classList.toggle('show', self.scroll() > 600);
  },
});

document.querySelectorAll('section[id]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start:   'top 110px',
    end:     'bottom 110px',
    onToggle: (self) => {
      if (self.isActive) {
        nlinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    },
  });
});

/* ─────────────────────────────────────────────────────────────────
   BACK-TO-TOP
   ───────────────────────────────────────────────────────────────── */
if (toTop) {
  toTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ─────────────────────────────────────────────────────────────────
   MOBILE MENU
   ───────────────────────────────────────────────────────────────── */
const hbg      = document.getElementById('hbg');
const navLinks = document.getElementById('navLinks');
function toggleMenu(force) {
  if (!hbg || !navLinks) return;
  const open = force !== undefined ? force : !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', open);
  hbg.classList.toggle('active', open);
  hbg.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
  if (lenis) open ? lenis.stop() : lenis.start();
}
if (hbg && navLinks) {
  hbg.addEventListener('click', () => toggleMenu());
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) toggleMenu(false);
  });
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL REVEALS · ScrollTrigger drives .rv / .rvl / .rvr
   plus staggered reveals for grids/lists
   ───────────────────────────────────────────────────────────────── */
function setupReveals() {
  const allReveals = document.querySelectorAll('.rv, .rvl, .rvr');
  allReveals.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start:   'top 88%',
      once:    true,
      onEnter: () => el.classList.add('on'),
    });
  });

  /* staggered grids
     Cards (svc + proj) fade in only — no translate / scale / rotate.
     Other groups keep the gentler lift. */
  const groups = [
    { sel: '.svc-grid',   item: '.svc-card',  fadeOnly: true  },
    { sel: '.vert-grid',  item: '.vert-card', fadeOnly: false },
    { sel: '.proj-grid',  item: '.proj-tile', fadeOnly: true  },
    { sel: '.why-list',   item: '.why-item',  fadeOnly: false },
    { sel: '.vm-grid',    item: '.vm-card',   fadeOnly: false },
  ];
  groups.forEach(({ sel, item, fadeOnly }) => {
    document.querySelectorAll(sel).forEach((grid) => {
      const items = grid.querySelectorAll(item);
      items.forEach((card, i) => {
        const fromVars = fadeOnly ? { opacity: 0 } : { y: 36, opacity: 0, scale: 0.985 };
        const toVars   = fadeOnly
          ? { opacity: 1, duration: 0.55, ease: 'power2.out', delay: i * 0.05 }
          : { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out', delay: i * 0.06 };
        gsap.fromTo(card,
          fromVars,
          {
            ...toVars,
            scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
          }
        );
      });
    });
  });

  /* vert-tag chip stagger inside each card */
  document.querySelectorAll('.vert-card').forEach((card) => {
    const tags = card.querySelectorAll('.vert-tag');
    gsap.fromTo(tags,
      { y: 14, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.55, ease: 'power3.out',
        stagger: 0.03,
        scrollTrigger: { trigger: card, start: 'top 80%', once: true },
      }
    );
  });
}
setupReveals();

/* ─────────────────────────────────────────────────────────────────
   COUNTER ANIMATIONS · GSAP number tween
   ───────────────────────────────────────────────────────────────── */
document.querySelectorAll('[data-val]').forEach((el) => {
  const target = parseInt(el.dataset.val, 10);
  const suffix = el.dataset.suffix || '';
  if (!Number.isFinite(target)) return;
  const obj = { v: 0 };
  ScrollTrigger.create({
    trigger: el,
    start:   'top 90%',
    once:    true,
    onEnter: () => {
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
      });
    },
  });
});

/* ─────────────────────────────────────────────────────────────────
   3D CARD TILT · gsap.quickTo (smooth, frame-rate independent)
   ───────────────────────────────────────────────────────────────── */
const cardEls = document.querySelectorAll('.ind-card, .vert-card, .vm-card, .why-item');
if (!isTouch && !reduceMotion) {
  cardEls.forEach((card) => {
    card.classList.add('card-3d');

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top)  / r.height;
      const rx = (0.5 - y) * 12;
      const ry = (x - 0.5) * 14;
      card.style.setProperty('--rx', `${rx}deg`);
      card.style.setProperty('--ry', `${ry}deg`);
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   PROJECT FLOATER · GSAP-powered pop-in on tile hover (desktop only)
   ───────────────────────────────────────────────────────────────── */
if (!isTouch && !reduceMotion) {
  document.querySelectorAll('.proj-tile').forEach((tile) => {
    const floater = tile.querySelector('[data-proj-floater]');
    if (!floater) return;

    const isCentered  = !floater.classList.contains('pf-edge-left') &&
                        !floater.classList.contains('pf-edge-right');

    // GSAP owns the initial hidden state (overrides CSS visibility:hidden + opacity:0)
    gsap.set(floater, {
      autoAlpha: 0,   // sets opacity:0 + visibility:hidden
      scale: 0.88,
      y: 14,
      xPercent: isCentered ? -50 : 0,
    });

    tile.addEventListener('mouseenter', () => {
      // Lift this tile above siblings so the floater isn't clipped by adjacent cards
      gsap.set(tile, { zIndex: 50 });

      gsap.killTweensOf(floater);
      gsap.to(floater, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        xPercent: isCentered ? -50 : 0,
        duration: 0.34,
        ease: 'back.out(1.55)',
      });
    });

    tile.addEventListener('mouseleave', () => {
      gsap.killTweensOf(floater);
      gsap.to(floater, {
        autoAlpha: 0,
        scale: 0.88,
        y: 14,
        xPercent: isCentered ? -50 : 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => gsap.set(tile, { zIndex: 'auto' }),
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   HERO PARALLAX · ScrollTrigger driven (replaces old scroll listener)
   ───────────────────────────────────────────────────────────────── */
if (!isMobile && !reduceMotion) {
  gsap.to('#hero .hero-content', {
    yPercent: 18,
    opacity: 0.55,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start:   'top top',
      end:     'bottom top',
      scrub:   true,
    },
  });
  gsap.to('#hero .scroll-ind', {
    yPercent: 80,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start:   'top top',
      end:     '40% top',
      scrub:   true,
    },
  });
}

/* ─────────────────────────────────────────────────────────────────
   HERO HINT · fade after first interaction
   ───────────────────────────────────────────────────────────────── */
const heroHint = document.getElementById('heroHint');
if (heroHint) {
  const heroEl = document.getElementById('hero');
  const dismiss = () => {
    heroHint.classList.add('gone');
    setTimeout(() => heroHint.remove(), 600);
  };
  if (heroEl) {
    let interactions = 0;
    const onInteract = () => { if (++interactions > 5) dismiss(); };
    heroEl.addEventListener('mousemove',  onInteract, { passive: true });
    heroEl.addEventListener('click',      dismiss);
    heroEl.addEventListener('touchstart', dismiss, { passive: true });
  }
  setTimeout(dismiss, 9000);
}

/* ─────────────────────────────────────────────────────────────────
   CONTACT FORM · validation + animated success state
   ───────────────────────────────────────────────────────────────── */
const form      = document.getElementById('enqForm');
const submitBtn = document.getElementById('submitBtn');
const fService  = document.getElementById('fService');

if (fService) {
  fService.addEventListener('change', () => {
    fService.classList.toggle('has-value', !!fService.value);
  });
}

function validate() {
  let ok = true;
  form.querySelectorAll('input, textarea, select').forEach((el) => {
    const fg = el.closest('.fg');
    if (!fg) return;
    let valid = true;
    if (el.required) {
      if (el.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
      else                     valid = el.value.trim().length > 0;
    }
    fg.classList.toggle('invalid', !valid);
    if (!valid) ok = false;
  });
  return ok;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstInvalid = form.querySelector('.fg.invalid input, .fg.invalid textarea, .fg.invalid select');
      if (firstInvalid) firstInvalid.focus();
      gsap.fromTo(submitBtn, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
      return;
    }

    const originalLabel = 'Send Enquiry →';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    gsap.to(submitBtn, { scale: 0.94, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 });

    const payload = {
      name:    document.getElementById('fName').value.trim(),
      email:   document.getElementById('fEmail').value.trim(),
      company: document.getElementById('fCompany').value.trim(),
      service: document.getElementById('fService').value.trim(),
      message: document.getElementById('fMsg').value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      submitBtn.textContent = '✓  Message Sent!';
      submitBtn.style.background = 'var(--gd)';
      setTimeout(() => {
        submitBtn.textContent = originalLabel;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
        if (fService) fService.classList.remove('has-value');
      }, 3000);
    } catch (err) {
      console.error('[Nexora] contact submit failed:', err);
      submitBtn.textContent = '✕  Failed — try again';
      submitBtn.style.background = '#b00020';
      gsap.fromTo(submitBtn, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
      setTimeout(() => {
        submitBtn.textContent = originalLabel;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  form.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input',  () => el.closest('.fg').classList.remove('invalid'));
    el.addEventListener('change', () => el.closest('.fg').classList.remove('invalid'));
  });
}

/* Refresh ScrollTrigger when fonts/images load (layout shifts) */
window.addEventListener('load', () => ScrollTrigger.refresh());
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
}

/* ─────────────────────────────────────────────────────────────────
   MOBILE ACCORDION · single-open behavior for service + project cards
   Active only on touch / narrow viewports — desktop uses CSS hover reveal.
   ───────────────────────────────────────────────────────────────── */
function setupAccordion(toggleAttr, cardAttr) {
  const toggles = document.querySelectorAll(`[${toggleAttr}]`);
  const isMobileNow = () => window.matchMedia('(max-width: 900px)').matches;

  toggles.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (!isMobileNow()) return;
      e.preventDefault();
      const card = btn.closest(`[${cardAttr}]`);
      if (!card) return;
      const isOpen = card.hasAttribute('data-open');

      // Close all peer cards in the same group
      document.querySelectorAll(`[${cardAttr}][data-open]`).forEach((sib) => {
        sib.removeAttribute('data-open');
        const sibBtn = sib.querySelector(`[${toggleAttr}]`);
        if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle this one
      if (!isOpen) {
        card.setAttribute('data-open', '');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
setupAccordion('data-svc-toggle', 'data-svc-card');
setupAccordion('data-proj-toggle', 'data-proj-tile');

/* Close all open cards if viewport grows past mobile breakpoint */
window.addEventListener('resize', () => {
  if (!matchMedia('(max-width: 900px)').matches) {
    document.querySelectorAll('[data-svc-card][data-open], [data-proj-tile][data-open]').forEach((c) => {
      c.removeAttribute('data-open');
      const btn = c.querySelector('[data-svc-toggle], [data-proj-toggle]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
});

/* Hero FX (pointer-driven click ripples + cursor trail) — desktop only */
if (!isMobile && !isTouch) {
  import('./hero-fx.js').then(({ initHeroFx }) => initHeroFx()).catch(() => {});
}
