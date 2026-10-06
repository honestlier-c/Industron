const vimeoThumbCache = new Map()

/** @returns {'youtube' | 'vimeo' | null} */
export function videoProviderFromUrl(url) {
  const u = String(url || '')
  if (/youtube\.com|youtu\.be/i.test(u)) return 'youtube'
  if (/vimeo\.com/i.test(u)) return 'vimeo'
  return null
}

/** @returns {string | null} */
export function youtubeVideoId(url) {
  const u = String(url || '')
  const watch = u.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watch) return watch[1]
  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (short) return short[1]
  const embed = u.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embed) return embed[1]
  return null
}

/** @returns {string | null} */
export function vimeoVideoId(url) {
  const m = String(url || '').match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}

/** Static YouTube preview (no API). */
export function youtubeThumbnailUrl(url, quality = 'hqdefault') {
  const id = youtubeVideoId(url)
  if (!id) return null
  const allowed = ['default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault']
  const q = allowed.includes(quality) ? quality : 'hqdefault'
  return `https://img.youtube.com/vi/${id}/${q}.jpg`
}

/** Fetch Vimeo thumbnail via public oEmbed (thumbnail only). */
export async function fetchVimeoThumbnailUrl(url) {
  const cached = vimeoThumbCache.get(url)
  if (cached) return cached

  const res = await fetch(
    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  )
  if (!res.ok) throw new Error('Vimeo oEmbed failed')
  const data = await res.json()
  const thumb = data.thumbnail_url || null
  if (thumb) vimeoThumbCache.set(url, thumb)
  return thumb
}
