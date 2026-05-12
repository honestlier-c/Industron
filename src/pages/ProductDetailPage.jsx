import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { PRODUCT_BY_SLUG } from '../data/products'

const MAX_FRAMES = 240
const MAX_CONSECUTIVE_MISSES = 6
const SCROLL_SMOOTHING_MS = 220

export default function ProductDetailPage() {
  const { productSlug } = useParams()
  const product = PRODUCT_BY_SLUG[productSlug]

  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const rafRef = useRef(0)
  const targetProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)
  const lastTimeRef = useRef(0)
  const [progress, setProgress] = useState(0)

  const framesFolder = product?.framesFolder || '/MesoProbe'

  const frameUrls = useMemo(
    () =>
      Array.from({ length: MAX_FRAMES }, (_, i) => {
        const id = String(i + 1).padStart(3, '0')
        return `${framesFolder}/ezgif-frame-${id}.jpg`
      }),
    [framesFolder],
  )

  const activeBeat = useMemo(() => {
    if (progress < 0.2) return 'intro'
    if (progress < 0.42) return 'engineering'
    if (progress < 0.64) return 'control'
    if (progress < 0.84) return 'performance'
    return 'final'
  }, [progress])

  useEffect(() => {
    if (!product?.externalUrl) return undefined
    window.location.replace(product.externalUrl)
    return undefined
  }, [product?.externalUrl])

  useEffect(() => {
    if (!product || product.externalUrl) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const renderFrame = (index) => {
      const img = imagesRef.current[index] || imagesRef.current[0]
      if (!img || !img.complete || img.naturalWidth === 0) return

      const viewportW = window.innerWidth
      const viewportH = window.innerHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const width = Math.floor(viewportW * dpr)
      const height = Math.floor(viewportH * dpr)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${viewportW}px`
        canvas.style.height = `${viewportH}px`
      }

      const targetW = viewportW
      const targetH = viewportH
      const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight)
      const drawW = img.naturalWidth * scale
      const drawH = img.naturalHeight * scale
      const dx = (targetW - drawW) * 0.5
      const dy = (targetH - drawH) * 0.5

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, targetW, targetH)
      ctx.drawImage(img, dx, dy, drawW, drawH)
    }

    const getScrollProgress = () => {
      const section = sectionRef.current
      if (!section) return 0
      const rect = section.getBoundingClientRect()
      const range = Math.max(1, rect.height - window.innerHeight)
      return Math.min(1, Math.max(0, -rect.top / range))
    }

    const updateTargetProgress = () => {
      targetProgressRef.current = getScrollProgress()
    }

    const tick = (time) => {
      updateTargetProgress()

      const count = imagesRef.current.length
      const dt = lastTimeRef.current ? time - lastTimeRef.current : 16
      lastTimeRef.current = time

      const alpha = 1 - Math.exp(-dt / SCROLL_SMOOTHING_MS)
      const nextProgress =
        smoothProgressRef.current +
        (targetProgressRef.current - smoothProgressRef.current) * alpha

      smoothProgressRef.current = nextProgress
      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.0005 ? prev : nextProgress))

      if (count > 0) {
        const frame = Math.round(nextProgress * (count - 1))
        renderFrame(frame)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    let cancelled = false
    imagesRef.current = []
    targetProgressRef.current = getScrollProgress()
    smoothProgressRef.current = targetProgressRef.current
    setProgress(targetProgressRef.current)

    const preload = async () => {
      let consecutiveMisses = 0

      for (let i = 0; i < frameUrls.length; i += 1) {
        if (cancelled) return
        const src = frameUrls[i]

        const img = await new Promise((resolve) => {
          const image = new Image()
          image.decoding = 'async'
          image.onload = () => resolve(image)
          image.onerror = () => resolve(null)
          image.src = src
        })

        if (!img) {
          consecutiveMisses += 1
          if (imagesRef.current.length > 0 && consecutiveMisses >= MAX_CONSECUTIVE_MISSES) {
            break
          }
          continue
        }

        consecutiveMisses = 0
        imagesRef.current.push(img)
        if (imagesRef.current.length === 1) renderFrame(0)
      }
    }

    preload()
    tick()
    const onResize = () => {
      targetProgressRef.current = getScrollProgress()
      smoothProgressRef.current = targetProgressRef.current

      const count = imagesRef.current.length
      if (count > 0) {
        const frame = Math.round(smoothProgressRef.current * (count - 1))
        renderFrame(frame)
      }
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [frameUrls, product])

  if (!product) {
    return <Navigate to="/products" replace />
  }

  if (product.externalUrl) {
    return (
      <main className="meso-page">
        <div className="container" style={{ padding: '4.5rem 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem' }}>
            Redirecting to the manufacturer product page for {product.name}…
          </p>
        </div>
      </main>
    )
  }

  const { name, hero, beats, info } = product

  return (
    <main className="meso-page">
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

          <div className={`meso-copy meso-copy--right${activeBeat === 'intro' ? ' is-active' : ''}`}>
            <p className="meso-kicker">{beats.intro.kicker}</p>
            <h1>{beats.intro.heading}</h1>
            <p className="meso-sub">{beats.intro.sub}</p>
          </div>

          <div className={`meso-copy meso-copy--left${activeBeat === 'engineering' ? ' is-active' : ''}`}>
            <p className="meso-kicker">{beats.engineering.kicker}</p>
            <h2>{beats.engineering.heading}</h2>
            <p>{beats.engineering.text}</p>
          </div>

          <div className={`meso-copy meso-copy--right${activeBeat === 'control' ? ' is-active' : ''}`}>
            <p className="meso-kicker">{beats.control.kicker}</p>
            <h2>{beats.control.heading}</h2>
            <p>{beats.control.text}</p>
          </div>

          <div className={`meso-copy meso-copy--left${activeBeat === 'performance' ? ' is-active' : ''}`}>
            <p className="meso-kicker">{beats.performance.kicker}</p>
            <h2>{beats.performance.heading}</h2>
            <p>{beats.performance.text}</p>
          </div>

          <div className={`meso-copy meso-copy--left meso-copy--final${activeBeat === 'final' ? ' is-active' : ''}`}>
            <p className="meso-kicker">{beats.final.kicker}</p>
            <h2>{beats.final.heading}</h2>
            <p>{beats.final.text}</p>
            <div className="meso-final-actions">
              <a href="#buy" className="meso-cta">
                Configure {name}
              </a>
              <Link to="/contact" className="meso-link">
                Talk to an application specialist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="technology" className="meso-info">
        <div className="container meso-info-grid">
          {info.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
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
            <Link to="/contact" className="meso-cta">
              Request Technical Consultation
            </Link>
            <Link to="/products" className="meso-link">
              Back to Product Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
