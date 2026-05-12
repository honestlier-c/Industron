import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function isInternal(href = '') {
  return href.startsWith('/') && !href.startsWith('//')
}

function CTAButton({ action, variant }) {
  if (!action) return null
  const className = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  const arrow =
    variant === 'primary' ? (
      <>
        {' '}
        <span aria-hidden="true">→</span>
      </>
    ) : null

  if (isInternal(action.href)) {
    return (
      <Link to={action.href} className={className}>
        {action.label}
        {arrow}
      </Link>
    )
  }
  return (
    <a href={action.href} className={className}>
      {action.label}
      {arrow}
    </a>
  )
}

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
            <CTAButton action={primary} variant="primary" />
            <CTAButton action={secondary} variant="ghost" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
