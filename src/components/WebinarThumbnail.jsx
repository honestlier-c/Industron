import { useEffect, useState } from 'react'
import {
  fetchVimeoThumbnailUrl,
  videoProviderFromUrl,
  youtubeThumbnailUrl,
} from '../utils/videoThumbnail'

export default function WebinarThumbnail({ url, title }) {
  const provider = videoProviderFromUrl(url)
  const ytStatic = provider === 'youtube' ? youtubeThumbnailUrl(url) : null
  const [vimeoThumb, setVimeoThumb] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (provider !== 'vimeo') return undefined
    let cancelled = false
    fetchVimeoThumbnailUrl(url)
      .then((t) => {
        if (!cancelled) setVimeoThumb(t)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [provider, url])

  const src = ytStatic || vimeoThumb
  const label = title ? `Watch: ${title}` : 'Watch webinar'

  if (!src || failed) {
    return (
      <div className="webinar-thumb webinar-thumb--placeholder" aria-hidden="true">
        <span className="webinar-thumb-play" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="webinar-thumb">
      <img src={src} alt="" loading="lazy" decoding="async" />
      <span className="webinar-thumb-play" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
