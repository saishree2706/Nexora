/* ════════════════════════════════════════════════════════════════════
   HERO FX · pointer-driven life for the CSS/SVG 3D layer
   --------------------------------------------------------------------
   - Parallax tilt of the whole .hero-fx (perspective rotateX/rotateY)
   - CSS variables --hfx-mx / --hfx-my drive subtle orb drift toward
     the cursor in addition to their keyframe orbits
   - Click on hero spawns a ripple ring at the click position
   - A trailing comet follows the mouse inside hero (no-touch only)
   ──────────────────────────────────────────────────────────────────── */

const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
const isTouch      = matchMedia('(pointer:coarse)').matches;

export function initHeroFx() {
  const hero = document.getElementById('hero');
  const fx   = hero?.querySelector('.hero-fx');
  if (!hero || !fx || reduceMotion) return;

  /* ── 1. Parallax tilt + cursor-tracking CSS vars ─────────────── */
  let mx = 0, my = 0;       // target normalized mouse position [-1..1]
  let cx = 0, cy = 0;       // smoothed
  let rect = hero.getBoundingClientRect();

  const updateRect = () => { rect = hero.getBoundingClientRect(); };
  window.addEventListener('resize', updateRect, { passive: true });
  window.addEventListener('scroll', updateRect, { passive: true });

  if (!isTouch) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top)  / rect.height;
      mx = (x - 0.5) * 2;        // -1..1
      my = (y - 0.5) * 2;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => { mx = 0; my = 0; }, { passive: true });
  }

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
  });

  // Only override transform on desktop · keep mobile CSS untouched
  const applyTilt = !isTouch && window.innerWidth > 900;

  (function raf() {
    if (running) {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;

      if (applyTilt) {
        const rotY = cx * 14;
        const rotX = -cy * 10;
        const tz   = Math.abs(cx) * 18 + Math.abs(cy) * 12;
        fx.style.transform =
          `translate(8%, -50%) perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${tz}px)`;
      }

      fx.style.setProperty('--hfx-mx', cx.toFixed(3));
      fx.style.setProperty('--hfx-my', cy.toFixed(3));
    }
    requestAnimationFrame(raf);
  })();

  /* ── 2. Click ripple (spawns at click position inside hero) ──── */
  hero.addEventListener('pointerdown', (e) => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const ring = document.createElement('span');
    ring.className = 'hero-click-ripple';
    ring.style.left = x + 'px';
    ring.style.top  = y + 'px';
    hero.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
  }, { passive: true });

  /* ── 3. Comet trail following the cursor ─────────────────────── */
  if (!isTouch) {
    const trailLayer = document.createElement('div');
    trailLayer.className = 'hero-trail';
    hero.appendChild(trailLayer);

    let lastSpawn = 0;
    let lx = -1, ly = -1;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const now = performance.now();
      // throttle to ~60Hz, also require movement
      if (now - lastSpawn < 16) return;
      const dx = lx < 0 ? 0 : x - lx;
      const dy = ly < 0 ? 0 : y - ly;
      const speed = Math.hypot(dx, dy);
      if (speed < 2) return;
      lastSpawn = now;
      lx = x; ly = y;

      const dot = document.createElement('span');
      dot.className = 'hero-trail-dot';
      dot.style.left = x + 'px';
      dot.style.top  = y + 'px';
      // slight randomization
      const size = Math.min(14, 4 + speed * 0.18);
      dot.style.width  = size + 'px';
      dot.style.height = size + 'px';
      trailLayer.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove(), { once: true });
    }, { passive: true });
  }

  /* ── 4. Periodic "shooting star" streaks across hero ─────────── */
  if (!isTouch) {
    const starLayer = document.createElement('div');
    starLayer.className = 'hero-stars';
    hero.appendChild(starLayer);

    function spawnStar() {
      if (document.hidden) return;
      const r = hero.getBoundingClientRect();
      const startY = Math.random() * r.height * 0.7;
      const len    = 120 + Math.random() * 220;
      const dur    = 1100 + Math.random() * 900;
      const star = document.createElement('span');
      star.className = 'hero-star';
      star.style.top = startY + 'px';
      star.style.setProperty('--hs-len', len + 'px');
      star.style.setProperty('--hs-dur', dur + 'ms');
      starLayer.appendChild(star);
      setTimeout(() => star.remove(), dur + 100);
    }
    // Random cadence
    (function loop() {
      const wait = 2400 + Math.random() * 4200;
      setTimeout(() => { spawnStar(); loop(); }, wait);
    })();
  }
}
