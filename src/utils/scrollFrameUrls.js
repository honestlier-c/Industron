/**
 * Build ordered frame URLs for scroll-sequence product pages.
 *
 * naming:
 *   ezgif       → ezgif-frame-001.jpg (1-based, 3-digit)
 *   indexed-png → frame_000000.png (0-based, 6-digit)
 */

export function sampleFrameIndices(sourceCount, playbackCount) {
  if (sourceCount <= 0) return []
  if (playbackCount <= 1) return [0]
  const max = sourceCount - 1
  return Array.from({ length: playbackCount }, (_, i) =>
    Math.round((i / (playbackCount - 1)) * max),
  )
}

function framePath(framesFolder, index, naming) {
  if (naming === 'indexed-png') {
    return `${framesFolder}/frame_${String(index).padStart(6, '0')}.png`
  }
  const id = String(index + 1).padStart(3, '0')
  return `${framesFolder}/ezgif-frame-${id}.jpg`
}

export function buildScrollFrameUrls({
  framesFolder,
  frameCount,
  frameNaming = 'ezgif',
  sourceFrameCount,
  playbackFrameCount,
}) {
  const source = sourceFrameCount ?? frameCount
  const playback = playbackFrameCount ?? frameCount
  const indices =
    source !== playback
      ? sampleFrameIndices(source, playback)
      : Array.from({ length: playback }, (_, i) => i)

  return indices.map((index) => framePath(framesFolder, index, frameNaming))
}

export function scaleScrollBeats(beats, fromCount, toCount) {
  if (fromCount === toCount) return beats
  const ratio = toCount / fromCount
  return beats.map((beat) => ({
    key: beat.key,
    start: Math.max(1, Math.round(beat.start * ratio)),
    end: beat.end === null ? null : Math.round(beat.end * ratio),
  }))
}
