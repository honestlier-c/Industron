import { motion } from 'framer-motion'
import FuturisticWaveDots from './FuturisticWaveDots'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function PageHero({
  tag,
  title,
  highlight,
  lead,
  actions,
  badges,
  align = 'center',
  size = 'md',
}) {
  return (
    <section className={`page-hero page-hero--${align} page-hero--${size}`}>
      <div className="page-hero-bg" aria-hidden="true">
        <div className="page-hero-orb page-hero-orb--a" />
        <div className="page-hero-orb page-hero-orb--b" />
        <div className="page-hero-grid" />
        <FuturisticWaveDots className="page-hero-dots" />
      </div>

      <div className="container">
        <motion.div
          className="page-hero-inner"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {tag && (
            <motion.div className="section-tag" variants={fadeUp}>
              {tag}
            </motion.div>
          )}

          <motion.h1 className="page-hero-title" variants={fadeUp}>
            {title}
            {highlight && (
              <>
                <br />
                <span className="gradient-text">{highlight}</span>
              </>
            )}
          </motion.h1>

          {lead && (
            <motion.p className="page-hero-lead" variants={fadeUp}>
              {lead}
            </motion.p>
          )}

          {badges && badges.length > 0 && (
            <motion.div className="page-hero-badges" variants={fadeUp}>
              {badges.map((b) => (
                <span key={b} className="page-hero-badge">{b}</span>
              ))}
            </motion.div>
          )}

          {actions && (
            <motion.div className="page-hero-actions" variants={fadeUp}>
              {actions}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
