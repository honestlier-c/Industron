/**
 * Offline in-browser LLM via WebLLM (MLC).
 *
 * Two-stage loading so chat feels fast *and* answers well:
 *   1. FAST tier  — small quantised model, ready in seconds.
 *   2. SMART tier — bigger model downloaded in the background, then swapped in.
 *
 * Site RAG supplies the facts; the model only does the wording.
 * Falls back to the knowledge engine when WebGPU is unavailable.
 */

/** Quick to download, keeps replies flowing while the smart model arrives. */
export const FAST_MODEL_ID = 'SmolLM2-360M-Instruct-q4f16_1-MLC'

/** Noticeably better reasoning / phrasing; ~880 MB VRAM. */
export const SMART_MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC'

/** Best phrasing for capable machines; only used when the GPU has room. */
export const PRO_MODEL_ID = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC'

export const OFFLINE_MODEL_ID = FAST_MODEL_ID
export const OFFLINE_MODEL_LABEL = 'NanoGuide (offline)'

const TIER_LABELS = {
  [FAST_MODEL_ID]: 'quick',
  [SMART_MODEL_ID]: 'smart',
  [PRO_MODEL_ID]: 'pro',
}

let enginePromise = null
let engine = null
let activeModelId = null
let upgradePromise = null
let upgradeDone = false
let loadProgress = { progress: 0, text: 'Idle' }
let listeners = new Set()
let warmupScheduled = false
let cacheChecked = false
let modelCached = false
let gpuBudgetMb = null

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
    modelId: activeModelId || FAST_MODEL_ID,
    modelLabel: OFFLINE_MODEL_LABEL,
    tier: TIER_LABELS[activeModelId] || null,
    upgrading: Boolean(upgradePromise),
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

/** Metered / slow links: stay on the small model. */
function isFrugalConnection() {
  if (typeof navigator === 'undefined') return false
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (!conn) return false
  if (conn.saveData) return true
  return /(^|-)2g$/.test(String(conn.effectiveType || ''))
}

/** Usable GPU memory estimate (MB) from the WebGPU adapter limits. */
async function getGpuBudgetMb() {
  if (gpuBudgetMb !== null) return gpuBudgetMb
  gpuBudgetMb = 0
  try {
    const adapter = await navigator.gpu.requestAdapter()
    const bytes = adapter?.limits?.maxBufferSize || 0
    gpuBudgetMb = bytes ? Math.round(bytes / (1024 * 1024)) : 0
  } catch {
    gpuBudgetMb = 0
  }
  return gpuBudgetMb
}

/**
 * Pick the best model the machine can host comfortably.
 * Conservative on purpose: a model that fails to load is worse than a small one.
 * `deviceMemory` is absent in some browsers, so unknown means "don't block".
 */
async function pickUpgradeModelId() {
  if (isFrugalConnection()) return null

  const budget = await getGpuBudgetMb()
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 0 : 0
  const ram = typeof navigator !== 'undefined' ? navigator.deviceMemory : undefined
  const ramOk = (min) => ram === undefined || ram >= min

  if (budget >= 2600 && cores >= 8 && ramOk(8)) return PRO_MODEL_ID
  if (budget >= 1200 && cores >= 4 && ramOk(4)) return SMART_MODEL_ID
  return null
}

async function isCached(modelId) {
  try {
    const { hasModelInCache } = await import('@mlc-ai/web-llm')
    return Boolean(await hasModelInCache(modelId))
  } catch {
    return false
  }
}

/** True when any tier is already in the browser cache (near-instant warm). */
export async function checkModelCached() {
  if (cacheChecked) return modelCached
  cacheChecked = true
  if (!isWebGpuAvailable()) {
    modelCached = false
    return false
  }
  const tiers = await Promise.all([
    isCached(SMART_MODEL_ID),
    isCached(PRO_MODEL_ID),
    isCached(FAST_MODEL_ID),
  ])
  modelCached = tiers.some(Boolean)
  notify()
  return modelCached
}

