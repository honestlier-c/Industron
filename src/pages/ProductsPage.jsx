import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PageCTA from '../components/PageCTA'
import { PRODUCTS } from '../data/products'
import { fadeUp } from '../motion/presets'
import SEOMeta from '../components/SEOMeta'

const CATEGORIES = ['All', 'Standalone', 'In-Situ', 'Education and Research', 'Desktop']

export default function ProductsPage() {
  const [active, setActive] = useState('All')

  const filtered = useMemo(
    () => (active === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active],
  )

  return (
    <main className="products-page">
      <SEOMeta
        title="Product Portfolio"
        description="Browse Industron's full portfolio of nanomechanical testing instruments — nanoindentation, in-situ SEM/TEM picoindentation, triboscopy, meso-scale testing, and education systems."
        canonical="https://www.industronnano.com/products"
      />
      <PageHero
        tag="Product Portfolio"
        title="Instruments built for"
        highlight="every scale of testing"
        lead="From tabletop nanoindentation to in-situ SEM and TEM systems, our portfolio supports high-precision mechanical testing across global R&D and industrial qualification programs."
        badges={['Nano · Micro · Meso', 'In-situ SEM/TEM', 'XPM Mapping', 'High-Temp / Cryo']}
        actions={
          <Link to="/contact" className="btn-ghost">
            Talk to a specialist
          </Link>
        }
      />

      <section className="page-section">
        <div className="container">
          <div className="products-filter" role="group" aria-label="Filter products by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={active === cat}
                className={`products-filter-chip${active === cat ? ' is-active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div className="products-grid" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map(
                ({ name, shortDesc, image, exploreTo, externalUrl, cardLogo, cardLogoAlt }, i) => (
                <motion.article
                  key={name}
                  layout
                  className="product-card"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="product-image-wrap">
                    <img src={image} alt={`${name} instrument`} className="product-image" loading="lazy" />
                  </div>
                  <h3>{name}</h3>
                  <p className="product-card-desc">{shortDesc}</p>
                  <div className="product-card-bottom">
                    <img
                      src={cardLogo}
                      alt={cardLogoAlt}
                      className="product-card-brand-logo"
                      loading="lazy"
                    />
                    {externalUrl ? (
                      <a
                        href={externalUrl}
                        className="btn-primary product-card-cta"
                        rel="noopener noreferrer"
                      >
                        Explore more <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <Link to={exploreTo} className="btn-primary product-card-cta">
                        Explore more <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <PageCTA
        tag="Next step"
        title="Need global specs support or a"
        highlight="recommendation?"
        lead="Our team can help you choose the right platform for your workflow — from university labs to multinational industrial research programs."
        primary={{ label: 'Request Global Technical Specs', href: '/contact' }}
        secondary={{ label: 'Talk to a Global Specialist', href: '/contact' }}
      />
    </main>
  )
}
