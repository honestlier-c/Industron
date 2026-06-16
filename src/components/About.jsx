import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SERVICES = [
  {
    id: 'rd',
    icon: '◈',
    title: 'Research & Development',
    paragraphs: [
      'Industron established its R&D center in 2011 to design and develop advanced nanomechanical testing systems. Backed by strong expertise in precision instrumentation and applied materials science, the team continues to innovate nano-, micro-, and meso-scale mechanical characterization technologies for global academic and industrial applications.',
      'Following the acquisition of Hysitron by Bruker Corporation in 2017, the R&D operations continued under Industron Technical Services as a key engineering and technology development partner. Industron has since contributed to multiple state-of-the-art nanomechanical testing platforms through in-house innovation, collaborative research, and global technical consultancy.',
    ],
  },
  {
    id: 'instruments',
    icon: '⊙',
    title: 'Mechanical Testing Instruments & Anti‑Vibration Tables',
    paragraphs: [
      'Industron provides advanced mechanical testing and materials characterization solutions covering nano- to meso-scale applications. The company developed the world’s first affordable depth-sensing indentation system for micro- to meso-scale testing, bridging a major gap in modern materials characterization while also developing educational and training systems for research and laboratory use.',
      'In addition to indigenous innovations, Industron offers advanced nanomechanical testing systems from Bruker’s Hysitron portfolio, including TI 990, TI 980, and TI Premier II. The company is also developing anti-vibration tables and surface-characterization accessories for highly stable and precise experimental environments.',
    ],
  },
  {
    id: 'testing',
    icon: '◇',
    title: 'Advanced Material Testing',
    paragraphs: [
      'Industron’s leadership contributes to the research community through the establishment of the Nanomechanics Research Lab (NRL), supporting both academic and industrial research initiatives in advanced material characterization.',
      'The lab is equipped with advanced nanoindentation technologies and supported by an experienced applications team that provides application-focused technical guidance and support to customers worldwide.',
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
