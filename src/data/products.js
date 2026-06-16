/* ============================================================
   PRODUCTS — listing + detail pages (/products/:slug)

   framesFolder → public folder for scroll frame sequences
   frameNaming    indexed-png (frame_000000.png) | ezgif (ezgif-frame-001.jpg)
   sourceFrameCount / playbackFrameCount → subsample long exports for web playback
   scrollBeats    → text-only windows; frames always play 1…frameCount linearly
   Card images    → public/Products_Image/ (see `image` on each product)
   ============================================================ */

import { DEFAULT_SCROLL_BEATS } from './scrollBeats'
import { scaleScrollBeats } from '../utils/scrollFrameUrls'

/** Default scroll-sequence folder — placeholder until product-specific assets exist */
const DEFAULT_FRAMES_FOLDER = '/MesoProbe'

/** Shared scroll-sequence defaults (NG50, NG80, μProbe 500 placeholders, …) */
const SCROLL_SEQUENCE = {
  frameCount: 64,
  framesFolder: DEFAULT_FRAMES_FOLDER,
  frameNaming: 'ezgif',
  scrollBeats: DEFAULT_SCROLL_BEATS,
}

/** MesoProbe — 1380× PNG sequence in public/MesoProbe (evenly sampled for playback) */
const MESOPROBE_SCROLL_SEQUENCE = {
  framesFolder: '/MesoProbe',
  frameNaming: 'indexed-png',
  sourceFrameCount: 1380,
  playbackFrameCount: 96,
  frameCount: 96,
  scrollBeats: scaleScrollBeats(DEFAULT_SCROLL_BEATS, 64, 96),
}

/** Product card thumbnails — files in public/Products_Image/ */
const IMG = '/Products_Image'

/** Footer logo on product cards — override per product with `cardLogo` / `cardLogoAlt` */
export const DEFAULT_CARD_LOGO = '/industron-logo.png'

/** Bruker (Hysitron) product line — use on cards that link to bruker.com */
export const BRUKER_CARD_LOGO = '/Bruker-logo.png'
export const BRUKER_CARD_LOGO_ALT = 'Bruker'

