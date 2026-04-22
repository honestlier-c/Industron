import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-tag">Contact</div>
          <h2>
            To learn more about our<br />
            <span className="gradient-text">Products &amp; Services</span>
          </h2>
        </motion.div>

        <motion.div
          className="contact-home-teaser"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>
            For general enquiries, technical support, office locations, and team contacts,
            visit our full contact page.
          </p>
          <p className="contact-home-quick">
            <strong>Email:</strong>{' '}
            <a href="mailto:info@industronnano.com">info@industronnano.com</a>
            {' · '}
            <strong>India:</strong>{' '}
            <a href="tel:+914712786500">+91 471 278 6500</a>
          </p>
          <a href="/contact" className="btn-primary">
            View contact &amp; offices <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
