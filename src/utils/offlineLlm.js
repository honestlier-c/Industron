/**
 * Offline in-browser LLM via WebLLM (MLC).
 * Tiny instruct model + site RAG → natural answers without blocking chat.
 * Falls back gracefully when WebGPU is unavailable.
 */

/**
 * SmolLM2-135M — smallest solid instruct model in WebLLM (~360 MB VRAM).
 * Fast first download; chat stays instant from the knowledge base meanwhile.
 */
export const OFFLINE_MODEL_ID = 'SmolLM2-135M-Instruct-q0f16-MLC'
export const OFFLINE_MODEL_LABEL = 'SmolLM2 135M (offline)'

let enginePromise = null
let engine = null
let loadProgress = { progress: 0, text: 'Idle' }
let listeners = new Set()
let warmupScheduled = false
let cacheChecked = false
let modelCached = false

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(getOfflineLlmStatus())
    } catch {
      /* ignore listener errors */
    }
  })
}

export function getOfflineLlmStatus() {
  return {
    ready: Boolean(engine),
    loading: Boolean(enginePromise) && !engine,
    progress: loadProgress.progress,
    text: loadProgress.text,
    modelId: OFFLINE_MODEL_ID,
    modelLabel: OFFLINE_MODEL_LABEL,
    webgpu: typeof navigator !== 'undefined' && Boolean(navigator.gpu),
    cached: modelCached,
  }
}

export function subscribeOfflineLlm(listener) {
  listeners.add(listener)
  listener(getOfflineLlmStatus())
  return () => listeners.delete(listener)
}

export function isWebGpuAvailable() {
  return typeof navigator !== 'undefined' && Boolean(navigator.gpu)
}

/**
 * Rough phone/tablet detection. Used to avoid auto-downloading the model
 * over mobile data — phones still get the instant offline knowledge chat.
 */
export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/Android|iPhone|iPad|iPod|Windows Phone|IEMobile|BlackBerry|Opera Mini/i.test(ua)) {
    return true
  }
  if (/Macintosh/.test(ua) && typeof document !== 'undefined' && 'ontouchend' in document) {
    return true
  }
  return typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1 && /Mobi/i.test(ua)
}

/** Only auto-load the model where it's sensible (WebGPU + not a phone). */
export function shouldAutoLoadModel() {
  return isWebGpuAvailable() && !isMobileDevice()
}

/** True when weights are already in the browser cache (near-instant warm). */
export async function checkModelCached() {
  if (cacheChecked) return modelCached
  cacheChecked = true
  if (!isWebGpuAvailable()) {
    modelCached = false
    return false
  }
  try {
    const { hasModelInCache } = await import('@mlc-ai/web-llm')
    modelCached = Boolean(await hasModelInCache(OFFLINE_MODEL_ID))
  } catch {
    modelCached = false
  }
  notify()
  return modelCached
}

/**
 * Lazily create / reuse the WebLLM engine.
 * First visit downloads weights (then cached); later visits load from cache.
 */
export async function ensureOfflineLlm(onProgress) {
  if (engine) return engine
  if (enginePromise) return enginePromise

  if (!isWebGpuAvailable()) {
    throw new Error('WebGPU is not available in this browser. Use Chrome/Edge 113+ for the offline LLM.')
  }

  enginePromise = (async () => {
    await checkModelCached()
    loadProgress = {
      progress: 0.01,
      text: modelCached ? 'Starting tutor (cached)…' : 'Downloading small tutor model…',
    }
    notify()

    const { CreateMLCEngine } = await import('@mlc-ai/web-llm')

    const created = await CreateMLCEngine(OFFLINE_MODEL_ID, {
      initProgressCallback: (report) => {
        loadProgress = {
          progress: report.progress ?? 0,
          text: report.text || (modelCached ? 'Loading cached model…' : 'Downloading model…'),
        }
        notify()
        onProgress?.(loadProgress)
      },
    })

    engine = created
    modelCached = true
    loadProgress = { progress: 1, text: 'Tutor ready' }
    notify()
    return engine
  })().catch((err) => {
    enginePromise = null
    engine = null
    loadProgress = { progress: 0, text: err?.message || 'Failed to load offline LLM' }
    notify()
    throw err
  })

  return enginePromise
}

/**
 * Background warm-up — never blocks chat.
 * - Cached: warm quickly on idle (return visits feel instant).
 * - First visit: do NOT auto-download on page load (saves bandwidth);
 *   download starts on chat open / FAB hover via prefetchOfflineLlm().
 */
export function scheduleOfflineLlmWarmup(opts = {}) {
  if (engine || enginePromise || warmupScheduled) return
  if (!shouldAutoLoadModel()) return

  warmupScheduled = true
  const preferSoon = Boolean(opts.preferSoon)

  const start = () => {
    ensureOfflineLlm().catch(() => {})
  }

  const run = async () => {
    const cached = await checkModelCached()

    // First visit: skip page-load download unless explicitly asked (chat open).
    if (!cached && !preferSoon) {
      warmupScheduled = false
      return
    }

    const delayMs = preferSoon ? 0 : 300

    const kick = () => {
      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => start(), { timeout: 2000 })
      } else {
        start()
      }
    }

    if (delayMs <= 0) kick()
    else setTimeout(kick, delayMs)
  }

  run().catch(() => {
    warmupScheduled = false
  })
}

/** Call on chat FAB hover / open — starts download only when the user shows intent. */
export function prefetchOfflineLlm() {
  if (!shouldAutoLoadModel()) return
  if (engine || enginePromise) return
  warmupScheduled = true
  ensureOfflineLlm().catch(() => {})
}

/**
 * Stream a chat completion. Yields text deltas.
 * @param {{ role: string, content: string }[]} messages
 * @param {{ temperature?: number, maxTokens?: number, signal?: AbortSignal }} [opts]
 */
export async function* streamOfflineChat(messages, opts = {}) {
  const llm = await ensureOfflineLlm()
  const stream = await llm.chat.completions.create({
    messages,
    stream: true,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.maxTokens ?? 380,
  })

  for await (const chunk of stream) {
    if (opts.signal?.aborted) break
    const delta = chunk.choices?.[0]?.delta?.content
    if (delta) yield delta
  }
}

export async function completeOfflineChat(messages, opts = {}) {
  let out = ''
  for await (const delta of streamOfflineChat(messages, opts)) {
    out += delta
  }
  return out.trim()
}
