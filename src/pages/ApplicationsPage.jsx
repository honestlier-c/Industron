import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../components/PageHero'
import PageCTA from '../components/PageCTA'

const INDUSTRIES = [
  {
    title: 'Steel Industry',
    accent: 'cyan',
    techniques: ['Nanoindentation & Tribology', 'Property Mapping', 'Scanning Probe Microscopy'],
    notes: [
      'Investigating wear and nanomechanics of thin hard coatings on steel',
      'Correlative microscopy and XPM steel',
      'Local work hardening of steel',
      'Oxide dispersion strengthened steel tested up to 700°C',
      'Hardness mapping of a DP980 steel sample',
      'Nanoindentation of duplex stainless steel using EBSD and PI 88',
    ],
  },
  {
    title: 'Foundry, Metal Forming & Joining',
    accent: 'purple',
    techniques: ['Nanoindentation & Tribology', 'Property Mapping', 'Scanning Probe Microscopy'],
    notes: [
      'Targeted nanoindentation of a high entropy alloy in SEM',
      'Material joining characterization of laser beam welding',
    ],
  },
  {
    title: 'Pharmaceutical',
    accent: 'cyan',
    techniques: ['Mechanical properties of molecular crystals', 'Property mapping'],
    notes: ['Indentation-induced structural changes using Raman spectroscopy'],
  },
  {
    title: 'Automotive & Aerospace',
    accent: 'purple',
    techniques: [
      'Nanoindentation & Nanotribology',
      'High-temperature property mapping',
      'Scanning Probe Microscopy',
      'Creep testing',
    ],
    notes: [
      'Tape test vs nanoindentation',
      'Polymer thin film characterization at low temperature',
      'Strength engineering in nickel-based superalloys',
      'Tire materials testing in harsh environments',
      'High-temperature creep testing of superalloy bond coat',
      'In-situ high-temperature study of Ni-based superalloys',
    ],
  },
  {
    title: 'Food & Beverages',
    accent: 'cyan',
    techniques: [
      'Adhesion strength of thin coatings',
      'Mechanical characterization of corrosion-resistant coatings',
      'Wear testing',
    ],
    notes: ['Mechanical characterization of corrosion-resistant coatings'],
  },
  {
    title: 'Surface Protection & Paint Coatings',
    accent: 'purple',
    techniques: [
      'Adhesion strength of coatings',
      'Depth-dependent property measurement',
      'Thin film measurement (as low as 1 nm)',
    ],
    notes: [
      'Polymer thin film characterization',
      'Corrosion-resistant coating analysis',
      'Tape test vs nanoindentation',
    ],
  },
  {
    title: 'Biomaterials',
    accent: 'cyan',
    techniques: [
      'Nanoindentation & Tribology',
      'Viscoelastic property measurement',
      'Dynamic Mechanical Analysis',
    ],
    notes: [
      'Indentation of contact lenses',
      'Hydrogel characterization using in-situ indenter',
      'Raman and indentation mapping of biological tissues',
      'Compression testing of living cells',
      'Characterization of aortic valve tissue',
      'Nanoindentation of marine teeth',
      'Elastic properties of cartilage tissue',
    ],
  },
  {
    title: 'Polymer & Plastic',
    accent: 'purple',
    techniques: [
      'Dynamic Mechanical Analysis (DMA)',
      'Time/frequency-dependent behavior',
      'Temperature sweep & glass transition analysis',
    ],
    notes: [
      'Polymer thin film characterization',
      'Tire materials testing',
      'High-throughput material screening',
      'Time-dependent deformation of PMMA',
    ],
  },
]

