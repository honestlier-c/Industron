import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FuturisticWaveDots from '../components/FuturisticWaveDots'
import { fadeUp, stagger } from '../motion/presets'
import SEOMeta from '../components/SEOMeta'

/* -----------------------------------------------------------
   CONTENT
----------------------------------------------------------- */
const HERO_MILESTONES = [
  { value: '2011', label: 'Founded' },
  { value: '40+', label: 'Installations' },
  { value: 'Global Labs', label: 'Research network' },
  { value: 'Worldwide', label: 'Customer footprint' },
]

const WHO_WE_ARE_BADGES = ['Since 2011', 'IISc · IITs', 'Thiruvananthapuram · Edina']

const WHAT_WE_DO_ITEMS = [
  {
    title: 'R&D Consultancy',
    text: 'Structure–property correlation, failure analysis, and advanced materials research',
  },
  {
    title: 'Nanomechanics Testing',
    text: 'Micro and nanoscale mechanical characterization with high precision',
  },
  {
    title: 'Scientific Instrument Development',
    text: 'Embedded systems, analytical instruments, sensors, and precision engineering',
  },
  {
    title: 'Nanoyantrika Workshop',
    text: 'Knowledge-sharing platform connecting researchers and industry experts',
  },
]

const CORE_COMPETENCIES = [
  {
    icon: '◈',
    title: 'Precision Instrument Design',
    text: 'Advanced integration of electronics, mechanics, sensors, and embedded control systems.',
  },
  {
    icon: '⊙',
    title: 'Materials Research & Nanomechanics',
    text: 'Expertise in nanoscale mechanical property evaluation and materials characterization.',
  },
  {
    icon: '◉',
    title: 'In-situ & Operando Technologies',
    text: 'Advanced characterization solutions inside TEM, SEM, and Raman environments.',
  },
  {
    icon: '✦',
    title: 'Innovation-Driven Engineering',
    text: 'Focused on developing breakthrough technologies for scientific research.',
  },
  {
    icon: '❋',
    title: 'Customer-Centric Collaboration',
    text: 'Strong technical support and long-term partnerships with global academia and industry.',
  },
]

/* -----------------------------------------------------------
   REUSABLE BLOCK
----------------------------------------------------------- */
function AboutBlock({ tag, title, gradientTitle, lead, badges, children, reverse = false }) {
  return (
    <motion.div
      className={`about-block ${reverse ? 'about-block--reverse' : ''}`}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.aside className="about-block-side" variants={fadeUp}>
        <div className="about-block-tag">{tag}</div>
        <h2>
          {title}{' '}
          <span className="gradient-text">{gradientTitle}</span>
        </h2>
        {lead && <p className="about-block-lead">{lead}</p>}
        {badges && (
          <div className="about-block-badges">
            {badges.map((b) => (
              <span key={b} className="about-chip">{b}</span>
            ))}
          </div>
        )}
      </motion.aside>

      <motion.div className="about-block-content" variants={fadeUp}>
        {children}
      </motion.div>
    </motion.div>
  )
}

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default function AboutPage() {
  return (
    <main className="about-page">
      <SEOMeta
        title="About Us"
        description="Founded in 2011, Industron advances scientific instrumentation, nanomechanics, and precision engineering from India and the USA — R&D consultancy, testing, instrument development, and Nanoyantrika."
        canonical="https://www.industronnano.com/about"
      />
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden="true">
          <div className="about-hero-orb about-hero-orb--a" />
          <div className="about-hero-orb about-hero-orb--b" />
          <div className="about-hero-grid" />
          <FuturisticWaveDots className="page-hero-dots" />
        </div>

        <div className="container">
          <motion.div
            className="about-hero-inner"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="section-tag" variants={fadeUp}>About Us</motion.div>

            <motion.h1 className="about-hero-title" variants={fadeUp}>
              Advancing Scientific Instrumentation<br />
              <span className="gradient-text">Through Innovation</span>
            </motion.h1>

            <motion.p className="about-hero-sub" variants={fadeUp}>
              Founded in 2011, Industron Technical Services Pvt. Ltd. is a global R&amp;D-driven company
              specializing in scientific instrumentation, nanomechanics, precision engineering, and
              embedded systems — serving academia and industry worldwide.
            </motion.p>

            <motion.div className="about-milestone-ribbon" variants={fadeUp}>
              {HERO_MILESTONES.map((item) => (
                <div key={item.label} className="about-milestone-chip">
                  <span className="about-milestone-value">{item.value}</span>
                  <span className="about-milestone-label">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="about-section-wrap">
        <div className="container">
          <AboutBlock
            tag="Who we are"
            title="Advancing Scientific Instrumentation"
            gradientTitle="Through Innovation"
            badges={WHO_WE_ARE_BADGES}
          >
            <motion.p variants={fadeUp}>
              Founded in 2011, Industron Technical Services Pvt. Ltd. is a global R&amp;D-driven company
              specializing in scientific instrumentation, nanomechanics, precision engineering, and
              embedded systems development.
            </motion.p>
            <motion.p variants={fadeUp}>
              With locations in <strong>Thiruvananthapuram, India</strong> and <strong>Edina, USA</strong>,
              our team of scientists and engineers works at the intersection of materials science,
              instrumentation, electronics, and software engineering to develop advanced research
              solutions for academia and industry worldwide.
            </motion.p>
            <motion.p variants={fadeUp}>
              We collaborate with premier institutions including IISc and IITs, contributing to
              cutting-edge research and product innovation. Our flagship technology,{' '}
              <strong>NanoGuru® / NG80</strong>, is a high-precision desktop nanomechanical testing
              platform designed for nanoscale materials characterization.
            </motion.p>
          </AboutBlock>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="about-section-wrap about-section-alt">
        <div className="container">
          <AboutBlock
            reverse
            tag="What we do"
            title="Capabilities that power"
            gradientTitle="research & industry"
            lead="R&D consultancy, testing, instruments, and knowledge sharing."
          >
            <motion.div variants={fadeUp}>
              <ul className="about-what-list">
                {WHAT_WE_DO_ITEMS.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    {' — '}
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AboutBlock>
        </div>
      </section>

      {/* CORE COMPETENCIES */}
      <section className="about-section-wrap">
        <div className="container">
          <motion.div
            className="about-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="section-tag" variants={fadeUp}>Core Competencies</motion.div>
            <motion.h2 variants={fadeUp}>
              Core <span className="gradient-text">competencies</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="about-comp-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {CORE_COMPETENCIES.map((c) => (
              <motion.article key={c.title} className="about-comp-card" variants={fadeUp}>
                <div className="about-comp-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            className="about-closing"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 variants={fadeUp}>
              Engineering Precision for <span className="gradient-text">Scientific Discovery</span>
            </motion.h2>
            <motion.p variants={fadeUp}>
              At Industron, we combine science, engineering, and innovation to build next-generation
              technologies that accelerate research and empower discovery.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-wrap">
        <div className="container">
          <motion.div
            className="about-cta"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="section-tag">Let’s collaborate</div>
              <h2>
                Ready to build a <span className="gradient-text">global breakthrough?</span>
              </h2>
              <p>
                Connect with us for instruments, testing services, or R&D collaborations across global programs.
                Our team responds within one business day.
              </p>
            </div>
            <div className="about-cta-actions">
              <Link to="/contact" className="btn-primary">
                Get in Touch <span aria-hidden="true">→</span>
              </Link>
              <Link to="/services" className="btn-ghost">Explore Services</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
