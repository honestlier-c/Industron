import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import PageCTA from '../components/PageCTA'

const RD_DOMAINS = [
  'Mechanical Design',
  'Electronic Design',
  'Embedded System Design',
  'Software Design',
  'Smart Product Engineering',
]

const RD_APPROACH = [
  'Agile process methodology',
  'Adaptable and flexible solutions',
  'Thorough testing at every stage',
  'Faster time-to-market',
]

const MATERIAL_TESTS = [
  {
    icon: '◈',
    title: 'Nanoindentation',
    desc: 'Precise measurement of mechanical properties at the nanoscale.',
  },
  {
    icon: '◇',
    title: 'Dynamic Mechanical Analysis (DMA)',
    desc: 'Evaluation of material behavior under dynamic loading conditions.',
  },
  {
    icon: '⊙',
    title: 'Scanning Probe Microscopy (SPM)',
    desc: 'High-resolution surface imaging and analysis.',
  },
  {
    icon: '◉',
    title: 'Nanoscratch Testing',
    desc: 'Assessment of coating adhesion and scratch resistance.',
  },
  {
    icon: '✦',
    title: 'Scanning Wear Testing',
    desc: 'Analysis of wear behavior under controlled conditions.',
  },
  {
    icon: '❋',
    title: 'High Temperature Testing',
    desc: 'Material performance evaluation at elevated temperatures.',
  },
]

const INSTRUMENTS = [
  {
    name: 'TI Premier',
    desc: 'Advanced nanoindentation system for high-precision measurements.',
  },
  {
    name: 'TS 77',
    desc: 'Robust platform for comprehensive nanomechanical analysis.',
  },
  {
    name: 'NG 50',
    desc: 'Compact and efficient system for nanoscale testing applications.',
  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

export default function ServicesPage() {
  return (
    <main className="services-page">
      <PageHero
        tag="Services"
        title="Industron Technical Services"
        highlight="R&D, testing & instrumentation"
        lead="Comprehensive support from consultancy and smart product engineering to advanced material characterization and nanomechanical test platforms."
        badges={['DSIR Recognized', 'India & USA', 'Lab Services', 'Consultancy']}
      />

      <section className="page-section">
        <div className="container">
          <motion.article
            className="services-block"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            <motion.div className="services-block-head" variants={fadeUp}>
              <div>
                <div className="section-tag">R&amp;D consultancy</div>
                <h2>R&amp;D Consultancy Services</h2>
              </div>
            </motion.div>

            <motion.p className="services-block-lead" variants={fadeUp}>
              Comprehensive research and development support across multiple engineering
              domains — delivered through a proven, agile process.
            </motion.p>

            <div className="services-split">
              <motion.div className="services-split-col" variants={fadeUp}>
                <h3 className="services-subheading">Engineering domains</h3>
                <ul className="services-pill-list">
                  {RD_DOMAINS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.div>
              <motion.div className="services-split-col" variants={fadeUp}>
                <h3 className="services-subheading">Our approach</h3>
                <ul className="services-check-list">
                  {RD_APPROACH.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="page-section page-section-alt">
        <div className="container">
          <motion.div
            className="services-block-head services-block-head--centered"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeUp}>
              <div className="section-tag">Material testing</div>
              <h2>Material Testing Services</h2>
              <p className="services-block-lead">
                Advanced material characterization and testing solutions in our
                Nanomechanics Research Lab (NRL).
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="services-test-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {MATERIAL_TESTS.map(({ icon, title, desc }) => (
              <motion.article
                key={title}
                className="services-test-card"
                variants={fadeUp}
              >
                <div className="services-test-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <motion.div
            className="services-block-head services-block-head--centered"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeUp}>
              <div className="section-tag">Instruments</div>
              <h2>Nanomechanical Test Instruments</h2>
              <p className="services-block-lead">
                Cutting-edge instrumentation for nanomechanical testing — from tabletop
                to custom systems.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="services-instrument-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {INSTRUMENTS.map(({ name, desc }) => (
              <motion.article
                key={name}
                className="services-instrument-card"
                variants={fadeUp}
              >
                <h3>{name}</h3>
                <p>{desc}</p>
                <a href="/products" className="services-card-link">
                  View in product portfolio <span aria-hidden="true">→</span>
                </a>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <PageCTA
        tag="Let's collaborate"
        title="Discuss a project or"
        highlight="testing scope"
        lead="Reach out for consultancy, lab services, or instrument enquiries — our team responds within one business day."
        primary={{ label: 'Get in Touch', href: '/contact' }}
        secondary={{ label: 'Explore Products', href: '/products' }}
      />
    </main>
  )
}
