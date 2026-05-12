/* ============================================================
   PRODUCTS — listing + detail pages (/products/:slug)

   framesFolder → public folder for ezgif-frame-###.jpg sequences
   (default /MesoProbe until you add per-product folders)
   ============================================================ */

const FRAMES = '/MesoProbe'

/** Footer logo on product cards — override per product with `cardLogo` / `cardLogoAlt` */
export const DEFAULT_CARD_LOGO = '/industron-logo.png'

/** Bruker (Hysitron) product line — use on cards that link to bruker.com */
export const BRUKER_CARD_LOGO = '/Bruker-logo.png'
export const BRUKER_CARD_LOGO_ALT = 'Bruker'

const IMAGES = [
  '/Website/Customer/IITM.png',
  '/Website/Customer/IIT-Roorkee.png',
  '/Website/Customer/IIT-Kanpur.png',
  '/Website/Customer/drdo.png',
  '/Website/Customer/IIT-Indore-150x115.png',
  '/Website/Customer/IIMT.png',
  '/Website/Customer/isro.png',
  '/Website/Customer/iisc-1-150x132.png',
]

let imageIndex = 0
function nextImage() {
  const src = IMAGES[imageIndex % IMAGES.length]
  imageIndex += 1
  return src
}

function defaultHero(name, highlight, lead, badges) {
  return { tag: 'Product', title: name, highlight, lead, badges }
}

function defaultBeats(shortName, tagline) {
  return {
    intro: {
      kicker: 'Overview',
      heading: shortName,
      sub: tagline,
    },
    engineering: {
      kicker: 'Engineering',
      heading: 'Stable mechanics, precise control.',
      text: 'Rigid architecture and transducer design support repeatable contact and dependable load–displacement data.',
    },
    control: {
      kicker: 'Control & signal',
      heading: 'Low-noise acquisition.',
      text: 'Deterministic control loops preserve signal fidelity across indentation, compression, and extended test sequences.',
    },
    performance: {
      kicker: 'Applications',
      heading: 'From films to engineered components.',
      text: 'Suited to advanced materials, devices, and industrial validation where repeatability matters.',
    },
    final: {
      kicker: 'Next step',
      heading: 'Configure with Industron.',
      text: `${shortName} — our team helps with setup, method transfer, and ongoing support.`,
    },
  }
}

const defaultInfo = [
  { title: 'Performance', text: 'Discuss load range, displacement, and environmental options for your samples.' },
  { title: 'Architecture', text: 'Frame and stage options aligned to your workflow and lab constraints.' },
  { title: 'Workflows', text: 'Integration paths for imaging, fixturing, and data pipelines.' },
  { title: 'Support', text: 'Application specialists for setup, training, and validation.' },
]

function p({
  slug,
  name,
  category,
  shortDesc,
  highlight,
  lead,
  badges,
  beatsHeading,
  beatsTagline,
  info,
  externalUrl,
  cardLogo,
  cardLogoAlt,
}) {
  const short = beatsHeading || name.split(/[–-]/)[0].trim()
  return {
    slug,
    name,
    category,
    image: nextImage(),
    shortDesc,
    exploreTo: `/products/${slug}`,
    framesFolder: FRAMES,
    hero: defaultHero(name, highlight, lead, badges),
    beats: defaultBeats(short, beatsTagline || shortDesc),
    info: info || defaultInfo,
    cardLogo: cardLogo ?? DEFAULT_CARD_LOGO,
    cardLogoAlt: cardLogoAlt ?? 'Industron',
    ...(externalUrl ? { externalUrl } : {}),
  }
}

/** Official Bruker product pages — used for /products/:slug redirect and portfolio CTAs */
export const BRUKER_URLS = {
  pi85l:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-instruments-for-sem-tem/hysitron-pi-envision-sem-picoindenter.html',
  pi89:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-instruments-for-sem-tem/hysitron-pi-89-sem-picoindenter.html',
  pi95:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-instruments-for-sem-tem/hysitron-pi-95-tem-picoindenter.html',
  intraspect360:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-instruments-for-microscopes/hysitron-intraspect-360.html',
  ts75:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-instruments-for-microscopes/hysitron-ts-75-triboscope.html',
  biosoft:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-instruments-for-microscopes/hysitron-biosoft.html',
  ti980:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-test-systems/hysitron-ti-980-nanoindenter.html',
  ts77:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-test-systems/hysitron-ts-77-select-nanoindenter.html',
  tiPremier:
    'https://www.bruker.com/en/products-and-solutions/test-and-measurement/nanomechanical-test-systems/hysitron-ti-premier-nanoindenter.html',
}

