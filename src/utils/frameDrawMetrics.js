const MOBILE_BREAKPOINT = 760

/**
 * Same geometry as useScrollSequence canvas draw — single source of truth
 * for overlay text position and fluid type scale.
 */
export function computeFrameDrawMetrics(targetW, targetH, img, isMobile = targetW <= MOBILE_BREAKPOINT) {
  if (!img?.naturalWidth || !targetW || !targetH) return null

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

  return {
    targetW,
    targetH,
    drawW,
    drawH,
    dx,
    dy,
    isMobile,
  }
}

/** Push draw rect to .meso-sticky so CSS tracks the painted image bounds. */
export function applyFrameDrawMetrics(stickyEl, metrics) {
  if (!stickyEl || !metrics) return

  const { targetW, targetH, drawW, drawH, dx, dy } = metrics

  stickyEl.style.setProperty('--meso-canvas-w', `${targetW}px`)
  stickyEl.style.setProperty('--meso-canvas-h', `${targetH}px`)
  stickyEl.style.setProperty('--meso-img-w', `${drawW}px`)
  stickyEl.style.setProperty('--meso-img-h', `${drawH}px`)
  stickyEl.style.setProperty('--meso-img-x', `${dx}px`)
  stickyEl.style.setProperty('--meso-img-y', `${dy}px`)
  stickyEl.style.setProperty('--meso-img-w-ratio', String(drawW / targetW))
  stickyEl.style.setProperty('--meso-img-h-ratio', String(drawH / targetH))
  /* Mobile text panel sits below the canvas box (not inside letterbox) */
  stickyEl.style.setProperty(
    '--meso-panel-top',
    metrics.isMobile ? `${targetH}px` : `${dy + drawH}px`,
  )
}

export function getStickyFromCanvas(canvas) {
  return canvas?.parentElement ?? null
}
