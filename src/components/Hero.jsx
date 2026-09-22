import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  }),
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-media" aria-hidden="true">
        <video
          src="/Homepage.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/Homepage-poster.jpg"
        />
        <div className="hero-media-scrim" />
      </div>

      <motion.div
        className="container hero-inner"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="hero-content">
          <motion.p className="hero-brand" variants={fadeUp} custom={0}>
            Industron
          </motion.p>

          <motion.h1 variants={fadeUp} custom={1}>
            Nanomechanical testing built for precision
          </motion.h1>

          <motion.p className="hero-sub" variants={fadeUp} custom={2}>
            Instruments and lab support for research and industry — from
            nanoindentation to meso-scale characterization.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp} custom={3}>
            <Link to="/products" className="btn-primary">
              Explore instruments <span aria-hidden="true">→</span>
            </Link>
            <Link to="/contact" className="btn-ghost">
              Request a demo
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
