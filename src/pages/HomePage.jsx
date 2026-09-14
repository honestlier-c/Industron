import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import About from '../components/About'
import Research from '../components/Research'
import Contact from '../components/Contact'
import SEOMeta from '../components/SEOMeta'
import { fadeUp, stagger } from '../motion/presets'

const STATS = [
  { value: '2011', label: 'Founded' },
  { value: '40+', label: 'Installations' },
  { value: '13+', label: 'IIT & IISc partners' },
  { value: '30+', label: 'Years of R&D' },
]

const FEATURED_PRODUCTS = [
  {
    slug: 'mesoprobe',
    name: 'MesoProbe',
    tag: 'Meso-scale',
    desc: 'Nanometre precision and integrated DIC on small samples — up to 600 °C.',
    image: '/Products_Image/MesoProbe.png',
  },
  {
    slug: 'uprobe-500',
    name: 'μProbe 500',
    tag: 'Education & research',
    desc: 'Depth-sensing micro indentation with automated mapping and 24-bit acquisition.',
    image: '/Products_Image/μProbe500.png',
  },
  {
    slug: 'ng80',
    name: 'NG80',
    tag: 'High-throughput',
    desc: 'Nanoindentation, SPM, and 300× faster high-speed indentation in one platform.',
    image: '/Products_Image/NG80.png',
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

      <div className="home-stats-strip">
        <div className="container home-stats-inner">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="home-stat-item"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
            >
              <span className="home-stat-value">{s.value}</span>
              <span className="home-stat-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <About />

      <section className="section home-products-section" id="products-highlight">
        <div className="container">
          <motion.div
            className="section-header home-products-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-tag">Instruments</div>
            <h2>
              Flagship systems for
              <br />
              <span className="gradient-text">every length scale</span>
            </h2>
            <p>
              From education labs to high-throughput research — three platforms that define Industron’s portfolio.
            </p>
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
                <Link to={`/products/${p.slug}`} className="home-product-link">
                  <div className="home-product-img-wrap">
                    <img src={p.image} alt={p.name} className="home-product-img" loading="lazy" />
                  </div>
                  <div className="home-product-body">
                    <span className="home-product-tag">{p.tag}</span>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <span className="home-product-cta-text">
                      View details <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
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