const TESTING_TECHNIQUES = [
  {
    title: 'Nanoindentation',
    desc: 'Mechanical testing to measure hardness and modulus at the nanoscale by applying force and measuring indentation depth.',
  },
  {
    title: 'Scanning Probe Microscopy (SPM)',
    desc: 'Nanometer-resolution 3D surface imaging through raster scanning. Enables precise site-specific testing (~±10 nm accuracy).',
  },
  {
    title: 'NanoScratch',
    desc: 'Measures scratch resistance, adhesion, friction, and coating behavior using force-displacement monitoring.',
  },
  {
    title: 'Scanning Wear',
    desc: 'Evaluates wear rate and volume at sub-microstructural levels with in-situ imaging capability.',
  },
  {
    title: 'High Temperature Testing',
    desc: 'Material characterization up to 800 °C, enabling analysis under extreme operating conditions.',
  },
  {
    title: 'Creep Testing',
    desc: 'Measures time-dependent deformation of materials under load, even at elevated temperatures.',
  },
  {
    title: 'Modulus Mapping',
    desc: 'DMA-based technique that maps stiffness, modulus, and viscoelastic properties across surfaces.',
  },
  {
    title: 'Dynamic Mechanical Analysis (DMA)',
    desc: 'Analyzes viscoelastic materials by applying sinusoidal forces to study time-dependent mechanical behavior.',
  },
  {
    title: 'Accelerated Property Mapping (XPM)',
    desc: 'Rapid large-scale mapping of mechanical properties with multiple indentations per second.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 },
  }),
}

export default function ApplicationsPage() {
  const [active, setActive] = useState('Steel Industry')

  const industries = useMemo(
    () => INDUSTRIES.filter((i) => i.title === active),
    [active],
  )

  return (
    <main className="applications-page">
      <PageHero
        tag="Applications"
        title="Nanomechanical applications"
        highlight="across industries"
        lead="Studying the mechanical response of materials at the nanoscale has gained significant attention — driven by nanostructured materials and the continued miniaturization of engineering components, thin films, and surface coatings."
        badges={['Cross-sector', 'Multiple methods', 'In-situ ready', 'High-temp capable']}
      />

      {/* Industry-specific applications */}
      <section className="page-section">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">By industry</div>
            <h2>Industry-specific applications</h2>
            <p>Techniques and representative application notes, filtered by sector.</p>
          </motion.div>

          <div className="applications-filter" role="tablist" aria-label="Filter by industry">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.title}
                type="button"
                role="tab"
                aria-selected={active === ind.title}
                className={`applications-filter-chip${active === ind.title ? ' is-active' : ''}`}
                onClick={() => setActive(ind.title)}
              >
                {ind.title}
              </button>
            ))}
          </div>

          <motion.div className="applications-industry-list" layout>
            <AnimatePresence mode="popLayout">
              {industries.map((ind, i) => (
                <motion.article
                  key={ind.title}
                  layout
                  className={`applications-industry-card accent-${ind.accent}`}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="applications-industry-head">
                    <span className="applications-industry-bar" aria-hidden="true" />
                    <h3>{ind.title}</h3>
                  </div>
                  <div className="applications-two-col">
                    <div>
                      <h4 className="applications-sublabel">Techniques</h4>
                      <ul className="applications-bullet-list">
                        {ind.techniques.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="applications-sublabel">Application notes</h4>
                      <ol className="applications-notes-list">
                        {ind.notes.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Testing techniques */}
      <section className="page-section page-section-alt">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">Methods</div>
            <h2>Testing techniques</h2>
            <p>Core methods supported across our platforms and lab services.</p>
          </motion.div>

          <div className="applications-tech-grid">
            {TESTING_TECHNIQUES.map((tech, i) => (
              <motion.article
                key={tech.title}
                className="applications-tech-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                custom={i}
                variants={fadeUp}
              >
                <h3>{tech.title}</h3>
                <p>{tech.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        tag="Have a target application?"
        title="Tell us the material and"
        highlight="we'll recommend the test"
        lead="Share your specimen type and property of interest — our application engineers will propose the right technique and platform."
        primary={{ label: 'Discuss your Application', href: '/contact' }}
        secondary={{ label: 'View Services', href: '/services' }}
      />
    </main>
  )
}
