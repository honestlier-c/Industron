import { motion } from 'framer-motion'
import FuturisticWaveDots from '../components/FuturisticWaveDots'

/* -----------------------------------------------------------
   CONTENT
----------------------------------------------------------- */
const HERO_HIGHLIGHTS = [
  'DSIR recognized',
  'IISc & IIT partners',
  'India & USA',
  'Nanomechanics R&D',
]

const WHO_WE_ARE = [
  'Welcome to Industron — we are very glad you are here.',
  'Welcome to Industron Technical Services Pvt. Ltd., and we are delighted to have you here.',
  'Industron is committed to advancing research and development to deliver high-value solutions in scientific instrumentation with cutting-edge technology. We are a dedicated team of scientists and engineers with world-class expertise in materials science and engineering, embedded control systems, hardware and software development, analytical instrument design, sensors and actuators, and precision engineering.',
  'Since its inception, Industron has actively collaborated with premier institutions such as IISc and various IITs, contributing to pioneering research and product innovation. Over the years, our team has developed advanced technologies and instruments — including NanoGuru®/NG80, a desktop nanomechanical testing instrument designed for evaluating nanoscale mechanical properties of materials.',
  'Our R&D division is recognized as an In-house R&D Unit by the Department of Scientific and Industrial Research (DSIR), Government of India.',
]

const WHO_WE_ARE_BADGES = ['Since 2011', 'DSIR Recognized', 'IISc & IIT Partners', 'Trivandrum · Edina']

const WHAT_WE_DO = [
  'At Industron, our customers are scientists and engineers from both academia and industry. Customer satisfaction and superior support form the core pillars of our company. We engage proactively with our customers through day-to-day interactions, online and onsite meetings, as well as regular workshops and conferences. Our flagship biennial workshop, Nanoyantrika, is a testament to our commitment to knowledge sharing and collaboration.',
  'We undertake R&D consultancy in areas such as structure–property correlation, failure analysis, and the design of advanced engineering materials. Our state-of-the-art laboratory provides world-class capabilities for micro and nanoscale materials testing, supported by a team of experts dedicated to delivering precise and reliable results.',
  'In addition, we specialize in the development of advanced scientific instruments, embedded control hardware and software, and precision engineering design.',
]

const WHAT_WE_DO_BADGES = [
  'R&D Consultancy',
  'Nanomechanics Lab',
  'Instrument Development',
  'Nanoyantrika Workshop',
]

const CORE_COMPETENCIES = [
  {
    icon: '◈',
    title: 'Smart Product Design',
    text: 'Advanced electronics integrated with precision mechanical systems for transducers, sensors, and actuators.',
  },
  {
    icon: '⊙',
    title: 'Research Advancement',
    text: 'Promoting knowledge and research in the field of nanoscale mechanical properties.',
  },
  {
    icon: '◇',
    title: 'Market Expertise',
    text: 'Identifying and serving markets that require nano and microscale mechanical property testing.',
  },
  {
    icon: '◉',
    title: 'In-situ & Operando',
    text: 'Pioneering in-situ and operando materials characterization techniques inside TEM / SEM / Raman.',
  },
  {
    icon: '✦',
    title: 'Breakthrough Innovation',
    text: 'Embracing innovation while taking calculated risks to deliver breakthrough technologies.',
  },
  {
    icon: '❋',
    title: 'Customer-First Support',
    text: 'Proactive, dedicated support that builds lasting relationships with our valued clients across India and the world.',
  },
]

