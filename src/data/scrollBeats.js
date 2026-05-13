/**
 * Default scroll-sync beat → frame ranges (1-based frame numbers).
 * Used by all products with a JPEG scroll sequence unless overridden per product.
 */
export const DEFAULT_SCROLL_BEATS = [
  { key: 'intro',       start: 1,  end: 8 },
  { key: 'engineering', start: 14, end: 22 },
  { key: 'control',     start: 26, end: 35 },
  { key: 'performance', start: 48, end: 55 },
  { key: 'final',       start: 57, end: null },
]

/** Active beat key from overall scroll progress (0–1), split into equal segments. */
export function getBeatFromProgress(progress, beats = DEFAULT_SCROLL_BEATS) {
  const n = beats.length
  const clamped = Math.min(1, Math.max(0, progress))
  if (clamped >= 1) return beats[n - 1].key
  const idx = Math.min(n - 1, Math.floor(clamped * n))
  return beats[idx].key
}

/** Opacity for a beat panel — smooth fade in/out within each scroll segment (0–1). */
export function getBeatOpacity(progress, beats, beatKey) {
  const n = beats.length
  const idx = beats.findIndex((b) => b.key === beatKey)
  if (idx < 0) return 0

  const segSize = 1 / n
  const segStart = idx * segSize
  const local = (progress - segStart) / segSize

  if (local <= 0 || local >= 1) return 0

  const fade = 0.28
  if (local < fade) return local / fade
  if (local > 1 - fade) return (1 - local) / fade
  return 1
}

/** Map scroll progress (0–1) to a loaded-frame array index using beat frame ranges. */
export function progressToFrameIndex(progress, beats, totalFrames) {
  const n = beats.length
  const clamped = Math.min(1, Math.max(0, progress))
  const scaled = clamped * n
  const idx = Math.min(n - 1, Math.floor(scaled))
  const localT = scaled - idx
  const beat = beats[idx]
  const start = beat.start - 1
  const end = (beat.end ?? totalFrames) - 1
  return Math.round(start + localT * Math.max(0, end - start))
}