/** Categories: Standalone | In-Situ | Education and Research | Desktop */
export const PRODUCTS = [
  // —— Standalone ——
  p({
    slug: 'ti-980-triboindenter',
    name: 'TI 980 TriboIndenter',
    category: 'Standalone',
    shortDesc: 'High-performance tribology and mechanical testing platform for standalone lab workflows.',
    highlight: 'TriboIndenter',
    lead: 'Quantitative nano- to micro-scale tribology and indentation in a dedicated standalone configuration.',
    badges: ['Tribology', 'Standalone', 'Multi-mode'],
    beatsHeading: 'TI 980',
    beatsTagline: 'Tribology and indentation with the throughput and control expected in flagship R&D labs.',
    externalUrl: BRUKER_URLS.ti980,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),
  p({
    slug: 'ti-premier',
    name: 'TI Premier',
    category: 'Standalone',
    shortDesc: 'Flagship tabletop nanoindenter with SPM imaging, nanotribology, and accelerated property mapping.',
    highlight: 'tabletop nanoindenter',
    lead: 'Sub-nanometre indentation, in-situ SPM, nanotribology, and XPM-style mapping for demanding characterization programs.',
    badges: ['Tabletop', 'SPM imaging', 'Property mapping'],
    beatsHeading: 'TI Premier',
    externalUrl: BRUKER_URLS.tiPremier,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),
  p({
    slug: 'ts-77-select',
    name: 'TS 77 Select',
    category: 'Standalone',
    shortDesc: 'Modular nanoindentation toolkit for quantitative nanoscale-to-microscale mechanical and tribological tests.',
    highlight: 'Select',
    lead: 'Compact, modular platform for everyday nanoindentation, SPM, and mapping workflows.',
    badges: ['Modular', 'Tabletop', 'SPM-ready'],
    beatsHeading: 'TS 77 Select',
    externalUrl: BRUKER_URLS.ts77,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),

  // —— In-Situ ——
  p({
    slug: 'pi-85l-sem-picoindenter',
    name: 'PI 85L SEM PicoIndenter',
    category: 'In-Situ',
    shortDesc: 'In-situ nanomechanical testing inside the SEM with a compact footprint for column integration.',
    highlight: 'SEM PicoIndenter',
    lead: 'Quantitative indentation and related modes under SEM with stable transducers and precise staging.',
    badges: ['SEM In-Situ', 'Compact', 'Quantitative'],
    beatsHeading: 'PI 85L',
    externalUrl: BRUKER_URLS.pi85l,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),
  p({
    slug: 'pi-89-sem-picoindenter',
    name: 'PI 89 SEM PicoIndenter',
    category: 'In-Situ',
    shortDesc: 'Advanced SEM in-situ platform with interchangeable transducers, encoded stages, and flexible sample positioning.',
    highlight: 'SEM PicoIndenter',
    lead: 'See deformation as it happens with quantitative force–depth inside the SEM — from thin films to complex structures.',
    badges: ['SEM In-Situ', 'Encoded stages', '5-DoF options'],
    beatsHeading: 'PI 89',
    externalUrl: BRUKER_URLS.pi89,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
    info: [
      { title: 'Load & displacement', text: 'Multiple transducer options from mN to multi-N loads with µm-scale travel.' },
      { title: 'Positioning', text: 'Rotation, tilt, and encoded XY for site-specific experiments under SEM.' },
      { title: 'Environment', text: 'High-temperature and cryo options where the workflow demands in-situ conditions.' },
      { title: 'Support', text: 'Industron application support for integration and method development.' },
    ],
  }),
  p({
    slug: 'pi-95-tem-picoindenter',
    name: 'PI 95 TEM PicoIndenter',
    category: 'In-Situ',
    shortDesc: 'Quantitative in-situ nanomechanics inside the TEM — indentation, compression, tensile, and fatigue.',
    highlight: 'TEM PicoIndenter',
    lead: 'MEMS-based transducers and specialized holders for atomic-resolution observation with quantitative mechanics.',
    badges: ['TEM In-Situ', 'MEMS', 'Push-to-Pull'],
    beatsHeading: 'PI 95',
    externalUrl: BRUKER_URLS.pi95,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),
  p({
    slug: 'intraspect-360',
    name: 'IntraSpect 360',
    category: 'In-Situ',
    shortDesc: 'In-situ spectroscopy and mechanical correlation for advanced materials characterization workflows.',
    highlight: '360',
    lead: 'Combine in-situ mechanical testing with spectroscopic insight for deeper structure–property understanding.',
    badges: ['In-Situ', 'Spectroscopy', 'Correlation'],
    beatsHeading: 'IntraSpect 360',
    externalUrl: BRUKER_URLS.intraspect360,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),
  p({
    slug: 'ts-75-triboscope',
    name: 'TS 75 TriboScope',
    category: 'In-Situ',
    shortDesc: 'SEM-integrated tribology and mechanical testing for friction, wear, and contact mechanics under observation.',
    highlight: 'TriboScope',
    lead: 'Tribology inside the SEM with quantitative load and displacement for scratch, wear, and indentation-related studies.',
    badges: ['SEM', 'Tribology', 'In-Situ'],
    beatsHeading: 'TS 75',
    externalUrl: BRUKER_URLS.ts75,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),
  p({
    slug: 'biosoft-in-situ-indenter',
    name: 'BioSoft In-Situ Indenter',
    category: 'In-Situ',
    shortDesc: 'Soft matter and biological-sample in-situ indentation for hydrated and delicate materials under SEM.',
    highlight: 'BioSoft',
    lead: 'Mechanical characterization tuned for compliant, hydrated, and biologically relevant samples in controlled environments.',
    badges: ['Bio / soft matter', 'In-Situ', 'Hydrated samples'],
    beatsHeading: 'BioSoft',
    externalUrl: BRUKER_URLS.biosoft,
    cardLogo: BRUKER_CARD_LOGO,
    cardLogoAlt: BRUKER_CARD_LOGO_ALT,
  }),

  // —— Education and Research ——
  p({
    slug: 'muprobe-500',
    name: 'MuProbe 500',
    category: 'Education and Research',
    shortDesc: 'Education and research platform for micro-scale mechanical teaching labs and exploratory R&D.',
    highlight: 'micro-scale platform',
    lead: 'Accessible micro-indentation and related experiments for universities and training facilities — stable, clear, and supported.',
    badges: ['Education', 'Research', 'Micro-scale'],
    beatsHeading: 'MuProbe 500',
    beatsTagline: 'Built for teaching labs and research groups that need dependable micro-mechanical data without industrial complexity.',
  }),
  p({
    slug: 'mesoprobe',
    name: 'MesoProbe',
    category: 'Education and Research',
    shortDesc: 'Meso-scale testing for larger samples, higher loads, and deformation modes beyond classical nanoindentation.',
    highlight: 'meso-scale platform',
    lead: 'Bridge micro and millimetre regimes for beams, films, particles, and engineered components in research and teaching.',
    badges: ['Meso scale', 'Higher loads', 'Research'],
    beatsHeading: 'MesoProbe',
    info: [
      { title: 'Load & travel', text: 'Higher load and displacement range suited to meso-scale samples and components.' },
      { title: 'Architecture', text: 'Rigid frame and fixturing options for bending, compression, and custom studies.' },
      { title: 'Workflows', text: 'Paths to imaging correlation and custom fixturing for advanced coursework and research.' },
      { title: 'Support', text: 'Industron specialists for lab setup and curriculum-aligned guidance.' },
    ],
  }),

  // —— Desktop ——
  p({
    slug: 'ng50',
    name: 'NG50',
    category: 'Desktop',
    shortDesc: 'Compact desktop in-situ optical mechanical system for space-conscious labs.',
    highlight: 'desktop platform',
    lead: 'Optical video microscopy with precise stages and load paths for nano-to-meso deformation tracking on the bench.',
    badges: ['Desktop', 'Optical', 'Compact'],
    beatsHeading: 'NG50',
  }),
  p({
    slug: 'ng80',
    name: 'NG80',
    category: 'Desktop',
    shortDesc: 'In-situ optical mechanical platform integrating microscopy, load cells, and XY stages for deformation studies.',
    highlight: 'optical system',
    lead: 'DIC-friendly workflows with a stiff frame for particle compression, beam bending, creep, fatigue, and fracture studies.',
    badges: ['Desktop', 'DIC', 'Custom workflows'],
    beatsHeading: 'NG80',
    info: [
      { title: 'Stiffness', text: 'High machine stiffness for stable, interpretable mechanical data.' },
      { title: 'Tracking', text: 'Optical and DIC-based deformation tracking options.' },
      { title: 'Experiments', text: 'Compression, bending, creep, fatigue, and toughness-oriented setups.' },
      { title: 'Support', text: 'Configuration and integration support from Industron.' },
    ],
  }),
]

export const PRODUCT_BY_SLUG = Object.fromEntries(PRODUCTS.map((prod) => [prod.slug, prod]))
