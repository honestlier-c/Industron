/**
 * Rich knowledge helpers for Industron AI (RAG context + FAQ).
 */

import { PRODUCTS } from './products'
import { getApplicationNotes } from './applicationNotes'
import { retrieveRelevantFaq, buildFaqQuestionList } from './technicalFaq'

/**
 * Curated, source-grounded key facts per product. Every value is drawn from
 * the product's own page content (specs, test modes, positioning) — nothing
 * invented — so the assistant can answer spec/application questions precisely.
 */
export const PRODUCT_FACTS = {
  mesoprobe: {
    specs:
      'Max actuation load 20 N · max displacement 60 mm · displacement resolution 1 nm · camera 4024×3036 px · temperature up to 600 °C · motorized stages X 150 mm / Y 50 mm · optics 0.2× (1×/5×/10× optional). Meso scale: 10 μm – 5 mm (nano: 1 nm – 10 μm; macro: > 5 mm).',
    tests:
      'Indentation (spherical tip — hardness, elastic modulus, load–displacement, depth sensing); compression (polymers, hydrogels, rubber, foams — μN-level force); three-point & cantilever bending with DIC strain overlay; tensile; fracture; fatigue; creep. Integrated DIC for full-field strain mapping.',
    strengths:
      'Next-generation meso-scale testing: nanometre precision, integrated DIC, high throughput. Bridges nano–macro gap so small samples yield bulk-relevant insights. Workflow: small sample → mechanical loading → in-situ optical imaging → DIC → stress/strain/modulus/creep/fatigue.',
    bestFor:
      'Automotive, aerospace, battery materials, thin films & coatings, semiconductors & MEMS, biomaterials & medical devices, and education & research labs — especially limited sample volume, high-temperature (to 600 °C), and DIC workflows.',
  },
  'uprobe-500': {
    specs:
      'Indentation load 0–500 mN · max displacement 18 μm · ADC 24-bit · frame stiffness 8 × 10⁷ N/m · control 600 MHz embedded processor @ 30 kHz · motorized stages X 100 mm / Y 50 mm / Z 50 mm (1 nm encoder) · optics 10×–40×.',
    tests:
      'Micro indentation (hardness, elastic modulus, depth sensing); method automation (automated grid indentation with stage control); partial unload testing for accurate modulus and reduced indentation effects.',
    strengths:
      'Research-grade depth-sensing micro indenter: nanometre-scale precision; high-precision actuator + digital microscope + XYZ stage on a natural granite base (high stiffness, low vibration); automated high-throughput testing and powerful analysis software.',
    bestFor:
      'Materials research, thin films & coatings, metals & alloys, polymers & composites, biomaterials & medical devices, semiconductors & microelectronics, advanced coatings, and education & training.',
  },
  ng80: {
    specs:
      'HSI up to 4 indents/s (300× faster than conventional). Force: noise floor < 200 nN, resolution 1 nN, max 10 mN. Displacement resolution 0.006 mm, max 5 μm. Stages 100 × 50 × 50 mm (XY step 50 nm, Z step 10 nm). SPM image 50 μm × 50 μm @ 256 × 256; site-specific ±10 nm. Optics 10× (20× optional), 1 μm resolution, 34 mm WD, coaxial illumination, 5 MP camera. Optional high-T stage to 600 °C (as configured).',
    tests:
      'Nanoindentation (hardness & elastic modulus, load/displacement control); in-situ SPM imaging (3D topography, site-specific); scanning nanowear (wear volume/rate, multi-pass, friction & wear mapping); high-speed indentation for rapid property mapping and statistics.',
    strengths:
      'Multi-technique compact platform: 300× faster HSI, research-grade nanometre precision, reliable low-noise stability, optional high temperature, and intuitive automated software.',
    bestFor:
      'Automotive, aerospace, battery materials, thin films & coatings, semiconductors & MEMS, biomaterials & medical devices, and education & research labs.',
  },
  'pneumatic-air-isolation-table': {
    specs:
      'Table / working surface 600 × 600 mm · granite tabletop · payload 40–150 kg (max 150 kg) · pneumatic air suspension · natural frequency 6 Hz · air supply 0–4 bar (payload-dependent).',
    tests:
      'Passive vibration isolation platform for instruments — not a mechanical test mode; supports precision inspection, metrology, and optical systems.',
    strengths:
      'Stable foundation for higher precision: high-stiffness granite, pneumatic isolation at 6 Hz, adjustable air pressure, wide payload range, reliable performance in challenging environments.',
    bestFor:
      'Precision inspection, metrology, optical systems, and other vibration-sensitive equipment.',
  },
  'dic-software': {
    specs:
      'Digital Image Correlation software for full-field displacement and strain mapping from optical image sequences; exports stress–strain, modulus, and time-dependent metrics when paired with load data.',
    tests:
      'Full-field strain mapping for bending, tensile, compression, fracture, fatigue, and creep — with strain overlays on optical imagery.',
    strengths:
      'Quantifies deformation where point gauges fall short; designed to work with MesoProbe optical meso-scale testing and related Industron imaging workflows.',
    bestFor:
      'Heterogeneous materials, limited sample volumes, high-temperature optical tests, and localisation / crack-path studies.',
  },
}

/** Render a product's curated facts as a compact, chat-friendly block. */
export function buildProductFacts(slug) {
  const f = PRODUCT_FACTS[slug]
  if (!f) return ''
  const lines = []
  if (f.specs) lines.push(`**Key specs:** ${f.specs}`)
  if (f.tests) lines.push(`**Test types:** ${f.tests}`)
  if (f.strengths) lines.push(`**Strengths:** ${f.strengths}`)
  if (f.bestFor) lines.push(`**Best for:** ${f.bestFor}`)
  return lines.join('\n')
}

export function getProductKnowledge() {
  return PRODUCTS.map((p) => {
    const beatBits = p.beats
      ? Object.values(p.beats)
          .map((b) => [b.kicker, b.heading, b.sub, b.text].filter(Boolean).join(' '))
          .join(' ')
      : ''
    const infoBits = (p.info || [])
      .map((i) => [i.title, i.text].filter(Boolean).join(': '))
      .join(' | ')
    const facts = buildProductFacts(p.slug)

    return {
      slug: p.slug,
      name: p.name,
      category: p.category,
      shortDesc: p.shortDesc,
      highlight: p.hero?.highlight,
      lead: p.hero?.lead,
      badges: p.hero?.badges ?? [],
      path: `/products/${p.slug}`,
      external: Boolean(p.externalUrl),
      externalUrl: p.externalUrl || null,
      facts,
      detail: [beatBits, infoBits].filter(Boolean).join('\n'),
      keywords: buildKeywords(p, beatBits, infoBits, facts),
    }
  })
}

