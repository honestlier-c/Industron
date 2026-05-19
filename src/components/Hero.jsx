import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <motion.div
        className="container hero-inner"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <div className="hero-content">
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            High-Performance<br />
            Nanomechanical Testing Instruments<br />
            for Research &amp; Industry
          </motion.h1>

          <motion.p className="hero-sub" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Chosen by research institutions, engineering teams, and advanced manufacturers worldwide for high-precision nanomechanical characterization across next-generation materials and devices.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <a href="#about" className="btn-primary">
              Explore Solutions <span aria-hidden="true">→</span>
            </a>
            <Link to="/contact" className="btn-ghost">
              Request Global Demo
            </Link>
            <Link to="/testing-form" className="btn-ghost">
              Get Your Material Tested
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero-media"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          aria-hidden="true"
        >
          <video
            src="/My Movie.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
