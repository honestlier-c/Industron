/**
 * NanoGuide → remote chat API (no offline model / embedded knowledge).
 *
 * Default: http://4.247.143.232:8000
 * Override: VITE_CHAT_API_URL=...
 * Dev: leave VITE_CHAT_API_URL empty to use Vite proxy `/api` → same host
 */

const DEFAULT_CHAT_API = 'http://4.247.143.232:8000'
const envBase = (import.meta.env.VITE_CHAT_API_URL || '').replace(/\/$/, '')
// Production / absolute override: hit the API host directly.
// Dev with empty env: use same-origin `/api/*` (Vite proxy).
const API_BASE = envBase || (import.meta.env.DEV ? '' : DEFAULT_CHAT_API)

function apiUrl(path) {
  return `${API_BASE}${path}`
}

export async function checkChatHealth({ signal } = {}) {
  const res = await fetch(apiUrl('/api/health'), { method: 'GET', signal })
  if (!res.ok) throw new Error(`Health check failed (${res.status})`)
  return res.json()
}

/**
 * @param {{ message: string, history?: { role: string, content: string }[], signal?: AbortSignal }} opts
 * @returns {Promise<{ answer: string, sources?: unknown[] }>}
 */
export async function postChatMessage({ message, history = [], signal } = {}) {
  const res = await fetch(apiUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
    signal,
  })

  if (!res.ok) {
    let detail = ''
    try {
      const errBody = await res.json()
      detail = errBody?.detail || errBody?.error || errBody?.message || ''
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Chat request failed (${res.status})`)
  }

  const data = await res.json()
  return {
    answer: String(data?.answer ?? data?.reply ?? data?.message ?? '').trim(),
    sources: Array.isArray(data?.sources) ? data.sources : [],
  }
}

/** Build API history from UI messages (exclude welcome / empty). */
export function toChatHistory(messages) {
  return messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.id !== 'welcome')
    .filter((m) => String(m.text || '').trim())
    .map((m) => ({
      role: m.role,
      content: String(m.text).trim(),
    }))
}
