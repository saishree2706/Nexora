# Nexora — Global Engineering Solutions

Single-page marketing site for **Nexora Global Engineering Solutions**, a multidisciplinary engineering firm based in coastal Karnataka.

This repo contains two versions of the site:

| Path | What it is |
| --- | --- |
| [`index.html`](./index.html) | Original single-file build — all HTML, CSS, and JS in one file. Drop into any static host. |
| [`nexora-astro/`](./nexora-astro) | Component-based Astro project — recommended for ongoing work and content updates. |

---

## Quick start (Astro project)

```bash
cd nexora-astro
npm install
npm run dev      # http://localhost:4321
```

Build for production:

```bash
npm run build    # output: nexora-astro/dist
npm run preview  # preview the built site
```

See [`nexora-astro/README.md`](./nexora-astro/README.md) for project layout, where to update content, and component reference.

---

## Highlights

- **Interactive 3D hero** — Three.js scene with rotating wireframe icosahedron, particle galaxy on tilted orbits, cursor-driven repulsion, click shockwaves, and scroll-driven camera dolly.
- **Apple-minimal 3D card hover** — real perspective tilt with parallax depth on inner elements (icons lift toward the viewer, arrows pop forward).
- **Editorial details** — numbered section labels, live Mangalore IST clock in nav and footer, geographic coordinate badges, blinking cursor accents, status pulse dots.
- **Responsive everywhere** — fluid type, dvh-aware hero, touch-aware interaction (3D effects auto-disable on coarse pointers).
- **Accessibility** — `prefers-reduced-motion` honored across all motion, ARIA on interactive elements, keyboard-friendly nav.

---

## Stack

- [Astro](https://astro.build) — static site framework with islands architecture
- [Three.js](https://threejs.org) — WebGL 3D scene in the hero
- Vanilla CSS — single global stylesheet, no build-time CSS framework
- Vanilla JS modules — lazy-loaded Three.js, intersection observers for reveals

---

## Repository layout

```
.
├── index.html              # original monolithic build
├── nexora-astro/           # Astro project (current)
│   ├── src/
│   │   ├── components/     # Astro components per section
│   │   ├── data/           # JS modules for content (services, industries, …)
│   │   ├── layouts/Base.astro
│   │   ├── pages/index.astro
│   │   ├── scripts/
│   │   │   ├── ui.js          # all UI behavior (cursor, tilt, reveals, clock, form)
│   │   │   └── three-hero.js  # WebGL hero scene (lazy-loaded)
│   │   └── styles/global.css
│   ├── public/             # static assets (favicon)
│   └── package.json
├── .gitignore
└── README.md
```

---

## License

All rights reserved · © Nexora Global Engineering Solutions
