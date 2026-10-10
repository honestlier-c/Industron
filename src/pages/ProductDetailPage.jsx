import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'
import { PRODUCT_BY_SLUG } from '../data/products'
import { DEFAULT_SCROLL_BEATS, getBeatOpacity } from '../data/scrollBeats'
import { useScrollSequence } from '../hooks/useScrollSequence'
import { fadeUp, stagger } from '../motion/presets'
import { buildScrollFrameUrls } from '../utils/scrollFrameUrls'

function useViewportMode() {
  const [mode, setMode] = useState(null) // null | 'mobile' | 'desktop'
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMode(mq.matches ? 'mobile' : 'desktop')
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])
  return mode
}

function BeatCopy({ beatKey, beatFrames, totalFrames, progress, className, children }) {
  const opacity = useTransform(progress, (p) => getBeatOpacity(p, beatFrames, beatKey, totalFrames))
  const y = useTransform(opacity, (o) => 28 * (1 - o))
  const pointerEvents = useTransform(opacity, (o) => (o > 0.08 ? 'auto' : 'none'))

  return (
    <motion.div
      className={`meso-copy meso-copy--motion ${className}`}
      style={{ opacity, y, pointerEvents }}
    >
      {children}
    </motion.div>
  )
}

/* ── External redirect page ─────────────────────────────────────────── */
function RedirectPage({ name }) {
  return (
    <main className="meso-page">
      <div className="container redirect-notice">
        <p className="redirect-notice__text">
          Redirecting to the manufacturer product page for {name}…
        </p>
      </div>
    </main>
  )
}

function productJsonLd(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc,
    image: `https://www.industronnano.com${product.image}`,
    url: `https://www.industronnano.com/products/${product.slug}`,
    brand: { '@type': 'Brand', name: 'Industron' },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `https://www.industronnano.com/contact`,
    },
  }
}

/* ── Scroll-sequence detail (MesoProbe style) ───────────────────────── */
function SequenceDetailPage({ product }) {
  const { name, slug, shortDesc, hero, beats, info } = product

  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)

  const frameUrls = useMemo(
    () =>
      buildScrollFrameUrls({
        framesFolder: product.framesFolder,
        frameCount: product.frameCount,
        frameNaming: product.frameNaming ?? 'ezgif',
        sourceFrameCount: product.sourceFrameCount,
        playbackFrameCount: product.playbackFrameCount,
      }),
    [
      product.frameCount,
      product.framesFolder,
      product.frameNaming,
      product.sourceFrameCount,
      product.playbackFrameCount,
    ],
  )

  const beatFrames = product.scrollBeats ?? DEFAULT_SCROLL_BEATS
  const scrollProgress = useMotionValue(0)

  useScrollSequence({
    sectionRef,
    canvasRef,
    frameUrls,
    enabled: true,
    progressMotion: scrollProgress,
    frameBackground: product.frameBackground,
  })

  return (
    <main className="meso-page">
      <SEOMeta
        title={name}
        description={shortDesc}
        canonical={`https://www.industronnano.com/products/${slug}`}
        type="product"
        jsonld={productJsonLd(product)}
      />
      <PageHero
        tag={hero.tag}
        title={hero.title}
        highlight={hero.highlight}
        lead={hero.lead}
        badges={hero.badges}
        actions={
          <>
            <a href="#overview" className="btn-primary">
              View details <span aria-hidden="true">→</span>
            </a>
            <Link to="/contact" className="btn-ghost">
              Talk to a specialist
            </Link>
          </>
        }
      />

      <section id="overview" className="meso-sequence" ref={sectionRef}>
        <div className="meso-sticky">
          <canvas ref={canvasRef} aria-label={`${name} product visual`} />

          <BeatCopy beatKey="intro" beatFrames={beatFrames} totalFrames={product.frameCount} progress={scrollProgress} className="meso-copy--right">
            <p className="meso-kicker">{beats.intro.kicker}</p>
            <h2>{beats.intro.heading}</h2>
            <p className="meso-sub">{beats.intro.sub}</p>
          </BeatCopy>

          <BeatCopy beatKey="engineering" beatFrames={beatFrames} totalFrames={product.frameCount} progress={scrollProgress} className="meso-copy--left">
            <p className="meso-kicker">{beats.engineering.kicker}</p>
            <h2>{beats.engineering.heading}</h2>
            <p>{beats.engineering.text}</p>
          </BeatCopy>

          <BeatCopy beatKey="control" beatFrames={beatFrames} totalFrames={product.frameCount} progress={scrollProgress} className="meso-copy--right">
            <p className="meso-kicker">{beats.control.kicker}</p>
            <h2>{beats.control.heading}</h2>
            <p>{beats.control.text}</p>
          </BeatCopy>

          <BeatCopy beatKey="performance" beatFrames={beatFrames} totalFrames={product.frameCount} progress={scrollProgress} className="meso-copy--left">
            <p className="meso-kicker">{beats.performance.kicker}</p>
            <h2>{beats.performance.heading}</h2>
            <p>{beats.performance.text}</p>
          </BeatCopy>

          <BeatCopy beatKey="final" beatFrames={beatFrames} totalFrames={product.frameCount} progress={scrollProgress} className="meso-copy--left meso-copy--final">
            <p className="meso-kicker">{beats.final.kicker}</p>
            <h2>{beats.final.heading}</h2>
            <p>{beats.final.text}</p>
            <motion.div className="meso-final-actions">
              <a href="#buy" className="meso-cta">Configure {name}</a>
              <Link to="/contact" className="meso-link">Talk to an application specialist</Link>
            </motion.div>
          </BeatCopy>
        </div>
      </section>

      <InfoSection
        info={info}
        name={name}
        slug={slug}
        layout={product.infoLayout}
        section={product.infoSection}
        brochureUrl={product.brochureUrl}
      />
    </main>
  )
}

