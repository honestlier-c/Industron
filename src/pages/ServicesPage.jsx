import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PageCTA from '../components/PageCTA'
import SEOMeta from '../components/SEOMeta'
import { fadeUp } from '../motion/presets'

const JUMP_LINKS = [
  { id: 'nrl-testing', label: 'NRL testing' },
  { id: 'consultancy', label: 'R&D consultancy' },
  { id: 'training', label: 'Training' },
  { id: 'agreements', label: 'Service agreements' },
  { id: 'support', label: 'Technical support' },
]

const NRL_CAPABILITIES = [
  'Nanomechanical characterization',
  'Structure–property analysis',
  'Failure analysis',
  'In-situ / operando testing',
  'Customized experimental design',
]

const SMART_EXPERTISE = [
  'Precision mechanical design',
  'CAD & FEA analysis',
  'Mechatronics',
  'Sensors & actuators',
  'Embedded hardware & software',
]

const MATERIAL_ANALYSIS_AREAS = [
  'Mechanical strength & hardness',
  'Elastic and viscoelastic properties',
  'Fracture toughness & creep',
  'Heat treatment studies',
  'Structure–property correlation',
]

const TRAINING_FEATURES = [
  'Industry & academic programs',
  'Hands-on practical training',
  'Real-world application focus',
]

const SERVICE_AGREEMENT_INCLUDES = [
  'Preventive maintenance',
  'Reduced downtime',
  'Fast service response',
  'Structured support workflows',
]

const TECH_SUPPORT_SERVICES = [
  'Technical assistance',
  'System guidance',
  'Data analysis support',
  'Continuous product improvement assistance',
]

function DocCard({ id, children, className = '' }) {
  return (
    <motion.article
      id={id}
      className={`services-doc-card ${className}`.trim()}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.06 }}
    >
      {children}
    </motion.article>
  )
}

export default function ServicesPage() {
  return (
    <main className="services-page">
      <SEOMeta
        title="Services"
        description="Industron: NRL advanced materials testing, R&D consultancy, training programs, service agreements, and technical support for global research and industry."
        canonical="https://www.industronnano.com/services"
      />
      <PageHero
        size="lg"
        tag="Industron Technical Services"
        title="Services"
        highlight="Testing, Consultancy & Technical Support"
        lead="From advanced materials testing to product engineering and long-term technical support, Industron Technical Services Pvt. Ltd. delivers integrated solutions for global research and industrial needs."
        badges={['NRL', 'R&D consultancy', 'Training', 'Service agreements', 'Support']}
      />

      <div className="services-jump-wrap">
        <div className="container">
          <nav className="services-jump" aria-label="On this page">
            {JUMP_LINKS.map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <section className="page-section services-doc-wrap">
        <div className="container services-doc-layout">
          <DocCard id="nrl-testing" className="services-doc-card--feature">
            <span className="services-doc-kicker">Nanomechanics Research Lab</span>
            <h2>NRL – Advanced Material Testing</h2>
            <p>
              The <strong>Nanomechanics Research Laboratory (NRL)</strong> supports academia and
              industry with high-precision micro and nanoscale materials testing.
            </p>
            <h3 className="services-doc-inline-h3">Capabilities</h3>
            <ul className="services-doc-list services-doc-list--checks services-doc-list--tight">
              {NRL_CAPABILITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              Our state-of-the-art facility is available to researchers and industries for
              collaborative and chargeable testing services.
            </p>
            <div className="services-callout" role="note">
              <strong>Enquire for access.</strong>{' '}
              Share your sample and study details to scope feasibility and next steps.{' '}
              <Link to="/testing-form" className="services-callout-link">
                Open sample testing enquiry form →
              </Link>
            </div>
          </DocCard>

          <DocCard id="consultancy" className="services-doc-card--consult">
            <span className="services-doc-kicker">Consultancy</span>
            <h2>R&amp;D Consultancy</h2>

            <div className="services-consultancy-grid">
              <div className="services-consultancy-col">
                <h3>
                  <span className="services-consultancy-icon" aria-hidden="true">◇</span>
                  Smart Product Engineering
                </h3>
                <p>
                  End-to-end product development integrating mechanical, electrical, and software
                  systems.
                </p>
                <p className="services-doc-list-title">Expertise includes</p>
                <ul className="services-doc-list services-doc-list--checks">
                  {SMART_EXPERTISE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="services-consultancy-col">
                <h3>
                  <span className="services-consultancy-icon" aria-hidden="true">◈</span>
                  Material Development &amp; Testing
                </h3>
                <p>
                  Support for advanced materials, coatings, and process evaluation.
                </p>
                <p className="services-doc-list-title">Analysis areas</p>
                <ul className="services-doc-list services-doc-list--checks">
                  {MATERIAL_ANALYSIS_AREAS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DocCard>

          <div className="services-mini-grid">
            <DocCard id="training" className="services-doc-card--mini">
              <span className="services-doc-kicker">Learning</span>
              <h2>Training Programs</h2>
              <p>
                Specialized training in nanomechanics and materials characterization led by
                experienced R&amp;D experts.
              </p>
              <p className="services-doc-list-title">Key features</p>
              <ul className="services-doc-list services-doc-list--checks">
                {TRAINING_FEATURES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DocCard>

            <DocCard id="agreements" className="services-doc-card--mini">
              <span className="services-doc-kicker">Uptime</span>
              <h2>Service Agreements</h2>
              <p>
                Comprehensive support programs designed for maximum system reliability and uptime.
              </p>
              <p className="services-doc-list-title">Includes</p>
              <ul className="services-doc-list services-doc-list--checks">
                {SERVICE_AGREEMENT_INCLUDES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DocCard>

            <DocCard id="support" className="services-doc-card--mini">
              <span className="services-doc-kicker">Help desk</span>
              <h2>Technical Support Center</h2>
              <p>
                Dedicated expert support for instrument operation, troubleshooting, and data
                analysis.
              </p>
              <p className="services-doc-list-title">Support services</p>
              <ul className="services-doc-list services-doc-list--checks">
                {TECH_SUPPORT_SERVICES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="services-mini-foot">
                Our product specialists are always available to support your research and
                operational needs.
              </p>
            </DocCard>
          </div>
        </div>
      </section>

      <PageCTA
        tag="Let's collaborate"
        title="Discuss testing, consultancy, or"
        highlight="training & support"
        lead="Reach out for NRL access, smart product engineering, or instrument-related enquiries — our global team will connect you with the right specialist."
        primary={{ label: 'Get in Touch', href: '/contact' }}
        secondary={{ label: 'Explore Products', href: '/products' }}
      />
    </main>
  )
}
