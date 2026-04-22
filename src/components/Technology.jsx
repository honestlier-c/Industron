import { useRef } from 'react'
import { motion } from 'framer-motion'

const TECH = [
  {
    icon: '◈',
    title: 'High-Resolution Transducers',
    desc: 'Proprietary 3-plate capacitive transducers with electrostatic actuation and sub-nanometer displacement sensing. Force resolution <200 nN, displacement <1 nm.',
  },
  {
    icon: '⊙',
    title: 'Precision Positioning Stages',
    desc: 'Motorized XYZ stages with 1 nm resolution using stepper, servo, and piezo actuators. Enables site-specific indentation with ±10 nm positioning accuracy.',
  },
  {
    icon: '▣',
    title: 'In-Situ SEM / TEM Testing',
    desc: 'Real-time nanomechanical testing inside scanning and transmission electron microscopes — directly correlating mechanical response with microstructural observation.',
  },
  {
    icon: '◇',
    title: 'Embedded Control Systems',
    desc: 'High-performance DSP and FPGA-based embedded controllers with multi-core architecture and high-voltage drives for piezo stack actuators and flexure stages.',
  },
  {
    icon: '○',
    title: 'Vibration Isolation',
    desc: 'Active and passive vibration isolation systems using negative-stiffness mechanisms, acoustic enclosures, and thermal drift compensation for stable sub-nm testing.',
  },
  {
    icon: '◻',
    title: 'In-Situ Optical Testing',
    desc: 'Optical video microscopy integrated with high-resolution load cells and DIC-based deformation tracking — from particle compression to beam bending and creep.',
  },
]

function TechCard({ icon, title, desc, index }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) / rect.width
    const y = (e.clientY - rect.top  - rect.height / 2) / rect.height
    card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`
  }
  const handleMouseLeave = () => {
    cardRef.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)'
  }

  return (
    <motion.div
      ref={cardRef}
      className="tech-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
    >
      <div className="tech-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="tech-more">
        Learn more <span className="tech-arrow">→</span>
      </span>
    </motion.div>
  )
}

export default function Technology() {
  return (
    <section className="section" id="technology">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-tag">Core Capabilities</div>
          <h2>
            Technology built for<br />
            <span className="gradient-text">the nano frontier</span>
          </h2>
          <p>
            Six core technology pillars that power Industron's nanomechanical
            testing instruments — delivering unmatched resolution, repeatability,
            and in-situ characterization capability.
          </p>
        </motion.div>

        <div className="tech-grid">
          {TECH.map((item, i) => (
            <TechCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
