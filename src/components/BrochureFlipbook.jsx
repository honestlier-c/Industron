import { useEffect, useRef, useState } from 'react'

/**
 * Mobile brochure flipbook: scroll through a sticky stage and pages flip
 * like a notepad (tear from the top). When scrolling stops at ≥50% of a
 * turn, snaps to the next page; under 50% keeps the mid-flip in place.
 */
export default function BrochureFlipbook({ url, title = 'Brochure' }) {
  const [pages, setPages] = useState([])
  const [page, setPage] = useState(0)
  const [flip, setFlip] = useState(0)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const trackRef = useRef(null)
  const pageRef = useRef(0)
  const flipRef = useRef(0)
  const rafRef = useRef(0)
  const snapTimer = useRef(0)
  const snapping = useRef(false)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setPages([])
    setPage(0)
    setFlip(0)
    setError('')
    pageRef.current = 0
    flipRef.current = 0

    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        const workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

        const doc = await pdfjs.getDocument(url).promise
        const rendered = []
        const maxEdge = typeof window !== 'undefined' && window.innerWidth < 720 ? 1100 : 1400

        for (let i = 1; i <= doc.numPages; i += 1) {
          const pdfPage = await doc.getPage(i)
          const base = pdfPage.getViewport({ scale: 1 })
          const scale = Math.min(maxEdge / base.width, maxEdge / base.height, 2.2)
          const viewport = pdfPage.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          await pdfPage.render({
            canvasContext: canvas.getContext('2d', { alpha: false }),
            viewport,
          }).promise
          rendered.push(canvas.toDataURL('image/jpeg', 0.88))
          if (cancelled) return
        }

        if (!cancelled) {
          setPages(rendered)
          setStatus('ready')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to open brochure')
          setStatus('error')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [url])

  useEffect(() => {
    if (status !== 'ready' || pages.length < 2) return undefined

    const track = trackRef.current
    if (!track) return undefined

    const steps = pages.length - 1

    const readExact = () => {
      const rect = track.getBoundingClientRect()
      const totalScroll = track.offsetHeight - window.innerHeight
      if (totalScroll <= 0) return { exact: 0, totalScroll: 0, trackTop: 0 }
      const scrolled = Math.min(Math.max(-rect.top, 0), totalScroll)
      const exact = (scrolled / totalScroll) * steps
      const trackTop = window.scrollY + rect.top
      return { exact, totalScroll, trackTop }
    }

    const applyExact = (exact) => {
      const index = Math.min(steps, Math.max(0, Math.floor(exact + 1e-6)))
      const local = exact - index
      const angle = local < 0.02 ? 0 : Math.min(1, local)

      if (index !== pageRef.current) {
        pageRef.current = index
        setPage(index)
      }
      if (Math.abs(angle - flipRef.current) > 0.004) {
        flipRef.current = angle
        setFlip(angle)
      }
    }

    const scrollToIndex = (targetIndex) => {
      const { totalScroll, trackTop } = readExact()
      if (totalScroll <= 0) return
      const target = Math.min(steps, Math.max(0, targetIndex))
      const y = trackTop + (target / steps) * totalScroll
      snapping.current = true
      window.scrollTo({ top: y, behavior: 'smooth' })

      // Settle UI to a clean page as soon as we commit the snap
      pageRef.current = target
      flipRef.current = 0
      setPage(target)
      setFlip(0)

      window.clearTimeout(snapTimer.current)
      snapTimer.current = window.setTimeout(() => {
        snapping.current = false
        applyExact(readExact().exact)
      }, 420)
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0
        if (snapping.current) return

        const { exact } = readExact()
        applyExact(exact)

        // After scroll pauses: ≥50% completes to the next page;
        // under 50% keeps the current mid-flip (no snap-back).
        window.clearTimeout(snapTimer.current)
        snapTimer.current = window.setTimeout(() => {
          if (snapping.current) return
          const current = readExact().exact
          const index = Math.floor(current + 1e-6)
          const local = current - index
          if (local >= 0.5 && index < steps) {
            scrollToIndex(index + 1)
          }
        }, 110)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(snapTimer.current)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [status, pages.length])

  if (status === 'loading') {
    return (
      <div className="brochure-flip brochure-flip--full" aria-busy="true">
        <p className="brochure-flip-status">Opening brochure…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="brochure-flip brochure-flip--full brochure-flip--error">
        <p className="brochure-flip-status">Couldn’t preview the brochure.</p>
        <p className="brochure-flip-hint">{error}</p>
        <a className="brochure-flip-download" href={url} target="_blank" rel="noreferrer">
          Open PDF instead
        </a>
      </div>
    )
  }

  const total = pages.length
  const nextIndex = Math.min(total - 1, page + 1)
  const label = `${title} — page ${page + 1} of ${total}`
  const trackVh = Math.max(100, 100 + (total - 1) * 78)

  // Notepad tear: page lifts from the top edge (rotateX), next page underneath
  const rotate = flip * 90
  const opacity = 1 +flip * 0.7
  const lift = flip * 8
  const showNext = flip > 0.06 && nextIndex !== page

  return (
    <div
      ref={trackRef}
      className="brochure-flip brochure-flip--scroll brochure-flip--full brochure-flip--notepad"
      style={{ '--brochure-track-vh': `${trackVh}vh` }}
    >
      <div className="brochure-flip-sticky">
        <div className="brochure-flip-stage" role="img" aria-label={label}>
          {showNext && (
            <div className="brochure-flip-page brochure-flip-page--under">
              <img src={pages[nextIndex]} alt="" draggable={false} />
            </div>
          )}
          <div
            className="brochure-flip-page brochure-flip-page--front"
            style={{
              transform: `translateY(${-lift}%) rotateX(${rotate}deg)`,
              opacity,
            }}
          >
            <img src={pages[page]} alt={label} draggable={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
