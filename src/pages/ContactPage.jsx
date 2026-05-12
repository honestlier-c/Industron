import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'

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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function ContactPage() {
  return (
    <main className="contact-page">
      <PageHero
        tag="Contact"
        title="We'd love to"
        highlight="hear from you"
        lead="General enquiries, technical support, product guidance, and advanced material testing — connect with the right global team below."
        badges={['Response < 1 business day', 'India · USA', 'Lab services', 'Founder access']}
      />

      {/* Primary contacts */}
      <section className="page-section">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">Who to contact</div>
            <h2>Reach the right team</h2>
            <p>Each desk is monitored by named specialists — your enquiry is routed quickly to the right regional or technical team.</p>
          </motion.div>

          <motion.div
            className="contact-page-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.article className="contact-page-card" variants={fadeUp}>
              <div className="contact-page-card-icon" aria-hidden="true">✉</div>
              <h3>General contact</h3>
              <p className="contact-page-card-sub">For anything unspecific, partnerships, or quick questions.</p>
              <dl className="contact-page-dl">
                <dt>Email</dt>
                <dd><a href="mailto:info@industronnano.com">info@industronnano.com</a></dd>
                <dt>India office</dt>
                <dd><a href="tel:+914712786500">+91 471 278 6500</a></dd>
                <dt>USA office</dt>
                <dd><a href="tel:+19522216227">+1 95 222 16 227</a></dd>
              </dl>
            </motion.article>

            <motion.article className="contact-page-card" variants={fadeUp}>
              <div className="contact-page-card-icon" aria-hidden="true">⚙</div>
              <h3>Technical support &amp; product expert</h3>
              <p className="contact-page-card-sub">
                For service, installation, calibration, and product recommendation.
              </p>
              <div className="contact-page-person">
                <p className="contact-page-name">Pratyank Rastogi</p>
                <p className="contact-page-role">Manager · Sales &amp; Service</p>
                <dl className="contact-page-dl">
                  <dt>Email</dt>
                  <dd><a href="mailto:pratyank@industronnano.com">pratyank@industronnano.com</a></dd>
                  <dt>Phone</dt>
                  <dd><a href="tel:+919048542221">+91 9048542221</a></dd>
                </dl>
              </div>
            </motion.article>

            <motion.article className="contact-page-card" variants={fadeUp}>
              <div className="contact-page-card-icon" aria-hidden="true">◈</div>
              <h3>Advanced material testing</h3>
              <p className="contact-page-card-sub">
                For lab services, sample testing, and application discussions.
              </p>
              <div className="contact-page-person">
                <p className="contact-page-name">Kiran Raphael</p>
                <p className="contact-page-role">Application Engineer</p>
                <dl className="contact-page-dl">
                  <dt>Email</dt>
                  <dd><a href="mailto:kp@industronnano.com">kp@industronnano.com</a></dd>
                  <dt>Phone</dt>
                  <dd><a href="tel:+919447311243">+91 9447311243</a></dd>
                </dl>
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
