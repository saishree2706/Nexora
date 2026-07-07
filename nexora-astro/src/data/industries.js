/* Two core verticals served by Nexora.
   Each vertical lists its sub-verticals. */
export const verticals = [
  {
    iconKey: 'onshore',
    sub:   '01 Vertical',
    title: 'Onshore',
    accent:'orange',
    img: '/Onshore.png',
    tags: [
      'Oil & Gas',
      'Food & Beverage',
      'Petrochemical',
      'Chemical',
      'Pharma',
      'Mining',
      'Storage Terminals',
      'Skid Packages',
      'Power Sector',
      'WTP / STP',
    ],
  },
  {
    iconKey: 'offshore',
    sub:   '02 Vertical',
    title: 'Offshore',
    accent:'blue',
    img: '/Offshore.png',
    tags: [
      'FPSO',
      'FPU',
      'FSO',
      'Jack-up Rigs',
      'Fixed Platforms',
    ],
  },
];

/* Legacy export kept for backwards-compat (visual cards w/ images).
   Not used in the current Industries section, but referenced elsewhere. */
export const industries = [
  { tag: 'Energy Sector', title: 'Oil & Gas',         img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=70' },
  { tag: 'Processing',    title: 'Petrochemical',     img: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&q=70' },
  { tag: 'Power',         title: 'Energy & Power',    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=70' },
  { tag: 'Utilities',     title: 'Water Treatment',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70' },
  { tag: 'Maritime',      title: 'Marine & Offshore', img: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=600&q=70' },
];