/* ── Software detail (workflow / modules — not accessory datasheet) ─ */
function SoftwareDetailPage({ product }) {
  const {
    name,
    slug,
    shortDesc,
    hero,
    info = [],
    workflow = [],
    outputs = [],
    platforms = [],
    applications = [],
    category,
  } = product

  return (
    <main className="soft-page">
      <SEOMeta
        title={name}
        description={shortDesc}
        canonical={`https://www.industronnano.com/products/${slug}`}
        type="product"
        jsonld={productJsonLd(product)}
      />

      <section className="soft-hero">
        <div className="container soft-hero-grid">
          <motion.div
            className="soft-hero-copy"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div className="soft-eyebrow" variants={fadeUp}>
              <Link to="/products" className="soft-crumb">
                Products
              </Link>
              <span aria-hidden="true">/</span>
              <span>{category}</span>
            </motion.div>
            <motion.p className="soft-kicker" variants={fadeUp}>
              Analysis software
            </motion.p>
            <motion.h1 variants={fadeUp}>{name}</motion.h1>
            {hero?.highlight && (
              <motion.p className="soft-hero-highlight" variants={fadeUp}>
                {hero.highlight}
              </motion.p>
            )}
            <motion.p className="soft-hero-lead" variants={fadeUp}>
              {hero?.lead || shortDesc}
            </motion.p>
            {hero?.badges?.length > 0 && (
              <motion.ul className="soft-badges" variants={fadeUp}>
                {hero.badges.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </motion.ul>
            )}
            <motion.div className="soft-hero-actions" variants={fadeUp}>
              <Link to="/contact" className="btn-primary">
                Discuss your workflow <span aria-hidden="true">→</span>
              </Link>
              {product.brochureUrl && (
                <Link to={`/brochure-form?product=${slug}`} className="btn-ghost">
                  Request brochure
                </Link>
              )}
            </motion.div>
          </motion.div>

          <motion.aside
            className="soft-panel"
            aria-label="Analysis preview"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="soft-panel-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <em>DIC workspace</em>
            </div>
            <div className="soft-panel-body">
              <div className="soft-panel-viz" aria-hidden="true">
                <div className="soft-heatmap" />
                <div className="soft-gridlines" />
                <div className="soft-roi" />
              </div>
              <ul className="soft-panel-stats">
                <li>
                  <strong>Full-field</strong>
                  <span>Strain map</span>
                </li>
                <li>
                  <strong>E</strong>
                  <span>Modulus</span>
                </li>
                <li>
                  <strong>ε(t)</strong>
                  <span>Creep</span>
                </li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </section>

      {workflow.length > 0 && (
        <section className="soft-section soft-section--workflow">
          <div className="container">
            <header className="soft-section-head">
              <p className="section-tag">Workflow</p>
              <h2>From images to mechanics</h2>
              <p>A clear path from optical capture to report-ready results.</p>
            </header>
            <ol className="soft-workflow">
              {workflow.map((step, i) => (
                <li key={step.title}>
                  <span className="soft-step-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {info.length > 0 && (
        <section className="soft-section">
          <div className="container">
            <header className="soft-section-head">
              <p className="section-tag">Capabilities</p>
              <h2>What the software delivers</h2>
            </header>
            <div className="soft-modules">
              {info.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  {item.text && <p>{item.text}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {(outputs.length > 0 || platforms.length > 0) && (
        <section className="soft-section soft-section--split">
          <div className="container soft-split">
            {outputs.length > 0 && (
              <div>
                <header className="soft-section-head">
                  <p className="section-tag">Outputs</p>
                  <h2>Results you can use</h2>
                </header>
                <ul className="soft-outputs">
                  {outputs.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            )}
            {platforms.length > 0 && (
              <div>
                <header className="soft-section-head">
                  <p className="section-tag">Platform fit</p>
                  <h2>Works with</h2>
                </header>
                <ul className="soft-platforms">
                  {platforms.map((p) => (
                    <li key={p.name}>
                      {p.to ? (
                        <Link to={p.to}>
                          <strong>{p.name}</strong>
                          <span>{p.text}</span>
                        </Link>
                      ) : (
                        <>
                          <strong>{p.name}</strong>
                          <span>{p.text}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {applications.length > 0 && (
        <section className="soft-section soft-section--apps">
          <div className="container">
            <header className="soft-section-head soft-section-head--center">
              <p className="section-tag">Best for</p>
              <h2>When point sensors are not enough</h2>
            </header>
            <ul className="soft-apps">
              {applications.map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="soft-buy">
        <div className="container soft-buy-inner">
          <div>
            <p className="section-tag">Next step</p>
            <h2>Set up DIC for your lab</h2>
            <p>
              Share your camera setup, sample type, and test modes — we will recommend patterning,
              analysis packages, and platform pairing.
            </p>
          </div>
          <div className="soft-buy-actions">
            <Link to="/contact" className="btn-primary">
              Talk to applications
            </Link>
            {product.brochureUrl && (
              <Link to={`/brochure-form?product=${slug}`} className="btn-ghost">
                Request brochure
              </Link>
            )}
            <Link to="/products" className="soft-back">
              ← Product portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ── Catalog detail (accessories + mobile instruments) ────────────── */
function CatalogDetailPage({ product }) {
  const {
    name,
    slug,
    shortDesc,
    hero,
    info = [],
    features,
    image,
    metrics = [],
    specs = [],
    applications = [],
    category,
  } = product

  const featureItems = features?.length
    ? features
    : info.filter((item) => item.text)

  const related = useMemo(
    () =>
      Object.values(PRODUCT_BY_SLUG).filter(
        (p) =>
          p.slug !== slug &&
          !p.externalUrl &&
          p.category === category &&
          (p.layout === 'catalog' || p.frameCount || p.features || p.specs),
      ).slice(0, 3),
    [category, slug],
  )

  const isAccessory = category === 'Accessories'

  return (
    <main className="catalog-page">
      <SEOMeta
        title={name}
        description={shortDesc}
        canonical={`https://www.industronnano.com/products/${slug}`}
        type="product"
        jsonld={productJsonLd(product)}
      />

      <section className="catalog-hero">
        <div className="container catalog-hero-grid">
          <motion.div
            className="catalog-hero-copy"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div className="catalog-eyebrow" variants={fadeUp}>
              <Link to="/products" className="catalog-crumb">
                Products
              </Link>
              <span aria-hidden="true">/</span>
              <span>{category}</span>
            </motion.div>
            <motion.h1 variants={fadeUp}>{name}</motion.h1>
            {hero?.highlight && (
              <motion.p className="catalog-hero-highlight" variants={fadeUp}>
                {hero.highlight}
              </motion.p>
            )}
            <motion.p className="catalog-hero-lead" variants={fadeUp}>
              {hero?.lead || shortDesc}
            </motion.p>
            {hero?.badges?.length > 0 && (
              <motion.ul className="catalog-badges" variants={fadeUp}>
                {hero.badges.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </motion.ul>
            )}
            <motion.div className="catalog-hero-actions" variants={fadeUp}>
              <Link to="/contact" className="btn-primary">
                Request consultation <span aria-hidden="true">→</span>
              </Link>
              {product.brochureUrl && (
                <Link to={`/brochure-form?product=${slug}`} className="btn-ghost">
                  Request brochure
                </Link>
              )}
              <a href="#specs" className="catalog-jump">
                Specs
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="catalog-hero-media"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            <div className="catalog-hero-media-glow" aria-hidden="true" />
            <img src={image} alt={name} loading="eager" decoding="async" />
          </motion.div>
        </div>

        {metrics.length > 0 && (
          <div className="container">
            <ul className="catalog-metrics" aria-label="Key specifications">
              {metrics.map((m) => (
                <li key={m.label}>
                  <strong>
                    {m.value}
                    {m.unit && <span>{m.unit}</span>}
                  </strong>
                  <em>{m.label}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section id="specs" className="catalog-section">
        <div className="container catalog-split">
          {specs.length > 0 && (
            <div className="catalog-panel">
              <header className="catalog-section-head">
                <p className="section-tag">Specifications</p>
                <h2>Technical details</h2>
              </header>
              <dl className="catalog-specs">
                {specs.map(({ label, value }) => (
                  <div key={label} className="catalog-spec-row">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {featureItems.length > 0 && (
            <div className="catalog-panel">
              <header className="catalog-section-head">
                <p className="section-tag">Key features</p>
                <h2>Built for the lab</h2>
              </header>
              <ol className="catalog-feature-list">
                {featureItems.map((item, i) => (
                  <li key={item.title}>
                    <span className="catalog-feature-num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      {item.text && <p>{item.text}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {applications.length > 0 && (
        <section className="catalog-section catalog-section--apps">
          <div className="container">
            <header className="catalog-section-head catalog-section-head--center">
              <p className="section-tag">Applications</p>
              <h2>Ideal for</h2>
            </header>
            <ul className="catalog-apps">
              {applications.map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="catalog-section">
          <div className="container">
            <header className="catalog-section-head">
              <p className="section-tag">Also in {category}</p>
              <h2>Related products</h2>
            </header>
            <div className="catalog-related">
              {related.map((item) => (
                <Link key={item.slug} to={item.exploreTo} className="catalog-related-card">
                  <div className="catalog-related-media">
                    <img src={item.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.shortDesc}</p>
                    <span>View details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="buy" className="catalog-buy">
        <div className="container catalog-buy-inner">
          <div>
            <p className="section-tag">Next step</p>
            <h2>Configure {name}</h2>
            <p>
              {isAccessory
                ? 'Tell us your payload, footprint, and lab environment — we will recommend the right isolation setup.'
                : 'Share your sample type, load range, and target test modes — we will recommend a complete configuration.'}
            </p>
          </div>
          <div className="catalog-buy-actions">
            <Link to="/contact" className="btn-primary">
              Talk to a specialist
            </Link>
            {product.brochureUrl && (
              <Link to={`/brochure-form?product=${slug}`} className="btn-ghost">
                Request brochure
              </Link>
            )}
            <Link to="/products" className="catalog-back">
              ← Product portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ── Static detail (products without a frame sequence) ─────────────── */
function StaticDetailPage({ product }) {
  const { name, slug, shortDesc, hero, beats, info } = product

  const beatsOrder = ['intro', 'engineering', 'control', 'performance', 'final']

  return (
    <main className="meso-page">
      <SEOMeta
        title={name}
        description={shortDesc}
        canonical={`https://www.industronnano.com/products/${slug}`}
        type="product"
        jsonld={productJsonLd(product)}
      />
      <PageHero
        tag={hero.tag}
        title={hero.title}
        highlight={hero.highlight}
        lead={hero.lead}
        badges={hero.badges}
        actions={
          <>
            <a href="#overview" className="btn-primary">
              View details <span aria-hidden="true">→</span>
            </a>
            <Link to="/contact" className="btn-ghost">
              Talk to a specialist
            </Link>
          </>
        }
      />

      <section id="overview" className="page-section">
        <div className="container">
          {beatsOrder.map((key) => {
            const beat = beats[key]
            if (!beat) return null
            return (
              <motion.div
                key={key}
                className="static-beat"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                <motion.p className="meso-kicker" variants={fadeUp}>{beat.kicker}</motion.p>
                <motion.h2 variants={fadeUp}>{beat.heading}</motion.h2>
                {beat.sub && (
                  <motion.p className="meso-sub" variants={fadeUp}>{beat.sub}</motion.p>
                )}
                {beat.text && (
                  <motion.p variants={fadeUp}>{beat.text}</motion.p>
                )}
                {key === 'final' && (
                  <motion.div className="meso-final-actions" variants={fadeUp}>
                    <a href="#buy" className="meso-cta">Configure {name}</a>
                    <Link to="/contact" className="meso-link">Talk to an application specialist</Link>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      <InfoSection
        info={info}
        name={name}
        slug={product.slug}
        layout={product.infoLayout}
        section={product.infoSection}
        brochureUrl={product.brochureUrl}
      />
    </main>
  )
}

/* ── Shared info + buy sections ─────────────────────────────────────── */
function InfoSection({ info, name, slug, layout, section, brochureUrl }) {
  const isTrack = layout === 'track'
  const trackLoop = isTrack ? [...info, ...info] : info

  return (
    <>
      <section
        id="technology"
        className={`meso-info${isTrack ? ' meso-info--track' : ''}`}
      >
        <motion.div className="container">
          {isTrack && section && (
            <motion.div
              className="section-header meso-info-head"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-tag">{section.tag}</div>
              <h2>
                {section.title}
                <br />
                <span className="gradient-text">{section.highlight}</span>
              </h2>
            </motion.div>
          )}

          {isTrack ? (
            <motion.div
              className="test-modes-marquee"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div className="test-modes-track" aria-label={`${name} test modes`}>
                {trackLoop.map((item, idx) => (
                  <article
                    className={`test-mode-card${item.image ? ' test-mode-card--image' : ''}`}
                    key={`${item.title}-${idx}`}
                  >
                    {item.image ? (
                      <>
                        <h3>{item.title}</h3>
                        <img src={item.image} alt="" loading="lazy" decoding="async" />
                      </>
                    ) : (
                      <>
                        <h3>{item.title}</h3>
                        {item.text && <p>{item.text}</p>}
                      </>
                    )}
                  </article>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="meso-info-grid">
              {info.map((item) => (
                <article
                  key={item.title}
                  className={item.image ? 'meso-info-card--image' : undefined}
                >
                  {item.image ? (
                    <>
                      <h3>{item.title}</h3>
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                    </>
                  ) : (
                    <>
                      <h3>{item.title}</h3>
                      {item.text && <p>{item.text}</p>}
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <section id="buy" className="meso-buy">
        <div className="container">
          <p className="meso-kicker">Next step</p>
          <h2>Plan your {name} configuration</h2>
          <p>
            Share your sample type, load range, and target test modes. We will recommend a complete
            hardware and support package.
          </p>
          <div className="meso-buy-actions">
            <Link to="/contact" className="meso-cta">Request Technical Consultation</Link>
            {brochureUrl && (
              <Link
                to={`/brochure-form?product=${slug}`}
                className="meso-cta meso-cta--brochure"
              >
                Request Brochure
              </Link>
            )}
            <Link to="/products" className="meso-link">Back to Product Portfolio</Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Route entry point ──────────────────────────────────────────────── */
export default function ProductDetailPage() {
  const { productSlug } = useParams()
  const product = PRODUCT_BY_SLUG[productSlug]
  const viewport = useViewportMode()

  useEffect(() => {
    if (product?.externalUrl) {
      window.location.replace(product.externalUrl)
    }
  }, [product?.externalUrl])

  useEffect(() => {
    document.body.classList.remove('brochure-fullpage')
  }, [productSlug])

  if (!product) return <Navigate to="/products" replace />

  if (product.externalUrl) return <RedirectPage name={product.name} />

  // Scroll-sequence instruments: story page on desktop, catalog page on mobile.
  if (product.frameCount) {
    if (viewport === null) {
      return (
        <main className="catalog-page">
          <SEOMeta
            title={product.name}
            description={product.shortDesc}
            canonical={`https://www.industronnano.com/products/${product.slug}`}
            type="product"
          />
          <div className="container catalog-viewport-wait" aria-busy="true">
            <p>Loading…</p>
          </div>
        </main>
      )
    }
    if (viewport === 'mobile') return <CatalogDetailPage product={product} />
    return <SequenceDetailPage product={product} />
  }

  if (product.layout === 'software' || product.category === 'Software') {
    return <SoftwareDetailPage product={product} />
  }

  if (product.layout === 'catalog' || product.category === 'Accessories') {
    return <CatalogDetailPage product={product} />
  }

  return <StaticDetailPage product={product} />
}
