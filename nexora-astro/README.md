# Nexora Global Engineering Solutions

Astro-powered marketing site. Static-by-default, component-based, deployable as plain HTML to any host.

## Quick start

```bash
npm install      # one-time
npm run dev      # http://localhost:4321 — hot reload
npm run build    # outputs static site to ./dist
npm run preview  # preview the production build locally
```

## Project layout

```
src/
├── data/             ← Edit content here. No HTML to touch.
│   ├── site.js          brand, tagline, contact, nav
│   ├── services.js      6 core service cards
│   ├── industries.js    5 industry tiles
│   ├── projects.js      project bento grid
│   ├── why.js           why-us bullets, hero stats, metrics
│   └── marquee.js       capability ticker keywords
│
├── components/       ← Reusable UI pieces. One job each.
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── About.astro
│   ├── Services.astro      → renders Services.map(ServiceCard)
│   ├── ServiceCard.astro
│   ├── Marquee.astro
│   ├── Industries.astro    → renders Industries.map(IndustryCard)
│   ├── IndustryCard.astro
│   ├── Projects.astro      → renders Projects.map(ProjectTile)
│   ├── ProjectTile.astro
│   ├── Why.astro
│   ├── Contact.astro
│   └── Footer.astro
│
├── layouts/
│   └── Base.astro    ← <html>, fonts, meta, loader, cursor, FAB, footer
│
├── pages/
│   └── index.astro   ← Composes the homepage from components
│                       (add about.astro / services/[slug].astro later)
│
├── scripts/
│   ├── ui.js         ← Cursor, tilt, ripple, scroll, form, mobile menu
│   └── three-hero.js ← WebGL hero animation (lazy-loaded)
│
└── styles/
    └── global.css    ← All site styles (vars, components, responsive)
```

## How to make common changes

| Task                          | File to edit                       |
| ----------------------------- | ---------------------------------- |
| Update phone / email          | `src/data/site.js`                 |
| Add a 7th service             | `src/data/services.js`             |
| Swap a project image          | `src/data/projects.js`             |
| Edit hero headline            | `src/components/Hero.astro`        |
| Tune brand colors             | `:root` block in `global.css`     |
| Tweak responsive breakpoints  | bottom of `global.css`             |
| Add a new page (e.g. /about)  | create `src/pages/about.astro`     |

## Deployment

Astro builds **plain static HTML/CSS/JS** to `./dist`. Drop those files on any host:

| Host             | Command                                                   |
| ---------------- | --------------------------------------------------------- |
| **Netlify**      | `npm run build` then drag `dist/` to netlify.com          |
| **Vercel**       | `npx vercel` (auto-detects Astro)                         |
| **GitHub Pages** | Build, push `dist/` to `gh-pages` branch                  |
| **Any web host** | Upload `dist/*` to your `public_html` folder              |

No Node server needed in production — it's a fully static site.

## Tech

- **[Astro](https://astro.build)** — zero-JS by default, ships only the JS the page needs
- **[Three.js](https://threejs.org)** — WebGL hero animation, lazy-loaded
- **Google Fonts** — Oswald, Rajdhani, DM Sans
- **Unsplash** — placeholder photography (replace with branded shots before launch)