/** Product brochure PDF in public/ — used on detail page CTAs */
export const DEFAULT_BROCHURE_URL = '/Ammuu_Latest.pdf'

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
  beats: beatsOverride,
  hero: heroOverride,
  info,
  infoLayout,
  infoSection,
  externalUrl,
  brochureUrl,
  cardLogo,
  cardLogoAlt,
  image,
  frameCount,
  framesFolder: framesFolderOverride,
  frameNaming,
  sourceFrameCount,
  playbackFrameCount,
  scrollBeats: scrollBeatsOverride,
}) {
  const short = beatsHeading || name.split(/[–-]/)[0].trim()
  return {
    slug,
    name,
    category,
    image: image ?? '/industron-logo.png',
    shortDesc,
    exploreTo: `/products/${slug}`,
    hero: heroOverride ?? defaultHero(name, highlight, lead, badges),
    beats: beatsOverride ?? defaultBeats(short, beatsTagline || shortDesc),
    info: info || defaultInfo,
    ...(infoLayout ? { infoLayout } : {}),
    ...(infoSection ? { infoSection } : {}),
    cardLogo: cardLogo ?? DEFAULT_CARD_LOGO,
    cardLogoAlt: cardLogoAlt ?? 'Industron',
    // Only include sequence fields when the product has a scroll animation
    ...(frameCount ? {
      frameCount,
      framesFolder: framesFolderOverride ?? DEFAULT_FRAMES_FOLDER,
      ...(frameNaming ? { frameNaming } : {}),
      ...(sourceFrameCount ? { sourceFrameCount } : {}),
      ...(playbackFrameCount ? { playbackFrameCount } : {}),
      scrollBeats: scrollBeatsOverride ?? DEFAULT_SCROLL_BEATS,
    } : {}),
    ...(externalUrl ? { externalUrl } : {}),
    ...(!externalUrl ? { brochureUrl: brochureUrl ?? DEFAULT_BROCHURE_URL } : {}),
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

/** Categories: Standalone | In-Situ | Education and Research */
export const PRODUCTS = [
  // —— Standalone ——
  p({
    slug: 'ti-980-triboindenter',
    name: 'TI 980 TriboIndenter',
    image: `${IMG}/Hysitron-TI-980-TriboIndenter-300x215.png`,
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
    image: `${IMG}/Hysitron-TI-Premier-247x300.png`,
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
    image: `${IMG}/Hysitron-TS-77-Select-300x261.png`,
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
    image: `${IMG}/Hysitron-PI-85L-SEM-PicoIndenter-300x197.png`,
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
    image: `${IMG}/Hysitron-PI-88-SEM-PicoIndenter-300x190.png`,
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
    image: `${IMG}/PI95-300x268.png`,
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
    image: `${IMG}/Hysitron-IntraSpect-360-197x300.png`,
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
    image: `${IMG}/PI88-268x300.png`,
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
    image: `${IMG}/Hysitron-BioSoft-253x300.png`,
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
    slug: 'uprobe-500',
    name: 'μProbe 500',
    image: `${IMG}/μProbe500.png`,
    ...SCROLL_SEQUENCE,
    category: 'Education and Research',
    shortDesc:
      'Depth-sensing micro-indenter for education and research: hardness and modulus, depth profiling, partial unload, automation, and advanced materials characterization up to 500 mN.',
    highlight: 'education & research micro-indenter',
    lead:
      'The ultimate tool for education and research—automated methods, multi-point mapping, load and displacement control, and a scalable software suite for acquisition and analysis.',
    badges: ['Education', 'Research', '500 mN'],
    beatsHeading: 'μProbe 500',
    hero: defaultHero(
      'μProbe 500',
      'The ultimate tool for education and research',
      'Material hardness and modulus, depth profiling, partial unload testing, structure–property studies, biomechanics, creep, and fracture toughness—with state-of-the-art precision for teaching labs and advanced R&D.',
      ['Education', 'Research', '500 mN'],
    ),
    beats: {
      intro: {
        kicker: 'μProbe 500',
        heading: 'Depth-sensing micro-indentation for labs that teach and discover',
        sub:
          'Measure hardness and modulus, run depth-profiling and partial-unload programmes, and support research in advanced materials, thin films, structure–property correlation, biomechanics, creep, and fracture toughness—all from one depth-sensing micro-indenter platform.',
      },
      engineering: {
        kicker: 'Depth-sensing micro indenter',
        heading: 'Precision mechanics from micro-indentation technology',
        text:
          'The system delivers state-of-the-art precision testing, mechanical property evaluation, and hardness measurement using depth-sensing nanoindentation principles scaled for the micro regime: maximum force capacity 500 mN, maximum displacement 18 µm, reliable micro-level hardness data, sub-nanometre precision, and advanced indentation technology suited to research and education.',
      },
      control: {
        kicker: 'Key features',
        heading: 'Automated methods, control modes, and advanced software',
        text:
          'Automated methods support multi-point testing, microstructural mapping, and hardness and modulus evaluation. Control modes include load control and displacement control. An advanced, scalable, intuitive software suite covers data acquisition and analysis so unattended, grid-based, and inline automation—including multiple automated indents—fits naturally into your workflow.',
      },
      performance: {
        kicker: 'Test modes',
        heading: 'Partial unload, Berkovich & Vickers, Oliver–Pharr',
        text:
          'Partial unload testing runs multiple load–unload cycles at the same location: the probe partially unloads after each segment, reloads to higher force, and continues to maximum load—ideal for hardness vs depth and modulus vs depth. Micro-indentation uses instrumented depth-sensing indentation with Berkovich and Vickers probes under load or displacement control; modulus uses the Oliver–Pharr method with optional optical residual indent measurement.',
      },
      final: {
        kicker: 'Next step',
        heading: 'Configure with Industron.',
        text:
          'μProbe 500 — discuss probes, automation grids, software training, and lab integration with our applications team.',
      },
    },
    infoLayout: 'track',
    infoSection: {
      tag: 'Test modes',
      title: 'Three core',
      highlight: 'measurement routines',
    },
    info: [
      {
        title: 'Partial Unload Test',
        image: '/Uprobe/Partial-Unload-300x182.webp',
      },
      {
        title: 'Micro Indentation',
        image: '/Uprobe/NanoIndetation.png',
      },
      {
        title: 'Method Automation',
        image: '/Uprobe/method-automation-300x225.webp',
      },
    ],
  }),
  p({
    slug: 'mesoprobe',
    name: 'MesoProbe',
    image: `${IMG}/MesoProbe.png`,
    ...MESOPROBE_SCROLL_SEQUENCE,
    category: 'Education and Research',
    shortDesc:
      'Versatile, high-throughput meso-scale mechanical testing with in-situ optical microscopy, DIC, nanometre resolution, large actuation distance, and large force range—up to 600 °C.',
    highlight: 'meso-scale optical & DIC',
    lead:
      'Industron MesoProbe bridges nano/micro testing and conventional bulk instruments: indentation, compression, tensile, bending, fracture, and fatigue—with integrated DIC strain analysis for limited-volume and high-throughput programmes.',
    badges: ['Meso scale', 'DIC', 'High throughput'],
    beatsHeading: 'MesoProbe',
    hero: defaultHero(
      'MesoProbe',
      'Versatile · high throughput · DIC · nanometre precision',
      'Large actuation distance and force range for meso mechanical characterization: in-situ optical microscopy and digital image correlation from tens of microns through millimetre and sub-millimetre multi-grain fields, including high-temperature testing to 600 °C.',
      ['Meso scale', 'DIC', 'High throughput'],
    ),
    beats: {
      intro: {
        kicker: 'Why meso scale?',
        heading: 'Between nano/micro and bulk—where applications live',
        sub:
          'Mechanical testing spans more than a century of techniques across length scales. Nano and micro tests reveal fundamental deformation mechanisms, yet bulk response drives many applications. Scale-dependent properties mean measured values change with sample size; understanding scale-appropriate, bulk-relevant behaviour matters for models and design. Traditional bulk methods struggle when sample volume is limited, throughput is high, materials are nuclear, or conditions are extreme. Industron MesoProbe sits between nano/micro platforms and conventional bulk instruments to meet those needs.',
      },
      engineering: {
        kicker: 'MesoProbe',
        heading: 'High-temperature, in-situ optical meso mechanical testing',
        text:
          'MesoProbe is a high-temperature (up to 600 °C), in-situ optical-based meso mechanical testing instrument for high-throughput mechanical characterization. Supported experiments include cantilever bending creep, indentation, compression, tensile, fracture, and fatigue. The system combines in-situ optical microscopy with digital image correlation (DIC) to study deformation from tens of microns through single-grain scale to millimetre and sub-millimetre multi-grain fields across temperatures. Configurations cover indentation, cantilever bending, DIC-based creep analysis, high-throughput experiments, and integrated DIC strain analysis.',
      },
      control: {
        kicker: 'Applications',
        heading: 'Microindentation, compression, and soft-matrix mechanics',
        text:
          'Microindentation measures localized properties such as micro-hardness and elastic modulus using load–displacement analysis, depth-sensing microindentation, hardness, elastic recovery, and localized deformation—suited to thin coatings, small samples, and heterogeneous materials. Compression addresses soft materials including polymers, hydrogels, and rubber, with very low force sensitivity (µN level) on the soft material matrix.',
      },
      performance: {
        kicker: 'Bending & DIC analysis',
        heading: 'Three-point, cantilever, stress–strain, and creep at scale',
        text:
          'Three-point bending supports the specimen on two spans with load at mid-span for beam bending under load. Cantilever bending fixes one end and loads the free end. DIC plus mechanical analysis computes strain from DIC software and bending stress in Industron software; Young’s modulus follows from stress–strain curves. High-throughput bending creep can yield thousands of creep curves from one experiment—valuable for limited material quantity and nuclear reactor aged-material studies.',
      },
      final: {
        kicker: 'Next step',
        heading: 'Configure with Industron.',
        text:
          'MesoProbe — discuss temperature range, DIC workflows, fixturing, and throughput targets with our applications team.',
      },
    },
    info: [
      {
        title: 'Salient features',
        text:
          'Smaller sample volume requirements; DIC-based strain mapping at hundreds of points; multi-experiment single platform supporting indentation, compression, tensile, bending, and high-temperature testing.',
      },
      {
        title: 'Advantages',
        text:
          'High-throughput data generation with roughly 3–10× reduction in testing time versus many conventional approaches; mechanical characterization from micro to meso scale; nanometre-resolution measurements where the optical chain and DIC allow.',
      },
      {
        title: 'Technical specifications',
        text:
          'Maximum actuation load 20 N; maximum displacement 60 mm; displacement resolution 1 nm; X-axis travel 150 mm; Y-axis travel 50 mm; optics 0.2× with 1× / 5× / 10× optional; camera resolution 4024 × 3036 px.',
      },
      {
        title: 'Support',
        text: 'Industron specialists for lab setup, DIC integration, fixturing, and curriculum- or programme-aligned guidance.',
      },
    ],
  }),

  // —— Education and Research (desktop platforms) ——
  p({
    slug: 'ng50',
    name: 'NG50',
    image: `${IMG}/NG50.png`,
    ...SCROLL_SEQUENCE,
    category: 'Education and Research',
    shortDesc:
      'NanoGuru® turnkey nanomechanical education: instrumentation plus Practicum© curriculum, samples, and experiments for undergraduate nanoscale science and materials.',
    highlight: 'NanoGuru® education system',
    lead:
      'A modern education platform built on proven R&D 100 Award-winning technology—bridging nano and macroscales so students understand how material properties originate at the nanoscale.',
    badges: ['Desktop', 'Education', 'NanoGuru®'],
    beatsHeading: 'NG50',
    hero: defaultHero(
      'NG50',
      'NanoGuru® Nanomechanical Education System',
      'Turnkey instrumentation and a Practicum© based curriculum—samples and experiments designed to involve undergraduate engineering students deeply in nanoscale science and materials.',
      ['Desktop', 'Education', 'NanoGuru®'],
    ),
    beats: {
      intro: {
        kicker: 'Introduction',
        heading: 'NanoGuru® for educators and students',
        sub:
          'The NanoGuru® Nanomechanical Education System is a modern, turnkey system consisting of instrumentation and a Practicum© based curriculum. The curriculum, samples, and experiments are designed to extensively involve undergraduate engineering students in the study of nanoscale science and materials. The NanoGuru® suite gives educators the tools to instruct nanotechnology fundamentals efficiently. Understanding the nanoscale is essential for comprehending how material properties originate. NanoGuru® provides a complete education system based on proven R&D 100 Award-winning technology bridging nano and macroscales.',
      },
      engineering: {
        kicker: 'What is NanoGuru®?',
        heading: 'Nanoindentation, SPM, and nanoscale mechanics',
        text:
          'A scientific tool built on nanoindentation technology for studying mechanical properties of materials at the nanoscale—measured at single or multiple locations as a function of indentation depth. It incorporates in-situ Scanning Probe Microscopy (SPM) for high-resolution 3D surface topography mapping, enables real-time pre- and post-indent analysis, includes built-in vibration isolation for portability and reduced noise, and uses a 24-bit DSP-based controller for data acquisition and control.',
      },
      control: {
        kicker: 'Why NanoGuru®?',
        heading: 'Structure–property correlation at the nanoscale',
        text:
          'NanoGuru® combines nanoindentation with high-resolution in-situ SPM so students can relate structure to properties where it matters most. Material properties are determined by nanoscale structure; understanding that structure helps determine suitable applications. Users learn to analyze nanoscale structural properties to inform better material design.',
      },
      performance: {
        kicker: 'Key features',
        heading: 'Portable, easy to use, and cost-effective',
        text:
          'Portable footprint (12" × 12"), weight 32 kg / 70 lbs. No expert knowledge required—Practicum© based workflow and a quick learning curve with setup in about five minutes. An affordable, cost-effective route to nanoscale material characterization in the teaching lab.',
      },
      final: {
        kicker: 'Next step',
        heading: 'Configure with Industron.',
        text:
          'NG50 / NanoGuru® — our team helps with curriculum alignment, lab setup, training, and ongoing support.',
      },
    },
    info: [
      {
        title: 'Portable',
        text: 'Footprint 12" × 12"; weight 32 kg (70 lbs). Built-in vibration isolation supports portability and lower noise.',
      },
      {
        title: 'Easy to use',
        text: 'No expert knowledge required. Practicum© based workflow guides students and instructors through each experiment.',
      },
      {
        title: 'Quick learning curve',
        text: 'Typical setup in about five minutes so lab time stays focused on learning, not logistics.',
      },
      {
        title: 'Affordable',
        text: 'A cost-effective nanoscale material characterization solution for education budgets.',
      },
    ],
  }),
  p({
    slug: 'ng80',
    name: 'NG80',
    image: `${IMG}/NG80.png`,
    ...SCROLL_SEQUENCE,
    category: 'Education and Research',
    shortDesc:
      'High-throughput nanomechanical test platform: scanning nanoWear, high-speed indentation, nanoScratch, quasistatic nanoindentation, fracture toughness, and in-situ SPM imaging.',
    highlight: 'high-throughput nanomechanics',
    lead:
      'Quantify wear at sub-micron scale, map microstructure hundreds of times faster than conventional indentation, and correlate mechanics with nanometer-resolution topography—all in one instrument workflow.',
    badges: ['Desktop', 'High speed', 'SPM imaging'],
    beatsHeading: 'NG80',
    hero: defaultHero(
      'NG80',
      'A High Throughput Nanomechanical Test Instrument',
      'From scanning nanoWear and nanoScratch to quasistatic indentation, fracture toughness, and in-situ SPM—built for rapid property mapping and statistically meaningful datasets.',
      ['Desktop', 'High speed', 'SPM imaging'],
    ),
    beats: {
      intro: {
        kicker: 'Overview',
        heading: 'NG80 — throughput across nanoscale test modes',
        sub:
          'NG80 is a high-throughput nanomechanical test instrument engineered for laboratories that need quantitative wear, indentation, scratch, fracture, and topography data without long cycle times between techniques.',
      },
      engineering: {
        kicker: 'Scanning nanoWear',
        heading: 'Quantify wear volumes and wear rate at sub-micron scale',
        text:
          'Scanning nanoWear helps quantify wear volumes and wear rate at the sub-micron level together with in-situ SPM imaging. Multiple-pass wear tests can be run at different normal scanning forces on the material under test, so you can relate contact conditions to evolving surface damage.',
      },
      control: {
        kicker: 'High speed indentation',
        heading: 'Microstructural mapping in a fraction of the time',
        text:
          'High-speed indentation runs roughly 300× faster than conventional indentation, enabling microstructural mapping and statistical distributions of mechanical properties in a short time—ideal when you need coverage, not just single indents.',
      },
      performance: {
        kicker: 'nanoScratch & quasistatic indentation',
        heading: 'Tribology, hardness, and modulus in one workflow',
        text:
          'nanoScratch is a versatile mode for tribological characterization of thin films and bulk materials, with quantitative force and displacement in lateral and normal directions—for example bulk coefficient of friction and critical load for thin-film delamination. Quasistatic nanoindentation measures hardness and modulus at nanometer length scales by driving the indenter into the surface while recording depth through load and unload; tests support load-controlled mode and displacement-controlled feedback mode.',
      },
      final: {
        kicker: 'Next step',
        heading: 'Configure with Industron.',
        text:
          'NG80 — share your sample types, mapping resolution targets, and scratch or wear protocols. Our team helps with configuration, method setup, and integration.',
      },
    },
    info: [
      {
        title: 'nanoScratch',
        text:
          'Quantitative lateral and normal force and displacement for bulk coefficient of friction, critical load of thin-film delamination, and broader tribological characterization of films and bulk samples.',
      },
      {
        title: 'Quasistatic nanoindentation',
        text:
          'Localized hardness and modulus at nanometer scales via controlled loading and unloading. Operates in load-controlled mode or displacement-controlled feedback mode.',
      },
      {
        title: 'Fracture toughness',
        text:
          'Assess resistance to crack propagation in brittle bulk materials. Suited to thin-film fracture toughness, small-volume analysis, and reduced substrate-correction complexity versus large-force microindentation.',
      },
      {
        title: 'In-situ SPM imaging',
        text:
          'Nanometer-resolution 3D topographical imaging of the sample surface. Enables site-specific indentation experiments with positioning accuracy of approximately ±10 nm.',
      },
    ],
  }),
]

export const PRODUCT_BY_SLUG = Object.fromEntries(PRODUCTS.map((prod) => [prod.slug, prod]))

// Validate slug uniqueness and required fields at module load (caught during dev/build)
if (import.meta.env.DEV) {
  const seen = new Set()
  for (const prod of PRODUCTS) {
    if (!prod.slug) console.error('[products] Missing slug:', prod.name)
    if (!prod.name) console.error('[products] Missing name on slug:', prod.slug)
    if (seen.has(prod.slug)) console.error('[products] Duplicate slug:', prod.slug)
    seen.add(prod.slug)
  }
}
