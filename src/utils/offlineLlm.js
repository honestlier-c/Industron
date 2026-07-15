/**
 * Offline in-browser LLM via WebLLM (MLC).
 * Default model: Qwen2.5-0.5B-Instruct (q4f16) — ~300 MB weights, fast first-load,
 * 4096 context, coherent when grounded by the site's knowledge base.
 * Falls back gracefully when WebGPU is unavailable.
 */

/** Small, fast-to-download model for offline support chat */
export const OFFLINE_MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC'
export const OFFLINE_MODEL_LABEL = 'Qwen2.5 0.5B (offline)'

let enginePromise = null
let engine = null
let loadProgress = { progress: 0, text: 'Idle' }
let listeners = new Set()

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
 * Lazily create / reuse the WebLLM engine.
 * First load downloads ~0.9GB model (cached in browser for later visits).
 */
export async function ensureOfflineLlm(onProgress) {
  if (engine) return engine
  if (enginePromise) return enginePromise

  if (!isWebGpuAvailable()) {
    throw new Error('WebGPU is not available in this browser. Use Chrome/Edge 113+ for the offline LLM.')
  }

  enginePromise = (async () => {
    loadProgress = { progress: 0.01, text: 'Starting offline LLM…' }
    notify()

    const { CreateMLCEngine } = await import('@mlc-ai/web-llm')

    const created = await CreateMLCEngine(OFFLINE_MODEL_ID, {
      initProgressCallback: (report) => {
        loadProgress = {
          progress: report.progress ?? 0,
          text: report.text || 'Loading model…',
        }
        notify()
        onProgress?.(loadProgress)
      },
    })

    engine = created
    loadProgress = { progress: 1, text: 'Offline LLM ready' }
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
