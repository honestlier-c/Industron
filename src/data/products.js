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
import { getBrochureUrl } from './brochures'

/** Default scroll-sequence folder — placeholder until product-specific assets exist */
const DEFAULT_FRAMES_FOLDER = '/MesoProbe'

/** Shared scroll-sequence defaults (NG80, μProbe 500 placeholders, …) */
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
    ...(!externalUrl
      ? { brochureUrl: brochureUrl ?? getBrochureUrl(slug) ?? DEFAULT_BROCHURE_URL }
      : {}),
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
      'Precision depth-sensing micro indenter for advanced material characterization — nanometre-scale accuracy, 500 mN load capacity, automated testing & mapping, and powerful analysis software.',
    highlight: 'accurate · reliable · advanced · innovative',
    lead:
      'A research-grade depth-sensing micro indenter designed for accurate measurement of hardness, elastic modulus, and other mechanical properties across a wide range of engineering materials — engineered for accuracy, designed for discovery.',
    badges: ['500 mN', 'Automated', '24-bit ADC'],
    beatsHeading: 'μProbe 500',
    hero: defaultHero(
      'μProbe 500',
      'Precision depth-sensing micro indenter',
      'Accurate nanometre-scale precision. Reliable, robust design. Advanced depth-sensing nanotechnology. Innovative tools empowering research and education.',
      ['Accurate', 'Reliable', 'Advanced', 'Innovative'],
    ),
    beats: {
      intro: {
        kicker: 'Product overview',
        heading: 'Meet μProbe 500 — engineered for accuracy, designed for discovery',
        sub:
          'The μProbe 500 is a research-grade depth-sensing micro indenter for accurate hardness, elastic modulus, and related mechanical properties across engineering materials. Built around a high-precision actuator, digital microscope, motorized X-Y-Z stage, and a natural granite base for high stiffness and low vibration.',
      },
      engineering: {
        kicker: 'Platform',
        heading: 'Actuator, optics, stage, and granite stability',
        text:
          'High-precision actuator for force application and displacement sensing. Digital microscope for high-resolution observation and measurement. Motorized X-Y-Z stage for high-accuracy positioning and repeatability. Natural granite base for high stiffness and low vibration — maximum stability for consistent micro-indentation results.',
      },
      control: {
        kicker: 'Key features & specs',
        heading: '500 mN · 18 μm · 24-bit · automated mapping',
        text:
          'Indentation load range 0–500 mN; maximum displacement 18 μm; ADC resolution 24-bit; frame stiffness 8 × 10⁷ N/m; digital control & data acquisition via 600 MHz embedded processor @ 30 kHz; motorized stages X 100 mm / Y 50 mm / Z 50 mm with 1 nm encoder resolution; optics 10× to 40×. Automated testing & mapping with intelligent high-throughput workflows and powerful analysis software.',
      },
      performance: {
        kicker: 'Measurement capabilities & applications',
        heading: 'Micro indentation, method automation, and partial unload',
        text:
          '01 Micro indentation — depth-sensing indentation for hardness, elastic modulus, and related properties. 02 Method automation — automated grid indentation with stage control for repeatable results. 03 Partial unload testing — instrumented partial unload for accurate elastic modulus and reduced indentation effects. Applications: materials research; thin films & coatings; metals & alloys; polymers & composites; biomaterials & medical devices; semiconductors & microelectronics; advanced coatings; education & training.',
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
      tag: 'Measurement capabilities',
      title: 'Three core',
      highlight: 'testing modes',
    },
    info: [
      {
        title: 'Micro Indentation',
        image: '/Uprobe/NanoIndetation.png',
      },
      {
        title: 'Method Automation',
        image: '/Uprobe/method-automation-300x225.webp',
      },
      {
        title: 'Partial Unload Test',
        image: '/Uprobe/Partial-Unload-300x182.webp',
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
      'The next generation of meso-scale mechanical testing — nanometre precision, integrated DIC, and high throughput on small samples with bulk-relevant insights, up to 600 °C.',
    highlight: 'nanometre precision · integrated DIC · high throughput',
    lead:
      'MesoProbe bridges the gap between nano and macro testing — enabling accurate mechanical characterization on small samples with bulk-relevant insights across indentation, compression, tensile, bending, fracture, fatigue, and creep with full-field DIC strain mapping.',
    badges: ['Nanometre precision', 'Integrated DIC', 'High throughput'],
    beatsHeading: 'MesoProbe',
    hero: defaultHero(
      'MesoProbe',
      'The next generation of meso-scale mechanical testing',
      'Nanometre precision, integrated DIC, and high throughput — the bridging meso-scale range (10 μm – 5 mm) for small samples, multiple test modes, and high-temperature testing up to 600 °C.',
      ['Nanometre precision', 'Integrated DIC', 'High throughput'],
    ),
    beats: {
      intro: {
        kicker: 'Why choose MesoProbe',
        heading: 'The bridging meso-scale range between nano and macro',
        sub:
          'MesoProbe is designed to bridge the gap between nano and macro testing — enabling accurate mechanical characterization on small samples with bulk-relevant insights. Nano scale (1 nm – 10 μm) offers high resolution but limited representation of bulk behaviour. Macro scale (> 5 mm) captures bulk properties but needs large sample volumes and low spatial resolution. Meso scale (10 μm – 5 mm) is the bridging length-scale range: connects micro and macro, small sample volume, high-throughput data, integrated DIC, high-temperature testing, and multiple test modes.',
      },
      engineering: {
        kicker: 'How it works',
        heading: 'Small samples. Big insights.',
        text:
          '01 Small sample — minimal material requirement. 02 Mechanical loading — indentation, compression, tensile, or bending. 03 High-resolution imaging — real-time in-situ optical observation. 04 Digital image correlation — full-field strain mapping with high accuracy. 05 Mechanical properties — stress, strain, modulus, creep, fatigue, and more. MesoProbe supports a wide range of mechanical tests with integrated DIC for full-field strain analysis and high-throughput data generation.',
      },
      control: {
        kicker: 'Experiments',
        heading: 'Indentation, compression, and soft-matrix mechanics',
        text:
          'Indentation (spherical tip): hardness, elastic modulus, load–displacement analysis, and depth-sensing indentation. Compression on a soft material matrix: polymers, hydrogels, rubber, and foams with low force sensitivity (μN level). One platform covers multiple experiments with integrated DIC for full-field strain analysis.',
      },
      performance: {
        kicker: 'Bending & DIC',
        heading: 'Three-point and cantilever bending with full-field strain',
        text:
          'Three-point bending with DIC strain overlay: Young’s modulus, stress & strain mapping, full-field strain from DIC, and fracture & failure analysis. Cantilever bending with DIC overlay: creep & fatigue analysis, strain evolution, high-throughput creep testing — ideal when sample material is limited. Test modes also include tensile, fracture, fatigue, and creep.',
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
        title: 'Industries & research areas',
        text:
          'Automotive; aerospace; battery materials; thin films & coatings; semiconductors & MEMS; biomaterials & medical devices; education & research labs.',
      },
      {
        title: 'Test modes',
        text:
          'Indentation, compression, three-point bending, cantilever bending, tensile, fracture, fatigue, and creep — with integrated digital image correlation (DIC) for full-field strain mapping.',
      },
      {
        title: 'Technical specifications',
        text:
          'Maximum actuation load 20 N; maximum displacement 60 mm; displacement resolution 1 nm; camera resolution 4024 × 3036 px; temperature capability up to 600 °C; motorized stages X-axis 150 mm / Y-axis 50 mm; optics 0.2× (1× / 5× / 10× optional).',
      },
      {
        title: 'Support',
        text: 'Industron specialists for lab setup, DIC integration, fixturing, and programme-aligned guidance.',
      },
    ],
  }),

  // —— Education and Research (desktop platforms) ——
  p({
    slug: 'ng80',
    name: 'NG80',
    image: `${IMG}/NG80.png`,
    ...SCROLL_SEQUENCE,
    category: 'Education and Research',
    shortDesc:
      'High-throughput nanomechanical testing platform — nanoindentation, in-situ SPM imaging, scanning nanowear, and 300× faster high-speed indentation for rapid property mapping and statistics.',
    highlight: '300× faster · SPM · multi-technique',
    lead:
      'NG80 brings multiple advanced technologies into one compact platform for fast, accurate, and repeatable nanomechanical testing — engineered for today, advancing tomorrow.',
    badges: ['High speed', 'SPM imaging', 'Multi-technique'],
    beatsHeading: 'NG80',
    hero: defaultHero(
      'NG80',
      'High throughput nanomechanical testing platform',
      'Nanoindentation for hardness and elastic modulus. SPM imaging for 3D topography and site-specific analysis. High-speed indentation — 300× faster property mapping and statistics.',
      ['Nanoindentation', 'SPM imaging', '300× faster HSI'],
    ),
    beats: {
      intro: {
        kicker: 'Why choose NG80?',
        heading: 'Fast, accurate, and repeatable nanomechanics in one platform',
        sub:
          'NG80 integrates nanoindentation, SPM imaging, scanning nanowear, high-speed indentation (HSI), and optional high-temperature testing (up to 600 °C as configured). Force resolution 1 nN and displacement resolution 0.006 mm deliver research-grade accuracy with superior stability, low noise, and easy-to-use software with automated workflows.',
      },
      engineering: {
        kicker: 'Key technologies',
        heading: 'Nanoindentation and in-situ SPM imaging',
        text:
          'Nanoindentation measures hardness and elastic modulus at the nanometer scale with load and displacement control — ideal for thin films, coatings, and bulk materials. In-situ SPM imaging provides high-resolution 3D topography for site-specific analysis and targeting: site-specific indentation with ±10 nm accuracy, surface roughness and feature analysis, and image sizes up to 50 μm × 50 μm (256 × 256 resolution).',
      },
      control: {
        kicker: 'Scanning nanowear & HSI',
        heading: 'Wear quantification and 300× faster property mapping',
        text:
          'Scanning nanowear quantifies wear behaviour with sub-micron resolution and in-situ imaging: wear volume and wear rate, multiple-pass tests at different normal forces, friction and wear mapping, and real-time wear-track analysis. High-speed indentation runs up to 4 indents per second — 300× faster than conventional indentation — for large-area property mapping and statistical distributions of mechanical properties.',
      },
      performance: {
        kicker: 'Technical specifications',
        heading: 'Force, displacement, stages, and optics',
        text:
          'High-speed indentation: 4 indents/s. SPM image size 50 μm × 50 μm at 256 × 256. Optics: 10× infinity-corrected (20× optional), 1 μm optical resolution, 34 mm working distance, coaxial illumination, 5 MP camera, optional AutoFocus. Positioning: X×Y×Z travel 100 × 50 × 50 mm; XY step 50 nm; Z step 10 nm. Force: noise floor < 200 nN, resolution 1 nN, max normal force 10 mN. Displacement: resolution 0.006 mm, max normal displacement 5 μm. Optional high-temperature stage up to 600 °C (as configured).',
      },
      final: {
        kicker: 'Next step',
        heading: 'Configure with Industron.',
        text:
          'NG80 — share your sample types, mapping targets, wear protocols, and temperature needs. Our team helps with configuration, method setup, and integration.',
      },
    },
    info: [
      {
        title: 'Ideal for',
        text:
          'Automotive; aerospace; battery materials; thin films & coatings; semiconductors & MEMS; biomaterials & medical devices; education & research labs.',
      },
      {
        title: 'High-speed indentation',
        text:
          'Up to 4 indents per second — 300× faster than conventional indentation for rapid microstructural mapping and statistical analysis.',
      },
      {
        title: 'In-situ SPM imaging',
        text:
          '3D topography with nanometer resolution; site-specific indentation ±10 nm; image size up to 50 μm × 50 μm at 256 × 256.',
      },
      {
        title: 'Platform highlights',
        text:
          'Research-grade performance; multi-technique platform (nanoindentation, SPM, scanning nanowear, HSI, optional high-T); intuitive automated software; built for durability with global support.',
      },
    ],
  }),

  // —— Accessories ——
  p({
    slug: 'pneumatic-air-isolation-table',
    name: 'Pneumatic Air Isolation Table',
    image: `${IMG}/Minus K Scale System.png`,
    category: 'Accessories',
    shortDesc:
      'Vibration-free granite platform with pneumatic air suspension — isolate vibrations, enable precision, and support performance for metrology, optics, and sensitive instruments.',
    highlight: 'stable · precise · reliable',
    lead:
      'A stable foundation for higher precision. The Pneumatic Air Isolation Table provides a vibration-free platform for precision inspection, metrology, optical systems, and other vibration-sensitive applications.',
    badges: ['Granite', 'Pneumatic', '40–150 kg'],
    beatsHeading: 'Pneumatic Air Isolation Table',
    hero: defaultHero(
      'Pneumatic Air Isolation Table',
      'A stable foundation for higher precision',
      'Isolate vibrations. Enable precision. Support performance. Precision granite tabletop with pneumatic air suspension for excellent stability and repeatable results — even in challenging environments.',
      ['Stable', 'Precise', 'Reliable'],
    ),
    beats: {
      intro: {
        kicker: 'Why isolation matters',
        heading: 'Precision starts with stability',
        sub:
          'Floor vibration and building noise limit what sensitive instruments can resolve. The Pneumatic Air Isolation Table isolates those disturbances so inspection, metrology, and optical systems can deliver trustworthy data.',
      },
      engineering: {
        kicker: 'Key features',
        heading: 'Granite stiffness with pneumatic isolation',
        text:
          'High-stiffness granite tabletop for dimensional stability. Pneumatic air suspension with a natural frequency of 6 Hz. Adjustable air pressure from 0 to 4 bar depending on payload. Wide payload range from 40 kg to 150 kg (maximum 150 kg). Built for precision and vibration-sensitive equipment.',
      },
      control: {
        kicker: 'Specifications',
        heading: '600 × 600 mm working surface',
        text:
          'Table size 600 mm × 600 mm; effective working surface 600 mm × 600 mm; tabletop material granite; payload capacity 40–150 kg (max 150 kg); isolation system pneumatic air suspension; natural / resonance frequency 6 Hz; air supply pressure range 0–4 bar (payload-dependent).',
      },
      performance: {
        kicker: 'Applications',
        heading: 'Built for vibration-sensitive workflows',
        text:
          'Ideal for precision inspection, metrology, optical systems, and other vibration-sensitive equipment where a quiet, stable foundation improves measurement quality and instrument uptime.',
      },
      final: {
        kicker: 'Next step',
        heading: 'Configure with Industron.',
        text:
          'Pneumatic Air Isolation Table — share your instrument footprint, payload, and lab vibration environment. Our team helps size air supply and setup.',
      },
    },
    info: [
      {
        title: 'Granite tabletop',
        text: 'High stiffness and dimensional stability for a reliable working surface.',
      },
      {
        title: 'Pneumatic isolation',
        text: 'Natural / resonance frequency of 6 Hz with adjustable air pressure 0–4 bar.',
      },
      {
        title: 'Payload range',
        text: 'Supports 40 kg to 150 kg (maximum 150 kg) for a wide class of instruments.',
      },
      {
        title: 'Technical specifications',
        text:
          'Table / working surface 600 × 600 mm; granite top; pneumatic air suspension; 6 Hz natural frequency; air 0–4 bar; applications in inspection, metrology, optics, and vibration-sensitive systems.',
      },
    ],
  }),

  // —— Software ——
  p({
    slug: 'dic-software',
    name: 'DIC Software',
    image: `${IMG}/MesoProbe.png`,
    category: 'Software',
    shortDesc:
      'Digital Image Correlation software for full-field strain mapping — pair optical imaging with mechanical testing for stress, strain, modulus, creep, and failure analysis.',
    highlight: 'full-field strain · DIC',
    lead:
      'Turn in-situ optical imagery into quantitative mechanics. Industron DIC software delivers accurate full-field strain mapping for bending, tensile, compression, and creep workflows.',
    badges: ['Full-field strain', 'DIC', 'Analysis'],
    beatsHeading: 'DIC Software',
    hero: defaultHero(
      'DIC Software',
      'Full-field strain mapping for precision mechanics',
      'Digital Image Correlation correlates sequential images to measure displacement and strain across the sample surface — ideal with MesoProbe and other optical mechanical testing platforms.',
      ['Strain mapping', 'Modulus', 'Creep & failure'],
    ),
    beats: {
      intro: {
        kicker: 'What is DIC?',
        heading: 'See deformation as it happens — then quantify it',
        sub:
          'Digital Image Correlation tracks surface patterns through high-resolution imaging to compute displacement and strain fields. Combined with load data, it yields stress–strain response, modulus, and time-dependent behaviour.',
      },
      engineering: {
        kicker: 'Capabilities',
        heading: 'From image sequences to mechanical insight',
        text:
          'Full-field strain and displacement mapping. Stress–strain curves and Young’s modulus from DIC-based analysis. Support for bending, tensile, compression, fracture, fatigue, and creep studies. Overlay strain maps on optical imagery for clear reporting.',
      },
      control: {
        kicker: 'Workflow',
        heading: 'Built for lab and research throughput',
        text:
          'Acquire images during mechanical loading, run DIC correlation, export strain fields and summary metrics. Designed to work with Industron optical meso-scale testing platforms such as MesoProbe for high-accuracy, high-throughput programmes.',
      },
      performance: {
        kicker: 'Best for',
        heading: 'When point sensors are not enough',
        text:
          'Heterogeneous materials, limited sample volumes, high-temperature optical tests, and any experiment where strain localisation, crack paths, or full-field maps matter more than a single gauge reading.',
      },
      final: {
        kicker: 'Next step',
        heading: 'Configure with Industron.',
        text:
          'DIC Software — discuss camera setup, sample patterning, and analysis packages with our applications team.',
      },
    },
    info: [
      {
        title: 'Full-field strain',
        text: 'Map displacement and strain across the region of interest, not just at a single point.',
      },
      {
        title: 'Mechanical outputs',
        text: 'Stress, strain, modulus, creep, and failure metrics derived from correlated image sequences.',
      },
      {
        title: 'Platform fit',
        text: 'Pairs naturally with MesoProbe optical meso-scale testing and other Industron imaging workflows.',
      },
      {
        title: 'Support',
        text: 'Application guidance for patterning, lighting, calibration, and report-ready analysis.',
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
