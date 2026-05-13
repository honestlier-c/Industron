import { useEffect, useRef } from 'react'
import { progressToFrameIndex } from '../data/scrollBeats'

const MAX_CONSECUTIVE_MISSES = 6
const PRELOAD_CONCURRENCY = 6

/** Preload in frame order 0…n-1 so playback never jumps ahead. */
function sequentialIndices(total) {
  return Array.from({ length: total }, (_, i) => i)
}

function nearestLoadedIndex(images, target) {
  if (!images.length) return 0
  const max = images.length - 1
  const t = Math.min(max, Math.max(0, target))
  if (images[t]?.complete && images[t].naturalWidth > 0) return t
  for (let i = t; i >= 0; i -= 1) {
    if (images[i]?.complete && images[i].naturalWidth > 0) return i
  }
  for (let i = 0; i <= max; i += 1) {
    if (images[i]?.complete && images[i].naturalWidth > 0) return i
  }
  return 0
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

/**
 * Scroll-synced JPEG sequence — tied directly to scroll position (no artificial lag).
 */
export function useScrollSequence({
  sectionRef,
  canvasRef,
  frameUrls,
  enabled,
  progressMotion,
}) {
  const imagesRef = useRef([])
  const rafRef = useRef(0)
  const visibleRef = useRef(false)
  const lastRenderedFrameRef = useRef(-1)
  const totalSourceFrames = frameUrls.length

  useEffect(() => {
    if (!enabled) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const resolveFrameIndex = (progress) =>
      progressToFrameIndex(progress, totalSourceFrames)

    const renderFrame = (index, force = false) => {
      const loaded = nearestLoadedIndex(imagesRef.current, index)
      const img = imagesRef.current[loaded]
      if (!img?.complete || img.naturalWidth === 0) return

      const targetW = canvas.clientWidth || window.innerWidth
      const targetH = canvas.clientHeight || window.innerHeight
      const isMobile = window.innerWidth <= 760
      const dpr = Math.min(isMobile ? 1.2 : 1.6, window.devicePixelRatio || 1)
      const width = Math.floor(targetW * dpr)
      const height = Math.floor(targetH * dpr)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      if (!force && lastRenderedFrameRef.current === loaded) return

      const containScale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight)
      const coverScale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight)
      const frameAspect = img.naturalWidth / img.naturalHeight
      const isWide16x9 = frameAspect > 1.7 && frameAspect < 1.85
      const scale =
        isMobile && isWide16x9
          ? containScale + (coverScale - containScale) * 0.32
          : containScale
      const drawW = img.naturalWidth * scale
      const drawH = img.naturalHeight * scale
      const dx = (targetW - drawW) * 0.5
      const dy = (targetH - drawH) * (isMobile && isWide16x9 ? 0.53 : 0.5)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, targetW, targetH)
      ctx.drawImage(img, dx, dy, drawW, drawH)
      lastRenderedFrameRef.current = loaded
    }

    const getScrollProgress = () => {
      const section = sectionRef.current
      if (!section) return 0
      const rect = section.getBoundingClientRect()
      const range = Math.max(1, rect.height - window.innerHeight)
      return Math.min(1, Math.max(0, -rect.top / range))
    }

    const sync = (force = false) => {
      const progress = getScrollProgress()
      progressMotion?.set(progress)
      renderFrame(resolveFrameIndex(progress), force)
    }

    const scheduleSync = (force = false) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (visibleRef.current || force) sync(force)
      })
    }

    let cancelled = false
    imagesRef.current = new Array(totalSourceFrames).fill(null)
    lastRenderedFrameRef.current = -1

    const preload = async () => {
      const order = sequentialIndices(totalSourceFrames)
      let next = 0
      let misses = 0

      const worker = async () => {
        while (!cancelled) {
          const orderIdx = next
          next += 1
          if (orderIdx >= order.length) break

          const i = order[orderIdx]
          const img = await loadImage(frameUrls[i])
          if (cancelled) return
          if (!img) {
            misses += 1
            if (misses >= MAX_CONSECUTIVE_MISSES && imagesRef.current.some(Boolean)) return
            continue
          }
          misses = 0
          imagesRef.current[i] = img
          if (visibleRef.current) scheduleSync()
        }
      }

      await Promise.all(
        Array.from({ length: PRELOAD_CONCURRENCY }, () => worker()),
      )
    }

    preload()
    sync(true)

    const onScroll = () => scheduleSync()
    const onResize = () => sync(true)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) scheduleSync(true)
      },
      { root: null, threshold: 0, rootMargin: '100px 0px' },
    )
    if (sectionRef.current) io.observe(sectionRef.current)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      io.disconnect()
    }
  }, [frameUrls, enabled, sectionRef, canvasRef, progressMotion, totalSourceFrames])

  return {}
}
