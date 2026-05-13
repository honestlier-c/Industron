import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SERVICES = [
  {
    id: 'rd',
    icon: '◈',
    title: 'Research & Development',
    paragraphs: [
      'Industron established its R&D center in 2011 with a strategic focus on designing, developing, and engineering advanced nanomechanical testing systems. With a strong foundation in precision instrumentation and applied materials science, the team continues to advance nano-, micro-, and meso-scale mechanical characterization technologies for global users.',
      'Following the acquisition of Hysitron by Bruker Corporation in 2017, the R&D operations transitioned under Industron Technical Services, continuing as a critical technology development and engineering partner. Industron has since contributed to multiple state-of-the-art nanomechanical testing platforms through in-house innovation, collaborative research, and high-level technical consultancy for global product programs.',
    ],
  },
  {
    id: 'instruments',
    icon: '⊙',
    title: 'Mechanical Testing Instruments & Anti‑Vibration Tables',
    paragraphs: [
        "Today, Industron is a leading solution provider for mechanical testing and materials characterization, addressing length scales from nano to meso. The company takes pride in developing the world\u2019s first affordable depth\u2011sensing indentation system spanning the micro\u2011 to meso\u2011scale, effectively bridging a critical gap in advanced materials characterization.",
        "In addition to high\u2011performance research\u2011grade systems, Industron is actively developing educational and training instruments to support fundamental research, hands\u2011on learning, and routine laboratory operations. Complementing its indigenous innovations, Industron offers state\u2011of\u2011the\u2011art nanomechanical testing solutions from Bruker\u2019s Hysitron portfolio, including flagship platforms such as the TI 990, TI 980, and TI Premier II.",
      'Further strengthening its product ecosystem, Industron is indigenously developing anti‑vibration tables and essential surface‑characterization accessories, enabling high‑precision measurements and stable experimental environments.',
    ],
  },
  {
    id: 'testing',
    icon: '◇',
    title: 'Advanced Material Testing',
    paragraphs: [
      'Our leadership is committed to contributing to the research community from both academia and industry through the setup of the "Nanomechanics Research Lab (NRL)".',
      'The lab is equipped with advanced nanoindentation techniques and an experienced application team. Our specialists support customers worldwide with application-focused guidance for both academia and industry.',
    ],
  },
]

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-tag">Our Services</div>
          <h2>
            What we do at<br />
            <span className="gradient-text">Industron</span>
          </h2>
        </motion.div>

        <div className="services-grid">
          {SERVICES.map(({ id, icon, title, paragraphs }, i) => (
            <motion.div
              key={id}
              className="service-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            >
              <div className="service-icon">{icon}</div>
              <h3>{title}</h3>
              {paragraphs.map((text, j) => (
                <p key={j}>{text}</p>
              ))}
              {id === 'instruments' && (
                <a href="#hero" className="btn-primary service-card-cta">
                  Instruments
                </a>
              )}
              {id === 'testing' && (
                <Link to="/testing-form" className="btn-primary service-card-cta">
                  Enquiry for testing
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