function buildKeywords(p, beatBits, infoBits, facts = '') {
  const base = [
    p.name,
    p.slug,
    p.category,
    p.shortDesc,
    p.hero?.highlight,
    p.hero?.lead,
    ...(p.hero?.badges ?? []),
    beatBits,
    infoBits,
    facts,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const extras = []
  if (/mesoprobe/i.test(p.name)) extras.push('meso dic high-temperature 600 bending creep fatigue tensile spherical indentation compression hydrogel automotive aerospace battery mems biomaterials')
  if (/μprobe|uprobe|micro/i.test(p.name + p.slug)) extras.push('microindentation hardness modulus education 500mn 24-bit granite automation partial unload thin film coating semiconductor biomaterial')
  if (/ng80|nanoguru/i.test(p.name + p.slug)) extras.push('nanoguru desktop education spm nanoindentation topography nanowear hsi high-speed 300x high-temperature')
  if (/pneumatic|isolation|granite/i.test(p.name + p.slug)) extras.push('vibration isolation pneumatic air table granite metrology optical payload 150kg 6hz')
  if (/dic|software/i.test(p.name + p.slug)) extras.push('digital image correlation strain mapping full-field modulus creep bending')
  if (/sem|picoindenter|pi /i.test(p.name)) extras.push('sem in-situ picoindenter electron microscope')
  if (/tem/i.test(p.name)) extras.push('tem transmission electron microscope')
  if (/tribo/i.test(p.name)) extras.push('tribology friction wear scratch coefficient')
  if (/biosoft/i.test(p.name)) extras.push('soft-matter biological hydrated cells tissue')

  // General domain synonyms so everyday phrasing still matches the right product.
  const syn = []
  if (/modulus|elastic/.test(base)) syn.push("young's modulus elastic modulus stiffness elasticity")
  if (/hardness/.test(base)) syn.push('microhardness nanohardness')
  if (/creep/.test(base)) syn.push('time-dependent viscoelastic relaxation')
  if (/fracture/.test(base)) syn.push('crack toughness brittle cracking')
  if (/scratch|wear|tribo/.test(base)) syn.push('friction abrasion delamination adhesion')
  if (/high.?temp|600|thermal/.test(base)) syn.push('high temperature heat elevated thermal')
  if (/thin.?film|coating/.test(base)) syn.push('thin film coating substrate')

  return `${base} ${extras.join(' ')} ${syn.join(' ')}`
}

export const COMPANY_FACTS = {
  name: 'Industron Technical Services Pvt. Ltd.',
  founded: '2011',
  locations: 'Thiruvananthapuram (India) and Edina, Minnesota (USA)',
  focus:
    'Scientific instrumentation, nanomechanics, precision engineering, and embedded systems for academia and industry.',
  specialties: [
    'Nano-, micro-, and meso-scale mechanical characterization',
    'R&D consultancy and smart product engineering',
    'Nanomechanics Research Lab (NRL) testing services',
    'Training programs and instrument service agreements',
  ],
  flagship: ['MesoProbe', 'μProbe 500', 'NG80', 'Pneumatic Air Isolation Table', 'DIC Software'],
  founder: {
    name: 'Dr. Syed Asif S A',
    role: 'Managing Director & Founder',
    email: 'asif@industronnano.com',
  },
  team: [
    {
      name: 'Dr. Syed Asif S A',
      role: 'Managing Director & Founder',
      email: 'asif@industronnano.com',
    },
    {
      name: 'Pratyank Rastogi',
      role: 'Manager · Sales & Service',
      email: 'pratyank@industronnano.com',
      phone: '+91 9048542221',
    },
    {
      name: 'Kiran Raphael',
      role: 'Application Engineer (material testing)',
      email: 'kp@industronnano.com',
      phone: '+91 9447311243',
    },
  ],
  contact: {
    email: 'info@industronnano.com',
    india: '+91 471 278 6500',
    usa: '+1 952 221 6227',
    sales: 'sales@industronnano.com',
    testing: 'testing@industronnano.com',
    path: '/contact',
  },
}

/**
 * Website page copy used as the ONLY knowledge source for chat answers.
 * Mirrors every page on the site: Home, About, Leadership, History,
 * Services, Applications, Techniques, Contact, Customers, Products.
 */
export const WEBSITE_PAGES = {
  home: {
    path: '/',
    title: 'Home',
    text: [
      'Industron provides high-performance nanomechanical testing instruments for research and industry — nanoindentation, in-situ SEM/TEM, tribology, and meso-scale testing for global R&D and industry.',
      'Homepage stats: founded 2011; 40+ global installations; 13+ IIT & IISc collaborations; 30+ years of R&D expertise.',
      'Flagship / featured products: MesoProbe — next-generation meso-scale mechanical testing (10 μm – 5 mm) with nanometre precision, integrated DIC, and high throughput; indentation, compression, tensile, bending, fracture, fatigue, and creep up to 600 °C. μProbe 500 — precision depth-sensing micro indenter (0–500 mN, 18 μm, 24-bit ADC) with automated grid mapping, partial unload, and optics 10×–40×. NG80 — high-throughput nanomechanical platform (nanoindentation, SPM, scanning nanowear, HSI at 4 indents/s / 300× faster; optional high-T to 600 °C).',
      'Explore the full portfolio at /products.',
    ].join(' '),
  },
  about: {
    path: '/about',
    title: 'About — Who We Are',
    text: [
      'Founded in 2011, Industron Technical Services Pvt. Ltd. is a global R&D-driven company specializing in scientific instrumentation, nanomechanics, precision engineering, and embedded systems development.',
      'With locations in Thiruvananthapuram, India and Edina, USA, our team of scientists and engineers works at the intersection of materials science, instrumentation, electronics, and software engineering to develop advanced research solutions for academia and industry worldwide.',
      'We collaborate with premier institutions including IISc and IITs. Flagship technology NanoGuru® / NG80 is a high-precision desktop nanomechanical testing platform for nanoscale materials characterization.',
      'Milestones: Founded 2011; 40+ installations; global research network; worldwide customer footprint.',
      'What we do: R&D Consultancy — structure–property correlation, failure analysis, and advanced materials research; Nanomechanics Testing — micro and nanoscale mechanical characterization with high precision; Scientific Instrument Development — embedded systems, analytical instruments, sensors, and precision engineering; Nanoyantrika Workshop — a knowledge-sharing platform connecting researchers and industry experts.',
      'Core competencies: Precision Instrument Design (integration of electronics, mechanics, sensors, and embedded control systems); Materials Research & Nanomechanics; In-situ & Operando Technologies (inside TEM, SEM, and Raman); Innovation-Driven Engineering; Customer-Centric Collaboration.',
      'Tagline: Engineering precision for scientific discovery — combining science, engineering, and innovation to build next-generation research technologies.',
    ].join(' '),
  },
  leadership: {
    path: '/about',
    title: 'Leadership & Team',
    text: [
      `Founder & Managing Director: ${COMPANY_FACTS.founder.name} (${COMPANY_FACTS.founder.role}).`,
      'He has 30+ years of experience designing and developing nanomechanical testing instruments; a PhD in Material Science from Oxford University; and MSc and BSc from IISc Bangalore. He previously served as Director of R&D at Bruker Nano Surfaces and Hysitron.',
      'He is a pioneer of in-situ nanomechanics inside TEM/SEM/Raman microscopes, with 22 active patents and 120+ publications, multiple R&D 100 Awards and Microscopy Today Innovation Awards, and was instrumental in SBIR funding and the National Tibbetts Award for Hysitron. He led development of NanoGuru®. He is a member of MRS, ACerS, and TMS.',
      `For strategic feedback or collaborations you can write directly to the founder at ${COMPANY_FACTS.founder.email}.`,
      'Team: Pratyank Rastogi — Manager, Sales & Service (pratyank@industronnano.com, +91 9048542221). Kiran Raphael — Application Engineer for advanced material testing / NRL (kp@industronnano.com, +91 9447311243).',
    ].join(' '),
  },
  history: {
    path: '/',
    title: 'Research & Development / Company History',
    text: [
      'Industron established its R&D center in 2011 to design and develop advanced nanomechanical testing systems, innovating nano-, micro-, and meso-scale mechanical characterization technologies for global academic and industrial applications.',
      'Following the acquisition of Hysitron by Bruker Corporation in 2017, R&D operations continued under Industron Technical Services as a key engineering and technology development partner. Industron has since contributed to multiple state-of-the-art nanomechanical testing platforms through in-house innovation, collaborative research, and global technical consultancy.',
      'Instruments & anti-vibration tables: Industron developed the world’s first affordable depth-sensing indentation system for micro- to meso-scale testing, plus educational and training systems for labs. It also offers Bruker Hysitron systems including TI 990, TI 980, and TI Premier II, and is developing anti-vibration tables and surface-characterization accessories.',
      'Advanced material testing: Industron established the Nanomechanics Research Lab (NRL) supporting academic and industrial research, equipped with advanced nanoindentation technologies and an experienced applications team providing worldwide technical support.',
    ].join(' '),
  },
  services: {
    path: '/services',
    title: 'Services',
    text: [
      'Industron Technical Services delivers testing, consultancy, training, and long-term technical support for global research and industrial needs.',
      'NRL – Advanced Material Testing: the Nanomechanics Research Laboratory (NRL) supports academia and industry with high-precision micro and nanoscale materials testing. Capabilities: nanomechanical characterization, structure–property analysis, failure analysis, in-situ / operando testing, and customized experimental design. The facility is available for collaborative and chargeable testing services — enquire via /testing-form.',
      'R&D Consultancy: Smart Product Engineering — end-to-end product development integrating mechanical, electrical, and software systems (precision mechanical design, CAD & FEA analysis, mechatronics, sensors & actuators, embedded hardware & software). Material Development & Testing — support for advanced materials, coatings, and process evaluation (mechanical strength & hardness, elastic and viscoelastic properties, fracture toughness & creep, heat treatment studies, structure–property correlation).',
      'Training Programs: specialized training in nanomechanics and materials characterization led by experienced R&D experts — industry & academic programs, hands-on practical training, real-world application focus.',
      'Service Agreements: comprehensive support for system reliability and uptime — preventive maintenance, reduced downtime, fast service response, structured support workflows.',
      'Technical Support Center: dedicated expert support for instrument operation, troubleshooting, and data analysis — technical assistance, system guidance, data analysis support, and continuous product improvement assistance.',
    ].join(' '),
  },
  applications: {
    path: '/applications',
    title: 'Applications by industry',
    text: [
      'Nanomechanical testing applications span many industries as materials become nanostructured and components, thin films, and coatings shrink.',
      'Steel: nanoindentation & tribology, property mapping, SPM — wear of thin hard coatings, correlative microscopy and XPM, local work hardening, ODS steel up to 700 °C, DP980 hardness mapping, duplex stainless steel with EBSD and PI 88.',
      'Foundry, Metal Forming & Joining: targeted nanoindentation of high entropy alloys in SEM; laser beam welding characterization.',
      'Pharmaceutical: mechanical properties of molecular crystals, property mapping, indentation-induced structural changes with Raman spectroscopy.',
      'Automotive & Aerospace: nanoindentation & nanotribology, high-temperature property mapping, creep testing, SPM — nickel-based superalloys, tire materials in harsh environments, superalloy bond coat creep, in-situ high-temperature studies.',
      'Food & Beverages: adhesion strength of thin coatings, corrosion-resistant coating characterization, wear testing.',
      'Surface Protection & Paint Coatings: adhesion strength, depth-dependent property measurement, thin films as low as 1 nm, polymer thin film characterization, tape test vs nanoindentation.',
      'Biomaterials: nanoindentation & tribology, viscoelastic measurement, DMA — contact lenses, hydrogels, biological tissues, living cells, aortic valve tissue, marine teeth, cartilage.',
      'Polymer & Plastic: DMA, time/frequency-dependent behavior, glass transition analysis, PMMA time-dependent deformation, tire materials, high-throughput screening.',
    ].join(' '),
  },
  faq: {
    path: '/applications',
    title: 'Technical FAQ (nanoindentation know-how)',
    text:
      'Industron answers common nanoindentation and instrumentation questions, including: ' +
      buildFaqQuestionList().replace(/\n/g, ' '),
  },
  application_notes: {
    path: '/applications',
    title: 'Application notes (downloadable PDFs)',
    text:
      'Industron publishes application-note PDFs on /applications (steel, coatings, biomaterials, polymers, aerospace, and more). ' +
      'Do NOT list every note. Answer in a few crisp lines; at most one or two PDF links if the user named a topic. Otherwise point to /applications.',
  },
  techniques: {
    path: '/applications',
    title: 'Testing techniques',
    text: [
      'Nanoindentation: measures hardness and modulus at the nanoscale by applying force and measuring indentation depth.',
      'Scanning Probe Microscopy (SPM): nanometer-resolution 3D surface imaging via raster scanning; enables site-specific testing (~±10 nm accuracy).',
      'NanoScratch: measures scratch resistance, adhesion, friction, and coating behavior using force–displacement monitoring.',
      'Scanning Wear: evaluates wear rate and volume at sub-microstructural levels with in-situ imaging.',
      'High Temperature Testing: material characterization up to 800 °C.',
      'Creep Testing: measures time-dependent deformation under load, including at elevated temperatures.',
      'Modulus Mapping: DMA-based mapping of stiffness, modulus, and viscoelastic properties across surfaces.',
      'Dynamic Mechanical Analysis (DMA): applies sinusoidal forces to study time-dependent mechanical behavior of viscoelastic materials.',
      'Accelerated Property Mapping (XPM): rapid large-scale mapping with multiple indentations per second.',
    ].join(' '),
  },
  products_overview: {
    path: '/products',
    title: 'Product portfolio',
    text: [
      'Standalone: TI 980 TriboIndenter, TI Premier, TS 77 Select.',
      'In-Situ (SEM/TEM): PI 85L SEM PicoIndenter, PI 89 SEM PicoIndenter, PI 95 TEM PicoIndenter, IntraSpect 360, TS 75 TriboScope, BioSoft In-Situ Indenter.',
      'Education & Research: μProbe 500 (precision depth-sensing micro indenter, 0–500 mN, 18 μm, 24-bit ADC, automated mapping, optics 10×–40×), MesoProbe (next-gen meso-scale 10 μm–5 mm, nanometre precision + integrated DIC + high throughput, up to 600 °C), NG80 (high-throughput nanoindentation + SPM + scanning nanowear + HSI 4 indents/s / 300× faster; optional high-T to 600 °C). Accessories: Pneumatic Air Isolation Table (600×600 mm granite, 40–150 kg, 6 Hz pneumatic isolation). Software: DIC Software (full-field strain mapping).',
      'Bruker Hysitron systems are offered alongside Industron’s own instruments. Product pages live at /products/<name>; request literature via /brochure-form.',
    ].join(' '),
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    text: [
      `Founder & Managing Director: ${COMPANY_FACTS.founder.name} (${COMPANY_FACTS.founder.role}) — email ${COMPANY_FACTS.founder.email} for strategic feedback or collaborations.`,
      'Technical support & product expert: Pratyank Rastogi, Manager · Sales & Service — pratyank@industronnano.com, +91 9048542221.',
      'Advanced material testing: Kiran Raphael, Application Engineer — kp@industronnano.com, +91 9447311243, or use the /testing-form.',
      `General contact: ${COMPANY_FACTS.contact.email}. India office: ${COMPANY_FACTS.contact.india}. USA office: ${COMPANY_FACTS.contact.usa}. Response within 1 business day.`,
      'Enquiry routing: Brochure requests → sales@industronnano.com via /brochure-form (sales reviews, then emails the PDF). Material testing (NRL) → testing@industronnano.com (or /testing-form). General enquiries → enquiries@industronnano.com. Sales & procurement → sales@industronnano.com.',
      'Offices — India (Technopark): Industron Nanotechnology Pvt Ltd, Unit #401, Fourth Floor, Thejaswini Building, Technopark, Thiruvananthapuram, Kerala – 695581. India (Kinfra): Industron Technical Services Pvt Ltd, Plot No 45(B), Kinfra Industrial Park, Meenamkulam, St. Xavier’s College, Thiruvananthapuram, Kerala – 695586. USA: Industron Technical Services Inc, Suite 132, 4445 West 77th Street, Edina, MN 55435.',
    ].join(' '),
  },
  customers: {
    path: '/',
    title: 'Customers & collaborators',
    text: [
      'With 40+ installations across top universities, national laboratories, and industry partners, Industron supports mission-critical nanomechanical testing programs worldwide, accelerating breakthroughs in materials science, biomedical engineering, aerospace, and semiconductors.',
      'Institutions & partners include: IISc Bangalore; IIT Bombay, Madras, Kanpur, Roorkee, Kharagpur, Hyderabad, Mandi, Indore, Ropar, Patna, and BHU; NIT Calicut, Srinagar, and Warangal; DRDO; ISRO; CGCRI; Saha Institute of Nuclear Physics; SCL; IIMT; IIST; IISER Kolkata; GE; Maruti; and RVCE.',
    ].join(' '),
  },
}

/** Compact catalog for LLM system prompt (names only — details come from RAG). */
export function buildCatalogDigest(maxProducts = 20) {
  return getProductKnowledge()
    .slice(0, maxProducts)
    .map((p) => `- ${p.name} [${p.category}] (/products/${p.slug})`)
    .join('\n')
}

/** Exact product count + names grouped by category (source of truth: products.js). */
export function getProductStats() {
  const products = getProductKnowledge()
  const byCategory = {}
  products.forEach((p) => {
    byCategory[p.category] = byCategory[p.category] || []
    byCategory[p.category].push(p.name)
  })
  return { total: products.length, byCategory }
}

/** Every application note as "Title [Industries] → /PDF/file.pdf" lines. */
export function buildApplicationNotesDigest() {
  return getApplicationNotes()
    .map((n) => `- ${n.label} [${n.industries.join(', ')}] → ${n.pdf}`)
    .join('\n')
}

const NOTE_STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'using', 'used', 'into', 'onto', 'you',
  'your', 'have', 'has', 'does', 'about', 'any', 'note', 'notes', 'pdf', 'pdfs',
  'study', 'studies', 'paper', 'papers', 'show', 'give', 'tell', 'can', 'get',
  'test', 'testing', 'tested', 'application', 'applications',
])

