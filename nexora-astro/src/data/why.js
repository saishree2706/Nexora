export const whyItems = [
  {
    iconKey: 'heritage',
    title: 'Coastal Engineering Heritage',
    desc:  'Engineers from coastal Karnataka are recognized globally — demonstrating exceptional expertise across all major engineering sectors.',
  },
  {
    iconKey: 'team',
    title: 'Highly Skilled Technical Team',
    desc:  'Domain expertise across process, structural, piping, EIT, analysis, and HSE disciplines.',
  },
  {
    iconKey: 'globe',
    title: 'Global Standards & Compliance',
    desc:  'ASME, AGES, SAES, and API compliant deliverables produced using a range of industry-leading engineering tools.',
  },
  {
    iconKey: 'efficiency',
    title: 'Cost-Efficient Execution',
    desc:  'Optimized project delivery that reduces overhead without compromising quality or safety.',
  },
];

/* Hero stats — the five facts the brief calls out:
   15+ industries · 2 verticals · 8+ disciplines · 20+ years · 100% standards */
export const heroStats = [
  {
    value: 15, suffix: '+', label: 'Industries Served',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="12" rx="1"/><path d="M16 9V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4"/><line x1="8" y1="14" x2="8" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="16" y1="14" x2="16" y2="18"/></svg>`
  },
  {
    value: 2, suffix: '', label: 'Core Verticals',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3"  width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><line x1="11" y1="7" x2="13" y2="7"/><line x1="7" y1="11" x2="7" y2="13"/></svg>`
  },
  {
    value: 8, suffix: '+', label: 'Engineering Disciplines',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
  {
    value: 20, suffix: '+', label: 'Years Core Experience',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>`
  },
  {
    value: 100, suffix: '%', label: 'Global Standards',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`
  },
];

/* Legacy metrics kept for backwards-compat — the doc asks us to NOT
   repeat the same figures inside the Why-Us section, so this is no
   longer rendered. Keep the export so other code that may reference it
   (or future use) still works. */
export const metrics = [];
