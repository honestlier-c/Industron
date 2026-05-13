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

const SMART_PRODUCT_CAPS = [
  'Precision mechanical design',
  'CAD for parts and assemblies',
  'Finite Element Analysis (FEA)',
  'Electro-mechanical system design',
  'Mechatronic sensors and actuators',
  'Embedded hardware and software integration',
]

const MATERIAL_DEV_ITEMS = [
  'New materials',
  'Thin films and coatings',
  'Heat treatment processes',
]

const MATERIAL_ANALYSIS = [
  'Mechanical strength and hardness',
  'Elastic and viscoelastic properties',
  'Fracture toughness',
  'Creep resistance',
  'Structure–property correlation',
  'Failure analysis',
]

const TRAINING_FEATURES = [
  'Programs for both industry and academia',
  'Hands-on training and practical exposure',
  'Focus on real-world applications',
]

const SERVICE_AGREEMENTS = [
  'Preventive maintenance support',
  'Reduced downtime',
  'Streamlined servicing process',
  'Quick response for urgent system needs',
]

const TECH_SUPPORT = [
  'Easy access to technical information',
  'Assistance in system operation and data analysis',
  'Continuous improvements for better usability',
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
        description="Industron services: Nanomechanics Research Lab testing, R&D consultancy, instrument training, service agreements, and technical support for global customers."
        canonical="https://www.industronnano.com/services"
      />
      <PageHero
        size="lg"
        tag="Industron Technical Services"
        title="Services"
        highlight="testing, consultancy & customer care"
        lead="From the Nanomechanics Research Laboratory (NRL) to product engineering and long-term support — one team aligned with global research and instrumentation goals."
        badges={['NRL', 'Smart product engineering', 'Training', 'Service agreements']}
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
            <span className="services-doc-kicker">Laboratory</span>
            <h2>Advanced Material Testing</h2>
            <p>
              Team Industron supports the materials research community using advanced
              nanomechanical technologies. The{' '}
              <strong>Nanomechanics Research Laboratory (NRL)</strong> has executed
              numerous R&amp;D projects in collaboration with leading research
              organizations, academic institutions, and industries worldwide.
            </p>
            <p>
              The laboratory is equipped with state-of-the-art infrastructure to deliver
              high-quality experimental results. The team specializes in designing
              experiments based on specific research requirements and provides deep
              insights into material behavior.
            </p>
            <div className="services-callout" role="note">
              <strong>Facility access.</strong>{' '}
              Industron offers access to its testing facilities to both academic and
              industrial researchers on a <strong>chargeable basis</strong>, enabling
              high-quality research at minimal cost.{' '}
              <Link to="/testing-form" className="services-callout-link">
                Open sample testing enquiry form →
              </Link>
            </div>
          </DocCard>

          <DocCard id="consultancy" className="services-doc-card--consult">
            <span className="services-doc-kicker">Consultancy</span>
            <h2>R&amp;D Consultancy Support</h2>
            <p className="services-doc-lead">
              Industron provides consultancy across two major verticals:
            </p>

            <div className="services-consultancy-grid">
              <div className="services-consultancy-col">
                <h3>
                  <span className="services-consultancy-icon" aria-hidden="true">◇</span>
                  Smart Product Engineering
                </h3>
                <p>
                  A multidisciplinary approach integrating mechanical, electrical, and
                  software engineering to bring products from concept to production.
                </p>
                <p className="services-doc-list-title">Capabilities include</p>
                <ul className="services-doc-list services-doc-list--checks">
                  {SMART_PRODUCT_CAPS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="services-consultancy-col">
                <h3>
                  <span className="services-consultancy-icon" aria-hidden="true">◈</span>
                  Material Development &amp; Testing
                </h3>
                <p className="services-doc-list-title">Support for development and evaluation of</p>
                <ul className="services-doc-list services-doc-list--checks">
                  {MATERIAL_DEV_ITEMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="services-doc-list-title">Key analysis areas</p>
                <ul className="services-doc-list services-doc-list--checks">
                  {MATERIAL_ANALYSIS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="services-consultancy-foot">
                  Industron also offers <strong>in-situ / operando testing</strong>, enabling
                  real-time material behavior analysis.
                </p>
              </div>
            </div>
          </DocCard>

          <div className="services-mini-grid">
            <DocCard id="training" className="services-doc-card--mini">
              <span className="services-doc-kicker">Learning</span>
              <h2>Training Courses</h2>
              <p>
                Specialized programs in <strong>nanomechanical testing</strong>, backed by
                over <strong>30 years of expertise</strong> from R&amp;D leadership.
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
              <p className="services-doc-lead">Reliability and uptime:</p>
              <ul className="services-doc-list services-doc-list--checks">
                {SERVICE_AGREEMENTS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="services-mini-foot">
                <strong>High customer satisfaction</strong> through structured service support.
              </p>
            </DocCard>

            <DocCard id="support" className="services-doc-card--mini">
              <span className="services-doc-kicker">Help desk</span>
              <h2>Technical Support Center</h2>
              <p className="services-doc-lead">Dedicated support for:</p>
              <ul className="services-doc-list services-doc-list--checks">
                {TECH_SUPPORT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="services-mini-foot">
                <strong>Product specialists</strong> are available when you need direct, expert help.
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
