import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import About from '../components/About'
import Research from '../components/Research'
import Contact from '../components/Contact'
import SEOMeta from '../components/SEOMeta'
import { fadeUp, stagger } from '../motion/presets'

const STATS = [
  { value: '2011', label: 'Year founded' },
  { value: '40+', label: 'Global installations' },
  { value: '13+', label: 'IIT & IISc collaborations' },
  { value: '30+', label: 'Years of R&D expertise' },
]

const FEATURED_PRODUCTS = [
  {
    slug: 'mesoprobe',
    name: 'MesoProbe',
    tag: 'Meso-scale testing',
    desc: 'High-temperature in-situ optical meso mechanical testing with DIC strain analysis — indentation, compression, tensile, bending, and fatigue up to 600 °C.',
    image: '/Products_Image/MesoProbe.png',
    badge: 'DIC · High throughput',
  },
  {
    slug: 'uprobe-500',
    name: 'μProbe 500',
    tag: 'Education & research',
    desc: 'Depth-sensing micro-indenter for hardness, modulus, partial unload, and advanced materials characterization at up to 500 mN — with automated multi-point mapping.',
    image: '/Products_Image/μProbe500.png',
    badge: '500 mN · Automated',
  },
  {
    slug: 'ng80',
    name: 'NG80',
    tag: 'Desktop NanoGuru®',
    desc: 'High-precision desktop nanomechanical testing platform with in-situ SPM for surface topography, nanoscale property mapping, and undergraduate-to-research workflows.',
    image: '/Products_Image/NG80.png',
    badge: 'Desktop · NanoGuru®',
  },
]

export default function HomePage() {
  return (
    <>
      <SEOMeta
        title="Nanomechanical Testing Instruments"
        description="Industron — India's leading provider of nanomechanical testing instruments. Nanoindentation, in-situ SEM/TEM, tribology, and meso-scale testing for global R&D and industry."
        canonical="https://www.industronnano.com/"
      />

      <Hero />

      {/* Stats strip */}
      <div className="home-stats-strip">
        <div className="container home-stats-inner">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="home-stat-item"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <span className="home-stat-value">{s.value}</span>
              <span className="home-stat-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <About />

      {/* Featured products */}
      <section className="section home-products-section" id="products-highlight">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-tag">Instruments</div>
            <h2>
              Our flagship<br />
              <span className="gradient-text">products</span>
            </h2>
          </motion.div>

          <motion.div
            className="home-products-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
          >
            {FEATURED_PRODUCTS.map((p) => (
              <motion.article key={p.slug} className="home-product-card" variants={fadeUp}>
                <div className="home-product-img-wrap">
                  <img src={p.image} alt={p.name} className="home-product-img" />
                </div>
                <div className="home-product-body">
                  <span className="home-product-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="home-product-footer">
                    <span className="home-product-badge">{p.badge}</span>
                    <Link to={`/products/${p.slug}`} className="btn-primary home-product-cta">
                      View details →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            className="home-products-all"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/products" className="btn-ghost">
              View full product portfolio →
            </Link>
          </motion.div>
        </div>
      </section>

      <Research />
      <Contact />
    </>
  )
}
