import { motion } from 'framer-motion'

const PRODUCTS = [
  {
    tag:      { label: 'SEM In-Situ', color: 'cyan' },
    name:     'Hysitron PI 89 SEM PicoIndenter',
    desc:     'The most advanced in-situ instrument for nanomechanical testing inside an SEM. Interchangeable xR transducers, encoded 1 nm stages, and 5-DoF sample positioning.',
    features: ['Max load: 10 mN, 500 mN, 3500 mN', 'Max displacement: 5 µm – 150 µm', '5-DoF rotation & tilt sample stage', 'High-temp (1000°C) & cryo (−130°C) options'],
  },
  {
    tag:      { label: 'Tabletop', color: 'purple' },
    name:     'Hysitron TI Premier',
    desc:     'The flagship tabletop nanoindenter combining high-resolution nanoindentation, in-situ SPM imaging, and nanotribology — with XPM accelerated property mapping at over 1 indent/sec.',
    features: ['Sub-nm displacement sensitivity', 'In-situ SPM for site-specific targeting', 'Accelerated property mapping (XPM)', 'Nanotribology & nanoscratch modules'],
  },
  {
    tag:      { label: 'Tabletop', color: 'cyan' },
    name:     'Hysitron TS 77 Select',
    desc:     'Essential toolkit for quantitative nanoscale-to-microscale mechanical and tribological characterization. Compact, modular, and fully equipped with in-situ SPM and XPM.',
    features: ['Max force: 10 mN | Max disp.: 5 µm', 'Z force noise: ≤ 250 nN | Z disp.: ≤ 1 nm', 'XPM at 2 indents/sec, 256×256 SPM scan', '3-plate capacitive transducer, DSP/FPGA controller'],
  },
  {
    tag:      { label: 'TEM In-Situ', color: 'purple' },
    name:     'Hysitron PI 95 TEM PicoIndenter',
    desc:     'Quantitative in-situ nanomechanical testing inside a TEM. Supports nanoindentation, pillar compression, Push-to-Pull tensile, 2D tribology, and fatigue at atomic resolution.',
    features: ['MEMS transducer: <200 nN, <1 nm', 'Push-to-Pull (PTP) tensile device', 'In-situ TEM tribology (2D MEMS)', 'EBSD, TKD and STEM compatible'],
  },
  {
    tag:      { label: 'Custom System', color: 'cyan' },
    name:     'NG80 In-Situ Optical System',
    desc:     "Industron's own custom instrument integrating optical video microscopy with high-resolution load cells and precise XY stages for nano-to-meso scale in-situ deformation tracking.",
    features: ['Machine stiffness >10⁶ N/m', 'DIC-based deformation tracking', 'Particle compression & beam bending', 'Creep, fatigue & fracture toughness'],
  },
]

export default function Products() {
  return (
    <section className="section" id="products" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-tag">Instrument Portfolio</div>
          <h2>
            Instruments built for<br />
            <span className="gradient-text">every scale of testing</span>
          </h2>
          <p>
            From tabletop nanoindentation to in-situ SEM &amp; TEM testing at extreme
            temperatures — Industron's portfolio covers the full spectrum of
            nanomechanical characterization.
          </p>
        </motion.div>

        <div className="products-grid">
          {PRODUCTS.map(({ tag, name, desc, features }, i) => (
            <motion.div
              key={name}
              className="product-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
            >
              <span className={`product-tag ${tag.color}`}>{tag.label}</span>
              <h3>{name}</h3>
              <p>{desc}</p>
              <div className="product-features">
                {features.map(f => (
                  <div className="product-feature" key={f}>{f}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