/** Skip the small model entirely when a better one is already cached. */
async function pickStartupModelId() {
  if (await isCached(PRO_MODEL_ID)) return PRO_MODEL_ID
  if (await isCached(SMART_MODEL_ID)) return SMART_MODEL_ID
  return FAST_MODEL_ID
}

async function createEngine(modelId, { label, onProgress } = {}) {
  const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
  return CreateMLCEngine(modelId, {
    initProgressCallback: (report) => {
      loadProgress = {
        progress: report.progress ?? 0,
        text: report.text || label || 'Loading model…',
      }
      notify()
      onProgress?.(loadProgress)
    },
  })
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
    const startupModelId = await pickStartupModelId()
    const warm = await isCached(startupModelId)

    loadProgress = {
      progress: 0.01,
      text: warm ? 'Starting NanoGuide…' : 'Preparing NanoGuide…',
    }
    notify()

    const created = await createEngine(startupModelId, {
      label: warm ? 'Loading cached model…' : 'Downloading model…',
      onProgress,
    })

    engine = created
    activeModelId = startupModelId
    modelCached = true
    upgradeDone = startupModelId !== FAST_MODEL_ID
    loadProgress = { progress: 1, text: 'NanoGuide ready' }
    notify()

    // Better model arrives quietly in the background.
    scheduleModelUpgrade()
    return engine
  })().catch((err) => {
    enginePromise = null
    engine = null
    activeModelId = null
    loadProgress = { progress: 0, text: err?.message || 'Failed to load offline LLM' }
    notify()
    throw err
  })

  return enginePromise
}

/**
 * Swap the quick model for a stronger one once it has downloaded.
 * Replies keep working on the current engine throughout.
 */
export function scheduleModelUpgrade() {
  if (upgradeDone || upgradePromise || !engine) return
  if (!shouldAutoLoadModel()) return

  upgradePromise = (async () => {
    const targetId = await pickUpgradeModelId()
    if (!targetId || targetId === activeModelId) {
      upgradeDone = true
      return
    }

    const upgraded = await createEngine(targetId, { label: 'Improving answers…' })
    const previous = engine

    engine = upgraded
    activeModelId = targetId
    upgradeDone = true
    loadProgress = { progress: 1, text: 'NanoGuide ready' }

    try {
      await previous?.unload?.()
    } catch {
      /* old engine will be garbage collected */
    }
  })()
    .catch(() => {
      // Keep serving answers with the model we already have.
      upgradeDone = true
    })
    .finally(() => {
      upgradePromise = null
      notify()
    })
}

/**
 * Background warm-up — never blocks chat or first paint.
 * Starts on site load (desktop + WebGPU): downloads the small model on first
 * visit after idle, or warms from cache on return visits.
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

    // First visit: wait a bit so the page can paint, then download in the background.
    // Return visit / chat-open: start sooner from cache or continue download.
    const delayMs = preferSoon ? 0 : cached ? 300 : 2500

    const kick = () => {
      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => start(), { timeout: preferSoon ? 2000 : 8000 })
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

/** Call on chat FAB hover / open — start / resume model load immediately. */
export function prefetchOfflineLlm() {
  if (!shouldAutoLoadModel()) return
  if (engine || enginePromise) return
  warmupScheduled = true
  ensureOfflineLlm().catch(() => {})
}

/**
 * Stream a chat completion. Yields text deltas.
 *
 * Sampling defaults lean conversational: enough temperature to sound human,
 * with repetition penalties so short answers don't loop the same phrase.
 *
 * @param {{ role: string, content: string }[]} messages
 * @param {{ temperature?: number, maxTokens?: number, topP?: number, signal?: AbortSignal }} [opts]
 */
export async function* streamOfflineChat(messages, opts = {}) {
  const llm = await ensureOfflineLlm()
  const stream = await llm.chat.completions.create({
    messages,
    stream: true,
    temperature: opts.temperature ?? 0.55,
    top_p: opts.topP ?? 0.9,
    frequency_penalty: opts.frequencyPenalty ?? 0.35,
    presence_penalty: opts.presencePenalty ?? 0.2,
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
