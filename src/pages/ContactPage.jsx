import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import { fadeUp, stagger } from '../motion/presets'
import SEOMeta from '../components/SEOMeta'

const OFFICES = [
  {
    title: 'India – Technopark Office',
    lines: [
      'Industron Nanotechnology Pvt Ltd',
      'Unit #401, Fourth Floor',
      'Thejaswini Building, Technopark',
      'Thiruvananthapuram, Kerala – 695581',
    ],
  },
  {
    title: 'India – Kinfra Industrial Park',
    lines: [
      'Industron Technical Services Pvt Ltd',
      'Plot No 45(B), Kinfra Industrial Park',
      'Meenamkulam, St. Xavier’s College',
      'Thiruvananthapuram, Kerala – 695586',
    ],
  },
  {
    title: 'USA Office',
    lines: [
      'Industron Technical Services Inc',
      'Suite 132, 4445 West 77th Street',
      'Edina, MN 55435',
    ],
  },
]

export default function ContactPage() {
  return (
    <main className="contact-page">
      <SEOMeta
        title="Contact"
        description="Contact Industron for technical support, product guidance, material testing enquiries, or strategic collaborations. Offices in Trivandrum, India and Edina, MN, USA."
        canonical="https://www.industronnano.com/contact"
      />
      <PageHero
        tag="Contact"
        title="We'd love to"
        highlight="hear from you"
        lead="General enquiries, product guidance, and technical support — reach us at sales@industronnano.com."
        badges={['Response < 1 business day', 'India · USA']}
      />

      {/* General contact */}
      <section className="page-section">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">Get in touch</div>
            <h2>General contact</h2>
            <p>For any enquiry, email us and we’ll route it to the right team.</p>
          </motion.div>

          <motion.div
            className="contact-page-grid contact-page-grid--single"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.article className="contact-page-card" variants={fadeUp}>
              <div className="contact-page-card-icon" aria-hidden="true">✉</div>
              <h3>Contact</h3>
              <dl className="contact-page-dl">
                <dt>Email</dt>
                <dd>
                  <a href="mailto:sales@industronnano.com">sales@industronnano.com</a>
                </dd>
                <dt>India office</dt>
                <dd><a href="tel:+914712786500">+91 471 278 6500</a></dd>
                <dt>USA office</dt>
                <dd><a href="tel:+19522216227">+1 952 221 6227</a></dd>
              </dl>
              <div className="contact-page-actions">
                <a href="mailto:sales@industronnano.com" className="btn-primary">
                  Send email <span aria-hidden="true">→</span>
                </a>
                <Link to="/brochure-form" className="btn-ghost">
                  Request a brochure
                </Link>
                <Link to="/testing-form" className="btn-ghost">
                  Sample testing form
                </Link>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* Offices */}
      <section className="page-section page-section-alt">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">Visit us</div>
            <h2>Office locations</h2>
            <p>Operations and support facilities serving customers across global regions, including India and the USA.</p>
          </motion.div>

          <motion.div
            className="contact-offices-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {OFFICES.map((office) => (
              <motion.article
                key={office.title}
                className="contact-office-card"
                variants={fadeUp}
              >
                <div className="contact-office-pin" aria-hidden="true">◉</div>
                <h3>{office.title}</h3>
                <address>
                  {office.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder feedback */}
      <section className="page-section">
        <div className="container">
          <motion.article
            className="contact-founder-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/Website/Person/Asif.jpg"
              alt="Dr. Syed Asif S A"
              className="contact-founder-photo"
            />
            <div className="contact-founder-body">
              <div className="section-tag">Founder feedback</div>
              <h2>A direct line for strategic global feedback</h2>
              <p>
                For candid feedback, strategic collaborations, or when you simply want the
                founder&rsquo;s take — write directly to Dr. Syed Asif.
              </p>
              <div className="contact-founder-meta">
                <div>
                  <p className="contact-page-name">Dr. Syed Asif S A</p>
                  <p className="contact-page-role">Managing Director &amp; Founder</p>
                </div>
                <a href="mailto:asif@industronnano.com" className="btn-primary">
                  Email the MD <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </motion.article>
        </div>
      </section>
    </main>
  )
}