/** Retrieve the application notes most relevant to a query (keyword overlap). */
export function retrieveRelevantNotes(query, k = 5) {
  const tokens = tokenizeQuery(query).filter((t) => !NOTE_STOPWORDS.has(t))
  if (!tokens.length) return []

  return getApplicationNotes()
    .map((n) => {
      const hay = `${n.label} ${n.industries.join(' ')}`.toLowerCase()
      let score = 0
      tokens.forEach((t) => {
        const stem = t.replace(/(ies|es|s)$/, '')
        if (hay.includes(t)) score += 1
        else if (stem.length > 2 && hay.includes(stem)) score += 1
      })
      return { n, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.n)
}

/** Deterministic answer for "how many products" / "list all products". */
export function buildProductCountAnswer() {
  const { total, byCategory } = getProductStats()
  const lines = Object.entries(byCategory).map(
    ([cat, names]) => `**${cat}** (${names.length}): ${names.join(', ')}`,
  )
  return (
    `Industron lists **${total} products** across ${Object.keys(byCategory).length} categories:\n\n` +
    `${lines.join('\n\n')}\n\n` +
    `See them all at [/products](/products), or ask about any one by name.`
  )
}

function buildWebsiteDigest(pages, cap = 550) {
  const list = pages && pages.length ? pages : Object.values(WEBSITE_PAGES)
  return list
    .map((page) => `### ${page.title} (${page.path})\n${page.text.slice(0, cap)}`)
    .join('\n\n')
}

/** Always-on company summary so core facts survive any retrieval miss. */
function buildCompanyOverview() {
  return [
    `Company: ${COMPANY_FACTS.name}. Founded ${COMPANY_FACTS.founded}. Locations: ${COMPANY_FACTS.locations}.`,
    `Focus: ${COMPANY_FACTS.focus}`,
    `Founder & Managing Director: ${COMPANY_FACTS.founder.name} (${COMPANY_FACTS.founder.role}), ${COMPANY_FACTS.founder.email}.`,
    `Key contacts — General: ${COMPANY_FACTS.contact.email}; Sales: ${COMPANY_FACTS.contact.sales}; Testing/NRL: ${COMPANY_FACTS.contact.testing}; India: ${COMPANY_FACTS.contact.india}; USA: ${COMPANY_FACTS.contact.usa}.`,
    `Flagship instruments: ${COMPANY_FACTS.flagship.join(', ')}.`,
  ].join('\n')
}

/** Generic English words that must never drive product/page/note matching. */
export const COMMON_STOPWORDS = new Set([
  'where', 'are', 'you', 'your', 'yours', 'based', 'the', 'and', 'for', 'with',
  'from', 'what', 'whats', 'which', 'how', 'does', 'did', 'can', 'could', 'who',
  'whom', 'whose', 'was', 'were', 'this', 'that', 'these', 'those', 'they',
  'them', 'then', 'than', 'their', 'there', 'here', 'its', 'our', 'ours', 'about',
  'into', 'onto', 'have', 'has', 'had', 'will', 'would', 'should', 'shall',
  'when', 'why', 'been', 'being', 'get', 'got', 'use', 'used', 'using', 'out',
  'off', 'all', 'any', 'also', 'just', 'like', 'tell', 'show', 'give', 'please',
  'want', 'need', 'know', 'say', 'said', 'located', 'situated', 'company',
])

function tokenizeQuery(query) {
  return String(query || '')
    .toLowerCase()
    .replace(/[μµ]/g, 'u')
    .split(/[^a-z0-9+-]+/)
    .filter((t) => t.length > 2 && !COMMON_STOPWORDS.has(t))
}

/** Retrieve top-k products relevant to a query for RAG */
export function retrieveRelevantProducts(query, k = 3) {
  const q = String(query || '')
    .toLowerCase()
    .replace(/[μµ]/g, 'u')
  const tokens = tokenizeQuery(query)

  const ranked = getProductKnowledge()
    .map((p) => {
      let score = 0
      const hay = p.keywords
      if (hay.includes(q)) score += 20
      tokens.forEach((t) => {
        if (hay.includes(t)) score += 2
      })
      if (/meso/.test(q) && /mesoprobe/.test(p.slug)) score += 10
      if (/(uprobe|micro.?probe|μprobe)/.test(q) && /uprobe/.test(p.slug)) score += 10
      if (/\bng\s?80\b/.test(q) && p.slug === 'ng80') score += 10
      if (/pneumatic|isolation table|air isolation|vibration/.test(q) && /pneumatic/.test(p.slug)) score += 10
      if (/\bdic\b|digital image correlation|strain map/.test(q) && /dic/.test(p.slug)) score += 10
      // Soft topic → product boosts so replies can promote the right system.
      if (/nanoindent|spm|afm|nanowear|hardness|modulus/.test(q) && p.slug === 'ng80') score += 4
      if (/compress|bend|tensile|fatigue|hydrogel|meso/.test(q) && p.slug === 'mesoprobe') score += 4
      if (/micro.?indent|education|teaching/.test(q) && /uprobe/.test(p.slug)) score += 4
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.p)

  // Always leave the model with at least one flagship to promote when empty.
  if (!ranked.length) {
    return getProductKnowledge()
      .filter((p) => ['ng80', 'mesoprobe', 'uprobe-500'].includes(p.slug))
      .slice(0, Math.min(2, k))
  }
  return ranked
}

/** Retrieve the website pages most relevant to a query (keyword overlap). */
export function retrieveRelevantPages(query, k = 3) {
  const tokens = tokenizeQuery(query)
  if (!tokens.length) {
    return [WEBSITE_PAGES.home, WEBSITE_PAGES.about, WEBSITE_PAGES.contact]
  }

  // Skip the bulky meta pages (full note list / FAQ list) — those are
  // surfaced through the dedicated notes and FAQ prompt sections instead.
  const scored = Object.entries(WEBSITE_PAGES)
    .filter(([key]) => key !== 'application_notes' && key !== 'faq')
    .map(([, page]) => page)
    .map((page) => {
      const hay = `${page.title} ${page.text}`.toLowerCase()
      let score = 0
      tokens.forEach((t) => {
        if (hay.includes(t)) score += 1
      })
      return { page, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.page)

  return scored.length ? scored : [WEBSITE_PAGES.home, WEBSITE_PAGES.about, WEBSITE_PAGES.contact]
}

/** Science / nanotech teaching questions (vs product-sales support). */
export function isNanotechQuery(query) {
  const q = String(query || '').toLowerCase()
  return /nano|spm|afm|tribolog|indent|hardness|modulus|young|poisson|thin.?film|quantum|semiconductor|magneto|fabricat|bottom.?up|top.?down|probe|tip|wear|friction|ashby|materials? (science|engineer)|contact mechanic|characteri[sz]|microscop|lattice|band.?gap|mems|cnt|carbon nanotube|graphene|self.?assembl|nanowear|piezo|transducer|in-?situ|roughness|fracture toughness|hertz|oliver.?pharr|stress.?strain|dislocation|grain|coating|polymer|biomaterial|hydrogel|creep|fatigue|scratch|dma|xpm/.test(
    q,
  )
}

/** True only when the user is asking for an instrument / product recommendation. */
export function wantsInstrumentAdvice(query) {
  const q = String(query || '').toLowerCase()
  return /which (system|instrument|product|one)|recommend|suggest|best (system|instrument|fit)|should i (buy|use|get)|looking for (a |an )?(system|instrument)|instrument for|system for|product for|brochure|demo|quote|\bbuy\b|purchase|compare.*(ng80|mesoprobe|uprobe|μprobe)|tell me about (ng80|mesoprobe|μprobe|uprobe|mesoprobe)|what (is|are) (the )?(ng80|mesoprobe|μprobe|uprobe)|show me (your )?(products|instruments)|list (your )?products/.test(
    q,
  )
}

/**
 * @param {object[]} relevantProducts
 * @param {string} query
 * @param {object[]} noteExcerpts
 * @param {{ mode?: 'nanotech' | 'site' }} [opts]
 */
export function buildSystemPrompt(relevantProducts = [], query = '', noteExcerpts = [], opts = {}) {
  const mode = opts.mode || (isNanotechQuery(query) ? 'nanotech' : 'site')
  const promoteProducts = wantsInstrumentAdvice(query) || mode === 'site'

  const rag =
    relevantProducts.length > 0
      ? relevantProducts
          .map((p) => {
            const body = p.facts
              ? `${p.facts}\n`
              : `${p.lead ? `Overview: ${p.lead}\n` : ''}${p.detail ? `Details: ${p.detail.slice(0, 350)}\n` : ''}${p.external ? `Note: Bruker/Hysitron product — full specs at ${p.externalUrl}\n` : ''}`
            return `### ${p.name}\nCategory: ${p.category}\nSummary: ${p.shortDesc}\n${body}Page: ${p.path}`
          })
          .join('\n\n')
      : 'No specific product matched.'

  const relevantPages = retrieveRelevantPages(query)
  const stats = getProductStats()
  const catalogHeader = `${stats.total} products total (${Object.entries(stats.byCategory)
    .map(([cat, names]) => `${cat}: ${names.length}`)
    .join('; ')})`

  const relevantNotes = retrieveRelevantNotes(query)
  const notesBlock = relevantNotes.length
    ? relevantNotes
        .slice(0, 2)
        .map((n) => `- ${n.label}: ${n.pdf}`)
        .join('\n')
    : 'No specific application note matched this question.'

  const publicExcerpts = noteExcerpts.filter((e) => e.public !== false && e.pdf)
  const privateExcerpts = noteExcerpts.filter((e) => e.public === false || !e.pdf)
  const excerptLen = privateExcerpts.length ? 1100 : mode === 'nanotech' ? 900 : 600

  const excerptsBlock = publicExcerpts.length
    ? publicExcerpts
        .map((e) => `From "${e.title}" (${e.pdf}):\n"""${e.text.slice(0, excerptLen)}"""`)
        .join('\n\n')
    : 'No application-note excerpt retrieved.'

  const privateBlock = privateExcerpts.length
    ? privateExcerpts
        .map((e) => `From "${e.title}":\n"""${e.text.slice(0, excerptLen)}"""`)
        .join('\n\n')
    : 'No internal reference excerpt for this question.'

  const relevantFaq = retrieveRelevantFaq(query)
  const faqBlock = relevantFaq.length
    ? relevantFaq.map((f) => `Q: ${f.question}\nA: ${f.answer.slice(0, 700)}`).join('\n\n')
    : 'No specific FAQ matched this question.'

  if (mode === 'nanotech') {
    const productSection = promoteProducts
      ? `

=== INDUSTRON SYSTEMS (only if the user asked for a system / recommendation) ===
${rag}`
      : `

=== PRODUCT RULE ===
Do NOT recommend Industron products, links, or brochures in this reply. Stay on the science.`

    return `You are **NanoGuide** — a calm, senior professor of nanomechanics and materials characterisation, speaking to a smart student or colleague.

VOICE:
- Talk like a person, not a document. Contractions are good ("it's", "you'll", "that's why").
- Answer the question first, in plain words, then add the detail that actually matters.
- Vary how you open — never start every reply the same way, and don't repeat the question back.
- Use an everyday comparison when it makes a hard idea click, then return to the precise term.
- Warm and direct. No marketing language, no filler like "great question".
- Never say you are an AI/LLM/offline model.

LENGTH:
- Aim for 3–6 short sentences, or 1 short paragraph + up to 3 bullets.
- Lead with the core idea, then one clarifying point, then stop.
- Close with a short, specific offer or question only when it genuinely helps (e.g. what sample they're testing).
- No walls of text. No catalogs. No PDF dumps.

PRODUCTS:
- Technical questions → technical answers only. No product recommendation unless the user asks which instrument / system / product to use.
- If they do ask for a system, give ONE clear recommendation with a path (/products/...).

ACCURACY:
- Ground answers in KNOWLEDGE EXCERPTS (book PDFs) + TECHNICAL FAQ first — treat book excerpts as the primary source.
- If KNOWLEDGE EXCERPTS contain relevant material, answer from them; do not invent missing details.
- Do not invent specs, prices, people, tip sizes, or findings.
- For tip / probe questions: use only Berkovich / Cube Corner / Cono-Spherical guidance from the FAQ. Never invent tip sizes in millimetres.
- At most 1 PDF link if directly useful; else mention [/applications](/applications).
- Never invent staff names.
- You may cite book titles in parentheses, e.g. (Contact Mechanics in Tribology) — never invent download links for private books.

=== COMPANY (context only — do not pitch unless asked) ===
${COMPANY_FACTS.name} — ${COMPANY_FACTS.focus}

=== KNOWLEDGE EXCERPTS (private book PDFs — primary technical source) ===
${privateBlock}

=== APPLICATION NOTE EXCERPTS ===
${excerptsBlock}

=== TECHNICAL FAQ ===
${faqBlock}${productSection}`
  }

  return `You are Industron's website assistant with a professor’s clarity: short, natural, precise.

Never mention that you are an AI, LLM, or offline model.

MESSAGE STYLE:
- Short, scannable answers (a few sentences or tight bullets) in a natural speaking voice; contractions are fine.
- Explain technical ideas crisply; do not pad with product pitches unless asked.
- Don't repeat the user's question back or open every reply the same way.

PRODUCTS:
- Recommend an Industron system only when the user asks about products, instruments, which system, brochure, demo, or buying.
- Flagship when needed: MesoProbe, μProbe 500, NG80, Pneumatic Air Isolation Table, DIC Software.

RULES:
1. Use KNOWLEDGE / book excerpts and FAQ below first — no invented specs/prices/people.
2. If missing, suggest /contact or ${COMPANY_FACTS.contact.sales}.
3. Technical FAQ: keep exact figures. Internal book refs: cite by title only; never offer as downloads.
4. Never invent staff names.

=== COMPANY OVERVIEW ===
${buildCompanyOverview()}

=== WEBSITE PAGES ===
${buildWebsiteDigest(relevantPages)}

=== PRODUCT CATALOG — ${catalogHeader} ===
${buildCatalogDigest()}

=== RELEVANT PRODUCTS ===
${rag}

=== RELEVANT APPLICATION NOTES ===
${notesBlock}

=== APPLICATION NOTE EXCERPTS ===
${excerptsBlock}

=== INTERNAL BOOK EXCERPTS (primary RAG when technical) ===
${privateBlock}

=== TECHNICAL FAQ ===
${faqBlock}`
}

export const FAQ_INTENTS = [
  {
    id: 'greeting',
    patterns: [/^hi\b/, /^hello\b/, /^hey\b/, /good (morning|afternoon|evening)/, /namaste/],
    answer: () =>
      `Hi! I’m **NanoGuide**. Ask a technical question — nanotech, indentation, SPM/AFM, tribology — and I’ll explain it briefly and clearly.\n\nWant a product recommendation? Just ask which system fits your test.`,
  },
  {
    id: 'what_is_nanotechnology',
    patterns: [
      /what is nanotechnology/,
      /define nanotechnology/,
      /nanotechnology (mean|definition|explained)/,
      /^nanotechnology\??$/,
    ],
    answer: () =>
      `**Nanotechnology** is engineering and using structures with at least one size in the **nanometre** range — roughly **1–100 nm**.\n\nAt that scale, materials often behave differently from bulk matter: surface effects dominate, quantum and interfacial physics matter, and “small” becomes a design variable — not just a size label.`,
  },
  {
    id: 'founder',
    patterns: [/founder/, /who (founded|started|owns|runs)/, /managing director|\bmd\b/, /ceo|owner|leadership|who is the (head|boss|director)/],
    answer: () =>
      `**${COMPANY_FACTS.founder.name}** is the **${COMPANY_FACTS.founder.role}** of ${COMPANY_FACTS.name}.\n\nHe has 30+ years of experience in nanomechanical testing instruments, a PhD from Oxford University, and MSc/BSc from IISc Bangalore.\n\n• Email: ${COMPANY_FACTS.founder.email}\n\nMore on our [/about](/about) and [/contact](/contact) pages.`,
  },
  {
    id: 'team',
    patterns: [
      /\bteam\b/,
      /\bstaff\b/,
      /\bemployee/,
      /who (are|is) (the )?(people|staff|members|contacts)/,
      /who works (at|for|with)/,
      /(our|your|the) (people|staff|employees|contacts)/,
      /sales (person|contact|manager)/,
      /application engineer/,
      /contact person/,
      /org(anisation|anization)? chart|leadership team/,
      /pratyank|kiran|asif/,
    ],
    answer: () =>
      `Key Industron contacts listed on the website:\n\n` +
      COMPANY_FACTS.team
        .map((m) => {
          const phone = m.phone ? ` · ${m.phone}` : ''
          return `• **${m.name}** — ${m.role} (${m.email}${phone})`
        })
        .join('\n') +
      `\n\nWe do not publish a full employee directory online. For other enquiries: [/contact](/contact)`,
  },
  {
    id: 'about',
    patterns: [/who (are|is) (you|industron)/, /about (the )?company/, /what (does|is) industron/, /tell me about industron/],
    answer: () =>
      `**${COMPANY_FACTS.name}** was founded in **${COMPANY_FACTS.founded}**. We specialize in ${COMPANY_FACTS.focus}\n\nLocations: **${COMPANY_FACTS.locations}**.\n\nFounder & Managing Director: **${COMPANY_FACTS.founder.name}**.\n\nFlagship instruments include ${COMPANY_FACTS.flagship.map((f) => `**${f}**`).join(', ')}.\n\nWant details on a specific product or our NRL testing lab?`,
  },
  {
    id: 'product_count',
    patterns: [
      /how many (product|instrument|item|model|machine|device)/,
      /(number|count|total) of (product|instrument|item|model)/,
      /how many (do you|does industron) (have|offer|sell|make)/,
      /total (product|instrument)/,
    ],
    answer: () => buildProductCountAnswer(),
  },
  {
    id: 'products_list',
    patterns: [/product(s)?( list| portfolio)?/, /what (do you|instruments?) (sell|offer|have)/, /catalogue|catalog/, /show (me )?(all )?(instruments|products)/, /(list|all|every|full|entire).*(product|instrument)/],
    answer: () => buildProductCountAnswer(),
  },
  {
    id: 'testing',
    patterns: [/test(ing|ed)?/, /\bnrl\b/, /sample (test|lab)/, /material test/, /nanomechanics research lab/, /lab (service|access)/],
    answer: () =>
      `Our **Nanomechanics Research Lab (NRL)** offers high-precision micro and nanoscale materials testing for academia and industry.\n\n**Capabilities:** nanomechanical characterization, structure–property analysis, failure analysis, in-situ/operando testing, and customized experimental design.\n\nAccess is available on a chargeable / collaborative basis.\n\n→ Start an enquiry: [/testing-form](/testing-form)\n→ Services overview: [/services](/services)`,
  },
  {
    id: 'services',
    patterns: [/service(s)?/, /consultancy|consulting/, /training/, /support|maintenance|service agreement/],
    answer: () =>
      `Industron services include:\n\n• **NRL advanced material testing** — lab access & characterization\n• **R&D consultancy** — smart product engineering & materials development\n• **Training programs** — hands-on nanomechanics courses\n• **Service agreements** — preventive maintenance & uptime support\n• **Technical support center** — operation, troubleshooting, data analysis\n\nFull details: [/services](/services)`,
  },
  {
    id: 'brochure',
    patterns: [/brochure|datasheet|pdf|spec(ification)?s?|literature/],
    answer: () =>
      `You can request a product brochure online. After you submit the form, our sales team reviews the request and emails the PDF to you.\n\n→ [/brochure-form](/brochure-form)\n\nFor quotes, email **${COMPANY_FACTS.contact.sales}**.`,
  },
  {
    id: 'contact',
    patterns: [/contact|email|phone|call|reach/, /get in touch/, /demo|quote|price|cost|buy|purchase/],
    answer: () =>
      `Happy to connect you with the right team:\n\n• **General:** ${COMPANY_FACTS.contact.email}\n• **India:** ${COMPANY_FACTS.contact.india}\n• **USA:** ${COMPANY_FACTS.contact.usa}\n• **Sales:** ${COMPANY_FACTS.contact.sales}\n• **Testing:** ${COMPANY_FACTS.contact.testing}\n\n→ Full contacts & offices: [/contact](/contact)\n→ Request a demo via the contact page or brochure form.`,
  },
  {
    id: 'tip_selection',
    patterns: [
      /which tip/,
      /what tip/,
      /tip (is |do i |should i )?(need|needed|use|choose|select|best|right|suitable)/,
      /(need|needed|use|choose|select).*(tip|probe|indenter)/,
      /(tip|probe|indenter).*(hard (surface|material)|steel|ceramic|glass|metal)/,
      /hard (surface|material).*(tip|probe|indenter)/,
      /berkovich|cube.?corner|cono.?spherical|conospherical/,
      /indenter tip/,
      /probe selection|tip selection/,
    ],
    answer: () =>
      `For a **hard surface** (steel, ceramics, glass, hard metals), start with a **Berkovich** tip.\n\n` +
      `In short: it is the standard three-sided pyramid for hardness and elastic modulus — included angle **142.35°**, tip radius typically **~120–150 nm**.\n\n` +
      `• **Berkovich** — everyday hardness/modulus on hard bulk materials\n` +
      `• **Cube Corner** — sharper tip when you need cracking / fracture toughness or very thin films\n` +
      `• **Cono-Spherical** — soft materials, scratch, or contact-mechanics studies\n\n` +
      `Tip size here is measured in **nanometres**, not millimetres — geometry and tip radius matter far more than a crude “mm tip size” rule.`,
  },
  {
    id: 'spm_vs_afm',
    patterns: [
      /in-?situ spm/,
      /\bspm\b.*\bafm\b/,
      /\bafm\b.*\bspm\b/,
      /spm (imaging|vs|versus|different|compared)/,
      /separate afm/,
      /same (tip|probe|transducer).*(image|scan|spm)/,
    ],
    answer: () =>
      `**In-situ SPM imaging** on Industron / Hysitron-style nanoindenters is not the same as using a separate AFM:\n\n` +
      `• The **same transducer and diamond tip** used for indentation also scans the surface (piezo-mounted head), so imaging and indent share one reference frame — site-specific placement typically within **±10 nm**.\n` +
      `• Pre-scan → indent → post-scan is **fully automated** and much faster than moving between two instruments.\n` +
      `• You can image a **~1 μm** area and place arrays or custom indents inside it; also useful on **unpolished or curved** samples (bone, dental, tissue, concrete, geology).\n` +
      `• Enables **scanning nanowear** and quantitative **modulus mapping** options; AFM tapping contrast alone is qualitative, not a substitute for calibrated indentation mechanics.`,
  },
  {
    id: 'changing_probe',
    patterns: [
      /chang(e|ing) (the )?(probe|tip)/,
      /mount(ing)? (the )?(probe|tip)/,
      /install(ing)? (the )?(probe|tip)/,
      /replace(ing)? (the )?(probe|tip)/,
      /probe (tool|mount|install|change|replace)/,
      /how (do i|to) (change|mount|install|replace).*(tip|probe)/,
    ],
    answer: () =>
      `**Changing / mounting a nanoindentation probe** (service note T-014):\n\n` +
      `Mounting is delicate — **do not overtighten** or apply **lateral forces**.\n\n` +
      `1. Loosen (don’t fully remove) the **0.035″ hex screw** and remove the transducer from the TriboScanner.\n` +
      `2. Lay the transducer on its side; remove the probe from its protective sheath.\n` +
      `3. Seat the probe’s **square mount** in the probe tool (hold upright — gravity/friction only).\n` +
      `4. Start the threaded end on the transducer at an angle, then level the tool.\n` +
      `5. Turn **counter-clockwise** until a slight click (threads seated), then **clockwise** until the **torque-limiting tool** stops.\n` +
      `6. Reverse steps to remove. **Never** let the probe tool hang unsupported on the transducer — that can damage the calibrated springs.`,
  },
  {
    id: 'applications',
    patterns: [/application(s)?/, /use case|used for|which industry/, /semiconductor|aerospace|biomedical|coating|thin film/],
    answer: () =>
      `Our instruments support materials research across semiconductors, coatings, thin films, soft/biomaterials, aerospace alloys, education labs, and industrial QC.\n\nExplore application themes: [/applications](/applications)\n\nTell me your material or test type (e.g. hardness, creep, SEM in-situ) and I’ll suggest a suitable platform.`,
  },
  {
    id: 'customers',
    patterns: [/customer|client|collaborat|institution|universit|\biit\b|\biisc\b|\bnit\b|isro|drdo|who (uses|do you work)|installation/],
    answer: () =>
      `Industron has **40+ installations** across leading universities, national labs, and industry.\n\nPartners include **IISc Bangalore**, multiple **IITs** (Bombay, Madras, Kanpur, Roorkee, Kharagpur, Hyderabad, and more), **NITs**, **DRDO**, **ISRO**, **CGCRI**, **IISER Kolkata**, **GE**, and **Maruti**.\n\nWe support materials science, biomedical, aerospace, and semiconductor research worldwide.`,
  },
  {
    id: 'history',
    patterns: [/history|founded|established|since when|bruker|hysitron|acquisition|how old|started in/],
    answer: () =>
      `Industron established its **R&D center in 2011** to develop advanced nanomechanical testing systems.\n\nAfter Bruker Corporation's **acquisition of Hysitron in 2017**, R&D continued under Industron Technical Services as a key engineering and technology partner. Industron built the world's first affordable depth-sensing indentation system for micro- to meso-scale testing.\n\nMore on [/about](/about).`,
  },
  {
    id: 'offices',
    patterns: [
      /office|address|located|location|visit|technopark|kinfra|edina|kerala|trivandrum|thiruvananthapuram|headquarter/,
      /where (are|is|r|u|you)\b/,
      /where.*(based|located|situated|from)/,
      /\bbased (in|out|at)\b/,
      /which (country|city|state|region|place)/,
    ],
    answer: () =>
      `Industron has offices in **India** and the **USA**:\n\n• **Technopark, Thiruvananthapuram** — Unit #401, Thejaswini Building, Kerala – 695581\n• **Kinfra Industrial Park, Thiruvananthapuram** — Plot 45(B), Meenamkulam, Kerala – 695586\n• **Edina, USA** — Suite 132, 4445 West 77th Street, MN 55435\n\nFull details & map: [/contact](/contact)`,
  },
  {
    id: 'thanks',
    patterns: [/thank/, /^ok\b/, /^great\b/, /appreciate/],
    answer: () =>
      `You're welcome! Ask anytime about products, testing, or how to reach Industron — I'm here to help.`,
  },
]

export const QUICK_PROMPTS = [
  'What is MesoProbe?',
  'Tell me about μProbe 500',
  'How do I get my material tested?',
  'Show me your products',
  'Steel coatings wear note',
  'Which indenter tip should I use?',
  'How can I contact sales?',
]
