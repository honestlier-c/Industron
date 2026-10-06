import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'
import { fadeUp } from '../motion/presets'

const DISCIPLINES = [
  'Sales',
  'Service',
  'Hardware Engineer',
  'Software Engineer',
]

export default function CareersPage() {
  return (
    <main className="careers-page">
      <SEOMeta
        title="Careers"
        description="Join Industron — send your CV to hr@industronnano.com for openings in Sales, Service, Hardware Engineering, and Software Engineering."
        canonical="https://www.industronnano.com/careers"
      />
      <PageHero
        tag="Company"
        title="Careers"
        lead="Build instruments and support research teams at the intersection of materials science and precision engineering."
      />

      <section className="page-section careers-section">
        <div className="container">
          <motion.p
            className="careers-intro"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            Please send us your CV at{' '}
            <a href="mailto:hr@industronnano.com">hr@industronnano.com</a>
            {' '}for the disciplines mentioned here.
          </motion.p>

          <motion.div
            className="careers-org"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            aria-label="Open disciplines"
          >
            <div className="careers-org-root">Job</div>
            <div className="careers-org-stem" aria-hidden="true" />
            <div className="careers-org-rail" aria-hidden="true" />
            <ul className="careers-org-roles">
              {DISCIPLINES.map((role) => (
                <li key={role}>
                  <span className="careers-org-role">{role}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
