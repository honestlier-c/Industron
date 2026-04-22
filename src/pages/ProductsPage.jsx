import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../components/PageHero'
import PageCTA from '../components/PageCTA'

const PRODUCTS = [
  {
    category: 'SEM / TEM In-Situ',
    tag: { label: 'SEM In-Situ', color: 'cyan' },
    name: 'Hysitron PI 89 SEM PicoIndenter',
    desc: 'The most advanced in-situ instrument for nanomechanical testing inside an SEM. Interchangeable xR transducers, encoded 1 nm stages, and 5-DoF sample positioning.',
    features: [
      'Max load: 10 mN, 500 mN, 3500 mN',
      'Max displacement: 5 µm – 150 µm',
      '5-DoF rotation & tilt sample stage',
      'High-temp (1000 °C) & cryo (-130 °C) options',
    ],
  },
  {
    category: 'Tabletop',
    tag: { label: 'Tabletop', color: 'purple' },
    name: 'Hysitron TI Premier',
    desc: 'The flagship tabletop nanoindenter combining high-resolution nanoindentation, in-situ SPM imaging, and nanotribology — with XPM accelerated property mapping at over 1 indent/sec.',
    features: [
      'Sub-nm displacement sensitivity',
      'In-situ SPM for site-specific targeting',
      'Accelerated property mapping (XPM)',
      'Nanotribology & nanoscratch modules',
    ],
  },
  {
    category: 'Tabletop',
    tag: { label: 'Tabletop', color: 'cyan' },
    name: 'Hysitron TS 77 Select',
    desc: 'Essential toolkit for quantitative nanoscale-to-microscale mechanical and tribological characterization. Compact, modular, and fully equipped with in-situ SPM and XPM.',
    features: [
      'Max force: 10 mN | Max disp.: 5 µm',
      'Z force noise: ≤ 250 nN | Z disp.: ≤ 1 nm',
      'XPM at 2 indents/sec, 256×256 SPM scan',
      '3-plate capacitive transducer, DSP/FPGA controller',
    ],
  },
  {
    category: 'SEM / TEM In-Situ',
    tag: { label: 'TEM In-Situ', color: 'purple' },
    name: 'Hysitron PI 95 TEM PicoIndenter',
    desc: 'Quantitative in-situ nanomechanical testing inside a TEM. Supports nanoindentation, pillar compression, Push-to-Pull tensile, 2D tribology, and fatigue at atomic resolution.',
    features: [
      'MEMS transducer: <200 nN, <1 nm',
      'Push-to-Pull (PTP) tensile device',
      'In-situ TEM tribology (2D MEMS)',
      'EBSD, TKD and STEM compatible',
    ],
  },
  {
    category: 'Custom Systems',
    tag: { label: 'Custom System', color: 'cyan' },
    name: 'NG80 In-Situ Optical System',
    desc: "Industron's custom instrument integrating optical video microscopy with high-resolution load cells and precise XY stages for nano-to-meso scale in-situ deformation tracking.",
    features: [
      'Machine stiffness >10⁶ N/m',
      'DIC-based deformation tracking',
      'Particle compression & beam bending',
      'Creep, fatigue & fracture toughness',
    ],
  },
  {
    category: 'Micro / Meso',
    tag: { label: 'Micro Scale', color: 'purple' },
    name: 'μProbe',
    desc: 'Micro-scale mechanical testing platform for depth-sensing indentation and related experiments where compact form, stable transducers, and precise load-displacement control matter.',
    features: [
      'Depth-sensing indentation and micro-scale loads',
      'Suited to education, R&D, and routine lab workflows',
      'Configurable stages and environmental options',
      'Application support from Industron specialists',
    ],
  },
  {
    category: 'Micro / Meso',
    tag: { label: 'Meso Scale', color: 'cyan' },
    name: 'MesoProbe',
    desc: 'Meso-scale testing solution bridging micro and millimetre regimes for larger samples, higher loads, and deformation modes that go beyond classical nanoindentation.',
    features: [
      'Higher load and displacement range for meso-scale samples',
      'Suited to beams, films, particles, and engineered components',
      'Stable frame design for repeatable mechanical data',
      'Integration options for imaging and custom fixturing',
    ],
  },
  {
    category: 'Tabletop',
    tag: { label: 'Compact', color: 'purple' },
    name: 'Minus Scale',
    desc: 'Compact footprint system for labs with limited space — delivering dependable mechanical characterization without compromising core measurement performance.',
    features: [
      'Reduced bench footprint for crowded laboratories',
      'Streamlined setup and maintenance',
      'Ideal as a second system or teaching platform',
      'Discuss configuration and performance targets with our team',
    ],
  },
  {
    category: 'Accessories',
    tag: { label: 'Other', color: 'cyan' },
    name: 'Other solutions',
    desc: 'Beyond standard platforms: anti-vibration tables, accessories, upgrades, application services, and bespoke mechanical test configurations tailored to your workflow.',
    features: [
      'Anti-vibration tables and environmental stability',
      'Custom fixtures, stages, and integration support',
      'Application testing via Nanomechanics Research Lab (NRL)',
      'Training, workshops, and ongoing technical support',
    ],
  },
]

const CATEGORIES = [
  'All',
  'Tabletop',
  'SEM / TEM In-Situ',
  'Micro / Meso',
  'Custom Systems',
  'Accessories',
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 },
  }),
}

export default function ProductsPage() {
  const [active, setActive] = useState('All')

  const filtered = useMemo(
    () => (active === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active],
  )

  return (
    <main className="products-page">
      <PageHero
        tag="Product Portfolio"
        title="Instruments built for"
        highlight="every scale of testing"
        lead="From tabletop nanoindentation to in-situ SEM and TEM systems, our portfolio supports high-precision mechanical testing across advanced materials research and industrial applications."
        badges={['Nano · Micro · Meso', 'In-situ SEM/TEM', 'XPM Mapping', 'High-Temp / Cryo']}
      />

      <section className="page-section">
        <div className="container">
          <div className="products-filter" role="tablist" aria-label="Filter products">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                className={`products-filter-chip${active === cat ? ' is-active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div className="products-grid" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map(({ tag, name, desc, features, category }, i) => (
                <motion.article
                  key={name}
                  layout
                  className="product-card"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="product-card-top">
                    <span className={`product-tag product-tag-${tag.color}`}>
                      {tag.label}
                    </span>
                    <span className="product-card-category">{category}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                  <div className="product-features">
                    {features.map((feature) => (
                      <div className="product-feature" key={feature}>{feature}</div>
                    ))}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <PageCTA
        tag="Next step"
        title="Need detailed specs or a"
        highlight="recommendation?"
        lead="Our team can help you choose the right platform for your test workflow — from education to industrial research."
        primary={{ label: 'Request Technical Specs', href: '/contact' }}
        secondary={{ label: 'Talk to a Specialist', href: '/contact' }}
      />
    </main>
  )
}
