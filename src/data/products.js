/* ============================================================
   PRODUCTS — listing + detail pages (/products/:slug)

   framesFolder → public folder for scroll frame sequences
   frameNaming    indexed-png (frame_000000.jpg) | indexed-webp (frame_000000.webp) | frame-seq (frame_001.jpg) | ezgif (ezgif-frame-001.jpg)
   sourceFrameCount / playbackFrameCount → subsample long exports for web playback
   scrollBeats    → text-only windows; frames always play 1…frameCount linearly
   Card images    → public/Products_Image/ (see `image` on each product)
   ============================================================ */

import { DEFAULT_SCROLL_BEATS } from './scrollBeats'
import { scaleScrollBeats } from '../utils/scrollFrameUrls'
import { getBrochureUrl } from './brochures'

/** Default scroll-sequence folder — placeholder until product-specific assets exist */
const DEFAULT_FRAMES_FOLDER = '/MesoProbe'

/** MesoProbe — JPEG sequence in public/MesoProbe (evenly sampled for playback) */
const MESOPROBE_SCROLL_SEQUENCE = {
  framesFolder: '/MesoProbe',
  frameNaming: 'indexed-png',
  sourceFrameCount: 1380,
  playbackFrameCount: 96,
  frameCount: 96,
  scrollBeats: scaleScrollBeats(DEFAULT_SCROLL_BEATS, 64, 96),
}

/** NG80 — frame_000000…001221.webp in public/NG80 */
const NG80_SCROLL_SEQUENCE = {
  framesFolder: '/NG80',
  frameNaming: 'indexed-webp',
  sourceFrameCount: 1222,
  playbackFrameCount: 96,
  frameCount: 96,
  scrollBeats: scaleScrollBeats(DEFAULT_SCROLL_BEATS, 64, 96),
}

/** μProbe 500 — frame_000000…001497.webp in public/Uprobe500
 *  Studio frames use a soft gray floor gradient; lock letterbox to pure white
 *  so left/right bars match the bright backdrop (same clean look as NG80). */
