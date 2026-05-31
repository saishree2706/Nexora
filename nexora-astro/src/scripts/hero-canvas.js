/* ════════════════════════════════════════════════════════════════════
   NEXORA · HERO 3D ENGINE  (pure Canvas 2D — zero dependencies)
   Perspective-projected 3D scene: icosahedron + octahedron wireframes,
   3 tilted orbital rings, 4 travelling pulse dots, 500-1500 particles,
   cursor repulsion, click shockwaves, mouse parallax tilt, scroll fade.
   ════════════════════════════════════════════════════════════════════ */

export function initHero() {
  const canvas = document.getElementById('webgl');
  const hero   = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  /* ── Device tier ── */
  const isCoarse = matchMedia('(pointer:coarse)').matches;
  const tier     = isCoarse ? 0 : window.innerWidth < 1200 ? 1 : 2;
  const COUNT    = [500, 950, 1500][tier];

  /* ── Canvas sizing — NO DPR transform, dead-simple 1:1 ── */
  let W = 0, H = 0, SX = 0, SY = 0;

  function resize() {
    // Use getBoundingClientRect for accuracy; fall back to innerWidth/Height
    const r = hero.getBoundingClientRect();
    W = Math.round(r.width)  || window.innerWidth;
    H = Math.round(r.height) || window.innerHeight;
    // Set the canvas resolution to match CSS pixels exactly
    canvas.width  = W;
    canvas.height = H;
    // Ensure CSS display size matches (overrides any CSS width/height rules)
    canvas.style.cssText +=
      ';width:' + W + 'px;height:' + H + 'px';
    SX = W > 900 ? W * 0.70 : W * 0.50;
    SY = H * 0.46;
  }

  // Try resizing immediately, then again on load + ResizeObserver
  resize();
  window.addEventListener('load', resize, { once: true });
  new ResizeObserver(resize).observe(hero);

  /* ── 3D Perspective projection ── */
  const FOV   = 520;
  const CAM_Z = 265;
  let   mTX   = 0;   // scene tilt from mouse (radians, smoothed)
  let   mTY   = 0;

  function project(x, y, z) {
    // apply mouse tilt: rotate around Y, then X
    const cy = Math.cos(mTY), sy = Math.sin(mTY);
    const cx = Math.cos(mTX), sx = Math.sin(mTX);
    const x1 = x  * cy + z  * sy;
    const z1 = -x * sy + z  * cy;
    const y2 = y  * cx - z1 * sx;
    const z2 = y  * sx + z1 * cx;
    const zz = CAM_Z - z2;
    if (zz < 1) return null;
    const s = FOV / zz;
    return { sx: SX + x1 * s, sy: SY + y2 * s, s };
  }

  /* ── Icosahedron geometry ── */
  const φ = (1 + Math.sqrt(5)) / 2;
  const _n = Math.sqrt(1 + φ * φ);
  const IR = 108;
  const iVerts = [
    [ 0,  1,  φ],[ 0, -1,  φ],[ 0,  1, -φ],[ 0, -1, -φ],
    [ 1,  φ,  0],[-1,  φ,  0],[ 1, -φ,  0],[-1, -φ,  0],
    [ φ,  0,  1],[-φ,  0,  1],[ φ,  0, -1],[-φ,  0, -1],
  ].map(([a,b,c]) => [a*IR/_n, b*IR/_n, c*IR/_n]);

  const iEdges = [
    [0,1],[0,4],[0,5],[0,8],[0,9],
    [1,6],[1,7],[1,8],[1,9],
    [2,3],[2,4],[2,5],[2,10],[2,11],
    [3,6],[3,7],[3,10],[3,11],
    [4,5],[4,8],[4,10],[5,9],[5,11],
    [6,7],[6,8],[6,10],[7,9],[7,11],[8,10],[9,11],
  ];

  /* ── Octahedron (inner, counter-spins) ── */
  const OR = 35;
  const oVerts = [
    [ 0, OR, 0],[ 0,-OR, 0],[OR, 0, 0],[-OR, 0, 0],[ 0, 0, OR],[ 0, 0,-OR],
  ];
  const oEdges = [
    [0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5],
  ];

  /* rotate point around Y axis */
  function ry(vx, vy, vz, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [vx * c + vz * s, vy, -vx * s + vz * c];
  }

  function wireframe(verts, edges, angle, r, g, b, alpha) {
    ctx.beginPath();
    for (const [a, b] of edges) {
      const pa = project(...ry(...verts[a], angle));
      const pb = project(...ry(...verts[b], angle));
      if (!pa || !pb) continue;
      ctx.moveTo(pa.sx, pa.sy);
      ctx.lineTo(pb.sx, pb.sy);
    }
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  /* ── Orbital rings ── */
  const ORBITS = [
    { r: 152, tx: 1.10,      tz: 0.30, op: 0.55, c: [244,123,32]  },
    { r: 198, tx: Math.PI/2, tz: 0.00, op: 0.35, c: [244,123,32]  },
    { r: 248, tx: 0.65,      tz: 0.50, op: 0.22, c: [255,211,165] },
  ];

  function orbitPoint(orb, a, sceneA) {
    const { r, tx, tz } = orb;
    const x0 = Math.cos(a) * r, y0 = Math.sin(a) * r;
    const cz = Math.cos(tz), sz = Math.sin(tz);
    const x1 = x0*cz - y0*sz,  y1 = x0*sz + y0*cz;
    const y2 = y1 * Math.cos(tx),   z2 = y1 * Math.sin(tx);
    return project(...ry(x1, y2, z2, sceneA));
  }

  function drawOrbit(orb, sceneA, fade) {
    const SEG = 90;
    ctx.beginPath();
    let first = true;
    for (let i = 0; i <= SEG; i++) {
      const p = orbitPoint(orb, (i / SEG) * Math.PI * 2, sceneA);
      if (!p) { first = true; continue; }
      if (first) { ctx.moveTo(p.sx, p.sy); first = false; }
      else ctx.lineTo(p.sx, p.sy);
    }
    const [r2,g2,b2] = orb.c;
    ctx.strokeStyle = `rgba(${r2},${g2},${b2},${orb.op * fade})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 9]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /* ── Pulse dots ── */
  const PULSES = [
    { oi: 0, ph: 0,             c: [255,255,255], sz: 4.5 },
    { oi: 0, ph: Math.PI,       c: [255,211,165], sz: 3.5 },
    { oi: 1, ph: Math.PI * 0.5, c: [244,123,32],  sz: 3.5 },
    { oi: 2, ph: Math.PI * 1.3, c: [255,255,255], sz: 2.8 },
  ];

  /* ── Particles ── */
  const COLS = [
    [244,123,32],[244,123,32],[244,123,32],
    [255,211,165],[255,211,165],
    [180,255,217],
    [255,255,255],
  ];
  const parts = [];
  for (let i = 0; i < COUNT; i++) {
    const roll = Math.random();
    let x, y, z;
    if (roll < 0.38) {
      const r = 138 + Math.random() * 36, a = Math.random() * Math.PI * 2;
      x = Math.cos(a)*r; y = Math.sin(a)*r*0.28; z = (Math.random()-.5)*22;
    } else if (roll < 0.72) {
      const r = 192 + Math.random() * 65, a = Math.random() * Math.PI * 2;
      x = Math.cos(a)*r; y = Math.sin(a)*r*0.10; z = (Math.random()-.5)*14;
    } else {
      const r = 85 + Math.random() * 185;
      const th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
      x = r*Math.sin(ph)*Math.cos(th); y = r*Math.sin(ph)*Math.sin(th)*0.55;
      z = r*Math.cos(ph)*0.45;
    }
    const c = COLS[Math.floor(Math.random() * COLS.length)];
    parts.push({ x, y, z, hx:x, hy:y, hz:z, vx:0, vy:0, vz:0,
                 sz: 0.8 + Math.random()*2.0, c, al: 0.38 + Math.random()*0.55 });
  }

  /* ── Radial glow ── */
  function glow(x, y, radius, [R,G,B], alpha) {
    const g = ctx.createRadialGradient(x,y,0,x,y,radius);
    g.addColorStop(0,   `rgba(255,255,255,${alpha})`);
    g.addColorStop(0.3, `rgba(${R},${G},${B},${alpha*0.8})`);
    g.addColorStop(1,   `rgba(${R},${G},${B},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI*2); ctx.fill();
  }

  /* ── Interaction ── */
  let nmx=0, nmy=0, smx=0, smy=0;
  let mOffX=0, mOffY=0, pActive=false;
  const waves = [];

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    nmx = ((e.clientX-r.left)/W - 0.5)*2;
    nmy = ((e.clientY-r.top) /H - 0.5)*2;
    mOffX = e.clientX-r.left-SX; mOffY = e.clientY-r.top-SY;
    pActive = true;
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { nmx=0; nmy=0; pActive=false; }, { passive: true });
  hero.addEventListener('click', (e) => {
    const r = hero.getBoundingClientRect();
    waves.push({ x: e.clientX-r.left-SX, y: e.clientY-r.top-SY, rad:0, life:1 });
    if (waves.length > 5) waves.shift();
  }, { passive: true });

  let scrollPct = 0;
  window.addEventListener('scroll', () => {
    scrollPct = Math.min(window.scrollY / (hero.offsetHeight || 800), 1);
  }, { passive: true });

  let paused = false;
  new IntersectionObserver(([e]) => { paused = !e.isIntersecting; }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  /* ── Main loop ── */
  let prev = performance.now(), time = 0;

  function frame(now) {
    requestAnimationFrame(frame);

    // Self-heal: if canvas not sized yet, retry resize every frame until it is
    if (W < 10 || H < 10) { resize(); return; }
    if (paused) return;

    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now; time += dt;

    smx += (nmx-smx)*0.065; smy += (nmy-smy)*0.065;
    mTY =  smx * 0.30;
    mTX = -smy * 0.20;

    const fade  = Math.max(0, 1 - scrollPct * 1.15);
    const scA   = time * 0.22;       // continuous Y-rotation

    ctx.clearRect(0, 0, W, H);
    if (fade < 0.01) return;

    /* 1 · Orbital rings */
    for (const o of ORBITS) drawOrbit(o, scA, fade);

    /* 2 · Icosahedron wireframe */
    wireframe(iVerts, iEdges, scA,        46, 204, 113, 0.82 * fade);

    /* 3 · Inner octahedron (counter-spins) */
    wireframe(oVerts, oEdges, -time*0.65, 127, 255, 212, 0.88 * fade);

    /* 4 · Pulse dots */
    for (const pd of PULSES) {
      const p = orbitPoint(ORBITS[pd.oi], time*0.58 + pd.ph, scA);
      if (!p) continue;
      const pulse = 1 + Math.sin(time*3 + pd.ph)*0.35;
      glow(p.sx, p.sy, pd.sz*6*pulse, pd.c, 0.60*fade);
      ctx.fillStyle = `rgba(${pd.c.join(',')},${fade})`;
      ctx.beginPath(); ctx.arc(p.sx, p.sy, pd.sz*pulse, 0, Math.PI*2); ctx.fill();
    }

    /* 5 · Particles */
    const cA = Math.cos(scA), sA = Math.sin(scA);
    for (const p of parts) {
      p.vx += (p.hx-p.x)*0.022; p.vy += (p.hy-p.y)*0.022; p.vz += (p.hz-p.z)*0.022;

      const rx = p.x*cA + p.z*sA,  rz = -p.x*sA + p.z*cA;
      const pr = project(rx, p.y, rz);

      if (pActive && pr) {
        const dx = pr.sx-(SX+mOffX), dy = pr.sy-(SY+mOffY);
        const d2 = dx*dx+dy*dy;
        if (d2 < 12000 && d2 > 4) {
          const d = Math.sqrt(d2), f = Math.max(0,(110-d)/110)*0.55;
          p.vx += (dx/d)*f*0.14; p.vy += (dy/d)*f*0.14;
        }
      }
      for (const w of waves) {
        if (!pr) break;
        const dx = pr.sx-(SX+w.x), dy = pr.sy-(SY+w.y);
        const d = Math.sqrt(dx*dx+dy*dy)||1;
        if (Math.abs(d-w.rad) < 30) {
          const f = w.life*0.85;
          p.vx += (dx/d)*f*0.17; p.vy += (dy/d)*f*0.17;
        }
      }

      p.vx*=0.91; p.vy*=0.91; p.vz*=0.91;
      p.x+=p.vx;  p.y+=p.vy;  p.z+=p.vz;

      const rx2 = p.x*cA + p.z*sA, rz2 = -p.x*sA + p.z*cA;
      const pr2 = project(rx2, p.y, rz2);
      if (!pr2) continue;
      if (pr2.sx < -20 || pr2.sx > W+20 || pr2.sy < -20 || pr2.sy > H+20) continue;

      const alpha = p.al * fade * Math.min(1, pr2.s/1.8);
      if (alpha < 0.025) continue;
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = `rgb(${p.c.join(',')})`;
      ctx.beginPath(); ctx.arc(pr2.sx, pr2.sy, Math.max(0.5, Math.min(3.2, p.sz*pr2.s*0.50)), 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* 6 · Central core */
    const cp = project(0, 0, 0);
    if (cp) {
      const pulse = 1 + Math.sin(time*5.2)*0.32;
      glow(cp.sx, cp.sy, 58*pulse*fade, [255,211,165], 0.20*fade);
      glow(cp.sx, cp.sy, 19*pulse*fade, [255,255,255], 0.70*fade);
      ctx.globalAlpha = fade;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cp.sx, cp.sy, 3.8*pulse, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* 7 · Click shockwave rings */
    for (let i = waves.length-1; i >= 0; i--) {
      const w = waves[i];
      w.rad  += dt*380; w.life -= dt*1.1;
      if (w.life <= 0) { waves.splice(i,1); continue; }
      ctx.beginPath(); ctx.arc(SX+w.x, SY+w.y, w.rad, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(244,123,32,${w.life*0.55*fade})`;
      ctx.lineWidth = 1.5; ctx.stroke();
    }
  }

  requestAnimationFrame(frame);
  console.log(`%c[Nexora] Canvas2D hero · tier:${tier} · particles:${COUNT}`, 'color:#F47B20;font-weight:bold');
}
