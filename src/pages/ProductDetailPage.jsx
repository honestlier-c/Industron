import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'
import { PRODUCT_BY_SLUG } from '../data/products'
import { getBrochureUrl } from '../data/brochures'
import { DEFAULT_SCROLL_BEATS, getBeatOpacity } from '../data/scrollBeats'
import { useScrollSequence } from '../hooks/useScrollSequence'
import { fadeUp, stagger } from '../motion/presets'
import { buildScrollFrameUrls } from '../utils/scrollFrameUrls'

const BrochureFlipbook = lazy(() => import('../components/BrochureFlipbook'))

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

/** Mobile: brochure flipbook only (MesoProbe / μProbe / NG80). */
function MobileBrochureOnlyPage({ product }) {
  const url = getBrochureUrl(product.slug)
  const { name, slug, shortDesc } = product

  return (
    <main className="meso-page meso-page--brochure-only">
      <SEOMeta
        title={name}
        description={shortDesc}
        canonical={`https://www.industronnano.com/products/${slug}`}
        type="product"
        jsonld={productJsonLd(product)}
      />
      <Suspense
        fallback={
          <div className="brochure-flip brochure-flip--full" aria-busy="true">
            <p className="brochure-flip-status">Opening brochure…</p>
          </div>
        }
      >
        <BrochureFlipbook url={url} title={`${name} brochure`} />
      </Suspense>
    </main>
  )
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
                Get Brochure
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
  const brochureUrl = product ? getBrochureUrl(product.slug) : null

  useEffect(() => {
    if (product?.externalUrl) {
      window.location.replace(product.externalUrl)
    }
  }, [product?.externalUrl])

  useEffect(() => {
    if (!brochureUrl || viewport === 'desktop') {
      document.body.classList.remove('brochure-fullpage')
      return undefined
    }
    document.body.classList.add('brochure-fullpage')
    return () => document.body.classList.remove('brochure-fullpage')
  }, [brochureUrl, viewport])

  if (!product) return <Navigate to="/products" replace />

  if (product.externalUrl) return <RedirectPage name={product.name} />

  // Mobile + brochure PDF: show only the scroll-to-flip book (no hero / specs / CTAs).
  if (brochureUrl && viewport === 'mobile') {
    return <MobileBrochureOnlyPage product={product} />
  }

  // Avoid flashing the full desktop page before we know the viewport.
  if (brochureUrl && viewport === null) {
    return (
      <main className="meso-page meso-page--brochure-only">
        <SEOMeta
          title={product.name}
          description={product.shortDesc}
          canonical={`https://www.industronnano.com/products/${product.slug}`}
          type="product"
        />
        <div className="brochure-flip brochure-flip--full" aria-busy="true">
          <p className="brochure-flip-status">Opening brochure…</p>
        </div>
      </main>
    )
  }

  if (product.frameCount) return <SequenceDetailPage product={product} />

  return <StaticDetailPage product={product} />
}
