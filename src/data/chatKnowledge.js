/**
 * Rich knowledge helpers for Industron AI (RAG context + FAQ).
 */

import { PRODUCTS } from './products'
import { getApplicationNotes } from './applicationNotes'
import { retrieveRelevantFaq, buildFaqQuestionList } from './technicalFaq'

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

    return {
      slug: p.slug,
      name: p.name,
      category: p.category,
      shortDesc: p.shortDesc,
      highlight: p.hero?.highlight,
      lead: p.hero?.lead,
      badges: p.hero?.badges ?? [],
      path: `/products/${p.slug}`,
      detail: [beatBits, infoBits].filter(Boolean).join('\n'),
      keywords: buildKeywords(p, beatBits, infoBits),
    }
  })
}

function buildKeywords(p, beatBits, infoBits) {
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
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const extras = []
  if (/mesoprobe/i.test(p.name)) extras.push('meso dic high-temperature 600 bending creep')
  if (/μprobe|uprobe|micro/i.test(p.name + p.slug)) extras.push('microindentation hardness modulus education 500mn')
  if (/ng50|ng80|nanoguru/i.test(p.name + p.slug)) extras.push('nanoguru desktop education spm nanoindentation')
  if (/sem|picoindenter|pi /i.test(p.name)) extras.push('sem in-situ picoindenter')
  if (/tem/i.test(p.name)) extras.push('tem transmission')
  if (/tribo/i.test(p.name)) extras.push('tribology friction wear')
  if (/biosoft/i.test(p.name)) extras.push('soft-matter biological hydrated')

  return `${base} ${extras.join(' ')}`
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
  flagship: ['MesoProbe', 'μProbe 500', 'NG50 / NanoGuru®', 'NG80'],
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
      'Flagship / featured products: MesoProbe — high-temperature in-situ optical meso mechanical testing with DIC strain analysis (indentation, compression, tensile, bending, fatigue up to 600 °C). μProbe 500 — depth-sensing micro-indenter for hardness, modulus, partial unload, and materials characterization up to 500 mN with automated multi-point mapping. NG80 — high-precision desktop NanoGuru® platform with in-situ SPM for surface topography and nanoscale property mapping.',
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
      'Industron publishes downloadable application-note PDFs on the /applications page. Each note links to a PDF under /PDF/. When a user asks about one, share the matching PDF link. Available notes (Title [industries] → PDF link):\n' +
      buildApplicationNotesDigest(),
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
      'Education & Research: μProbe 500 (depth-sensing micro-indenter, up to 500 mN), MesoProbe (meso-scale optical + DIC, up to 600 °C), NG50 (NanoGuru® education system), NG80 (high-throughput desktop nanomechanics with in-situ SPM).',
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
      'Enquiry routing: Brochure requests → brochure@industronnano.com (or /brochure-form). Material testing (NRL) → testing@industronnano.com (or /testing-form). General enquiries → enquiries@industronnano.com. Sales & procurement → sales@industronnano.com.',
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

  return getProductKnowledge()
    .map((p) => {
      let score = 0
      const hay = p.keywords
      if (hay.includes(q)) score += 20
      tokens.forEach((t) => {
        if (hay.includes(t)) score += 2
      })
      if (/meso/.test(q) && /mesoprobe/.test(p.slug)) score += 10
      if (/(uprobe|micro.?probe|μprobe)/.test(q) && /uprobe/.test(p.slug)) score += 10
      if (/\bng\s?50\b|nanoguru/.test(q) && p.slug === 'ng50') score += 10
      if (/\bng\s?80\b/.test(q) && p.slug === 'ng80') score += 10
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.p)
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

export function buildSystemPrompt(relevantProducts = [], query = '', noteExcerpts = []) {
  const rag =
    relevantProducts.length > 0
      ? relevantProducts
          .map(
            (p) =>
              `### ${p.name}\nCategory: ${p.category}\nSummary: ${p.shortDesc}\n${p.lead ? `Overview: ${p.lead}\n` : ''}${p.detail ? `Details: ${p.detail.slice(0, 350)}\n` : ''}Page: ${p.path}`,
          )
          .join('\n\n')
      : 'No specific product matched — use only the website pages and product catalog below.'

  const relevantPages = retrieveRelevantPages(query)
  const stats = getProductStats()
  const catalogHeader = `${stats.total} products total (${Object.entries(stats.byCategory)
    .map(([cat, names]) => `${cat}: ${names.length}`)
    .join('; ')})`

  const relevantNotes = retrieveRelevantNotes(query)
  const notesBlock = relevantNotes.length
    ? relevantNotes.map((n) => `- ${n.label} [${n.industries.join(', ')}]: ${n.pdf}`).join('\n')
    : 'No specific application note matched this question. If asked for the full list, point to /applications.'

  const excerptsBlock = noteExcerpts.length
    ? noteExcerpts
        .map((e) => `From "${e.title}" (${e.pdf}):\n"""${e.text.slice(0, 600)}"""`)
        .join('\n\n')
    : 'No excerpt retrieved for this question — rely on the note titles/links above and suggest /applications.'

  const relevantFaq = retrieveRelevantFaq(query)
  const faqBlock = relevantFaq.length
    ? relevantFaq.map((f) => `Q: ${f.question}\nA: ${f.answer.slice(0, 520)}`).join('\n\n')
    : 'No specific FAQ matched this question.'

  return `You are Industron Support, a helpful website assistant for ${COMPANY_FACTS.name}.
Never mention that you are an AI, LLM, language model, or offline model. Speak as a normal support assistant.

CRITICAL DATA RULES (must follow):
1. Answer ONLY using the website content provided in this prompt (company overview + website pages + product catalog + relevant product details).
2. Do NOT use general internet knowledge, training memory, competitor info, or invented specs/prices.
3. If the answer is not in the website content below, say you do not have that detail on the website and suggest /contact or ${COMPANY_FACTS.contact.sales} / ${COMPANY_FACTS.contact.testing}.
4. Prefer short, clear answers with page links from the website when helpful.
5. When a question relates to an application note / case study, answer using the "APPLICATION NOTE EXCERPTS" (verbatim PDF text) and share the exact PDF link from the "RELEVANT APPLICATION NOTES" section (e.g. [Title](/PDF/File.pdf)). Never invent PDF names, numbers, or findings — only use the excerpts and links provided below.
6. For nanoindentation / instrumentation how-to questions (tip selection, minimum depth, fracture toughness, dynamic nanoindentation, noise floor, thin-film/substrate, surface roughness), use the "TECHNICAL FAQ" answers and keep their exact figures (angles like 142.35°, radii, R/3, ISO 14577-4, 40 Hz, formulas).

=== COMPANY OVERVIEW (always true) ===
${buildCompanyOverview()}

=== MOST RELEVANT WEBSITE PAGES FOR THIS QUESTION ===
${buildWebsiteDigest(relevantPages)}

=== PRODUCT CATALOG (from /products) — ${catalogHeader} ===
${buildCatalogDigest()}

=== MOST RELEVANT PRODUCTS FOR THIS QUESTION ===
${rag}

=== RELEVANT APPLICATION NOTES (PDFs — link the exact URL when relevant) ===
${notesBlock}

=== APPLICATION NOTE EXCERPTS (verbatim from the PDFs — use these to answer detailed questions, then cite the note's PDF link) ===
${excerptsBlock}

=== TECHNICAL FAQ (authoritative answers — use verbatim facts, angles, and formulas) ===
${faqBlock}

=== END WEBSITE CONTENT ===

Style:
- Be accurate and concise (2–5 short paragraphs or bullets).
- Use plain text; light markdown (**bold**) is OK.
- Include helpful website paths when useful (/products/..., /services, /applications, /testing-form, /brochure-form, /contact).`
}

export const FAQ_INTENTS = [
  {
    id: 'greeting',
    patterns: [/^hi\b/, /^hello\b/, /^hey\b/, /good (morning|afternoon|evening)/, /namaste/],
    answer: () =>
      `Hello! Welcome to **Industron Support** — I can help with nanomechanical testing instruments, lab services, and technical support.\n\nAsk me about products like **MesoProbe**, **μProbe 500**, or **NG80**, or about testing, training, and how to contact our team.`,
  },
  {
    id: 'founder',
    patterns: [/founder/, /who (founded|started|owns|runs)/, /managing director|\bmd\b/, /ceo|owner|leadership|who is the (head|boss|director)/],
    answer: () =>
      `**${COMPANY_FACTS.founder.name}** is the **${COMPANY_FACTS.founder.role}** of ${COMPANY_FACTS.name}.\n\nHe has 30+ years of experience in nanomechanical testing instruments, a PhD from Oxford University, and MSc/BSc from IISc Bangalore.\n\n• Email: ${COMPANY_FACTS.founder.email}\n\nMore on our [/about](/about) and [/contact](/contact) pages.`,
  },
  {
    id: 'team',
    patterns: [/\bteam\b/, /who (are|is) (the )?(people|staff|members)/, /sales (person|contact|manager)/, /application engineer/, /contact person/, /pratyank|kiran|asif/],
    answer: () =>
      `Key Industron contacts:\n\n• **${COMPANY_FACTS.founder.name}** — ${COMPANY_FACTS.founder.role} (${COMPANY_FACTS.founder.email})\n• **Pratyank Rastogi** — Manager, Sales & Service (pratyank@industronnano.com · +91 9048542221)\n• **Kiran Raphael** — Application Engineer, material testing (kp@industronnano.com · +91 9447311243)\n\nFull details: [/contact](/contact)`,
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
      `You can request a product brochure online — share your details and download the PDF.\n\n→ [/brochure-form](/brochure-form)\n\nOr open a product page and tap **Get Brochure**. For sales quotes, email **${COMPANY_FACTS.contact.sales}**.`,
  },
  {
    id: 'contact',
    patterns: [/contact|email|phone|call|reach/, /get in touch/, /demo|quote|price|cost|buy|purchase/],
    answer: () =>
      `Happy to connect you with the right team:\n\n• **General:** ${COMPANY_FACTS.contact.email}\n• **India:** ${COMPANY_FACTS.contact.india}\n• **USA:** ${COMPANY_FACTS.contact.usa}\n• **Sales:** ${COMPANY_FACTS.contact.sales}\n• **Testing:** ${COMPANY_FACTS.contact.testing}\n\n→ Full contacts & offices: [/contact](/contact)\n→ Request a demo via the contact page or brochure form.`,
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
  'Show me application notes',
  'Which indenter tip should I use?',
  'How can I contact sales?',
]
