/**
 * Beat ranges control TEXT only (when copy fades in).
 * Frames always scrub linearly 1 → totalFrames — nothing is skipped.
 */
export const DEFAULT_SCROLL_BEATS = [
  { key: 'intro',       start: 1,  end: 8 },
  { key: 'engineering', start: 14, end: 22 },
  { key: 'control',     start: 26, end: 35 },
  { key: 'performance', start: 48, end: 55 },
  { key: 'final',       start: 57, end: null },
]

/** Scroll progress (0–1) → frame index (0-based). Every frame gets scroll space. */
export function progressToFrameIndex(progress, totalFrames) {
  const max = Math.max(0, totalFrames - 1)
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.round(clamped * max)
}

/** Current 1-based frame number from scroll progress. */
export function progressToFrameNumber(progress, totalFrames) {
  return progressToFrameIndex(progress, totalFrames) + 1
}

/** Text opacity — visible only while the current frame is inside this beat's range. */
export function getBeatOpacity(progress, beats, beatKey, totalFrames) {
  const beat = beats.find((b) => b.key === beatKey)
  if (!beat) return 0

  const frame = progressToFrameIndex(progress, totalFrames)
  const start = beat.start - 1
  const end = (beat.end ?? totalFrames) - 1

  if (frame < start || frame > end) return 0

  const span = Math.max(1, end - start)
  const local = (frame - start) / span
  const fade = 0.18
  if (local < fade) return local / fade
  if (local > 1 - fade) return (1 - local) / fade
  return 1
}

/** Which beat (if any) the current frame falls in — for debugging / optional use. */
export function getBeatFromProgress(progress, beats = DEFAULT_SCROLL_BEATS, totalFrames = 64) {
  const frame = progressToFrameIndex(progress, totalFrames)
  for (const beat of beats) {
    const start = beat.start - 1
    const end = (beat.end ?? totalFrames) - 1
    if (frame >= start && frame <= end) return beat.key
  }
  return null
}
