import { useEffect, useRef } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export default function FuturisticWaveDots({ className }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const stateRef = useRef({
    t: 0,
    w: 0,
    h: 0,
    dpr: 1,
    dots: [],
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = prefersReducedMotion()

    const rebuild = () => {
      const parent = canvas.parentElement
      const rect = parent ? parent.getBoundingClientRect() : { width: 0, height: 0 }
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1))

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const density = w < 720 ? 0.75 : 1
      const stepX = Math.max(22, Math.floor(26 / density))
      const stepY = Math.max(22, Math.floor(26 / density))

      // Perspective-ish mapping: compress y spacing near top, expand near bottom
      const dots = []
      for (let y = 0; y <= h; y += stepY) {
        const yn = y / h
        const persp = 0.55 + yn * 0.75
        const rowStepX = Math.max(18, Math.floor(stepX * persp))
        const xOffset = (y / stepY) % 2 === 0 ? 0 : rowStepX * 0.5
        for (let x = -rowStepX; x <= w + rowStepX; x += rowStepX) {
          dots.push({
            x: x + xOffset,
            y,
            base: 0.15 + yn * 0.55,
            phase: (x * 0.012) + (y * 0.02),
          })
        }
      }

      stateRef.current.w = w
      stateRef.current.h = h
      stateRef.current.dpr = dpr
      stateRef.current.dots = dots
    }

    const draw = () => {
      const s = stateRef.current
      const { w, h, dots } = s

      ctx.clearRect(0, 0, w, h)

      // Soft vignette for depth
      const g = ctx.createRadialGradient(w * 0.5, h * 0.4, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.65)
      g.addColorStop(0, 'rgba(37, 99, 235, 0.05)')
      g.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      const t = reduce ? 0 : s.t
      const amp = reduce ? 0 : Math.max(7, Math.min(14, w * 0.012))

      for (const d of dots) {
        const yn = d.y / h
        const wave = Math.sin(d.phase + t) * (amp * (0.35 + yn * 0.9))
        const y = d.y + wave

        // Dot size increases subtly towards bottom for depth
        const r = 0.75 + yn * 1.35
        const alpha = 0.08 + d.base

        // Color blend: cyan ↔ blue ↔ purple
        const hue = 205 + Math.sin(d.phase * 0.9 + t * 0.6) * 18 + yn * 10
        ctx.beginPath()
        ctx.fillStyle = `hsla(${hue}, 86%, 56%, ${alpha})`
        ctx.arc(d.x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduce) {
        s.t += 0.012
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    rebuild()
    draw()

    const ro = new ResizeObserver(() => {
      rebuild()
      if (reduce) draw()
    })
    const parent = canvas.parentElement
    if (parent) ro.observe(parent)

    // Pause the RAF loop when the canvas is completely out of the viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reduce) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(draw)
          }
        } else {
          cancelAnimationFrame(rafRef.current)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else if (!reduce) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

