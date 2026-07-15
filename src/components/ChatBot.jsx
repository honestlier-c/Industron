import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { answerWithBestEngine, getWelcomeMessage } from '../utils/chatEngine'
import {
  ensureOfflineLlm,
  getOfflineLlmStatus,
  isWebGpuAvailable,
  subscribeOfflineLlm,
} from '../utils/offlineLlm'

function renderRichText(text) {
  const parts = []
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\n)/g
  let last = 0
  let match
  let key = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={key++}>{text.slice(last, match.index)}</span>)
    }
    const token = match[0]
    if (token === '\n') {
      parts.push(<br key={key++} />)
    } else if (token.startsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (m) {
        const [, label, href] = m
        if (href.startsWith('/')) {
          parts.push(
            <Link key={key++} to={href} className="chatbot-link">
              {label}
            </Link>,
          )
        } else {
          parts.push(
            <a key={key++} href={href} className="chatbot-link" target="_blank" rel="noreferrer">
              {label}
            </a>,
          )
        }
      }
    }
    last = match.index + token.length
  }
  if (last < text.length) parts.push(<span key={key++}>{text.slice(last)}</span>)
  return parts
}

function SupportAvatar() {
  return (
    <div className="chatbot-avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path
          d="M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7c-1.1 0-2.2-.3-3.1-.7L5 19l1.2-2.9C5.4 14.9 5 13.5 5 12Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="9.2" cy="12" r="0.9" fill="currentColor" />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" />
        <circle cx="14.8" cy="12" r="0.9" fill="currentColor" />
      </svg>
    </div>
  )
}

export default function ChatBot() {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [llmStatus, setLlmStatus] = useState(() => getOfflineLlmStatus())
  const [messages, setMessages] = useState(() => {
    const welcome = getWelcomeMessage()
    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: welcome.text,
        suggestions: welcome.suggestions,
      },
    ]
  })
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)
  const bootstrapped = useRef(false)

  useEffect(() => subscribeOfflineLlm(setLlmStatus), [])

  /* Start downloading the enhanced engine automatically as soon as the page
     loads (where WebGPU exists). It's non-blocking: every message is answered
     instantly from the built-in offline knowledge base while the model
     downloads, and the enhanced engine takes over once it's ready. */
  useEffect(() => {
    if (bootstrapped.current) return undefined
    bootstrapped.current = true
    if (isWebGpuAvailable()) {
      ensureOfflineLlm().catch(() => {})
    }
    return undefined
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const t = window.setTimeout(() => inputRef.current?.focus(), 180)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, busy, open])

  useEffect(() => () => {
    abortRef.current?.abort()
  }, [])

  const ask = async (raw) => {
    const text = String(raw || '').trim()
    if (!text || busy) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const history = messages.filter((m) => m.role === 'user' || m.role === 'assistant')
    const userId = `u-${Date.now()}`
    const assistantId = `a-${Date.now()}`

    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, suggestions: undefined })),
      { id: userId, role: 'user', text },
      { id: assistantId, role: 'assistant', text: '', streaming: true },
    ])
    setInput('')
    setBusy(true)

    try {
      const reply = await answerWithBestEngine(text, history, {
        preferLlm: true,
        signal: controller.signal,
        onToken: (partial) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: partial, streaming: true } : m)),
          )
        },
      })

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: reply.text,
                suggestions: reply.suggestions,
                streaming: false,
                mode: reply.mode,
                notice: reply.notice
                  ? 'Having trouble connecting — sharing the best info we have.'
                  : undefined,
              }
            : m,
        ),
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: err?.message || 'Something went wrong. Please try again.',
                streaming: false,
              }
            : m,
        ),
      )
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="chatbot-root">
      <AnimatePresence>
        {open && (
          <motion.section
            id={panelId}
            className="chatbot-panel"
            role="dialog"
            aria-label="Industron support chat"
            aria-modal="false"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="chatbot-header">
              <div className="chatbot-header-main">
                <SupportAvatar />
                <div>
                  <p className="chatbot-title">Industron Support</p>
                  <p className="chatbot-status">
                    <span className={`chatbot-status-dot ${llmStatus.ready ? 'chatbot-status-dot--llm' : ''}`} />
                    {llmStatus.ready ? (
                      <span className="chatbot-status-badge">Online</span>
                    ) : (
                      'Online'
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="chatbot-icon-btn"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </header>

            <div className="chatbot-messages" ref={listRef}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`chatbot-bubble-row chatbot-bubble-row--${m.role}`}
                >
                  {m.role === 'assistant' && <SupportAvatar />}
                  <div className={`chatbot-bubble chatbot-bubble--${m.role}`}>
                    {m.text ? (
                      <div className="chatbot-bubble-text">
                        {renderRichText(m.text)}
                        {m.streaming && <span className="chatbot-caret" aria-hidden="true" />}
                      </div>
                    ) : (
                      <div className="chatbot-typing" aria-live="polite">
                        <span /><span /><span />
                      </div>
                    )}
                    {m.notice && <p className="chatbot-notice">{m.notice}</p>}
                    {m.suggestions?.length > 0 && (
                      <div className="chatbot-suggestions">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="chatbot-chip"
                            onClick={() => ask(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form className="chatbot-composer" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="chatbot-input">
                Type your message
              </label>
              <input
                id="chatbot-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, testing, or contact…"
                autoComplete="off"
                disabled={busy}
              />
              <button type="submit" className="chatbot-send" disabled={busy || !input.trim()} aria-label="Send message">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`chatbot-fab ${open ? 'chatbot-fab--open' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        {open ? (
          <span aria-hidden="true">✕</span>
        ) : (
          <>
            <SupportAvatar />
            <span className="chatbot-fab-label">Chat</span>
          </>
        )}
      </motion.button>
    </div>
  )
}
