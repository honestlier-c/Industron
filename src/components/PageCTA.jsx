import { motion } from 'framer-motion'

export default function PageCTA({
  tag = "Let's collaborate",
  title,
  highlight,
  lead,
  primary,
  secondary,
}) {
  return (
    <section className="page-cta-wrap">
      <div className="container">
        <motion.div
          className="page-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="page-cta-body">
            <div className="section-tag">{tag}</div>
            <h2>
              {title}
              {highlight && (
                <>
                  {' '}
                  <span className="gradient-text">{highlight}</span>
                </>
              )}
            </h2>
            {lead && <p>{lead}</p>}
          </div>
          <div className="page-cta-actions">
            {primary && (
              <a href={primary.href} className="btn-primary">
                {primary.label} <span aria-hidden="true">→</span>
              </a>
            )}
            {secondary && (
              <a href={secondary.href} className="btn-ghost">
                {secondary.label}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