const LEADERS = [
  {
    initials: 'TW',
    name: 'Thomas Wyrobek',
    role: 'Founder, Industron Group of Companies',
    image: '/Website/Person/Thomas-Wyrobek-CEO-and-Co-Founder-of-Hysitron-Inc-headshot-300x300.jpg',
    chips: [
      'Co-Founder & CEO, Hysitron Inc.',
      '40+ years in engineering',
      'MRS · AVS · ASME · STLE',
      'IDEMA · TMS',
    ],
    bio: [
      'Thomas Wyrobek is one of the founders of Industron Group of Companies. He was the CEO and Co-Founder of Hysitron Inc., a worldwide leader in designing, producing and servicing leading-edge nanoindenters and nanomechanical test instruments to support industrial, academic and government material research innovations. Thomas brings deep knowledge, expertise and relationships to the nanotechnology world, and is highly respected for his forward-thinking approaches in advancing nanomechanical test instrumentation.',
      'He has more than 40 years of experience in engineering design, total process control, and zero-defect production of precise components, assemblies and instrumentation. Previously, he was the President and owner of Molding Technical Systems — a leading supplier of aircraft connectors to Boeing and NASA — and 7-Sigma, a precision manufacturer for the business machine and disk drive industry. Thomas underwrites and supports students, meetings, and research projects worldwide, and serves as a board member to three corporations and two non-profits.',
    ],
  },
  {
    initials: 'SA',
    name: 'Dr. S. A. Syed Asif',
    role: 'Managing Director & Founder',
    image: '/Website/Person/Asif.jpg',
    chips: [
      'PhD, Oxford University',
      'MSc & BSc, IISc Bangalore',
      '30+ years of experience',
      '22 active patents',
      '120+ publications',
      'Multiple R&D 100 Awards',
    ],
    bio: [
      'Dr. S. A. Syed Asif is the Managing Director and founder of Industron Group of Companies. He has over 30 years of experience in designing and developing nanomechanical testing instruments. Before Industron, he served as Director of R&D at Bruker Nano Surfaces and Hysitron. He completed his PhD at Oxford University in Material Science, and holds his Masters and Bachelors from the Indian Institute of Science (IISc), Bangalore.',
      'He is one of the pioneers of in-situ nanomechanics inside TEM/SEM/Raman microscopes, with 22 active patents, 120+ publications, and numerous invited talks. He has won multiple R&D 100 Awards, Microscopy Today Innovation Awards, and was instrumental in SBIR funding and the National Tibbetts Award for Hysitron. Under his leadership, NanoGuru® — a nanomechanical testing instrument for graduate and undergraduate research — was developed in India. He is a member of MRS, ACerS, and TMS, and an active collaborator with research institutions worldwide.',
    ],
  },
]

/* -----------------------------------------------------------
   ANIMATION HELPERS
----------------------------------------------------------- */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

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
              Engineering Nanomechanics<br />
              <span className="gradient-text">for India and the World</span>
            </motion.h1>

            <motion.p className="about-hero-sub" variants={fadeUp}>
              We design, develop, and market high-performance scientific instruments for
              nanomechanical characterization — built on deep R&D, precision engineering, and
              long-term collaboration with academia and industry.
            </motion.p>

            <motion.div className="about-hero-highlights" variants={fadeUp}>
              {HERO_HIGHLIGHTS.map((label) => (
                <span key={label} className="about-chip">{label}</span>
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
            title="A team of scientists & engineers advancing"
            gradientTitle="scientific instrumentation"
            lead="Introduction, mission & R&D identity"
            badges={WHO_WE_ARE_BADGES}
          >
            {WHO_WE_ARE.map((line, i) => (
              <motion.p key={i} variants={fadeUp}>{line}</motion.p>
            ))}
          </AboutBlock>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="about-section-wrap about-section-alt">
        <div className="container">
          <AboutBlock
            reverse
            tag="What we do"
            title="R&D, nanomechanics testing, and"
            gradientTitle="precision instrument design"
            lead="Serving academia and industry with world-class capabilities."
            badges={WHAT_WE_DO_BADGES}
          >
            {WHAT_WE_DO.map((line, i) => (
              <motion.p key={i} variants={fadeUp}>{line}</motion.p>
            ))}
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
              Our distinct <span className="gradient-text">strengths</span>
            </motion.h2>
            <motion.p className="about-block-lead" variants={fadeUp}>
              What sets us apart as an indigenous nanomechanics partner.
            </motion.p>
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

          <motion.p
            className="about-page-signoff"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            — The Industron Team
          </motion.p>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="about-section-wrap about-section-alt">
        <div className="container">
          <motion.div
            className="about-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="section-tag" variants={fadeUp}>Leadership</motion.div>
            <motion.h2 variants={fadeUp}>
              Guided by <span className="gradient-text">pioneers of nanomechanics</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="about-leader-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {LEADERS.map((l) => (
              <motion.article key={l.name} className="about-leader-card" variants={fadeUp}>
                <div className="about-leader-head">
                  {l.image ? (
                    <img src={l.image} alt={l.name} className="about-leader-avatar about-leader-avatar-image" />
                  ) : (
                    <div className="about-leader-avatar">{l.initials}</div>
                  )}
                  <div>
                    <h3>{l.name}</h3>
                    <div className="about-leader-role">{l.role}</div>
                  </div>
                </div>

                <div className="about-leader-chips">
                  {l.chips.map((c) => (
                    <span key={c} className="about-chip">{c}</span>
                  ))}
                </div>

                <div className="about-leader-bio">
                  {l.bio.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </motion.article>
            ))}
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
                Ready to build something <span className="gradient-text">remarkable?</span>
              </h2>
              <p>
                Reach out to discuss instruments, testing services, or R&D collaborations.
                Our team responds within one business day.
              </p>
            </div>
            <div className="about-cta-actions">
              <a href="/contact" className="btn-primary">
                Get in Touch <span aria-hidden="true">→</span>
              </a>
              <a href="/services" className="btn-ghost">Explore Services</a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
