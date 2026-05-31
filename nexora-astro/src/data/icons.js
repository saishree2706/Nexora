/* Central icon library · clean line-style SVGs that match the brand.
   All icons are 24x24 viewBox, 1.5 stroke, currentColor.
   Use via the <Icon name="..." /> component or with set:html. */

const stroke = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

export const icons = {
  /* ─── SERVICES (8) ─── */
  /* Process: distillation column / process vessel with inlet & outlet streams */
  process: `<svg viewBox="0 0 24 24" ${stroke}><rect x="8" y="4" width="8" height="13" rx="1.5"/><path d="M3 8h5"/><path d="M16 8h5"/><path d="M3 13h5"/><path d="M16 13h5"/><path d="M12 17v3"/><path d="M8 8h8M8 11h8M8 14h8"/><circle cx="3.5" cy="8" r=".6" fill="currentColor"/><circle cx="20.5" cy="13" r=".6" fill="currentColor"/></svg>`,

  /* Mechanical: gear / rotating equipment */
  mechanical: `<svg viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>`,

  /* HSE: hard hat / safety helmet */
  hse: `<svg viewBox="0 0 24 24" ${stroke}><path d="M2 17h20"/><path d="M5 17C5 12.6 8.1 9 12 9s7 3.6 7 8"/><path d="M10 9V7a2 2 0 1 1 4 0v2"/></svg>`,

  /* Piping: pipe run with 90° elbow and flange indicators */
  piping: `<svg viewBox="0 0 24 24" ${stroke}><path d="M3 8h8"/><path d="M3 10h8"/><path d="M11 8v8"/><path d="M13 8v8"/><path d="M11 16h8"/><path d="M13 18h6"/><path d="M6 6v5M17 14v5"/></svg>`,

  /* Civil & Structural: portal frame with columns, beam and base */
  civil: `<svg viewBox="0 0 24 24" ${stroke}><path d="M3 21h18"/><path d="M5 21V7M19 21V7"/><path d="M3 7h18"/><path d="M5 13h14"/><path d="M9 7v14M15 7v14"/></svg>`,

  /* Electrical: distribution panel with bus bars and breakers */
  electrical: `<svg viewBox="0 0 24 24" ${stroke}><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h18M3 15h18"/><path d="M9 3v6M15 3v6"/><path d="M6 12h3M15 12h3"/></svg>`,

  /* Instrumentation: pressure gauge / process dial */
  instrumentation: `<svg viewBox="0 0 24 24" ${stroke}><path d="M5.5 17A8 8 0 1 1 18.5 17"/><path d="M8.5 17a4 4 0 0 1 7 0"/><path d="M12 7v3"/><path d="M12 12l2.5-2.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,

  /* Pipe Stress: pipe under load with deflection and force arrows */
  stress: `<svg viewBox="0 0 24 24" ${stroke}><path d="M3 12h18"/><path d="M8 9v6M12 7v10M16 9v6"/><path d="M10 5l2 2 2-2"/><path d="M10 19l2-2 2 2"/></svg>`,

  /* ─── VERTICALS ─── */
  onshore: `<svg viewBox="0 0 24 24" ${stroke}><path d="M3 21V11l5-3v3l5-3v13"/><path d="M13 21V8l4 2v11"/><path d="M17 21v-7l3 2v5"/><path d="M3 21h18"/><path d="M6 14h.01M6 17h.01M9 14h.01M9 17h.01"/></svg>`,

  offshore: `<svg viewBox="0 0 24 24" ${stroke}><path d="M3 21h18"/><path d="M5 21V12l7-5 7 5v9"/><path d="M9 21v-7h6v7"/><path d="M12 7V3"/><path d="M3 18c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0 2-1 3 0 2 1 3 0"/></svg>`,

  /* ─── WHY ─── */
  heritage: `<svg viewBox="0 0 24 24" ${stroke}><path d="M3 7c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/><path d="M3 12c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/><path d="M3 17c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/></svg>`,

  team: `<svg viewBox="0 0 24 24" ${stroke}><circle cx="9" cy="8" r="3"/><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M14 21c0-2.5 1.5-4.5 4-4.5s4 1.5 4 3"/></svg>`,

  globe: `<svg viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>`,

  efficiency: `<svg viewBox="0 0 24 24" ${stroke}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/><path d="M12 6v4"/><path d="m10 8 2 2 2-2"/></svg>`,

  /* ─── CONTACT ─── */
  pin: `<svg viewBox="0 0 24 24" ${stroke}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>`,

  mail: `<svg viewBox="0 0 24 24" ${stroke}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>`,

  phone: `<svg viewBox="0 0 24 24" ${stroke}><path d="M5 3h3.5l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2 4.5 1.5V17a3 3 0 0 1-3 3A14 14 0 0 1 2 6a3 3 0 0 1 3-3z"/></svg>`,

  /* ─── UTILITY ─── */
  arrow: `<svg viewBox="0 0 24 24" ${stroke}><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" ${stroke}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="2.4"/></svg>`,
};

/* Helper for SSR/inline use */
export function getIcon(name) {
  return icons[name] || '';
}