const UPROBE_SCROLL_SEQUENCE = {
  framesFolder: '/Uprobe500',
  frameNaming: 'indexed-webp',
  sourceFrameCount: 1498,
  playbackFrameCount: 96,
  frameCount: 96,
  scrollBeats: scaleScrollBeats(DEFAULT_SCROLL_BEATS, 64, 96),
  frameBackground: '#ffffff',
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
  layout,
  specs,
  metrics,
  features,
  workflow,
  outputs,
  platforms,
  applications,
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
  frameBackground,
}) {
  const short = beatsHeading || name.split(/[–-]/)[0].trim()
  const isCatalog = layout === 'catalog'
  return {
    slug,
    name,
    category,
    image: image ?? '/industron-logo.png',
    shortDesc,
    exploreTo: `/products/${slug}`,
    ...(layout ? { layout } : {}),
    hero: heroOverride ?? defaultHero(name, highlight, lead, badges),
    ...(isCatalog
      ? {}
      : { beats: beatsOverride ?? defaultBeats(short, beatsTagline || shortDesc) }),
    info: info || defaultInfo,
    ...(specs ? { specs } : {}),
    ...(metrics ? { metrics } : {}),
    ...(features ? { features } : {}),
    ...(workflow ? { workflow } : {}),
    ...(outputs ? { outputs } : {}),
    ...(platforms ? { platforms } : {}),
    ...(applications ? { applications } : {}),
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
      ...(frameBackground ? { frameBackground } : {}),
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
    ...UPROBE_SCROLL_SEQUENCE,
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
    metrics: [
      { value: '500', unit: 'mN', label: 'Max load' },
      { value: '18', unit: 'μm', label: 'Max displacement' },
      { value: '24', unit: 'bit', label: 'ADC resolution' },
      { value: '1', unit: 'nm', label: 'Encoder resolution' },
    ],
    specs: [
      { label: 'Indentation load range', value: '0–500 mN' },
      { label: 'Maximum displacement', value: '18 μm' },
      { label: 'ADC resolution', value: '24-bit' },
      { label: 'Frame stiffness', value: '8 × 10⁷ N/m' },
      { label: 'Control & acquisition', value: '600 MHz embedded processor @ 30 kHz' },
      { label: 'Motorized stages', value: 'X 100 mm / Y 50 mm / Z 50 mm' },
      { label: 'Encoder resolution', value: '1 nm' },
      { label: 'Optics', value: '10× to 40×' },
    ],
    applications: [
      'Materials research',
      'Thin films & coatings',
      'Metals & alloys',
      'Polymers & composites',
      'Biomaterials',
      'Semiconductors',
      'Education & training',
    ],
    features: [
      {
        title: 'Micro indentation',
        text: 'Depth-sensing indentation for hardness, elastic modulus, and related mechanical properties.',
      },
      {
        title: 'Method automation',
        text: 'Automated grid indentation with stage control for high-throughput, repeatable mapping.',
      },
      {
        title: 'Partial unload testing',
        text: 'Instrumented partial unload for accurate elastic modulus with reduced indentation effects.',
      },
      {
        title: 'Stable granite platform',
        text: 'Natural granite base, motorized X-Y-Z stage, and digital microscope for precise placement.',
      },
    ],
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
    metrics: [
      { value: '20', unit: 'N', label: 'Max actuation load' },
      { value: '60', unit: 'mm', label: 'Max displacement' },
      { value: '1', unit: 'nm', label: 'Displacement resolution' },
      { value: '600', unit: '°C', label: 'Temperature capability' },
    ],
    specs: [
      { label: 'Maximum actuation load', value: '20 N' },
      { label: 'Maximum displacement', value: '60 mm' },
      { label: 'Displacement resolution', value: '1 nm' },
      { label: 'Camera resolution', value: '4024 × 3036 px' },
      { label: 'Temperature capability', value: 'Up to 600 °C' },
      { label: 'Motorized stages', value: 'X 150 mm / Y 50 mm' },
      { label: 'Optics', value: '0.2× (1× / 5× / 10× optional)' },
      { label: 'Length scale', value: 'Meso scale 10 μm – 5 mm' },
    ],
    applications: [
      'Automotive',
      'Aerospace',
      'Battery materials',
      'Thin films & coatings',
      'Semiconductors & MEMS',
      'Biomaterials',
      'Education & research',
    ],
    features: [
      {
        title: 'Meso-scale bridge',
        text: 'Connects nano and macro testing on small samples with bulk-relevant mechanical insights.',
      },
      {
        title: 'Multi-mode testing',
        text: 'Indentation, compression, tensile, bending, fracture, fatigue, and creep on one platform.',
      },
      {
        title: 'Integrated DIC',
        text: 'Full-field strain mapping with high-resolution optical imaging during mechanical loading.',
      },
      {
        title: 'High-temperature ready',
        text: 'Temperature capability up to 600 °C for demanding materials programmes.',
      },
    ],
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
    ...NG80_SCROLL_SEQUENCE,
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
    metrics: [
      { value: '300×', unit: '', label: 'Faster HSI mapping' },
      { value: '4', unit: '/s', label: 'Indents per second' },
      { value: '1', unit: 'nN', label: 'Force resolution' },
      { value: '10', unit: 'mN', label: 'Max normal force' },
    ],
    specs: [
      { label: 'High-speed indentation', value: 'Up to 4 indents/s (300× faster)' },
      { label: 'Force resolution', value: '1 nN (noise floor < 200 nN)' },
      { label: 'Max normal force', value: '10 mN' },
      { label: 'Displacement resolution', value: '0.006 mm' },
      { label: 'Max normal displacement', value: '5 μm' },
      { label: 'SPM image size', value: '50 μm × 50 μm at 256 × 256' },
      { label: 'Stage travel (X×Y×Z)', value: '100 × 50 × 50 mm' },
      { label: 'Optional high temperature', value: 'Up to 600 °C (as configured)' },
    ],
    applications: [
      'Automotive',
      'Aerospace',
      'Battery materials',
      'Thin films & coatings',
      'Semiconductors & MEMS',
      'Biomaterials',
      'Education & research',
    ],
    features: [
      {
        title: 'Nanoindentation',
        text: 'Hardness and elastic modulus at the nanometer scale for thin films, coatings, and bulk materials.',
      },
      {
        title: 'In-situ SPM imaging',
        text: '3D topography for site-specific indentation (±10 nm) and surface feature analysis.',
      },
      {
        title: 'High-speed indentation',
        text: 'Up to 4 indents per second for rapid property mapping and statistical distributions.',
      },
      {
        title: 'Scanning nanowear',
        text: 'Quantify wear volume, friction maps, and multi-pass wear with in-situ imaging.',
      },
    ],
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

  // —— Accessories (catalog layout — not story/scroll beats) ——
  p({
    slug: 'pneumatic-air-isolation-table',
    name: 'Pneumatic Air Isolation Table',
    image: `${IMG}/Pneumatic-Air-Isolation-Table.png`,
    category: 'Accessories',
    layout: 'catalog',
    shortDesc:
      'Vibration-free granite platform with pneumatic air suspension for metrology, optics, and sensitive instruments.',
    highlight: 'A stable foundation for higher precision',
    lead:
      'Granite tabletop with pneumatic air suspension — isolate floor vibration so inspection, metrology, and optical systems can resolve more.',
    badges: ['Isolate vibrations', 'Enable precision', 'Support performance'],
    hero: defaultHero(
      'Pneumatic Air Isolation Table',
      'A stable foundation for higher precision',
      'Granite tabletop with pneumatic air suspension — isolate floor vibration so inspection, metrology, and optical systems can resolve more.',
      ['Isolate vibrations', 'Enable precision', 'Support performance'],
    ),
    metrics: [
      { value: '600×600', unit: 'mm', label: 'Working surface' },
      { value: '6', unit: 'Hz', label: 'Natural frequency' },
      { value: '40–150', unit: 'kg', label: 'Payload range' },
      { value: '0–4', unit: 'bar', label: 'Air pressure' },
    ],
    specs: [
      { label: 'Table size', value: '600 mm × 600 mm' },
      { label: 'Effective working surface', value: '600 mm × 600 mm' },
      { label: 'Tabletop material', value: 'Granite' },
      { label: 'Payload capacity', value: '40 kg to 150 kg (max 150 kg)' },
      { label: 'Isolation system', value: 'Pneumatic air suspension' },
      { label: 'Natural / resonance frequency', value: '6 Hz' },
      { label: 'Air supply pressure', value: '0 to 4 bar (payload-dependent)' },
    ],
    applications: [
      'Precision inspection',
      'Metrology',
      'Optical systems',
      'Vibration-sensitive instruments',
    ],
    info: [
      {
        title: 'Granite tabletop',
        text: 'High stiffness and dimensional stability for a reliable working surface.',
      },
      {
        title: 'Pneumatic isolation',
        text: 'Natural frequency of 6 Hz with adjustable air pressure from 0 to 4 bar.',
      },
      {
        title: 'Wide payload range',
        text: 'Supports 40 kg to 150 kg for a wide class of precision instruments.',
      },
      {
        title: 'Reliable performance',
        text: 'Built for precision and vibration-sensitive equipment in demanding lab environments.',
      },
    ],
  }),

  p({
    slug: 'ulsi-bench-top-vibration-isolator',
    name: 'μLSI Bench Top Vibration Isolator',
    image: `${IMG}/uLSI-Bench-Top-Vibration-Isolator.png`,
    category: 'Accessories',
    layout: 'catalog',
    shortDesc:
      'Compact benchtop vibration isolator with ≤1 Hz vertical resonance for research and industrial precision equipment.',
    highlight: 'Compact. Stable. Reliable.',
    lead:
      'Stable foundations for precise discoveries — a benchtop isolator with vertical resonance ≤1 Hz and simple front-panel load and stiffness control.',
    badges: ['Low resonance', 'Manual load adjust', 'Benchtop ready'],
    hero: defaultHero(
      'μLSI Bench Top Vibration Isolator',
      'Compact. Stable. Reliable.',
      'Stable foundations for precise discoveries — a benchtop isolator with vertical resonance ≤1 Hz and simple front-panel load and stiffness control.',
      ['Low resonance', 'Manual load adjust', 'Benchtop ready'],
    ),
    metrics: [
      { value: '≤1', unit: 'Hz', label: 'Vertical resonance' },
      { value: '30–50', unit: 'kg', label: 'Payload range' },
      { value: '426', unit: 'mm', label: 'Footprint (W/D)' },
      { value: '~100', unit: 'nN', label: 'Force noise floor' },
    ],
    specs: [
      { label: 'Weight', value: 'Approximately 21 kg' },
      { label: 'Dimensions (W × D × H)', value: '426 mm × 426 mm × 240 mm' },
      { label: 'Payload range', value: '30–50 kg' },
      {
        label: 'Vertical natural frequency',
        value: '1 Hz or less over the entire load range',
      },
      {
        label: 'Horizontal natural frequency',
        value: 'Load dependent; 1 Hz or less at or near upper payload limits',
      },
      { label: 'Force noise floor', value: '~100 nN' },
      { label: 'Load adjustment', value: 'Manual front crank' },
    ],
    applications: [
      'Research & development',
      'Sensitive instrumentation',
      'Metrology equipment',
      'Surface analysis',
      'Microscopy',
    ],
    info: [
      {
        title: 'Low resonance frequency',
        text: 'Vertical resonance ≤1 Hz across the full load range, with a force noise floor around 100 nN.',
      },
      {
        title: 'Manual load adjustment',
        text: 'Front-panel crank for simple, precise payload and vertical-position control.',
      },
      {
        title: 'Compact design',
        text: 'Built for benchtop laboratory use — 426 × 426 × 240 mm footprint.',
      },
      {
        title: 'Stiffness control',
        text: 'Vertical stiffness adjust lets you decrease or increase frequency for your setup.',
      },
    ],
  }),

  // —— Software (workflow / module layout) ——
  p({
    slug: 'dic-software',
    name: 'DIC Software',
    image: `${IMG}/MesoProbe.png`,
    category: 'Software',
    layout: 'software',
    shortDesc:
      'Digital Image Correlation software for full-field strain mapping with optical mechanical testing.',
    highlight: 'Full-field strain mapping for precision mechanics',
    lead:
      'Turn in-situ optical imagery into quantitative mechanics — displacement, strain, modulus, creep, and failure analysis.',
    badges: ['Digital Image Correlation', 'Full-field strain', 'Report-ready'],
    hero: defaultHero(
      'DIC Software',
      'Full-field strain mapping for precision mechanics',
      'Turn in-situ optical imagery into quantitative mechanics — displacement, strain, modulus, creep, and failure analysis.',
      ['Digital Image Correlation', 'Full-field strain', 'Report-ready'],
    ),
    workflow: [
      {
        title: 'Acquire',
        text: 'Capture image sequences during mechanical loading on your optical test platform.',
      },
      {
        title: 'Correlate',
        text: 'Track surface patterns to compute displacement and strain fields across the region of interest.',
      },
      {
        title: 'Analyze',
        text: 'Derive stress–strain response, modulus, creep, and failure metrics from correlated data.',
      },
      {
        title: 'Report',
        text: 'Overlay strain maps on optical imagery and export summary results for papers and QC.',
      },
    ],
    outputs: [
      'Displacement fields',
      'Full-field strain',
      'Stress–strain curves',
      "Young's modulus",
      'Creep metrics',
      'Failure / localisation maps',
    ],
    platforms: [
      {
        name: 'MesoProbe',
        text: 'Optical meso-scale testing with integrated DIC workflows.',
        to: '/products/mesoprobe',
      },
      {
        name: 'Industron imaging setups',
        text: 'Other optical mechanical testing platforms with sequence capture.',
      },
    ],
    applications: [
      'Heterogeneous materials',
      'Limited sample volume',
      'High-temperature optical tests',
      'Strain localisation & crack paths',
    ],
    info: [
      {
        title: 'Full-field strain',
        text: 'Map displacement and strain across the region of interest — not just a single gauge point.',
      },
      {
        title: 'Multi-mode mechanics',
        text: 'Supports bending, tensile, compression, fracture, fatigue, and creep studies.',
      },
      {
        title: 'Visual reporting',
        text: 'Strain-map overlays on optical imagery for clear, shareable results.',
      },
      {
        title: 'Application support',
        text: 'Guidance for patterning, lighting, calibration, and analysis packages.',
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
