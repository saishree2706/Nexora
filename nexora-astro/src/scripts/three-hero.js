/* ════════════════════════════════════════════════════════════════════
   NEXORA · ALIVE 3D HERO
   ─────────────────────────────────────────────────────────────────────
   Centerpiece    · giant rotating wireframe icosahedron
   Inner core     · counter-spinning octahedron (aqua)
   Energy ribbon  · animated torus-knot, bright emerald
   Orbits         · 3 tilted rings + traveling pulse dots
   Galaxy         · bright additive particles forming rings + ambient cloud
   Interaction    · cursor repels particles + tilts centerpiece
                   click drops shockwaves through the field
                   scroll dollies the camera away
   ─────────────────────────────────────────────────────────────────── */

export function initThreeHero(THREE) {
  const canvas = document.getElementById('webgl');
  const hero   = document.getElementById('hero');
  if (!canvas || !hero) {
    console.warn('[hero] canvas or hero element missing');
    return;
  }

  const isCoarse = matchMedia('(pointer:coarse)').matches;
  const w0       = window.innerWidth;
  const tier     = isCoarse || w0 < 700 ? 0 : w0 < 1200 ? 1 : 2;
  const COUNT    = [1200, 2200, 3400][tier];

  /* ── Scene / camera / renderer ──────────────────────────────────── */
  const scene  = new THREE.Scene();
  scene.fog    = new THREE.FogExp2(0x040A18, 0.018);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 0, 16);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    console.error('[hero] WebGL not available', e);
    return;
  }
  renderer.setClearColor(0x000000, 0);

  let W = 0, H = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    if (W === 0 || H === 0) return;
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    // Shift centerpiece based on viewport: right side on desktop, centered on small
    const offset = W < 900 ? 0 : W < 1400 ? 2.0 : 3.2;
    centerGroup.position.x = offset;
  }

  /* ── CENTERPIECE ─────────────────────────────────────────────────── */
  const centerGroup = new THREE.Group();
  centerGroup.position.set(3.2, -0.4, 0);
  scene.add(centerGroup);

  // 1) MAIN wireframe icosahedron (big, bright)
  const icoGeoBase = new THREE.IcosahedronGeometry(5.4, 1);
  const icoEdges = new THREE.LineSegments(
    new THREE.WireframeGeometry(icoGeoBase),
    new THREE.LineBasicMaterial({
      color: 0xF47B20, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  centerGroup.add(icoEdges);

  // 2) Inner solid (subtle occluder so back lines fade slightly)
  const icoInner = new THREE.Mesh(
    icoGeoBase.clone(),
    new THREE.MeshBasicMaterial({
      color: 0x06112B, transparent: true, opacity: 0.7,
    }),
  );
  icoInner.scale.setScalar(0.985);
  centerGroup.add(icoInner);

  // 3) Outer additive halo
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(5.9, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xF47B20, transparent: true, opacity: 0.06,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
    }),
  );
  centerGroup.add(halo);

  // 4) Energy ribbon — torus knot threading around it
  const knotGeo = new THREE.TorusKnotGeometry(2.5, 0.07, 220, 12, 2, 5);
  const knotMat = new THREE.MeshBasicMaterial({
    color: 0xFFD3A5, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  centerGroup.add(knot);

  // 5) Inner counter-spinning octahedron (small, aqua)
  const innerAccent = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.OctahedronGeometry(1.7, 0)),
    new THREE.LineBasicMaterial({
      color: 0xFFD3A5, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  centerGroup.add(innerAccent);

  // 6) Tiny core dot (the very center, brightest)
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  centerGroup.add(core);

  /* ── ORBIT RINGS + traveling pulse dots ─────────────────────────── */
  function makeOrbitRing(radius, tiltX, tiltY, opacity) {
    const pts = [];
    const segments = 160;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({
      color: 0xF47B20, transparent: true, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const line = new THREE.Line(g, m);
    line.rotation.x = tiltX;
    line.rotation.y = tiltY;
    centerGroup.add(line);
    return line;
  }
  makeOrbitRing(7.5,  1.1,   0.3,  0.50);
  makeOrbitRing(9.2,  Math.PI / 2, 0, 0.32);
  makeOrbitRing(11.5, 0.7,   0.5,  0.22);

  // Traveling pulse dots on the inner orbit
  function makePulseDot(radius, tiltX, tiltY, color, phase) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    );
    centerGroup.add(m);
    return { mesh: m, radius, tiltX, tiltY, phase };
  }
  const pulseDots = [
    makePulseDot(7.5,  1.1, 0.3, 0xffffff, 0),
    makePulseDot(7.5,  1.1, 0.3, 0xFFD3A5, Math.PI),
    makePulseDot(9.2,  Math.PI / 2, 0, 0xF47B20, Math.PI * 0.5),
    makePulseDot(11.5, 0.7, 0.5, 0xffffff,      Math.PI * 1.3),
  ];

  /* ── PARTICLE GALAXY ────────────────────────────────────────────── */
  function makeSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0,    'rgba(255,255,255,1)');
    g.addColorStop(0.18, 'rgba(180,255,210,0.95)');
    g.addColorStop(0.45, 'rgba(244,123,32,0.55)');
    g.addColorStop(0.85, 'rgba(244,123,32,0.05)');
    g.addColorStop(1,    'rgba(244,123,32,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }
  const spriteTex = makeSprite();

  const positions  = new Float32Array(COUNT * 3);
  const velocities = new Float32Array(COUNT * 3);
  const homePos    = new Float32Array(COUNT * 3);
  const colors     = new Float32Array(COUNT * 3);
  const sizes      = new Float32Array(COUNT);

  const cGreen = new THREE.Color(0xF47B20);
  const cAqua  = new THREE.Color(0xFFD3A5);
  const cMint  = new THREE.Color(0xb3ffd9);
  const cWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    let x, y, z;
    const roll = Math.random();
    if (roll < 0.45) {
      // Inner ring (tilted, ~r 7.2-8.6)
      const r = 7.2 + Math.random() * 1.4;
      const a = Math.random() * Math.PI * 2;
      const tilt = 1.1, ya = 0.3;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r;
      z = (Math.random() - 0.5) * 0.5;
      const ny = y * Math.cos(tilt) - z * Math.sin(tilt);
      const nz = y * Math.sin(tilt) + z * Math.cos(tilt);
      const nx = x * Math.cos(ya) + nz * Math.sin(ya);
      const nz2 = -x * Math.sin(ya) + nz * Math.cos(ya);
      x = nx; y = ny; z = nz2;
    } else if (roll < 0.78) {
      // Outer ring (mostly flat, ~r 9.5-12)
      const r = 9.5 + Math.random() * 2.5;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r * 0.22;
      z = (Math.random() - 0.5) * 0.7;
    } else {
      // Scattered ambient cloud (full volume)
      const r = 6 + Math.random() * 11;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      z = r * Math.cos(phi) * 0.6;
    }
    homePos[i3]   = x;
    homePos[i3+1] = y;
    homePos[i3+2] = z;
    positions[i3]   = x;
    positions[i3+1] = y;
    positions[i3+2] = z;

    const t = Math.random();
    const c = t < 0.55 ? cGreen : (t < 0.82 ? cAqua : (t < 0.96 ? cMint : cWhite));
    colors[i3]   = c.r;
    colors[i3+1] = c.g;
    colors[i3+2] = c.b;

    sizes[i] = 0.18 + Math.random() * 0.30;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const pMat = new THREE.PointsMaterial({
    size: 0.42,
    map: spriteTex,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const galaxy = new THREE.Points(pGeo, pMat);
  centerGroup.add(galaxy);

  /* ── Cursor glow ────────────────────────────────────────────────── */
  const cursorGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0xFFD3A5, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  cursorGlow.visible = false;
  scene.add(cursorGlow);

  /* ── Resize after groups are ready ──────────────────────────────── */
  resize();
  requestAnimationFrame(resize);
  new ResizeObserver(resize).observe(hero);

  /* ── Interaction ────────────────────────────────────────────────── */
  const mouse       = new THREE.Vector3();
  const mouseTarget = new THREE.Vector3();
  let pointerActive = false;
  let lastPointerAt = 0;

  const mouseN       = { x: 0, y: 0 };
  const mouseNTarget = { x: 0, y: 0 };

  const ndc       = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane     = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hitPoint  = new THREE.Vector3();

  function projectToPlane(clientX, clientY) {
    const r = hero.getBoundingClientRect();
    ndc.x =  ((clientX - r.left) / W) * 2 - 1;
    ndc.y = -((clientY - r.top)  / H) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    raycaster.ray.intersectPlane(plane, hitPoint);
    mouseNTarget.x = ndc.x;
    mouseNTarget.y = ndc.y;
    return hitPoint;
  }

  function onPointerMove(clientX, clientY) {
    projectToPlane(clientX, clientY);
    mouseTarget.copy(hitPoint);
    pointerActive = true;
    lastPointerAt = performance.now();
    cursorGlow.visible = true;
  }

  hero.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
  hero.addEventListener('mouseleave', () => {
    pointerActive = false;
    cursorGlow.visible = false;
    mouseNTarget.x = 0; mouseNTarget.y = 0;
  });
  hero.addEventListener('touchmove', (e) => {
    if (e.touches.length) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  hero.addEventListener('touchend', () => {
    setTimeout(() => {
      if (performance.now() - lastPointerAt > 1200) {
        pointerActive = false;
        cursorGlow.visible = false;
      }
    }, 1200);
  });

  /* ── Click shockwaves ───────────────────────────────────────────── */
  const waves = [];
  function spawnWave(clientX, clientY) {
    projectToPlane(clientX, clientY);
    waves.push({ center: hitPoint.clone(), radius: 0, life: 1 });
    if (waves.length > 4) waves.shift();
  }
  hero.addEventListener('click', (e) => spawnWave(e.clientX, e.clientY));
  hero.addEventListener('touchstart', (e) => {
    if (e.touches.length) spawnWave(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  /* ── Pause off-screen / hidden ──────────────────────────────────── */
  let paused = false;
  new IntersectionObserver(
    (entries) => { paused = !entries[0].isIntersecting; },
    { threshold: 0 },
  ).observe(hero);
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });

  /* ── Scroll → camera dolly + scene fade ─────────────────────────── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ── Animate ────────────────────────────────────────────────────── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (paused || W === 0) return;

    const dt   = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    // Smooth pointer follow
    mouse.lerp(mouseTarget, 0.18);
    mouseN.x += (mouseNTarget.x - mouseN.x) * 0.06;
    mouseN.y += (mouseNTarget.y - mouseN.y) * 0.06;
    cursorGlow.position.copy(mouse);
    cursorGlow.scale.setScalar(1 + Math.sin(time * 4) * 0.18);

    /* Centerpiece rotation: continuous + cursor parallax */
    centerGroup.rotation.y += dt * 0.22;
    centerGroup.rotation.x = mouseN.y * 0.25 + Math.sin(time * 0.3) * 0.06;
    centerGroup.rotation.z = -mouseN.x * 0.10;

    /* Inner accent counter-spins faster */
    innerAccent.rotation.y -= dt * 0.7;
    innerAccent.rotation.x += dt * 0.45;

    /* Knot ribbon spins on its own axes — flowing energy feel */
    knot.rotation.x += dt * 0.6;
    knot.rotation.y -= dt * 0.4;
    knot.rotation.z += dt * 0.25;
    knotMat.opacity = 0.65 + Math.sin(time * 1.7) * 0.20;

    /* Halo pulse */
    halo.material.opacity = 0.06 + Math.sin(time * 1.2) * 0.04;

    /* Core flicker */
    core.scale.setScalar(1 + Math.sin(time * 5) * 0.4);

    /* Pulse dots travel the orbits */
    for (let i = 0; i < pulseDots.length; i++) {
      const d = pulseDots[i];
      const a = time * 0.6 + d.phase;
      const x = Math.cos(a) * d.radius;
      const y = Math.sin(a) * d.radius;
      // apply same tilt as ring
      const cx = Math.cos(d.tiltX), sx = Math.sin(d.tiltX);
      const cy2 = Math.cos(d.tiltY), sy2 = Math.sin(d.tiltY);
      const ny = y * cx;
      const nz = y * sx;
      const nx = x * cy2 + nz * sy2;
      const nz2 = -x * sy2 + nz * cy2;
      d.mesh.position.set(nx, ny, nz2);
      d.mesh.scale.setScalar(1 + Math.sin(time * 3 + d.phase) * 0.3);
    }

    /* Particle galaxy orbit + cursor disturbance + shockwaves */
    galaxy.rotation.z += dt * 0.05;

    const pos = pGeo.attributes.position.array;
    const mLocal = new THREE.Vector3(mouse.x, mouse.y, mouse.z);
    centerGroup.worldToLocal(mLocal);
    const mx = mLocal.x, my = mLocal.y, mz = mLocal.z;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const px = pos[i3], py = pos[i3+1], pz = pos[i3+2];
      let vx = velocities[i3], vy = velocities[i3+1], vz = velocities[i3+2];

      // spring back toward home
      vx += (homePos[i3]   - px) * 0.025;
      vy += (homePos[i3+1] - py) * 0.025;
      vz += (homePos[i3+2] - pz) * 0.025;

      // cursor repulsion
      if (pointerActive) {
        const dx = px - mx, dy = py - my, dz = pz - mz;
        const d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < 16 && d2 > 0.05) {
          const d = Math.sqrt(d2);
          const f = (4.0 - d) * 0.08;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
          vz += (dz / d) * f;
        }
      }

      // shockwave influence
      for (let w = 0; w < waves.length; w++) {
        const wave = waves[w];
        const dx = px - wave.center.x, dy = py - wave.center.y, dz = pz - wave.center.z;
        const d  = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.001;
        if (Math.abs(d - wave.radius) < 1.6) {
          const f = wave.life * 0.6;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
          vz += (dz / d) * f;
        }
      }

      vx *= 0.92; vy *= 0.92; vz *= 0.92;

      velocities[i3]   = vx;
      velocities[i3+1] = vy;
      velocities[i3+2] = vz;
      pos[i3]   = px + vx;
      pos[i3+1] = py + vy;
      pos[i3+2] = pz + vz;
    }
    pGeo.attributes.position.needsUpdate = true;

    /* Update waves */
    for (let w = waves.length - 1; w >= 0; w--) {
      waves[w].radius += dt * 22;
      waves[w].life   -= dt * 0.7;
      if (waves[w].life <= 0 || waves[w].radius > 32) waves.splice(w, 1);
    }

    /* Camera dolly with scroll + soft mouse parallax */
    const heroH    = hero.offsetHeight || 1;
    const scrollPct = Math.min(scrollY / heroH, 1);
    const camTargetZ = 16 + scrollPct * 10;
    const camTargetX = mouseN.x * 1.5;
    const camTargetY = mouseN.y * 0.8;
    camera.position.x += (camTargetX - camera.position.x) * 0.06;
    camera.position.y += (camTargetY - camera.position.y) * 0.06;
    camera.position.z += (camTargetZ - camera.position.z) * 0.06;
    camera.lookAt(centerGroup.position);

    // Fade scene as we scroll past
    const fade = Math.max(0, 1 - scrollPct * 1.05);
    icoEdges.material.opacity   = 0.95 * fade;
    innerAccent.material.opacity = 0.95 * fade;
    pMat.opacity                = fade;
    knotMat.opacity             = (0.65 + Math.sin(time * 1.7) * 0.20) * fade;

    renderer.render(scene, camera);
  }
  animate();

  console.log('[hero] Three.js initialized · particles:', COUNT, '· tier:', tier);
}
